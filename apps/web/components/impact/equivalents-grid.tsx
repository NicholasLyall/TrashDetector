"use client";

import { TreePine, Car, Smartphone, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { computeCo2Equivalents } from "@/lib/impact-equivalents";
import { formatNumber } from "@/lib/mock-data";

interface EquivalentsGridProps {
  readonly co2SavedKg: number;
}

interface EquivalentCardData {
  readonly icon: React.ElementType;
  readonly bgColor: string;
  readonly iconColor: string;
  readonly value: number;
  readonly label: string;
  readonly description: string;
}

function EquivalentCard({ icon: Icon, bgColor, iconColor, value, label, description }: EquivalentCardData) {
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

export function EquivalentsGrid({ co2SavedKg }: EquivalentsGridProps) {
  const equivalents = computeCo2Equivalents(co2SavedKg);

  const cards: readonly EquivalentCardData[] = [
    {
      icon: TreePine,
      bgColor: "hsl(142 71% 45% / 0.1)",
      iconColor: "hsl(142 71% 45%)",
      value: equivalents.trees_yearly,
      label: "Trees Worth of CO2 Absorption",
      description: "Based on EPA: 1 tree absorbs 22 kg CO2/year",
    },
    {
      icon: Car,
      bgColor: "hsl(199 89% 48% / 0.1)",
      iconColor: "hsl(199 89% 48%)",
      value: equivalents.miles_driven,
      label: "Miles of Driving Avoided",
      description: "Average passenger vehicle: 0.404 kg CO2/mile",
    },
    {
      icon: Smartphone,
      bgColor: "hsl(174 62% 47% / 0.1)",
      iconColor: "hsl(174 62% 47%)",
      value: equivalents.phone_charges,
      label: "Smartphone Charges Offset",
      description: "Each charge produces ~0.0079 kg CO2",
    },
    {
      icon: Lightbulb,
      bgColor: "hsl(38 92% 50% / 0.1)",
      iconColor: "hsl(38 92% 50%)",
      value: equivalents.light_bulb_hours,
      label: "Hours of Light Bulb Saved",
      description: "60W incandescent: 0.043 kg CO2/hour",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold">CO2 Savings Equivalents</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What your {formatNumber(co2SavedKg)} kg of CO2 savings means
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <EquivalentCard
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
