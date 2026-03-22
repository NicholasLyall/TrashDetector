"use client";

import { Leaf, Recycle, Package, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/mock-data";

interface ImpactHeroProps {
  readonly co2SavedKg: number;
  readonly wasteDivertedKg: number;
  readonly totalItems: number;
  readonly recyclingRate: number;
}

interface StatPill {
  readonly icon: React.ElementType;
  readonly bgColor: string;
  readonly iconColor: string;
  readonly value: string;
  readonly label: string;
}

function HeroStatPill({ icon: Icon, bgColor, iconColor, value, label }: StatPill) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: bgColor }}
      >
        <Icon className="h-5 w-5" style={{ color: iconColor }} aria-hidden="true" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold leading-tight">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export function ImpactHero({ co2SavedKg, wasteDivertedKg, totalItems, recyclingRate }: ImpactHeroProps) {
  const statPills: readonly StatPill[] = [
    {
      icon: Leaf,
      bgColor: "hsl(142 71% 45% / 0.1)",
      iconColor: "hsl(142 71% 45%)",
      value: `${formatNumber(co2SavedKg)} kg`,
      label: "CO2 Saved",
    },
    {
      icon: Recycle,
      bgColor: "hsl(174 62% 47% / 0.1)",
      iconColor: "hsl(174 62% 47%)",
      value: `${formatNumber(wasteDivertedKg)} kg`,
      label: "Waste Diverted",
    },
    {
      icon: Package,
      bgColor: "hsl(199 89% 48% / 0.1)",
      iconColor: "hsl(199 89% 48%)",
      value: formatNumber(totalItems),
      label: "Items Sorted",
    },
    {
      icon: TrendingUp,
      bgColor: "hsl(142 71% 45% / 0.1)",
      iconColor: "hsl(142 71% 45%)",
      value: `${Math.round(recyclingRate * 100)}%`,
      label: "Recycling Rate",
    },
  ];

  return (
    <Card className="hero-gradient min-h-[200px] overflow-hidden rounded-xl shadow-sm ring-1 ring-foreground/5">
      <div className="flex flex-col items-center p-6 pt-10 md:p-8 md:pt-12">
        <h1 className="text-center text-2xl font-bold md:text-3xl">
          Your Environmental Impact
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Every item sorted makes a difference
        </p>
        <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          {statPills.map((pill) => (
            <HeroStatPill
              key={pill.label}
              icon={pill.icon}
              bgColor={pill.bgColor}
              iconColor={pill.iconColor}
              value={pill.value}
              label={pill.label}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
