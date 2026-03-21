import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader matching HeroImpactSection shape.
 * Shows: tall rounded card with shimmer where the motivational text goes,
 * plus 3 stat card shimmer blocks in a responsive grid.
 */
export function HeroSkeleton() {
  return (
    <section>
      <Card className="relative hero-gradient min-h-[280px] overflow-hidden rounded-xl shadow-sm ring-1 ring-foreground/5">
        <div className="relative z-10 flex flex-col items-center p-4 pt-8 md:p-6 md:pt-12">
          {/* Motivational text placeholder */}
          <Skeleton className="h-7 w-64 rounded-md" />
          <Skeleton className="mt-2 h-7 w-48 rounded-md" />

          {/* 3 stat cards grid */}
          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-card shadow-sm">
                <div className="flex items-center gap-3 p-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
