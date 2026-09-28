"use client";

import { useEffect, useMemo, useState, type CSSProperties, type DragEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown, ArrowLeft, ArrowUp, ChevronDown, ChevronRight, Copy, Eye, FilePlus2,
  Globe2, LayoutTemplate, Layers3, Menu, Monitor, MousePointer2, PanelLeft,
  PanelRight, Palette, Plus, Redo2, Save, Settings2, Smartphone, Tablet,
  Trash2, Undo2, X
} from "lucide-react";
import type {
  BuilderDocument, BuilderElement, BuilderPage, BuilderTheme, BuilderViewport
} from "@/types/builder";
import { PrimitivePreview } from "@/components/builder/primitives";
import { useBuilderHistory } from "@/lib/builder/use-builder-history";
import { useAuth } from "@/lib/state/auth-store";

type ComponentCategory = "Layout" | "Content" | "Commerce" | "Business";
type ComponentDefinition = { type: string; label: string; description: string; category: ComponentCategory };

const library: ComponentDefinition[] = [
  ["section","Section","Full-width content section","Layout"],["container","Container","Centered content wrapper","Layout"],
  ["columns","Columns","Multi-column layout","Layout"],["spacer","Spacer","Flexible vertical space","Layout"],
  ["text","Text","Paragraph text","Content"],["heading","Heading","Section or page heading","Content"],
  ["image","Image","Image or visual media","Content"],["icon","Icon","Simple visual icon","Content"],
  ["link","Link","Text link","Content"],["divider","Divider","Horizontal separator","Content"],
  ["button","Button","Call-to-action button","Content"],["header","Header","Navigation and brand","Layout"],
  ["hero","Hero","Headline and primary CTA","Layout"],["features","Features","Benefits or services","Content"],
  ["services","Services","Service cards","Content"],["products","Products","Store product grid","Commerce"],
  ["pricing","Pricing","Plans and offers","Commerce"],["lead-form","Lead Form","Capture enquiries","Business"],
  ["booking","Booking","Appointments and availability","Business"],["quote","Quote Request","Request a quotation","Business"],
  ["testimonials","Testimonials","Social proof","Content"],["faq","FAQ","Frequently asked questions","Content"],
  ["footer","Footer","Footer and legal links","Layout"]
].map(([type,label,description,category]) => ({ type, label, description, category: category as ComponentCategory }));

const defaultTheme: BuilderTheme = {
  colors: { primary:"#7c3aed", secondary:"#ec4899", accent:"#3b82f6", text:"#111522", muted:"#697287", background:"#ffffff", surface:"#f7f8fb" },
  typography: { headingFont:"Inter, ui-sans-serif, system-ui, sans-serif", bodyFont:"Inter, ui-sans-serif, system-ui, sans-serif", headingWeight:"800", bodyWeight:"400" },
  radius:"12px", containerWidth:"1180px", buttonStyle:"solid"
};

const initialDocument: BuilderDocument = {
  version:1,
  site:{ brandName:"Your Business", tagline:"Build a business people remember.", theme:defaultTheme, seo:{ title:"Your Business", description:"A responsive website built with Fellacoo." } },
  pages:[{
    id:"home", path:"/", title:"Home",
    elements:[
      { id:"header-1", type:"header", props:{brand:"Your Business",nav1:"Home",nav2:"Services",nav3:"About",nav4:"Contact",cta:"Get Started"} },
      { id:"hero-1", type:"hero", props:{eyebrow:"WELCOME",title:"Build a business people remember.",description:"A responsive website built from reusable Fellacoo components.",primary:"Get Started",secondary:"Learn More",primaryUrl:"#",secondaryUrl:"#"} },
      { id:"features-1", type:"features", props:{title:"Everything your customers need.",item1:"Fast setup",item1Description:"A clear foundation designed around your business.",item2:"Mobile ready",item2Description:"A responsive experience across every screen.",item3:"Built to convert",item3Description:"Focused content and calls to action."} },
      { id:"footer-1", type:"footer", props:{brand:"Your Business",copyright:"© 2026 · Privacy · Terms · Contact"} }
    ]
  }]
};

const storageKey = "fellacoo-builder:draft:v2";

function normalizeDocument(value: unknown): BuilderDocument {
  const raw = typeof value === "string" ? parseJson(value) : value;
  const old = (raw && typeof raw === "object" ? raw : {}) as Partial<BuilderDocument> & { pages?: BuilderPage[]; site?: BuilderDocument["site"] };
  const pages = Array.isArray(old.pages) && old.pages.length ? old.pages : initialDocument.pages;
  const site = old.site ?? {
    brandName: "Your Business",
    tagline: "Build a business people remember.",
    theme: defaultTheme,
    seo: { title:"Your Business", description:"A responsive website built with Fellacoo." }
  };
  return {
    version:1,
    site:{ ...initialDocument.site, ...site, theme:{ ...defaultTheme, ...(site.theme ?? {}), colors:{...defaultTheme.colors,...(site.theme?.colors ?? {})}, typography:{...defaultTheme.typography,...(site.theme?.typography ?? {})} }, seo:{...initialDocument.site.seo,...(site.seo ?? {})} },
    pages: pages.map((page) => ({ ...page, path: page.path || "/", title: page.title || "Page", elements: Array.isArray(page.elements) ? page.elements : [] }))
  };
}

function parseJson(value: string) { try { return JSON.parse(value); } catch { return null; } }

