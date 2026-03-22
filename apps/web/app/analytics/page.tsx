"use client";

import { BarChart3 } from "lucide-react";
import { CategoryBreakdownCard } from "@/components/analytics/category-breakdown-card";
import { SortingTrendCard } from "@/components/analytics/sorting-trend-card";
import { EventHistoryCard } from "@/components/analytics/event-history-card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Detailed sorting trends and category breakdowns
        </p>
      </div>

      {/* Chart cards - 2 column on lg, stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdownCard />
        <SortingTrendCard />
      </div>

      {/* Event history - full width */}
      <EventHistoryCard />
    </div>
  );
}
