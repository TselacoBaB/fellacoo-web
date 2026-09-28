"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown, ArrowLeft, ArrowUp, ChevronDown, ChevronRight, Eye, LayoutTemplate, Layers3,
  Menu, Monitor, MousePointer2, PanelLeft, PanelRight, Palette, Plus, Redo2,
  Save, Settings2, Smartphone, Tablet, Trash2, Undo2, X
} from "lucide-react";
import type { BuilderDocument, BuilderElement, BuilderViewport } from "@/types/builder";
import { PrimitivePreview } from "@/components/builder/primitives";
import { useBuilderHistory } from "@/lib/builder/use-builder-history";
import { useAuth } from "@/lib/state/auth-store";

type ComponentDefinition = {
  type: string;
  label: string;
  description: string;
  category: "Layout" | "Content" | "Commerce" | "Business";
};

const library: ComponentDefinition[] = [
  { type: "section", label: "Section", description: "Full-width content section", category: "Layout" },
  { type: "container", label: "Container", description: "Centered content wrapper", category: "Layout" },
  { type: "columns", label: "Columns", description: "Multi-column layout", category: "Layout" },
  { type: "spacer", label: "Spacer", description: "Flexible vertical space", category: "Layout" },
  { type: "text", label: "Text", description: "Paragraph text", category: "Content" },
  { type: "heading", label: "Heading", description: "Section or page heading", category: "Content" },
  { type: "image", label: "Image", description: "Image or visual media", category: "Content" },
  { type: "icon", label: "Icon", description: "Simple visual icon", category: "Content" },
  { type: "link", label: "Link", description: "Text link", category: "Content" },
  { type: "divider", label: "Divider", description: "Horizontal separator", category: "Content" },
  { type: "button", label: "Button", description: "Call-to-action button", category: "Content" },
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
      { id: "header-1", type: "header", props: { brand: "Your Business", nav1: "Home", nav2: "Services", nav3: "About", nav4: "Contact", cta: "Get Started" } },
      { id: "hero-1", type: "hero", props: { eyebrow: "WELCOME", title: "Build a business people remember.", description: "A responsive website built from reusable Fellacoo components.", primary: "Get Started", secondary: "Learn More", primaryUrl: "#", secondaryUrl: "#" } },
      { id: "features-1", type: "features", props: { title: "Everything your customers need.", item1: "Fast setup", item1Description: "A clear foundation designed around your business.", item2: "Mobile ready", item2Description: "A responsive experience across every screen.", item3: "Built to convert", item3Description: "Focused content and calls to action." } },
      { id: "footer-1", type: "footer", props: { brand: "Your Business", copyright: "© 2026 · Privacy · Terms · Contact" } }
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
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?next=" + encodeURIComponent(window.location.pathname));
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
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
  }, [projectId, authLoading, isAuthenticated]);

  useEffect(() => {
    setSaved(false);

    const timer = window.setTimeout(async () => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(document));
        setSaved(true);
      } catch {}

      if (!isAuthenticated || authLoading) return;

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
          const errorPayload = await response.json().catch(() => null) as { error?: string } | null;
          console.error("[builder/draft] autosave failed", response.status, errorPayload);
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
  }, [document, projectName, isAuthenticated, authLoading]);

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
  const selected = findElementById(page.elements, selectedId);

  async function saveDraft(): Promise<string | null> {
    setSyncStatus("saving");

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(document));
      setSaved(true);
    } catch {
      setSaved(false);
    }

    if (!isAuthenticated || authLoading) {
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
        const errorPayload = await response.json().catch(() => null) as { error?: string } | null;
        console.error("[builder/draft] manual save failed", response.status, errorPayload);
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

  function addChildComponent(type: string) {
    if (!selectedId) return;
    const child: BuilderElement = {
      id: type + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      type,
      props: defaultProps(type)
    };
    updateDocument((current) => ({
      ...current,
      pages: current.pages.map((p, pageIndex) =>
        pageIndex === 0
          ? { ...p, elements: appendChildToTree(p.elements, selectedId, child) }
          : p
      )
    }));
    setSelectedId(child.id);
  }

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
        ? { ...p, elements: updateElementTree(p.elements, selectedId, (element) => ({ ...element, props: { ...element.props, ...patch } })) }
        : p)
    }));
  }

  function removeSelected() {
    if (!selectedId) return;
    const next = findAdjacentElement(page.elements, selectedId);
    updateDocument((current) => ({
      ...current,
      pages: current.pages.map((p, i) => i === 0 ? { ...p, elements: removeElementTree(p.elements, selectedId) } : p)
    }));
    setSelectedId(next?.id ?? "");
  }

  function moveSelected(direction: "up" | "down") {
    updateDocument((current) => ({
      ...current,
      pages: current.pages.map((p, i) => {
        if (i !== 0) return p;
        const elements = [...p.elements];
        moveElementTree(elements, selectedId, direction);
        return { ...p, elements };
      })
    }));
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
        ? syncStatus === "synced" ? "Synced with Fellacoo" : "Saved locally"
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
          <button className="builder-save" onClick={saveDraft} disabled={syncStatus === "saving"} title="Save the current draft locally and to the Fellacoo database when connected"><Save size={15}/>{syncStatus === "saving" ? "Saving" : saved ? syncStatus === "synced" ? "Synced" : "Saved" : "Save"}</button>
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
          <div className="builder-layers-head"><span><Layers3 size={13}/>Layers</span><small>{countElements(page.elements)} elements</small></div>
          <div className="builder-layer-tree">
            {page.elements.map((element) => (
              <LayerTreeItem key={element.id} element={element} selectedId={selectedId} onSelect={setSelectedId} depth={0}/>
            ))}
          </div>
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
                    selectedId={selectedId}
                    selectElement={setSelectedId}
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
          {selected ? <PropertyPanel element={selected} update={updateSelected} remove={removeSelected} move={moveSelected} addChild={addChildComponent} /> : <div className="empty-properties"><Settings2 size={22}/><p>Select a component to edit it.</p></div>}
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
                    <StaticPreviewTree element={element}/>
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
  selectedId,
  selectElement,
  dragging,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}: {
  element: BuilderElement;
  selected: boolean;
  selectedId?: string;
  selectElement: (id: string) => void;
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
      onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); onDragOver(event); }}
      onDrop={(event) => { event.preventDefault(); event.stopPropagation(); onDrop(event); }}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
    >
      <div className="builder-drag-handle" title="Drag to reorder">
        <span>⋮⋮</span>
      </div>
      {selected && <div className="builder-selection-label">{element.type}</div>}
      <ComponentPreview element={element}>
        {element.children?.map((child) => (
          <div className="builder-nested-element" key={child.id}>
            <BuilderBlock
              element={child}
              selected={selectedId === child.id}
              selectedId={selectedId}
              selectElement={selectElement}
              dragging={false}
              onSelect={() => selectElement(child.id)}
              onDragStart={() => {}}
              onDragEnd={() => {}}
              onDragOver={() => {}}
              onDrop={() => {}}
            />
          </div>
        ))}
      </ComponentPreview>
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
  if (typeof design.fontSize === "string" && design.fontSize) style.fontSize = design.fontSize;
  if (typeof design.fontWeight === "string" && design.fontWeight) style.fontWeight = design.fontWeight;
  if (typeof design.lineHeight === "string" && design.lineHeight) style.lineHeight = design.lineHeight;
  if (design.hidden === true) style.display = "none";
  return style;
}

