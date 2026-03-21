---
phase: 03-live-feed-components
plan: 01
subsystem: ui
tags: [typescript, react, svg, intl, mock-data, lucide-react]

# Dependency graph
requires:
  - phase: 05-backend-api-and-database
    provides: EventResponse schema and VALID_CATEGORIES constant that frontend types mirror
provides:
  - SortEvent interface and WasteCategory type for all frontend components
  - CATEGORY_CONFIG with display labels, badge colors, and icons per category
  - CategoryBadge React component for color-coded category pills
  - calculateTreesEquivalent utility with EPA formula (22 kg CO2/tree/year)
  - formatRelativeTime utility using native Intl.RelativeTimeFormat
  - 10 mock SortEvent objects for development before backend wiring
  - ITEM_NAMES map for human-readable item display names
  - CategoryIllustration component with 4 inline SVGs at two sizes
affects: [03-02, 06-data-integration-and-polling, 04-breakdown-and-model-cards]

# Tech tracking
tech-stack:
  added: [vitest, "@testing-library/react", "@testing-library/jest-dom", jsdom]
  patterns: [TDD with vitest for frontend, dynamic imports in tests for module isolation]

key-files:
  created:
    - apps/web/lib/types.ts
    - apps/web/lib/categories.tsx
    - apps/web/lib/format-relative-time.ts
    - apps/web/components/dashboard/category-illustrations.tsx
    - apps/web/vitest.config.ts
    - apps/web/lib/__tests__/types.test.ts
    - apps/web/lib/__tests__/categories.test.ts
    - apps/web/lib/__tests__/format-relative-time.test.ts
  modified:
    - apps/web/lib/mock-data.ts

key-decisions:
  - "categories.tsx instead of categories.ts: JSX in CategoryBadge component requires .tsx extension"
  - "vitest for frontend testing: lightweight, Vite-native, no additional config needed"
  - "Intl.RelativeTimeFormat narrow style: produces compact '2s ago', '5m ago' strings"

patterns-established:
  - "Frontend types mirror backend schemas with snake_case field names (no camelCase transform)"
  - "TDD workflow with vitest: tests in lib/__tests__/, run via npx vitest run"
  - "Category config as typed const satisfies Record pattern for exhaustive type checking"
  - "SVG illustrations as inline React components with viewBox for scalability"

requirements-completed: [FEED-02, FEED-03, FEED-07]

# Metrics
duration: 6min
completed: 2026-03-21
---

# Phase 03 Plan 01: Live Feed Data Foundation Summary

**SortEvent types, category config with badges/colors/icons, formatRelativeTime utility, 10 mock events, and 4 category SVG illustrations**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-21T22:30:49Z
- **Completed:** 2026-03-21T22:37:06Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Created SortEvent interface and WasteCategory type exactly mirroring backend EventResponse schema (10 readonly fields, snake_case)
- Built CATEGORY_CONFIG with all 4 categories including display labels, badge colors for light/dark mode, and Lucide icons per D-01/D-02/D-03
- Implemented formatRelativeTime using native Intl.RelativeTimeFormat (zero dependencies)
- Created 10 mock sort events with inflated CO2 values (~59.5 kg total) for meaningful tree badge display (~3 trees)
- Built CategoryIllustration component with 4 flat SVG illustrations at two sizes (200px / 40px) with "Simulated" badge
- Established frontend test infrastructure with vitest (18 tests passing)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create type definitions, category config, and relative time formatter** - `10f11de` (test: RED), `12332fc` (feat: GREEN)
2. **Task 2: Create mock event data and category SVG illustrations** - `9d4868f` (feat)

**Plan metadata:** pending (docs: complete plan)

_Note: Task 1 followed TDD with separate test and implementation commits._

## Files Created/Modified
- `apps/web/lib/types.ts` - WasteCategory type and SortEvent interface
- `apps/web/lib/categories.tsx` - CATEGORY_CONFIG, CategoryBadge component, calculateTreesEquivalent
- `apps/web/lib/format-relative-time.ts` - formatRelativeTime using Intl.RelativeTimeFormat
- `apps/web/lib/mock-data.ts` - Extended with sortEventsMockData (10 events) and ITEM_NAMES
- `apps/web/components/dashboard/category-illustrations.tsx` - CategoryIllustration with 4 SVGs
- `apps/web/vitest.config.ts` - Vitest configuration for frontend tests
- `apps/web/lib/__tests__/types.test.ts` - Type definition tests
- `apps/web/lib/__tests__/categories.test.ts` - Category config and tree calculation tests
- `apps/web/lib/__tests__/format-relative-time.test.ts` - Relative time formatting tests

## Decisions Made
- Used `.tsx` extension for categories file instead of `.ts` because the file contains the CategoryBadge React component with JSX syntax (Rule 3 auto-fix: `.ts` files cannot contain JSX, causing parse errors in vite/oxc)
- Installed vitest as the frontend test framework (lightweight, Vite-native, aligns with the project's build tooling)
- Intl.RelativeTimeFormat with `narrow` style produces compact strings like "2s ago", "5m ago" -- well-suited for the live feed's space constraints

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Renamed categories.ts to categories.tsx**
- **Found during:** Task 1 (GREEN phase test run)
- **Issue:** The plan specified `categories.ts` but the file contains JSX (CategoryBadge component). Vite's oxc parser cannot transform JSX in `.ts` files, causing all category tests to fail with parse errors.
- **Fix:** Renamed `categories.ts` to `categories.tsx`. All imports using the module work with either extension since TypeScript resolves them automatically.
- **Files modified:** `apps/web/lib/categories.tsx` (renamed from `.ts`)
- **Verification:** All 18 tests pass, TypeScript compiles cleanly
- **Committed in:** 12332fc (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minimal -- file extension change required for JSX support. No scope creep.

## Issues Encountered
None -- plan executed smoothly after the file extension fix.

## User Setup Required
None -- no external service configuration required.

## Next Phase Readiness
- All data layer files ready for Plan 02 (LiveFeedSection, LatestItemCard, RecentItemsList components)
- SortEvent interface, CATEGORY_CONFIG, formatRelativeTime, sortEventsMockData, ITEM_NAMES, and CategoryIllustration all exported and type-checked
- Test infrastructure (vitest) established for future frontend tests

## Self-Check: PASSED

All 9 created files verified on disk. All 3 commit hashes (10f11de, 12332fc, 9d4868f) verified in git log.

---
*Phase: 03-live-feed-components*
*Completed: 2026-03-21*
