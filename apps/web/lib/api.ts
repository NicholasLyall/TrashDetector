/**
 * API client configuration and shared fetcher for SWR.
 *
 * Uses NEXT_PUBLIC_API_URL env var (exposed to browser via NEXT_PUBLIC_ prefix).
 * Falls back to http://localhost:8000 for local development.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Typed fetch wrapper for SWR.
 * Receives a path (e.g., "/metrics"), prepends API_BASE_URL, returns parsed JSON.
 * Throws on non-ok responses with the HTTP status attached to the error.
 */
export async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    const error = new Error(
      `API request failed: ${res.status} ${res.statusText}`
    );
    (error as Error & { status: number }).status = res.status;
    throw error;
  }
  return res.json() as Promise<T>;
}
