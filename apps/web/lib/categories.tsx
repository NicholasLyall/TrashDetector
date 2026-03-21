"use client";

import { FileText, Wine, Package, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WasteCategory, SortEvent } from "./types";

/** Configuration for displaying a waste category in the UI. */
export interface CategoryConfig {
  readonly displayLabel: string;
  readonly badgeColor: string;
  readonly badgeBg: string;
  readonly darkBadgeColor: string;
  readonly darkBadgeBg: string;
  readonly icon: LucideIcon;
}

/**
 * Category display configuration per D-01, D-02, D-03.
 *
 * - Display labels emphasize the environmental action (D-01)
 * - Badge colors: Blue/Amber/Green/Red families (D-02)
 * - Lucide icons per category (D-03)
 * - Dark mode values use +15-20 lightness for WCAG AA contrast
 */
export const CATEGORY_CONFIG = {
  paper_cardboard: {
    displayLabel: "Recycling (Paper)",
    badgeColor: "hsl(210 90% 40%)",
    badgeBg: "hsl(210 90% 40% / 0.12)",
    darkBadgeColor: "hsl(210 90% 60%)",
    darkBadgeBg: "hsl(210 90% 60% / 0.15)",
    icon: FileText,
  },
  metal_glass: {
    displayLabel: "Recycling (Metal)",
    badgeColor: "hsl(38 92% 45%)",
    badgeBg: "hsl(38 92% 45% / 0.12)",
    darkBadgeColor: "hsl(38 92% 60%)",
    darkBadgeBg: "hsl(38 92% 60% / 0.15)",
    icon: Wine,
  },
  plastic: {
    displayLabel: "Recycling (Plastic)",
    badgeColor: "hsl(142 71% 35%)",
    badgeBg: "hsl(142 71% 35% / 0.12)",
    darkBadgeColor: "hsl(142 71% 55%)",
    darkBadgeBg: "hsl(142 71% 55% / 0.15)",
    icon: Package,
  },
  trash: {
    displayLabel: "Landfill",
    badgeColor: "hsl(0 72% 45%)",
    badgeBg: "hsl(0 72% 45% / 0.12)",
    darkBadgeColor: "hsl(0 72% 60%)",
    darkBadgeBg: "hsl(0 72% 60% / 0.15)",
    icon: Trash2,
  },
} as const satisfies Record<WasteCategory, CategoryConfig>;

/**
 * EPA standard: 1 mature tree absorbs approximately 22 kg of CO2 per year.
 * Source: EPA Greenhouse Gas Equivalencies Calculator (D-12).
 */
export const CO2_PER_TREE_KG_PER_YEAR = 22;

/**
 * Calculate the number of trees equivalent to the total CO2 saved.
 *
 * IMPORTANT (D-10): This function is a pure calculation and does NOT filter by
 * date. The caller is responsible for passing only today-scoped events to
 * enforce the daily reset behavior specified in D-10. When Phase 6 wires real
 * data, the LiveFeedSection caller must filter events to today's date before
 * passing them to this function.
 *
 * @param events - Array of objects with co2_saved_kg field (today-scoped by caller)
 * @returns Number of tree equivalents, rounded, minimum 0
 */
export function calculateTreesEquivalent(
  events: ReadonlyArray<Pick<SortEvent, "co2_saved_kg">>
): number {
  const totalCo2 = events.reduce((sum, event) => sum + event.co2_saved_kg, 0);
  return Math.max(0, Math.round(totalCo2 / CO2_PER_TREE_KG_PER_YEAR));
}

/**
 * CategoryBadge renders a color-coded pill badge with a Lucide icon
 * and the category display label.
 */
export function CategoryBadge({
  category,
}: {
  readonly category: WasteCategory;
}) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: config.badgeBg,
        color: config.badgeColor,
      }}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.displayLabel}
    </span>
  );
}
