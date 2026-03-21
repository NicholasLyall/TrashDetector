"use client";

import { SWRConfig } from "swr";
import { fetcher } from "@/lib/api";

/**
 * Global SWR configuration provider.
 *
 * - refreshInterval: 2000ms for 1-2s polling (INTG-01)
 * - revalidateOnFocus: true to refresh when user returns to tab
 * - shouldRetryOnError: true for auto-reconnection (D-05)
 * - errorRetryCount: 3 with exponential backoff
 */
export function SWRProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 2000,
        revalidateOnFocus: true,
        shouldRetryOnError: true,
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  );
}
