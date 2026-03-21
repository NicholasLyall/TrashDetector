---
phase: 06-data-integration-and-polling
plan: 02
subsystem: ui
tags: [swr, react-hooks, polling, skeleton-loading, live-data, recharts]

requires:
  - phase: 06-01
    provides: SWR provider, fetcher, API_BASE_URL, Skeleton component, frontend types
  - phase: 05-backend-api
    provides: FastAPI endpoints GET /metrics, GET /events, GET /metrics/breakdown
  - phase: 04-kpi-waste-model
    provides: WasteCompositionCard, HeroImpactSection stat card layout
  - phase: 03-live-feed-components
    provides: LiveFeedSection, LatestItemCard, RecentItemsList, CategoryIllustration

provides:
  - useMetrics hook polling GET /metrics every 2s
  - useEvents hook polling GET /events?limit=20 every 2s
  - useBreakdown hook polling GET /metrics/breakdown every 2s
  - HeroSkeleton and FeedSkeleton shimmer loaders
  - StaleDataWarning amber banner with live seconds counter
  - BackendEmptyState with API URL display
  - Hero section wired to live metrics (no mock data)
  - Live feed wired to live events (no mock data)
  - Waste composition chart wired to live breakdown (no mock data)
  - Conditional image rendering (real images when available, CategoryIllustration fallback)
  - Today-scoped tree equivalence calculation

affects: [07-analytics-page, 08-impact-page, 09-model-page, 10-settings-page]

tech-stack:
  added: []
  patterns: [swr-hook-per-endpoint, skeleton-to-empty-state-delay, stale-data-preservation, conditional-image-fallback]

key-files:
  created:
    - apps/web/hooks/use-metrics.ts
    - apps/web/hooks/use-events.ts
    - apps/web/hooks/use-breakdown.ts
    - apps/web/components/dashboard/hero-skeleton.tsx
    - apps/web/components/dashboard/feed-skeleton.tsx
    - apps/web/components/dashboard/stale-data-warning.tsx
    - apps/web/components/dashboard/backend-empty-state.tsx
  modified:
    - apps/web/components/dashboard/hero-impact-section.tsx
    - apps/web/components/dashboard/live-feed-section.tsx
    - apps/web/components/dashboard/latest-item-card.tsx
    - apps/web/components/dashboard/recent-items-list.tsx
    - apps/web/components/dashboard/waste-composition-card.tsx

key-decisions:
  - "One SWR hook per endpoint: useMetrics, useEvents, useBreakdown each wrap a single SWR call for clean separation"
  - "D-04 skeleton-to-empty-state pattern: 5-second setTimeout before showing BackendEmptyState prevents flash on slow connections"
  - "Stale data preservation via SWR keepPreviousData: when backend disconnects, last data stays visible with amber warning"
  - "Waste composition card maps API BreakdownData.categories to chart entries with colors from CATEGORY_CONFIG"

patterns-established:
  - "Hook-per-endpoint: each SWR hook wraps one API path, returns {data, error, isLoading} tuple"
  - "Skeleton-to-empty-state delay: 5s setTimeout before transitioning from skeleton to BackendEmptyState"
  - "Conditional image rendering: event.image_url ? <img> : <CategoryIllustration>"
  - "Today-scoped filtering: toDateString() comparison before tree equivalence calculation"

requirements-completed: [HERO-05, FEED-06, WSTE-03, INTG-02, INTG-03, INTG-04]

duration: 3min
completed: 2026-03-21
---

# Phase 06 Plan 02: SWR Hooks and Dashboard Data Wiring Summary

**Three SWR hooks (useMetrics, useEvents, useBreakdown) wired into hero, live feed, and waste composition sections with skeleton loaders, stale-data warnings, and backend empty states**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-21T23:40:48Z
- **Completed:** 2026-03-21T23:44:24Z
- **Tasks:** 4
- **Files modified:** 12

