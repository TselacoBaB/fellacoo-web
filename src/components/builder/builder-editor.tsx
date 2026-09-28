"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown, ArrowLeft, ArrowUp, ChevronDown, ChevronRight, Eye, LayoutTemplate,
  Menu, Monitor, MousePointer2, PanelLeft, PanelRight, Palette, Plus, Redo2,
  Save, Settings2, Smartphone, Tablet, Trash2, Undo2, X
} from "lucide-react";
import type { BuilderDocument, BuilderElement, BuilderViewport } from "@/types/builder";
import { useBuilderHistory } from "@/lib/builder/use-builder-history";

type ComponentDefinition = {
  type: string;
  label: string;
  description: string;
  category: "Layout" | "Content" | "Commerce" | "Business";
};

const library: ComponentDefinition[] = [
  { type: "header", label: "Header", description: "Navigation and brand", category: "Layout" },
  { type: "hero", label: "Hero", description: "Headline and primary CTA", category: "Layout" },
  { type: "features", label: "Features", description: "Benefits or services", category: "Content" },
  { type: "services", label: "Services", description: "Service cards", category: "Content" },
  { type: "products", label: "Products", description: "Store product grid", category: "Commerce" },
  { type: "pricing", label: "Pricing", description: "Plans and offers", category: "Commerce" },
  { type: "lead-form", label: "Lead Form", description: "Capture enquiries", category: "Business" },
  { type: "booking", label: "Booking", description: "Appointments and availability", category: "Business" },
  { type: "quote", label: "Quote Request", description: "Request a quotation", category: "Business" },
  { type: "testimonials", label: "Testimonials", description: "Social proof", category: "Content" },
  { type: "faq", label: "FAQ", description: "Frequently asked questions", category: "Content" },
  { type: "footer", label: "Footer", description: "Footer and legal links", category: "Layout" }
];

const initialDocument: BuilderDocument = {
  version: 1,
  pages: [{
    id: "home",
    path: "/",
    title: "Home",
    elements: [
      { id: "header-1", type: "header", props: { brand: "Your Business" } },
      { id: "hero-1", type: "hero", props: { eyebrow: "WELCOME", title: "Build a business people remember.", description: "A responsive website built from reusable Fellacoo components.", primary: "Get Started", secondary: "Learn More" } },
      { id: "features-1", type: "features", props: { title: "Everything your customers need." } },
      { id: "footer-1", type: "footer", props: { brand: "Your Business" } }
    ]
  }]
};

