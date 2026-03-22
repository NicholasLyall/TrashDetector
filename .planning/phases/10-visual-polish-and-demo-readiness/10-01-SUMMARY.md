---
phase: 10-visual-polish-and-demo-readiness
plan: 01
subsystem: ui
tags: [demo, animation, swr, requestAnimationFrame, css-keyframes]

# Dependency graph
requires:
  - phase: 06-data-integration-and-polling
    provides: SWR hooks (useMetrics, useEvents) with polling
  - phase: 03-live-feed-components
    provides: LatestItemCard, LiveFeedSection components
  - phase: 02-hero-impact-section
    provides: HeroImpactSection with stat cards
provides:
  - DemoButton component for triggering sort events from dashboard UI
  - AnimatedNumber component for smooth counter transitions
  - Pulse-highlight CSS animation for new event indication
  - Live metrics in TopBar KPI chips (replacing mock data)
  - mutate exposed from useMetrics and useEvents hooks
affects: [10-visual-polish-and-demo-readiness]

# Tech tracking
tech-stack:
  added: []
  patterns: [requestAnimationFrame animation loop, ease-out cubic timing, prefers-reduced-motion guard, multipart FormData POST for demo events, SWR global mutate for cache revalidation]

key-files:
  created:
    - apps/web/lib/demo.ts
    - apps/web/components/dashboard/demo-button.tsx
    - apps/web/components/dashboard/animated-number.tsx
  modified:
    - apps/web/hooks/use-metrics.ts
    - apps/web/hooks/use-events.ts
    - apps/web/components/dashboard/hero-impact-section.tsx
    - apps/web/components/dashboard/live-feed-section.tsx
    - apps/web/components/dashboard/latest-item-card.tsx
    - apps/web/components/layout/top-bar.tsx
    - apps/web/app/globals.css

key-decisions:
  - "AnimatedNumber uses requestAnimationFrame with ease-out cubic for smooth 600ms transitions"
  - "TopBar KPI chips wired to live useMetrics data, removing mock data dependency"
  - "Demo event sends minimal 67-byte transparent PNG as required image for backend POST"

patterns-established:
  - "AnimatedNumber component: reusable animated counter with formatter prop and reduced-motion respect"
  - "SWR global mutate pattern: mutate(() => true) revalidates all cached keys after demo event"

requirements-completed: [VISL-05]

# Metrics
duration: 3min
completed: 2026-03-22
---

# Phase 10 Plan 01: Demo Button and Animated Counters Summary

**Demo button triggers backend sort events from dashboard UI, animated counters on hero metrics and KPI chips with rAF ease-out transitions, pulse-highlight on new feed items**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-22T01:04:08Z
- **Completed:** 2026-03-22T01:07:47Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Demo button in live feed header triggers POST /events with valid multipart form data and revalidates all SWR caches
- AnimatedNumber component smoothly animates between values using requestAnimationFrame with ease-out cubic timing
- Hero stat cards and headline waste diverted number animate when metrics change
- TopBar KPI chips now use live metrics instead of mock data with animated transitions
- Latest item card shows subtle green pulse animation when a new event arrives
- All animations respect prefers-reduced-motion media query

## Task Commits

Each task was committed atomically:

1. **Task 1: Demo event trigger, animated counter, and demo button** - `4ff2414` (feat)
2. **Task 2: Wire demo button and animated counters into dashboard, add pulse highlight** - `5e2b18c` (feat)

## Files Created/Modified
- `apps/web/lib/demo.ts` - Demo event trigger utility with DEMO_ITEMS array and triggerDemoEvent function
- `apps/web/components/dashboard/demo-button.tsx` - Emerald-themed demo button with loading state and SWR revalidation
- `apps/web/components/dashboard/animated-number.tsx` - Reusable animated counter with rAF, ease-out timing, and a11y support
- `apps/web/hooks/use-metrics.ts` - Exposed mutate function from SWR hook
- `apps/web/hooks/use-events.ts` - Exposed mutate function from SWR hook
- `apps/web/components/dashboard/hero-impact-section.tsx` - Replaced static values with AnimatedNumber components
- `apps/web/components/dashboard/live-feed-section.tsx` - Added DemoButton and new-event tracking for pulse
- `apps/web/components/dashboard/latest-item-card.tsx` - Added isNew prop and pulse-highlight animation
- `apps/web/components/layout/top-bar.tsx` - Replaced mock data KPIs with live metrics and AnimatedNumber
- `apps/web/app/globals.css` - Added pulse-highlight keyframe and utility class

## Decisions Made
- AnimatedNumber uses requestAnimationFrame with ease-out cubic (1 - (1-t)^3) for 600ms transitions -- smooth and professional
- TopBar KPI chips wired directly to useMetrics() hook, removing computeKpiMetrics and sortEventsMockData imports
- Demo event sends a minimal 67-byte transparent PNG blob as required image field for backend POST /events
- Removed unused formatNumber import from hero-impact-section after switching to AnimatedNumber

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused formatNumber import from hero-impact-section**
- **Found during:** Task 2
- **Issue:** After replacing static string values with AnimatedNumber, the formatNumber import was no longer used
- **Fix:** Removed the import to avoid lint warnings
- **Files modified:** apps/web/components/dashboard/hero-impact-section.tsx
- **Committed in:** 5e2b18c (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor cleanup, no scope change.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Demo button fully functional when backend is running
- All animations polished and accessible
- Ready for Plan 02 (visual consistency pass and page transitions)

## Self-Check: PASSED

All 10 files verified present. Both task commits (4ff2414, 5e2b18c) found in git log. TypeScript compilation passes with no errors.

---
*Phase: 10-visual-polish-and-demo-readiness*
*Completed: 2026-03-22*
