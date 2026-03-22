"use client";

import { useEffect, useState } from "react";
import { useMetrics } from "@/hooks/use-metrics";
import { ImpactHero } from "@/components/impact/impact-hero";
import { EquivalentsGrid } from "@/components/impact/equivalents-grid";
import { DiversionStats } from "@/components/impact/diversion-stats";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";

/** Skeleton placeholder for the hero banner area. */
function HeroBannerSkeleton() {
  return (
    <Card className="hero-gradient min-h-[200px] overflow-hidden rounded-xl shadow-sm ring-1 ring-foreground/5">
      <div className="flex flex-col items-center p-6 pt-10 md:p-8 md:pt-12">
        <Skeleton className="h-8 w-72 rounded-md" />
        <Skeleton className="mt-2 h-4 w-48 rounded-md" />
        <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/** Skeleton placeholder for a grid of equivalents cards. */
function EquivalentsGridSkeleton({ count }: { readonly count: number }) {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-6 w-56 rounded-md" />
        <Skeleton className="mt-1 h-4 w-72 rounded-md" />
      </div>
      <div className={`grid grid-cols-1 gap-4 ${count === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="mt-4 h-10 w-24 rounded" />
            <Skeleton className="mt-1 h-4 w-40 rounded" />
            <Skeleton className="mt-0.5 h-3 w-52 rounded" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ImpactPage() {
  const { metrics, error, isLoading } = useMetrics();
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    if (error && !metrics) {
      const timer = setTimeout(() => setShowEmptyState(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowEmptyState(false);
  }, [error, metrics]);

  // Loading state: skeleton placeholders
  if (isLoading) {
    return (
      <div className="space-y-8">
        <HeroBannerSkeleton />
        <EquivalentsGridSkeleton count={4} />
        <EquivalentsGridSkeleton count={3} />
      </div>
    );
  }

  // Error state with no data: show empty state after delay
  if (error && !metrics) {
    if (!showEmptyState) {
      return (
        <div className="space-y-8">
          <HeroBannerSkeleton />
          <EquivalentsGridSkeleton count={4} />
          <EquivalentsGridSkeleton count={3} />
        </div>
      );
    }

    return (
      <Card className="min-h-[200px] rounded-xl shadow-sm ring-1 ring-foreground/5">
        <BackendEmptyState />
      </Card>
    );
  }

  // Data available: render full impact page
  return (
    <div className="space-y-8">
      <ImpactHero
        co2SavedKg={metrics?.co2_saved_kg ?? 0}
        wasteDivertedKg={metrics?.waste_diverted_kg ?? 0}
        totalItems={metrics?.total_items ?? 0}
        recyclingRate={metrics?.recycling_rate ?? 0}
      />
      <EquivalentsGrid co2SavedKg={metrics?.co2_saved_kg ?? 0} />
      <DiversionStats wasteDivertedKg={metrics?.waste_diverted_kg ?? 0} />
    </div>
  );
}
