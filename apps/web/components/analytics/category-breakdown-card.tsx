"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreakdown } from "@/hooks/use-breakdown";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { formatNumber } from "@/lib/mock-data";
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

interface BarChartEntry {
  readonly name: string;
  readonly category: WasteCategory;
  readonly count: number;
  readonly percentage: number;
  readonly color: string;
}

/**
 * Create a custom bar label renderer bound to chartData.
 * Returns a Recharts-compatible label render function.
 */
function createBarLabelRenderer(chartData: readonly BarChartEntry[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function BarLabel(props: any) {
    const { x = 0, y = 0, width = 0, height = 0, value = 0, index = 0 } = props;
    const entry = chartData[index];
    const pct = entry?.percentage ?? 0;

    return (
      <text
        x={x + width + 8}
        y={y + height / 2}
        textAnchor="start"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
        fill="currentColor"
      >
        {formatNumber(value)} ({pct}%)
      </text>
    );
  };
}

export function CategoryBreakdownCard() {
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

  // Map API breakdown data to chart format
  const chartData: readonly BarChartEntry[] = (
    breakdown?.categories ?? []
  ).map((cat) => ({
    name: LEGEND_LABELS[cat.label as WasteCategory] ?? cat.label,
    category: cat.label as WasteCategory,
    count: cat.count,
    percentage: cat.percentage,
    color: getCategoryColor(cat.label),
  }));

  const totalItems = chartData.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Category Breakdown</CardTitle>
          <span className="text-sm text-muted-foreground">
            {formatNumber(totalItems)} total items
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div aria-label="Bar chart showing waste category distribution">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData as BarChartEntry[]}
              layout="vertical"
              margin={{ top: 0, right: 80, bottom: 0, left: 10 }}
            >
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 14 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <XAxis type="number" hide />
              <Tooltip
                formatter={(value, name) => [
                  String(value),
                  String(name),
                ]}
              />
              <Bar
                dataKey="count"
                barSize={24}
                radius={[0, 4, 4, 0]}
                label={createBarLabelRenderer(chartData)}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend row */}
        <div className="mt-4 flex flex-wrap gap-4">
          {chartData.map((entry) => (
            <div key={entry.category} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
