"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BackendEmptyState } from "@/components/dashboard/backend-empty-state";
import { CategoryFilter } from "./category-filter";
import { CategoryBadge } from "@/lib/categories";
import { getConfidenceColor } from "@/lib/compute-analytics";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { ITEM_NAMES } from "@/lib/mock-data";
import { useEvents } from "@/hooks/use-events";
import type { WasteCategory, SortEvent } from "@/lib/types";

/**
 * Derive a stable display name from the event's category and id.
 * Uses the last character code of the event id to index into ITEM_NAMES
 * for a deterministic but varied name.
 */
function getDisplayName(event: SortEvent): string {
  const names = ITEM_NAMES[event.label];
  if (!names || names.length === 0) return event.label;
  const index = event.id.charCodeAt(event.id.length - 1) % names.length;
  return names[index];
}

export function EventHistoryCard() {
  const [activeFilter, setActiveFilter] = useState<WasteCategory | "all">(
    "all"
  );
  const [showEmptyState, setShowEmptyState] = useState(false);
  const { events, error, isLoading } = useEvents(50);

  useEffect(() => {
    if (error && !events) {
      const timer = setTimeout(() => setShowEmptyState(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowEmptyState(false);
  }, [error, events]);

  const filteredEvents =
    activeFilter === "all"
      ? (events ?? [])
      : (events ?? []).filter((e) => e.label === activeFilter);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state with 5s delay before showing BackendEmptyState
  if (error && !events) {
    if (!showEmptyState) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40 rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card>
        <CardContent className="py-8">
          <BackendEmptyState />
        </CardContent>
      </Card>
    );
  }

  // Data state
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Event History</CardTitle>
          <span className="text-xs text-muted-foreground">
            Showing {filteredEvents.length} events
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CategoryFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="overflow-x-auto">
          <div className="max-h-[480px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 bg-card z-10">
                  <TableHead scope="col" className="min-w-[80px]">
                    Time
                  </TableHead>
                  <TableHead scope="col" className="min-w-[120px]">
                    Item
                  </TableHead>
                  <TableHead scope="col" className="min-w-[140px]">
                    Category
                  </TableHead>
                  <TableHead scope="col" className="min-w-[90px]">
                    Confidence
                  </TableHead>
                  <TableHead scope="col" className="min-w-[80px]">
                    Bin
                  </TableHead>
                  <TableHead scope="col" className="min-w-[70px]">
                    Fallback
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40">
                      <div className="flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-medium">
                          No sorting data yet
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                          Once the sorter starts processing waste, analytics
                          will appear here automatically.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id} className="hover:bg-muted/50">
                      <TableCell>
                        {formatRelativeTime(event.timestamp)}
                      </TableCell>
                      <TableCell>{getDisplayName(event)}</TableCell>
                      <TableCell>
                        <CategoryBadge category={event.label} />
                      </TableCell>
                      <TableCell>
                        <span
                          className={getConfidenceColor(event.confidence)}
                        >
                          {Math.round(event.confidence * 100)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <CategoryBadge category={event.routed_bin} />
                      </TableCell>
                      <TableCell>
                        {event.fallback_used ? (
                          <span className="text-destructive">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
