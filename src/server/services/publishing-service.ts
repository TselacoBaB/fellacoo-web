import { createAdminClient } from "@/lib/supabase/admin";
import type { BuilderDocument, BuilderElement } from "@/types/builder";

type PublishInput = {
  buildRequestId: string;
  ownerId: string;
  slug?: string | null;
};

type PublishResult = {
  ok: true;
  buildRequestId: string;
  version: number;
  slug: string;
  url: string;
  bytes: number;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "website";
}

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
      && Array.isArray(page.elements)
    );
}

function renderElement(element: BuilderElement): string {
  const p = element.props;

  switch (element.type) {
    case "header":
      return `<header class="site-block header-block"><strong>${escapeHtml(p.brand || "Your Business")}</strong><nav><a href="/">Home</a><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a><a class="nav-cta" href="#contact">Get Started</a></nav></header>`;

    case "hero":
      return `<section class="site-block hero-block"><div><small>${escapeHtml(p.eyebrow || "WELCOME")}</small><h1>${escapeHtml(p.title || "Your next customer starts here.")}</h1><p>${escapeHtml(p.description || "Tell visitors what you do and why they should choose you.")}</p><div class="hero-actions"><a href="#contact">${escapeHtml(p.primary || "Get Started")}</a><a class="ghost" href="#services">${escapeHtml(p.secondary || "Learn More")}</a></div></div><div class="hero-shape" aria-hidden="true"><span></span></div></section>`;

    case "features":
      return `<section class="site-block feature-block" id="about"><small>WHY CHOOSE US</small><h2>${escapeHtml(p.title || "Everything your customers need.")}</h2><div class="feature-grid"><article><span>✦</span><strong>Fast setup</strong><p>Get your business online with a clear, responsive experience.</p></article><article><span>◈</span><strong>Mobile ready</strong><p>Your website adapts beautifully across phones, tablets and desktops.</p></article><article><span>✦</span><strong>Built to convert</strong><p>Clear calls to action make it easier for customers to take the next step.</p></article></div></section>`;

    case "services":
      return `<section class="site-block feature-block" id="services"><small>SERVICES</small><h2>What we do.</h2><div class="feature-grid"><article><span>◈</span><strong>Consulting</strong><p>Practical expertise tailored to your customers and goals.</p></article><article><span>✦</span><strong>Design</strong><p>Modern presentation that makes your business easy to understand.</p></article><article><span>◇</span><strong>Support</strong><p>Reliable help that keeps your customer experience moving.</p></article></div></section>`;

    case "products":
      return `<section class="site-block feature-block"><small>STORE</small><h2>Featured products.</h2><div class="feature-grid"><article><span>□</span><strong>Product One</strong><p>R299.00 · <a href="#contact">Enquire</a></p></article><article><span>□</span><strong>Product Two</strong><p>R499.00 · <a href="#contact">Enquire</a></p></article><article><span>□</span><strong>Product Three</strong><p>R799.00 · <a href="#contact">Enquire</a></p></article></div></section>`;

    case "pricing":
      return `<section class="site-block feature-block"><small>PRICING</small><h2>Simple plans.</h2><div class="feature-grid"><article><strong>Starter</strong><h3>R299 / month</h3><p>For getting online.</p></article><article><strong>Growth</strong><h3>R599 / month</h3><p>For growing businesses.</p></article><article><strong>Pro</strong><h3>R999 / month</h3><p>For teams ready to scale.</p></article></div></section>`;

    case "lead-form":
      return `<section class="site-block form-block" id="contact"><small>GET IN TOUCH</small><h2>Tell us what you need.</h2><form action="https://api.fellacoo.xyz/public/leads" method="post"><input name="name" placeholder="Your name" required><input name="contact" placeholder="Email or phone number" required><textarea name="message" placeholder="How can we help?" required></textarea><button type="submit">Send enquiry</button></form></section>`;

    case "booking":
      return `<section class="site-block form-block"><small>BOOKING</small><h2>Choose a time.</h2><div class="calendar-placeholder">Select date · Select time · Confirm booking</div><a class="site-button" href="/book">Open booking</a></section>`;

    case "quote":
      return `<section class="site-block form-block"><small>QUOTE</small><h2>Request a quote.</h2><form action="https://api.fellacoo.xyz/public/leads" method="post"><input name="name" placeholder="Your name" required><input name="contact" placeholder="Email or phone number" required><input name="message" placeholder="What do you need?" required><button type="submit">Request quotation</button></form></section>`;

    case "testimonials":
      return `<section class="site-block feature-block"><small>TRUSTED</small><h2>What customers say.</h2><div class="quote-card">“Excellent service and a beautiful experience.”<strong>— Happy customer</strong></div></section>`;

    case "faq":
      return `<section class="site-block feature-block"><small>FAQ</small><h2>Questions, answered.</h2><div class="faq-list"><details><summary>What do you offer?</summary><p>We provide practical services designed around your needs.</p></details><details><summary>How does it work?</summary><p>Choose a service, contact the business and we will guide you through the next step.</p></details><details><summary>How do I get started?</summary><p>Use the contact or booking option on this website.</p></details></div></section>`;

    case "footer":
      return `<footer class="site-block footer-block"><strong>${escapeHtml(p.brand || "Your Business")}</strong><span>© ${new Date().getFullYear()} · Privacy · Terms · Contact</span></footer>`;

    default:
      return `<section class="site-block feature-block"><h2>Component</h2></section>`;
  }
}

