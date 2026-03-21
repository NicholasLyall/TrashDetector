# Phase 3: Live Feed Components - Research

**Researched:** 2026-03-21
**Domain:** React component architecture, SVG illustrations, relative time formatting, mock data design
**Confidence:** HIGH

## Summary

Phase 3 builds the live feed section of the dashboard homepage -- the second most prominent visual element after the hero section. This phase creates static components with mock data; live polling and backend wiring are deferred to Phase 6. The phase requires: a large "latest sorted item" card with image preview, a recent activity list with thumbnails, color-coded bin badges, confidence scores, relative timestamps, a green status dot, and a "trees planted" environmental badge.

The existing codebase provides strong foundations: shadcn/ui Card, Badge, and Avatar components; a centralized mock-data module; CSS variables for the eco palette; and established component patterns from Phase 2 (hero section). The primary technical challenges are: (1) designing flat SVG category illustrations that match the hero illustration style, (2) implementing relative time formatting without adding dependencies, and (3) structuring the mock event data to mirror the backend API shape for clean Phase 6 swap.

**Primary recommendation:** Build 3-4 focused components in `components/dashboard/` using existing shadcn primitives, extend `lib/mock-data.ts` with typed sort event data matching the API spec, use native `Intl.RelativeTimeFormat` for timestamps, and create inline SVG illustrations per category.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Bin-style display labels that emphasize the environmental action: "Recycling (Paper)", "Recycling (Metal)", "Recycling (Plastic)", "Landfill"
- **D-02:** 4 distinct badge colors -- Blue for Paper & Cardboard, Amber for Metal & Glass, Green for Plastic, Red for Landfill
- **D-03:** Each category gets a Lucide icon paired with a colored badge (e.g., FileText for Paper, Beer/Wine for Metal & Glass, Package for Plastic, Trash2 for Landfill)
- **D-04:** Fallback items (confidence < 0.7, routed to trash) show as normal Landfill items with no special treatment -- avoids drawing attention to model uncertainty
- **D-05:** Category illustration icons -- one flat SVG per category (paper stack, glass bottle, plastic bottle, trash bag) instead of real Pi photos
- **D-06:** Illustration style matches the hero section (flat, eco-themed, same palette as sky/clouds/leaves) for visual consistency
- **D-07:** Same illustration used for both the large latest-item preview and smaller recent-items thumbnails, rendered at different sizes
- **D-08:** Subtle "Simulated" badge on images (small gray tag in corner) so it's clear this is demo data -- removable when real photos arrive
- **D-09:** 8-10 mock events in the feed to fill the list and feel active without overwhelming
- **D-10:** Scope is today's daily impact, matching the hero section's daily scoping (Phase 2 D-03) -- resets daily
- **D-11:** Positioned below the "Live Feed" header, beside the green status dot -- always visible, matches mockup layout
- **D-12:** EPA standard conversion: 1 tree absorbs ~22 kg CO2/year. Formula: trees = total_co2_saved_today / 22
- **D-13:** Trees only -- no rotating equivalents. Other equivalents (miles driven, water saved) deferred to Impact page (Phase 8)

### Claude's Discretion
- Exact SVG illustration designs per category
- Specific Lucide icon choices per category (suggestions above are starting points)
- Recent items list scrollable behavior and max visible count
- Empty/loading state design
- Exact badge color hex/HSL values within the blue/amber/green/red families
- Card sizing, spacing, and responsive breakpoints
- Animation on new item appearance
- Confidence score display format (e.g., "94%" vs "0.94")

