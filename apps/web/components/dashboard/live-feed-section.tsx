"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LatestItemCard } from "@/components/dashboard/latest-item-card";
import { RecentItemsList } from "@/components/dashboard/recent-items-list";
import { useEvents } from "@/hooks/use-events";
import { FeedSkeleton } from "@/components/dashboard/feed-skeleton";
import { StaleDataWarning } from "@/components/dashboard/stale-data-warning";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";
import { calculateTreesEquivalent } from "@/lib/categories";
import { DemoButton } from "@/components/dashboard/demo-button";
import { TreePine } from "lucide-react";

/**
 * Container component composing the full live feed section:
 * green status dot, "Live Feed" header, tree equivalence badge,
 * latest item card, and recent items list.
 *
 * Wired to useEvents hook polling GET /events?limit=20 every 2s.
 * Tree equivalence filters to today's events only (D-10 daily scoping).
 */
export function LiveFeedSection() {
  const { events: rawEvents, error, isLoading } = useEvents(20);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const lastSuccessRef = useRef(Date.now());
  const prevLatestIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (rawEvents && !error) {
      lastSuccessRef.current = Date.now();
    }
  }, [rawEvents, error]);

  useEffect(() => {
    if (error && !rawEvents) {
      const timer = setTimeout(() => setShowEmptyState(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowEmptyState(false);
  }, [error, rawEvents]);

  // Track previous latest event ID to detect new arrivals (D-04)
  const latestEventId = (rawEvents ?? [])[0]?.id ?? null;
  const isNewEvent = latestEventId != null && latestEventId !== prevLatestIdRef.current;

  useEffect(() => {
    prevLatestIdRef.current = latestEventId;
  }, [latestEventId]);

  if (isLoading) return <FeedSkeleton />;

  if (error && !rawEvents) {
    if (!showEmptyState) return <FeedSkeleton />;
    return (
      <section aria-labelledby="live-feed-title">
        <Card>
          <CardContent className="py-8">
            <BackendEmptyState />
          </CardContent>
        </Card>
      </section>
    );
  }

  const events = rawEvents ?? [];
  const isStale = !!error && !!rawEvents;

  const latestEvent = events[0] ?? null;
  const recentEvents = events.slice(1);

  // Filter to today's events before calculating tree equivalence (D-10)
  const todayEvents = events.filter(
    (e) => new Date(e.timestamp).toDateString() === new Date().toDateString()
  );
  const treesEquivalent = calculateTreesEquivalent(todayEvents);

  return (
    <section aria-labelledby="live-feed-title">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {/* Green status dot with pulse animation (FEED-05) */}
            <span className="relative flex h-2.5 w-2.5" aria-label="System active">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>

            <CardTitle id="live-feed-title" className="text-lg font-bold">
              Live Feed
            </CardTitle>

            {/* Tree equivalence badge (FEED-07, D-10, D-11, D-12) */}
            <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <TreePine className="h-4 w-4 text-[hsl(var(--eco-green))]" aria-hidden="true" />
              <span>
                Equivalent to planting{" "}
                <strong className="text-foreground">{treesEquivalent}</strong>{" "}
                trees
              </span>
            </span>

            {/* Demo button (D-01) */}
            <DemoButton />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isStale && <StaleDataWarning lastUpdatedMs={lastSuccessRef.current} />}

          {latestEvent ? (
            <LatestItemCard event={latestEvent} isNew={isNewEvent} />
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium">No Items Sorted Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Waiting for the first item to be sorted. The live feed will
                update automatically once sorting begins.
              </p>
            </div>
          )}

          {recentEvents.length > 0 && (
            <RecentItemsList events={recentEvents} />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
