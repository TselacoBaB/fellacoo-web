import { getDb } from "@/lib/db";
import type { BuilderDocument, BuilderElement, BuilderPage, BuilderTheme } from "@/types/builder";

type PublishInput={buildRequestId:string;ownerId:string;slug?:string|null};
type PublishResult={ok:true;buildRequestId:string;version:number;slug:string;url:string;bytes:number};

const defaultTheme:BuilderTheme={
  colors:{primary:"#7c3aed",secondary:"#ec4899",accent:"#3b82f6",text:"#111522",muted:"#697287",background:"#ffffff",surface:"#f7f8fb"},
  typography:{headingFont:"Inter, ui-sans-serif, system-ui, sans-serif",bodyFont:"Inter, ui-sans-serif, system-ui, sans-serif",headingWeight:"800",bodyWeight:"400"},
  radius:"12px",containerWidth:"1180px",buttonStyle:"solid"
};

function escapeHtml(value:unknown){return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}
function slugify(value:string){return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\\s-]/g,"").trim().replace(/[\\s_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48)||"website";}
function parseJson(value:string){try{return JSON.parse(value);}catch{return null;}}

function normalizeBuilderDocument(value:unknown):BuilderDocument|null{
  const raw=(typeof value==="string"?parseJson(value):value) as Partial<BuilderDocument>|null;
  if(!raw||raw.version!==1||!Array.isArray(raw.pages))return null;
  const site=raw.site;
  return {
    version:1,
    site:{
      brandName:site?.brandName||"Your Business",
      tagline:site?.tagline||"",
      theme:{...defaultTheme,...(site?.theme??{}),colors:{...defaultTheme.colors,...(site?.theme?.colors??{})},typography:{...defaultTheme.typography,...(site?.theme?.typography??{})}},
      seo:{title:site?.seo?.title||"Your Business",description:site?.seo?.description||""}
    },
    pages:raw.pages.map(page=>({id:page.id||crypto.randomUUID(),path:page.path||"/",title:page.title||"Page",elements:Array.isArray(page.elements)?page.elements:[],seo:page.seo}))
  };
}

function elementInlineStyle(element:BuilderElement){
  const design=(element.props.design??{}) as Record<string,unknown>;
  const map:Record<string,string>={backgroundColor:"background-color",textColor:"color",borderRadius:"border-radius",paddingTop:"padding-top",paddingBottom:"padding-bottom",textAlign:"text-align",boxShadow:"box-shadow",fontSize:"font-size",fontWeight:"font-weight",lineHeight:"line-height"};
  const parts:string[]=[];
  for(const [key,css] of Object.entries(map))if(typeof design[key]==="string"&&design[key])parts.push(css+":"+String(design[key]));
  if(design.hidden===true)parts.push("display:none");
  return parts.length?' style="'+escapeHtml(parts.join(";"))+';"':"";
}

