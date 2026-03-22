import { CO2_PER_TREE_KG_PER_YEAR } from "@/lib/categories";

// --- CO2 Equivalents ---

/** EPA: average passenger vehicle emits 0.404 kg CO2 per mile (8.887 kg/gallon, 22 mpg). */
export const CO2_KG_PER_MILE = 0.404;

/** EPA: charging a smartphone produces approximately 0.0079 kg CO2. */
export const CO2_KG_PER_PHONE_CHARGE = 0.0079;

/** EPA: 1 hour of a 60W incandescent bulb produces approximately 0.043 kg CO2. */
export const CO2_KG_PER_BULB_HOUR = 0.043;

// --- Waste Equivalents ---

/** Average full kitchen trash bag weighs approximately 6.8 kg. */
export const KG_PER_TRASH_BAG = 6.8;

/** Standard bowling ball weighs approximately 6.35 kg (14 lbs). */
export const KG_PER_BOWLING_BALL = 6.35;

/** Empty PET water bottle weighs approximately 0.02 kg. */
export const KG_PER_WATER_BOTTLE = 0.02;

// --- Interfaces ---

export interface Co2Equivalents {
  readonly trees_yearly: number;
  readonly miles_driven: number;
  readonly phone_charges: number;
  readonly light_bulb_hours: number;
}

export interface WasteEquivalents {
  readonly trash_bags: number;
  readonly bowling_balls: number;
  readonly water_bottles: number;
}

// --- Computation Functions ---

/**
 * Convert CO2 savings in kg to tangible real-world equivalents.
 *
 * Conversions:
 * - trees_yearly: EPA standard, 1 tree absorbs 22 kg CO2/year
 * - miles_driven: EPA, avg vehicle emits 0.404 kg CO2/mile
 * - phone_charges: EPA, ~0.0079 kg CO2 per smartphone charge
 * - light_bulb_hours: EPA, ~0.043 kg CO2 per hour of 60W incandescent
 *
 * Returns all zeros for inputs <= 0. All values are Math.round, minimum 0.
 */
export function computeCo2Equivalents(co2_kg: number): Co2Equivalents {
  if (co2_kg <= 0) {
    return {
      trees_yearly: 0,
      miles_driven: 0,
      phone_charges: 0,
      light_bulb_hours: 0,
    };
  }

  return {
    trees_yearly: Math.max(0, Math.round(co2_kg / CO2_PER_TREE_KG_PER_YEAR)),
    miles_driven: Math.max(0, Math.round(co2_kg / CO2_KG_PER_MILE)),
    phone_charges: Math.max(0, Math.round(co2_kg / CO2_KG_PER_PHONE_CHARGE)),
    light_bulb_hours: Math.max(0, Math.round(co2_kg / CO2_KG_PER_BULB_HOUR)),
  };
}

/**
 * Convert waste diversion in kg to tangible real-world equivalents.
 *
 * Conversions:
 * - trash_bags: average full kitchen trash bag ~6.8 kg
 * - bowling_balls: standard bowling ball ~6.35 kg (14 lbs)
 * - water_bottles: empty PET bottle ~0.02 kg
 *
 * Returns all zeros for inputs <= 0. All values are Math.round, minimum 0.
 */
export function computeWasteEquivalents(waste_kg: number): WasteEquivalents {
  if (waste_kg <= 0) {
    return {
      trash_bags: 0,
      bowling_balls: 0,
      water_bottles: 0,
    };
  }

  return {
    trash_bags: Math.max(0, Math.round(waste_kg / KG_PER_TRASH_BAG)),
    bowling_balls: Math.max(0, Math.round(waste_kg / KG_PER_BOWLING_BALL)),
    water_bottles: Math.max(0, Math.round(waste_kg / KG_PER_WATER_BOTTLE)),
  };
}
