import type { SortEvent } from "@/lib/types";
import { CategoryBadge } from "@/lib/categories";
import { ITEM_NAMES } from "@/lib/mock-data";
import { CategoryIllustration } from "@/components/dashboard/category-illustrations";
import { formatRelativeTime } from "@/lib/format-relative-time";

interface RecentItemsListProps {
  readonly events: readonly SortEvent[];
}

/**
 * Scrollable list of recent sort events with compact rows.
 * First item (index 0) gets a green left border as the newest-event highlight.
 */
export function RecentItemsList({ events }: RecentItemsListProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Recent Items
      </h3>
      <ul className="overflow-y-auto max-h-[320px] space-y-0" role="list">
        {events.map((event, index) => {
          const names = ITEM_NAMES[event.label];
          const itemName = names[index % names.length];
          const isNewest = index === 0;

          return (
            <li
              key={event.id}
              className={`flex items-center gap-3 py-3 border-b border-border last:border-b-0${
                isNewest ? " border-l-2 border-l-green-500" : ""
              }`}
            >
              <div className="h-10 w-10 shrink-0 rounded-md overflow-hidden bg-muted/30 flex items-center justify-center">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={`Sorted ${event.label} item`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <CategoryIllustration category={event.label} size="sm" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">
                  {itemName}
                </span>
                <span className="text-xs text-muted-foreground">
                  Confidence: {Math.round(event.confidence * 100)}%
                </span>
              </div>

              <CategoryBadge category={event.label} />

              <time
                dateTime={event.timestamp}
                className="text-xs text-muted-foreground whitespace-nowrap"
                suppressHydrationWarning
              >
                {formatRelativeTime(event.timestamp)}
              </time>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
