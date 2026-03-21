"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreakdown } from "@/hooks/use-breakdown";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { formatNumber } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";
import type { WasteCategory } from "@/lib/types";

/** Short display names for the legend. */
const LEGEND_LABELS: Readonly<Record<WasteCategory, string>> = {
  paper_cardboard: "Paper",
  metal_glass: "Metal/Glass",
  plastic: "Plastic",
  trash: "Trash",
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
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full shrink-0"
        style={{ backgroundColor: entry.color }}
      />
      <span className="text-sm text-muted-foreground">
        {LEGEND_LABELS[entry.category]}
      </span>
      <span className="text-sm font-medium">{entry.percentage}%</span>
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
        <CardTitle>Waste Composition</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Donut chart with center text overlay */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData as ChartEntry[]}
                dataKey="count"
                nameKey="category"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                strokeWidth={0}
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
          {/* Center text overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatNumber(totalItems)}
              </div>
              <div className="text-xs text-muted-foreground">items</div>
            </div>
          </div>
        </div>

        {/* Legend below chart */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {chartData.map((entry) => (
            <LegendItem key={entry.category} entry={entry} />
          ))}
        </div>

        {/* View Full Analytics link */}
        <Link
          href="/analytics"
          className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          View Full Analytics
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
