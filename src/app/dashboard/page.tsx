"use client";

import Link from "next/link";
import { Activity, BarChart3, Bell, Box, ChevronDown, ChevronRight, CircleHelp, CreditCard, FileImage, Globe2, Home, LayoutTemplate, Link2, Menu, MoreVertical, Plus, Search, Settings, Sparkles, Users, X, Zap } from "lucide-react";
import { useState } from "react";

function ArrowUpRightIcon(){ return <ChevronRight size={15} />; }

const nav = [
  { label: "Dashboard", icon: Home },
  { label: "Create Website", icon: Plus, href: "/builder/new/site" },
  { label: "My Websites", icon: LayoutTemplate },
  { label: "Templates", icon: Box },
  { label: "AI Generator", icon: Sparkles },
  { label: "Media Library", icon: FileImage },
  { label: "Domains", icon: Globe2 },
  { label: "Analytics", icon: BarChart3 },
  { label: "Leads", icon: Users },
  { label: "Integrations", icon: Link2 },
  { label: "Billing", icon: CreditCard },
  { label: "Settings", icon: Settings }
];

const websites = [
  { name: "Bake 'N Mo", domain: "bakenmo.co.za", kind: "bakery", status: "Published" },
  { name: "Elite Fitness", domain: "elitefitness.co.za", kind: "fitness", status: "Published" },
  { name: "Komane Consulting", domain: "komaneconsulting.co.za", kind: "consulting", status: "Draft" },
  { name: "Savor Restaurant", domain: "savor.co.za", kind: "restaurant", status: "Published" }
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [aiMessage, setAiMessage] = useState("Tell me what you want to build and I’ll turn it into a website.");

  function askAi() {
    if (!prompt.trim()) return;
    setAiThinking(true);
    setAiMessage("Fellacoo AI is mapping your business, audience and conversion path…");
    window.setTimeout(() => {
      setAiThinking(false);
      setAiMessage("Ready. Your website brief is prepared — let’s build it.");
    }, 1100);
  }

  return (
    <main className="dashboard-shell">
      <aside className={sidebarOpen ? "dashboard-sidebar is-open" : "dashboard-sidebar"}>
        <div className="dashboard-brand"><div className="brand-mark"><span /><span /><span /></div><span>FELLACOO</span><button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
        <nav className="dashboard-nav">
          {nav.map(({ label, icon: Icon, href }) => <Link key={label} href={href ?? "#"} onClick={() => setSidebarOpen(false)} className={label === "Dashboard" ? "dashboard-nav-item active" : "dashboard-nav-item"}><Icon size={19} strokeWidth={1.8} /><span>{label}</span>{label === "Create Website" && <span className="nav-plus"><Plus size={12} /></span>}</Link>)}
        </nav>
        <div className="plan-card"><div className="plan-icon"><Zap size={18} /></div><div className="plan-name">Pro Plan</div><div className="plan-count"><strong>2</strong> / 10 websites</div><div className="plan-progress"><span /></div><button className="upgrade-button">Upgrade Plan <ChevronRight size={15} /></button></div>
      </aside>

      {sidebarOpen && <button className="dashboard-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left"><button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={22} /></button><div className="dashboard-search"><Search size={18} /><input placeholder="Search websites, templates, domains..." /><kbd>Ctrl K</kbd></div></div>
          <div className="topbar-actions"><button className="topbar-icon"><CircleHelp size={20} /></button><button className="topbar-icon notification"><Bell size={20} /><span /></button><div className="profile"><div className="avatar">JK</div><div className="profile-copy"><strong>Jimmy Komane</strong><small>Founder</small></div><ChevronDown size={15} /></div></div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-primary">
            <section className="welcome-card">
              <div className="welcome-copy"><div className="dashboard-eyebrow">WELCOME TO FELLACOO <span className="live-pulse">● LIVE</span></div><h1>Build Stunning Websites<br />That <span>Grow Your Business.</span></h1><p>Use AI, beautiful templates and powerful tools to create, launch and grow your online presence — no coding needed.</p><div className="hero-status-row"><span><i /> AI Engine Online</span><span><i /> Publishing Ready</span><span><i /> Analytics Live</span></div><div className="welcome-actions"><Link href="/builder/new/site" className="primary-action"><Plus size={19} />Create New Website</Link><button className="secondary-action"><span className="play-icon">▶</span>Watch Demo</button></div></div>
              <div className="welcome-art"><div className="logo-orbit"><div className="orbit-a" /><div className="orbit-b" /><div className="orbit-c" /><div className="orbit-core" /></div><div className="feature-stack">{[["AI Powered","Generate in seconds",Sparkles],["Drag & Drop","No coding needed",Box],["Mobile Responsive","Looks perfect everywhere",Activity],["SEO Optimized","Rank higher on Google",BarChart3]].map(([title, sub, Icon]) => {const FeatureIcon=Icon as typeof Sparkles;return <div className="feature-chip" key={String(title)}><span><FeatureIcon size={16}/></span><div><strong>{String(title)}</strong><small>{String(sub)}</small></div></div>})}</div></div>
            </section>

            <section className="metrics-grid"><Metric icon={LayoutTemplate} label="Total Websites" value="6" trend="↑ 2 this month" tone="purple" /><Metric icon={Users} label="Total Visitors" value="12,458" trend="↑ 23% this month" tone="blue" spark /><Metric icon={Activity} label="Total Leads" value="320" trend="↑ 18% this month" tone="green" spark /><Metric icon={Zap} label="Conversions" value="48" trend="↑ 12% this month" tone="orange" spark /></section>

            <section className="websites-panel"><div className="panel-heading"><div className="panel-title"><LayoutTemplate size={20}/><h2>My Websites</h2></div><div className="website-tabs"><button className="selected">All Websites</button><button>Published</button><button>Drafts</button><button>Archived</button></div><button className="view-all">View All <ChevronRight size={15}/></button></div><div className="website-grid">{websites.map(site=><WebsiteCard key={site.name} {...site}/>)}</div></section>
          </div>

          <aside className="dashboard-right">
            <section className="assistant-card"><div className="side-card-heading"><div className="assistant-title"><span><Sparkles size={17}/></span><h2>AI Website Assistant</h2></div><div className="online-dot">● Online</div></div><p>Describe your business and I&apos;ll help you create a beautiful website in seconds.</p><Link href="/builder/new/site" className="assistant-input"><span>A bakery in Johannesburg...</span><b><Sparkles size={16}/></b></Link></section>
            <section className="quick-card"><h2><Zap size={18}/> Quick Actions</h2>{[["Generate with AI",Sparkles],["Choose a Template",LayoutTemplate],["Connect Domain",Globe2],["View Analytics",BarChart3]].map(([label,Icon])=>{const ActionIcon=Icon as typeof Sparkles;return <button key={String(label)} className="quick-action"><span><ActionIcon size={16}/></span>{String(label)}<ChevronRight size={16}/></button>})}</section>
            <section className="activity-card"><div className="activity-heading"><h2><Activity size={17}/> Recent Activity</h2><button>View All →</button></div>{[["Website published","Bake 'N Mo","2m ago","green"],["New lead received","Savor Restaurant","12m ago","pink"],["Template applied","Elite Fitness","1h ago","purple"],["Domain connected","komaneconsulting.co.za","3h ago","blue"]].map(([title,name,time,tone])=><div className="activity-row" key={title+name}><span className={"activity-icon "+tone}><Globe2 size={15}/></span><div><strong>{title}</strong><small>{name}</small></div><time>{time}</time></div>)}</section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Metric({icon:Icon,label,value,trend,tone,spark}:{icon:typeof LayoutTemplate;label:string;value:string;trend:string;tone:string;spark?:boolean}){return <div className="metric-card"><span className={"metric-icon "+tone}><Icon size={21}/></span><div><small>{label}</small><strong>{value}</strong><em className={tone}>{trend}</em></div>{spark&&<div className={"mini-spark "+tone}><span/><span/><span/><span/><span/></div>}</div>}

function WebsiteCard({name,domain,kind,status}:{name:string;domain:string;kind:string;status:string}){return <article className="website-card"><div className={"site-preview "+kind}><div className="preview-nav"><span>{name.split(" ")[0]}</span><i/><i/><i/></div><div className="preview-content"><b>{kind==="bakery"?"Fresh Bakes\nHappier Days":kind==="fitness"?"STRONGER\nEVERY DAY":kind==="consulting"?"Grow Your\nBusiness Faster":"Exceptional\nDining Experience"}</b><small>{kind==="bakery"?"BAKE 'N MO":kind==="fitness"?"ELITE FITNESS":kind==="consulting"?"KOMANE":"SAVOR"}</small></div></div><div className="site-info"><div><strong>{name}</strong><small>{domain}</small></div><button><MoreVertical size={16}/></button></div><div className={"site-status "+status.toLowerCase()}><span/>{status}</div></article>}
