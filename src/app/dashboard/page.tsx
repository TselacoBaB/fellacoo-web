"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity, BarChart3, Bell, BookOpen, Box, BriefcaseBusiness, Calculator,
  CalendarDays, ChevronDown, ChevronRight, CircleHelp, CreditCard, FileImage,
  FileText, Globe2, LayoutTemplate, MoreVertical, Package, PanelTop,
  Plus, Receipt, Search, ShoppingCart, Sparkles, Store, Users, Zap
} from "lucide-react";
import { useAppState, type WebsiteFilter } from "@/lib/state/app-store";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { DashboardCard, CardHeader, ToolCard } from "@/components/dashboard/primitives";

const websites = [
  { name: "Bake 'N Mo", domain: "bakenmo.co.za", kind: "bakery", status: "Published" },
  { name: "Elite Fitness", domain: "elitefitness.co.za", kind: "fitness", status: "Published" },
  { name: "Komane Consulting", domain: "komaneconsulting.co.za", kind: "consulting", status: "Draft" },
  { name: "Savor Restaurant", domain: "savor.co.za", kind: "restaurant", status: "Published" }
];

const designTools = [
  { title: "Components", description: "Reusable sections and blocks", icon: <PanelTop size={18} /> },
  { title: "Templates", description: "Admin-approved website designs", icon: <Box size={18} /> },
  { title: "Brand Kit", description: "Logo, colours and fonts", icon: <BookOpen size={18} /> },
  { title: "Media Library", description: "Images, files and assets", icon: <FileImage size={18} /> }
];

const businessTools = [
  { title: "Online Store", description: "Products, stock and storefront", icon: <Store size={18} /> },
  { title: "Shopping Cart", description: "Cart and checkout flows", icon: <ShoppingCart size={18} /> },
  { title: "Payments", description: "Collect and track payments", icon: <CreditCard size={18} /> },
  { title: "CRM", description: "Customers, companies and notes", icon: <BriefcaseBusiness size={18} /> },
  { title: "Leads", description: "Capture and qualify enquiries", icon: <Users size={18} /> },
  { title: "Bookings", description: "Appointments and availability", icon: <CalendarDays size={18} /> },
  { title: "Quotes", description: "Create and send quotations", icon: <FileText size={18} /> },
  { title: "Invoices", description: "Billing and payment status", icon: <Receipt size={18} /> },
  { title: "Accounting", description: "Revenue, expenses and records", icon: <Calculator size={18} /> },
  { title: "Orders", description: "Manage fulfilment and sales", icon: <Package size={18} /> },
  { title: "Operations", description: "Business workflows and records", icon: <BriefcaseBusiness size={18} /> },
  { title: "Analytics", description: "Understand traffic and growth", icon: <BarChart3 size={18} /> }
];

const filters: { label: string; value: WebsiteFilter }[] = [
  { label: "All Websites", value: "all" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "drafts" },
  { label: "Archived", value: "archived" }
];

