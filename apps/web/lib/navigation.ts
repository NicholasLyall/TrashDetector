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
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Impact", href: "/impact", icon: Leaf },
  { label: "Model", href: "/model", icon: Brain },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;
