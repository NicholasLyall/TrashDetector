"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain } from "lucide-react";
import { useMetrics } from "@/hooks/use-metrics";
import { useEvents } from "@/hooks/use-events";
import { ConfidenceGauge } from "@/components/model/confidence-gauge";
import { ConfidenceDistributionChart } from "@/components/model/confidence-distribution-chart";
import { ModelMetricsCards } from "@/components/model/model-metrics-cards";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";

/** Skeleton placeholder matching the model page layout. */
function ModelPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-7 w-48 rounded" />
        <Skeleton className="mt-2 h-4 w-72 rounded" />
      </div>

      {/* 3 metric card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-7 w-16 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Two-column skeleton for gauge + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <Skeleton className="h-5 w-40 rounded mb-4" />
            <Skeleton className="h-[180px] w-full rounded-lg" />
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <Skeleton className="h-5 w-48 rounded mb-4" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ModelPage() {
  const { metrics, error: metricsError, isLoading: metricsLoading } = useMetrics();
  const { events, error: eventsError, isLoading: eventsLoading } = useEvents(100);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const isLoading = metricsLoading || eventsLoading;
  const hasError = !!(metricsError || eventsError);
  const hasData = !!(metrics || events);

  // Delayed empty state: show skeleton for 5s before BackendEmptyState (D-04 pattern)
  useEffect(() => {
    if (hasError && !hasData) {
      const timer = setTimeout(() => setShowEmptyState(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowEmptyState(false);
  }, [hasError, hasData]);

  if (isLoading) {
    return <ModelPageSkeleton />;
  }

  if (hasError && !hasData) {
    if (!showEmptyState) {
      return <ModelPageSkeleton />;
    }
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Model Performance
            </h1>
          </div>
          <p className="mt-1 text-gray-500">
            YOLO perception model confidence analysis and performance metrics
          </p>
        </div>
        <Card>
          <CardContent className="py-8">
            <BackendEmptyState />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Model Performance
          </h1>
        </div>
        <p className="mt-1 text-gray-500">
          YOLO perception model confidence analysis and performance metrics
        </p>
      </div>

      {/* 3-column metric cards row */}
      <ModelMetricsCards
        avgConfidence={metrics?.avg_confidence ?? 0}
        uncertainRate={metrics?.uncertain_rate ?? 0}
        fallbackRate={metrics?.fallback_rate ?? 0}
      />

      {/* Two-column row: gauge + distribution chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfidenceGauge avgConfidence={metrics?.avg_confidence ?? 0} />
        <ConfidenceDistributionChart events={events ?? []} />
      </div>
    </div>
  );
}