### Deferred Ideas (OUT OF SCOPE)
- Rotating environmental equivalents (miles driven, water saved, trash bags) -- Phase 8 Impact page
- Live polling / auto-refresh -- Phase 6 Data Integration
- Real Pi photos replacing mock illustrations -- Phase 6+ when Pi is connected
- Count-up animation on tree equivalence number -- Phase 10 Visual Polish
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DASH-03 | Dashboard homepage displays prominent live feed section with latest sorted item | Layout pattern from mockup reference; Card component for container; `page.tsx` integration point identified |
| FEED-01 | Live feed shows the latest sorted item with large image preview | SVG category illustrations (D-05/D-06); large Card with image area; mock event data with image references |
| FEED-02 | Live feed shows item label, color-coded bin badge, and confidence score | Badge component with custom color variants (D-02); category config map pattern; confidence format as percentage |
| FEED-03 | Live feed shows relative timestamp for each item | Native `Intl.RelativeTimeFormat` -- zero dependencies; helper in mock-data or dedicated utils |
| FEED-04 | Live feed shows a recent activity list with thumbnails, name, confidence, badge, and timestamp | Scrollable list component; Avatar for thumbnails or sized-down SVG illustrations; compact row layout |
| FEED-05 | Live feed highlights newest event with green status dot indicator | Green dot next to "Live Feed" header; CSS `bg-green-500` with pulse animation; `prefers-reduced-motion` respect |
| FEED-07 | Live feed displays "Equivalent to planting X trees" environmental translation badge | EPA formula (D-12): `trees = co2_saved_today / 22`; TreePine icon from lucide-react; positioned per D-11 |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | Component framework | Already installed, project standard |
| Next.js | 16.2.1 | App framework | Already installed, project standard |
| TypeScript | ^5 | Type safety | Already installed, project standard |
| Tailwind CSS | ^4 | Styling | Already installed, CSS-first v4 config |
| shadcn/ui | ^4.1.0 | UI primitives | Already installed, Card/Badge/Avatar available |
| lucide-react | 0.577.0 | Icons | Already installed, all needed icons verified available |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | 0.7.1 | Badge variants | Already used by Badge component for variant-based styling |
| clsx + tailwind-merge | 2.1.1 / 3.5.0 | Class composition | Already used via `cn()` utility |
| tw-animate-css | 1.4.0 | Animations | Already installed for CSS transitions |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native Intl.RelativeTimeFormat | date-fns formatDistanceToNow | date-fns adds ~7kb; native API is sufficient for "Xs ago" format; zero-dep is better for hackathon |
| Inline SVG illustrations | External SVG files or SVGR | Inline matches hero-illustration.tsx pattern; no build config needed; full style control |
| Custom badge colors | New shadcn Badge variants | Custom className approach is simpler than modifying CVA config; matches existing pattern |

**Installation:**
```bash
# No new dependencies needed -- all required packages already installed
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/
├── components/
│   ├── dashboard/
│   │   ├── hero-impact-section.tsx     # Existing (Phase 2)
│   │   ├── hero-illustration.tsx       # Existing (Phase 2)
│   │   ├── live-feed-section.tsx       # NEW: Container with header, status dot, tree badge
│   │   ├── latest-item-card.tsx        # NEW: Large preview card for most recent event
│   │   ├── recent-items-list.tsx       # NEW: Scrollable list of recent events
│   │   └── category-illustrations.tsx  # NEW: SVG illustrations per waste category
│   └── ui/
│       ├── card.tsx                    # Existing
│       ├── badge.tsx                   # Existing
│       └── avatar.tsx                  # Existing
├── lib/
│   ├── mock-data.ts                   # EXTEND: Add sortEventsMockData array
│   ├── categories.ts                  # NEW: Category config (colors, icons, labels, illustrations)
│   ├── format-relative-time.ts        # NEW: Intl.RelativeTimeFormat helper
│   └── utils.ts                       # Existing cn() utility
└── app/
    ├── page.tsx                        # MODIFY: Add LiveFeedSection below HeroImpactSection
    └── globals.css                     # EXTEND: Add pulse animation, badge color variables
```

