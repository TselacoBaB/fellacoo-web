"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);
  const [libraryFilter, setLibraryFilter] = useState<ComponentDefinition["category"] | "All">("All");
  const [saved, setSaved] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"checking" | "local" | "saving" | "synced" | "error">("checking");
  const [remoteEnabled, setRemoteEnabled] = useState(false);
  const [buildRequestId, setBuildRequestId] = useState<string | null>(projectId ?? null);
  const [projectName, setProjectName] = useState("Untitled Website");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "published" | "error">("idle");
  const [publishMessage, setPublishMessage] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
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
            draft?: { id: string; document: BuilderDocument | null; businessName?: string | null; publishedUrl?: string | null } | null;
          };

          if (projectId) {
            if (payload.draft?.document) {
              resetDocument(payload.draft.document);
              setProjectName(payload.draft.businessName?.trim() || "Untitled Website");
              setBuildRequestId(payload.draft.id);
              setPublishedUrl(payload.draft.publishedUrl ?? null);
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

  async function saveDraft(): Promise<string | null> {
    setSyncStatus("saving");

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(document));
      setSaved(true);
    } catch {
      setSaved(false);
    }

    if (!remoteEnabled) {
      setSyncStatus("local");
      return null;
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
        return null;
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
      return payload.buildRequestId ?? buildRequestId;
    } catch {
      setSyncStatus("local");
      return null;
    }
  }

  async function publishCurrentWebsite() {
    setPublishState("publishing");
    setPublishMessage("");

    try {
      const id = buildRequestId ?? await saveDraft();
      if (!id) {
        setPublishState("error");
        setPublishMessage("Save the website to Fellacoo before publishing.");
        return;
      }

      const response = await fetch("/api/builder/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildRequestId: id })
      });
      const payload = await response.json() as { url?: string; error?: string };

      if (!response.ok) {
        setPublishState("error");
        setPublishMessage(payload.error || "Publishing failed.");
        return;
      }

      setPublishedUrl(payload.url ?? null);
      setPublishState("published");
      setPublishMessage(payload.url ? "Your website is live." : "Website published.");
    } catch {
      setPublishState("error");
      setPublishMessage("Publishing failed. Please try again.");
    }
  }

  const visibleLibrary = useMemo(
    () => library.filter((item) => libraryFilter === "All" || item.category === libraryFilter),
    [libraryFilter]
  );

  function insertComponent(type: string, index = page.elements.length) {
    const id = type + "-" + Date.now();
    const element: BuilderElement = { id, type, props: defaultProps(type) };
    updateDocument((current) => ({
      ...current,
      pages: current.pages.map((p, pageIndex) => {
        if (pageIndex !== 0) return p;
        const elements = [...p.elements];
        elements.splice(Math.max(0, Math.min(index, elements.length)), 0, element);
        return { ...p, elements };
      })
    }));
    setSelectedId(id);
    setDragOverIndex(null);
  }

  function addComponent(type: string) {
    insertComponent(type);
  }

  function beginLibraryDrag(event: React.DragEvent, type: string) {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/x-fellacoo-component", type);
    event.dataTransfer.setData("text/plain", type);
  }

  function beginElementDrag(event: React.DragEvent, id: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-fellacoo-element", id);
    event.dataTransfer.setData("text/plain", id);
    setDraggingElementId(id);
  }

  function handleCanvasDragOver(event: React.DragEvent, index: number) {
    event.preventDefault();
    event.dataTransfer.dropEffect = event.dataTransfer.types.includes("application/x-fellacoo-component") ? "copy" : "move";
    setDragOverIndex(index);
  }

  function handleCanvasDrop(event: React.DragEvent, index: number) {
    event.preventDefault();
    const componentType = event.dataTransfer.getData("application/x-fellacoo-component");
    const elementId = event.dataTransfer.getData("application/x-fellacoo-element");

    if (componentType) {
      insertComponent(componentType, index);
    } else if (elementId) {
      const sourceIndex = page.elements.findIndex((element) => element.id === elementId);
      if (sourceIndex >= 0) {
        let targetIndex = Math.max(0, Math.min(index, page.elements.length));
        if (sourceIndex < targetIndex) targetIndex -= 1;
        if (sourceIndex !== targetIndex) {
          const elements = [...page.elements];
          const [moved] = elements.splice(sourceIndex, 1);
          elements.splice(targetIndex, 0, moved);
          updateDocument((current) => ({
            ...current,
            pages: current.pages.map((p, pageIndex) => pageIndex === 0 ? { ...p, elements } : p)
          }));
          setSelectedId(elementId);
        }
      }
      setDragOverIndex(null);
      setDraggingElementId(null);
    }
  }

  function endElementDrag() {
    setDraggingElementId(null);
    setDragOverIndex(null);
  }

  function updateSelected(patch: Record<string, unknown>) {
    updateDocument((current) => ({
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
    updateDocument((current) => ({ ...current, pages: current.pages.map((p, i) => i === 0 ? { ...p, elements: p.elements.filter((element) => element.id !== selectedId) } : p) }));
    setSelectedId(next?.id ?? "");
  }

  function moveSelected(direction: "up" | "down") {
    const index = page.elements.findIndex((element) => element.id === selectedId);
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || nextIndex < 0 || nextIndex >= page.elements.length) return;
    const elements = [...page.elements];
    [elements[index], elements[nextIndex]] = [elements[nextIndex], elements[index]];
    updateDocument((current) => ({ ...current, pages: current.pages.map((p, i) => i === 0 ? { ...p, elements } : p) }));
  }

  return (
    <main className="builder-app">
      <header className="builder-topbar">
        <div className="builder-top-left">
          <button className="builder-icon-button" onClick={() => { setLeftOpen((v) => !v); setRightOpen(false); }} title="Toggle components"><Menu size={19}/></button>
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
  <small>
    {publishState === "published" && publishedUrl
      ? <a href={publishedUrl} target="_blank" rel="noreferrer" className="builder-live-link">Live website ↗</a>
      : saved
        ? syncStatus === "synced" ? "Synced with Supabase" : "Saved locally"
        : "Saving…"}
  </small>
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
          <button className="builder-publish" onClick={publishCurrentWebsite} disabled={publishState === "publishing"}>
            {publishState === "publishing" ? "Publishing…" : publishState === "published" ? "Published" : "Publish"}
          </button>
        </div>
      </header>

      {publishMessage && (
        <div className={"builder-publish-toast " + (publishState === "error" ? "is-error" : "")}>
          <span>{publishMessage}</span>
          {publishedUrl && <a href={publishedUrl} target="_blank" rel="noreferrer">Open live site ↗</a>}
          <button onClick={() => setPublishMessage("")} aria-label="Dismiss">×</button>
        </div>
      )}

      <div className="builder-workspace">
        {(leftOpen || rightOpen) && <button className="builder-panel-backdrop" aria-label="Close panels" onClick={() => { setLeftOpen(false); setRightOpen(false); }} />}
        {leftOpen && <aside className={"builder-left " + (leftOpen ? "is-open" : "")}>
          <div className="builder-panel-head"><div><small>WEBSITE BUILDER</small><strong>Components</strong></div><button onClick={() => setLeftOpen(false)}><X size={16}/></button></div>
          <div className="builder-page-select"><LayoutTemplate size={15}/><span>Home</span><ChevronDown size={14}/></div>
          <div className="component-tabs">
            {(["All", "Layout", "Content", "Commerce", "Business"] as const).map((category) => <button key={category} className={libraryFilter === category ? "active" : ""} onClick={() => setLibraryFilter(category)}>{category}</button>)}
          </div>
          <div className="component-library">
            {visibleLibrary.map((item) => (
              <button
                className="component-item"
                key={item.type}
                draggable
                onDragStart={(event) => beginLibraryDrag(event, item.type)}
                onDragEnd={endElementDrag}
                onClick={() => addComponent(item.type)}
                title={"Click to add " + item.label + " or drag it onto the canvas"}
              >
                <span className="component-item-icon"><Plus size={14}/></span>
                <span><strong>{item.label}</strong><small>Click or drag to canvas · {item.description}</small></span>
                <span className="component-drag-grip" aria-hidden="true">⋮⋮</span>
              </button>
            ))}
          </div>
          <div className="builder-left-footer"><Palette size={15}/><span>Brand Kit</span><ChevronRight size={14}/></div>
        </aside>}

        <section className="builder-canvas-area">
          <div className="canvas-toolbar">
            <span><MousePointer2 size={14}/>Live design canvas</span>
            <div>
              <button onClick={undo} disabled={!canUndo} title="Undo"><Undo2 size={15}/></button>
              <button onClick={redo} disabled={!canRedo} title="Redo"><Redo2 size={15}/></button>
            </div>
          </div>
          <div
            className={"canvas-stage " + (dragOverIndex !== null ? "is-dragging" : "")}
            onClick={() => setSelectedId("")}
            onDragOver={(event) => handleCanvasDragOver(event, page.elements.length)}
            onDrop={(event) => handleCanvasDrop(event, page.elements.length)}
          >
            <div className={"website-canvas viewport-" + viewport}>
              <div
                className={"canvas-drop-zone " + (dragOverIndex === 0 ? "is-active" : "")}
                onDragOver={(event) => handleCanvasDragOver(event, 0)}
                onDrop={(event) => handleCanvasDrop(event, 0)}
                aria-label="Drop component at the top of the page"
              />
              {page.elements.map((element, index) => (
                <div key={element.id} className="builder-drop-wrapper">
                  {dragOverIndex === index && <div className="builder-drop-indicator"><span>Drop component here</span></div>}
                  <BuilderBlock
                    element={element}
                    selected={selectedId === element.id}
                    dragging={draggingElementId === element.id}
                    onSelect={() => setSelectedId(element.id)}
                    onDragStart={beginElementDrag}
                    onDragEnd={endElementDrag}
                    onDragOver={(event) => handleCanvasDragOver(event, index + 1)}
                    onDrop={(event) => handleCanvasDrop(event, index + 1)}
                  />
                </div>
              ))}
              {dragOverIndex === page.elements.length && <div className="builder-drop-indicator is-end"><span>Drop component here</span></div>}
            </div>
          </div>
        </section>

        {rightOpen && <aside className={"builder-right " + (rightOpen ? "is-open" : "")}>
          <div className="builder-panel-head"><div><small>DESIGN SYSTEM</small><strong>Properties</strong></div><button onClick={() => setRightOpen(false)}><X size={16}/></button></div>
          {selected ? <PropertyPanel element={selected} update={updateSelected} remove={removeSelected} move={moveSelected} /> : <div className="empty-properties"><Settings2 size={22}/><p>Select a component to edit it.</p></div>}
        </aside>}

        {!leftOpen && <button className="floating-panel-button left" onClick={() => { setRightOpen(false); setLeftOpen(true); }}><PanelLeft size={17}/></button>}
        {!rightOpen && <button className="floating-panel-button right" onClick={() => { setLeftOpen(false); setRightOpen(true); }}><PanelRight size={17}/></button>}
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

function BuilderBlock({
  element,
  selected,
  dragging,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}: {
  element: BuilderElement;
  selected: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: (event: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
}) {
  return (
    <div
      className={"builder-block " + (selected ? "is-selected " : "") + (dragging ? "is-dragging" : "")}
      draggable
      onDragStart={(event) => onDragStart(event, element.id)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDragOver(event);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDrop(event);
      }}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
    >
      <div className="builder-drag-handle" title="Drag to reorder">
        <span>⋮⋮</span>
      </div>
      {selected && <div className="builder-selection-label">{element.type}</div>}
      <ComponentPreview element={element}/>
    </div>
  );
}

function getElementStyle(element: BuilderElement): CSSProperties {
  const design = (element.props.design ?? {}) as Record<string, unknown>;
  const style: CSSProperties = {};
  if (typeof design.backgroundColor === "string" && design.backgroundColor) style.backgroundColor = design.backgroundColor;
  if (typeof design.textColor === "string" && design.textColor) style.color = design.textColor;
  if (typeof design.borderRadius === "string" && design.borderRadius) style.borderRadius = design.borderRadius;
  if (typeof design.paddingTop === "string" && design.paddingTop) style.paddingTop = design.paddingTop;
  if (typeof design.paddingBottom === "string" && design.paddingBottom) style.paddingBottom = design.paddingBottom;
  if (typeof design.textAlign === "string" && design.textAlign) style.textAlign = design.textAlign as CSSProperties["textAlign"];
  if (typeof design.boxShadow === "string" && design.boxShadow) style.boxShadow = design.boxShadow;
  if (design.hidden === true) style.display = "none";
  return style;
}

function ComponentPreview({ element }: { element: BuilderElement }) {
  const p = element.props;
  const style = getElementStyle(element);
  switch (element.type) {
    case "header": return <div className="site-block header-block" style={style}><strong>{String(p.brand ?? "Your Business")}</strong><nav><span>{String(p.nav1 ?? "Home")}</span><span>{String(p.nav2 ?? "Services")}</span><span>{String(p.nav3 ?? "About")}</span><span>{String(p.nav4 ?? "Contact")}</span><button>{String(p.cta ?? "Get Started")}</button></nav></div>;
    case "hero": return <section className="site-block hero-block" style={style}><div><small>{String(p.eyebrow ?? "WELCOME")}</small><h1>{String(p.title ?? "Your next customer starts here.")}</h1><p>{String(p.description ?? "")}</p><div><button>{String(p.primary ?? "Get Started")}</button><button className="ghost">{String(p.secondary ?? "Learn More")}</button></div></div><div className="hero-shape"><span/></div></section>;
    case "features": return <section className="site-block feature-block" style={style}><small>WHY CHOOSE US</small><h2>{String(p.title ?? "Everything your customers need.")}</h2><div className="feature-grid">{[[p.item1 ?? "Fast setup",p.item1Description ?? "A clear foundation designed around your business."],[p.item2 ?? "Mobile ready",p.item2Description ?? "A responsive experience across every screen."],[p.item3 ?? "Built to convert",p.item3Description ?? "Focused content and calls to action."]].map(([title,description])=><article key={String(title)}><span>✦</span><strong>{String(title)}</strong><p>{String(description)}</p></article>)}</div></section>;
    case "services": return <section className="site-block feature-block" style={style}><small>{String(p.eyebrow ?? "SERVICES")}</small><h2>{String(p.title ?? "What we do.")}</h2><div className="feature-grid">{[1,2,3].map((index)=><article key={index}><span>◈</span><strong>{String(p["item"+index] ?? ["Consulting","Design","Support"][index-1])}</strong><p>{String(p["item"+index+"Description"] ?? "Present your service clearly.")}</p></article>)}</div></section>;
    case "products": return <section className="site-block feature-block" style={style}><small>STORE</small><h2>{String(p.title ?? "Featured products.")}</h2><div className="feature-grid">{[1,2,3].map((index)=><article key={index}><span>□</span><strong>{String(p["item"+index] ?? ["Product One","Product Two","Product Three"][index-1])}</strong><p>{String(p["price"+index] ?? "R299.00")} · {String(p.cta ?? "Add to cart")}</p></article>)}</div></section>;
    case "pricing": return <section className="site-block feature-block" style={style}><small>PRICING</small><h2>{String(p.title ?? "Simple plans.")}</h2><div className="feature-grid">{[1,2,3].map((index)=><article key={index}><span>◇</span><strong>{String(p["item"+index] ?? ["Starter","Growth","Pro"][index-1])}</strong><p>{String(p["price"+index] ?? "From R299 / month")}</p></article>)}</div></section>;
    case "lead-form": return <section className="site-block form-block" style={style}><small>{String(p.eyebrow ?? "GET IN TOUCH")}</small><h2>{String(p.title ?? "Tell us what you need.")}</h2><input placeholder={String(p.namePlaceholder ?? "Your name")}/><input placeholder={String(p.emailPlaceholder ?? "Email address")}/><textarea placeholder={String(p.messagePlaceholder ?? "How can we help?")}/><button>{String(p.cta ?? "Send enquiry")}</button></section>;
    case "booking": return <section className="site-block form-block" style={style}><small>BOOKING</small><h2>{String(p.title ?? "Choose a time.")}</h2><div className="calendar-placeholder">{String(p.helper ?? "Select date · Select time · Confirm booking")}</div></section>;
    case "quote": return <section className="site-block form-block" style={style}><small>QUOTE</small><h2>{String(p.title ?? "Request a quote.")}</h2><input placeholder={String(p.placeholder ?? "What do you need?")}/><button>{String(p.cta ?? "Request quotation")}</button></section>;
    case "testimonials": return <section className="site-block feature-block" style={style}><small>TRUSTED</small><h2>{String(p.title ?? "What customers say.")}</h2><div className="quote-card">“{String(p.quote ?? "Excellent service and a beautiful experience.")}”<strong>— {String(p.author ?? "Happy customer")}</strong></div></section>;
    case "faq": return <section className="site-block feature-block" style={style}><small>FAQ</small><h2>{String(p.title ?? "Questions, answered.")}</h2><div className="faq-list">{[1,2,3].map((index)=><div key={index}>{String(p["question"+index] ?? ["What do you offer?","How does it work?","How do I get started?"][index-1])}<ChevronDown size={15}/></div>)}</div></section>;
    case "footer": return <footer className="site-block footer-block" style={style}><strong>{String(p.brand ?? "Your Business")}</strong><span>{String(p.copyright ?? "© 2026 · Privacy · Terms · Contact")}</span></footer>;
    default: return <div className="site-block feature-block" style={style}><h2>Component</h2></div>;
  }
}

type PropertyPanelProps = { element: BuilderElement; update: (patch: Record<string, unknown>) => void; remove: () => void; move: (direction: "up" | "down") => void };

function PropertyPanel({ element, update, remove, move }: PropertyPanelProps) {
  const p = element.props;
  const design = (p.design ?? {}) as Record<string, unknown>;
  const textField = (label: string, key: string) => <label className="property-field"><span>{label}</span><input value={String(p[key] ?? "")} onChange={(e) => update({ [key]: e.target.value })}/></label>;
  const updateDesign = (key: string, value: unknown) => update({ design: { ...design, [key]: value } });
  const colorField = (label: string, key: string, fallback: string) => <label className="property-color-field"><span>{label}</span><div><input type="color" value={String(design[key] ?? fallback)} onChange={(e) => updateDesign(key,e.target.value)} aria-label={label}/><input value={String(design[key] ?? fallback)} onChange={(e) => updateDesign(key,e.target.value)} aria-label={label + " hex value"}/></div></label>;
  const selectField = (label: string, key: string, options: Array<[string,string]>, fallback: string) => <label className="property-field"><span>{label}</span><select value={String(design[key] ?? fallback)} onChange={(e)=>updateDesign(key,e.target.value)}>{options.map(([value,text])=><option key={value} value={value}>{text}</option>)}</select></label>;
  const contentFields: Record<string, Array<[string,string]>> = {
    header:[["Brand name","brand"],["Navigation 1","nav1"],["Navigation 2","nav2"],["Navigation 3","nav3"],["Navigation 4","nav4"],["CTA","cta"]],
    hero:[["Eyebrow","eyebrow"],["Headline","title"],["Description","description"],["Primary CTA","primary"],["Secondary CTA","secondary"],["Primary URL","primaryUrl"],["Secondary URL","secondaryUrl"]],
    features:[["Section title","title"],["Card 1 title","item1"],["Card 1 description","item1Description"],["Card 2 title","item2"],["Card 2 description","item2Description"],["Card 3 title","item3"],["Card 3 description","item3Description"]],
    services:[["Eyebrow","eyebrow"],["Section title","title"],["Service 1","item1"],["Service 1 description","item1Description"],["Service 2","item2"],["Service 2 description","item2Description"],["Service 3","item3"],["Service 3 description","item3Description"]],
    products:[["Section title","title"],["Product 1","item1"],["Product 1 price","price1"],["Product 2","item2"],["Product 2 price","price2"],["Product 3","item3"],["Product 3 price","price3"],["Cart CTA","cta"]],
    pricing:[["Section title","title"],["Plan 1","item1"],["Plan 1 price","price1"],["Plan 2","item2"],["Plan 2 price","price2"],["Plan 3","item3"],["Plan 3 price","price3"]],
    "lead-form":[["Eyebrow","eyebrow"],["Title","title"],["Name placeholder","namePlaceholder"],["Email placeholder","emailPlaceholder"],["Message placeholder","messagePlaceholder"],["Submit button","cta"]],
    booking:[["Title","title"],["Helper text","helper"]],
    quote:[["Title","title"],["Field placeholder","placeholder"],["Submit button","cta"]],
    testimonials:[["Section title","title"],["Quote","quote"],["Customer name","author"]],
    faq:[["Section title","title"],["Question 1","question1"],["Question 2","question2"],["Question 3","question3"]],
    footer:[["Brand name","brand"],["Footer text","copyright"]]
  };
  const fields = contentFields[element.type] ?? [];
  return <div className="properties-body">
    <div className="selected-component"><span><MousePointer2 size={14}/></span><div><small>SELECTED COMPONENT</small><strong>{element.type.replace("-", " ")}</strong></div></div>
    <details className="property-section property-section-collapsible" open><summary>Content</summary>{fields.length ? fields.map(([label,key])=><div key={key}>{textField(label,key)}</div>) : <p className="property-hint">This component has no editable content yet.</p>}</details>
    <details className="property-section property-section-collapsible" open><summary>Colors</summary>{colorField("Background","backgroundColor","#ffffff")}{colorField("Text","textColor","#111522")}</details>
    <details className="property-section property-section-collapsible"><summary>Layout</summary>{selectField("Text alignment","textAlign",[["left","Left"],["center","Center"],["right","Right"]],"left")}{selectField("Corner radius","borderRadius",[["0px","Square"],["8px","Small"],["16px","Medium"],["28px","Large"],["999px","Pill"]],"0px")}{selectField("Top spacing","paddingTop",[["0px","None"],["24px","Small"],["48px","Medium"],["70px","Large"],["100px","Extra large"]],"0px")}{selectField("Bottom spacing","paddingBottom",[["0px","None"],["24px","Small"],["48px","Medium"],["70px","Large"],["100px","Extra large"]],"0px")}{selectField("Shadow","boxShadow",[["none","None"],["0 8px 24px rgba(15,23,42,.10)","Soft"],["0 20px 50px rgba(15,23,42,.16)","Strong"]],"none")}</details>
    <details className="property-section property-section-collapsible"><summary>Visibility</summary><label className="property-toggle"><span>Hide component</span><input type="checkbox" checked={design.hidden === true} onChange={(e)=>updateDesign("hidden",e.target.checked)}/></label><p className="property-hint">Hidden components remain in your document and can be shown again later.</p></details>
    <div className="property-section"><small>POSITION</small><div className="property-actions"><button onClick={()=>move("up")}><ArrowUp size={15}/>Move up</button><button onClick={()=>move("down")}><ArrowDown size={15}/>Move down</button></div></div>
    <div className="property-section"><small>COMPONENT</small><button className="delete-component" onClick={remove}><Trash2 size={15}/>Remove component</button></div>
  </div>;
}

function defaultProps(type: string): Record<string, unknown> {
  const defaults: Record<string, Record<string, unknown>> = {
    header:{brand:"Your Business",nav1:"Home",nav2:"Services",nav3:"About",nav4:"Contact",cta:"Get Started"},
    hero:{eyebrow:"WELCOME",title:"Your next customer starts here.",description:"Tell visitors what you do and why they should choose you.",primary:"Get Started",secondary:"Learn More",primaryUrl:"#",secondaryUrl:"#"},
    features:{title:"Everything your customers need.",item1:"Fast setup",item1Description:"A clear foundation designed around your business.",item2:"Mobile ready",item2Description:"A responsive experience across every screen.",item3:"Built to convert",item3Description:"Focused content and calls to action."},
    services:{eyebrow:"SERVICES",title:"What we do.",item1:"Consulting",item1Description:"Practical guidance for your next stage.",item2:"Design",item2Description:"Clear, modern experiences for your customers.",item3:"Support",item3Description:"Ongoing help when your business needs it."},
    products:{title:"Featured products.",item1:"Product One",price1:"R299.00",item2:"Product Two",price2:"R499.00",item3:"Product Three",price3:"R699.00",cta:"Add to cart"},
    pricing:{title:"Simple plans.",item1:"Starter",price1:"R299 / month",item2:"Growth",price2:"R599 / month",item3:"Pro",price3:"R999 / month"},
    "lead-form":{eyebrow:"GET IN TOUCH",title:"Tell us what you need.",namePlaceholder:"Your name",emailPlaceholder:"Email address",messagePlaceholder:"How can we help?",cta:"Send enquiry"},
    booking:{title:"Choose a time.",helper:"Select date · Select time · Confirm booking"},
    quote:{title:"Request a quote.",placeholder:"What do you need?",cta:"Request quotation"},
    testimonials:{title:"What customers say.",quote:"Excellent service and a beautiful experience.",author:"Happy customer"},
    faq:{title:"Questions, answered.",question1:"What do you offer?",question2:"How does it work?",question3:"How do I get started?"},
    footer:{brand:"Your Business",copyright:"© 2026 · Privacy · Terms · Contact"}
  };
  return defaults[type] ?? {};
}

function ViewportButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button title={label} onClick={onClick} className={"builder-viewport-button " + (active ? "active" : "")}>{icon}</button>;
}