export function BuilderEditor({ projectId }: { projectId?: string }) {
  const { document, updateDocument, resetDocument, undo, redo, canUndo, canRedo } = useBuilderHistory(initialDocument);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedId, setSelectedId] = useState("hero-1");
  const [viewport, setViewport] = useState<BuilderViewport>("desktop");
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);
  const [libraryFilter, setLibraryFilter] = useState<ComponentCategory | "All">("All");
  const [leftTab, setLeftTab] = useState<"components"|"pages">("components");
  const [inspectorTab, setInspectorTab] = useState<"element"|"site">("element");
  const [saved, setSaved] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"checking"|"local"|"saving"|"synced"|"error">("checking");
  const [buildRequestId, setBuildRequestId] = useState<string | null>(projectId ?? null);
  const [projectName, setProjectName] = useState("Untitled Website");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<"idle"|"publishing"|"published"|"error">("idle");
  const [publishMessage, setPublishMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number|null>(null);
  const [draggingElementId, setDraggingElementId] = useState<string|null>(null);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const page = document.pages[Math.min(activePageIndex, Math.max(document.pages.length - 1, 0))] ?? document.pages[0];
  const selected = page ? findElementById(page.elements, selectedId) : null;

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.replace("/login?next=" + encodeURIComponent(window.location.pathname));
  }, [authLoading,isAuthenticated,router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    let active = true;
    (async () => {
      try {
        const url = projectId ? "/api/builder/draft?id="+encodeURIComponent(projectId) : "/api/builder/draft";
        const response = await fetch(url,{cache:"no-store"});
        if (!active) return;
        if (!response.ok) { setSyncStatus(response.status===401||response.status===403?"local":"error"); return; }
        const payload = await response.json() as { draft?: { id:string; document:unknown; businessName?:string|null; publishedUrl?:string|null }|null };
        if (projectId) {
          if (!payload.draft?.document) { setSyncStatus("error"); return; }
          const next = normalizeDocument(payload.draft.document);
          resetDocument(next);
          setProjectName(payload.draft.businessName?.trim() || next.site.brandName || "Untitled Website");
          setBuildRequestId(payload.draft.id);
          setPublishedUrl(payload.draft.publishedUrl ?? null);
          setActivePageIndex(0);
          setSelectedId(next.pages[0]?.elements[0]?.id ?? "");
          window.localStorage.setItem(storageKey,JSON.stringify(next));
          window.localStorage.setItem(storageKey+":build-request-id",payload.draft.id);
        }
        setSyncStatus("synced");
      } catch { if (active) setSyncStatus("local"); }
    })();
    return () => { active=false; };
  }, [projectId,authLoading,isAuthenticated,resetDocument]);

  useEffect(() => {
    setSaved(false);
    const timer = window.setTimeout(async () => {
      try { window.localStorage.setItem(storageKey,JSON.stringify(document)); setSaved(true); } catch {}
      if (!isAuthenticated || authLoading) return;
      setSyncStatus("saving");
      try {
        const response = await fetch("/api/builder/draft",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
          buildRequestId,document,businessName:projectName.trim()||document.site.brandName||"Untitled Website",activity:"Website",location:"Online"
        })});
        if (!response.ok) { setSyncStatus(response.status===401||response.status===403?"local":"error"); return; }
        const payload = await response.json() as { buildRequestId?:string };
        if (payload.buildRequestId) { setBuildRequestId(payload.buildRequestId); window.localStorage.setItem(storageKey+":build-request-id",payload.buildRequestId); }
        setSyncStatus("synced");
      } catch { setSyncStatus("local"); }
    },650);
    return () => window.clearTimeout(timer);
  }, [document,projectName,isAuthenticated,authLoading,buildRequestId]);

  useEffect(() => {
    const handler = (event:KeyboardEvent) => {
      if (!(event.ctrlKey||event.metaKey)) return;
      const key=event.key.toLowerCase();
      if (key==="z") { event.preventDefault(); event.shiftKey ? redo() : undo(); }
      if (key==="y") { event.preventDefault(); redo(); }
      if (key==="s") { event.preventDefault(); void saveDraft(); }
    };
    window.addEventListener("keydown",handler); return()=>window.removeEventListener("keydown",handler);
  },[undo,redo]);

  useEffect(() => {
    if (!previewOpen) return;
    const handler=(event:KeyboardEvent)=>{ if(event.key==="Escape") setPreviewOpen(false); };
    window.addEventListener("keydown",handler); return()=>window.removeEventListener("keydown",handler);
  },[previewOpen]);

  async function saveDraft(): Promise<string|null> {
    setSyncStatus("saving");
    try { window.localStorage.setItem(storageKey,JSON.stringify(document)); setSaved(true); } catch { setSaved(false); }
    if (!isAuthenticated || authLoading) { setSyncStatus("local"); return null; }
    try {
      const response=await fetch("/api/builder/draft",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        buildRequestId,document,businessName:projectName.trim()||document.site.brandName||"Untitled Website",activity:"Website",location:"Online"
      })});
      if(!response.ok){setSyncStatus(response.status===401||response.status===403?"local":"error");return null;}
      const payload=await response.json() as {buildRequestId?:string};
      if(payload.buildRequestId){
        const created=!buildRequestId;
        setBuildRequestId(payload.buildRequestId);
        window.localStorage.setItem(storageKey+":build-request-id",payload.buildRequestId);
        if(created&&!projectId) router.replace("/builder/"+payload.buildRequestId);
      }
      setSaved(true);setSyncStatus("synced");return payload.buildRequestId??buildRequestId;
    } catch { setSyncStatus("local"); return null; }
  }

  async function publishCurrentWebsite() {
    setPublishState("publishing");setPublishMessage("");
    try {
      const id=buildRequestId??await saveDraft();
      if(!id){setPublishState("error");setPublishMessage("Save the website to Fellacoo before publishing.");return;}
      const response=await fetch("/api/builder/publish",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({buildRequestId:id})});
      const payload=await response.json() as {url?:string;error?:string};
      if(!response.ok){setPublishState("error");setPublishMessage(payload.error||"Publishing failed.");return;}
      setPublishedUrl(payload.url??null);setPublishState("published");setPublishMessage(payload.url?"Your website is live.":"Website published.");
    } catch { setPublishState("error");setPublishMessage("Publishing failed. Please try again."); }
  }

  function patchDocument(patch:(current:BuilderDocument)=>BuilderDocument){updateDocument(patch);}

  function updateSite(patch:Partial<BuilderDocument["site"]>) {
    patchDocument(current=>({...current,site:{...current.site,...patch}}));
  }
  function updateTheme(patch:Partial<BuilderTheme>) {
    patchDocument(current=>({...current,site:{...current.site,theme:{...current.site.theme,...patch}}}));
  }
  function updateThemeColors(patch:Partial<BuilderTheme["colors"]>) {
    patchDocument(current=>({...current,site:{...current.site,theme:{...current.site.theme,colors:{...current.site.theme.colors,...patch}}}}));
  }
  function updateThemeTypography(patch:Partial<BuilderTheme["typography"]>) {
    patchDocument(current=>({...current,site:{...current.site,theme:{...current.site.theme,typography:{...current.site.theme.typography,...patch}}}}));
  }

  function addPage() {
    const n=document.pages.length+1;
    const id="page-"+Date.now();
    const title="New Page";
    const path="/"+slugify(title)+"-"+n;
    const nextPage:BuilderPage={id,path,title,elements:[
      {id:id+"-header",type:"header",props:{brand:document.site.brandName,nav1:"Home",nav2:"Services",nav3:"About",nav4:"Contact",cta:"Get Started"}},
      {id:id+"-hero",type:"hero",props:{eyebrow:"WELCOME",title:"Your new page.",description:"Add content that moves your customers forward.",primary:"Get Started",secondary:"Learn More",primaryUrl:"#",secondaryUrl:"#"}},
      {id:id+"-footer",type:"footer",props:{brand:document.site.brandName,copyright:"© 2026 · Privacy · Terms · Contact"}}
    ],seo:{title,description:""}};
    patchDocument(current=>({...current,pages:[...current.pages,nextPage]}));
    setActivePageIndex(document.pages.length);setSelectedId(nextPage.elements[1].id);
  }

  function duplicatePage(index:number) {
    const source=document.pages[index];
    const copy:BuilderPage={...source,id:"page-"+Date.now(),title:source.title+" Copy",path:source.path===" /" ? "/" : source.path+"-copy",elements:cloneElements(source.elements),seo:{...source.seo}};
    copy.path=uniquePagePath(document.pages,copy.path);
    patchDocument(current=>({...current,pages:[...current.pages,copy]}));
    setActivePageIndex(document.pages.length);setSelectedId(copy.elements[0]?.id??"");
  }

  function removePage(index:number) {
    if(document.pages.length<=1) return;
    const target=document.pages[index];
    if(!window.confirm("Delete "+target.title+"?")) return;
    patchDocument(current=>({...current,pages:current.pages.filter((_,i)=>i!==index)}));
    const next=Math.max(0,Math.min(index,document.pages.length-2));
    setActivePageIndex(next);setSelectedId(document.pages[next]?.elements[0]?.id??"");
  }

  function updatePage(patch:Partial<BuilderPage>) {
    patchDocument(current=>({...current,pages:current.pages.map((p,i)=>i===activePageIndex?{...p,...patch}:p)}));
  }

  function addChild(type:string) {
    if(!selectedId||!page)return;
    const child:BuilderElement={id:type+"-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),type,props:defaultProps(type)};
    patchDocument(current=>({...current,pages:current.pages.map((p,i)=>i===activePageIndex?{...p,elements:appendChildToTree(p.elements,selectedId,child)}:p)}));
    setSelectedId(child.id);
  }

  function insertComponent(type:string,index=page.elements.length) {
    if(!page)return;
    const element:BuilderElement={id:type+"-"+Date.now(),type,props:defaultProps(type)};
    patchDocument(current=>({...current,pages:current.pages.map((p,i)=>{
      if(i!==activePageIndex)return p;const elements=[...p.elements];elements.splice(Math.max(0,Math.min(index,elements.length)),0,element);return {...p,elements};
    })}));
    setSelectedId(element.id);setDragOverIndex(null);
  }

  function updateSelected(patch:Record<string,unknown>) {
    if(!selectedId)return;
    patchDocument(current=>({...current,pages:current.pages.map((p,i)=>i===activePageIndex?{...p,elements:updateElementTree(p.elements,selectedId,e=>({...e,props:{...e.props,...patch}}))}:p)}));
  }

  function updateSelectedDesign(key:string,value:unknown) {
    if(!selectedId)return;
    patchDocument(current=>({...current,pages:current.pages.map((p,i)=>i===activePageIndex?{...p,elements:updateElementTree(p.elements,selectedId,e=>{
      const design=(e.props.design??{}) as Record<string,unknown>;
      const nextDesign=viewport==="desktop"?{...design,[key]:value}:{...design,responsive:{...((design.responsive??{}) as Record<string,unknown>),[viewport]:{...(((design.responsive??{}) as Record<string,unknown>)[viewport] as Record<string,unknown>??{}),[key]:value}}};
      return {...e,props:{...e.props,design:nextDesign}};
    })}:p)}));
  }

  function updateSelectedResponsiveReset(key:string) {
    if(!selectedId||viewport==="desktop")return;
    patchDocument(current=>({...current,pages:current.pages.map((p,i)=>i===activePageIndex?{...p,elements:updateElementTree(p.elements,selectedId,e=>{
      const design=(e.props.design??{}) as Record<string,unknown>;const responsive=(design.responsive??{}) as Record<string,unknown>;const next={...responsive};const bucket={...((next[viewport]??{}) as Record<string,unknown>)};delete bucket[key];next[viewport]=bucket;return {...e,props:{...e.props,design:{...design,responsive:next}}};
    })}:p)}));
  }

  function removeSelected(){
    if(!selectedId||!page)return;
    const next=findAdjacentElement(page.elements,selectedId);
    patchDocument(current=>({...current,pages:current.pages.map((p,i)=>i===activePageIndex?{...p,elements:removeElementTree(p.elements,selectedId)}:p)}));
    setSelectedId(next?.id??"");
  }

  function moveSelected(direction:"up"|"down"){
    if(!page)return;
    patchDocument(current=>({...current,pages:current.pages.map((p,i)=>{
      if(i!==activePageIndex)return p;const elements=[...p.elements];moveElementTree(elements,selectedId,direction);return {...p,elements};
    })}));
  }

  function beginLibraryDrag(event:DragEvent,type:string){event.dataTransfer.effectAllowed="copy";event.dataTransfer.setData("application/x-fellacoo-component",type);}
  function beginElementDrag(event:DragEvent,id:string){event.dataTransfer.effectAllowed="move";event.dataTransfer.setData("application/x-fellacoo-element",id);setDraggingElementId(id);}
  function handleCanvasDragOver(event:DragEvent,index:number){event.preventDefault();event.dataTransfer.dropEffect=event.dataTransfer.types.includes("application/x-fellacoo-component")?"copy":"move";setDragOverIndex(index);}
  function handleCanvasDrop(event:DragEvent,index:number){
    event.preventDefault();
    const componentType=event.dataTransfer.getData("application/x-fellacoo-component");
    const elementId=event.dataTransfer.getData("application/x-fellacoo-element");
    if(componentType){insertComponent(componentType,index);}
    else if(elementId&&page){
      const source=page.elements.findIndex(e=>e.id===elementId);if(source<0)return;
      let target=Math.max(0,Math.min(index,page.elements.length));if(source<target)target-=1;
      if(source!==target){const elements=[...page.elements];const[moved]=elements.splice(source,1);elements.splice(target,0,moved);patchDocument(current=>({...current,pages:current.pages.map((p,i)=>i===activePageIndex?{...p,elements}:p)}));setSelectedId(elementId);}
      setDragOverIndex(null);setDraggingElementId(null);
    }
  }

  const visibleLibrary=useMemo(()=>library.filter(item=>libraryFilter==="All"||item.category===libraryFilter),[libraryFilter]);
  if(!page)return null;

  const themeVars={
    "--fb-primary":document.site.theme.colors.primary,
    "--fb-secondary":document.site.theme.colors.secondary,
    "--fb-accent":document.site.theme.colors.accent,
    "--fb-text":document.site.theme.colors.text,
    "--fb-muted":document.site.theme.colors.muted,
    "--fb-background":document.site.theme.colors.background,
    "--fb-surface":document.site.theme.colors.surface,
    "--fb-radius":document.site.theme.radius,
    "--fb-container":document.site.theme.containerWidth,
    "--fb-heading-font":document.site.theme.typography.headingFont,
    "--fb-body-font":document.site.theme.typography.bodyFont
  } as CSSProperties;

  return <main className="builder-app">
    <header className="builder-topbar">
      <div className="builder-top-left">
        <button className="builder-icon-button" onClick={()=>{setLeftOpen(v=>!v);setRightOpen(false)}} title="Toggle builder panel"><Menu size={19}/></button>
        <a className="builder-back" href="/dashboard"><ArrowLeft size={16}/>Dashboard</a><span className="builder-divider"/>
        <div className="builder-project">
          <input value={projectName} onChange={e=>setProjectName(e.target.value)} onBlur={()=>{if(projectName.trim())void saveDraft()}}/>
          <small>{publishState==="published"&&publishedUrl?<a href={publishedUrl} target="_blank" rel="noreferrer" className="builder-live-link">Live website ↗</a>:saved?(syncStatus==="synced"?"Synced with Fellacoo":"Saved locally"):"Saving…"}</small>
        </div>
      </div>
      <div className="builder-viewport">
        <ViewportButton active={viewport==="desktop"} onClick={()=>setViewport("desktop")} icon={<Monitor size={16}/>} label="Desktop"/>
        <ViewportButton active={viewport==="tablet"} onClick={()=>setViewport("tablet")} icon={<Tablet size={16}/>} label="Tablet"/>
        <ViewportButton active={viewport==="mobile"} onClick={()=>setViewport("mobile")} icon={<Smartphone size={16}/>} label="Mobile"/>
      </div>
      <div className="builder-top-actions">
        <button className="builder-save" onClick={saveDraft} disabled={syncStatus==="saving"}><Save size={15}/>{syncStatus==="saving"?"Saving":saved?"Saved":"Save"}</button>
        <button className="builder-preview" onClick={()=>setPreviewOpen(true)}><Eye size={16}/>Preview</button>
        <button className="builder-publish" onClick={publishCurrentWebsite} disabled={publishState==="publishing"}>{publishState==="publishing"?"Publishing…":publishState==="published"?"Published":"Publish"}</button>
      </div>
    </header>

    {publishMessage&&<div className={"builder-publish-toast "+(publishState==="error"?"is-error":"")}><span>{publishMessage}</span>{publishedUrl&&<a href={publishedUrl} target="_blank" rel="noreferrer">Open live site ↗</a>}<button onClick={()=>setPublishMessage("")}>×</button></div>}

    <div className="builder-workspace">
      {(leftOpen||rightOpen)&&<button className="builder-panel-backdrop" aria-label="Close panels" onClick={()=>{setLeftOpen(false);setRightOpen(false)}}/>}
      {leftOpen&&<aside className="builder-left is-open">
        <div className="builder-panel-head"><div><small>WEBSITE BUILDER</small><strong>{leftTab==="pages"?"Pages":"Components"}</strong></div><button onClick={()=>setLeftOpen(false)}><X size={16}/></button></div>
        <div className="builder-stage-tabs"><button className={leftTab==="components"?"active":""} onClick={()=>setLeftTab("components")}><Layers3 size={13}/>Components</button><button className={leftTab==="pages"?"active":""} onClick={()=>setLeftTab("pages")}><LayoutTemplate size={13}/>Pages</button></div>
        {leftTab==="pages"?<PageManager pages={document.pages} active={activePageIndex} onSelect={(index)=>{setActivePageIndex(index);setSelectedId(document.pages[index]?.elements[0]?.id??"")}} onAdd={addPage} onDuplicate={duplicatePage} onRemove={removePage}/>:<>
          <div className="builder-layers-head"><span><Layers3 size={13}/>Layers</span><small>{countElements(page.elements)} elements</small></div>
          <div className="builder-layer-tree">{page.elements.map(element=><LayerTreeItem key={element.id} element={element} selectedId={selectedId} onSelect={setSelectedId} depth={0}/>)}</div>
          <div className="component-tabs">{(["All","Layout","Content","Commerce","Business"] as const).map(category=><button key={category} className={libraryFilter===category?"active":""} onClick={()=>setLibraryFilter(category)}>{category}</button>)}</div>
          <div className="component-library">{visibleLibrary.map(item=><button className="component-item" key={item.type} draggable onDragStart={e=>beginLibraryDrag(e,item.type)} onClick={()=>insertComponent(item.type)} title={"Click or drag "+item.label+" to canvas"}><span className="component-item-icon"><Plus size={14}/></span><span><strong>{item.label}</strong><small>{item.description}</small></span><span className="component-drag-grip">⋮⋮</span></button>)}</div>
          <button className="builder-left-footer" onClick={()=>{setRightOpen(true);setInspectorTab("site");setLeftOpen(false)}}><Palette size={15}/><span>Brand Kit</span><ChevronRight size={14}/></button>
        </>}
      </aside>}

      <section className="builder-canvas-area">
        <div className="canvas-toolbar">
          <span><MousePointer2 size={14}/>Live design canvas <b>·</b> {page.title}</span>
          <div><button onClick={undo} disabled={!canUndo} title="Undo"><Undo2 size={15}/></button><button onClick={redo} disabled={!canRedo} title="Redo"><Redo2 size={15}/></button></div>
        </div>
        <div className={"canvas-stage "+(dragOverIndex!==null?"is-dragging":"")} onClick={()=>setSelectedId("")} onDragOver={e=>handleCanvasDragOver(e,page.elements.length)} onDrop={e=>handleCanvasDrop(e,page.elements.length)}>
          <div className={"website-canvas viewport-"+viewport} style={themeVars} data-builder-viewport={viewport}>
            <div className={"canvas-drop-zone "+(dragOverIndex===0?"is-active":"")} onDragOver={e=>handleCanvasDragOver(e,0)} onDrop={e=>handleCanvasDrop(e,0)}/>
            {page.elements.map((element,index)=><div key={element.id} className="builder-drop-wrapper">{dragOverIndex===index&&<div className="builder-drop-indicator"><span>Drop component here</span></div>}<BuilderBlock element={element} selected={selectedId===element.id} selectedId={selectedId} selectElement={setSelectedId} viewport={viewport} dragging={draggingElementId===element.id} onDragStart={beginElementDrag} onDragEnd={()=>{setDraggingElementId(null);setDragOverIndex(null)}} onDragOver={e=>handleCanvasDragOver(e,index+1)} onDrop={e=>handleCanvasDrop(e,index+1)}/></div>)}
            {dragOverIndex===page.elements.length&&<div className="builder-drop-indicator is-end"><span>Drop component here</span></div>}
          </div>
        </div>
      </section>

      {rightOpen&&<aside className="builder-right is-open">
        <div className="builder-panel-head"><div><small>DESIGN SYSTEM</small><strong>{inspectorTab==="site"?"Brand Kit":"Properties"}</strong></div><button onClick={()=>setRightOpen(false)}><X size={16}/></button></div>
        <div className="builder-inspector-tabs"><button className={inspectorTab==="element"?"active":""} onClick={()=>setInspectorTab("element")}><Settings2 size={13}/>Element</button><button className={inspectorTab==="site"?"active":""} onClick={()=>setInspectorTab("site")}><Globe2 size={13}/>Site</button></div>
        {inspectorTab==="site"?<SitePanel document={document} page={page} updateSite={updateSite} updateTheme={updateTheme} updateThemeColors={updateThemeColors} updateThemeTypography={updateThemeTypography} updatePage={updatePage}/>:selected?<PropertyPanel element={selected} viewport={viewport} update={updateSelected} updateDesign={updateSelectedDesign} resetResponsive={updateSelectedResponsiveReset} remove={removeSelected} move={moveSelected} addChild={addChild}/>:<div className="empty-properties"><Settings2 size={22}/><p>Select a component to edit it.</p></div>}
      </aside>}

      {!leftOpen&&<button className="floating-panel-button left" onClick={()=>{setRightOpen(false);setLeftOpen(true)}}><PanelLeft size={17}/></button>}
      {!rightOpen&&<button className="floating-panel-button right" onClick={()=>{setLeftOpen(false);setRightOpen(true)}}><PanelRight size={17}/></button>}
    </div>

    {previewOpen&&<div className="builder-preview-overlay" role="dialog" aria-modal="true">
      <div className="builder-preview-shell">
        <div className="builder-preview-toolbar"><div><strong>{page.title} Preview</strong><span>{document.pages.length} page{document.pages.length===1?"":"s"} · {viewport}</span></div><button onClick={()=>setPreviewOpen(false)}><X size={18}/></button></div>
        <div className="builder-preview-stage"><div className={"website-canvas viewport-"+viewport} style={themeVars}>{page.elements.map(element=><div className="builder-preview-block" key={element.id}><StaticPreviewTree element={element} viewport={viewport}/></div>)}</div></div>
      </div>
    </div>}
  </main>;
}

