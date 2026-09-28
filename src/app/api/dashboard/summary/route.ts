import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";

export const dynamic = "force-dynamic";

type WebsiteRow = {
  id: string;
  business_name: string;
  slug: string | null;
  status: string;
  published_url: string | null;
  created_at: string;
  activity: string;
  location: string;
};

export async function GET(request: Request) {
  try {
    const identity = await getFelacooIdentity();
    if (!identity) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const admin = createAdminClient();
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim() ?? "";

    let websitesQuery = admin
      .from("build_requests")
      .select("id,business_name,slug,status,published_url,created_at,activity,location")
      .eq("owner_id", identity.felacooUserId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (query) {
      const safe = query.replace(/[%(),]/g, " ").trim();
      if (safe) {
        websitesQuery = websitesQuery.or(
          `business_name.ilike.%${safe}%,slug.ilike.%${safe}%,activity.ilike.%${safe}%`
        );
      }
    }

    const [
      websitesResult,
      visitorsResult,
      leadsResult,
      invoicesResult
    ] = await Promise.all([
      websitesQuery,
      admin
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .in(
          "build_request_id",
          (
            await admin
              .from("build_requests")
              .select("id")
              .eq("owner_id", identity.felacooUserId)
          ).data?.map((row) => row.id) ?? []
        ),
      admin
        .from("leads")
        .select("id", { count: "exact", head: true })
        .in(
          "build_request_id",
          (
            await admin
              .from("build_requests")
              .select("id")
              .eq("owner_id", identity.felacooUserId)
          ).data?.map((row) => row.id) ?? []
        ),
      admin
        .from("invoices")
        .select("total,status,created_at")
        .eq("owner_id", identity.felacooUserId)
        .limit(1000)
    ]);

    if (websitesResult.error) throw websitesResult.error;

    const websites = (websitesResult.data ?? []) as WebsiteRow[];
    const invoices = invoicesResult.data ?? [];
    const revenue = invoices
      .filter((invoice) => ["PAID", "PARTIALLY_PAID"].includes(String(invoice.status).toUpperCase()))
      .reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0);

    const recentActivity = websites.slice(0, 5).map((site) => ({
      id: site.id,
      title: site.status.toLowerCase() === "published" ? "Website published" : "Website updated",
      name: site.business_name,
      time: site.created_at,
      tone: site.status.toLowerCase() === "published" ? "green" : "purple"
    }));

    return NextResponse.json({
      authenticated: true,
      metrics: {
        websites: websites.length,
        visitors: visitorsResult.count ?? 0,
        leads: leadsResult.count ?? 0,
        revenue
      },
      websites: websites.map((site) => ({
        id: site.id,
        name: site.business_name,
        domain: site.published_url || site.slug || "Not published",
        kind: site.activity?.toLowerCase() || "website",
        status: String(site.status || "Draft").replace(/^./, (value) => value.toUpperCase())
      })),
      recentActivity
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load dashboard data." },
      { status: 500 }
    );
  }
}
