"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { HeroIllustration } from "@/components/dashboard/hero-illustration";
import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { useMetrics } from "@/hooks/use-metrics";
import { HeroSkeleton } from "@/components/dashboard/hero-skeleton";
import { StaleDataWarning } from "@/components/dashboard/stale-data-warning";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";
import { Recycle, Leaf, Package, TreePine } from "lucide-react";

export function HeroImpactSection() {
  const { metrics, error, isLoading } = useMetrics();
  const [showEmptyState, setShowEmptyState] = useState(false);
  const lastSuccessRef = useRef(Date.now());

  useEffect(() => {
    if (metrics && !error) {
      lastSuccessRef.current = Date.now();
    }
  }, [metrics, error]);

  useEffect(() => {
    if (error && !metrics) {
      const timer = setTimeout(() => setShowEmptyState(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowEmptyState(false);
  }, [error, metrics]);

  if (isLoading) return <HeroSkeleton />;

  if (error && !metrics) {
    if (!showEmptyState) return <HeroSkeleton />;
    return (
      <section>
        <Card className="relative hero-gradient min-h-[200px] overflow-hidden rounded-[2.5rem] shadow-[0_8px_30px_-10px_rgba(81,167,159,0.3)] border-none">
          <BackendEmptyState />
        </Card>
      </section>
    );
  }

  const isStale = !!error && !!metrics;

  return (
    <section className="space-y-2">
      {isStale && <StaleDataWarning lastUpdatedMs={lastSuccessRef.current} />}

      {/* Hero banner */}
      <Card className="relative hero-gradient overflow-hidden rounded-[2.5rem] shadow-[0_8px_30px_-10px_rgba(81,167,159,0.3)] border-none">
        <HeroIllustration />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/30 via-black/15 to-transparent" />
        <div className="relative z-10 px-6 py-5 md:px-8 md:py-6">
          <h1 className="max-w-xl text-xl font-extrabold leading-tight md:text-2xl text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Great job! You&apos;ve diverted{" "}
            <span className="text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              <AnimatedNumber
                value={metrics?.waste_diverted_kg ?? 0}
                formatter={(n) => `${n.toFixed(1)} kg`}
              />
            </span>{" "}
            of waste today.
          </h1>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/25 backdrop-blur-md border border-white/30 px-4 py-1.5 text-xs font-bold text-white shadow-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
            <Leaf className="h-[18px] w-[18px] text-emerald-100" />
            <span>Equivalent to planting <strong>{Math.max(1, Math.round((metrics?.co2_saved_kg ?? 0) / 22))}</strong> trees</span>
          </div>
        </div>
      </Card>

    </section>
  );
}
