import { describe, it, expect } from "vitest";
import {
  computeKpiMetrics,
  computeCategoryBreakdown,
  computeModelStats,
} from "./compute-metrics";
import { sortEventsMockData } from "./mock-data";
import type { SortEvent } from "./types";

/**
 * Helper to create a minimal SortEvent for unit tests.
 * Only the fields used by compute-metrics are required;
 * the rest get sensible defaults.
 */
function makeEvent(
  overrides: Partial<SortEvent> & Pick<SortEvent, "label" | "confidence">
): SortEvent {
  return {
    id: "test-evt",
    timestamp: new Date().toISOString(),
    routed_bin: overrides.label,
    image_url: null,
    waste_diverted_kg: 0.1,
    co2_saved_kg: 1.0,
    fallback_used: false,
    source_device_id: "pi-test",
    ...overrides,
  };
}

// ─── computeKpiMetrics ─────────────────────────────────────────────────────

describe("computeKpiMetrics", () => {
  it("returns all zeros for empty array", () => {
    const result = computeKpiMetrics([]);
    expect(result).toEqual({
      totalItems: 0,
      recyclingRate: 0,
      avgConfidence: 0,
      fallbackRate: 0,
    });
  });

  it("computes correct values from sortEventsMockData", () => {
    const result = computeKpiMetrics(sortEventsMockData);
    // 10 events, 8 non-trash -> 80% recycling
    // sum of confidences: 0.94+0.97+0.89+0.91+0.41+0.95+0.88+0.73+0.55+0.92 = 8.15
    // avg = 0.815, rounded*100 = 82
    // 2 fallback (evt-005, evt-009) -> 20%
    expect(result.totalItems).toBe(10);
    expect(result.recyclingRate).toBe(80);
    expect(result.avgConfidence).toBe(82);
    expect(result.fallbackRate).toBe(20);
  });

  it("handles single non-trash event", () => {
    const events = [makeEvent({ label: "plastic", confidence: 0.9 })];
    const result = computeKpiMetrics(events);
    expect(result.totalItems).toBe(1);
    expect(result.recyclingRate).toBe(100);
    expect(result.avgConfidence).toBe(90);
    expect(result.fallbackRate).toBe(0);
  });

  it("handles all-trash events", () => {
    const events = [
      makeEvent({ label: "trash", confidence: 0.3, fallback_used: true }),
      makeEvent({ label: "trash", confidence: 0.5, fallback_used: true }),
    ];
    const result = computeKpiMetrics(events);
    expect(result.totalItems).toBe(2);
    expect(result.recyclingRate).toBe(0);
    expect(result.avgConfidence).toBe(40);
    expect(result.fallbackRate).toBe(100);
  });
});

// ─── computeCategoryBreakdown ───────────────────────────────────────────────

describe("computeCategoryBreakdown", () => {
  it("returns empty array for empty input", () => {
    const result = computeCategoryBreakdown([]);
    expect(result).toEqual([]);
  });

  it("computes correct breakdown from sortEventsMockData", () => {
    const result = computeCategoryBreakdown(sortEventsMockData);
    // paper_cardboard=3, plastic=3, metal_glass=2, trash=2
    expect(result).toHaveLength(4);

    // Sorted descending by count, ties broken by order
    const paperEntry = result.find((e) => e.category === "paper_cardboard");
    expect(paperEntry).toBeDefined();
    expect(paperEntry!.count).toBe(3);
    expect(paperEntry!.percentage).toBe(30);
    expect(paperEntry!.color).toBe("hsl(210 90% 40%)");

    const plasticEntry = result.find((e) => e.category === "plastic");
    expect(plasticEntry).toBeDefined();
    expect(plasticEntry!.count).toBe(3);
    expect(plasticEntry!.percentage).toBe(30);
    expect(plasticEntry!.color).toBe("hsl(142 71% 35%)");

    const metalEntry = result.find((e) => e.category === "metal_glass");
    expect(metalEntry).toBeDefined();
    expect(metalEntry!.count).toBe(2);
    expect(metalEntry!.percentage).toBe(20);
    expect(metalEntry!.color).toBe("hsl(38 92% 45%)");

    const trashEntry = result.find((e) => e.category === "trash");
    expect(trashEntry).toBeDefined();
    expect(trashEntry!.count).toBe(2);
    expect(trashEntry!.percentage).toBe(20);
    expect(trashEntry!.color).toBe("hsl(0 72% 45%)");
  });

  it("excludes categories with zero count", () => {
    const events = [
      makeEvent({ label: "plastic", confidence: 0.9 }),
      makeEvent({ label: "plastic", confidence: 0.8 }),
    ];
    const result = computeCategoryBreakdown(events);
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("plastic");
    expect(result[0].count).toBe(2);
    expect(result[0].percentage).toBe(100);
  });

  it("sorts descending by count", () => {
    const events = [
      makeEvent({ label: "trash", confidence: 0.3 }),
      makeEvent({ label: "plastic", confidence: 0.9 }),
      makeEvent({ label: "plastic", confidence: 0.8 }),
      makeEvent({ label: "plastic", confidence: 0.7 }),
    ];
    const result = computeCategoryBreakdown(events);
    expect(result[0].category).toBe("plastic");
    expect(result[0].count).toBe(3);
    expect(result[1].category).toBe("trash");
    expect(result[1].count).toBe(1);
  });
});

// ─── computeModelStats ──────────────────────────────────────────────────────

describe("computeModelStats", () => {
  it("returns all zeros for empty array", () => {
    const result = computeModelStats([]);
    expect(result).toEqual({
      avgConfidence: 0,
      uncertainRate: 0,
      fallbackRate: 0,
    });
  });

  it("computes correct stats from sortEventsMockData", () => {
    const result = computeModelStats(sortEventsMockData);
    // avg confidence = 82 (8.15/10 * 100 rounded)
    // uncertain (confidence < 0.5) = 1 (evt-005 at 0.41) = 10%
    // fallback = 2 (evt-005, evt-009) = 20%
    expect(result.avgConfidence).toBe(82);
    expect(result.uncertainRate).toBe(10);
    expect(result.fallbackRate).toBe(20);
  });

  it("counts all low-confidence events as uncertain", () => {
    const events = [
      makeEvent({ label: "plastic", confidence: 0.3 }),
      makeEvent({ label: "trash", confidence: 0.49 }),
      makeEvent({ label: "metal_glass", confidence: 0.5 }), // exactly 0.5 is NOT uncertain
    ];
    const result = computeModelStats(events);
    expect(result.uncertainRate).toBe(67); // 2/3 = 66.67 -> Math.round = 67
  });
});
