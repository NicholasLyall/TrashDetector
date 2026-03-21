export const heroMockData = {
  wasteDivertedKg: 12.4,
  recycledPercent: 68,
  co2SavedKg: 21,
  totalItemsSorted: 241,
} as const;

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
