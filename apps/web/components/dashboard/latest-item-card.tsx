"use client";

import { useEffect, useState } from "react";
import type { SortEvent } from "@/lib/types";
import { CategoryBadge } from "@/lib/categories";
import { ITEM_NAMES } from "@/lib/mock-data";
import { CategoryIllustration } from "@/components/dashboard/category-illustrations";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { Card } from "@/components/ui/card";

interface LatestItemCardProps {
  readonly event: SortEvent;
  readonly isNew?: boolean;
}

/**
 * Large preview card for the most recently sorted item.
 * Shows illustration (lg), item name, category badge, confidence, and timestamp.
 * When `isNew` is true, shows a subtle green pulse animation for 1 second.
 *
 * (D-04: pulse on new event arrival)
 */
export function LatestItemCard({ event, isNew }: LatestItemCardProps) {
  const itemName = ITEM_NAMES[event.label][0];
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (isNew) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 1000);
      return () => clearTimeout(timer);
    }
    setShowPulse(false);
  }, [event.id, isNew]);

  return (
    <Card
      className={`${
        showPulse && isNew ? " animate-pulse-highlight" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-5 p-5">
        <div className="relative w-full sm:w-[320px] h-[300px] rounded-[1.5rem] bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={`Sorted ${event.label} item`}
              className="h-full w-full object-cover rounded-[1.5rem]"
            />
          ) : (
            <CategoryIllustration category={event.label} size="lg" />
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2 justify-center">
          <div className="flex justify-between items-start">
            <span className="text-2xl font-extrabold text-slate-800">
              {itemName}
            </span>
            <span className="text-[11px] text-teal-600 font-bold bg-teal-50 px-2 py-1 rounded-lg">
              <time
                dateTime={event.timestamp}
                suppressHydrationWarning
              >
                {formatRelativeTime(event.timestamp)}
              </time>
            </span>
          </div>

          <div className="mb-4">
            <CategoryBadge category={event.label} />
          </div>

          {/* Confidence progress bar */}
          <div className="mt-auto">
            <div className="text-sm font-bold text-slate-500 mb-2 flex justify-between">
              <span>Confidence Score</span>
              <span className="text-emerald-600">{(event.confidence).toFixed(2)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${Math.round(event.confidence * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