### Pattern 1: Category Configuration Map
**What:** A readonly configuration object mapping backend category strings to display metadata (label, color, icon, illustration).
**When to use:** Anywhere a category needs visual representation -- badges, illustrations, charts.
**Example:**
```typescript
// Source: Project-specific pattern based on D-01, D-02, D-03 decisions
import { FileText, Wine, Package, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryConfig {
  readonly displayLabel: string;
  readonly badgeColor: string;
  readonly badgeBg: string;
  readonly icon: LucideIcon;
}

export const CATEGORY_CONFIG = {
  paper_cardboard: {
    displayLabel: "Recycling (Paper)",
    badgeColor: "hsl(210 90% 40%)",      // Blue
    badgeBg: "hsl(210 90% 40% / 0.12)",
    icon: FileText,
  },
  metal_glass: {
    displayLabel: "Recycling (Metal)",
    badgeColor: "hsl(38 92% 50%)",        // Amber
    badgeBg: "hsl(38 92% 50% / 0.12)",
    icon: Wine,
  },
  plastic: {
    displayLabel: "Recycling (Plastic)",
    badgeColor: "hsl(142 71% 40%)",       // Green
    badgeBg: "hsl(142 71% 40% / 0.12)",
    icon: Package,
  },
  trash: {
    displayLabel: "Landfill",
    badgeColor: "hsl(0 72% 51%)",         // Red
    badgeBg: "hsl(0 72% 51% / 0.12)",
    icon: Trash2,
  },
} as const satisfies Record<string, CategoryConfig>;

export type WasteCategory = keyof typeof CATEGORY_CONFIG;
```

### Pattern 2: Mock Event Data Matching API Shape
**What:** Mock data typed to mirror the backend GET /events response shape, enabling clean swap to live data in Phase 6.
**When to use:** Whenever creating mock data that will later be replaced by API calls.
**Example:**
```typescript
// Source: docs/API_SPEC.md GET /events response + docs/DATA_MODEL.md
export interface SortEvent {
  readonly id: string;
  readonly timestamp: string;        // ISO 8601
  readonly label: WasteCategory;
  readonly routed_bin: WasteCategory;
  readonly confidence: number;
  readonly image_url: string | null;  // null for mock, URL for live
  readonly waste_diverted_kg: number;
  readonly co2_saved_kg: number;
  readonly fallback_used: boolean;
  readonly source_device_id: string;
}
```

### Pattern 3: Relative Time Formatting (Zero Dependencies)
**What:** A utility function using the native `Intl.RelativeTimeFormat` API to produce "2s ago", "14s ago", "5m ago" strings.
**When to use:** For FEED-03 relative timestamps in feed items.
**Example:**
```typescript
// Source: MDN Intl.RelativeTimeFormat documentation
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always", style: "narrow" });

const DIVISIONS: ReadonlyArray<{ readonly amount: number; readonly unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
] as const;

export function formatRelativeTime(dateStr: string): string {
  let seconds = Math.round((new Date(dateStr).getTime() - Date.now()) / 1000);
  for (const division of DIVISIONS) {
    if (Math.abs(seconds) < division.amount) {
      return rtf.format(Math.round(seconds), division.unit);
    }
    seconds /= division.amount;
  }
  return rtf.format(Math.round(seconds), "week");
}
```

### Pattern 4: Component Composition with Shared Config
**What:** LiveFeedSection as the container component that passes category config and events to child components.
**When to use:** When multiple child components need the same data context.
**Example:**
```typescript
// LiveFeedSection composes LatestItemCard + RecentItemsList
export function LiveFeedSection() {
  const events = sortEventsMockData;
  const latestEvent = events[0];
  const recentEvents = events.slice(1);
  const treesEquivalent = calculateTreesEquivalent(events);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
          <CardTitle>Live Feed</CardTitle>
          <TreeBadge trees={treesEquivalent} />
        </div>
      </CardHeader>
      <CardContent>
        {latestEvent && <LatestItemCard event={latestEvent} />}
        <RecentItemsList events={recentEvents} />
      </CardContent>
    </Card>
  );
}
```

