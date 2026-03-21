import { HeroImpactSection } from "@/components/dashboard/hero-impact-section";
import { LiveFeedSection } from "@/components/dashboard/live-feed-section";
import { WasteCompositionCard } from "@/components/dashboard/waste-composition-card";
import { ModelPerformanceCard } from "@/components/dashboard/model-performance-card";
import { RecentItemsList } from "@/components/dashboard/recent-items-list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sortEventsMockData } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <HeroImpactSection />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <LiveFeedSection />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <WasteCompositionCard />
          <ModelPerformanceCard />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Sorting History</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentItemsList events={sortEventsMockData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