function ComponentPreview({ element, children }: { element: BuilderElement; children?: ReactNode }) {
  const p = element.props;
  const style = getElementStyle(element);
  const nested = children ? <div className="builder-nested-content">{children}</div> : null;

  if (["text", "heading", "button", "image", "icon", "link", "divider", "spacer", "columns"].includes(element.type)) {
    return <PrimitivePreview element={element}>{nested}</PrimitivePreview>;
  }

  switch (element.type) {
    case "section":
      return <section className="site-block builder-section-block" style={style}>
        <small>{String(p.label ?? "SECTION")}</small>
        <h2>{String(p.title ?? "Your section")}</h2>
        {nested}
      </section>;
    case "container":
      return <div className="builder-container-block" style={style}>{nested}</div>;
    case "header":
      return <div className="site-block header-block" style={style}>
        <strong>{String(p.brand ?? "Your Business")}</strong>
        <nav><span>{String(p.nav1 ?? "Home")}</span><span>{String(p.nav2 ?? "Services")}</span><span>{String(p.nav3 ?? "About")}</span><span>{String(p.nav4 ?? "Contact")}</span><button>{String(p.cta ?? "Get Started")}</button></nav>
        {nested}
      </div>;
    case "hero":
      return <section className="site-block hero-block" style={style}>
        <div><small>{String(p.eyebrow ?? "WELCOME")}</small><h1>{String(p.title ?? "Your next customer starts here.")}</h1><p>{String(p.description ?? "")}</p><div><button>{String(p.primary ?? "Get Started")}</button><button className="ghost">{String(p.secondary ?? "Learn More")}</button></div></div>
        <div className="hero-shape"><span/></div>
        {nested}
      </section>;
    case "features":
      return <section className="site-block feature-block" style={style}>
        <small>WHY CHOOSE US</small><h2>{String(p.title ?? "Everything your customers need.")}</h2>
        <div className="feature-grid">{[[p.item1 ?? "Fast setup",p.item1Description ?? "A clear foundation designed around your business."],[p.item2 ?? "Mobile ready",p.item2Description ?? "A responsive experience across every screen."],[p.item3 ?? "Built to convert",p.item3Description ?? "Focused content and calls to action."]].map(([title,description])=><article key={String(title)}><span>✦</span><strong>{String(title)}</strong><p>{String(description)}</p></article>)}</div>
        {nested}
      </section>;
    case "services":
      return <section className="site-block feature-block" style={style}>
        <small>{String(p.eyebrow ?? "SERVICES")}</small><h2>{String(p.title ?? "What we do.")}</h2>
        <div className="feature-grid">{[1,2,3].map((index)=><article key={index}><span>◈</span><strong>{String(p["item"+index] ?? ["Consulting","Design","Support"][index-1])}</strong><p>{String(p["item"+index+"Description"] ?? "Present your service clearly.")}</p></article>)}</div>
        {nested}
      </section>;
    case "products":
      return <section className="site-block feature-block" style={style}>
        <small>STORE</small><h2>{String(p.title ?? "Featured products.")}</h2>
        <div className="feature-grid">{[1,2,3].map((index)=><article key={index}><span>□</span><strong>{String(p["item"+index] ?? ["Product One","Product Two","Product Three"][index-1])}</strong><p>{String(p["price"+index] ?? "R299.00")} · {String(p.cta ?? "Add to cart")}</p></article>)}</div>
        {nested}
      </section>;
    case "pricing":
      return <section className="site-block feature-block" style={style}>
        <small>PRICING</small><h2>{String(p.title ?? "Simple plans.")}</h2>
        <div className="feature-grid">{[1,2,3].map((index)=><article key={index}><span>◇</span><strong>{String(p["item"+index] ?? ["Starter","Growth","Pro"][index-1])}</strong><p>{String(p["price"+index] ?? "From R299 / month")}</p></article>)}</div>
        {nested}
      </section>;
    case "lead-form":
      return <section className="site-block form-block" style={style}>
        <small>{String(p.eyebrow ?? "GET IN TOUCH")}</small><h2>{String(p.title ?? "Tell us what you need.")}</h2><input placeholder={String(p.namePlaceholder ?? "Your name")}/><input placeholder={String(p.emailPlaceholder ?? "Email address")}/><textarea placeholder={String(p.messagePlaceholder ?? "How can we help?")}/><button>{String(p.cta ?? "Send enquiry")}</button>
        {nested}
      </section>;
    case "booking":
      return <section className="site-block form-block" style={style}>
        <small>BOOKING</small><h2>{String(p.title ?? "Choose a time.")}</h2><div className="calendar-placeholder">{String(p.helper ?? "Select date · Select time · Confirm booking")}</div>
        {nested}
      </section>;
    case "quote":
      return <section className="site-block form-block" style={style}>
        <small>QUOTE</small><h2>{String(p.title ?? "Request a quote.")}</h2><input placeholder={String(p.placeholder ?? "What do you need?")}/><button>{String(p.cta ?? "Request quotation")}</button>
        {nested}
      </section>;
    case "testimonials":
      return <section className="site-block feature-block" style={style}>
        <small>TRUSTED</small><h2>{String(p.title ?? "What customers say.")}</h2><div className="quote-card">“{String(p.quote ?? "Excellent service and a beautiful experience.")}”<strong>— {String(p.author ?? "Happy customer")}</strong></div>
        {nested}
      </section>;
    case "faq":
      return <section className="site-block feature-block" style={style}>
        <small>FAQ</small><h2>{String(p.title ?? "Questions, answered.")}</h2><div className="faq-list">{[1,2,3].map((index)=><div key={index}>{String(p["question"+index] ?? ["What do you offer?","How does it work?","How do I get started?"][index-1])}<ChevronDown size={15}/></div>)}</div>
        {nested}
      </section>;
    case "footer":
      return <footer className="site-block footer-block" style={style}><strong>{String(p.brand ?? "Your Business")}</strong><span>{String(p.copyright ?? "© 2026 · Privacy · Terms · Contact")}</span>{nested}</footer>;
    default:
      return <div className="site-block feature-block" style={style}><h2>Component</h2>{nested}</div>;
  }
}

