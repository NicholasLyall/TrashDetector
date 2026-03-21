"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { computeCategoryBreakdown } from "@/lib/compute-metrics";
import type { CategoryBreakdownEntry } from "@/lib/compute-metrics";
import { sortEventsMockData, formatNumber } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";
import type { WasteCategory } from "@/lib/types";

/** Short display names for the legend. */
const LEGEND_LABELS: Readonly<Record<WasteCategory, string>> = {
  paper_cardboard: "Paper",
  metal_glass: "Metal/Glass",
  plastic: "Plastic",
  trash: "Trash",
};

function LegendItem({
  entry,
}: {
  readonly entry: CategoryBreakdownEntry;
}) {
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
  const breakdown = computeCategoryBreakdown(sortEventsMockData);
  const totalItems = sortEventsMockData.length;

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
                data={breakdown}
                dataKey="count"
                nameKey="category"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                strokeWidth={0}
              >
                {breakdown.map((entry) => (
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
          {/* Center text overlay (per D-02) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatNumber(totalItems)}
              </div>
              <div className="text-xs text-muted-foreground">items</div>
            </div>
          </div>
        </div>

        {/* Legend below chart (per D-03) */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {breakdown.map((entry) => (
            <LegendItem key={entry.category} entry={entry} />
          ))}
        </div>

        {/* View Full Analytics link (per D-05) */}
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
