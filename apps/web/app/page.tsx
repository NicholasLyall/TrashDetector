import { HeroImpactSection } from "@/components/dashboard/hero-impact-section";
import { LiveFeedSection } from "@/components/dashboard/live-feed-section";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <HeroImpactSection />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <LiveFeedSection />
        </div>
        {/* Phase 4 will add waste composition and model performance cards here */}
        {/* <div className="lg:col-span-2 space-y-6">...</div> */}
      </div>
    </div>
  );
}
