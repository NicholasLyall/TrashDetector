"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";

/** Determine value color for average confidence. */
function getConfidenceColor(value: number): string {
  if (value >= 0.8) return "text-green-600";
  if (value >= 0.5) return "text-amber-500";
  return "text-red-500";
}

/** Determine value color for uncertain rate (lower is better). */
function getUncertainColor(value: number): string {
  if (value <= 0.1) return "text-green-600";
  if (value <= 0.3) return "text-amber-500";
  return "text-red-500";
}

/** Determine value color for fallback rate (lower is better). */
function getFallbackColor(value: number): string {
  if (value <= 0.05) return "text-green-600";
  if (value <= 0.15) return "text-amber-500";
  return "text-red-500";
}

interface MetricCardConfig {
  readonly icon: React.ElementType;
  readonly iconBgColor: string;
  readonly iconColor: string;
  readonly value: string;
  readonly valueColor: string;
  readonly label: string;
  readonly subtitle: string;
}

function MetricCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  value,
  valueColor,
  label,
  subtitle,
}: MetricCardConfig) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon
            className="h-6 w-6"
            style={{ color: iconColor }}
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col">
          <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
          <span className="text-sm font-medium text-gray-900">{label}</span>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </div>
      </div>
    </Card>
  );
}

interface ModelMetricsCardsProps {
  readonly avgConfidence: number;
  readonly uncertainRate: number;
  readonly fallbackRate: number;
}

/**
 * Three detailed metric cards for model performance:
 * Average Confidence, Uncertain Rate, and Fallback Rate.
 * Each card shows a colored icon, large formatted value, and contextual subtitle.
 * (MDTL-02)
 */
export function ModelMetricsCards({
  avgConfidence,
  uncertainRate,
  fallbackRate,
}: ModelMetricsCardsProps) {
  const cards: readonly MetricCardConfig[] = [
    {
      icon: CheckCircle,
      iconBgColor: "hsl(142 71% 45% / 0.1)",
      iconColor: "hsl(142 71% 45%)",
      value: `${Math.round(avgConfidence * 100)}%`,
      valueColor: getConfidenceColor(avgConfidence),
      label: "Average Confidence",
      subtitle: "Across all predictions",
    },
    {
      icon: AlertTriangle,
      iconBgColor: "hsl(38 92% 45% / 0.1)",
      iconColor: "hsl(38 92% 45%)",
      value: `${Math.round(uncertainRate * 100)}%`,
      valueColor: getUncertainColor(uncertainRate),
      label: "Uncertain Rate",
      subtitle: "Predictions below 70% confidence",
    },
    {
      icon: ShieldAlert,
      iconBgColor: "hsl(0 72% 45% / 0.1)",
      iconColor: "hsl(0 72% 45%)",
      value: `${Math.round(fallbackRate * 100)}%`,
      valueColor: getFallbackColor(fallbackRate),
      label: "Fallback Rate",
      subtitle: "Items routed to default bin",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}