## Accomplishments
- Created three SWR hooks that poll backend endpoints every 2 seconds, enabling live dashboard updates
- Rewired hero impact section, live feed section, and waste composition card from mock data to live API data
- Added skeleton loading states matching each section's visual shape for polished initial load experience
- Added 5-second delay before backend empty state to avoid flash on slow connections (D-04)
- Added stale data warning banner with live seconds-ago counter for graceful backend disconnection
- Added conditional image rendering in LatestItemCard and RecentItemsList (real img when image_url present, CategoryIllustration fallback)
- Tree equivalence now correctly filters to today's events only (D-10)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SWR hooks, skeleton loaders, and shared UI state components** - `99825fc` (feat)
2. **Task 2: Rewire hero-impact-section from mock data to useMetrics hook** - `fcd2796` (feat)
3. **Task 3: Rewire live-feed-section from mock data to useEvents hook with image fallback** - `97a63bd` (feat)
4. **Task 4: Wire waste-composition-card to useBreakdown hook** - `c55a273` (feat)

## Files Created/Modified
- `apps/web/hooks/use-metrics.ts` - SWR hook polling GET /metrics, returns typed MetricsData
- `apps/web/hooks/use-events.ts` - SWR hook polling GET /events?limit=N, returns SortEvent[]
- `apps/web/hooks/use-breakdown.ts` - SWR hook polling GET /metrics/breakdown, returns BreakdownData
- `apps/web/components/dashboard/hero-skeleton.tsx` - Shimmer loader matching hero section shape
- `apps/web/components/dashboard/feed-skeleton.tsx` - Shimmer loader matching live feed section shape
- `apps/web/components/dashboard/stale-data-warning.tsx` - Amber warning banner with live seconds counter
- `apps/web/components/dashboard/backend-empty-state.tsx` - Empty state showing API URL for debugging
- `apps/web/components/dashboard/hero-impact-section.tsx` - Rewired from heroMockData to useMetrics hook
- `apps/web/components/dashboard/live-feed-section.tsx` - Rewired from sortEventsMockData to useEvents hook
- `apps/web/components/dashboard/latest-item-card.tsx` - Added conditional image/illustration rendering
- `apps/web/components/dashboard/recent-items-list.tsx` - Added conditional image/illustration rendering
- `apps/web/components/dashboard/waste-composition-card.tsx` - Rewired from mock data to useBreakdown hook

## Decisions Made
- One SWR hook per endpoint for clean separation (useMetrics, useEvents, useBreakdown)
- D-04 skeleton-to-empty-state pattern: 5-second setTimeout before showing BackendEmptyState prevents flash
- Stale data preserved when backend disconnects: SWR keeps previous data, amber warning added
- Waste composition card maps API label strings to WasteCategory via CATEGORY_CONFIG for chart colors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Plan referenced waste-breakdown-chart.tsx but actual file is waste-composition-card.tsx**
- **Found during:** Task 4 (Wire waste-breakdown-chart to useBreakdown hook)
- **Issue:** The plan specified `waste-breakdown-chart.tsx` but Phase 4 created the component as `waste-composition-card.tsx`
- **Fix:** Applied all planned changes to the actual file (waste-composition-card.tsx) instead
- **Files modified:** apps/web/components/dashboard/waste-composition-card.tsx
- **Verification:** TypeScript compiles, useBreakdown hook wired correctly, chart renders API data
- **Committed in:** c55a273 (Task 4 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking - filename mismatch)
**Impact on plan:** Trivial filename adaptation. No scope or behavior change.

## Issues Encountered
None - all tasks executed smoothly.

## Known Stubs
- `apps/web/app/page.tsx` line 25 still imports `sortEventsMockData` for the "Sorting History" section (RecentItemsList in the right column). This is outside this plan's scope -- the page-level wiring of that section is tracked separately.
- `apps/web/components/dashboard/model-performance-card.tsx` still uses `sortEventsMockData` for model stats. This will be wired in a future plan.
- `apps/web/components/layout/top-bar.tsx` still uses `sortEventsMockData` for KPI chips. This will be wired in a future plan.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three main dashboard sections (hero, live feed, waste composition) now poll live data from the backend
- Model performance card and top-bar KPI chips still use mock data (out of scope for this plan)
- Page.tsx sorting history section still uses mock data (out of scope for this plan)
- Ready for Phase 7+ analytics, impact, and model pages which can reuse the same hook patterns

## Self-Check: PASSED

All 12 files verified present. All 4 task commits verified in git log.

---
*Phase: 06-data-integration-and-polling*
*Completed: 2026-03-21*