function BuilderBlock({element,selected,selectedId,selectElement,viewport,dragging,onDragStart,onDragEnd,onDragOver,onDrop}:{element:BuilderElement;selected:boolean;selectedId:string;selectElement:(id:string)=>void;viewport:BuilderViewport;dragging:boolean;onDragStart:(e:DragEvent,id:string)=>void;onDragEnd:()=>void;onDragOver:(e:DragEvent)=>void;onDrop:(e:DragEvent)=>void}) {
  return <div className={"builder-block "+(selected?"is-selected ":"")+(dragging?"is-dragging":"")} draggable onDragStart={e=>onDragStart(e,element.id)} onDragEnd={onDragEnd} onDragOver={e=>{e.preventDefault();e.stopPropagation();onDragOver(e)}} onDrop={e=>{e.preventDefault();e.stopPropagation();onDrop(e)}} onClick={e=>{e.stopPropagation();selectElement(element.id)}}>
    <div className="builder-drag-handle" title="Drag to reorder">⋮⋮</div>{selected&&<div className="builder-selection-label">{element.type}</div>}
    <ComponentPreview element={element} viewport={viewport}>{element.children?.map(child=><div className="builder-nested-element" key={child.id}><BuilderBlock element={child} selected={selectedId===child.id} selectedId={selectedId} selectElement={selectElement} viewport={viewport} dragging={false} onDragStart={()=>{}} onDragEnd={()=>{}} onDragOver={()=>{}} onDrop={()=>{}}/></div>)}</ComponentPreview>
  </div>;
}

