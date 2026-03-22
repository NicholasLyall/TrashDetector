"use client";

import useSWR from "swr";
import type { DeviceData } from "@/lib/types";

/**
 * Poll GET /devices every 2s (inherited from SWRConfig).
 * Returns typed DeviceData[] matching backend DeviceResponse[].
 * (STNG-01)
 */
export function useDevices() {
  const { data, error, isLoading } = useSWR<readonly DeviceData[]>("/devices");
  return { devices: data, error, isLoading } as const;
}
