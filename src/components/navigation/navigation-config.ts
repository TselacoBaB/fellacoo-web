import {
  Activity,
  BarChart3,
  BellRing,
  BookOpen,
  Box,
  BriefcaseBusiness,
  Calculator,
  CalendarDays,
  CreditCard,
  FileImage,
  FileText,
  Globe2,
  Home,
  LayoutTemplate,
  Megaphone,
  MessageCircle,
  Package,
  Palette,
  PanelTop,
  Receipt,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  Target,
  Users,
  Workflow,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  description?: string;
  badge?: string;
};

export type NavigationGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    id: "websites",
    label: "Websites",
    icon: LayoutTemplate,
    items: [
      { label: "My Websites", icon: LayoutTemplate, href: "/dashboard" },
      { label: "Templates", icon: Box, href: "#design-tools" },
      { label: "Domains", icon: Globe2, href: "#business-tools" }
    ]
  },
  {
    id: "design",
    label: "Design",
    icon: Palette,
    items: [
      { label: "Components", icon: PanelTop, href: "#design-tools" },
      { label: "Brand Kit", icon: BookOpen, href: "#design-tools" },
      { label: "Media Library", icon: FileImage, href: "#design-tools" }
    ]
  },
  {
    id: "business",
    label: "Business",
    icon: BriefcaseBusiness,
    items: [
      { label: "Store", icon: Store, href: "#business-tools" },
      { label: "Shopping Cart", icon: ShoppingCart, href: "#business-tools" },
      { label: "CRM", icon: BriefcaseBusiness, href: "#business-tools" },
      { label: "Bookings", icon: CalendarDays, href: "#business-tools" },
      { label: "Leads", icon: Users, href: "#business-tools" },
      { label: "Operations", icon: Workflow, href: "#business-tools" }
    ]
  },
  {
    id: "sales",
    label: "Sales & Finance",
    icon: CreditCard,
    items: [
      { label: "Quotes", icon: FileText, href: "#business-tools" },
      { label: "Invoices", icon: Receipt, href: "#business-tools" },
      { label: "Payments", icon: CreditCard, href: "#business-tools" },
      { label: "Accounting", icon: Calculator, href: "#business-tools" },
      { label: "Orders", icon: Package, href: "#business-tools" }
    ]
  },
  {
    id: "growth",
    label: "Growth",
    icon: Sparkles,
    items: [
      { label: "Analytics", icon: BarChart3, href: "#business-tools" },
      { label: "Conversion", icon: Target, href: "#business-tools" },
      { label: "Campaigns", icon: Megaphone, href: "#business-tools" },
      { label: "Automations", icon: Workflow, href: "#business-tools" }
    ]
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageCircle,
    items: [
      { label: "WhatsApp", icon: MessageCircle, href: "#business-tools" },
      { label: "Conversations", icon: BellRing, href: "#business-tools" },
      { label: "Email", icon: BellRing, href: "#business-tools" },
      { label: "Notifications", icon: BellRing, href: "#business-tools" }
    ]
  },
  {
    id: "ai",
    label: "AI",
    icon: Sparkles,
    items: [
      { label: "AI Builder", icon: Sparkles, href: "/builder/new/site" },
      { label: "AI Assistant", icon: Zap, href: "#business-tools" },
      { label: "AI Content", icon: FileText, href: "#business-tools" },
      { label: "AI Automations", icon: Workflow, href: "#business-tools" }
    ]
  }
];

export const primaryNavigation = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Create Website", icon: Sparkles, href: "/builder/new/site" }
] satisfies NavigationItem[];

export const navigationSearchItems = [
  ...primaryNavigation,
  ...navigationGroups.flatMap((group) => group.items)
];
