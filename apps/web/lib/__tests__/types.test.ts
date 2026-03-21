import { describe, it, expect } from "vitest";
import type { SortEvent, WasteCategory } from "../types";

describe("types.ts", () => {
  it("module exports can be imported", async () => {
    const mod = await import("../types");
    expect(mod).toBeDefined();
  });

  it("SortEvent interface allows a valid object with all 10 fields", () => {
    const event: SortEvent = {
      id: "test-001",
      timestamp: new Date().toISOString(),
      label: "plastic",
      routed_bin: "plastic",
      confidence: 0.95,
      image_url: null,
      waste_diverted_kg: 0.08,
      co2_saved_kg: 5.0,
      fallback_used: false,
      source_device_id: "pi-001",
    };

    expect(event.id).toBe("test-001");
    expect(event.label).toBe("plastic");
    expect(event.image_url).toBeNull();
    expect(event.fallback_used).toBe(false);
    expect(Object.keys(event)).toHaveLength(10);
  });

  it("WasteCategory accepts all 4 backend categories", () => {
    const categories: WasteCategory[] = [
      "paper_cardboard",
      "metal_glass",
      "plastic",
      "trash",
    ];
    expect(categories).toHaveLength(4);
  });
});