function ComponentPreview({element,children,viewport}:{element:BuilderElement;children?:ReactNode;viewport:BuilderViewport}) {
  const p=element.props;const style=getElementStyle(element,viewport);const nested=children?<div className="builder-nested-content">{children}</div>:null;
  if(["text","heading","button","image","icon","link","divider","spacer","columns"].includes(element.type))return <PrimitivePreview element={element} viewport={viewport}>{nested}</PrimitivePreview>;
  switch(element.type){
    case "section":return <section className="site-block builder-section-block" style={style}><small>{String(p.label??"SECTION")}</small><h2>{String(p.title??"Your section")}</h2>{nested}</section>;
    case "container":return <div className="builder-container-block" style={style}>{nested}</div>;
    case "header":return <div className="site-block header-block" style={style}><strong>{String(p.brand??"Your Business")}</strong><nav><span>{String(p.nav1??"Home")}</span><span>{String(p.nav2??"Services")}</span><span>{String(p.nav3??"About")}</span><span>{String(p.nav4??"Contact")}</span><button>{String(p.cta??"Get Started")}</button></nav>{nested}</div>;
    case "hero":return <section className="site-block hero-block" style={style}><div><small>{String(p.eyebrow??"WELCOME")}</small><h1>{String(p.title??"Your next customer starts here.")}</h1><p>{String(p.description??"")}</p><div><button>{String(p.primary??"Get Started")}</button><button className="ghost">{String(p.secondary??"Learn More")}</button></div></div><div className="hero-shape"><span/></div>{nested}</section>;
    case "features":return <section className="site-block feature-block" style={style}><small>WHY CHOOSE US</small><h2>{String(p.title??"Everything your customers need.")}</h2><div className="feature-grid">{[1,2,3].map(i=><article key={i}><span>✦</span><strong>{String(p["item"+i]??["Fast setup","Mobile ready","Built to convert"][i-1])}</strong><p>{String(p["item"+i+"Description"]??"Present this benefit clearly.")}</p></article>)}</div>{nested}</section>;
    case "services":return <section className="site-block feature-block" style={style}><small>{String(p.eyebrow??"SERVICES")}</small><h2>{String(p.title??"What we do.")}</h2><div className="feature-grid">{[1,2,3].map(i=><article key={i}><span>◈</span><strong>{String(p["item"+i]??["Consulting","Design","Support"][i-1])}</strong><p>{String(p["item"+i+"Description"]??"Present your service clearly.")}</p></article>)}</div>{nested}</section>;
    case "products":return <section className="site-block feature-block" style={style}><small>STORE</small><h2>{String(p.title??"Featured products.")}</h2><div className="feature-grid">{[1,2,3].map(i=><article key={i}><span>□</span><strong>{String(p["item"+i]??["Product One","Product Two","Product Three"][i-1])}</strong><p>{String(p["price"+i]??"R299.00")} · {String(p.cta??"Add to cart")}</p></article>)}</div>{nested}</section>;
    case "pricing":return <section className="site-block feature-block" style={style}><small>PRICING</small><h2>{String(p.title??"Simple plans.")}</h2><div className="feature-grid">{[1,2,3].map(i=><article key={i}><span>◇</span><strong>{String(p["item"+i]??["Starter","Growth","Pro"][i-1])}</strong><p>{String(p["price"+i]??"From R299 / month")}</p></article>)}</div>{nested}</section>;
    case "lead-form":return <section className="site-block form-block" style={style}><small>{String(p.eyebrow??"GET IN TOUCH")}</small><h2>{String(p.title??"Tell us what you need.")}</h2><input placeholder={String(p.namePlaceholder??"Your name")}/><input placeholder={String(p.emailPlaceholder??"Email address")}/><textarea placeholder={String(p.messagePlaceholder??"How can we help?")}/><button>{String(p.cta??"Send enquiry")}</button>{nested}</section>;
    case "booking":return <section className="site-block form-block" style={style}><small>BOOKING</small><h2>{String(p.title??"Choose a time.")}</h2><div className="calendar-placeholder">{String(p.helper??"Select date · Select time · Confirm booking")}</div>{nested}</section>;
    case "quote":return <section className="site-block form-block" style={style}><small>QUOTE</small><h2>{String(p.title??"Request a quote.")}</h2><input placeholder={String(p.placeholder??"What do you need?")}/><button>{String(p.cta??"Request quotation")}</button>{nested}</section>;
    case "testimonials":return <section className="site-block feature-block" style={style}><small>TRUSTED</small><h2>{String(p.title??"What customers say.")}</h2><div className="quote-card">“{String(p.quote??"Excellent service and a beautiful experience.")}”<strong>— {String(p.author??"Happy customer")}</strong></div>{nested}</section>;
    case "faq":return <section className="site-block feature-block" style={style}><small>FAQ</small><h2>{String(p.title??"Questions, answered.")}</h2><div className="faq-list">{[1,2,3].map(i=><div key={i}>{String(p["question"+i]??"Question")}<ChevronDown size={15}/></div>)}</div>{nested}</section>;
    case "footer":return <footer className="site-block footer-block" style={style}><strong>{String(p.brand??"Your Business")}</strong><span>{String(p.copyright??"© 2026 · Privacy · Terms · Contact")}</span>{nested}</footer>;
    default:return <div className="site-block feature-block" style={style}><h2>Component</h2>{nested}</div>;
  }
}

