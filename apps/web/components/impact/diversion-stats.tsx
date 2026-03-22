"use client";

import { Trash2, Circle, Droplets } from "lucide-react";
import { Card } from "@/components/ui/card";
import { computeWasteEquivalents } from "@/lib/impact-equivalents";
import { formatNumber } from "@/lib/mock-data";

interface DiversionStatsProps {
  readonly wasteDivertedKg: number;
}

interface DiversionCardData {
  readonly icon: React.ElementType;
  readonly bgColor: string;
  readonly iconColor: string;
  readonly value: number;
  readonly label: string;
  readonly description: string;
}

function DiversionCard({ icon: Icon, bgColor, iconColor, value, label, description }: DiversionCardData) {
  return (
    <Card className="p-6">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: bgColor }}
      >
        <Icon className="h-6 w-6" style={{ color: iconColor }} aria-hidden="true" />
      </div>
      <p className="mt-4 text-4xl font-bold md:text-5xl">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground/70">
        {description}
      </p>
    </Card>
  );
}

export function DiversionStats({ wasteDivertedKg }: DiversionStatsProps) {
  const equivalents = computeWasteEquivalents(wasteDivertedKg);

  const cards: readonly DiversionCardData[] = [
    {
      icon: Trash2,
      bgColor: "hsl(0 72% 50% / 0.1)",
      iconColor: "hsl(0 72% 50%)",
      value: equivalents.trash_bags,
      label: "Trash Bags Diverted",
      description: "Average kitchen bag: 6.8 kg",
    },
    {
      icon: Circle,
      bgColor: "hsl(38 92% 50% / 0.1)",
      iconColor: "hsl(38 92% 50%)",
      value: equivalents.bowling_balls,
      label: "Bowling Balls of Weight",
      description: "Standard ball: 6.35 kg (14 lbs)",
    },
    {
      icon: Droplets,
      bgColor: "hsl(199 89% 48% / 0.1)",
      iconColor: "hsl(199 89% 48%)",
      value: equivalents.water_bottles,
      label: "Plastic Bottles Saved",
      description: "Empty PET bottle: 0.02 kg",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Waste Diversion Impact</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What {formatNumber(wasteDivertedKg)} kg of diverted waste looks like
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <DiversionCard
            key={card.label}
            icon={card.icon}
            bgColor={card.bgColor}
            iconColor={card.iconColor}
            value={card.value}
            label={card.label}
            description={card.description}
          />
        ))}
      </div>
    </section>
  );
}