function compileDocument(document: BuilderDocument, businessName: string) {
  const page = document.pages[0];
  const body = page?.elements?.map(renderElement).join("\n") || "";
  const title = escapeHtml(page?.title || businessName || "Website");
  const brand = escapeHtml(businessName || "Your Business");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · ${brand}</title>
<meta name="description" content="${brand} website">
<style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#121522;background:#fff}a{color:inherit}.site-block{box-sizing:border-box}.header-block{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 6vw;border-bottom:1px solid #e7e9ef;background:#fff;position:sticky;top:0;z-index:20}.header-block>strong{font-size:18px}.header-block nav{display:flex;align-items:center;gap:22px;font-size:13px;color:#697287}.header-block nav a{text-decoration:none}.header-block nav .nav-cta{padding:10px 14px;border-radius:8px;background:#111522;color:#fff}.hero-block{min-height:560px;display:grid;grid-template-columns:1.15fr .85fr;align-items:center;gap:40px;padding:80px 7vw;background:radial-gradient(circle at 80% 35%,#e7d7ff,transparent 27%),linear-gradient(135deg,#fff,#f4f6fb)}.hero-block small,.feature-block>small,.form-block>small{font-size:11px;letter-spacing:.2em;color:#7b42d7;font-weight:800}.hero-block h1{max-width:760px;margin:14px 0;font-size:clamp(44px,7vw,82px);line-height:.94;letter-spacing:-.065em}.hero-block p{max-width:600px;color:#697287;font-size:17px;line-height:1.7}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.hero-actions a,.site-button,.form-block button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:12px 18px;border:0;border-radius:9px;background:#111522;color:#fff;text-decoration:none;font-weight:700;font-size:13px}.hero-actions a.ghost{background:#fff;color:#171b28;border:1px solid #d9dce5}.hero-shape{width:min(360px,100%);aspect-ratio:1;margin:auto;border-radius:40% 60% 45% 55%;background:linear-gradient(135deg,#8b38ff,#e52bd7 50%,#287aff);transform:rotate(25deg);box-shadow:0 30px 80px rgba(129,55,255,.25)}.hero-shape span{display:block;width:58%;aspect-ratio:1;margin:21% auto;border-radius:50%;background:#f4f6fb}.feature-block{padding:88px 7vw;background:#fff}.feature-block h2,.form-block h2{max-width:800px;font-size:clamp(34px,5vw,58px);letter-spacing:-.05em;margin:12px 0 34px}.feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.feature-grid article{min-height:165px;padding:24px;border:1px solid #e4e7ef;border-radius:16px;background:#fbfcff}.feature-grid article>span{display:block;color:#8b42ff;font-size:20px}.feature-grid article strong{display:block;margin-top:16px;font-size:15px}.feature-grid article h3{font-size:22px;margin:10px 0}.feature-grid article p{font-size:14px;color:#727c92;line-height:1.6}.feature-grid article a{font-weight:700}.form-block{padding:88px 7vw;background:#f7f8fb}.form-block form{max-width:620px}.form-block input,.form-block textarea{display:block;width:100%;margin:12px 0;padding:15px;border:1px solid #dfe3ec;border-radius:9px;background:#fff;font:inherit;font-size:15px}.form-block textarea{min-height:130px}.calendar-placeholder{max-width:620px;padding:28px;border:1px dashed #cdd3df;border-radius:12px;color:#7b8498;font-size:14px;margin-bottom:18px}.site-button{width:max-content}.quote-card{max-width:760px;padding:28px;border-radius:16px;background:#f5f2ff;color:#4d5260;font-size:20px;line-height:1.55}.quote-card strong{display:block;margin-top:16px;font-size:12px}.faq-list{max-width:760px}.faq-list details{padding:18px 0;border-bottom:1px solid #e3e6ed}.faq-list summary{cursor:pointer;font-weight:700}.faq-list p{color:#727c92;line-height:1.6}.footer-block{min-height:140px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:34px 7vw;background:#111522;color:#fff}.footer-block span{font-size:12px;color:#9aa4ba}@media(max-width:768px){.header-block{padding:0 20px}.header-block nav a:not(.nav-cta){display:none}.hero-block{grid-template-columns:1fr;min-height:auto;padding:64px 24px}.hero-block h1{font-size:clamp(42px,13vw,64px)}.hero-shape{width:220px}.feature-block,.form-block{padding:60px 24px}.feature-grid{grid-template-columns:1fr}.footer-block{padding:28px 24px;flex-direction:column;align-items:flex-start}.header-block nav{gap:8px}}@media(prefers-reduced-motion:no-preference){.site-block{animation:fadeIn .55s ease both}@keyframes fadeIn{from{opacity:.01;transform:translateY(8px)}to{opacity:1;transform:none}}}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

async function uploadR2(path: string, data: string, contentType: string) {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const bucket = process.env.R2_BUCKET;
  if (!account || !token || !bucket) {
    throw new Error("Cloudflare R2 publishing is not configured on the server.");
  }

  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/r2/buckets/${encodeURIComponent(bucket)}/objects/${encodedPath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
      },
      body: data,
    }
  );

  if (!response.ok) {
    throw new Error(`R2 upload failed with HTTP ${response.status}.`);
  }
}