function StaticPreviewTree({ element }: { element: BuilderElement }) {
  return (
    <ComponentPreview element={element}>
      {element.children?.map((child) => <StaticPreviewTree key={child.id} element={child} />)}
    </ComponentPreview>
  );
}

type PropertyPanelProps = {
  element: BuilderElement;
  update: (patch: Record<string, unknown>) => void;
  remove: () => void;
  move: (direction: "up" | "down") => void;
  addChild: (type: string) => void;
};

function PropertyPanel({ element, update, remove, move, addChild }: PropertyPanelProps) {
  const p = element.props;
  const design = (p.design ?? {}) as Record<string, unknown>;
  const textField = (label: string, key: string) => <label className="property-field"><span>{label}</span><input value={String(p[key] ?? "")} onChange={(e) => update({ [key]: e.target.value })}/></label>;
  const updateDesign = (key: string, value: unknown) => update({ design: { ...design, [key]: value } });
  const colorField = (label: string, key: string, fallback: string) => <label className="property-color-field"><span>{label}</span><div><input type="color" value={String(design[key] ?? fallback)} onChange={(e) => updateDesign(key,e.target.value)} aria-label={label}/><input value={String(design[key] ?? fallback)} onChange={(e) => updateDesign(key,e.target.value)} aria-label={label + " hex value"}/></div></label>;
  const selectField = (label: string, key: string, options: Array<[string,string]>, fallback: string) => <label className="property-field"><span>{label}</span><select value={String(design[key] ?? fallback)} onChange={(e)=>updateDesign(key,e.target.value)}>{options.map(([value,text])=><option key={value} value={value}>{text}</option>)}</select></label>;
  const contentFields: Record<string, Array<[string,string]>> = {
    section:[["Section label","label"],["Section title","title"]],
    container:[["Container label","label"]],
    columns:[["Column count","columns"]],
    spacer:[["Height","height"]],
    text:[["Text","text"]],
    heading:[["Heading","text"],["Heading level","level"]],
    button:[["Button label","label"],["Button URL","url"],["Variant","variant"]],
    image:[["Image URL","src"],["Alt text","alt"],["Caption","caption"]],
    icon:[["Symbol","symbol"],["Accessible label","label"]],
    link:[["Link label","label"],["URL","url"]],
    divider:[],
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
  const childOptions = library.filter((item) => item.type !== "header" && item.type !== "footer");

  return <div className="properties-body">
    <div className="selected-component"><span><MousePointer2 size={14}/></span><div><small>SELECTED ELEMENT</small><strong>{element.type.replace("-", " ")}</strong></div></div>
    <details className="property-section property-section-collapsible" open><summary>Content</summary>{fields.length ? fields.map(([label,key])=><div key={key}>{textField(label,key)}</div>) : <p className="property-hint">This element has no editable content yet.</p>}</details>
    <details className="property-section property-section-collapsible" open><summary>Colors</summary>{colorField("Background","backgroundColor","#ffffff")}{colorField("Text","textColor","#111522")}</details>
<details className="property-section property-section-collapsible"><summary>Layout</summary>{selectField("Text alignment","textAlign",[["left","Left"],["center","Center"],["right","Right"]],"left")}{selectField("Corner radius","borderRadius",[["0px","Square"],["8px","Small"],["16px","Medium"],["28px","Large"],["999px","Pill"]],"0px")}{selectField("Top spacing","paddingTop",[["0px","None"],["24px","Small"],["48px","Medium"],["70px","Large"],["100px","Extra large"]],"0px")}{selectField("Bottom spacing","paddingBottom",[["0px","None"],["24px","Small"],["48px","Medium"],["70px","Large"],["100px","Extra large"]],"0px")}{selectField("Shadow","boxShadow",[["none","None"],["0 8px 24px rgba(15,23,42,.10)","Soft"],["0 20px 50px rgba(15,23,42,.16)","Strong"]],"none")}</details>
    <details className="property-section property-section-collapsible"><summary>Typography</summary>{selectField("Font size","fontSize",[["12px","Small"],["14px","Body small"],["16px","Body"],["18px","Large"],["24px","XL"],["32px","Display"]],"16px")}{selectField("Font weight","fontWeight",[["400","Regular"],["500","Medium"],["600","Semibold"],["700","Bold"],["800","Extra bold"]],"400")}{selectField("Line height","lineHeight",[["1.2","Tight"],["1.5","Normal"],["1.7","Relaxed"],["2","Loose"]],"1.5")}</details>
    <details className="property-section property-section-collapsible" open><summary>Nested elements</summary>
      <p className="property-hint">Add an element inside the selected component. This creates a real parent → child relationship in the saved document.</p>
      <div className="nested-add-grid">{childOptions.map((item)=><button key={item.type} onClick={()=>addChild(item.type)}><Plus size={12}/>{item.label}</button>)}</div>
    </details>
    <details className="property-section property-section-collapsible"><summary>Visibility</summary><label className="property-toggle"><span>Hide component</span><input type="checkbox" checked={design.hidden === true} onChange={(e)=>updateDesign("hidden",e.target.checked)}/></label><p className="property-hint">Hidden elements remain in your document and can be shown again later.</p></details>
    <div className="property-section"><small>POSITION</small><div className="property-actions"><button onClick={()=>move("up")}><ArrowUp size={15}/>Move up</button><button onClick={()=>move("down")}><ArrowDown size={15}/>Move down</button></div></div>
    <div className="property-section"><small>COMPONENT</small><button className="delete-component" onClick={remove}><Trash2 size={15}/>Remove element</button></div>
  </div>;
}

function findElementById(elements: BuilderElement[], id: string): BuilderElement | null {
  for (const element of elements) {
    if (element.id === id) return element;
    if (element.children?.length) {
      const found = findElementById(element.children, id);
      if (found) return found;
    }
  }
  return null;
}

function appendChildToTree(elements: BuilderElement[], parentId: string, child: BuilderElement): BuilderElement[] {
  return elements.map((element) => {
    if (element.id === parentId) return { ...element, children: [...(element.children ?? []), child] };
    if (element.children?.length) return { ...element, children: appendChildToTree(element.children, parentId, child) };
    return element;
  });
}

function updateElementTree(elements: BuilderElement[], id: string, updater: (element: BuilderElement) => BuilderElement): BuilderElement[] {
  return elements.map((element) => {
    const updated = element.id === id ? updater(element) : element;
    return updated.children?.length ? { ...updated, children: updateElementTree(updated.children, id, updater) } : updated;
  });
}

function removeElementTree(elements: BuilderElement[], id: string): BuilderElement[] {
  return elements
    .filter((element) => element.id !== id)
    .map((element) => element.children?.length ? { ...element, children: removeElementTree(element.children, id) } : element);
}

function moveElementTree(elements: BuilderElement[], id: string, direction: "up" | "down"): boolean {
  const index = elements.findIndex((element) => element.id === id);
  if (index >= 0) {
    const next = direction === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= elements.length) return false;
    [elements[index], elements[next]] = [elements[next], elements[index]];
    return true;
  }
  for (const element of elements) {
    if (element.children?.length && moveElementTree(element.children, id, direction)) return true;
  }
  return false;
}