function getElementStyle(element:BuilderElement,viewport:BuilderViewport):CSSProperties{
  const base=(element.props.design??{}) as Record<string,unknown>;const override=viewport==="desktop"?{}:(((base.responsive??{}) as Record<string,unknown>)[viewport]??{}) as Record<string,unknown>;const design={...base,...override};const style:CSSProperties={};
  for(const key of ["backgroundColor","color","textColor","borderRadius","paddingTop","paddingBottom","textAlign","boxShadow","fontSize","fontWeight","lineHeight","display"]){const value=design[key];if(typeof value==="string"&&value)style[key==="textColor"?"color":key] = value as never;}
  if(design.hidden===true)style.display="none";return style;
}

function PropertyPanel({element,viewport,update,updateDesign,resetResponsive,remove,move,addChild}:{element:BuilderElement;viewport:BuilderViewport;update:(patch:Record<string,unknown>)=>void;updateDesign:(key:string,value:unknown)=>void;resetResponsive:(key:string)=>void;remove:()=>void;move:(direction:"up"|"down")=>void;addChild:(type:string)=>void}){
  const p=element.props;const design=(p.design??{}) as Record<string,unknown>;const responsive=(design.responsive??{}) as Record<string,unknown>;const override=(responsive[viewport]??{}) as Record<string,unknown>;
  const contentFields:Record<string,Array<[string,string]>>={
    section:[["Section label","label"],["Section title","title"]],container:[["Container label","label"]],columns:[["Column count","columns"]],spacer:[["Height","height"]],text:[["Text","text"]],heading:[["Heading","text"],["Heading level","level"]],button:[["Button label","label"],["Button URL","url"],["Variant","variant"]],image:[["Image URL","src"],["Alt text","alt"],["Caption","caption"]],icon:[["Symbol","symbol"],["Accessible label","label"]],link:[["Link label","label"],["URL","url"]],header:[["Brand name","brand"],["Navigation 1","nav1"],["Navigation 2","nav2"],["Navigation 3","nav3"],["Navigation 4","nav4"],["CTA","cta"]],hero:[["Eyebrow","eyebrow"],["Headline","title"],["Description","description"],["Primary CTA","primary"],["Secondary CTA","secondary"],["Primary URL","primaryUrl"],["Secondary URL","secondaryUrl"]],features:[["Section title","title"],["Card 1 title","item1"],["Card 1 description","item1Description"],["Card 2 title","item2"],["Card 2 description","item2Description"],["Card 3 title","item3"],["Card 3 description","item3Description"]],services:[["Eyebrow","eyebrow"],["Section title","title"],["Service 1","item1"],["Service 1 description","item1Description"],["Service 2","item2"],["Service 2 description","item2Description"],["Service 3","item3"],["Service 3 description","item3Description"]],products:[["Section title","title"],["Product 1","item1"],["Product 1 price","price1"],["Product 2","item2"],["Product 2 price","price2"],["Product 3","item3"],["Product 3 price","price3"],["Cart CTA","cta"]],pricing:[["Section title","title"],["Plan 1","item1"],["Plan 1 price","price1"],["Plan 2","item2"],["Plan 2 price","price2"],["Plan 3","item3"],["Plan 3 price","price3"]],"lead-form":[["Eyebrow","eyebrow"],["Title","title"],["Name placeholder","namePlaceholder"],["Email placeholder","emailPlaceholder"],["Message placeholder","messagePlaceholder"],["Submit button","cta"]],booking:[["Title","title"],["Helper text","helper"]],quote:[["Title","title"],["Field placeholder","placeholder"],["Submit button","cta"]],testimonials:[["Section title","title"],["Quote","quote"],["Customer name","author"]],faq:[["Section title","title"],["Question 1","question1"],["Question 2","question2"],["Question 3","question3"]],footer:[["Brand name","brand"],["Footer text","copyright"]]
  };
  const fields=contentFields[element.type]??[];
  const color=(label:string,key:string,fallback:string)=><label className="property-color-field"><span>{label}</span><div><input type="color" value={String(design[key]??fallback)} onChange={e=>updateDesign(key,e.target.value)}/><input value={String(design[key]??fallback)} onChange={e=>updateDesign(key,e.target.value)}/></div></label>;
  const select=(label:string,key:string,options:string[],fallback:string)=><label className="property-field"><span>{label}</span><select value={String((override[key]??design[key]??fallback))} onChange={e=>updateDesign(key,e.target.value)}>{options.map(v=><option key={v} value={v}>{v}</option>)}</select></label>;
  const field=(label:string,key:string)=><label className="property-field"><span>{label}</span><input value={String(p[key]??"")} onChange={e=>update({[key]:e.target.value})}/></label>;
  return <div className="properties-body">
    <div className="selected-component"><span><MousePointer2 size={14}/></span><div><small>SELECTED ELEMENT</small><strong>{element.type.replace("-"," ")}</strong></div></div>
    <div className="builder-responsive-badge"><span>Editing</span><strong>{viewport}</strong>{viewport!=="desktop"&&<button onClick={()=>Object.keys(override).forEach(key=>resetResponsive(key))}>Reset responsive</button>}</div>
    <details className="property-section property-section-collapsible" open><summary>Content</summary>{fields.length?fields.map(([label,key])=><div key={key}>{field(label,key)}</div>):<p className="property-hint">This element has no editable content yet.</p>}</details>
    <details className="property-section property-section-collapsible" open><summary>Colors</summary>{color("Background","backgroundColor","#ffffff")}{color("Text","textColor","#111522")}</details>
    <details className="property-section property-section-collapsible" open><summary>Layout</summary>{select("Text alignment","textAlign",["left","center","right"],"left")}{select("Corner radius","borderRadius",["0px","8px","16px","28px","999px"],"0px")}{select("Top spacing","paddingTop",["0px","24px","48px","70px","100px"],"0px")}{select("Bottom spacing","paddingBottom",["0px","24px","48px","70px","100px"],"0px")}{select("Shadow","boxShadow",["none","0 8px 24px rgba(15,23,42,.10)","0 20px 50px rgba(15,23,42,.16)"],"none")}</details>
    <details className="property-section property-section-collapsible"><summary>Typography</summary>{select("Font size","fontSize",["12px","14px","16px","18px","24px","32px","48px","64px"],"16px")}{select("Font weight","fontWeight",["400","500","600","700","800"],"400")}{select("Line height","lineHeight",["1.2","1.5","1.7","2"],"1.5")}</details>
    <details className="property-section property-section-collapsible"><summary>Nested elements</summary><p className="property-hint">Add a real child element inside the selected component.</p><div className="nested-add-grid">{library.filter(item=>item.type!=="header"&&item.type!=="footer").map(item=><button key={item.type} onClick={()=>addChild(item.type)}><Plus size={12}/>{item.label}</button>)}</div></details>
    <details className="property-section property-section-collapsible"><summary>Visibility</summary><label className="property-toggle"><span>Hide on {viewport}</span><input type="checkbox" checked={viewport==="desktop"?design.hidden===true:override.hidden===true} onChange={e=>updateDesign("hidden",e.target.checked)}/></label></details>
    <div className="property-section"><small>POSITION</small><div className="property-actions"><button onClick={()=>move("up")}><ArrowUp size={15}/>Move up</button><button onClick={()=>move("down")}><ArrowDown size={15}/>Move down</button></div></div>
    <div className="property-section"><small>COMPONENT</small><button className="delete-component" onClick={remove}><Trash2 size={15}/>Remove element</button></div>
  </div>;
}

