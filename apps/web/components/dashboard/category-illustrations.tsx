"use client";

import type { WasteCategory } from "@/lib/types";

interface CategoryIllustrationProps {
  readonly category: WasteCategory;
  readonly size?: "lg" | "sm";
}

const BACKGROUND_FILL = "hsl(200 20% 95%)";

/** Stacked papers / cardboard box illustration. */
function PaperIllustration() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="h-full w-full">
      <circle cx="60" cy="60" r="56" fill={BACKGROUND_FILL} />
      {/* Cardboard box body */}
      <rect x="30" y="45" width="60" height="40" rx="3" fill="hsl(30 40% 50%)" />
      {/* Box highlight */}
      <rect x="34" y="49" width="52" height="32" rx="2" fill="hsl(35 50% 75%)" />
      {/* Box flaps */}
      <polygon points="30,45 45,30 75,30 90,45" fill="hsl(30 40% 50%)" />
      <polygon points="45,30 60,38 75,30" fill="hsl(35 50% 75%)" />
      {/* Paper sheets sticking out */}
      <rect x="40" y="34" width="18" height="24" rx="1" fill="hsl(45 30% 90%)" />
      <rect x="44" y="38" width="18" height="24" rx="1" fill="hsl(45 20% 95%)" />
      {/* Paper lines */}
      <rect x="46" y="44" width="12" height="2" rx="1" fill="hsl(35 20% 75%)" />
      <rect x="46" y="49" width="10" height="2" rx="1" fill="hsl(35 20% 75%)" />
      <rect x="46" y="54" width="8" height="2" rx="1" fill="hsl(35 20% 75%)" />
    </svg>
  );
}

/** Glass bottle / soda can illustration. */
function MetalGlassIllustration() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="h-full w-full">
      <circle cx="60" cy="60" r="56" fill={BACKGROUND_FILL} />
      {/* Bottle body */}
      <rect x="42" y="50" width="36" height="45" rx="4" fill="hsl(174 50% 70%)" />
      {/* Bottle neck */}
      <rect x="52" y="28" width="16" height="22" rx="3" fill="hsl(174 50% 70%)" />
      {/* Bottle cap */}
      <rect x="54" y="24" width="12" height="6" rx="2" fill="hsl(0 0% 75%)" />
      {/* Bottle label */}
      <rect x="46" y="60" width="28" height="16" rx="2" fill="hsl(0 0% 95%)" />
      {/* Highlight reflection */}
      <rect x="68" y="52" width="4" height="30" rx="2" fill="hsl(174 50% 80%)" opacity="0.6" />
      {/* Soda can beside */}
      <rect x="28" y="62" width="18" height="30" rx="9" fill="hsl(0 0% 75%)" />
      <rect x="30" y="72" width="14" height="10" rx="2" fill="hsl(0 0% 85%)" />
    </svg>
  );
}

/** Plastic bottle illustration. */
function PlasticIllustration() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="h-full w-full">
      <circle cx="60" cy="60" r="56" fill={BACKGROUND_FILL} />
      {/* Bottle body */}
      <rect x="40" y="48" width="40" height="48" rx="6" fill="hsl(199 60% 70%)" />
      {/* Bottle neck */}
      <rect x="50" y="28" width="20" height="20" rx="4" fill="hsl(199 60% 70%)" />
      {/* Bottle cap */}
      <rect x="52" y="22" width="16" height="8" rx="3" fill="hsl(199 89% 48%)" />
      {/* Label */}
      <rect x="44" y="60" width="32" height="18" rx="2" fill="hsl(199 89% 48%)" opacity="0.8" />
      {/* Recycle arrows on label */}
      <polygon points="56,64 64,64 60,68" fill="hsl(199 60% 90%)" />
      <polygon points="56,74 64,74 60,70" fill="hsl(199 60% 90%)" />
      {/* Highlight */}
      <rect x="70" y="50" width="4" height="36" rx="2" fill="hsl(199 60% 80%)" opacity="0.5" />
    </svg>
  );
}

/** Trash bag illustration. */
function TrashIllustration() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="h-full w-full">
      <circle cx="60" cy="60" r="56" fill={BACKGROUND_FILL} />
      {/* Bag body */}
      <ellipse cx="60" cy="70" rx="30" ry="28" fill="hsl(0 0% 40%)" />
      {/* Bag tie knot */}
      <path d="M48,42 Q52,35 60,38 Q68,35 72,42 L68,48 Q64,44 60,46 Q56,44 52,48 Z" fill="hsl(0 0% 40%)" />
      {/* Bag wrinkle lines */}
      <path d="M42,60 Q50,56 60,62 Q70,56 78,60" fill="none" stroke="hsl(0 0% 50%)" strokeWidth="1.5" opacity="0.5" />
      <path d="M40,72 Q50,68 60,74 Q70,68 80,72" fill="none" stroke="hsl(0 0% 50%)" strokeWidth="1.5" opacity="0.5" />
      {/* Bag highlight */}
      <ellipse cx="50" cy="65" rx="8" ry="12" fill="hsl(0 0% 60%)" opacity="0.3" />
    </svg>
  );
}

const ILLUSTRATION_MAP: Record<WasteCategory, () => React.JSX.Element> = {
  paper_cardboard: PaperIllustration,
  metal_glass: MetalGlassIllustration,
  plastic: PlasticIllustration,
  trash: TrashIllustration,
};

const SIZE_CLASSES = {
  lg: "h-[200px] w-[200px]",
  sm: "h-[40px] w-[40px]",
} as const;

/**
 * Renders a flat SVG illustration for each waste category.
 * Supports two sizes: lg (200px for latest item) and sm (40px for recent items).
 * Shows a "Simulated" badge on large size per D-08.
 */
export function CategoryIllustration({
  category,
  size = "lg",
}: CategoryIllustrationProps) {
  const Illustration = ILLUSTRATION_MAP[category];

  return (
    <div className={`relative ${SIZE_CLASSES[size]} flex-shrink-0`}>
      <Illustration />
      {size === "lg" && (
        <span className="absolute bottom-1 right-1 rounded bg-gray-500/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          Simulated
        </span>
      )}
    </div>
  );
}
