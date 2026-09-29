"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { ArrowRight, Check, Eye, LayoutTemplate, Search, Sparkles, Wand2 } from "lucide-react";

type Template = { id:string; name:string; description:string; style_label:string; primary_categories:string[]; secondary_categories:string[]; featured?:boolean; document?:unknown };

export default function TemplatesPage() {
  const [templates,setTemplates]=useState<Template[]>([]);
  const [categories,setCategories]=useState<string[]>([]);
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("");
  const [loading,setLoading]=useState(true);
  const [using,setUsing]=useState<string|null>(null);
  const [message,setMessage]=useState("");

  useEffect(()=>{
    let active=true;
    const timer=window.setTimeout(async()=>{
      setLoading(true);
      const params=new URLSearchParams();
      if(query.trim()) params.set("q",query.trim());
      if(category) params.set("category",category);
      try {
        const response=await fetch("/api/templates?"+params.toString(),{cache:"no-store"});
        const payload=await response.json();
        if(active){setTemplates(payload.templates??[]);setCategories(payload.categories??[]);}
      } catch { if(active) setMessage("Unable to load the template library."); }
      finally {if(active)setLoading(false);}
    },180);
    return()=>{active=false;window.clearTimeout(timer)};
  },[query,category]);

  async function useTemplate(templateId:string){
    setUsing(templateId);setMessage("");
    try {
      const response=await fetch("/api/templates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({templateId})});
      const payload=await response.json();
      if(!response.ok) throw new Error(payload.error||"Unable to use template.");
      window.location.href=payload.url;
    } catch(error) { setMessage(error instanceof Error?error.message:"Unable to use template."); }
    finally {setUsing(null);}
  }

  const featured=useMemo(()=>templates.filter(t=>t.featured),[templates]);
  const rest=useMemo(()=>templates.filter(t=>!t.featured),[templates]);

  return <main className="dashboard-shell">
    <AppSidebar/>
    <section className="dashboard-main">
      <header className="dashboard-topbar"><div className="topbar-left"><Link href="/dashboard" className="builder-back"><LayoutTemplate size={16}/> Websites</Link></div></header>
      <div className="template-library-page">
        <section className="template-hero">
          <div><div className="dashboard-eyebrow"><Sparkles size={13}/> FELLACOO TEMPLATE LIBRARY</div><h1>Start with a website<br/><span>that already looks right.</span></h1><p>Choose a conversion-ready foundation, make it yours in the builder, connect your business tools and publish when you're ready.</p></div>
          <div className="template-hero-art"><Wand2 size={42}/><strong>AI-ready foundations</strong><small>Reusable components · responsive layouts · business flows</small></div>
        </section>
        <div className="template-create-row">
          <div>
            <small>START A NEW WEBSITE</small>
            <strong>Choose a ready-made foundation or build from scratch.</strong>
          </div>
          <Link href="/builder/new/site?mode=blank" className="template-scratch-button">
            Start from scratch <ArrowRight size={15}/>
          </Link>
        </div>
        <div className="template-toolbar">
          <div className="template-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search templates, industries or styles..."/></div>
          <div className="template-categories"><button className={!category?"active":""} onClick={()=>setCategory("")}>All</button>{categories.map(c=><button key={c} className={category===c.toLowerCase()?"active":""} onClick={()=>setCategory(c.toLowerCase())}>{c}</button>)}</div>
        </div>
        {message&&<div className="dashboard-inline-message">{message}</div>}
        {loading?<div className="template-loading">Loading your template library…</div>:templates.length===0?<div className="template-empty"><LayoutTemplate size={32}/><h2>No templates found</h2><p>Try another search or category.</p></div>:<>
          {featured.length>0&&<section><div className="template-section-heading"><div><small>CURATED STARTERS</small><h2>Designed to get you moving.</h2></div><span>{featured.length} featured</span></div><div className="template-grid featured">{featured.map(t=><TemplateCard key={t.id} template={t} onUse={useTemplate} using={using===t.id}/>)}</div></section>}
          <section><div className="template-section-heading"><div><small>ALL TEMPLATES</small><h2>Choose your foundation.</h2></div><span>{templates.length} available</span></div><div className="template-grid">{rest.map(t=><TemplateCard key={t.id} template={t} onUse={useTemplate} using={using===t.id}/>)}</div></section>
        </>}
      </div>
    </section>
  </main>;
}

function TemplateCard({template,onUse,using}:{template:Template;onUse:(id:string)=>void;using:boolean}){
  const elements=Array.isArray((template.document as any)?.pages?.[0]?.elements)?(template.document as any).pages[0].elements:[];
  return <article className="template-card">
    <div className="template-preview"><div className="template-preview-browser"><span/><span/><span/></div><div className="template-mini-page">{elements.slice(0,5).map((e:any,i:number)=><div key={e.id||i} className={"mini-"+e.type}>{String(e.props?.title||e.props?.text||e.props?.brand||"").slice(0,48)}</div>)}</div><div className="template-preview-overlay"><button><Eye size={15}/> Preview</button></div></div>
    <div className="template-card-body"><div className="template-card-tags"><span>{template.primary_categories?.[0]||"General"}</span><span>{template.style_label||"Modern"}</span></div><h3>{template.name}</h3><p>{template.description}</p><div className="template-audience"><Check size={13}/>{template.secondary_categories?.[0]||"Growing businesses"}</div><button className="template-use" onClick={()=>onUse(template.id)} disabled={using}>{using?"Opening…":<>Use this template <ArrowRight size={15}/></>}</button></div>
  </article>;
}
