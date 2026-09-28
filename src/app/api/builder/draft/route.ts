import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ensureFelacooWebUser } from "@/server/auth/felacoo-identity";
import type { BuilderDocument } from "@/types/builder";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DraftPayload = {
  buildRequestId?: string | null;
  document: BuilderDocument;
  businessName?: string;
  activity?: string;
  location?: string;
};

type BuildRequestRow = {
  id: string;
  assembly: unknown;
  preview: unknown;
  business_name: string;
  activity: string;
  location: string;
  slug: string | null;
  published_url: string | null;
  live_version: number;
  created_at: string;
};

function normalizeBuilderDocument(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function isBuilderDocument(value: unknown): value is BuilderDocument {
  value = normalizeBuilderDocument(value);
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<BuilderDocument>;
  return candidate.version === 1
    && Array.isArray(candidate.pages)
    && candidate.pages.every((page) =>
      Boolean(page)
      && typeof page.id === "string"
      && typeof page.path === "string"
      && typeof page.title === "string"
      && Array.isArray(page.elements),
    );
}

async function getIdentity() {
  const identity = await ensureFelacooWebUser();
  if (!identity) {
    throw new Error("No authenticated Supabase user found.");
  }

  return {
    user: { id: identity.supabaseUserId },
    felacooUserId: identity.felacooUserId,
  };
}
export async function GET(request: Request) {
  try {
    const { user, felacooUserId } = await getIdentity();

    if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });

    if (!felacooUserId) {
      return NextResponse.json(
        { authenticated: true, linked: false, message: "Supabase Auth user is not linked to a Fellacoo user yet." },
        { status: 403 },
      );
    }

    const sql = getDb();
    const requestedId = new URL(request.url).searchParams.get("id")?.trim();
    let rows: BuildRequestRow[];

    if (requestedId) {
      rows = await sql<BuildRequestRow[]>`
        select id, assembly, preview, business_name, activity, location, slug, published_url, live_version, created_at
        from public.build_requests
        where id = ${requestedId} and owner_id = ${felacooUserId}
        limit 1
      `;

      if (!rows[0]) return NextResponse.json({ error: "Builder project was not found." }, { status: 404 });
    } else {
      rows = await sql<BuildRequestRow[]>`
        select id, assembly, preview, business_name, activity, location, slug, published_url, live_version, created_at
        from public.build_requests
        where owner_id = ${felacooUserId}
        order by created_at desc
        limit 1
      `;
    }

    const draft = rows[0] ?? null;

    return NextResponse.json({
      authenticated: true,
      linked: true,
      draft: draft ? {
        id: draft.id,
        document: isBuilderDocument(draft.assembly)
          ? draft.assembly
          : isBuilderDocument(draft.preview)
            ? draft.preview
            : null,
        businessName: draft.business_name,
        activity: draft.activity,
        location: draft.location,
        slug: draft.slug,
        publishedUrl: draft.published_url,
        liveVersion: draft.live_version,
        createdAt: draft.created_at,
      } : null,
    });
  } catch (error) {
    console.error("[builder/draft] GET failed:", error);
    const message = error instanceof Error ? error.message : "Unable to load builder draft.";
    const status = message.includes("No authenticated Supabase user") || message.startsWith("Supabase Auth:")
      ? 401
      : 500;
    return NextResponse.json({ authenticated: false, error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DraftPayload;

    if (!isBuilderDocument(body.document)) {
      return NextResponse.json({ error: "Invalid builder document." }, { status: 400 });
    }

    const { user, felacooUserId } = await getIdentity();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    if (!felacooUserId) {
      return NextResponse.json(
        { error: "Your Supabase Auth user is not linked to a Fellacoo user." },
        { status: 403 },
      );
    }

    const sql = getDb();
    const buildRequestId = body.buildRequestId?.trim() || crypto.randomUUID();
    const documentJson = JSON.stringify(body.document);

    if (body.buildRequestId) {
      const rows = await sql<{ id: string }[]>`
        update public.build_requests
        set assembly = ${sql.json(JSON.parse(JSON.stringify(body.document)))},
            preview = ${sql.json(JSON.parse(JSON.stringify(body.document)))}
        where id = ${buildRequestId} and owner_id = ${felacooUserId}
        returning id
      `;

      if (!rows[0]) {
        return NextResponse.json({ error: "Builder draft was not found for this user." }, { status: 404 });
      }

      return NextResponse.json({ saved: true, buildRequestId });
    }

    const header = body.document.pages[0]?.elements.find((element) => element.type === "header");
    const inferredBusinessName = typeof header?.props.brand === "string"
      ? header.props.brand
      : "Your Business";

    await sql`
      insert into public.build_requests
        (id, business_name, activity, location, status, owner_id, created_at, assembly, preview)
      values
        (${buildRequestId},
         ${body.businessName?.trim() || inferredBusinessName},
         ${body.activity?.trim() || "Website"},
         ${body.location?.trim() || "Online"},
         ${"draft"},
         ${felacooUserId},
         ${new Date().toISOString()},
         ${sql.json(JSON.parse(JSON.stringify(body.document)))},
         ${sql.json(JSON.parse(JSON.stringify(body.document)))})
    `;

    return NextResponse.json({ saved: true, buildRequestId });
  } catch (error) {
    console.error("[builder/draft] POST failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save builder draft." },
      { status: 500 },
    );
  }
}
