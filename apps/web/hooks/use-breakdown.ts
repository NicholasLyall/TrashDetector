"use client";

import useSWR from "swr";
import type { BreakdownData } from "@/lib/types";

/**
 * Poll GET /metrics/breakdown every 2s (inherited from SWRConfig).
 * Returns BreakdownData with categories array.
 * (INTG-04, WSTE-03)
 */
export function useBreakdown() {
  const { data, error, isLoading } = useSWR<BreakdownData>(
    "/metrics/breakdown"
  );
  return { breakdown: data, error, isLoading } as const;
}
