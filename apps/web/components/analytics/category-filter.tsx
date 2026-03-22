"use client";

import { CATEGORY_CONFIG } from "@/lib/categories";
import type { WasteCategory } from "@/lib/types";

interface CategoryFilterProps {
  readonly activeFilter: WasteCategory | "all";
  readonly onFilterChange: (filter: WasteCategory | "all") => void;
}

const FILTER_OPTIONS: readonly {
  readonly value: WasteCategory | "all";
  readonly label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "paper_cardboard", label: "Paper" },
  { value: "metal_glass", label: "Metal/Glass" },
  { value: "plastic", label: "Plastic" },
  { value: "trash", label: "Trash" },
] as const;

export function CategoryFilter({
  activeFilter,
  onFilterChange,
}: CategoryFilterProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Filter by category"
      className="flex flex-wrap gap-2"
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.value;
        const isCategory = option.value !== "all";
        const config = isCategory
          ? CATEGORY_CONFIG[option.value as WasteCategory]
          : undefined;

        const activeStyles =
          isActive && isCategory && config
            ? {
                backgroundColor: config.badgeBg,
                color: config.badgeColor,
                borderColor: config.badgeColor,
              }
            : undefined;

        const className = [
          "rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-colors",
          isActive && !isCategory
            ? "bg-emerald-50 text-emerald-700 border border-emerald-600"
            : "",
          isActive && isCategory ? "border" : "",
          !isActive
            ? "bg-muted text-muted-foreground border border-transparent"
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onFilterChange(option.value)}
            className={className}
            style={activeStyles}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
