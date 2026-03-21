import type { SortEvent, WasteCategory } from "./types";

export const heroMockData = {
  wasteDivertedKg: 12.4,
  recycledPercent: 68,
  co2SavedKg: 21,
  totalItemsSorted: 241,
} as const;

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Example item names per waste category.
 * Used for display in the live feed since the backend label is the category key.
 */
export const ITEM_NAMES: Readonly<Record<WasteCategory, readonly string[]>> = {
  paper_cardboard: ["Cardboard Box", "Newspaper", "Paper Cup"],
  metal_glass: ["Soda Can", "Glass Bottle", "Aluminum Foil"],
  plastic: ["Plastic Bottle", "Yogurt Cup", "Food Container"],
  trash: ["Candy Wrapper", "Styrofoam Tray", "Unknown Item"],
} as const;

/**
 * Create a timestamp string relative to now, offset by the given milliseconds.
 * Used to keep mock data timestamps fresh per session (per RESEARCH.md Pitfall 3).
 */
function relativeTimestamp(msAgo: number): string {
  return new Date(Date.now() - msAgo).toISOString();
}

/**
 * 10 mock sort events matching the backend EventResponse schema field-for-field.
 *
 * Notes:
 * - CO2 values are intentionally inflated (total ~59.5 kg) so tree badge shows ~3 trees
 * - All image_url fields are null (mock illustrations used instead per D-05)
 * - evt-005 and evt-009 are fallback items: confidence < 0.7, routed to trash (per D-04)
 * - Timestamps use Date.now() offsets to stay fresh per session (per RESEARCH.md Pitfall 3)
 */
export const sortEventsMockData: readonly SortEvent[] = [
  {
    id: "evt-001",
    timestamp: relativeTimestamp(2_000),
    label: "plastic",
    routed_bin: "plastic",
    confidence: 0.94,
    image_url: null,
    waste_diverted_kg: 0.08,
    co2_saved_kg: 8.5,
    fallback_used: false,
    source_device_id: "pi-001",
  },
  {
    id: "evt-002",
    timestamp: relativeTimestamp(5_000),
    label: "paper_cardboard",
    routed_bin: "paper_cardboard",
    confidence: 0.97,
    image_url: null,
    waste_diverted_kg: 0.15,
    co2_saved_kg: 7.2,
    fallback_used: false,
    source_device_id: "pi-001",
  },
  {
    id: "evt-003",
    timestamp: relativeTimestamp(14_000),
    label: "metal_glass",
    routed_bin: "metal_glass",
    confidence: 0.89,
    image_url: null,
    waste_diverted_kg: 0.25,
    co2_saved_kg: 9.8,
    fallback_used: false,
    source_device_id: "pi-001",
  },
  {
    id: "evt-004",
    timestamp: relativeTimestamp(31_000),
    label: "plastic",
    routed_bin: "plastic",
    confidence: 0.91,
    image_url: null,
    waste_diverted_kg: 0.08,
    co2_saved_kg: 6.4,
    fallback_used: false,
    source_device_id: "pi-001",
  },
  {
    id: "evt-005",
    timestamp: relativeTimestamp(59_000),
    label: "trash",
    routed_bin: "trash",
    confidence: 0.41,
    image_url: null,
    waste_diverted_kg: 0.12,
    co2_saved_kg: 0.0,
    fallback_used: true,
    source_device_id: "pi-001",
  },
  {
    id: "evt-006",
    timestamp: relativeTimestamp(2 * 60_000),
    label: "paper_cardboard",
    routed_bin: "paper_cardboard",
    confidence: 0.95,
    image_url: null,
    waste_diverted_kg: 0.15,
    co2_saved_kg: 7.8,
    fallback_used: false,
    source_device_id: "pi-001",
  },
  {
    id: "evt-007",
    timestamp: relativeTimestamp(5 * 60_000),
    label: "metal_glass",
    routed_bin: "metal_glass",
    confidence: 0.88,
    image_url: null,
    waste_diverted_kg: 0.25,
    co2_saved_kg: 8.2,
    fallback_used: false,
    source_device_id: "pi-001",
  },
  {
    id: "evt-008",
    timestamp: relativeTimestamp(12 * 60_000),
    label: "plastic",
    routed_bin: "plastic",
    confidence: 0.73,
    image_url: null,
    waste_diverted_kg: 0.08,
    co2_saved_kg: 5.1,
    fallback_used: false,
    source_device_id: "pi-001",
  },
  {
    id: "evt-009",
    timestamp: relativeTimestamp(30 * 60_000),
    label: "trash",
    routed_bin: "trash",
    confidence: 0.55,
    image_url: null,
    waste_diverted_kg: 0.12,
    co2_saved_kg: 0.0,
    fallback_used: true,
    source_device_id: "pi-001",
  },
  {
    id: "evt-010",
    timestamp: relativeTimestamp(45 * 60_000),
    label: "paper_cardboard",
    routed_bin: "paper_cardboard",
    confidence: 0.92,
    image_url: null,
    waste_diverted_kg: 0.15,
    co2_saved_kg: 6.5,
    fallback_used: false,
    source_device_id: "pi-001",
  },
] as const;