### Anti-Patterns to Avoid
- **Embedding color values in components:** Use the category config map; never hardcode "blue" or "green" inside JSX. When categories change, only one file updates.
- **Using `Date.now()` inside render without state:** For relative timestamps, either pre-compute at data creation time or use a `useMemo` with a dependency -- not inline `Date.now()` which changes every render.
- **Mutating mock data arrays:** Always use spread or `Array.from()` to derive subsets; never `.sort()` or `.splice()` in place.
- **Oversized SVG illustrations:** Keep each category SVG under 30 lines. The hero illustration (236 lines) is a full scene; category icons should be simple flat shapes.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Relative time strings | Custom math + string concat | `Intl.RelativeTimeFormat` | Built into every browser, handles localization, tested at engine level |
| Badge variants | New CVA variants in badge.tsx | Custom `className` via `cn()` | Simpler, doesn't modify shared component, matches hero-impact-section.tsx pattern |
| Scrollable container | Custom scroll + overflow logic | `overflow-y-auto max-h-[value]` | Tailwind handles it; no JS needed for scroll behavior |
| Status dot animation | JavaScript-driven animation | CSS `animate-pulse` from Tailwind | Already available via tw-animate-css, GPU-accelerated |
| Color-coded badges | Multiple Badge component variants | Badge with inline `style` or `className` | 4 categories with distinct colors -- className approach is minimal and direct |

**Key insight:** This phase is purely presentational. Every "interaction" (scroll, highlight) is CSS-only. No custom JavaScript behaviors, no state management beyond mock data constants, no effects or refs.

## Common Pitfalls

### Pitfall 1: Mock Data Shape Drift
**What goes wrong:** Mock data uses different field names or types than the backend API, causing rework in Phase 6 integration.
**Why it happens:** Frontend developer invents convenient field names without checking API_SPEC.md.
**How to avoid:** Define a `SortEvent` interface that exactly mirrors the GET /events response shape from `docs/API_SPEC.md`. Use `label` not `category`, `routed_bin` not `bin`, `confidence` as 0-1 float not percentage.
**Warning signs:** Field names in TypeScript types don't match the Python schema field names in the backend.

### Pitfall 2: Dark Mode Badge Colors
**What goes wrong:** Color-coded badges (blue, amber, green, red) look great in light mode but are invisible or washed out in dark mode.
**Why it happens:** Using fixed HSL values without adjusting lightness for dark backgrounds.
**How to avoid:** Test each badge color against both `--card` backgrounds (white in light, oklch(0.205) in dark). Use slightly higher lightness values in dark mode, or use `bg-opacity` pattern that auto-adapts.
**Warning signs:** Badge text/background contrast ratio below 4.5:1 WCAG AA.

### Pitfall 3: Stale Relative Timestamps
**What goes wrong:** Relative timestamps show "2s ago" but never update because mock data has fixed timestamps.
**Why it happens:** Mock data uses hardcoded ISO strings from the past. As time passes, "2s ago" becomes "3h ago".
**How to avoid:** Generate mock timestamps relative to `Date.now()` at module load time (e.g., `new Date(Date.now() - 2000).toISOString()`). This keeps timestamps fresh for the current session.
**Warning signs:** Feed items show "2h ago" or "1d ago" instead of seconds/minutes on a fresh page load.

### Pitfall 4: SVG Illustration Sizing Issues
**What goes wrong:** Category SVG illustrations look pixelated when scaled up for the latest-item preview or tiny details disappear at thumbnail size.
**Why it happens:** SVG viewBox is too tight or too loose; stroke widths don't scale well.
**How to avoid:** Design illustrations at a comfortable viewBox (e.g., `0 0 120 120`), use `fill` not `stroke` for primary shapes, and test at both large (200px) and small (40px) render sizes as required by D-07.
**Warning signs:** Fine lines disappear at thumbnail size; shapes look blurry at large sizes.

### Pitfall 5: Layout Mismatch with Mockup Grid
**What goes wrong:** Live feed takes full width instead of sharing the row with waste composition and model performance cards (which come in Phase 4).
**Why it happens:** Building Phase 3 without considering Phase 4's adjacent cards.
**How to avoid:** Use a responsive grid layout (`grid grid-cols-1 lg:grid-cols-5`) where the live feed takes `lg:col-span-3` and the right column (Phases 4) takes `lg:col-span-2`. Leave the right column empty for now.
**Warning signs:** Phase 4 requires restructuring the grid layout to accommodate side-by-side cards.