function siteRootDomain() {
  return (
    process.env.NEXT_PUBLIC_SITE_ROOT_DOMAIN ||
    process.env.SITES_ROOT_DOMAIN ||
    "fellacoo.xyz"
  ).replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export async function publishWebsite(input: PublishInput): Promise<PublishResult> {
  const admin = createAdminClient();

  const { data: build, error: buildError } = await admin
    .from("build_requests")
    .select("id,business_name,status,assembly,preview,slug,live_version")
    .eq("id", input.buildRequestId)
    .eq("owner_id", input.ownerId)
    .maybeSingle();

  if (buildError) throw buildError;
  if (!build) throw new Error("Website project was not found.");
  const document = isBuilderDocument(build.assembly)
    ? build.assembly
    : isBuilderDocument(build.preview)
      ? build.preview
      : null;

  if (!document) throw new Error("This website has no valid builder document to publish.");

  let slug = slugify(input.slug?.trim() || build.slug || build.business_name);
  const { data: slugConflict } = await admin
    .from("build_requests")
    .select("id")
    .eq("slug", slug)
    .neq("id", build.id)
    .limit(1)
    .maybeSingle();

  if (slugConflict) slug = `${slug}-${build.id.slice(0, 6)}`;

  const html = compileDocument(document, build.business_name);
  const bytes = Buffer.byteLength(html, "utf8");
  const version = Number(build.live_version || 0) + 1;
  const path = `sites/${slug}/index.html`;

  await uploadR2(path, html, "text/html; charset=utf-8");

  const previousLive = await admin
    .from("site_versions")
    .update({ status: "SUPERSEDED" })
    .eq("build_request_id", build.id)
    .eq("status", "LIVE");

  if (previousLive.error) throw previousLive.error;

  const siteVersionId = crypto.randomUUID();
  const { error: versionError } = await admin
    .from("site_versions")
    .insert({
      id: siteVersionId,
      build_request_id: build.id,
      version,
      status: "LIVE",
      total_bytes: bytes,
      initial_payload_bytes: bytes,
      qa: { warnings: [] },
      files: [{ path, bytes }],
      created_at: new Date().toISOString(),
      pinned: false,
    });

  if (versionError) throw versionError;

  const url = `https://${slug}.${siteRootDomain()}`;
  const { error: updateError } = await admin
    .from("build_requests")
    .update({
      assembly: document,
      preview: document,
      compiled_html: html,
      slug,
      status: "published",
      published_url: url,
      published_bytes: bytes,
      live_version: version,
    })
    .eq("id", build.id)
    .eq("owner_id", input.ownerId);

  if (updateError) throw updateError;

  const { data: domainRow } = await admin
    .from("site_domains")
    .select("id")
    .eq("site_id", build.id)
    .eq("hostname", `${slug}.${siteRootDomain()}`)
    .maybeSingle();

  if (!domainRow) {
    const { error: domainError } = await admin
      .from("site_domains")
      .insert({
        id: crypto.randomUUID(),
        site_id: build.id,
        hostname: `${slug}.${siteRootDomain()}`,
        slug,
        domain_type: "FELACOO_SUBDOMAIN",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        verified_at: new Date().toISOString(),
        meta: { source: "fellacoo-web" },
      });
    if (domainError) throw domainError;
  }

  const { error: websiteVersionError } = await admin
    .from("website_versions")
    .insert({
      id: crypto.randomUUID(),
      build_request_id: build.id,
      preview: document,
      label: `Published v${version}`,
      credits_charged: 0,
      created_by: input.ownerId,
      created_at: new Date().toISOString(),
    });

  if (websiteVersionError) throw websiteVersionError;

  return {
    ok: true,
    buildRequestId: build.id,
    version,
    slug,
    url,
    bytes,
  };
}