function renderElement(element:BuilderElement,pages:BuilderPage[]):string{
  const p=element.props;
  const nested=(element.children??[]).map(child=>renderElement(child,pages)).join("");
  const attr=' id="'+escapeHtml(element.id)+'" data-fela-id="'+escapeHtml(element.id)+'"'+elementInlineStyle(element);
  const nav=pages.slice(0,5).map(page=>'<a href="'+escapeHtml(page.path)+'">'+escapeHtml(page.title)+'</a>').join("");
  switch(element.type){
    case "header":{const labels=[p.nav1||"Home",p.nav2||"Services",p.nav3||"About",p.nav4||"Contact"];const links=pages.slice(0,4).map((page,i)=>'<a href="'+escapeHtml(page.path)+'">'+escapeHtml(labels[i])+'</a>').join("");return '<header class="site-block header-block"'+attr+'><a class="brand-link" href="/">'+escapeHtml(p.brand||"Your Business")+'</a><nav>'+links+'<a class="nav-cta" href="#contact">'+escapeHtml(p.cta||"Get Started")+'</a></nav></header>';}
    case "hero":return '<section class="site-block hero-block"'+attr+'><div><small>'+escapeHtml(p.eyebrow||"WELCOME")+'</small><h1>'+escapeHtml(p.title||"Your next customer starts here.")+'</h1><p>'+escapeHtml(p.description||"")+'</p><div class="hero-actions"><a href="'+escapeHtml(p.primaryUrl||"#contact")+'">'+escapeHtml(p.primary||"Get Started")+'</a><a class="ghost" href="'+escapeHtml(p.secondaryUrl||"#services")+'">'+escapeHtml(p.secondary||"Learn More")+'</a></div></div><div class="hero-shape"><span></span></div>'+nested+'</section>';
    case "section":return '<section class="site-block builder-section-block"'+attr+'><small>'+escapeHtml(p.label||"SECTION")+'</small><h2>'+escapeHtml(p.title||"Your section")+'</h2>'+nested+'</section>';
    case "container":return '<div class="builder-container-block"'+attr+'>'+nested+'</div>';
    case "text":return '<p class="builder-primitive-text"'+attr+'>'+escapeHtml(p.text||"Your text goes here.")+'</p>';
    case "heading":return '<h2 class="builder-primitive-heading"'+attr+'>'+escapeHtml(p.text||"Your heading")+'</h2>';
    case "button":return '<a class="builder-primitive-button '+escapeHtml(p.variant||"primary")+'"'+attr+' href="'+escapeHtml(p.url||"#")+'">'+escapeHtml(p.label||"Get Started")+'</a>';
    case "image":return '<figure class="builder-primitive-image-wrap"'+attr+'>'+(p.src?'<img class="builder-primitive-image" src="'+escapeHtml(p.src)+'" alt="'+escapeHtml(p.alt||"")+'" loading="'+escapeHtml(p.loading||"lazy")+'" decoding="async">':'<div class="builder-image-placeholder"><span>IMAGE</span><small>'+escapeHtml(p.alt||"Add an image")+'</small></div>')+(p.caption?'<figcaption>'+escapeHtml(p.caption)+'</figcaption>':"")+'</figure>';
    case "icon":return '<span class="builder-primitive-icon"'+attr+'>'+escapeHtml(p.symbol||"✦")+'</span>';
    case "link":return '<a class="builder-primitive-link"'+attr+' href="'+escapeHtml(p.url||"#")+'">'+escapeHtml(p.label||"Learn more")+'</a>';
    case "divider":return '<hr class="builder-primitive-divider"'+attr+'>';
    case "spacer":return '<div class="builder-primitive-spacer"'+attr+'></div>';
    case "columns":{const count=Math.max(2,Math.min(4,Number(p.columns||3)));return '<div class="builder-primitive-columns columns-'+count+'"'+attr+'>'+Array.from({length:count},(_,i)=>'<div class="builder-column"><span>Column '+(i+1)+'</span>'+(i===0?nested:"")+'</div>').join("")+'</div>';}
    case "features":
    case "services":{const defaults=element.type==="features"?["Fast setup","Mobile ready","Built to convert"]:["Consulting","Design","Support"];return '<section class="site-block feature-block"'+attr+'><small>'+(element.type==="features"?"WHY CHOOSE US":escapeHtml(p.eyebrow||"SERVICES"))+'</small><h2>'+escapeHtml(p.title||"What we do.")+'</h2><div class="feature-grid">'+[1,2,3].map(i=>'<article><span>✦</span><strong>'+escapeHtml(p["item"+i]||defaults[i-1])+'</strong><p>'+escapeHtml(p["item"+i+"Description"]||"Present this benefit clearly.")+'</p></article>').join("")+'</div>'+nested+'</section>';}
    case "products":
    case "pricing":{const products=element.type==="products";const defaults=products?["Product One","Product Two","Product Three"]:["Starter","Growth","Pro"];return '<section class="site-block feature-block"'+attr+'><small>'+(products?"STORE":"PRICING")+'</small><h2>'+escapeHtml(p.title||"Simple plans.")+'</h2><div class="feature-grid">'+[1,2,3].map(i=>'<article><strong>'+escapeHtml(p["item"+i]||defaults[i-1])+'</strong><h3>'+escapeHtml(p["price"+i]||"")+'</h3><p>'+escapeHtml(p.cta||(products?"Enquire":"Choose a plan"))+'</p></article>').join("")+'</div>'+nested+'</section>';}
    case "lead-form":return '<section class="site-block form-block" id="contact"'+attr+'><small>'+escapeHtml(p.eyebrow||"GET IN TOUCH")+'</small><h2>'+escapeHtml(p.title||"Tell us what you need.")+'</h2><form action="https://api.fellacoo.xyz/public/leads" method="post"><input name="name" placeholder="'+escapeHtml(p.namePlaceholder||"Your name")+'" required><input name="contact" placeholder="'+escapeHtml(p.emailPlaceholder||"Email address")+'" required><textarea name="message" placeholder="'+escapeHtml(p.messagePlaceholder||"How can we help?")+'" required></textarea><button type="submit">'+escapeHtml(p.cta||"Send enquiry")+'</button></form>'+nested+'</section>';
    case "booking":return '<section class="site-block form-block"'+attr+'><small>BOOKING</small><h2>'+escapeHtml(p.title||"Choose a time.")+'</h2><div class="calendar-placeholder">'+escapeHtml(p.helper||"Select date · Select time · Confirm booking")+'</div>'+nested+'</section>';
    case "quote":return '<section class="site-block form-block"'+attr+'><small>QUOTE</small><h2>'+escapeHtml(p.title||"Request a quote.")+'</h2><form action="https://api.fellacoo.xyz/public/leads" method="post"><input name="name" placeholder="Your name" required><input name="contact" placeholder="Email or phone number" required><input name="message" placeholder="'+escapeHtml(p.placeholder||"What do you need?")+'" required><button type="submit">'+escapeHtml(p.cta||"Request quotation")+'</button></form>'+nested+'</section>';
    case "testimonials":return '<section class="site-block feature-block"'+attr+'><small>TRUSTED</small><h2>'+escapeHtml(p.title||"What customers say.")+'</h2><div class="quote-card">“'+escapeHtml(p.quote||"Excellent service and a beautiful experience.")+'”<strong>— '+escapeHtml(p.author||"Happy customer")+'</strong></div>'+nested+'</section>';
    case "faq":return '<section class="site-block feature-block"'+attr+'><small>FAQ</small><h2>'+escapeHtml(p.title||"Questions, answered.")+'</h2><div class="faq-list">'+[1,2,3].map(i=>'<details><summary>'+escapeHtml(p["question"+i]||"Question")+'</summary><p>We provide a clear answer to help your customers move forward.</p></details>').join("")+'</div>'+nested+'</section>';
    case "footer":return '<footer class="site-block footer-block"'+attr+'><div><strong>'+escapeHtml(p.brand||"Your Business")+'</strong><p>'+escapeHtml(p.copyright||"© 2026")+'</p></div><nav><a href="/">Home</a><a href="#contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav>'+nested+'</footer>';
    default:return '<section class="site-block feature-block"'+attr+'><h2>Component</h2>'+nested+'</section>';
  }
}

