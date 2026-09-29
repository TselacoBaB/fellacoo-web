import { NextResponse } from "next/server";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const identity = await getFelacooIdentity();
    if (!identity) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = await request.json() as {
      action?: "duplicate" | "archive" | "restore" | "delete";
      siteId?: string;
    };

    const action = body.action;
    const siteId = body.siteId?.trim();
    if (!siteId || !action) {
      return NextResponse.json({ error: "siteId and action are required." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: site, error: siteError } = await admin
      .from("build_requests")
      .select("id,business_name,activity,location,assembly,preview")
      .eq("id", siteId)
      .eq("owner_id", identity.felacooUserId)
      .maybeSingle();

    if (siteError) throw siteError;
    if (!site) return NextResponse.json({ error: "Website project was not found." }, { status: 404 });

    if (action === "delete") {
      const childTables = ["analytics_events", "leads", "site_domains", "website_versions", "site_versions"];

      for (const table of childTables) {
        const { error } = await admin
          .from(table)
          .delete()
          .eq("build_request_id", site.id);

        if (error && !/column .*build_request_id.*does not exist/i.test(error.message)) {
          throw error;
        }
      }

      const { error: deleteError } = await admin
        .from("build_requests")
        .delete()
        .eq("id", site.id)
        .eq("owner_id", identity.felacooUserId);

      if (deleteError) throw deleteError;

      return NextResponse.json({ ok: true, action, siteId: site.id });
    }

    if (action === "archive" || action === "restore") {
      const status = action === "archive" ? "archived" : "draft";
      const { error } = await admin
        .from("build_requests")
        .update({ status })
        .eq("id", site.id)
        .eq("owner_id", identity.felacooUserId);

      if (error) throw error;
      return NextResponse.json({ ok: true, action, siteId: site.id, status });
    }

    if (action === "duplicate") {
      const newId = crypto.randomUUID();
      const name = `Copy of ${site.business_name}`;

      const { error } = await admin
        .from("build_requests")
        .insert({
          id: newId,
          business_name: name,
          activity: site.activity,
          location: site.location,
          status: "draft",
          owner_id: identity.felacooUserId,
          created_at: new Date().toISOString(),
          assembly: site.assembly,
          preview: site.preview,
          published_bytes: 0,
          live_version: 0
        });

      if (error) throw error;

      return NextResponse.json({
        ok: true,
        action,
        siteId: newId,
        name,
        url: `/builder/${newId}`
      });
    }

    return NextResponse.json({ error: "Unsupported project action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to manage website." },
      { status: 500 }
    );
  }
}