function SitePanel({document,page,updateSite,updateTheme,updateThemeColors,updateThemeTypography,updatePage}:{document:BuilderDocument;page:BuilderPage;updateSite:(p:Partial<BuilderDocument["site"]>)=>void;updateTheme:(p:Partial<BuilderTheme>)=>void;updateThemeColors:(p:Partial<BuilderTheme["colors"]>)=>void;updateThemeTypography:(p:Partial<BuilderTheme["typography"]>)=>void;updatePage:(p:Partial<BuilderPage>)=>void}){
  const theme=document.site.theme;
  const text=(label:string,value:string,onChange:(value:string)=>void)=><label className="property-field"><span>{label}</span><input value={value} onChange={e=>onChange(e.target.value)}/></label>;
  const color=(label:string,key:keyof BuilderTheme["colors"])=> <label className="property-color-field"><span>{label}</span><div><input type="color" value={theme.colors[key]} onChange={e=>updateThemeColors({[key]:e.target.value})}/><input value={theme.colors[key]} onChange={e=>updateThemeColors({[key]:e.target.value})}/></div></label>;
  return <div className="properties-body">
    <div className="selected-component"><span><Globe2 size={14}/></span><div><small>GLOBAL DESIGN</small><strong>Brand Kit</strong></div></div>
    <details className="property-section property-section-collapsible" open><summary>Brand</summary>{text("Brand name",document.site.brandName,v=>updateSite({brandName:v}));text("Tagline",document.site.tagline,v=>updateSite({tagline:v}))}</details>
    <details className="property-section property-section-collapsible" open><summary>Colors</summary>{color("Primary","primary")}{color("Secondary","secondary")}{color("Accent","accent")}{color("Text","text")}{color("Muted","muted")}{color("Background","background")}{color("Surface","surface")}</details>
    <details className="property-section property-section-collapsible"><summary>Typography</summary>{text("Heading font",theme.typography.headingFont,v=>updateThemeTypography({headingFont:v}));text("Body font",theme.typography.bodyFont,v=>updateThemeTypography({bodyFont:v}));text("Heading weight",theme.typography.headingWeight,v=>updateThemeTypography({headingWeight:v}));text("Body weight",theme.typography.bodyWeight,v=>updateThemeTypography({bodyWeight:v}))}</details>
    <details className="property-section property-section-collapsible"><summary>Site layout</summary>{text("Container width",theme.containerWidth,v=>updateTheme({containerWidth:v}));text("Radius",theme.radius,v=>updateTheme({radius:v}))}<label className="property-field"><span>Button style</span><select value={theme.buttonStyle} onChange={e=>updateTheme({buttonStyle:e.target.value as BuilderTheme["buttonStyle"]})}><option value="solid">Solid</option><option value="soft">Soft</option><option value="outline">Outline</option><option value="pill">Pill</option></select></label></details>
    <details className="property-section property-section-collapsible" open><summary>Page · {page.title}</summary>{text("Page title",page.title,v=>updatePage({title:v}));text("URL path",page.path,v=>updatePage({path:v.startsWith("/")?v:"/"+v}));text("SEO title",page.seo?.title??"",v=>updatePage({seo:{...(page.seo??{}),title:v}}));text("SEO description",page.seo?.description??"",v=>updatePage({seo:{...(page.seo??{}),description:v}}))}</details>
  </div>;
}

