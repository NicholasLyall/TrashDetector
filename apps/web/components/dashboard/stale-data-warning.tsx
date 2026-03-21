"use client";

import { useEffect, useState } from "react";

interface StaleDataWarningProps {
  /** Timestamp (ms) of the last successful data fetch */
  readonly lastUpdatedMs: number;
}

/**
 * Subtle amber warning banner shown when the backend becomes unreachable
 * but stale data is still being displayed (D-03).
 * Re-renders every second to update the "Xs ago" counter.
 */
export function StaleDataWarning({ lastUpdatedMs }: StaleDataWarningProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const secondsAgo = Math.round((now - lastUpdatedMs) / 1000);

  return (
    <div
      role="status"
      className="rounded-md bg-amber-50 dark:bg-amber-950/20 px-4 py-2 text-sm text-amber-800 dark:text-amber-200"
    >
      Last updated {secondsAgo}s ago — connection lost
    </div>
  );
}
