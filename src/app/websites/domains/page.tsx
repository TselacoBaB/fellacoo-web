"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, Globe2, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";

type Site={id:string;business_name:string;slug:string|null;published_url:string|null;status:string};
type Domain={id:string;site_id:string;hostname:string;slug:string|null;domain_type:string;status:string;created_at:string;verified_at:string|null;records:Array<{type:string;host:string;value:string;purpose:string}>;sslStatus:string|null};

export default function DomainsPage(){
  const [sites,setSites]=useState<Site[]>([]);
  const [domains,setDomains]=useState<Domain[]>([]);
  const [siteId,setSiteId]=useState("");
  const [hostname,setHostname]=useState("");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");

  async function load(){
    setLoading(true);
    try{
      const response=await fetch("/api/websites/domains",{cache:"no-store"});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||"Unable to load domains.");
      setSites(payload.sites??[]);
      setDomains(payload.domains??[]);
      setSiteId(current=>current||payload.sites?.[0]?.id||"");
    }catch(error){setMessage(error instanceof Error?error.message:"Unable to load domains.");}
    finally{setLoading(false);}
  }
  useEffect(()=>{void load();},[]);

  const selectedSite=useMemo(()=>sites.find(site=>site.id===siteId)??sites[0]??null,[sites,siteId]);

  async function connect(){
    if(!siteId||!hostname.trim())return;
    setSaving(true);setMessage("");
    try{
      const response=await fetch("/api/websites/domains",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId,hostname})});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||"Unable to connect domain.");
      setHostname("");
      setMessage("Domain added. Follow the verification records below, then refresh to see Cloudflare SSL progress.");
      await load();
    }catch(error){setMessage(error instanceof Error?error.message:"Unable to connect domain.");}
    finally{setSaving(false);}
  }

  async function remove(domainId:string){
    if(!window.confirm("Remove this domain from Fellacoo?"))return;
    setSaving(true);
    try{
      const response=await fetch("/api/websites/domains",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({domainId})});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||"Unable to remove domain.");
      await load();
    }catch(error){setMessage(error instanceof Error?error.message:"Unable to remove domain.");}
    finally{setSaving(false);}
  }

  return <main className="dashboard-shell"><section className="dashboard-main">
    <header className="dashboard-topbar"><div className="topbar-left"><Link href="/dashboard" className="builder-back"><ArrowLeft size={16}/>Dashboard</Link></div></header>
    <div className="dashboard-content"><div className="dashboard-primary">
      <section className="dashboard-card version-page">
        <div className="dashboard-eyebrow">WEBSITES / DOMAINS</div>
        <div className="version-heading"><div><h1>Domains</h1><p>Connect customer domains to published Fellacoo websites and manage Cloudflare verification.</p></div><button className="secondary-action" onClick={()=>void load()}><RefreshCw size={15}/>Refresh</button></div>
        {message&&<div className="dashboard-inline-message">{message}</div>}

        <div className="domain-connect-card">
          <div><strong>Connect a custom domain</strong><p>{selectedSite?.published_url?"This website is published and ready for a custom hostname.":"Publish a website first, then connect its domain."}</p></div>
          <div className="domain-form">
            <select value={siteId} onChange={e=>setSiteId(e.target.value)} disabled={!sites.length}>
              {!sites.length?<option value="">No websites yet</option>:sites.map(site=><option key={site.id} value={site.id}>{site.business_name}</option>)}
            </select>
            <input value={hostname} onChange={e=>setHostname(e.target.value)} placeholder="www.example.co.za" onKeyDown={e=>{if(e.key==="Enter")void connect();}}/>
            <button className="primary-action" disabled={saving||!siteId||!hostname.trim()||!selectedSite?.published_url} onClick={()=>void connect()}><Plus size={16}/>{saving?"Connecting…":"Connect domain"}</button>
          </div>
        </div>

        {loading?<div className="version-loading"><Loader2 size={18} className="spin"/>Loading domains…</div>:domains.length===0?
          <div className="version-empty"><Globe2 size={28}/><strong>No custom domains connected.</strong><p>Your Fellacoo subdomain is created as part of publishing. Custom domains will appear here after connection.</p></div>:
          <div className="domain-list">{domains.map(domain=>{const site=sites.find(item=>item.id===domain.site_id);return <article className="domain-card" key={domain.id}>
            <div className="domain-icon"><Globe2 size={18}/></div>
            <div className="domain-copy"><strong>{domain.hostname}</strong><span>{site?.business_name??"Website"} · {domain.domain_type}</span><small>{domain.status} · SSL {domain.sslStatus||"pending"}</small></div>
            <span className={"domain-status "+domain.status.toLowerCase()}>{domain.status}</span>
            <div className="domain-actions">
              {domain.status.toUpperCase()==="ACTIVE"&&<a href={"https://"+domain.hostname} target="_blank" rel="noreferrer"><ExternalLink size={14}/>Open</a>}
              <button onClick={()=>navigator.clipboard?.writeText(domain.hostname)}><Copy size={14}/>Copy</button>
              <button className="danger" onClick={()=>void remove(domain.id)} disabled={saving}><Trash2 size={14}/>Remove</button>
            </div>
            {domain.records?.length>0&&<div className="domain-records"><strong>DNS verification</strong>{domain.records.map((record,index)=><div key={index}><b>{record.type}</b><code>{record.host}</code><code>{record.value}</code><small>{record.purpose}</small></div>)}</div>}
          </article>})}</div>}
      </section>
    </div></div>
  </section></main>;
}