function PageManager({pages,active,onSelect,onAdd,onDuplicate,onRemove}:{pages:BuilderPage[];active:number;onSelect:(i:number)=>void;onAdd:()=>void;onDuplicate:(i:number)=>void;onRemove:(i:number)=>void}){
  return <div className="builder-pages-panel">
    <button className="builder-add-page" onClick={onAdd}><FilePlus2 size={15}/>New page</button>
    <div className="builder-page-list">{pages.map((page,index)=><div className={"builder-page-card "+(active===index?"active":"")} key={page.id}><button onClick={()=>onSelect(index)}><LayoutTemplate size={15}/><span><strong>{page.title}</strong><small>{page.path}</small></span></button><div><button title="Duplicate" onClick={()=>onDuplicate(index)}><Copy size={13}/></button>{pages.length>1&&<button title="Delete" onClick={()=>onRemove(index)}><Trash2 size={13}/></button>}</div></div>)}</div>
    <p className="property-hint">Each page has its own URL, SEO settings and component tree. The site theme is shared across all pages.</p>
  </div>;
}

function StaticPreviewTree({element,viewport}:{element:BuilderElement;viewport:BuilderViewport}){return <ComponentPreview element={element} viewport={viewport}>{element.children?.map(child=><StaticPreviewTree key={child.id} element={child} viewport={viewport}/>)}</ComponentPreview>;}

