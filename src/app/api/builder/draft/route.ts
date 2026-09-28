import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BuilderDocument } from "@/types/builder";

export const dynamic = "force-dynamic";

type DraftPayload = {
  buildRequestId?: string | null;
  document: BuilderDocument;
  businessName?: string;
  activity?: string;
  location?: string;
};

function isBuilderDocument(value: unknown): value is BuilderDocument {
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
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, felacooUserId: null };
  }

  const admin = createAdminClient();
  const { data: link, error: linkError } = await admin
    .from("felacoo_auth_links")
    .select("user_id")
    .eq("supabase_user_id", user.id)
    .maybeSingle();

  if (linkError || !link) {
    return { user, felacooUserId: null };
  }

  return { user, felacooUserId: link.user_id as string };
}

export async function GET(request: Request) {
  try {
    const { user, felacooUserId } = await getIdentity();

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!felacooUserId) {
      return NextResponse.json(
        { authenticated: true, linked: false, message: "Supabase Auth user is not linked to a Fellacoo user yet." },
        { status: 403 },
      );
    }

    const admin = createAdminClient();
    const url = new URL(request.url);
    const requestedId = url.searchParams.get("id")?.trim();

    let query = admin
      .from("build_requests")
      .select("id, assembly, preview, business_name, activity, location, slug, published_url, live_version, created_at")
      .eq("owner_id", felacooUserId);

    const { data: draft, error } = requestedId
      ? await query.eq("id", requestedId).maybeSingle()
      : await query.order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (requestedId && !draft) {
      return NextResponse.json({ error: "Builder project was not found." }, { status: 404 });
    }

    return NextResponse.json({
      authenticated: true,
      linked: true,
      draft: draft
        ? {
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
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load builder draft." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DraftPayload;

    if (!isBuilderDocument(body.document)) {
      return NextResponse.json({ error: "Invalid builder document." }, { status: 400 });
    }

    const { user, felacooUserId } = await getIdentity();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!felacooUserId) {
      return NextResponse.json(
        { error: "Your Supabase Auth user is not linked to a Fellacoo user." },
        { status: 403 },
      );
    }

    const admin = createAdminClient();
    const buildRequestId = body.buildRequestId?.trim() || crypto.randomUUID();

    if (body.buildRequestId) {
      const { data, error } = await admin
        .from("build_requests")
        .update({
          assembly: body.document,
          preview: body.document,
        })
        .eq("id", buildRequestId)
        .eq("owner_id", felacooUserId)
        .select("id")
        .maybeSingle();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({ error: "Builder draft was not found for this user." }, { status: 404 });
      }

      return NextResponse.json({ saved: true, buildRequestId });
    }

    const header = body.document.pages[0]?.elements.find((element) => element.type === "header");
    const inferredBusinessName = typeof header?.props.brand === "string"
      ? header.props.brand
      : "Your Business";

    const { error } = await admin.from("build_requests").insert({
      id: buildRequestId,
      business_name: body.businessName?.trim() || inferredBusinessName,
      activity: body.activity?.trim() || "Website",
      location: body.location?.trim() || "Online",
      status: "draft",
      owner_id: felacooUserId,
      created_at: new Date().toISOString(),
      assembly: body.document,
      preview: body.document,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: true, buildRequestId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save builder draft." },
      { status: 500 },
    );
  }
}
