import type { SortEvent } from "./types";

/**
 * Time range options for the sorting trend chart.
 */
export type TimeRange = "24h" | "7d" | "30d";

/**
 * A single data point in the sorting trend chart.
 */
export interface TrendDataPoint {
  readonly time: string;
  readonly count: number;
}

/**
 * Summary statistics computed from trend data points.
 */
export interface TrendSummary {
  readonly peak: number;
  readonly average: number;
}

/**
 * Format an hour value (0-23) as "h AM/PM" label.
 */
function formatHourLabel(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  const period = hour < 12 ? "AM" : "PM";
  const display = hour > 12 ? hour - 12 : hour;
  return `${display} ${period}`;
}

/**
 * Format a Date as a short weekday name (Mon, Tue, etc.).
 */
function formatWeekdayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

/**
 * Format a Date as a short date label (e.g., "Mar 1", "Mar 15").
 */
function formatShortDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Group sort events into time buckets for trend visualization.
 *
 * - "24h": 24 hourly buckets going back 24 hours. Label: "12 PM", "1 AM", etc.
 * - "7d": 7 daily buckets going back 7 days. Label: "Mon", "Tue", etc.
 * - "30d": 30 daily buckets going back 30 days. Label: "Mar 1", "Mar 15", etc.
 *
 * Empty buckets get count: 0 so the chart shows gaps, not compressed data.
 * Pure function, no side effects.
 */
export function groupEventsByTime(
  events: readonly SortEvent[],
  range: TimeRange
): readonly TrendDataPoint[] {
  const now = new Date();

  if (range === "24h") {
    // Create 24 hourly buckets
    const buckets: Map<number, number> = new Map();
    const labels: Map<number, string> = new Map();

    for (let i = 23; i >= 0; i--) {
      const bucketDate = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourKey = bucketDate.getHours();
      buckets.set(i, 0);
      labels.set(i, formatHourLabel(hourKey));
    }

    // Count events per hour bucket
    for (const event of events) {
      const eventDate = new Date(event.timestamp);
      const diffMs = now.getTime() - eventDate.getTime();
      const diffHours = Math.floor(diffMs / (60 * 60 * 1000));

      if (diffHours >= 0 && diffHours < 24) {
        const bucketIndex = 23 - diffHours;
        buckets.set(bucketIndex, (buckets.get(bucketIndex) ?? 0) + 1);
      }
    }

    return Array.from({ length: 24 }, (_, i) => ({
      time: labels.get(i) ?? "",
      count: buckets.get(i) ?? 0,
    }));
  }

  if (range === "7d") {
    // Create 7 daily buckets
    const buckets: Map<string, number> = new Map();
    const orderedKeys: string[] = [];
    const displayLabels: Map<string, string> = new Map();

    for (let i = 6; i >= 0; i--) {
      const bucketDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = bucketDate.toISOString().slice(0, 10);
      orderedKeys.push(key);
      buckets.set(key, 0);
      displayLabels.set(key, formatWeekdayLabel(bucketDate));
    }

    for (const event of events) {
      const eventDate = new Date(event.timestamp);
      const key = eventDate.toISOString().slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
    }

    return orderedKeys.map((key) => ({
      time: displayLabels.get(key) ?? "",
      count: buckets.get(key) ?? 0,
    }));
  }

  // range === "30d"
  const buckets: Map<string, number> = new Map();
  const orderedKeys: string[] = [];
  const displayLabels: Map<string, string> = new Map();

  for (let i = 29; i >= 0; i--) {
    const bucketDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = bucketDate.toISOString().slice(0, 10);
    orderedKeys.push(key);
    buckets.set(key, 0);
    displayLabels.set(key, formatShortDateLabel(bucketDate));
  }

  for (const event of events) {
    const eventDate = new Date(event.timestamp);
    const key = eventDate.toISOString().slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return orderedKeys.map((key) => ({
    time: displayLabels.get(key) ?? "",
    count: buckets.get(key) ?? 0,
  }));
}

/**
 * Return a CSS class string for confidence-based coloring.
 *
 * - >= 0.8: green (high confidence)
 * - >= 0.5 and < 0.8: amber (moderate confidence)
 * - < 0.5: red (low confidence)
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "text-green-600";
  if (confidence >= 0.5) return "text-amber-500";
  return "text-red-500";
}

/**
 * Compute summary statistics from trend data points.
 *
 * - peak: maximum count across all data points (0 if empty)
 * - average: rounded mean count across all data points (0 if empty)
 */
export function computeTrendSummary(
  dataPoints: readonly TrendDataPoint[]
): TrendSummary {
  if (dataPoints.length === 0) {
    return { peak: 0, average: 0 };
  }

  const counts = dataPoints.map((dp) => dp.count);
  const peak = Math.max(...counts);
  const sum = counts.reduce((acc, c) => acc + c, 0);
  const average = Math.round(sum / counts.length);

  return { peak, average };
}
