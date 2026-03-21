---
phase: 06-data-integration-and-polling
verified: 2026-03-21T23:55:00Z
status: passed
score: 8/8 must-haves verified
re_verification: false
---

# Phase 06: Data Integration and Polling Verification Report

**Phase Goal:** Replace mock data with live API integration — SWR hooks polling FastAPI every 2 seconds, skeleton loaders, stale-data warnings, and empty states for hero/feed/breakdown components.
**Verified:** 2026-03-21T23:55:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | SWR is installed and available for import | VERIFIED | `package.json` has `"swr": "^2.4.1"`; all 6 task commits confirmed in git log |
| 2  | API response types (MetricsData, CategoryBreakdown, BreakdownData) exist and match backend schemas.py field-for-field | VERIFIED | `lib/types.ts` lines 38–64 define all three interfaces with correct field names and readonly modifiers |
| 3  | A typed fetcher function builds URLs from NEXT_PUBLIC_API_URL and throws on non-ok responses | VERIFIED | `lib/api.ts` exports `API_BASE_URL` (env var with localhost:8000 fallback) and `fetcher<T>` with status-attached Error throw |
| 4  | SWRConfig wraps the entire app with refreshInterval 2000ms and global fetcher | VERIFIED | `components/providers/swr-provider.tsx` sets `refreshInterval: 2000`, `fetcher`, `revalidateOnFocus`, `shouldRetryOnError`; `app/layout.tsx` wraps body with `<SWRProvider>` |
| 5  | Hero metrics update automatically every 2s from GET /metrics (no mock data import) | VERIFIED | `hero-impact-section.tsx` imports `useMetrics` from `@/hooks/use-metrics`; no `heroMockData` import present |
| 6  | Live feed updates automatically every 2s from GET /events?limit=20 (no mock data import) | VERIFIED | `live-feed-section.tsx` imports `useEvents` from `@/hooks/use-events`; no `sortEventsMockData` import present; today-scoped tree equivalence calculation confirmed |
| 7  | The waste composition chart updates automatically when new events arrive | VERIFIED | `waste-composition-card.tsx` imports `useBreakdown` from `@/hooks/use-breakdown`; maps API categories to chart entries via `CATEGORY_CONFIG` |
| 8  | Skeleton loaders, stale-data warnings, and empty states are wired into hero/feed/breakdown | VERIFIED | All three sections use `isLoading` → skeleton, `error && !data` → 5s delay then BackendEmptyState, `error && data` → StaleDataWarning; all confirmed in source |

