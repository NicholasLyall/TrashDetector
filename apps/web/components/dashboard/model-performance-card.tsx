"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { computeModelStats } from "@/lib/compute-metrics";
import { sortEventsMockData } from "@/lib/mock-data";
import { CheckCircle, HelpCircle, Trash2, ScanLine } from "lucide-react";

/** Confidence thresholds for segmenting the distribution. */
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

function DistributionBars({ lowPct, medPct, highPct }: ConfidenceDistribution) {
  const bars = [
    { label: "LOW", pct: lowPct, barColor: "bg-slate-400" },
    { label: "MEDIUM", pct: medPct, barColor: "bg-teal-400" },
    { label: "HIGH", pct: highPct, barColor: "bg-emerald-400" },
  ];

  return (
    <div className="space-y-5 px-1">
      {bars.map((bar) => (
        <div key={bar.label} className="flex items-center gap-4">
          <span className="text-[11px] font-bold text-slate-400 w-12 text-right tracking-widest">{bar.label}</span>
          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${bar.barColor} transition-all duration-1000`}
              style={{ width: `${Math.max(bar.pct, 8)}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white tracking-wider z-10">{bar.pct}%</span>
          </div>
        </div>
      ))}
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
            <ScanLine className="h-5 w-5" />
          </div>
          <CardTitle>Model Performance</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Three metric tiles */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-emerald-50 rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-center shadow-sm border border-emerald-100/50">
            <CheckCircle className="h-[18px] w-[18px] text-emerald-500 mb-2" />
            <span className="text-2xl font-extrabold text-emerald-700">{stats.avgConfidence}%</span>
            <span className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest mt-1">Avg Conf.</span>
          </div>
          <div className="bg-amber-50 rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-center shadow-sm border border-amber-100/50">
            <HelpCircle className="h-[18px] w-[18px] text-amber-500 mb-2" />
            <span className="text-2xl font-extrabold text-amber-700">{stats.uncertainRate}%</span>
            <span className="text-[10px] font-bold text-amber-600/80 uppercase tracking-widest mt-1">Uncertain</span>
          </div>
          <div className="bg-rose-50 rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-center shadow-sm border border-rose-100/50">
            <Trash2 className="h-[18px] w-[18px] text-rose-500 mb-2" />
            <span className="text-2xl font-extrabold text-rose-700">{stats.fallbackRate}%</span>
            <span className="text-[10px] font-bold text-rose-600/80 uppercase tracking-widest mt-1">Fallback</span>
          </div>
        </div>

        {/* Distribution bars */}
        <DistributionBars
          lowPct={distribution.lowPct}
          medPct={distribution.medPct}
          highPct={distribution.highPct}
        />
      </CardContent>
    </Card>
  );
}
