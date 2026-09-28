"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type WebsiteFilter = "all" | "published" | "drafts" | "archived";

type AppState = {
  sidebarOpen: boolean;
  sidebarPinned: boolean;
  websiteFilter: WebsiteFilter;
  lastVisitedWebsite: string | null;
  activeTool: string | null;
  setSidebarOpen: (open: boolean) => void;
  setSidebarPinned: (pinned: boolean) => void;
  setWebsiteFilter: (filter: WebsiteFilter) => void;
  setLastVisitedWebsite: (id: string | null) => void;
  setActiveTool: (tool: string | null) => void;
};

const STORAGE_KEY = "fellacoo-web:app-state";

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [websiteFilter, setWebsiteFilter] = useState<WebsiteFilter>("all");
  const [lastVisitedWebsite, setLastVisitedWebsite] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const state = JSON.parse(saved) as Partial<{
        sidebarPinned: boolean;
        websiteFilter: WebsiteFilter;
        lastVisitedWebsite: string | null;
        activeTool: string | null;
      }>;
      if (typeof state.sidebarPinned === "boolean") setSidebarPinned(state.sidebarPinned);
      if (state.websiteFilter) setWebsiteFilter(state.websiteFilter);
      if (state.lastVisitedWebsite !== undefined) setLastVisitedWebsite(state.lastVisitedWebsite);
      if (state.activeTool !== undefined) setActiveTool(state.activeTool);
    } catch {
      // Ignore corrupt local state and start clean.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sidebarPinned, websiteFilter, lastVisitedWebsite, activeTool })
      );
    } catch {
      // Storage may be unavailable in private browsing or restricted environments.
    }
  }, [sidebarPinned, websiteFilter, lastVisitedWebsite, activeTool]);

  const value = useMemo(
    () => ({
      sidebarOpen,
      sidebarPinned,
      websiteFilter,
      lastVisitedWebsite,
      activeTool,
      setSidebarOpen,
      setSidebarPinned,
      setWebsiteFilter,
      setLastVisitedWebsite,
      setActiveTool
    }),
    [sidebarOpen, sidebarPinned, websiteFilter, lastVisitedWebsite, activeTool]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used inside AppStateProvider");
  return context;
}
