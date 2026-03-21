"use client";

import useSWR from "swr";
import type { SortEvent } from "@/lib/types";

/**
 * Poll GET /events?limit=20 every 2s (inherited from SWRConfig).
 * Returns array of SortEvent matching backend EventResponse[].
 * (INTG-03, FEED-06)
 */
export function useEvents(limit: number = 20) {
  const { data, error, isLoading } = useSWR<readonly SortEvent[]>(
    `/events?limit=${limit}`
  );
  return { events: data, error, isLoading } as const;
}
