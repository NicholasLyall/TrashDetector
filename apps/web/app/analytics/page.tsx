"use client";

import { CategoryBreakdownCard } from "@/components/analytics/category-breakdown-card";
import { SortingTrendCard } from "@/components/analytics/sorting-trend-card";
import { EventHistoryCard } from "@/components/analytics/event-history-card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
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
