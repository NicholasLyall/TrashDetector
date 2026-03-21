---
phase: 04-dashboard-supporting-sections
plan: 01
subsystem: ui
tags: [recharts, donut-chart, kpi, metrics, typescript, vitest]

requires:
  - phase: 01-frontend-shell
    provides: "App shell layout with top-bar KPI placeholder and sidebar navigation"
  - phase: 03-live-feed-components
    provides: "SortEvent types, mock-data, categories config, dashboard component patterns"
provides:
  - "compute-metrics.ts with computeKpiMetrics, computeCategoryBreakdown, computeModelStats"
  - "KPI chip strip in top bar (Total Items, Recycling Rate, Avg Confidence, Fallback Rate)"
  - "WasteCompositionCard donut chart component"
  - "Recharts dependency installed"
affects: [04-02, 06-data-integration]

tech-stack:
  added: [recharts]
  patterns: ["Pure computation utilities separated from UI components", "TDD for metric functions"]

key-files:
  created:
    - apps/web/lib/compute-metrics.ts
    - apps/web/lib/compute-metrics.test.ts
    - apps/web/components/dashboard/waste-composition-card.tsx
  modified:
    - apps/web/components/layout/top-bar.tsx
    - apps/web/package.json

key-decisions:
  - "avgConfidence computed as Math.round(mean * 100) = 82% from mock data (not 83 as plan estimated)"
  - "KpiChip component kept local to top-bar.tsx (not exported) since only used there"
  - "Tooltip formatter uses string coercion for recharts ValueType compatibility"

patterns-established:
  - "Pure metric functions in compute-metrics.ts: take readonly SortEvent[], return typed result objects"
  - "Category legend uses short names (Paper, Metal/Glass, Plastic, Trash) instead of display labels"
  - "Donut chart center label via absolute positioned overlay div, not Recharts custom label"

requirements-completed: [DASH-04, DASH-05, WSTE-01, WSTE-02]

duration: 3min
completed: 2026-03-21
---

# Phase 4 Plan 1: KPI Strip, Metrics Utility, and Waste Composition Card Summary

**Pure metric computation functions with TDD, 4-chip KPI strip in top bar, and Recharts donut chart card for waste composition**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-21T23:19:24Z
- **Completed:** 2026-03-21T23:23:05Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Created compute-metrics.ts with 3 pure functions (computeKpiMetrics, computeCategoryBreakdown, computeModelStats) and 3 exported type interfaces, all tested with 11 passing vitest tests
- Installed Recharts and replaced KPI placeholder in top bar with 4 computed KPI chips showing Total Items, Recycling Rate, Avg Confidence, and Fallback Rate
- Built WasteCompositionCard with Recharts donut chart, center total overlay, color-coded legend, and View Full Analytics link

## Task Commits

Each task was committed atomically:

1. **Task 1: Create compute-metrics utility with tests (TDD)** - `d048491` (test: failing tests) + `b3b3bbb` (feat: implementation passing all tests)
2. **Task 2: Install Recharts and build KPI strip in top bar** - `ffe4713` (feat)
3. **Task 3: Create waste composition donut chart card** - `f55b999` (feat)

## Files Created/Modified
- `apps/web/lib/compute-metrics.ts` - Pure metric computation functions (KPI, category breakdown, model stats)
- `apps/web/lib/compute-metrics.test.ts` - 11 vitest tests covering empty arrays, mock data, and edge cases
- `apps/web/components/layout/top-bar.tsx` - Replaced KPI placeholder with 4 computed KpiChip components
- `apps/web/components/dashboard/waste-composition-card.tsx` - Recharts donut chart with legend and analytics link
- `apps/web/package.json` - Added recharts dependency

## Decisions Made
- avgConfidence correctly computes to 82% from mock data (sum 8.15 / 10 = 0.815, rounded to 82), correcting the plan's estimate of 83%
- KpiChip component kept as a local function inside top-bar.tsx rather than exported, since it is only used in that context
- Donut chart center label implemented via absolute positioned overlay div rather than Recharts custom label API, for simpler CSS control
- Tooltip formatter uses implicit types with string coercion for recharts ValueType/NameType compatibility

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Tooltip formatter type mismatch**
- **Found during:** Task 3 (Waste composition card)
- **Issue:** Recharts Tooltip `formatter` prop expects `(value: ValueType, name: NameType) => ...` but plan specified `(value: number, name: string)` causing TypeScript error
- **Fix:** Removed explicit parameter types, used string coercion with `String(value)` and `String(name)`
- **Files modified:** apps/web/components/dashboard/waste-composition-card.tsx
- **Verification:** `npx next build` completes without errors
- **Committed in:** f55b999 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minimal type adjustment for recharts compatibility. No scope creep.

## Issues Encountered
None beyond the type fix documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- compute-metrics.ts provides shared computation layer for Plan 02 (model performance card)
- Recharts is installed and available for any future chart components
- WasteCompositionCard ready to be wired into dashboard page layout (Phase 6 integration)
- KPI strip live in top bar, will auto-update when mock data is swapped for real API data

## Self-Check: PASSED

All files verified present, all commits verified in git log.

---
*Phase: 04-dashboard-supporting-sections*
*Completed: 2026-03-21*