const storageKey = "fellacoo-builder:draft:v1";

 export function BuilderEditor({ projectId }: { projectId?: string }) {
  const { document, updateDocument, resetDocument, undo, redo, canUndo, canRedo } = useBuilderHistory(initialDocument);
  const [selectedId, setSelectedId] = useState("hero-1");
  const [viewport, setViewport] = useState<BuilderViewport>("desktop");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [libraryFilter, setLibraryFilter] = useState<ComponentDefinition["category"] | "All">("All");
  const [saved, setSaved] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"checking" | "local" | "saving" | "synced" | "error">("checking");
  const [remoteEnabled, setRemoteEnabled] = useState(false);
  const [buildRequestId, setBuildRequestId] = useState<string | null>(projectId ?? null);
  const [projectName, setProjectName] = useState("Untitled Website");

  const [previewOpen, setPreviewOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function loadRemoteDraft() {
      try {
        const draftUrl = projectId ? `/api/builder/draft?id=${encodeURIComponent(projectId)}` : "/api/builder/draft";
        const response = await fetch(draftUrl, { cache: "no-store" });
        if (!active) return;

        if (response.ok) {
          const payload = await response.json() as {
            draft?: { id: string; document: BuilderDocument | null; businessName?: string | null } | null;
          };

          if (projectId) {
            if (payload.draft?.document) {
              resetDocument(payload.draft.document);
              setProjectName(payload.draft.businessName?.trim() || "Untitled Website");
              setBuildRequestId(payload.draft.id);
              window.localStorage.setItem(storageKey, JSON.stringify(payload.draft.document));
              window.localStorage.setItem(storageKey + ":build-request-id", payload.draft.id);
            } else {
              setSyncStatus("error");
              return;
            }
          } else {
            setBuildRequestId(null);
          }

          setRemoteEnabled(true);
          setSyncStatus("synced");
          return;
        }

        if (response.status === 401 || response.status === 403) {
          setSyncStatus("local");
          return;
        }

        setSyncStatus("error");
      } catch {
        if (active) setSyncStatus("local");
      }
    }

    loadRemoteDraft();
    return () => { active = false; };
  }, [projectId]);

  useEffect(() => {
    setSaved(false);

    const timer = window.setTimeout(async () => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(document));
        setSaved(true);
      } catch {}

      if (!remoteEnabled) return;

      setSyncStatus("saving");
      try {
        const response = await fetch("/api/builder/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buildRequestId,
            document,
            businessName: projectName.trim() || "Untitled Website",
            activity: "Website",
            location: "Online",
          }),
        });

        if (!response.ok) {
          setSyncStatus(response.status === 401 || response.status === 403 ? "local" : "error");
          return;
        }

        const payload = await response.json() as { buildRequestId?: string };
        if (payload.buildRequestId) {
          setBuildRequestId(payload.buildRequestId);
          window.localStorage.setItem(storageKey + ":build-request-id", payload.buildRequestId);
        }
        setSyncStatus("synced");
      } catch {
        setSyncStatus("local");
      }
    }, 650);

    return () => window.clearTimeout(timer);
  }, [document, remoteEnabled, projectName]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;

      const key = event.key.toLowerCase();
      if (key === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === "y") {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    if (!previewOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewOpen]);

  const page = document.pages[0];
  const selected = page.elements.find((element) => element.id === selectedId) ?? null;

  async function saveDraft() {
    setSyncStatus("saving");

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(document));
      setSaved(true);
    } catch {
      setSaved(false);
    }

    if (!remoteEnabled) {
      setSyncStatus("local");
      return;
    }

    try {
      const response = await fetch("/api/builder/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buildRequestId,
          document,
          businessName: projectName.trim() || "Untitled Website",
          activity: "Website",
          location: "Online"
        })
      });

      if (!response.ok) {
        setSyncStatus(response.status === 401 || response.status === 403 ? "local" : "error");
        return;
      }

      const payload = await response.json() as { buildRequestId?: string };
      if (payload.buildRequestId) {
        const createdProject = !buildRequestId;
        setBuildRequestId(payload.buildRequestId);
        window.localStorage.setItem(storageKey + ":build-request-id", payload.buildRequestId);
        if (createdProject && !projectId) {
          router.replace(`/builder/${payload.buildRequestId}`);
        }
      }
      setSaved(true);
      setSyncStatus("synced");
    } catch {
      setSyncStatus("local");
    }
  }
  const visibleLibrary = useMemo(
    () => library.filter((item) => libraryFilter === "All" || item.category === libraryFilter),
    [libraryFilter]
  );

  function addComponent(type: string) {
    const id = type + "-" + Date.now();
    const element: BuilderElement = { id, type, props: defaultProps(type) };
    commitDocument((current) => ({
      ...current,
      pages: current.pages.map((p, index) => index === 0 ? { ...p, elements: [...p.elements, element] } : p)
    }));
    setSelectedId(id);
  }

  function updateSelected(patch: Record<string, unknown>) {
    commitDocument((current) => ({
      ...current,
      pages: current.pages.map((p, index) => index === 0
        ? { ...p, elements: p.elements.map((element) => element.id === selectedId ? { ...element, props: { ...element.props, ...patch } } : element) }
        : p)
    }));
  }

  function removeSelected() {
    if (!selectedId || page.elements.length <= 1) return;
    const index = page.elements.findIndex((element) => element.id === selectedId);
    const next = page.elements[index - 1] ?? page.elements[index + 1];
    commitDocument((current) => ({ ...current, pages: current.pages.map((p, i) => i === 0 ? { ...p, elements: p.elements.filter((element) => element.id !== selectedId) } : p) }));
    setSelectedId(next?.id ?? "");
  }

  function moveSelected(direction: "up" | "down") {
    const index = page.elements.findIndex((element) => element.id === selectedId);
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || nextIndex < 0 || nextIndex >= page.elements.length) return;
    const elements = [...page.elements];
    [elements[index], elements[nextIndex]] = [elements[nextIndex], elements[index]];
    commitDocument((current) => ({ ...current, pages: current.pages.map((p, i) => i === 0 ? { ...p, elements } : p) }));
  }

  return (
    <main className="builder-app">
      <header className="builder-topbar">
        <div className="builder-top-left">
          <button className="builder-icon-button" onClick={() => setLeftOpen((v) => !v)} title="Toggle components"><Menu size={19}/></button>
          <a className="builder-back" href="/dashboard"><ArrowLeft size={16}/>Dashboard</a>
          <span className="builder-divider"/>
          <div className="builder-project">
  <input
    value={projectName}
    onChange={(event) => setProjectName(event.target.value)}
    onBlur={() => { if (projectName.trim()) void saveDraft(); }}
    aria-label="Website name"
    title="Website name"
  />
  <small>{saved ? syncStatus === "synced" ? "Synced with Supabase" : "Saved locally" : "Saving…"}</small>
</div>
        </div>

        <div className="builder-viewport">
          <ViewportButton active={viewport === "desktop"} onClick={() => setViewport("desktop")} icon={<Monitor size={16}/>} label="Desktop"/>
          <ViewportButton active={viewport === "tablet"} onClick={() => setViewport("tablet")} icon={<Tablet size={16}/>} label="Tablet"/>
          <ViewportButton active={viewport === "mobile"} onClick={() => setViewport("mobile")} icon={<Smartphone size={16}/>} label="Mobile"/>
        </div>

        <div className="builder-top-actions">
          <button className="builder-save" onClick={saveDraft} disabled={syncStatus === "saving"} title="Save the current draft to local storage and Supabase when connected"><Save size={15}/>{syncStatus === "saving" ? "Saving" : saved ? syncStatus === "synced" ? "Synced" : "Saved" : "Save"}</button>
          <button className="builder-preview" onClick={() => setPreviewOpen(true)}><Eye size={16}/>Preview</button>
          <button className="builder-publish">Publish</button>
        </div>
      </header>

      <div className="builder-workspace">
        {leftOpen && <aside className="builder-left">
          <div className="builder-panel-head"><div><small>WEBSITE BUILDER</small><strong>Components</strong></div><button onClick={() => setLeftOpen(false)}><X size={16}/></button></div>
          <div className="builder-page-select"><LayoutTemplate size={15}/><span>Home</span><ChevronDown size={14}/></div>
          <div className="component-tabs">
            {(["All", "Layout", "Content", "Commerce", "Business"] as const).map((category) => <button key={category} className={libraryFilter === category ? "active" : ""} onClick={() => setLibraryFilter(category)}>{category}</button>)}
          </div>
          <div className="component-library">
            {visibleLibrary.map((item) => <button className="component-item" key={item.type} onClick={() => addComponent(item.type)}><span className="component-item-icon"><Plus size={14}/></span><span><strong>{item.label}</strong><small>{item.description}</small></span></button>)}
          </div>
          <div className="builder-left-footer"><Palette size={15}/><span>Brand Kit</span><ChevronRight size={14}/></div>
        </aside>}

        <section className="builder-canvas-area">
          <div className="canvas-toolbar">
            <span><MousePointer2 size={14}/>Live design canvas</span>
            <div>
              <button onClick={undo} disabled={history.length === 0} title="Undo"><Undo2 size={15}/></button>
              <button onClick={redo} disabled={future.length === 0} title="Redo"><Redo2 size={15}/></button>
            </div>
          </div>
          <div className="canvas-stage" onClick={() => setSelectedId("")}>
            <div className={"website-canvas viewport-" + viewport}>
              {page.elements.map((element) => (
                <BuilderBlock key={element.id} element={element} selected={selectedId === element.id} onSelect={() => setSelectedId(element.id)} />
              ))}
            </div>
          </div>
        </section>

        {rightOpen && <aside className="builder-right">
          <div className="builder-panel-head"><div><small>DESIGN SYSTEM</small><strong>Properties</strong></div><button onClick={() => setRightOpen(false)}><X size={16}/></button></div>
          {selected ? <PropertyPanel element={selected} update={updateSelected} remove={removeSelected} move={moveSelected} /> : <div className="empty-properties"><Settings2 size={22}/><p>Select a component to edit it.</p></div>}
        </aside>}

        {!leftOpen && <button className="floating-panel-button left" onClick={() => setLeftOpen(true)}><PanelLeft size={17}/></button>}
        {!rightOpen && <button className="floating-panel-button right" onClick={() => setRightOpen(true)}><PanelRight size={17}/></button>}
      </div>
      {previewOpen && (
        <div className="builder-preview-overlay" role="dialog" aria-modal="true" aria-label="Website preview">
          <div className="builder-preview-shell">
            <div className="builder-preview-toolbar">
              <div>
                <strong>Website Preview</strong>
                <span>Viewing the current saved design</span>
              </div>
              <button onClick={() => setPreviewOpen(false)} aria-label="Close preview"><X size={18}/></button>
            </div>
            <div className="builder-preview-stage">
              <div className={"website-canvas viewport-" + viewport}>
                {page.elements.map((element) => (
                  <div className="builder-preview-block" key={element.id}>
                    <ComponentPreview element={element}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function BuilderBlock({ element, selected, onSelect }: { element: BuilderElement; selected: boolean; onSelect: () => void }) {
  return <div className={"builder-block " + (selected ? "is-selected" : "")} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
    {selected && <div className="builder-selection-label">{element.type}</div>}
    <ComponentPreview element={element}/>
  </div>;
}

function ComponentPreview({ element }: { element: BuilderElement }) {
  const p = element.props;
  switch (element.type) {
    case "header": return <div className="site-block header-block"><strong>{String(p.brand)}</strong><nav>Home <span>Services</span><span>About</span><span>Contact</span><button>Get Started</button></nav></div>;
    case "hero": return <section className="site-block hero-block"><div><small>{String(p.eyebrow)}</small><h1>{String(p.title)}</h1><p>{String(p.description)}</p><div><button>{String(p.primary)}</button><button className="ghost">{String(p.secondary)}</button></div></div><div className="hero-shape"><span/></div></section>;
    case "features": return <section className="site-block feature-block"><small>WHY CHOOSE US</small><h2>{String(p.title)}</h2><div className="feature-grid">{["Fast setup","Mobile ready","Built to convert"].map((item) => <article key={item}><span>✦</span><strong>{item}</strong><p>Reusable content designed for your business.</p></article>)}</div></section>;
    case "services": return <section className="site-block feature-block"><small>SERVICES</small><h2>What we do.</h2><div className="feature-grid">{["Consulting","Design","Support"].map((item) => <article key={item}><span>◈</span><strong>{item}</strong><p>Present your service clearly.</p></article>)}</div></section>;
    case "products": return <section className="site-block feature-block"><small>STORE</small><h2>Featured products.</h2><div className="feature-grid">{["Product One","Product Two","Product Three"].map((item) => <article key={item}><span>□</span><strong>{item}</strong><p>R299.00 · Add to cart</p></article>)}</div></section>;
    case "pricing": return <section className="site-block feature-block"><small>PRICING</small><h2>Simple plans.</h2><div className="feature-grid">{["Starter","Growth","Pro"].map((item) => <article key={item}><span>◇</span><strong>{item}</strong><p>From R299 / month</p></article>)}</div></section>;
    case "lead-form": return <section className="site-block form-block"><small>GET IN TOUCH</small><h2>Tell us what you need.</h2><input placeholder="Your name"/><input placeholder="Email address"/><textarea placeholder="How can we help?"/><button>Send enquiry</button></section>;
    case "booking": return <section className="site-block form-block"><small>BOOKING</small><h2>Choose a time.</h2><div className="calendar-placeholder">Select date · Select time · Confirm booking</div></section>;
    case "quote": return <section className="site-block form-block"><small>QUOTE</small><h2>Request a quote.</h2><input placeholder="What do you need?"/><button>Request quotation</button></section>;
    case "testimonials": return <section className="site-block feature-block"><small>TRUSTED</small><h2>What customers say.</h2><div className="quote-card">“Excellent service and a beautiful experience.”<strong>— Happy customer</strong></div></section>;
    case "faq": return <section className="site-block feature-block"><small>FAQ</small><h2>Questions, answered.</h2><div className="faq-list"><div>What do you offer? <ChevronDown size={15}/></div><div>How does it work? <ChevronDown size={15}/></div><div>How do I get started? <ChevronDown size={15}/></div></div></section>;
    case "footer": return <footer className="site-block footer-block"><strong>{String(p.brand)}</strong><span>© 2026 · Privacy · Terms · Contact</span></footer>;
    default: return <div className="site-block feature-block"><h2>Component</h2></div>;
  }
}

function PropertyPanel({ element, update, remove, move }: { element: BuilderElement; update: (patch: Record<string, unknown>) => void; remove: () => void; move: (direction: "up" | "down") => void }) {
  const p = element.props;
  const textField = (label: string, key: string) => <label className="property-field"><span>{label}</span><input value={String(p[key] ?? "")} onChange={(e) => update({ [key]: e.target.value })}/></label>;
  return <div className="properties-body">
    <div className="selected-component"><span><MousePointer2 size={14}/></span><div><small>SELECTED COMPONENT</small><strong>{element.type}</strong></div></div>
    {element.type === "hero" && <>{textField("Headline","title")}{textField("Eyebrow","eyebrow")}{textField("Description","description")}{textField("Primary CTA","primary")}{textField("Secondary CTA","secondary")}</>}
    {["header","footer"].includes(element.type) && textField("Brand","brand")}
    <div className="property-section"><small>POSITION</small><div className="property-actions"><button onClick={() => move("up")}><ArrowUp size={15}/>Move up</button><button onClick={() => move("down")}><ArrowDown size={15}/>Move down</button></div></div>
    <div className="property-section"><small>COMPONENT</small><button className="delete-component" onClick={remove}><Trash2 size={15}/>Remove component</button></div>
  </div>;
}

function defaultProps(type: string): Record<string, unknown> {
  const defaults: Record<string, Record<string, unknown>> = {
    header: { brand: "Your Business" },
    hero: { eyebrow: "WELCOME", title: "Your next customer starts here.", description: "Tell visitors what you do and why they should choose you.", primary: "Get Started", secondary: "Learn More" },
    features: { title: "Everything your customers need." },
    footer: { brand: "Your Business" }
  };
  return defaults[type] ?? {};
}

function ViewportButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button title={label} onClick={onClick} className={"builder-viewport-button " + (active ? "active" : "")}>{icon}</button>;
}
