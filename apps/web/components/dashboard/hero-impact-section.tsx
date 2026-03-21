"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { heroMockData, formatNumber } from "@/lib/mock-data";
import { HeroIllustration } from "@/components/dashboard/hero-illustration";
import { Recycle, Leaf, Package } from "lucide-react";

interface StatCardProps {
  readonly icon: React.ElementType;
  readonly iconBgColor: string;
  readonly iconColor: string;
  readonly value: string;
  readonly label: string;
}

function StatCard({ icon: Icon, iconBgColor, iconColor, value, label }: StatCardProps) {
  return (
    <Card className="bg-card shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-bold leading-[1.3]">{value}</span>
          <span className="text-[14px] text-muted-foreground">{label}</span>
        </div>
      </div>
    </Card>
  );
}

const statCards = [
  {
    icon: Recycle,
    iconBgColor: "hsl(142 71% 45% / 0.1)",
    iconColor: "hsl(142 71% 45%)",
    value: `${formatNumber(heroMockData.recycledPercent)}%`,
    label: "Recycled",
  },
  {
    icon: Leaf,
    iconBgColor: "hsl(174 62% 47% / 0.1)",
    iconColor: "hsl(174 62% 47%)",
    value: `${formatNumber(heroMockData.co2SavedKg)} kg`,
    label: "CO2 Saved",
  },
  {
    icon: Package,
    iconBgColor: "hsl(199 89% 48% / 0.1)",
    iconColor: "hsl(199 89% 48%)",
    value: formatNumber(heroMockData.totalItemsSorted),
    label: "Total Items Sorted",
  },
] as const;

export function HeroImpactSection() {
  return (
    <section>
      <Card className="relative hero-gradient min-h-[280px] overflow-hidden rounded-xl shadow-sm ring-1 ring-foreground/5">
        <HeroIllustration />
        <div className="relative z-10 flex flex-col items-center p-4 pt-8 md:p-6 md:pt-12">
          <h1 className="max-w-lg text-center text-[20px] font-bold leading-[1.2] sm:text-[22px] md:text-[28px]">
            Great job! You&apos;ve diverted{" "}
            <span className="text-[hsl(var(--eco-green))] dark:text-[hsl(142_71%_55%)]">
              {heroMockData.wasteDivertedKg} kg
            </span>{" "}
            of waste today.
          </h1>
          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
            {statCards.map((card) => (
              <StatCard
                key={card.label}
                icon={card.icon}
                iconBgColor={card.iconBgColor}
                iconColor={card.iconColor}
                value={card.value}
                label={card.label}
              />
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