function responsiveRules(elements:BuilderElement[]):string{
  const out:{tablet:string[];mobile:string[]}={tablet:[],mobile:[]};
  const walk=(items:BuilderElement[])=>items.forEach(element=>{
    const design=(element.props.design??{}) as Record<string,unknown>;
    const responsive=(design.responsive??{}) as Record<string,unknown>;
    for(const viewport of ["tablet","mobile"] as const){
      const bucket=responsive[viewport];
      if(!bucket||typeof bucket!=="object")continue;
      const map:Record<string,string>={backgroundColor:"background-color",textColor:"color",borderRadius:"border-radius",paddingTop:"padding-top",paddingBottom:"padding-bottom",textAlign:"text-align",boxShadow:"box-shadow",fontSize:"font-size",fontWeight:"font-weight",lineHeight:"line-height"};
      const declarations:string[]=[];
      for(const [key,css] of Object.entries(map))if(typeof (bucket as Record<string,unknown>)[key]==="string")declarations.push(css+":"+String((bucket as Record<string,unknown>)[key]));
      if((bucket as Record<string,unknown>).hidden===true)declarations.push("display:none");
      if(declarations.length)out[viewport].push('[data-fela-id="'+escapeHtml(element.id)+'"]{'+declarations.join(";")+'}');
    }
    if(element.children?.length)walk(element.children);
  });
  walk(elements);
  return (out.tablet.length?"@media(min-width:769px) and (max-width:1024px){"+out.tablet.join("")+"}":"")+(out.mobile.length?"@media(max-width:768px){"+out.mobile.join("")+"}":"");
}

