"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/** HSL colors matching existing palette. */
const COLORS = {
  red: "hsl(0 72% 45%)",
  amber: "hsl(38 92% 45%)",
  green: "hsl(142 71% 45%)",
} as const;

/** Bucket range labels for the 10 distribution buckets. */
const BUCKET_RANGES = [
  "0-10",
  "10-20",
  "20-30",
  "30-40",
  "40-50",
  "50-60",
  "60-70",
  "70-80",
  "80-90",
  "90-100",
] as const;

/** Map bucket index (0-9) to the appropriate zone color. */
function getBucketColor(bucketIndex: number): string {
  if (bucketIndex < 5) return COLORS.red; // 0-49%
  if (bucketIndex < 8) return COLORS.amber; // 50-79%
  return COLORS.green; // 80-100%
}

interface BucketEntry {
  readonly range: string;
  readonly count: number;
  readonly fill: string;
}

/**
 * Pure function: bucket an array of confidence values (0-1) into 10 ranges.
 * Returns exactly 10 entries, one per bucket (0-10%, 10-20%, ..., 90-100%).
 * Empty input returns all-zero buckets.
 */
export function computeDistributionBuckets(
  events: readonly { readonly confidence: number }[]
): readonly BucketEntry[] {
  const counts = new Array<number>(10).fill(0);

  for (const event of events) {
    // Clamp confidence to [0, 1] and compute bucket index
    const clamped = Math.max(0, Math.min(1, event.confidence));
    const index = clamped >= 1 ? 9 : Math.floor(clamped * 10);
    counts[index] = counts[index] + 1;
  }

  return BUCKET_RANGES.map((range, i) => ({
    range,
    count: counts[i],
    fill: getBucketColor(i),
  }));
}

interface ConfidenceDistributionChartProps {
  readonly events: readonly { readonly confidence: number }[];
}

/**
 * Recharts BarChart showing confidence distribution across 10% buckets.
 * Bars are color-coded by confidence zone: red (low), amber (medium), green (high).
 * (MDTL-03)
 */
export function ConfidenceDistributionChart({
  events,
}: ConfidenceDistributionChartProps) {
  const buckets = computeDistributionBuckets(events);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={buckets as BucketEntry[]}
            margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Confidence %",
                position: "insideBottom",
                offset: -4,
                fontSize: 12,
                fill: "hsl(0 0% 50%)",
              }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Events",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fontSize: 12,
                fill: "hsl(0 0% 50%)",
              }}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value: number) => [value, "Events"]}
              labelFormatter={(label: string) => `${label}% confidence`}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(0 0% 90%)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {buckets.map((entry) => (
                <Cell key={entry.range} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Zone legend */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS.red }}
            />
            <span>Low (0-49%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS.amber }}
            />
            <span>Medium (50-79%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS.green }}
            />
            <span>High (80-100%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