function findAdjacentElement(elements: BuilderElement[], id: string): BuilderElement | null {
  const index = elements.findIndex((element) => element.id === id);
  if (index >= 0) return elements[index - 1] ?? elements[index + 1] ?? null;
  for (const element of elements) {
    if (element.children?.length) {
      const nested = findAdjacentElement(element.children, id);
      if (nested) return nested;
    }
  }
  return null;
}

function countElements(elements: BuilderElement[]): number {
  return elements.reduce((count, element) => count + 1 + (element.children ? countElements(element.children) : 0), 0);
}

function LayerTreeItem({ element, selectedId, onSelect, depth }: { element: BuilderElement; selectedId: string; onSelect: (id: string) => void; depth: number }) {
  return <div className="builder-layer-item-wrap">
    <button className={"builder-layer-item " + (selectedId === element.id ? "active" : "")} style={{ paddingLeft: 10 + depth * 14 }} onClick={() => onSelect(element.id)}>
      <span className="builder-layer-dot"></span>
      <span>{element.type.replace("-", " ")}</span>
      {element.children?.length ? <small>{element.children.length}</small> : null}
    </button>
    {element.children?.map((child) => <LayerTreeItem key={child.id} element={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1}/>)}
  </div>;
}

function defaultProps(type: string): Record<string, unknown> {
  const defaults: Record<string, Record<string, unknown>> = {
    section:{label:"SECTION",title:"Your section"},
    container:{label:"CONTAINER"},
    columns:{columns:3},
    spacer:{height:"48px"},
    text:{text:"Your text goes here."},
    heading:{text:"Your heading",level:"h2"},
    button:{label:"Get Started",url:"#",variant:"primary"},
    image:{src:"",alt:"Add an image",caption:""},
    icon:{symbol:"✦",label:"Icon"},
    link:{label:"Learn more",url:"#"},
    divider:{},
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
