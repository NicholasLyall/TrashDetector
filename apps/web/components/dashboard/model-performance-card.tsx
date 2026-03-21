"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { computeModelStats } from "@/lib/compute-metrics";
import { sortEventsMockData } from "@/lib/mock-data";
import { CheckCircle, HelpCircle, Trash2 } from "lucide-react";

/** Confidence thresholds for segmenting the distribution bar. */
const LOW_THRESHOLD = 0.5;
const HIGH_THRESHOLD = 0.8;

interface ConfidenceDistribution {
  readonly lowPct: number;
  readonly medPct: number;
  readonly highPct: number;
}

function computeConfidenceDistribution(
  events: readonly { readonly confidence: number }[]
): ConfidenceDistribution {
  const total = events.length;

  if (total === 0) {
    return { lowPct: 0, medPct: 0, highPct: 0 };
  }

  const lowCount = events.filter(
    (e) => e.confidence < LOW_THRESHOLD
  ).length;
  const medCount = events.filter(
    (e) => e.confidence >= LOW_THRESHOLD && e.confidence <= HIGH_THRESHOLD
  ).length;
  const highCount = events.filter(
    (e) => e.confidence > HIGH_THRESHOLD
  ).length;

  return {
    lowPct: Math.round((lowCount / total) * 100),
    medPct: Math.round((medCount / total) * 100),
    highPct: Math.round((highCount / total) * 100),
  };
}

interface MetricItemProps {
  readonly icon: React.ElementType;
  readonly iconColor: string;
  readonly value: number;
  readonly label: string;
}

function MetricItem({ icon: Icon, iconColor, value, label }: MetricItemProps) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
      <span className="text-xl font-bold">{value}%</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function SegmentedBar({ lowPct, medPct, highPct }: ConfidenceDistribution) {
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Confidence Distribution</span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {lowPct > 0 && (
          <div
            className="bg-red-500 transition-all"
            style={{ width: `${lowPct}%` }}
            title={`Low (<50%): ${lowPct}%`}
          />
        )}
        {medPct > 0 && (
          <div
            className="bg-amber-400 transition-all"
            style={{ width: `${medPct}%` }}
            title={`Medium (50-80%): ${medPct}%`}
          />
        )}
        {highPct > 0 && (
          <div
            className="bg-green-500 transition-all"
            style={{ width: `${highPct}%` }}
            title={`High (>80%): ${highPct}%`}
          />
        )}
      </div>
      {/* Legend for the bar */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span>Low {lowPct}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span>Med {medPct}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span>High {highPct}%</span>
        </div>
      </div>
    </div>
  );
}

export function ModelPerformanceCard() {
  const events = sortEventsMockData;
  const stats = computeModelStats(events);
  const distribution = computeConfidenceDistribution(events);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Three metrics in a row (per D-09) */}
        <div className="grid grid-cols-3 gap-4">
          <MetricItem
            icon={CheckCircle}
            iconColor="text-green-600"
            value={stats.avgConfidence}
            label="Avg Confidence"
          />
          <MetricItem
            icon={HelpCircle}
            iconColor="text-amber-500"
            value={stats.uncertainRate}
            label="Uncertain Rate"
          />
          <MetricItem
            icon={Trash2}
            iconColor="text-red-500"
            value={stats.fallbackRate}
            label="Fallback Rate"
          />
        </div>

        {/* Segmented horizontal bar (per D-10, D-11) */}
        <SegmentedBar
          lowPct={distribution.lowPct}
          medPct={distribution.medPct}
          highPct={distribution.highPct}
        />
      </CardContent>
    </Card>
  );
}
