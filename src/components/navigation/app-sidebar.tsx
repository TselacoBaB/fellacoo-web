"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, Menu, Plus, Settings as NavigationSettingsIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppState } from "@/lib/state/app-store";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  navigationGroups,
  primaryNavigation,
  type NavigationGroup,
  type NavigationItem
} from "@/components/navigation/navigation-config";

const DEFAULT_OPEN_GROUPS: Record<string, boolean> = {
  websites: true,
  design: true,
  business: false,
  sales: false,
  growth: false,
  communication: false,
  ai: false
};

export function AppSidebar() {
  const pathname = usePathname();
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarPinned,
    setSidebarPinned
  } = useAppState();

  const [hovered, setHovered] = useState(false);
  const [openGroups, setOpenGroups] = useState(DEFAULT_OPEN_GROUPS);

  const expanded = sidebarPinned || hovered || sidebarOpen;

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  const toggleGroup = (id: string) => {
    setOpenGroups((current) => ({ ...current, [id]: !current[id] }));
  };

  const closeMobile = () => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      setSidebarOpen(false);
    }
  };

  const isActive = (item: NavigationItem) => {
    if (!item.href || item.href.startsWith("#")) return false;
    if (item.href === "/dashboard") return pathname === "/dashboard";
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <>
      <aside
        className={[
          "app-sidebar",
          expanded ? "is-expanded" : "is-collapsed",
          sidebarPinned ? "is-pinned" : "is-hover-only",
          sidebarOpen ? "is-mobile-open" : ""
        ].filter(Boolean).join(" ")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Main navigation"
      >
        <div className="app-sidebar-header">
          <Link href="/dashboard" className="app-sidebar-brand" onClick={closeMobile}>
            <span className="app-brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span className="app-brand-word">FELLACOO</span>
          </Link>

          <button
            type="button"
            className="app-sidebar-toggle"
            onClick={() => {
              if (sidebarPinned) {
                setSidebarPinned(false);
                setSidebarOpen(false);
              } else {
                setSidebarPinned(true);
                setSidebarOpen(true);
              }
            }}
            aria-label={sidebarPinned ? "Collapse navigation" : "Pin navigation open"}
            title={sidebarPinned ? "Collapse navigation" : "Pin navigation open"}
          >
            {sidebarPinned ? <ChevronLeft size={17} /> : <Menu size={17} />}
          </button>

          <button
            type="button"
            className="app-sidebar-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="app-sidebar-scroll">
          <nav className="app-sidebar-nav">
            <div className="app-sidebar-primary">
              {primaryNavigation.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  active={isActive(item)}
                  expanded={expanded}
                  onClick={closeMobile}
                />
              ))}
            </div>

            <div className="app-sidebar-divider" />

            <div className="app-sidebar-groups">
              {navigationGroups.map((group) => (
                <SidebarGroup
                  key={group.id}
                  group={group}
                  expanded={expanded}
                  open={Boolean(openGroups[group.id])}
                  activePath={pathname}
                  onToggle={() => toggleGroup(group.id)}
                  onNavigate={closeMobile}
                />
              ))}
            </div>

            <div className="app-sidebar-divider" />

            <SidebarLink
              item={{ label: "Settings", icon: NavigationSettingsIcon, href: "/settings" }}
              active={pathname === "/settings"}
              expanded={expanded}
              onClick={closeMobile}
            />
          </nav>
        </div>

        <div className="app-sidebar-logout"><LogoutButton compact={!expanded} /></div>

        <div className="app-sidebar-plan">
          <div className="app-plan-icon"><Plus size={15} /></div>
          {expanded && (
            <div className="app-plan-copy">
              <strong>Pro Plan</strong>
              <small>2 / 10 websites</small>
              <span className="app-plan-progress"><i /></span>
            </div>
          )}
          {expanded && <ChevronDown size={15} className="app-plan-chevron" />}
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="app-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
    </>
  );
}

function SidebarGroup({
  group,
  expanded,
  open,
  activePath,
  onToggle,
  onNavigate
}: {
  group: NavigationGroup;
  expanded: boolean;
  open: boolean;
  activePath: string;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const GroupIcon = group.icon;
  const hasActiveChild = group.items.some((item) => {
    if (!item.href || item.href.startsWith("#")) return false;
    return activePath === item.href || activePath.startsWith(item.href + "/");
  });

  return (
    <div className={["app-nav-group", open && expanded ? "is-open" : "", hasActiveChild ? "has-active" : ""].filter(Boolean).join(" ")}>
      <button
        type="button"
        className="app-nav-group-trigger"
        onClick={onToggle}
        title={expanded ? undefined : group.label}
        aria-expanded={expanded ? open : false}
      >
        <span className="app-nav-group-icon"><GroupIcon size={16} /></span>
        {expanded && <span className="app-nav-group-label">{group.label}</span>}
        {expanded && <ChevronDown size={13} className="app-nav-group-chevron" />}
      </button>

      {expanded && open && (
        <div className="app-nav-group-items">
          {group.items.map((item) => (
            <SidebarLink
              key={item.label}
              item={item}
              active={Boolean(item.href && !item.href.startsWith("#") && (activePath === item.href || activePath.startsWith(item.href + "/")))}
              expanded
              nested
              onClick={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarLink({
  item,
  active,
  expanded,
  nested = false,
  onClick
}: {
  item: NavigationItem;
  active: boolean;
  expanded: boolean;
  nested?: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href ?? "#"}
      onClick={onClick}
      className={[
        "app-sidebar-link",
        active ? "is-active" : "",
        nested ? "is-nested" : "",
        expanded ? "is-expanded" : "is-collapsed"
      ].filter(Boolean).join(" ")}
      title={expanded ? undefined : item.label}
    >
      <span className="app-sidebar-link-icon"><Icon size={nested ? 15 : 17} /></span>
      {expanded && <span className="app-sidebar-link-label">{item.label}</span>}
      {expanded && item.badge && <span className="app-sidebar-badge">{item.badge}</span>}
      {expanded && item.label === "Create Website" && <span className="app-sidebar-create"><Plus size={11} /></span>}
    </Link>
  );
}

