"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerDemoEvent } from "@/lib/demo";

/**
 * Demo button that triggers a sort event via the backend.
 * After the event is created, revalidates all SWR caches
 * so the dashboard updates within 2 seconds.
 *
 * (D-01: demo events from dashboard UI)
 */
export function DemoButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  async function handleClick() {
    setIsLoading(true);
    try {
      await triggerDemoEvent();
      // Revalidate all SWR keys to refresh events, metrics, and breakdown
      await mutate(() => true);
    } catch (error) {
      console.error("Failed to trigger demo event:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="default"
      size="sm"
      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
      disabled={isLoading}
      onClick={handleClick}
    >
      <Zap className="h-4 w-4" />
      {isLoading ? "Sorting..." : "Sort Item"}
    </Button>
  );
}
