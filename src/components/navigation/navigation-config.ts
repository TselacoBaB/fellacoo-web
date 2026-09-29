import {
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
      { label: "Templates", icon: Box, href: "/design/templates" },
      { label: "Domains", icon: Globe2, href: "/websites/domains" }
    ]
  },
  {
    id: "design",
    label: "Design",
    icon: Palette,
    items: [
      { label: "Components", icon: PanelTop, href: "/design/components" },
      { label: "Brand Kit", icon: BookOpen, href: "/design/brand-kit" },
      { label: "Media Library", icon: FileImage, href: "/design/media-library" }
    ]
  },
  {
    id: "business",
    label: "Business",
    icon: BriefcaseBusiness,
    items: [
      { label: "Store", icon: Store, href: "/business/store" },
      { label: "Shopping Cart", icon: ShoppingCart, href: "/business/shopping-cart" },
      { label: "CRM", icon: BriefcaseBusiness, href: "/business/crm" },
      { label: "Bookings", icon: CalendarDays, href: "/business/bookings" },
      { label: "Leads", icon: Users, href: "/business/leads" },
      { label: "Operations", icon: Workflow, href: "/business/operations" }
    ]
  },
  {
    id: "sales",
    label: "Sales & Finance",
    icon: CreditCard,
    items: [
      { label: "Quotes", icon: FileText, href: "/sales/quotes" },
      { label: "Invoices", icon: Receipt, href: "/sales/invoices" },
      { label: "Payments", icon: CreditCard, href: "/sales/payments" },
      { label: "Accounting", icon: Calculator, href: "/sales/accounting" },
      { label: "Orders", icon: Package, href: "/sales/orders" }
    ]
  },
  {
    id: "growth",
    label: "Growth",
    icon: Sparkles,
    items: [
      { label: "Analytics", icon: BarChart3, href: "/growth/analytics" },
      { label: "Conversion", icon: Target, href: "/growth/conversion" },
      { label: "Campaigns", icon: Megaphone, href: "/growth/campaigns" },
      { label: "Automations", icon: Workflow, href: "/growth/automations" }
    ]
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageCircle,
    items: [
      { label: "WhatsApp", icon: MessageCircle, href: "/communication/whatsapp" },
      { label: "Conversations", icon: BellRing, href: "/communication/conversations" },
      { label: "Email", icon: BellRing, href: "/communication/email" },
      { label: "Notifications", icon: BellRing, href: "/communication/notifications" }
    ]
  },
  {
    id: "ai",
    label: "AI",
    icon: Sparkles,
    items: [
      { label: "AI Builder", icon: Sparkles, href: "/builder/new/site" },
      { label: "AI Assistant", icon: Zap, href: "/ai/assistant" },
      { label: "AI Content", icon: FileText, href: "/ai/content" },
      { label: "AI Automations", icon: Workflow, href: "/ai/automations" }
    ]
  }
];

export const primaryNavigation = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Create Website", icon: Sparkles, href: "/design/templates" }
] satisfies NavigationItem[];

export const navigationSearchItems = [
  ...primaryNavigation,
  ...navigationGroups.flatMap((group) => group.items)
];
