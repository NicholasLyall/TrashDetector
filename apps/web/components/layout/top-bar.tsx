"use client";

import { Menu, ChevronDown, Hash, Percent, Target, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMetrics } from "@/hooks/use-metrics";
import { AnimatedNumber } from "@/components/dashboard/animated-number";

function KpiChip({
  icon: Icon,
  label,
  value,
}: {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-sm">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function TopBar({
  onMobileMenuOpen,
}: {
  onMobileMenuOpen: () => void;
}) {
  const { metrics } = useMetrics();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMobileMenuOpen}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation menu</span>
      </Button>

      {/* Title section */}
      <div className="flex items-center gap-1">
        <h1 className="text-base font-semibold text-gray-800">
          Smart Dashboard
        </h1>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>

      {/* KPI chip strip */}
      <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
        <KpiChip
          icon={Hash}
          label="Total Items"
          value={<AnimatedNumber value={metrics?.total_items ?? 0} />}
        />
        <KpiChip
          icon={Percent}
          label="Recycling Rate"
          value={
            <AnimatedNumber
              value={Math.round((metrics?.recycling_rate ?? 0) * 100)}
              formatter={(n) => `${Math.round(n)}%`}
            />
          }
        />
        <KpiChip
          icon={Target}
          label="Avg Confidence"
          value={
            <AnimatedNumber
              value={Math.round((metrics?.avg_confidence ?? 0) * 100)}
              formatter={(n) => `${Math.round(n)}%`}
            />
          }
        />
        <KpiChip
          icon={AlertTriangle}
          label="Fallback Rate"
          value={
            <AnimatedNumber
              value={Math.round((metrics?.fallback_rate ?? 0) * 100)}
              formatter={(n) => `${Math.round(n)}%`}
            />
          }
        />
      </div>

      {/* User avatar */}
      <Avatar size="sm">
        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
          AD
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