function getAdjacent(elements:BuilderElement[],id:string){return findAdjacentElement(elements,id);}
function findElementById(elements:BuilderElement[],id:string):BuilderElement|null{for(const e of elements){if(e.id===id)return e;if(e.children?.length){const found=findElementById(e.children,id);if(found)return found;}}return null;}
function appendChildToTree(elements:BuilderElement[],parentId:string,child:BuilderElement):BuilderElement[]{return elements.map(e=>e.id===parentId?{...e,children:[...(e.children??[]),child]}:e.children?.length?{...e,children:appendChildToTree(e.children,parentId,child)}:e);}
function updateElementTree(elements:BuilderElement[],id:string,updater:(e:BuilderElement)=>BuilderElement):BuilderElement[]{return elements.map(e=>{const updated=e.id===id?updater(e):e;return updated.children?.length?{...updated,children:updateElementTree(updated.children,id,updater)}:updated;});}
function removeElementTree(elements:BuilderElement[],id:string):BuilderElement[]{return elements.filter(e=>e.id!==id).map(e=>e.children?.length?{...e,children:removeElementTree(e.children,id)}:e);}
function moveElementTree(elements:BuilderElement[],id:string,direction:"up"|"down"):boolean{const i=elements.findIndex(e=>e.id===id);if(i>=0){const n=direction==="up"?i-1:i+1;if(n<0||n>=elements.length)return false;[elements[i],elements[n]]=[elements[n],elements[i]];return true;}for(const e of elements)if(e.children?.length&&moveElementTree(e.children,id,direction))return true;return false;}
function findAdjacentElement(elements:BuilderElement[],id:string):BuilderElement|null{const i=elements.findIndex(e=>e.id===id);if(i>=0)return elements[i-1]??elements[i+1]??null;for(const e of elements)if(e.children?.length){const n=findAdjacentElement(e.children,id);if(n)return n;}return null;}
function countElements(elements:BuilderElement[]):number{return elements.reduce((n,e)=>n+1+(e.children?countElements(e.children):0),0);}
function cloneElements(elements:BuilderElement[]):BuilderElement[]{return elements.map(e=>({...e,id:e.id+"-"+Date.now()+"-"+Math.random().toString(36).slice(2,5),children:e.children?cloneElements(e.children):undefined}));}
function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/[\s_]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")||"page";}
function uniquePagePath(pages:BuilderPage[],path:string){const base=path==="/"?"/new-page":path;let candidate=base;let i=2;while(pages.some(p=>p.path===candidate)){candidate=base+"-"+i++;}return candidate;}

function defaultProps(type:string):Record<string,unknown>{
  const d:Record<string,Record<string,unknown>>={
    section:{label:"SECTION",title:"Your section"},container:{label:"CONTAINER"},columns:{columns:3},spacer:{height:"48px"},
    text:{text:"Your text goes here."},heading:{text:"Your heading",level:"h2"},button:{label:"Get Started",url:"#",variant:"primary"},
    image:{src:"",alt:"Add an image",caption:""},icon:{symbol:"✦",label:"Icon"},link:{label:"Learn more",url:"#"},divider:{},
    header:{brand:"Your Business",nav1:"Home",nav2:"Services",nav3:"About",nav4:"Contact",cta:"Get Started"},
    hero:{eyebrow:"WELCOME",title:"Your next customer starts here.",description:"Tell visitors what you do and why they should choose you.",primary:"Get Started",secondary:"Learn More",primaryUrl:"#",secondaryUrl:"#"},
    features:{title:"Everything your customers need.",item1:"Fast setup",item1Description:"A clear foundation designed around your business.",item2:"Mobile ready",item2Description:"A responsive experience across every screen.",item3:"Built to convert",item3Description:"Focused content and calls to action."},
    services:{eyebrow:"SERVICES",title:"What we do.",item1:"Consulting",item1Description:"Practical guidance for your next stage.",item2:"Design",item2Description:"Clear, modern experiences for your customers.",item3:"Support",item3Description:"Ongoing help when your business needs it."},
    products:{title:"Featured products.",item1:"Product One",price1:"R299.00",item2:"Product Two",price2:"R499.00",item3:"Product Three",price3:"R699.00",cta:"Add to cart"},
    pricing:{title:"Simple plans.",item1:"Starter",price1:"R299 / month",item2:"Growth",price2:"R599 / month",item3:"Pro",price3:"R999 / month"},
    "lead-form":{eyebrow:"GET IN TOUCH",title:"Tell us what you need.",namePlaceholder:"Your name",emailPlaceholder:"Email address",messagePlaceholder:"How can we help?",cta:"Send enquiry"},
    booking:{title:"Choose a time.",helper:"Select date · Select time · Confirm booking"},quote:{title:"Request a quote.",placeholder:"What do you need?",cta:"Request quotation"},
    testimonials:{title:"What customers say.",quote:"Excellent service and a beautiful experience.",author:"Happy customer"},
    faq:{title:"Questions, answered.",question1:"What do you offer?",question2:"How does it work?",question3:"How do I get started?"},footer:{brand:"Your Business",copyright:"© 2026 · Privacy · Terms · Contact"}
  };
  return d[type]??{};
}

function ViewportButton({active,onClick,icon,label}:{active:boolean;onClick:()=>void;icon:ReactNode;label:string}){return <button title={label} onClick={onClick} className={"builder-viewport-button "+(active?"active":"")}>{icon}</button>;}

export function __builderStage2TestDocument(){ return normalizeDocument(initialDocument); }
