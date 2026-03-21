import type { SortEvent } from "@/lib/types";
import { CategoryBadge } from "@/lib/categories";
import { ITEM_NAMES } from "@/lib/mock-data";
import { CategoryIllustration } from "@/components/dashboard/category-illustrations";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { Card } from "@/components/ui/card";

interface LatestItemCardProps {
  readonly event: SortEvent;
}

/**
 * Large preview card for the most recently sorted item.
 * Shows illustration (lg), item name, category badge, confidence, and timestamp.
 */
export function LatestItemCard({ event }: LatestItemCardProps) {
  const itemName = ITEM_NAMES[event.label][0];

  return (
    <Card className="ring-1 ring-foreground/5">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative w-full sm:w-[200px] h-[200px] rounded-lg bg-muted/30 flex items-center justify-center">
          <CategoryIllustration category={event.label} size="lg" />
        </div>

        <div className="flex-1 flex flex-col gap-2 justify-center">
          <span className="text-lg font-bold text-card-foreground">
            {itemName}
          </span>

          <CategoryBadge category={event.label} />

          <span className="text-sm text-muted-foreground">
            Confidence: {Math.round(event.confidence * 100)}%
          </span>

          <time
            dateTime={event.timestamp}
            className="text-sm text-muted-foreground"
            suppressHydrationWarning
          >
            {formatRelativeTime(event.timestamp)}
          </time>
        </div>
      </div>
    </Card>
  );
}