export default function DashboardPage() {
  const {
    websiteFilter,
    setWebsiteFilter,
    activeTool,
    setActiveTool
  } = useAppState();

  const visibleWebsites = websiteFilter === "all"
    ? websites
    : websites.filter(
        (site) =>
          site.status.toLowerCase() ===
          websiteFilter.replace("published", "published").replace("drafts", "draft")
      );

  return (
    <main className="dashboard-shell">
      <AppSidebar />

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <div className="dashboard-search">
              <Search size={18} />
              <input placeholder="Search websites, templates, components..." />
              <kbd>Ctrl K</kbd>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="topbar-icon"><CircleHelp size={20} /></button>
            <button className="topbar-icon notification"><Bell size={20} /><span /></button>
            <div className="profile">
              <div className="avatar">JK</div>
              <div className="profile-copy">
                <strong>Jimmy Komane</strong>
                <small>Founder</small>
              </div>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-primary">
            <DashboardCard className="welcome-card">
              <div className="welcome-copy">
                <div className="dashboard-eyebrow">
                  WELCOME TO FELLACOO <span className="live-pulse">● LIVE</span>
                </div>
                <h1>Build Stunning Websites<br />That <span>Grow Your Business.</span></h1>
                <p>Build your website from reusable components, admin-approved templates and powerful business tools — all in one place.</p>
                <div className="hero-status-row">
                  <span><i /> Component Library Ready</span>
                  <span><i /> Publishing Ready</span>
                  <span><i /> Business Tools Connected</span>
                </div>
                <div className="welcome-actions">
                  <Link href="/builder/new/site" className="primary-action">
                    <Plus size={19} />Create New Website
                  </Link>
                  <Link href="#components" className="secondary-action">
                    <PanelTop size={16} />Explore Components
                  </Link>
                </div>
              </div>

              <div className="welcome-art">
                <div className="logo-orbit">
                  <div className="orbit-a" />
                  <div className="orbit-b" />
                  <div className="orbit-c" />
                  <div className="orbit-core" />
                </div>
                <div className="feature-stack">
                  {[
                    ["Reusable Components", "Build once. Reuse everywhere.", PanelTop],
                    ["Admin Templates", "Approved designs only.", Box],
                    ["Business Tools", "Commerce, CRM and more.", BriefcaseBusiness],
                    ["Responsive by Default", "Desktop, tablet and mobile.", Globe2]
                  ].map(([title, sub, Icon]) => {
                    const FeatureIcon = Icon as typeof PanelTop;
                    return (
                      <div className="feature-chip" key={String(title)}>
                        <span><FeatureIcon size={16} /></span>
                        <div><strong>{String(title)}</strong><small>{String(sub)}</small></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </DashboardCard>

            {activeTool && (
              <div className="resume-strip">
                <span><Activity size={15} /> You were working in <strong>{activeTool}</strong>.</span>
                <button onClick={() => setActiveTool(null)}>Dismiss</button>
              </div>
            )}

            <section className="metrics-grid">
              <Metric icon={LayoutTemplate} label="Total Websites" value="6" trend="↑ 2 this month" tone="purple" />
              <Metric icon={Users} label="Total Visitors" value="12,458" trend="↑ 23% this month" tone="blue" spark />
              <Metric icon={Users} label="Total Leads" value="320" trend="↑ 18% this month" tone="green" spark />
              <Metric icon={CreditCard} label="Revenue" value="R48,240" trend="↑ 12% this month" tone="orange" spark />
            </section>

            <DashboardCard className="tools-panel" id="components">
              <CardHeader
                eyebrow="FELLACOO DESIGN + BUSINESS PLATFORM"
                title="Tools for every part of the website"
                icon={<Sparkles size={19} />}
              />
              <p className="section-subtitle">
                Keep the workspace organized: design tools build the site, business tools operate it, and growth tools measure it.
              </p>

              <ToolGroup
                title="Design Tools"
                description="Build and manage the website itself."
                tools={designTools}
                onSelect={setActiveTool}
              />

              <ToolGroup
                title="Business Tools"
                description="Activate the operating layer behind the website."
                tools={businessTools}
                onSelect={setActiveTool}
              />
            </DashboardCard>

            <DashboardCard className="websites-panel">
              <div className="panel-heading">
                <div className="panel-title"><LayoutTemplate size={20} /><h2>My Websites</h2></div>
                <div className="website-tabs">
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      className={websiteFilter === filter.value ? "selected" : ""}
                      onClick={() => setWebsiteFilter(filter.value)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <button className="view-all">View All <ChevronRight size={15} /></button>
              </div>

              <div className="website-grid">
                {visibleWebsites.map((site) => <WebsiteCard key={site.name} {...site} />)}
              </div>
            </DashboardCard>
          </div>

          <aside className="dashboard-right">
            <DashboardCard className="platform-card">
              <CardHeader eyebrow="YOUR PLATFORM" title="Everything in one place" icon={<BriefcaseBusiness size={18} />} />
              <p className="platform-copy">Build the website once. Then activate commerce, CRM, bookings, leads, billing and other tools without rebuilding the site.</p>
              <div className="platform-flow">
                <span>Website</span><i>+</i><span>Components</span><i>+</i><span>Business Tools</span>
              </div>
            </DashboardCard>

            <DashboardCard className="quick-card">
              <CardHeader title="Quick Actions" icon={<Zap size={18} />} />
              <button className="quick-action" onClick={() => setActiveTool("Website Components")}><span><PanelTop size={16} /></span>Browse Components<ChevronRight size={16} /></button>
              <button className="quick-action" onClick={() => setActiveTool("Admin Templates")}><span><Box size={16} /></span>Choose a Template<ChevronRight size={16} /></button>
              <button className="quick-action" onClick={() => setActiveTool("Online Store")}><span><Store size={16} /></span>Add Store<ChevronRight size={16} /></button>
              <button className="quick-action" onClick={() => setActiveTool("CRM")}><span><BriefcaseBusiness size={16} /></span>Open CRM<ChevronRight size={16} /></button>
            </DashboardCard>

            <DashboardCard className="activity-card">
              <div className="activity-heading"><h2><Activity size={17} /> Recent Activity</h2><button>View All →</button></div>
              {[
                ["Website published", "Bake 'N Mo", "2m ago", "green"],
                ["New lead received", "Savor Restaurant", "12m ago", "pink"],
                ["Component added", "Elite Fitness", "1h ago", "purple"],
                ["Invoice paid", "Komane Consulting", "3h ago", "blue"]
              ].map(([title, name, time, tone]) => (
                <div className="activity-row" key={title + name}>
                  <span className={"activity-icon " + tone}><Globe2 size={15} /></span>
                  <div><strong>{title}</strong><small>{name}</small></div>
                  <time>{time}</time>
                </div>
              ))}
            </DashboardCard>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ToolGroup({
  title,
  description,
  tools,
  onSelect
}: {
  title: string;
  description: string;
  tools: Array<{ title: string; description: string; icon: ReactNode }>;
  onSelect: (title: string) => void;
}) {
  return (
    <section className="tool-group" id={title === "Business Tools" ? "business-tools" : "design-tools"}>
      <div className="tool-group-heading">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span>{tools.length} tools</span>
      </div>
      <div className="tool-grid">
        {tools.map((tool) => (
          <button
            type="button"
            key={tool.title}
            className="tool-card-button"
            onClick={() => onSelect(tool.title)}
          >
            <ToolCard {...tool} />
          </button>
        ))}
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  trend,
  tone,
  spark
}: {
  icon: typeof LayoutTemplate;
  label: string;
  value: string;
  trend: string;
  tone: string;
  spark?: boolean;
}) {
  return (
    <div className="metric-card">
      <span className={"metric-icon " + tone}><Icon size={21} /></span>
      <div className="metric-copy">
        <small>{label}</small>
        <strong>{value}</strong>
        <em className={tone}>{trend}</em>
      </div>
      {spark && <div className={"mini-spark " + tone}><span /><span /><span /><span /><span /></div>}
    </div>
  );
}

function WebsiteCard({
  name,
  domain,
  kind,
  status
}: {
  name: string;
  domain: string;
  kind: string;
  status: string;
}) {
  return (
    <article className="website-card">
      <div className={"site-preview " + kind}>
        <div className="preview-nav"><span>{name.split(" ")[0]}</span><i /><i /><i /></div>
        <div className="preview-content">
          <b>
            {kind === "bakery"
              ? "Fresh Bakes\nHappier Days"
              : kind === "fitness"
                ? "STRONGER\nEVERY DAY"
                : kind === "consulting"
                  ? "Grow Your\nBusiness Faster"
                  : "Exceptional\nDining Experience"}
          </b>
          <small>
            {kind === "bakery" ? "BAKE 'N MO" : kind === "fitness" ? "ELITE FITNESS" : kind === "consulting" ? "KOMANE" : "SAVOR"}
          </small>
        </div>
      </div>
      <div className="site-info">
        <div><strong>{name}</strong><small>{domain}</small></div>
        <button><MoreVertical size={16} /></button>
      </div>
      <div className={"site-status " + status.toLowerCase()}><span />{status}</div>
    </article>
  );
}
