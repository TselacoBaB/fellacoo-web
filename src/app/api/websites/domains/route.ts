import { NextResponse } from "next/server";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const CF_API = "https://api.cloudflare.com/client/v4";
const DOMAIN_RE = /^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;

function cloudflareConfig() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID;
  return token && zone ? { token, zone } : null;
}

function normalizeHostname(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .replace(/\.$/, "");
}

function domainStatus(result: Record<string, unknown>) {
  const ssl = (result.ssl as Record<string, unknown> | undefined) ?? {};
  if (result.status === "active" && ssl.status === "active") return "ACTIVE";
  if (result.status === "active") return "VERIFYING_SSL";
  return "PENDING_DNS";
}

function verificationRecords(result: Record<string, unknown>) {
  const records: Array<{ type: string; host: string; value: string; purpose: string }> = [];
  const ownership = (result.ownership_verification as Record<string, unknown> | undefined) ?? {};
  if (ownership.name) {
    records.push({
      type: "TXT",
      host: String(ownership.name),
      value: String(ownership.value ?? ""),
      purpose: "Proves you own this domain"
    });
  }

  const ssl = (result.ssl as Record<string, unknown> | undefined) ?? {};
  const validation = Array.isArray(ssl.validation_records) ? ssl.validation_records : [];
  for (const item of validation) {
    const row = item as Record<string, unknown>;
    if (row.txt_name) {
      records.push({
        type: "TXT",
        host: String(row.txt_name),
        value: String(row.txt_value ?? ""),
        purpose: "Issues the SSL certificate"
      });
    }
  }

  return records;
}

async function ownedSite(siteId: string, ownerId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("build_requests")
    .select("id,business_name,slug,published_url")
    .eq("id", siteId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function GET() {
  try {
    const identity = await getFelacooIdentity();
    if (!identity) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const admin = createAdminClient();
    const { data: sites, error: sitesError } = await admin
      .from("build_requests")
      .select("id,business_name,slug,published_url")
      .eq("owner_id", identity.felacooUserId)
      .order("created_at", { ascending: false });

    if (sitesError) throw sitesError;

    const siteIds = (sites ?? []).map((site) => site.id);
    const { data: domains, error: domainsError } = siteIds.length
      ? await admin.from("site_domains").select("id,site_id,hostname,slug,domain_type,status,created_at,verified_at,meta").in("site_id", siteIds).order("created_at", { ascending: false })
      : { data: [], error: null };

    if (domainsError) throw domainsError;

    return NextResponse.json({
      sites: sites ?? [],
      domains: (domains ?? []).map((domain) => ({
        ...domain,
        records: (domain.meta as Record<string, unknown> | null)?.records ?? [],
        sslStatus: (domain.meta as Record<string, unknown> | null)?.ssl_status ?? null
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load domains." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const identity = await getFelacooIdentity();
    if (!identity) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = await request.json() as { siteId?: string; hostname?: string };
    const siteId = body.siteId?.trim();
    const hostname = normalizeHostname(body.hostname ?? "");

    if (!siteId || !hostname || !DOMAIN_RE.test(hostname)) {
      return NextResponse.json({ error: "Enter a valid domain such as mybusiness.co.za." }, { status: 422 });
    }

    const site = await ownedSite(siteId, identity.felacooUserId);
    if (!site) return NextResponse.json({ error: "Website project was not found." }, { status: 404 });
    if (!site.slug || !site.published_url) {
      return NextResponse.json({ error: "Publish this website before connecting a custom domain." }, { status: 409 });
    }

    const root = (process.env.NEXT_PUBLIC_SITE_ROOT_DOMAIN || process.env.SITES_ROOT_DOMAIN || "fellacoo.xyz").toLowerCase();
    if (hostname === root || hostname.endsWith("." + root)) {
      return NextResponse.json({ error: "Use a custom domain you own. Fellacoo subdomains are created automatically." }, { status: 422 });
    }

    const admin = createAdminClient();
    const { data: taken } = await admin
      .from("site_domains")
      .select("id")
      .eq("hostname", hostname)
      .limit(1)
      .maybeSingle();
    if (taken) return NextResponse.json({ error: "That domain is already connected to a website." }, { status: 409 });

    const config = cloudflareConfig();
    if (!config) {
      return NextResponse.json({ error: "Custom-domain infrastructure is not configured on the server yet." }, { status: 503 });
    }

    const response = await fetch(
      `${CF_API}/zones/${config.zone}/custom_hostnames`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hostname,
          ssl: {
            method: "txt",
            type: "dv",
            settings: { min_tls_version: "1.2" }
          }
        })
      }
    );

    const payload = await response.json() as { success?: boolean; result?: Record<string, unknown>; errors?: Array<{ message?: string }> };
    if (!response.ok || !payload.success || !payload.result) {
      const message = payload.errors?.[0]?.message || "Cloudflare rejected the domain.";
      return NextResponse.json({ error: message }, { status: response.status === 403 ? 503 : 502 });
    }

    const cf = payload.result;
    const status = domainStatus(cf);
    const meta = {
      source: "fellacoo-web",
      cf_id: cf.id,
      records: verificationRecords(cf),
      ssl_status: String((cf.ssl as Record<string, unknown> | undefined)?.status ?? ""),
      checked_at: new Date().toISOString()
    };

    const { data: domain, error: insertError } = await admin
      .from("site_domains")
      .insert({
        id: crypto.randomUUID(),
        site_id: site.id,
        hostname,
        slug: site.slug,
        domain_type: "CUSTOM",
        status,
        created_at: new Date().toISOString(),
        verified_at: status === "ACTIVE" ? new Date().toISOString() : null,
        meta
      })
      .select("id,site_id,hostname,slug,domain_type,status,created_at,verified_at,meta")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      domain: {
        ...domain,
        records: meta.records,
        sslStatus: meta.ssl_status
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to connect domain." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const identity = await getFelacooIdentity();
    if (!identity) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = await request.json() as { domainId?: string };
    if (!body.domainId?.trim()) return NextResponse.json({ error: "domainId is required." }, { status: 400 });

    const admin = createAdminClient();
    const { data: domain, error } = await admin
      .from("site_domains")
      .select("id,site_id,domain_type,meta")
      .eq("id", body.domainId.trim())
      .maybeSingle();
    if (error) throw error;
    if (!domain) return NextResponse.json({ error: "Domain was not found." }, { status: 404 });

    const site = await ownedSite(domain.site_id, identity.felacooUserId);
    if (!site) return NextResponse.json({ error: "Domain was not found for this account." }, { status: 404 });

    if (domain.domain_type === "CUSTOM") {
      const config = cloudflareConfig();
      const cfId = (domain.meta as Record<string, unknown> | null)?.cf_id;
      if (config && cfId) {
        await fetch(
          `${CF_API}/zones/${config.zone}/custom_hostnames/${encodeURIComponent(String(cfId))}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${config.token}` } }
        );
      }
    }

    const { error: deleteError } = await admin.from("site_domains").delete().eq("id", domain.id);
    if (deleteError) throw deleteError;

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to remove domain." },
      { status: 500 }
    );
  }
}
