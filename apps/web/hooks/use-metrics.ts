"use client";

import useSWR from "swr";
import type { MetricsData } from "@/lib/types";

/**
 * Poll GET /metrics every 2s (inherited from SWRConfig).
 * Returns typed MetricsData matching backend MetricsResponse.
 * (INTG-02, HERO-05)
 */
export function useMetrics() {
  const { data, error, isLoading } = useSWR<MetricsData>("/metrics");
  return { metrics: data, error, isLoading } as const;
}
