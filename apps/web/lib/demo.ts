/**
 * Demo event trigger utility.
 *
 * Allows the presenter to trigger a sort event from the dashboard UI
 * without switching to a terminal. Sends a multipart POST to /events
 * with a random item from DEMO_ITEMS and a minimal valid PNG image.
 *
 * (D-01: demo events from dashboard UI)
 */

import type { WasteCategory } from "./types";
import { API_BASE_URL } from "./api";

interface DemoItem {
  readonly label: WasteCategory;
  readonly name: string;
  readonly confidence: number;
}

/**
 * 8 demo items covering all 4 waste categories (2 each).
 * All confidence values are above the 0.7 threshold so items route correctly.
 */
export const DEMO_ITEMS: readonly DemoItem[] = [
  { label: "plastic", name: "Plastic Bottle", confidence: 0.94 },
  { label: "plastic", name: "Yogurt Cup", confidence: 0.87 },
  { label: "paper_cardboard", name: "Cardboard Box", confidence: 0.97 },
  { label: "paper_cardboard", name: "Newspaper", confidence: 0.91 },
  { label: "metal_glass", name: "Soda Can", confidence: 0.89 },
  { label: "metal_glass", name: "Glass Bottle", confidence: 0.85 },
  { label: "trash", name: "Candy Wrapper", confidence: 0.78 },
  { label: "trash", name: "Styrofoam Tray", confidence: 0.72 },
] as const;

/**
 * Minimal 1x1 transparent PNG (67 bytes).
 * Used as the required image file for the backend POST /events endpoint.
 */
const MINIMAL_PNG_BYTES = new Uint8Array([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1,
  0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84,
  120, 156, 98, 0, 0, 0, 6, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69,
  78, 68, 174, 66, 96, 130,
]);

/**
 * Trigger a demo sort event by POSTing multipart form data to /events.
 *
 * Picks a random item from DEMO_ITEMS, creates a minimal PNG image blob,
 * and sends the request. Returns the backend response with event id and message.
 *
 * @throws Error if the backend request fails
 */
export async function triggerDemoEvent(): Promise<{
  readonly id: string;
  readonly message: string;
}> {
  const item = DEMO_ITEMS[Math.floor(Math.random() * DEMO_ITEMS.length)];

  const imageBlob = new Blob([MINIMAL_PNG_BYTES], { type: "image/png" });
  const imageFile = new File([imageBlob], "demo.png", { type: "image/png" });

  const formData = new FormData();
  formData.append("label", item.label);
  formData.append("confidence", String(item.confidence));
  formData.append("source_device_id", "demo-dashboard");
  formData.append("image", imageFile);

  const res = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Demo event failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<{ readonly id: string; readonly message: string }>;
}
