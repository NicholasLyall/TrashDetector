import type { SortEvent, WasteCategory } from "./types";
import { CATEGORY_CONFIG } from "./categories";

/**
 * KPI metrics displayed in the top bar chip strip.
 */
export interface KpiMetrics {
  readonly totalItems: number;
  readonly recyclingRate: number;
  readonly avgConfidence: number;
  readonly fallbackRate: number;
}

/**
 * A single entry in the waste category breakdown.
 */
export interface CategoryBreakdownEntry {
  readonly category: WasteCategory;
  readonly count: number;
  readonly percentage: number;
  readonly color: string;
}

/**
 * Model performance statistics.
 */
export interface ModelStats {
  readonly avgConfidence: number;
  readonly uncertainRate: number;
  readonly fallbackRate: number;
}

/**
 * Compute top-level KPI metrics from a list of sort events.
 *
 * - totalItems: count of events
 * - recyclingRate: percentage of events with label !== "trash", rounded
 * - avgConfidence: mean confidence as 0-100 percentage, rounded
 * - fallbackRate: percentage of events with fallback_used === true, rounded
 *
 * Returns all zeros if events is empty (avoids division by zero).
 */
export function computeKpiMetrics(
  events: readonly SortEvent[]
): KpiMetrics {
  const total = events.length;

  if (total === 0) {
    return {
      totalItems: 0,
      recyclingRate: 0,
      avgConfidence: 0,
      fallbackRate: 0,
    };
  }

  const nonTrashCount = events.filter(
    (event) => event.label !== "trash"
  ).length;
  const confidenceSum = events.reduce(
    (sum, event) => sum + event.confidence,
    0
  );
  const fallbackCount = events.filter(
    (event) => event.fallback_used
  ).length;

  return {
    totalItems: total,
    recyclingRate: Math.round((nonTrashCount / total) * 100),
    avgConfidence: Math.round((confidenceSum / total) * 100),
    fallbackRate: Math.round((fallbackCount / total) * 100),
  };
}

/**
 * Compute category breakdown for waste composition visualization.
 *
 * Groups events by label, computes count and percentage per category,
 * maps each category to its display color from CATEGORY_CONFIG,
 * and returns entries sorted descending by count.
 *
 * Only includes categories with at least one event.
 */
export function computeCategoryBreakdown(
  events: readonly SortEvent[]
): CategoryBreakdownEntry[] {
  const total = events.length;

  if (total === 0) {
    return [];
  }

  // Count events per category using immutable accumulation
  const counts = events.reduce<Readonly<Record<string, number>>>(
    (acc, event) => ({
      ...acc,
      [event.label]: (acc[event.label] ?? 0) + 1,
    }),
    {}
  );

  // Build entries for categories that have events
  const categoryKeys = Object.keys(CATEGORY_CONFIG) as WasteCategory[];
  const entries: CategoryBreakdownEntry[] = categoryKeys
    .filter((category) => (counts[category] ?? 0) > 0)
    .map((category) => {
      const count = counts[category] ?? 0;
      return {
        category,
        count,
        percentage: Math.round((count / total) * 100),
        color: CATEGORY_CONFIG[category].badgeColor,
      };
    });

  // Sort descending by count
  return [...entries].sort((a, b) => b.count - a.count);
}

/**
 * Compute model performance statistics.
 *
 * - avgConfidence: mean confidence as 0-100 percentage, rounded
 * - uncertainRate: percentage of events with confidence < 0.5, rounded
 * - fallbackRate: percentage of events with fallback_used === true, rounded
 *
 * Returns all zeros if events is empty.
 */
export function computeModelStats(
  events: readonly SortEvent[]
): ModelStats {
  const total = events.length;

  if (total === 0) {
    return {
      avgConfidence: 0,
      uncertainRate: 0,
      fallbackRate: 0,
    };
  }

  const confidenceSum = events.reduce(
    (sum, event) => sum + event.confidence,
    0
  );
  const uncertainCount = events.filter(
    (event) => event.confidence < 0.5
  ).length;
  const fallbackCount = events.filter(
    (event) => event.fallback_used
  ).length;

  return {
    avgConfidence: Math.round((confidenceSum / total) * 100),
    uncertainRate: Math.round((uncertainCount / total) * 100),
    fallbackRate: Math.round((fallbackCount / total) * 100),
  };
}
