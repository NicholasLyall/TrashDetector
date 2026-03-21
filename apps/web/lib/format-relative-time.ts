/**
 * Relative time formatting using native Intl.RelativeTimeFormat.
 * Zero external dependencies (per RESEARCH.md).
 */

const rtf = new Intl.RelativeTimeFormat("en", {
  numeric: "always",
  style: "narrow",
});

const DIVISIONS: ReadonlyArray<{
  readonly amount: number;
  readonly unit: Intl.RelativeTimeFormatUnit;
}> = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
] as const;

/**
 * Format an ISO 8601 timestamp as a human-readable relative time string.
 *
 * Examples: "2 sec. ago", "5 min. ago", "1 hr. ago"
 *
 * @param dateStr - ISO 8601 timestamp string
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateStr: string): string {
  let seconds = Math.round(
    (new Date(dateStr).getTime() - Date.now()) / 1000
  );

  for (const division of DIVISIONS) {
    if (Math.abs(seconds) < division.amount) {
      return rtf.format(Math.round(seconds), division.unit);
    }
    seconds /= division.amount;
  }

  return rtf.format(Math.round(seconds), "week");
}
