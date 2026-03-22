import {
  LayoutDashboard,
  BarChart3,
  Leaf,
  Brain,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly iconBg: string;
  readonly iconColor: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, iconBg: "bg-sky-100", iconColor: "text-sky-600" },
  { label: "Impact", href: "/impact", icon: Leaf, iconBg: "bg-teal-100", iconColor: "text-teal-600" },
  { label: "Model", href: "/model", icon: Brain, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { label: "Settings", href: "/settings", icon: Settings, iconBg: "bg-gray-100", iconColor: "text-gray-600" },
] as const;
