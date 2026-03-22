import { HeroImpactSection } from "@/components/dashboard/hero-impact-section";
import { LiveFeedSection } from "@/components/dashboard/live-feed-section";
import { WasteCompositionCard } from "@/components/dashboard/waste-composition-card";
import { ModelPerformanceCard } from "@/components/dashboard/model-performance-card";
import { RecentItemsList } from "@/components/dashboard/recent-items-list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sortEventsMockData } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-4">
      <HeroImpactSection />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 space-y-6">
          <LiveFeedSection />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-extrabold">Sorting History</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentItemsList events={sortEventsMockData} />
            </CardContent>
          </Card>
        </div>
        <div className="xl:col-span-5 space-y-6">
          <WasteCompositionCard />
          <ModelPerformanceCard />
        </div>
      </div>
    </div>
  );
}