## Code Examples

Verified patterns from the existing codebase:

### Extending Mock Data Module
```typescript
// Source: apps/web/lib/mock-data.ts (extend existing module)
// Follows existing pattern: exported const + as const for immutability

export const sortEventsMockData: readonly SortEvent[] = [
  {
    id: "evt-001",
    timestamp: new Date(Date.now() - 2_000).toISOString(),     // 2s ago
    label: "plastic",
    routed_bin: "plastic",
    confidence: 0.92,
    image_url: null,
    waste_diverted_kg: 0.03,
    co2_saved_kg: 0.05,
    fallback_used: false,
    source_device_id: "pi-001",
  },
  // ... 7-9 more events with varied categories and timestamps
] as const;
```

### Category Badge Rendering
```typescript
// Source: Pattern derived from hero-impact-section.tsx inline style approach
function CategoryBadge({ category }: { readonly category: WasteCategory }) {
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
```

### Trees Environmental Badge
```typescript
// Source: D-12 EPA formula + TreePine icon from lucide-react
import { TreePine } from "lucide-react";

const CO2_PER_TREE_KG_PER_YEAR = 22;

function calculateTreesEquivalent(events: readonly SortEvent[]): number {
  const totalCo2 = events.reduce((sum, e) => sum + e.co2_saved_kg, 0);
  return Math.max(0, Math.round(totalCo2 / CO2_PER_TREE_KG_PER_YEAR));
}

function TreeBadge({ trees }: { readonly trees: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <TreePine className="h-4 w-4 text-[hsl(var(--eco-green))]" aria-hidden="true" />
      <span>Equivalent to planting <strong className="text-foreground">{trees}</strong> trees</span>
    </span>
  );
}
```

### Green Status Dot with Pulse
```typescript
// Source: Pattern from Tailwind animate-pulse + reduced-motion support in globals.css
<span className="relative flex h-2.5 w-2.5">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75 motion-reduce:hidden" />
  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
</span>
```

