/**
 * Frontend type definitions mirroring the backend EventResponse schema.
 *
 * Field names use snake_case to match the API response directly,
 * avoiding a camelCase transform layer (per RESEARCH.md Pitfall 1).
 */

/** The 4 valid waste categories matching backend VALID_CATEGORIES exactly. */
export type WasteCategory =
  | "paper_cardboard"
  | "metal_glass"
  | "plastic"
  | "trash";

/**
 * A single sort event from the backend GET /events endpoint.
 * All fields are readonly to enforce immutability.
 *
 * Mirrors backend apps/api/schemas.py EventResponse exactly.
 */
export interface SortEvent {
  readonly id: string;
  readonly timestamp: string; // ISO 8601
  readonly label: WasteCategory;
  readonly routed_bin: WasteCategory;
  readonly confidence: number; // 0-1 float
  readonly image_url: string | null;
  readonly waste_diverted_kg: number;
  readonly co2_saved_kg: number;
  readonly fallback_used: boolean;
  readonly source_device_id: string;
}

/**
 * GET /metrics response.
 * Mirrors backend apps/api/schemas.py MetricsResponse field-for-field.
 */
export interface MetricsData {
  readonly total_items: number;
  readonly recycling_rate: number;
  readonly co2_saved_kg: number;
  readonly waste_diverted_kg: number;
  readonly avg_confidence: number;
  readonly uncertain_rate: number;
  readonly fallback_rate: number;
}

/**
 * Single category entry in breakdown response.
 * Mirrors backend apps/api/schemas.py CategoryBreakdown.
 */
export interface CategoryBreakdown {
  readonly label: string;
  readonly count: number;
  readonly percentage: number;
}

/**
 * GET /metrics/breakdown response.
 * Mirrors backend apps/api/schemas.py BreakdownResponse.
 */
export interface BreakdownData {
  readonly categories: readonly CategoryBreakdown[];
}

/**
 * GET /devices response item.
 * Mirrors backend apps/api/schemas.py DeviceResponse field-for-field.
 */
export interface DeviceData {
  readonly id: string;
  readonly name: string;
  readonly location_name: string | null;
  readonly status: string;
  readonly created_at: string;
}
