import { describe, it, expect } from "vitest";

describe("categories.ts", () => {
  it("CATEGORY_CONFIG has exactly 4 keys matching backend categories", async () => {
    const { CATEGORY_CONFIG } = await import("../categories");
    const keys = Object.keys(CATEGORY_CONFIG);
    expect(keys).toHaveLength(4);
    expect(keys).toContain("paper_cardboard");
    expect(keys).toContain("metal_glass");
    expect(keys).toContain("plastic");
    expect(keys).toContain("trash");
  });

  it("each category has displayLabel, badgeColor, badgeBg, darkBadgeColor, darkBadgeBg, icon", async () => {
    const { CATEGORY_CONFIG } = await import("../categories");
    for (const key of Object.keys(CATEGORY_CONFIG)) {
      const config = CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG];
      expect(config).toHaveProperty("displayLabel");
      expect(config).toHaveProperty("badgeColor");
      expect(config).toHaveProperty("badgeBg");
      expect(config).toHaveProperty("darkBadgeColor");
      expect(config).toHaveProperty("darkBadgeBg");
      expect(config).toHaveProperty("icon");
    }
  });

  it("paper_cardboard displayLabel is 'Recycling (Paper)'", async () => {
    const { CATEGORY_CONFIG } = await import("../categories");
    expect(CATEGORY_CONFIG.paper_cardboard.displayLabel).toBe("Recycling (Paper)");
  });

  it("metal_glass displayLabel is 'Recycling (Metal)'", async () => {
    const { CATEGORY_CONFIG } = await import("../categories");
    expect(CATEGORY_CONFIG.metal_glass.displayLabel).toBe("Recycling (Metal)");
  });

  it("plastic displayLabel is 'Recycling (Plastic)'", async () => {
    const { CATEGORY_CONFIG } = await import("../categories");
    expect(CATEGORY_CONFIG.plastic.displayLabel).toBe("Recycling (Plastic)");
  });

  it("trash displayLabel is 'Landfill'", async () => {
    const { CATEGORY_CONFIG } = await import("../categories");
    expect(CATEGORY_CONFIG.trash.displayLabel).toBe("Landfill");
  });

  it("CO2_PER_TREE_KG_PER_YEAR equals 22 (EPA standard)", async () => {
    const { CO2_PER_TREE_KG_PER_YEAR } = await import("../categories");
    expect(CO2_PER_TREE_KG_PER_YEAR).toBe(22);
  });

  it("calculateTreesEquivalent sums co2_saved_kg and divides by 22", async () => {
    const { calculateTreesEquivalent } = await import("../categories");
    const events = [
      { co2_saved_kg: 22 },
      { co2_saved_kg: 22 },
      { co2_saved_kg: 11 },
    ] as ReadonlyArray<{ readonly co2_saved_kg: number }>;
    // (22 + 22 + 11) / 22 = 2.5 -> Math.round = 3
    expect(calculateTreesEquivalent(events as any)).toBe(3);
  });

  it("calculateTreesEquivalent returns 0 for empty events", async () => {
    const { calculateTreesEquivalent } = await import("../categories");
    expect(calculateTreesEquivalent([])).toBe(0);
  });

  it("calculateTreesEquivalent returns minimum 0", async () => {
    const { calculateTreesEquivalent } = await import("../categories");
    expect(calculateTreesEquivalent([])).toBeGreaterThanOrEqual(0);
  });
});
