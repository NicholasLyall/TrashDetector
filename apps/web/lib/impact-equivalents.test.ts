import { describe, it, expect } from "vitest";
import {
  computeCo2Equivalents,
  computeWasteEquivalents,
  CO2_KG_PER_MILE,
  CO2_KG_PER_PHONE_CHARGE,
  CO2_KG_PER_BULB_HOUR,
  KG_PER_TRASH_BAG,
  KG_PER_BOWLING_BALL,
  KG_PER_WATER_BOTTLE,
} from "./impact-equivalents";

describe("computeCo2Equivalents", () => {
  it("returns all zeros for zero input", () => {
    const result = computeCo2Equivalents(0);
    expect(result).toEqual({
      trees_yearly: 0,
      miles_driven: 0,
      phone_charges: 0,
      light_bulb_hours: 0,
    });
  });

  it("returns all zeros for negative input", () => {
    const result = computeCo2Equivalents(-10);
    expect(result).toEqual({
      trees_yearly: 0,
      miles_driven: 0,
      phone_charges: 0,
      light_bulb_hours: 0,
    });
  });

  it("computes trees_yearly correctly (22 kg CO2 per tree per year)", () => {
    expect(computeCo2Equivalents(22).trees_yearly).toBe(1);
    expect(computeCo2Equivalents(44).trees_yearly).toBe(2);
    expect(computeCo2Equivalents(11).trees_yearly).toBe(1); // rounds 0.5 up
  });

  it("computes miles_driven correctly (0.404 kg CO2 per mile)", () => {
    const result = computeCo2Equivalents(0.404);
    expect(result.miles_driven).toBe(1);
  });

  it("computes phone_charges correctly (0.0079 kg CO2 per charge)", () => {
    const result = computeCo2Equivalents(0.0079);
    expect(result.phone_charges).toBe(1);
  });

  it("computes light_bulb_hours correctly (0.043 kg CO2 per hour)", () => {
    const result = computeCo2Equivalents(0.043);
    expect(result.light_bulb_hours).toBe(1);
  });

  it("uses Math.round for all values", () => {
    // 10 kg CO2: trees = 10/22 = 0.45 -> rounds to 0
    // miles = 10/0.404 = 24.75 -> rounds to 25
    // phone_charges = 10/0.0079 = 1265.82 -> rounds to 1266
    // light_bulb_hours = 10/0.043 = 232.56 -> rounds to 233
    const result = computeCo2Equivalents(10);
    expect(result.trees_yearly).toBe(0);
    expect(result.miles_driven).toBe(25);
    expect(result.phone_charges).toBe(1266);
    expect(result.light_bulb_hours).toBe(233);
  });

  it("ensures all values are non-negative", () => {
    const result = computeCo2Equivalents(0.001);
    expect(result.trees_yearly).toBeGreaterThanOrEqual(0);
    expect(result.miles_driven).toBeGreaterThanOrEqual(0);
    expect(result.phone_charges).toBeGreaterThanOrEqual(0);
    expect(result.light_bulb_hours).toBeGreaterThanOrEqual(0);
  });
});

describe("computeWasteEquivalents", () => {
  it("returns all zeros for zero input", () => {
    const result = computeWasteEquivalents(0);
    expect(result).toEqual({
      trash_bags: 0,
      bowling_balls: 0,
      water_bottles: 0,
    });
  });

  it("returns all zeros for negative input", () => {
    const result = computeWasteEquivalents(-5);
    expect(result).toEqual({
      trash_bags: 0,
      bowling_balls: 0,
      water_bottles: 0,
    });
  });

  it("computes trash_bags correctly (6.8 kg per bag)", () => {
    expect(computeWasteEquivalents(6.8).trash_bags).toBe(1);
    expect(computeWasteEquivalents(13.6).trash_bags).toBe(2);
  });

  it("computes bowling_balls correctly (6.35 kg per ball)", () => {
    expect(computeWasteEquivalents(6.35).bowling_balls).toBe(1);
  });

  it("computes water_bottles correctly (0.02 kg per bottle)", () => {
    expect(computeWasteEquivalents(0.02).water_bottles).toBe(1);
    expect(computeWasteEquivalents(1).water_bottles).toBe(50);
  });

  it("uses Math.round for all values", () => {
    // 15 kg: trash_bags = 15/6.8 = 2.21 -> 2
    // bowling_balls = 15/6.35 = 2.36 -> 2
    // water_bottles = 15/0.02 = 750
    const result = computeWasteEquivalents(15);
    expect(result.trash_bags).toBe(2);
    expect(result.bowling_balls).toBe(2);
    expect(result.water_bottles).toBe(750);
  });
});

describe("exported constants", () => {
  it("exports correct CO2 conversion constants", () => {
    expect(CO2_KG_PER_MILE).toBe(0.404);
    expect(CO2_KG_PER_PHONE_CHARGE).toBe(0.0079);
    expect(CO2_KG_PER_BULB_HOUR).toBe(0.043);
  });

  it("exports correct waste conversion constants", () => {
    expect(KG_PER_TRASH_BAG).toBe(6.8);
    expect(KG_PER_BOWLING_BALL).toBe(6.35);
    expect(KG_PER_WATER_BOTTLE).toBe(0.02);
  });
});