function compilePage(document:BuilderDocument,page:BuilderPage,businessName:string){
  const theme=document.site.theme;
  const body=page.elements.map(element=>renderElement(element,document.pages)).join("\\n");
  const c=theme.colors;
  const css=[
    ":root{--primary:"+escapeHtml(c.primary)+";--secondary:"+escapeHtml(c.secondary)+";--accent:"+escapeHtml(c.accent)+";--text:"+escapeHtml(c.text)+";--muted:"+escapeHtml(c.muted)+";--bg:"+escapeHtml(c.background)+";--surface:"+escapeHtml(c.surface)+";--radius:"+escapeHtml(theme.radius)+";--container:"+escapeHtml(theme.containerWidth)+";--heading-font:"+escapeHtml(theme.typography.headingFont)+";--body-font:"+escapeHtml(theme.typography.bodyFont)+";--heading-weight:"+escapeHtml(theme.typography.headingWeight)+";--body-weight:"+escapeHtml(theme.typography.bodyWeight)+"}",
    "*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:var(--body-font);font-weight:var(--body-weight);color:var(--text);background:var(--bg)}a{color:inherit}.site-block{box-sizing:border-box}",
    ".header-block{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 max(24px,calc((100vw - var(--container))/2));border-bottom:1px solid color-mix(in srgb,var(--text) 10%,transparent);background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(16px);position:sticky;top:0;z-index:20}.header-block .brand-link{font-size:18px;font-weight:900;text-decoration:none;letter-spacing:-.03em}.header-block nav{display:flex;align-items:center;gap:18px;font-size:13px;color:var(--muted)}.header-block nav a{text-decoration:none;transition:transform .2s ease,color .2s ease}.header-block nav a:hover{color:var(--text);transform:translateY(-1px)}.header-block nav .nav-cta{padding:10px 14px;border-radius:var(--radius);background:var(--primary);color:#fff}",
    ".hero-block{min-height:560px;display:grid;grid-template-columns:1.15fr .85fr;align-items:center;gap:40px;padding:80px max(24px,calc((100vw - var(--container))/2));background:linear-gradient(135deg,var(--bg),var(--surface))}.hero-block small,.feature-block>small,.form-block>small{font-size:11px;letter-spacing:.2em;color:var(--primary);font-weight:800}.hero-block h1{max-width:760px;margin:14px 0;font-family:var(--heading-font);font-weight:var(--heading-weight);font-size:clamp(44px,7vw,82px);line-height:.94;letter-spacing:-.065em}.hero-block p{max-width:600px;color:var(--muted);font-size:17px;line-height:1.7}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.hero-actions a,.form-block button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:12px 18px;border:0;border-radius:var(--radius);background:var(--primary);color:#fff;text-decoration:none;font-weight:700;font-size:13px}.hero-actions a.ghost{background:transparent;color:var(--text);border:1px solid #d9dce5}.hero-shape{width:min(360px,100%);aspect-ratio:1;margin:auto;border-radius:40% 60% 45% 55%;background:linear-gradient(135deg,var(--primary),var(--secondary) 50%,var(--accent));transform:rotate(25deg);box-shadow:0 30px 80px rgba(124,58,237,.25)}.hero-shape span{display:block;width:58%;aspect-ratio:1;margin:21% auto;border-radius:50%;background:var(--surface)}",
    ".feature-block{padding:88px max(24px,calc((100vw - var(--container))/2));background:var(--bg)}.feature-block h2,.form-block h2{max-width:800px;font-family:var(--heading-font);font-weight:var(--heading-weight);font-size:clamp(34px,5vw,58px);letter-spacing:-.05em;margin:12px 0 34px}.feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.feature-grid article{min-height:165px;padding:24px;border:1px solid #e4e7ef;border-radius:var(--radius);background:var(--surface)}.feature-grid article>span{display:block;color:var(--primary);font-size:20px}.feature-grid article strong{display:block;margin-top:16px;font-size:15px}.feature-grid article h3{font-size:22px;margin:10px 0}.feature-grid article p{font-size:14px;color:var(--muted);line-height:1.6}",
    ".form-block{padding:88px max(24px,calc((100vw - var(--container))/2));background:var(--surface)}.form-block form{max-width:620px}.form-block input,.form-block textarea{display:block;width:100%;margin:12px 0;padding:15px;border:1px solid #dfe3ec;border-radius:var(--radius);background:var(--bg);font:inherit}.form-block textarea{min-height:130px}.calendar-placeholder{max-width:620px;padding:28px;border:1px dashed #cdd3df;border-radius:var(--radius);color:var(--muted);margin-bottom:18px}.builder-section-block{padding:70px max(24px,calc((100vw - var(--container))/2));background:var(--surface)}.builder-container-block{width:min(100%,var(--container));margin:auto;padding:24px}.builder-primitive-text{color:var(--muted);line-height:1.7}.builder-primitive-heading{font-family:var(--heading-font);font-weight:var(--heading-weight)}.builder-primitive-button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 18px;border-radius:var(--radius);background:var(--primary);color:#fff;text-decoration:none;font-weight:800}.builder-primitive-button.outline{background:transparent;color:var(--text);border:1px solid #d9dce5}.builder-primitive-image-wrap{margin:0;padding:0}.builder-primitive-image{display:block;width:100%;max-height:620px;min-height:280px;object-fit:cover;border-radius:var(--radius);box-shadow:0 22px 60px rgba(15,23,42,.12)}.builder-primitive-image-wrap figcaption{max-width:var(--container);margin:10px auto 0;padding:0 24px;color:var(--muted);font-size:11px}.builder-image-placeholder{min-height:180px;display:grid;place-items:center;align-content:center;border:1px dashed #cbd5e1;color:#64748b}.builder-primitive-icon{display:inline-grid;width:38px;height:38px;place-items:center;border-radius:var(--radius);background:var(--surface);color:var(--primary)}.builder-primitive-link{color:var(--primary);font-weight:800}.builder-primitive-divider{border:0;border-top:1px solid #e2e8f0}.builder-primitive-columns{display:grid;gap:16px}.builder-primitive-columns.columns-2{grid-template-columns:repeat(2,1fr)}.builder-primitive-columns.columns-3{grid-template-columns:repeat(3,1fr)}.builder-primitive-columns.columns-4{grid-template-columns:repeat(4,1fr)}.builder-column{min-height:100px;padding:18px;border:1px dashed #cbd5e1;border-radius:var(--radius);background:var(--surface)}.builder-column>span{display:block;margin-bottom:8px;color:var(--muted);font-size:8px;font-weight:800;text-transform:uppercase}.quote-card{max-width:760px;padding:28px;border-radius:var(--radius);background:var(--surface);font-size:20px;line-height:1.55}.quote-card strong{display:block;margin-top:16px;font-size:12px}.faq-list{max-width:760px}.faq-list details{padding:18px 0;border-bottom:1px solid #e3e6ed}.faq-list summary{cursor:pointer;font-weight:700}.faq-list p{color:var(--muted)}.footer-block{min-height:160px;display:flex;align-items:center;justify-content:space-between;gap:28px;padding:38px max(24px,calc((100vw - var(--container))/2));background:var(--text);color:#fff}.footer-block strong{font-size:18px}.footer-block p{margin:7px 0 0;font-size:12px;opacity:.55}.footer-block nav{display:flex;flex-wrap:wrap;gap:18px}.footer-block nav a{color:#fff;text-decoration:none;font-size:12px;opacity:.72}.footer-block nav a:hover{opacity:1}",
    "@media(max-width:768px){.header-block{padding:0 20px}.header-block nav a:not(.nav-cta){display:none}.hero-block{grid-template-columns:1fr;min-height:auto;padding:64px 24px}.hero-block h1{font-size:clamp(42px,13vw,64px)}.hero-shape{width:220px}.feature-block,.form-block,.builder-section-block{padding:60px 24px}.feature-grid{grid-template-columns:1fr}.builder-primitive-columns.columns-2,.builder-primitive-columns.columns-3,.builder-primitive-columns.columns-4{grid-template-columns:1fr}.footer-block{padding:28px 24px;flex-direction:column;align-items:flex-start}}",
    responsiveRules(page.elements)
  ].join("");
  return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>"+escapeHtml(page.seo?.title||page.title||businessName||"Website")+"</title><meta name=\"description\" content=\""+escapeHtml(page.seo?.description||document.site.seo.description||businessName||"Website")+"\"><style>"+css+"</style></head><body>"+body+"</body></html>";
}

