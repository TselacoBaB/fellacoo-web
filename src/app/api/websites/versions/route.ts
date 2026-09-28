import { NextResponse } from "next/server";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const identity = await getFelacooIdentity();
    if (!identity) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const siteId = new URL(request.url).searchParams.get("siteId")?.trim();
    if (!siteId) return NextResponse.json({ error: "siteId is required." }, { status: 400 });

    const admin = createAdminClient();
    const { data: site, error: siteError } = await admin
      .from("build_requests")
      .select("id,business_name,slug,published_url,live_version,status")
      .eq("id", siteId)
      .eq("owner_id", identity.felacooUserId)
      .maybeSingle();

    if (siteError) throw siteError;
    if (!site) return NextResponse.json({ error: "Website project was not found." }, { status: 404 });

    const { data: versions, error: versionsError } = await admin
      .from("site_versions")
      .select("id,build_request_id,version,status,total_bytes,initial_payload_bytes,qa,files,created_at,pinned")
      .eq("build_request_id", site.id)
      .order("version", { ascending: false });

    if (versionsError) throw versionsError;

    const { data: websiteVersions, error: websiteVersionsError } = await admin
      .from("website_versions")
      .select("id,build_request_id,label,credits_charged,created_by,created_at")
      .eq("build_request_id", site.id)
      .order("created_at", { ascending: false });

    if (websiteVersionsError) throw websiteVersionsError;

    return NextResponse.json({
      site,
      versions: versions ?? [],
      websiteVersions: websiteVersions ?? []
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load website versions." },
      { status: 500 }
    );
  }
}
