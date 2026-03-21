import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader matching LiveFeedSection shape.
 * Shows: card header with dot + title shimmer, latest item card shimmer,
 * and 4 recent items shimmer rows.
 */
export function FeedSkeleton() {
  return (
    <section>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-2.5 w-2.5 rounded-full" />
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="ml-auto h-4 w-40 rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Latest item card skeleton */}
          <Card className="ring-1 ring-foreground/5">
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              <Skeleton className="w-full sm:w-[200px] h-[200px] rounded-lg" />
              <div className="flex-1 flex flex-col gap-3 justify-center">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
          </Card>
          {/* Recent items skeleton rows */}
          <div>
            <Skeleton className="h-4 w-24 rounded mb-3" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3 border-b border-border last:border-b-0"
              >
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-28 rounded mb-1" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