async function uploadR2(path:string,data:string,contentType:string){
  const account=process.env.CLOUDFLARE_ACCOUNT_ID;
  const token=process.env.CLOUDFLARE_API_TOKEN;
  const bucket=process.env.R2_BUCKET;
  if(!account||!token||!bucket)throw new Error("Cloudflare R2 publishing is not configured on the server.");
  const encodedPath=path.split("/").map(encodeURIComponent).join("/");
  const response=await fetch("https://api.cloudflare.com/client/v4/accounts/"+account+"/r2/buckets/"+encodeURIComponent(bucket)+"/objects/"+encodedPath,{method:"PUT",headers:{Authorization:"Bearer "+token,"Content-Type":contentType},body:data});
  if(!response.ok)throw new Error("R2 upload failed with HTTP "+response.status+".");
}

function siteRootDomain(){return(process.env.NEXT_PUBLIC_SITE_ROOT_DOMAIN||process.env.SITES_ROOT_DOMAIN||"fellacoo.xyz").replace(/^https?:\/\//,"").replace(/\/$/,"");}
function pageOutputPath(slug:string,page:BuilderPage){const clean=page.path.replace(/^\//,"").replace(/\/$/,"");return clean?"sites/"+slug+"/"+clean+"/index.html":"sites/"+slug+"/index.html";}

export async function publishWebsite(input:PublishInput):Promise<PublishResult>{
  const sql=getDb();
  const builds=await sql<any[]> `select id,business_name,status,assembly,preview,slug,live_version from public.build_requests where id=${input.buildRequestId} and owner_id=${input.ownerId} limit 1`;
  const build=builds[0];if(!build)throw new Error("Website project was not found.");
  const document=normalizeBuilderDocument(build.assembly)||normalizeBuilderDocument(build.preview);
  if(!document)throw new Error("This website has no valid builder document to publish.");
  let slug=slugify(input.slug?.trim()||build.slug||build.business_name);
  const conflicts=await sql<any[]> `select id from public.build_requests where slug=${slug} and id<>${build.id} limit 1`;
  if(conflicts[0])slug=slug+"-"+String(build.id).slice(0,6);

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
  const rootUrl="https://"+slug+"."+siteRootDomain();
  const deliveryUrl=(process.env.R2_PUBLIC_BASE||"https://cdn.fellacoo.xyz").replace(/\/$/,"")+"/sites/"+slug+"/index.html";

  await sql.begin(async(tx)=>{
    await tx`update public.site_versions set status=${"SUPERSEDED"} where build_request_id=${build.id} and status=${"LIVE"}`;
    await tx`insert into public.site_versions (id,build_request_id,version,status,total_bytes,initial_payload_bytes,qa,files,created_at,pinned) values (${crypto.randomUUID()},${build.id},${version},${"LIVE"},${bytes},${bytes},${tx.json({warnings:[]})},${tx.json(files)},${new Date().toISOString()},${false})`;
    await tx`update public.build_requests set assembly=${tx.json(JSON.parse(JSON.stringify(document)))},preview=${tx.json(JSON.parse(JSON.stringify(document)))},compiled_html=${htmlByPage[0]?.html||""},slug=${slug},status=${"published"},published_url=${rootUrl},published_bytes=${bytes},live_version=${version} where id=${build.id} and owner_id=${input.ownerId}`;
    const hostname=slug+"."+siteRootDomain();
    const domains=await tx<any[]> `select id from public.site_domains where site_id=${build.id} and hostname=${hostname} limit 1`;
    if(!domains[0])await tx`insert into public.site_domains (id,site_id,hostname,slug,domain_type,status,created_at,verified_at,meta) values (${crypto.randomUUID()},${build.id},${hostname},${slug},${"FELACOO_SUBDOMAIN"},${"ACTIVE"},${new Date().toISOString()},${new Date().toISOString()},${tx.json({source:"fellacoo-web",publicUrl:rootUrl,deliveryUrl})})`;
    await tx`insert into public.website_versions (id,build_request_id,preview,label,credits_charged,created_by,created_at) values (${crypto.randomUUID()},${build.id},${tx.json(JSON.parse(JSON.stringify(document)))},${"Published v"+version},${0},${input.ownerId},${new Date().toISOString()})`;
  });

  return {ok:true,buildRequestId:build.id,version,slug,url:rootUrl,bytes};
}