### Simulated Badge (D-08)
```typescript
// Source: D-08 decision -- subtle gray corner tag on mock images
<span className="absolute bottom-1 right-1 rounded bg-gray-500/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
  Simulated
</span>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| date-fns for relative time | Native `Intl.RelativeTimeFormat` | Widely supported since 2020+ | No dependency needed; ~7KB savings |
| Custom icon SVGs or icon fonts | lucide-react tree-shakable components | 2023+ standard | Each icon is a standalone import; no font loading |
| CSS Modules for scoped styles | Tailwind CSS v4 with CSS-first config | 2024-2025 | `@import` syntax, `@theme` blocks, no tailwind.config.js |
| Manual dark mode classes | oklch color space with CSS variables | shadcn v4 (2025) | Single variable definition covers both themes |

**Deprecated/outdated:**
- `moment.js` for date formatting -- replaced by Intl APIs or date-fns
- `tailwind.config.js` -- Tailwind v4 uses CSS-first `@theme` blocks (this project already uses v4)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed -- needs setup in Wave 0 |
| Config file | None -- see Wave 0 |
| Quick run command | `npx vitest run --reporter=verbose` (after setup) |
| Full suite command | `npx vitest run` (after setup) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DASH-03 | Live feed section renders on dashboard page | smoke | `npx vitest run tests/dashboard-page.test.tsx -t "live feed"` | No -- Wave 0 |
| FEED-01 | Latest item card renders with image preview | unit | `npx vitest run tests/latest-item-card.test.tsx` | No -- Wave 0 |
| FEED-02 | Category badge renders correct label, color, icon | unit | `npx vitest run tests/category-badge.test.tsx` | No -- Wave 0 |
| FEED-03 | Relative timestamp formats correctly | unit | `npx vitest run tests/format-relative-time.test.ts` | No -- Wave 0 |
| FEED-04 | Recent items list renders thumbnails and metadata | unit | `npx vitest run tests/recent-items-list.test.tsx` | No -- Wave 0 |
| FEED-05 | Green status dot renders with pulse animation class | unit | `npx vitest run tests/live-feed-section.test.tsx -t "status dot"` | No -- Wave 0 |
| FEED-07 | Trees badge displays correct calculation | unit | `npx vitest run tests/tree-badge.test.tsx` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Install vitest + @testing-library/react + @testing-library/jest-dom + jsdom
- [ ] Create `vitest.config.ts` with jsdom environment and path aliases
- [ ] `tests/format-relative-time.test.ts` -- covers FEED-03 (pure utility, no React)
- [ ] `tests/category-config.test.ts` -- covers FEED-02 (validates all 4 categories have required fields)
- [ ] Test utilities/setup file for React component rendering

## Open Questions

1. **Responsive breakpoint for two-column layout**
   - What we know: Mockup shows live feed left (~60%) and waste composition right (~40%) in a two-column layout on desktop.
   - What's unclear: Exact breakpoint. The mockup is a single-size render.
   - Recommendation: Use `lg:` (1024px) as the two-column breakpoint, stack vertically below. This matches standard SaaS dashboard patterns and the Phase 4 right column will slot in naturally.

2. **Maximum visible recent items before scrolling**
   - What we know: D-09 says 8-10 mock events. The first is the "latest" card, leaving 7-9 for the recent list. Mockup shows ~4 visible at once.
   - What's unclear: Whether to show all and scroll, or cap the visible count.
   - Recommendation: Show 4-5 visible items with `overflow-y-auto max-h-[320px]` so the section doesn't dominate the page. All 7-9 items are scrollable.

3. **Tree equivalence calculation with small mock data**
   - What we know: EPA formula (D-12): trees = co2_saved_today / 22. With 8-10 mock events at ~0.05 kg CO2 each, total is ~0.5 kg. That's 0.02 trees, which rounds to 0.
   - What's unclear: Should we inflate mock CO2 values to make the tree count meaningful?
   - Recommendation: Use inflated mock values so the tree badge shows a non-zero number (e.g., 2-3 trees). The mock data is throwaway anyway, and showing "0 trees" defeats the emotional purpose of the badge.

## Sources

### Primary (HIGH confidence)
- Existing codebase files (hero-impact-section.tsx, hero-illustration.tsx, mock-data.ts, globals.css, page.tsx) -- direct pattern references
- docs/API_SPEC.md, docs/DATA_MODEL.md, docs/UI_UX_SPEC.md -- canonical data shapes and layout spec
- Dashboard mockup (docs/dashboard-reference.png) -- visual reference for layout and styling
- Phase 2 CONTEXT.md and Phase 5 CONTEXT.md -- cross-phase decisions (daily scoping, category definitions)

### Secondary (MEDIUM confidence)
- [MDN Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) -- native API documentation
- [Lucide Icons reference](https://lucide.dev/icons/) -- icon availability verified locally against `node_modules/lucide-react/dist/esm/icons/`
- [Builder.io relative time article](https://www.builder.io/blog/relative-time) -- implementation pattern for Intl.RelativeTimeFormat helper

### Tertiary (LOW confidence)
- None -- all findings verified against existing code or official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and verified; no new dependencies
- Architecture: HIGH -- follows established Phase 2 patterns; component structure derived from mockup analysis
- Pitfalls: HIGH -- identified from actual codebase inspection (dark mode variables, mock data patterns, grid layout)
- Mock data design: HIGH -- API spec and data model docs provide exact field names and types
- SVG illustrations: MEDIUM -- design decisions are Claude's discretion; style direction clear from hero-illustration.tsx but exact designs need creation

**Research date:** 2026-03-21
**Valid until:** 2026-04-20 (stable -- no external dependencies to track)
