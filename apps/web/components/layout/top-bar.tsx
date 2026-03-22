"use client";

import { Menu, Package, Recycle, BarChart3, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMetrics } from "@/hooks/use-metrics";
import { AnimatedNumber } from "@/components/dashboard/animated-number";

function KpiChip({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  readonly icon: React.ElementType;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly label: string;
  readonly value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-white to-emerald-50/50 px-5 py-2 shadow-sm border border-emerald-100/40 min-w-[10rem]">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg} ${iconColor} shrink-0`}>
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-sm font-bold leading-none text-slate-700">{value}</span>
        <span className="text-[9px] text-slate-400 font-bold uppercase leading-tight mt-0.5">{label}</span>
      </div>
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
    <header className="relative flex h-16 items-center justify-between px-4 md:px-8 shrink-0 z-10" style={{ background: "linear-gradient(to right, #d2ede5, #c8e8de, #d0e8e8, #cde4ec)" }}>
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

      {/* KPI chip strip */}
      <div className="hidden flex-1 items-center justify-center gap-4 md:flex">
        <KpiChip
          icon={Package}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
          label="Total Items"
          value={<AnimatedNumber value={metrics?.total_items ?? 0} />}
        />
        <KpiChip
          icon={Recycle}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          label="Recycling Rate"
          value={
            <AnimatedNumber
              value={Math.round((metrics?.recycling_rate ?? 0) * 100)}
              formatter={(n) => `${Math.round(n)}%`}
            />
          }
        />
        <KpiChip
          icon={BarChart3}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          label="Avg Confidence"
          value={
            <AnimatedNumber
              value={Math.round((metrics?.avg_confidence ?? 0) * 100)}
              formatter={(n) => `${Math.round(n)}%`}
            />
          }
        />
        <KpiChip
          icon={RotateCcw}
          iconBg="bg-rose-50"
          iconColor="text-rose-500"
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
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
          AD
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
