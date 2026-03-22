"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label as RechartsLabel } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreakdown } from "@/hooks/use-breakdown";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { formatNumber } from "@/lib/mock-data";
import { ArrowRight, PieChart as PieChartIcon } from "lucide-react";
import type { WasteCategory } from "@/lib/types";

/** Short display names for the legend. */
const LEGEND_LABELS: Readonly<Record<WasteCategory, string>> = {
  paper_cardboard: "Paper",
  metal_glass: "Metal/Glass",
  plastic: "Plastic",
  trash: "Misc",
};

/** Category emoji-style labels for legend icons */
const LEGEND_ICONS: Readonly<Record<WasteCategory, string>> = {
  paper_cardboard: "\uD83D\uDCC4",
  metal_glass: "\uD83C\uDF79",
  plastic: "\uD83E\uDDF4",
  trash: "\uD83D\uDDD1\uFE0F",
};

/** Map API label string to a chart color via CATEGORY_CONFIG. */
function getCategoryColor(label: string): string {
  const config = CATEGORY_CONFIG[label as WasteCategory];
  return config?.badgeColor ?? "hsl(0 0% 60%)";
}

interface ChartEntry {
  readonly category: WasteCategory;
  readonly count: number;
  readonly percentage: number;
  readonly color: string;
}

function LegendItem({ entry }: { readonly entry: ChartEntry }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm text-muted-foreground">
          {LEGEND_LABELS[entry.category]}
        </span>
      </div>
      <span className="text-sm font-semibold">{entry.percentage}%</span>
    </div>
  );
}

export function WasteCompositionCard() {
  const { breakdown, error, isLoading } = useBreakdown();
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    if (error && !breakdown) {
      const timer = setTimeout(() => setShowEmptyState(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowEmptyState(false);
  }, [error, breakdown]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error && !breakdown) {
    if (!showEmptyState) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </CardContent>
        </Card>
      );
    }
    return (
      <Card>
        <CardContent className="py-8">
          <BackendEmptyState />
        </CardContent>
      </Card>
    );
  }

  // Map API breakdown data to chart entries with colors
  const chartData: readonly ChartEntry[] = (breakdown?.categories ?? []).map(
    (cat) => ({
      category: cat.label as WasteCategory,
      count: cat.count,
      percentage: cat.percentage,
      color: getCategoryColor(cat.label),
    })
  );

  const totalItems = chartData.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
            <PieChartIcon className="h-5 w-5" />
          </div>
          <CardTitle>Waste Composition</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Centered donut chart */}
        <div className="flex flex-col items-center gap-6">
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData as ChartEntry[]}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  strokeWidth={0}
                  cornerRadius={8}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    String(value),
                    LEGEND_LABELS[name as WasteCategory] ?? String(name),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text for donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-800">{totalItems}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>

          {/* Legend grid */}
          <div className="w-full grid grid-cols-2 gap-y-4 gap-x-2">
            {chartData.map((entry) => (
              <LegendItem key={entry.category} entry={entry} />
            ))}
          </div>

          {/* View Full Analytics link */}
          <Link
            href="/analytics"
            className="text-sm font-bold text-teal-600 hover:text-teal-700 w-full text-center hover:bg-teal-50 py-2 rounded-xl transition-colors"
          >
            View Full Analytics &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
