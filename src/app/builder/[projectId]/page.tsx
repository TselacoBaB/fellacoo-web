"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Eye, Menu, Monitor, MousePointer2, PanelRight, Redo2, RotateCcw, Smartphone, Tablet, WandSparkles } from "lucide-react";

const tools = ["Elements", "Sections", "Text", "Images", "Forms", "Buttons", "AI"];

export default function BuilderPage() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#eef1f4]">
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setMenuOpen((value) => !value)} className="rounded-lg p-2 hover:bg-gray-100" aria-label="Toggle builder menu">
            <Menu size={20} />
          </button>
          <div className="hidden items-center gap-2 md:flex">
            <span className="font-semibold">Fellacoo</span><ChevronRight size={14} className="text-gray-400" />
            <span className="text-sm text-gray-500">Untitled website</span>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
          <ViewportButton active={viewport === "desktop"} onClick={() => setViewport("desktop")} icon={<Monitor size={16} />} />
          <ViewportButton active={viewport === "tablet"} onClick={() => setViewport("tablet")} icon={<Tablet size={16} />} />
          <ViewportButton active={viewport === "mobile"} onClick={() => setViewport("mobile")} icon={<Smartphone size={16} />} />
        </div>

        <div className="flex items-center gap-1">
          <IconButton icon={<RotateCcw size={17} />} label="Undo" />
          <IconButton icon={<Redo2 size={17} />} label="Redo" />
          <button className="ml-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">Publish</button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {menuOpen && (
          <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white lg:block">
            <div className="border-b border-gray-200 p-3"><div className="rounded-xl bg-gray-100 p-2 text-sm font-medium">Builder</div></div>
            <nav className="p-2">
              {tools.map((item) => (
                <button key={item} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-gray-100">
                  {item}{item === "AI" && <WandSparkles size={15} />}
                </button>
              ))}
            </nav>
          </aside>
        )}

        <section className="min-w-0 flex-1 p-3 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500"><MousePointer2 size={15} /><span>Live design canvas</span></div>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"><Eye size={15} />Preview</button>
          </div>

          <div className="flex h-[calc(100vh-8.5rem)] items-start justify-center overflow-auto rounded-2xl border border-gray-200 bg-[#dfe3e8] p-4 md:p-8">
            <div className={[
              "min-h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl transition-[width]",
              viewport === "desktop" ? "w-full max-w-[1180px]" : viewport === "tablet" ? "w-[768px] max-w-full" : "w-[390px] max-w-full"
            ].join(" ")}>
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="font-semibold">Your business</div>
                <div className="text-sm text-gray-500">Home · Services · Contact</div>
              </div>

              <div className="grid min-h-[680px] place-items-center px-8 py-24">
                <div className="max-w-2xl text-center">
                  <p className="text-sm font-medium text-gray-500">AI-generated website canvas</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Turn visitors into customers.</h2>
                  <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-600">
                    This becomes the actual visual editor: select, drag, edit, resize and ask Fellacoo AI to change the page.
                  </p>
                  <div className="mt-7 flex justify-center gap-3">
                    <button className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white">Primary CTA</button>
                    <button className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium">Secondary action</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden w-72 shrink-0 border-l border-gray-200 bg-white xl:block">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium"><PanelRight size={17} />Properties</div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
          <div className="space-y-4 p-4 text-sm">
            <div><label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">Selected</label><div className="rounded-lg border border-gray-200 p-3">Hero section</div></div>
            <div><label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">Layout</label><div className="grid grid-cols-2 gap-2"><div className="rounded-lg border border-gray-200 p-3">Width</div><div className="rounded-lg border border-gray-200 p-3">Spacing</div></div></div>
          </div>
        </aside>
      </div>

      <div className="border-t border-gray-200 bg-white px-3 py-3 md:px-5">
        <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
          <WandSparkles size={18} />
          <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder='Ask Fellacoo: "Make this page convert more visitors"' />
          <button className="rounded-lg bg-black px-3 py-2 text-xs font-medium text-white">Ask AI</button>
        </div>
      </div>
    </main>
  );
}

function ViewportButton({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return <button onClick={onClick} className={["rounded-lg p-2", active ? "bg-white shadow-sm" : "text-gray-500"].join(" ")}>{icon}</button>;
}

function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <button title={label} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">{icon}</button>;
}