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
function elementInlineStyle(element: BuilderElement) {
  const design = (element.props.design ?? {}) as Record<string, unknown>;
  const map: Record<string, string> = { backgroundColor:"background-color",textColor:"color",borderRadius:"border-radius",paddingTop:"padding-top",paddingBottom:"padding-bottom",textAlign:"text-align",boxShadow:"box-shadow",fontSize:"font-size",fontWeight:"font-weight",lineHeight:"line-height" };
  const parts: string[] = [];
  for (const [key,css] of Object.entries(map)) if (typeof design[key] === "string" && design[key]) parts.push(css+":"+String(design[key]));
  if (design.hidden === true) parts.push("display:none");
  return parts.length ? ' style="'+escapeHtml(parts.join(";"))+';"' : "";
}

function renderElement(element: BuilderElement, pages: BuilderPage[], theme: BuilderTheme): string {
  const p=element.props;
  const nested=(element.children??[]).map(child=>renderElement(child,pages,theme)).join("");
  const attr=' data-fela-id="'+escapeHtml(element.id)+'"'+elementInlineStyle(element);
  const nav=pages.slice(0,5).map(page=>'<a href="'+escapeHtml(page.path)+'">'+escapeHtml(page.title)+'</a>').join("");
  switch(element.type){
    case "header": return '<header class="site-block header-block"'+attr+'><strong>'+escapeHtml(p.brand||"Your Business")+'</strong><nav>'+nav+'<a class="nav-cta" href="#contact">'+escapeHtml(p.cta||"Get Started")+'</a></nav></header>';
    case "hero": return '<section class="site-block hero-block"'+attr+'><div><small>'+escapeHtml(p.eyebrow||"WELCOME")+'</small><h1>'+escapeHtml(p.title||"Your next customer starts here.")+'</h1><p>'+escapeHtml(p.description||"")+'</p><div class="hero-actions"><a href="'+escapeHtml(p.primaryUrl||"#contact")+'">'+escapeHtml(p.primary||"Get Started")+'</a><a class="ghost" href="'+escapeHtml(p.secondaryUrl||"#services")+'">'+escapeHtml(p.secondary||"Learn More")+'</a></div></div><div class="hero-shape"><span></span></div>'+nested+'</section>';
    case "section": return '<section class="site-block builder-section-block"'+attr+'><small>'+escapeHtml(p.label||"SECTION")+'</small><h2>'+escapeHtml(p.title||"Your section")+'</h2>'+nested+'</section>';
    case "container": return '<div class="builder-container-block"'+attr+'>'+nested+'</div>';
    case "text": return '<p class="builder-primitive-text"'+attr+'>'+escapeHtml(p.text||"Youfunction compileDocument(document: BuilderDocument, businessName: string) {
  return compilePage(document, document.pages[0], businessName);
}

function compilePage(document: BuilderDocument, page: BuilderPage, businessName: string) {
  const theme=document.site.theme;
  const body=page.elements.map(element=>renderElement(element,document.pages,theme)).join("\\n");
  const title=escapeHtml(page.seo?.title||page.title||businessName||"Website");
  const description=escapeHtml(page.seo?.description||document.site.seo.description||businessName||"Website");
  const c=theme.colors;
  const css=[
    ":root{--primary:"+escapeHtml(c.primary)+";--secondary:"+escapeHtml(c.secondary)+";--accent:"+escapeHtml(c.accent)+";--text:"+escapeHtml(c.text)+";--muted:"+escapeHtml(c.muted)+";--bg:"+escapeHtml(c.background)+";--surface:"+escapeHtml(c.surface)+";--radius:"+escapeHtml(theme.radius)+";--container:"+escapeHtml(theme.containerWidth)+";--heading-font:"+escapeHtml(theme.typography.headingFont)+";--body-font:"+escapeHtml(theme.typography.bodyFont)+";--heading-weight:"+escapeHtml(theme.typography.headingWeight)+";--body-weight:"+escapeHtml(theme.typography.bodyWeight)+"}",
    "*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:var(--body-font);font-weight:var(--body-weight);color:var(--text);background:var(--bg)}a{color:inherit}.site-block{box-sizing:border-box}",
    ".header-block{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 max(24px,calc((100vw - var(--container))/2));border-bottom:1px solid #e7e9ef;background:var(--bg);position:sticky;top:0;z-index:20}.header-block>strong{font-size:18px}.header-block nav{display:flex;align-items:center;gap:18px;font-size:13px;color:var(--muted)}.header-block nav a{text-decoration:none}.header-block nav .nav-cta{padding:10px 14px;border-radius:var(--radius);background:var(--primary);color:#fff}",
    ".hero-block{min-height:560px;display:grid;grid-template-columns:1.15fr .85fr;align-items:center;gap:40px;padding:80px max(24px,calc((100vw - var(--container))/2));background:linear-gradient(135deg,var(--bg),var(--surface))}.hero-block small,.feature-block>small,.form-block>small{font-size:11px;letter-spacing:.2em;color:var(--primary);font-weight:800}.hero-block h1{max-width:760px;margin:14px 0;font-family:var(--heading-font);font-weight:var(--heading-weight);font-size:clamp(44px,7vw,82px);line-height:.94;letter-spacing:-.065em}.hero-block p{max-width:600px;color:var(--muted);font-size:17px;line-height:1.7}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.hero-actions a,.form-block button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:12px 18px;border:0;border-radius:var(--radius);background:var(--primary);color:#fff;text-decoration:none;font-weight:700;font-size:13px}.hero-actions a.ghost{background:transparent;color:var(--text);border:1px solid #d9dce5}.hero-shape{width:min(360px,100%);aspect-ratio:1;margin:auto;border-radius:40% 60% 45% 55%;background:linear-gradient(135deg,var(--primary),var(--secondary) 50%,var(--accent));transform:rotate(25deg);box-shadow:0 30px 80px rgba(124,58,237,.25)}.hero-shape span{display:block;width:58%;aspect-ratio:1;margin:21% auto;border-radius:50%;background:var(--surface)}",
    ".feature-block{padding:88px max(24px,calc((100vw - var(--container))/2));background:var(--bg)}.feature-block h2,.form-block h2{max-width:800px;font-family:var(--heading-font);font-weight:var(--heading-weight);font-size:clamp(34px,5vw,58px);letter-spacing:-.05em;margin:12px 0 34px}.feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.feature-grid article{min-height:165px;padding:24px;border:1px solid #e4e7ef;border-radius:var(--radius);background:var(--surface)}.feature-grid article>span{display:block;color:var(--primary);font-size:20px}.feature-grid article strong{display:block;margin-top:16px;font-size:15px}.feature-grid article h3{font-size:22px;margin:10px 0}.feature-grid article p{font-size:14px;color:var(--muted);line-height:1.6}",
    ".form-block{padding:88px max(24px,calc((100vw - var(--container))/2));background:var(--surface)}.form-block form{max-width:620px}.form-block input,.form-block textarea{display:block;width:100%;margin:12px 0;padding:15px;border:1px solid #dfe3ec;border-radius:var(--radius);background:var(--bg);font:inherit}.form-block textarea{min-height:130px}.calendar-placeholder{max-width:620px;padding:28px;border:1px dashed #cdd3df;border-radius:var(--radius);color:var(--muted);margin-bottom:18px}.builder-section-block{padding:70px max(24px,calc((100vw - var(--container))/2));background:var(--surface)}.builder-container-block{width:min(100%,var(--container));margin:auto;padding:24px}.builder-primitive-text{color:var(--muted);line-height:1.7}.builder-primitive-heading{font-family:var(--heading-font);font-weight:var(--heading-weight)}.builder-primitive-button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 18px;border-radius:var(--radius);background:var(--primary);color:#fff;text-decoration:none;font-weight:800}.builder-primitive-button.outline{background:transparent;color:var(--text);border:1px solid #d9dce5}.builder-primitive-image{display:block;width:100%;max-height:620px;object-fit:cover;border-radius:var(--radius)}.builder-image-placeholder{min-height:180px;display:grid;place-items:center;align-content:center;border:1px dashed #cbd5e1;color:#64748b}.builder-primitive-icon{display:inline-grid;width:38px;height:38px;place-items:center;border-radius:var(--radius);background:var(--surface);color:var(--primary)}.builder-primitive-link{color:var(--primary);font-weight:800}.builder-primitive-divider{border:0;border-top:1px solid #e2e8f0}.builder-primitive-columns{display:grid;gap:16px}.builder-primitive-columns.columns-2{grid-template-columns:repeat(2,1fr)}.builder-primitive-columns.columns-3{grid-template-columns:repeat(3,1fr)}.builder-primitive-columns.columns-4{grid-template-columns:repeat(4,1fr)}.builder-column{min-height:100px;padding:18px;border:1px dashed #cbd5e1;border-radius:var(--radius);background:var(--surface)}.builder-column>span{display:block;margin-bottom:8px;color:var(--muted);font-size:8px;font-weight:800;text-transform:uppercase}.quote-card{max-width:760px;padding:28px;border-radius:var(--radius);background:var(--surface);font-size:20px;line-height:1.55}.quote-card strong{display:block;margin-top:16px;font-size:12px}.faq-list{max-width:760px}.faq-list details{padding:18px 0;border-bottom:1px solid #e3e6ed}.faq-list summary{cursor:pointer;font-weight:700}.faq-list p{color:var(--muted)}.footer-block{min-height:140px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:34px max(24px,calc((100vw - var(--container))/2));background:var(--text);color:#fff}.footer-block span{font-size:12px;opacity:.65}",
    "@media(max-width:768px){.header-block{padding:0 20px}.header-block nav a:not(.nav-cta){display:none}.hero-block{grid-template-columns:1fr;min-height:auto;padding:64px 24px}.hero-block h1{font-size:clamp(42px,13vw,64px)}.hero-shape{width:220px}.feature-block,.form-block,.builder-section-block{padding:60px 24px}.feature-grid{grid-template-columns:1fr}.builder-primitive-columns.columns-2,.builder-primitive-columns.columns-3,.builder-primitive-columns.columns-4{grid-template-columns:1fr}.footer-block{padding:28px 24px;flex-direction:column;align-items:flex-start}}",
    responsiveRules(page.elements)
  ].join("");
  return "<!doctype html><html lang=\\"en\\"><head><meta charset=\\"utf-8\\"><meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\"><title>"+title+"</title><meta name=\\"description\\" content=\\""+description+"\\"><style>"+css+"</style></head><body>"+body+"</body></html>";
}function siteRootDomain() {
  return (process.env.NEXT_PUBLIC_SITE_ROOT_DOMAIN || process.env.SITES_ROOT_DOMAIN || "fellacoo.xyz").replace(/^https?:\/\//,"").replace(/\/$/,"");
}
function pageOutputPath(slug:string,page:BuilderPage) {
  const clean=page.path.replace(/^\//,"").replace(/\/$/,"");
  return clean ? "sites/"+slug+"/"+clean+"/index.html" : "sites/"+slug+"/index.html";
}}export async function publishWebsite(input: PublishInput): Promise<PublishResult> {
  const sql=getDb();
  const builds=await sql<any[]> \`select id,business_name,status,assembly,preview,slug,live_version from public.build_requests where id=\${input.buildRequestId} and owner_id=\${input.ownerId} limit 1\`;
  const build=builds[0];
  if(!build) throw new Error("Website project was not found.");
  const document=normalizeBuilderDocument(build.assembly)||normalizeBuilderDocument(build.preview);
  if(!document) throw new Error("This website has no valid builder document to publish.");
  let slug=slugify(input.slug?.trim()||build.slug||build.business_name);
  const conflicts=await sql<any[]> \`select id from public.build_requests where slug=\${slug} and id<>\${build.id} limit 1\`;
  if(conflicts[0]) slug=slug+"-"+String(build.id).slice(0,6);
  const files:{path:string;bytes:number}[]=[];
  const htmlByPage:{path:string;html:string}[]=[];
  for(const page of document.pages){
    const html=compilePage(document,page,build.business_name);
    const path=pageOutputPath(slug,page);
    await uploadR2(path,html,"text/html; charset=utf-8");
    files.push({path,bytes:new TextEncoder().encode(html).byteLength});
    htmlByPage.push({path,html});
  }
  const bytes=files.reduce((sum,file)=>sum+file.bytes,0);
  const version=Number(build.live_version||0)+1;
  const rootUrl=(process.env.R2_PUBLIC_BASE||"https://cdn.fellacoo.xyz").replace(/\\/$/,"")+"/sites/"+slug+"/index.html";
  await sql.begin(async(tx)=>{
    await tx\`update public.site_versions set status=\${"SUPERSEDED"} where build_request_id=\${build.id} and status=\${"LIVE"}\`;
    await tx\`insert into public.site_versions (id,build_request_id,version,status,total_bytes,initial_payload_bytes,qa,files,created_at,pinned) values (\${crypto.randomUUID()},\${build.id},\${version},\${"LIVE"},\${bytes},\${bytes},\${tx.json({warnings:[]})},\${tx.json(files)},\${new Date().toISOString()},\${false})\`;
    await tx\`update public.build_requests set assembly=\${tx.json(document)},preview=\${tx.json(document)},compiled_html=\${htmlByPage[0]?.html||""},slug=\${slug},status=\${"published"},published_url=\${rootUrl},published_bytes=\${bytes},live_version=\${version} where id=\${build.id} and owner_id=\${input.ownerId}\`;
    const hostname=slug+"."+siteRootDomain();
    const domains=await tx<any[]> \`select id from public.site_domains where site_id=\${build.id} and hostname=\${hostname} limit 1\`;
    if(!domains[0]) await tx\`insert into public.site_domains (id,site_id,hostname,slug,domain_type,status,created_at,verified_at,meta) values (\${crypto.randomUUID()},\${build.id},\${hostname},\${slug},\${"FELACOO_SUBDOMAIN"},\${"ACTIVE"},\${new Date().toISOString()},\${new Date().toISOString()},\${tx.json({source:"fellacoo-web",publicUrl:rootUrl})})\`;
    await tx\`insert into public.website_versions (id,build_request_id,preview,label,credits_charged,created_by,created_at) values (\${crypto.randomUUID()},\${build.id},\${tx.json(document)},\${"Published v"+version},\${0},\${input.ownerId},\${new Date().toISOString()})\`;
  });
  return {ok:true,buildRequestId:build.id,version,slug,url:rootUrl,bytes};
}
