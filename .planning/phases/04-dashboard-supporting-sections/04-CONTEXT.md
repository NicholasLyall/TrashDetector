# Phase 4: Dashboard Supporting Sections - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete the dashboard homepage with waste breakdown chart, model performance card, KPI strip in the top bar, and sorting history. All sections use mock data computed from the existing 10 `sortEventsMockData` entries. Must look cohesive with the existing hero (Phase 2) and live feed (Phase 3).

</domain>

<decisions>
## Implementation Decisions

### Waste Composition Chart
- **D-01:** Donut chart (Recharts `PieChart` with `innerRadius`) — not pie, not bar
- **D-02:** Center text shows total items count (e.g., "241 items")
- **D-03:** Legend below the chart — color dots + category name + percentage
- **D-04:** Use the 4 existing category badge colors from `CATEGORY_CONFIG` (blue=paper, amber=metal, green=plastic, red=trash)
- **D-05:** Include "View Full Analytics →" link at card bottom, pointing to `/analytics` (page built in Phase 7)

### KPI Strip
- **D-06:** KPI chips live in the top navigation bar (not a standalone section) — matches the dashboard mockup
- **D-07:** 4 chips: Total Items, Recycling Rate, Avg Confidence, Fallback Rate
- **D-08:** Values computed from `sortEventsMockData` (same source as live feed)

### Model Performance Card
- **D-09:** 3 metrics in a row: Avg Confidence (green checkmark icon), Uncertain Rate (amber question mark icon), Fallback Rate (red trash icon)
- **D-10:** Segmented horizontal bar showing confidence distribution: LOW (<50%) | MEDIUM (50–80%) | HIGH (>80%)
- **D-11:** Segmented bar color: red for LOW, amber for MEDIUM, green for HIGH
- **D-12:** No "Confidence Distribution →" link for now — model page doesn't exist yet (Phase 9)

### Sorting History
- **D-13:** Recent sorting history reuses the existing `RecentItemsList` component from Phase 3
- **D-14:** Or a separate full-width table/list if the existing component doesn't fit the layout context

### Claude's Discretion
- KPI chip visual style (size, padding, typography)
- Model performance card internal spacing
- Whether sorting history is a separate section or part of the live feed card
- Exact donut chart dimensions and animation

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Dashboard mockup
- `docs/dashboard-reference.png` — Visual reference for layout, KPI placement, chart style, model card layout

### Existing components and data
- `apps/web/app/page.tsx` — Current dashboard page with Phase 4 placeholder comment at line 13
- `apps/web/lib/mock-data.ts` — 10 mock SortEvent objects (source for all computed metrics)
- `apps/web/lib/categories.tsx` — CATEGORY_CONFIG with badge colors (reuse for chart segment colors)
- `apps/web/lib/types.ts` — SortEvent interface with confidence, fallback_used, label fields
- `apps/web/components/dashboard/recent-items-list.tsx` — Existing recent items component (potential reuse for D-13)

### Layout context
- `apps/web/components/dashboard/hero-impact-section.tsx` — Hero card pattern (StatCard, icon+value+label)
- `apps/web/components/dashboard/live-feed-section.tsx` — Card pattern with ring-1 ring-foreground/5

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CATEGORY_CONFIG` in categories.tsx: has `badgeColor` and `badgeBg` per category — reuse for donut chart segment colors
- `sortEventsMockData` in mock-data.ts: 10 events with confidence/fallback data — compute all metrics from this
- `formatNumber` in mock-data.ts: number formatting utility
- `CategoryBadge` component: can be used in sorting history rows
- `RecentItemsList` component: potential direct reuse for sorting history

### Established Patterns
- Cards use `ring-1 ring-foreground/5` for subtle borders
- `"use client"` directive on interactive components
- shadcn `Card` component wraps all sections
- Lucide icons for all iconography
- HSL color values with dark mode variants

### Integration Points
- `page.tsx` line 13: commented placeholder `{/* Phase 4 will add waste composition and model performance cards here */}`
- Right column `lg:col-span-2` is reserved but not yet rendered
- KPI strip requires modifying the top bar/sidebar layout from Phase 1

</code_context>

<deferred>
## Deferred Ideas

- Live chart updates when new events arrive — Phase 6 (data integration)
- Deep analytics with time-based trends — Phase 7
- Confidence distribution drill-down page — Phase 9
- Animated count-up on metric values — Phase 10

</deferred>

---

*Phase: 04-dashboard-supporting-sections*
*Context gathered: 2026-03-21*
