"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LatestItemCard } from "@/components/dashboard/latest-item-card";
import { RecentItemsList } from "@/components/dashboard/recent-items-list";
import { sortEventsMockData } from "@/lib/mock-data";
import { calculateTreesEquivalent } from "@/lib/categories";
import { TreePine } from "lucide-react";

/**
 * Container component composing the full live feed section:
 * green status dot, "Live Feed" header, tree equivalence badge,
 * latest item card, and recent items list.
 *
 * NOTE: With mock data, all events are passed to calculateTreesEquivalent.
 * When Phase 6 wires real data, this must filter to today's events only
 * before calling calculateTreesEquivalent (per D-10 daily scoping contract).
 */
export function LiveFeedSection() {
  const events = sortEventsMockData;
  const latestEvent = events[0] ?? null;
  const recentEvents = events.slice(1);
  const treesEquivalent = calculateTreesEquivalent(events);

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
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {latestEvent ? (
            <LatestItemCard event={latestEvent} />
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