**Score:** 8/8 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `apps/web/lib/api.ts` | API_BASE_URL constant, fetcher function | VERIFIED | Exports both; fetcher throws with `.status` on non-ok responses |
| `apps/web/lib/types.ts` | MetricsData, CategoryBreakdown, BreakdownData interfaces | VERIFIED | All three present (lines 38–64); SortEvent and WasteCategory preserved |
| `apps/web/components/providers/swr-provider.tsx` | SWRProvider with 2000ms refresh | VERIFIED | `refreshInterval: 2000`, `fetcher` import, `"use client"` directive, exported as `SWRProvider` |
| `apps/web/components/ui/skeleton.tsx` | shadcn/ui Skeleton component | VERIFIED | Exports `Skeleton`, uses `animate-pulse rounded-md bg-muted` |
| `apps/web/hooks/use-metrics.ts` | useMetrics returning {metrics, error, isLoading} | VERIFIED | SWR key `/metrics`, typed as `MetricsData`, returns `{ metrics: data, error, isLoading }` |
| `apps/web/hooks/use-events.ts` | useEvents returning {events, error, isLoading} | VERIFIED | SWR key `/events?limit=${limit}`, typed as `readonly SortEvent[]`, returns tuple |
| `apps/web/hooks/use-breakdown.ts` | useBreakdown returning {breakdown, error, isLoading} | VERIFIED | SWR key `/metrics/breakdown`, typed as `BreakdownData`, returns tuple |
| `apps/web/components/dashboard/hero-skeleton.tsx` | HeroSkeleton shimmer loader | VERIFIED | Exports `HeroSkeleton`; uses Skeleton for motivational text + 3 stat card grid |
| `apps/web/components/dashboard/feed-skeleton.tsx` | FeedSkeleton shimmer loader | VERIFIED | Exports `FeedSkeleton`; matches feed card shapes with latest item + 4 recent rows |
| `apps/web/components/dashboard/stale-data-warning.tsx` | Amber warning banner with live counter | VERIFIED | Exports `StaleDataWarning`; `setInterval(1000)` updates `secondsAgo` counter, amber styling |
| `apps/web/components/dashboard/backend-empty-state.tsx` | Friendly empty state showing API URL | VERIFIED | Exports `BackendEmptyState`; imports and displays `API_BASE_URL` from `@/lib/api` |
| `apps/web/components/dashboard/hero-impact-section.tsx` | Wired to useMetrics | VERIFIED | Imports `useMetrics`; no mock data; 5s empty state delay implemented |
| `apps/web/components/dashboard/live-feed-section.tsx` | Wired to useEvents | VERIFIED | Imports `useEvents(20)`; today-filter before `calculateTreesEquivalent`; no mock data |
| `apps/web/components/dashboard/waste-composition-card.tsx` | Wired to useBreakdown | VERIFIED | Imports `useBreakdown`; maps `breakdown.categories` to `ChartEntry[]`; no mock data |
| `apps/web/components/dashboard/latest-item-card.tsx` | Conditional image/illustration rendering | VERIFIED | `event.image_url ? <img> : <CategoryIllustration>` pattern on lines 23–31 |
| `apps/web/components/dashboard/recent-items-list.tsx` | Conditional image/illustration rendering | VERIFIED | Same conditional pattern on lines 35–43 |
| `apps/web/.env.local` | NEXT_PUBLIC_API_URL=http://localhost:8000 | VERIFIED | File present with correct value |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/layout.tsx` | `components/providers/swr-provider.tsx` | `<SWRProvider>` wrapping children | WIRED | Import at line 6; `<SWRProvider>` at line 35 wrapping TooltipProvider + AppShell |
| `components/providers/swr-provider.tsx` | `lib/api.ts` | `import { fetcher }` | WIRED | Line 4: `import { fetcher } from "@/lib/api"` |
| `components/dashboard/hero-impact-section.tsx` | `/metrics` | `useMetrics` hook → SWR → fetcher | WIRED | `useMetrics()` called at line 41; no mock data imports |
| `components/dashboard/live-feed-section.tsx` | `/events?limit=20` | `useEvents` hook → SWR → fetcher | WIRED | `useEvents(20)` called at line 23; no mock data imports |
| `components/dashboard/waste-composition-card.tsx` | `/metrics/breakdown` | `useBreakdown` hook → SWR → fetcher | WIRED | `useBreakdown()` called at line 52; no mock data imports |
| `hooks/use-metrics.ts` | `lib/types.ts` | imports MetricsData type | WIRED | Line 4: `import type { MetricsData } from "@/lib/types"` |
| `hooks/use-events.ts` | `lib/types.ts` | imports SortEvent type | WIRED | Line 4: `import type { SortEvent } from "@/lib/types"` |
| `hooks/use-breakdown.ts` | `lib/types.ts` | imports BreakdownData type | WIRED | Line 4: `import type { BreakdownData } from "@/lib/types"` |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| INTG-01 | 06-01-PLAN | Frontend polls backend every 1-2 seconds | SATISFIED | SWRProvider sets `refreshInterval: 2000`; all hooks inherit it via SWRConfig |
| INTG-02 | 06-02-PLAN | Hero metrics wired to live /metrics endpoint | SATISFIED | `hero-impact-section.tsx` calls `useMetrics()` which polls `/metrics` |
| INTG-03 | 06-02-PLAN | Live feed wired to live /events endpoint | SATISFIED | `live-feed-section.tsx` calls `useEvents(20)` which polls `/events?limit=20` |
| INTG-04 | 06-02-PLAN | Charts wired to live /metrics/breakdown endpoint | SATISFIED | `waste-composition-card.tsx` calls `useBreakdown()` which polls `/metrics/breakdown` |
| HERO-05 | 06-02-PLAN | Hero metrics update automatically when new events arrive | SATISFIED | useMetrics polls every 2s; hero section renders live `metrics` data |
| FEED-06 | 06-02-PLAN | Live feed refreshes automatically every 1-2 seconds | SATISFIED | useEvents polls every 2s; live-feed-section renders live `events` array |
| WSTE-03 | 06-02-PLAN | Waste composition chart updates when new events arrive | SATISFIED | useBreakdown polls every 2s; WasteCompositionCard maps live `breakdown.categories` |

**All 7 phase-6 requirement IDs satisfied.**

**Orphaned requirements check:** REQUIREMENTS.md traceability maps HERO-05, FEED-06, WSTE-03, INTG-01, INTG-02, INTG-03, INTG-04 to Phase 6 — all 7 are covered by the two plans. No orphaned requirements.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `components/dashboard/model-performance-card.tsx` | 5, 110 | `import { sortEventsMockData }` — still uses mock data | Info | Out of scope per SUMMARY "Known Stubs" — model card wiring tracked separately |
| `components/layout/top-bar.tsx` | 8, 33 | `import { sortEventsMockData }` — KPI strip still uses mock data | Info | Out of scope per SUMMARY "Known Stubs" — top-bar wiring tracked separately |
| `app/page.tsx` | 7, 25 | `import { sortEventsMockData }` — sorting history RecentItemsList uses mock data | Info | Out of scope per SUMMARY "Known Stubs" — page-level wiring tracked separately |

**Classification note:** All three anti-patterns are explicitly documented as out-of-scope known stubs in `06-02-SUMMARY.md`. They do not affect the phase goal which covers hero, feed, and breakdown sections only. No blockers.

---

### Human Verification Required

#### 1. Live Polling Cycle

**Test:** Start the FastAPI backend (`cd apps/api && uvicorn main:app`), open the dashboard, post a new sort event via `POST /events`, and observe the dashboard.
**Expected:** Hero metrics, live feed, and waste composition chart all update within 2 seconds without a page reload.
**Why human:** Cannot verify polling timing behavior programmatically from static code inspection.

#### 2. Stale Data Warning Display

**Test:** Start the dashboard with the backend running, then stop the backend process.
**Expected:** After the last successful fetch, the amber StaleDataWarning banner appears showing incrementing seconds ("Last updated Xs ago — connection lost"). The previously loaded data remains visible.
**Why human:** Requires a running frontend + backend to observe runtime state transitions.

#### 3. Backend Empty State (Never Connected)

**Test:** Start the dashboard without the backend running.
**Expected:** Skeleton loaders appear for ~5 seconds, then transition to BackendEmptyState showing "Make sure the API is running at http://localhost:8000".
**Why human:** Requires observing the 5-second delay and UI transition at runtime.

#### 4. Conditional Image Rendering

**Test:** Seed a sort event with `image_url: null` and one with a real Supabase Storage URL.
**Expected:** Null image_url shows `CategoryIllustration`; real URL shows the actual `<img>` element with the photo.
**Why human:** Requires running backend with both data cases to verify the conditional render path.

---

### Gaps Summary

No gaps found. All phase 06 must-haves are implemented, wired, and type-safe.

The three remaining mock data usages in `model-performance-card.tsx`, `top-bar.tsx`, and `page.tsx` are correctly scoped out-of-plan and documented as known stubs. They are not part of phase 06's goal.

TypeScript compiles cleanly (zero errors). All 6 phase commits are confirmed in git log. All 7 requirement IDs (HERO-05, FEED-06, WSTE-03, INTG-01, INTG-02, INTG-03, INTG-04) are satisfied.

---

_Verified: 2026-03-21T23:55:00Z_
_Verifier: Claude (gsd-verifier)_
