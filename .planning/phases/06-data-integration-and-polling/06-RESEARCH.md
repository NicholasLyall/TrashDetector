# Phase 6: Data Integration and Polling - Research

**Researched:** 2026-03-21
**Domain:** Frontend data fetching, API integration, polling, loading/error states
**Confidence:** HIGH

## Summary

Phase 6 replaces mock data imports with live API calls across all dashboard sections. The frontend currently imports `heroMockData` and `sortEventsMockData` from `lib/mock-data.ts` -- these must be replaced with SWR hooks polling the FastAPI backend every 1-2 seconds. Three API endpoints need consumption: `GET /metrics` (hero + KPI strip), `GET /events?limit=20` (live feed), and `GET /metrics/breakdown` (waste composition chart).

The backend is fully implemented with CORS already configured for `http://localhost:3000`. The frontend has zero data-fetching libraries installed. SWR is the recommended choice: it is built by Vercel (same team as Next.js), lightweight (~4KB), and has first-class `refreshInterval` support for polling. The architecture is simple -- an `SWRConfig` provider wrapping the dashboard, a shared fetcher function, and three custom hooks (`useMetrics`, `useEvents`, `useBreakdown`) that each section consumes.

The key UX requirements are: skeleton loaders per section on initial load (D-01, D-02), stale data with warning on disconnection (D-03), friendly empty state if backend never reached (D-04), and silent auto-reconnection (D-05). No visible connection indicator during normal operation (D-06).

**Primary recommendation:** Use SWR 2.4.1 with `refreshInterval: 2000`, one `SWRConfig` provider in the layout, a typed API client module at `lib/api.ts`, and three custom hooks in a `hooks/` directory.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Skeleton loaders on initial page load -- shimmer placeholders matching the shape of each section (hero stat cards, feed cards, chart area) until first data fetch completes
- **D-02:** Each section manages its own loading state independently (hero skeletons, feed skeletons, chart skeleton) so sections can render as their data arrives
- **D-03:** When backend becomes unreachable during operation, show stale data (last successfully fetched values) with a subtle toast or banner: "Last updated Xs ago -- connection lost"
- **D-04:** When backend has never been reachable (first load, API not running), show skeletons for ~5 seconds then transition to a friendly empty state: "Waiting for backend connection..." with the configured API URL displayed for debugging
- **D-05:** Polling continues attempting reconnection in the background -- dashboard auto-recovers when backend comes back
- **D-06:** No visible connection status indicator during normal operation -- only surface status when errors occur (via stale-data warning per D-03 or empty state per D-04)

### Claude's Discretion
- Data fetching library choice (SWR, React Query, or custom hooks with setInterval)
- Update transition behavior when new data arrives (instant swap vs animation)
- Image fallback strategy for events with null image_url
- Exact skeleton loader designs per section
- Stale data warning toast/banner design and positioning
- Empty state illustration and copy
- API client module structure and TypeScript type definitions
- Environment variable naming for backend URL
- Whether to batch multiple API calls or keep separate

### Deferred Ideas (OUT OF SCOPE)
- Count-up animations on hero numbers when values change -- Phase 10 Visual Polish (ADV-04)
- WebSocket real-time updates -- out of scope, polling is sufficient for demo
- Multiple device switching / facility selector -- v2 feature (ADV-02)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-05 | Hero metrics update automatically when new events arrive (1-2s polling) | `useMetrics` hook with SWR `refreshInterval: 2000` polls `GET /metrics`, hero-impact-section rewired from `heroMockData` to hook return value |
| FEED-06 | Live feed refreshes automatically every 1-2 seconds | `useEvents` hook polls `GET /events?limit=20`, live-feed-section rewired from `sortEventsMockData` to hook return value |
| WSTE-03 | Chart updates when new events arrive | `useBreakdown` hook polls `GET /metrics/breakdown`, chart component receives live category data |
| INTG-01 | Frontend polls backend every 1-2 seconds for fresh data | SWR `refreshInterval: 2000` in `SWRConfig` provider applied globally; all three hooks inherit polling |
| INTG-02 | Hero metrics wired to live /metrics endpoint | `useMetrics` returns `MetricsResponse` typed data, hero section maps fields (recycling_rate, co2_saved_kg, waste_diverted_kg, total_items) |
| INTG-03 | Live feed wired to live /events endpoint with images from Supabase Storage | `useEvents` returns `EventResponse[]`, image_url rendered via `<img>` when non-null, CategoryIllustration fallback when null |
| INTG-04 | Charts wired to live /metrics/breakdown endpoint | `useBreakdown` returns `BreakdownResponse` with category array for pie/donut chart data |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| swr | 2.4.1 | Data fetching + polling | Built by Vercel, pairs with Next.js, ~4KB, first-class `refreshInterval`, stale-while-revalidate pattern ideal for polling dashboards |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui Skeleton | N/A (registry) | Shimmer loading placeholders | Install from shadcn registry (`npx shadcn@latest add skeleton`) for D-01 skeleton loaders |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SWR | @tanstack/react-query v5 | More powerful (mutations, infinite queries) but heavier (~13KB), more boilerplate (QueryClient, QueryClientProvider). Overkill for three simple polling endpoints. |
| SWR | Custom setInterval hooks | Zero dependencies but must manually handle: cache, deduplication, focus revalidation, error retry, race conditions. SWR handles all of these. |

**Recommendation:** Use SWR. It is the lightest option, pairs naturally with Next.js (both Vercel), and `refreshInterval` is exactly what this phase needs. The stale-while-revalidate pattern inherently satisfies D-03 (stale data shown during errors).

**Installation:**
```bash
cd apps/web && npm install swr
```

**Version verification:** `npm view swr version` returned `2.4.1` (published 2025-12-04). Current and stable.

## Architecture Patterns

### Recommended Project Structure
```
apps/web/
├── lib/
│   ├── api.ts              # API client: base URL, typed fetcher, endpoint helpers
│   ├── types.ts            # Existing types (SortEvent) + new API response types
│   ├── mock-data.ts        # KEPT but no longer imported by dashboard components
│   └── ...
├── hooks/
│   ├── use-metrics.ts      # useSWR("/metrics") → MetricsData
│   ├── use-events.ts       # useSWR("/events?limit=20") → SortEvent[]
│   └── use-breakdown.ts    # useSWR("/metrics/breakdown") → BreakdownData
├── components/
│   ├── ui/
│   │   └── skeleton.tsx    # shadcn Skeleton component (added via registry)
│   ├── dashboard/
│   │   ├── hero-impact-section.tsx    # Rewired: useMetrics() instead of heroMockData
│   │   ├── live-feed-section.tsx      # Rewired: useEvents() instead of sortEventsMockData
│   │   ├── hero-skeleton.tsx          # Skeleton matching hero stat cards shape
│   │   ├── feed-skeleton.tsx          # Skeleton matching feed card shapes
│   │   └── ...
│   └── providers/
│       └── swr-provider.tsx  # SWRConfig with global fetcher + refreshInterval
└── app/
    └── layout.tsx            # Wraps children with SWRProvider
```

### Pattern 1: SWR Provider with Global Config
**What:** A client component wrapping the app with `SWRConfig` to set global fetcher and refresh interval.
**When to use:** Always -- ensures all hooks share config without repetition.
**Example:**
```typescript
// Source: https://swr.vercel.app/docs/global-configuration
"use client";

import { SWRConfig } from "swr";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetcher(path: string): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    const error = new Error("API request failed");
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
}

export function SWRProvider({ children }: { readonly children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 2000,
        revalidateOnFocus: true,
        shouldRetryOnError: true,
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  );
}
```

### Pattern 2: Typed Custom Hook per Endpoint
**What:** Each API endpoint gets a dedicated hook returning typed data + loading/error states.
**When to use:** For every endpoint consumed by the dashboard.
**Example:**
```typescript
// hooks/use-metrics.ts
"use client";

import useSWR from "swr";

interface MetricsData {
  readonly total_items: number;
  readonly recycling_rate: number;
  readonly co2_saved_kg: number;
  readonly waste_diverted_kg: number;
  readonly avg_confidence: number;
  readonly uncertain_rate: number;
  readonly fallback_rate: number;
}

export function useMetrics() {
  const { data, error, isLoading } = useSWR<MetricsData>("/metrics");
  return { metrics: data, error, isLoading } as const;
}
```

### Pattern 3: Skeleton Loader per Section (D-01, D-02)
**What:** Each dashboard section renders its own skeleton matching the shape of its content during loading.
**When to use:** When `isLoading` is true from the hook (no data yet).
**Example:**
```typescript
// Inside hero-impact-section.tsx
const { metrics, error, isLoading } = useMetrics();

if (isLoading) return <HeroSkeleton />;
if (error && !metrics) return <HeroEmptyState apiUrl={API_BASE_URL} />;
// Normal render with metrics data
```

### Pattern 4: Stale Data + Warning (D-03)
**What:** When SWR has cached data but fetch fails, show the cached data with a warning banner.
**When to use:** When `error` is truthy but `data` still exists (SWR keeps stale data).
**Example:**
```typescript
// SWR naturally keeps stale data when revalidation fails
const { data, error } = useSWR<MetricsData>("/metrics");

// data exists AND error exists = stale data scenario
const isStale = !!error && !!data;
```

### Pattern 5: Environment Variable for API URL
**What:** Use `NEXT_PUBLIC_API_URL` to configure the backend base URL.
**When to use:** In the API client / SWR provider.
**Example:**
```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```
The `NEXT_PUBLIC_` prefix exposes the variable to client-side JavaScript (required since all fetching happens in the browser). Falls back to `http://localhost:8000` for local development.

### Anti-Patterns to Avoid
- **Fetching in server components:** All polling must happen in client components with `"use client"`. Server components cannot poll.
- **Creating multiple SWR instances for the same key:** SWR deduplicates requests with the same key automatically -- do not add manual deduplication.
- **Transforming snake_case to camelCase:** Project decision (from Phase 03 STATE.md) is to keep snake_case field names matching the backend. Do not add a transform layer.
- **Removing mock-data.ts:** Keep the file for reference and potential test fixtures. Just stop importing it from dashboard components.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Polling with setInterval | Custom hook with `useEffect` + `setInterval` + manual state | SWR `refreshInterval` | Race conditions, memory leaks, no deduplication, no error retry, no focus revalidation |
| Request caching | Manual cache Map/object | SWR built-in cache | Cache invalidation is hard; SWR handles stale-while-revalidate automatically |
| Loading states | Custom `useState` for loading per component | SWR `isLoading` / `isValidating` | SWR distinguishes first-load (isLoading) from revalidation (isValidating) correctly |
| Skeleton components | Custom div shimmer animations | shadcn/ui Skeleton + Tailwind `animate-pulse` | Consistent with existing component library, battle-tested accessibility |
| Retry on error | Custom retry logic with exponential backoff | SWR built-in `errorRetryCount` + `onErrorRetry` | SWR implements exponential backoff automatically |

**Key insight:** SWR solves the polling + caching + stale data problem in ~4KB. Building equivalent functionality by hand would be 200+ lines of fragile code with subtle timing bugs.

## Common Pitfalls

### Pitfall 1: SWRConfig Must Be a Client Component
**What goes wrong:** Placing `SWRConfig` in a server component (e.g., directly in `layout.tsx`) causes a runtime error because SWR uses React Context.
**Why it happens:** Next.js App Router defaults to server components. `SWRConfig` requires client-side React Context.
**How to avoid:** Create a separate `SWRProvider` component with `"use client"` directive. Import and use it in `layout.tsx`. The layout itself stays a server component -- only the provider wrapper is a client component.
**Warning signs:** "React Context is not available in Server Components" error.

### Pitfall 2: CORS Preflight on Different Ports
**What goes wrong:** Browser blocks API requests with CORS errors even though the backend has CORS configured.
**Why it happens:** Frontend runs on `localhost:3000`, backend on `localhost:8000`. The backend CORS already includes `http://localhost:3000` in `cors_origins` setting.
**How to avoid:** Verify the backend `.env` or default config includes `http://localhost:3000`. The current `config.py` already defaults to `["http://localhost:3000"]` -- this is correct.
**Warning signs:** Console shows "Access-Control-Allow-Origin" errors.

### Pitfall 3: Stale Data Detection Timing (D-03 vs D-04)
**What goes wrong:** Confusing "backend went down during operation" (D-03: show stale data + warning) with "backend was never reachable" (D-04: show empty state).
**Why it happens:** SWR's `error` state is the same in both cases -- the distinction is whether `data` exists.
**How to avoid:** Use this decision tree:
- `isLoading && !data` = first load, show skeleton
- `error && !data` = never connected, show empty state (after timeout)
- `error && data` = was connected, lost connection, show stale data + warning
- `data && !error` = normal, show data
**Warning signs:** Empty state flashing when backend briefly reconnects.

### Pitfall 4: Image URL Handling for Null Images
**What goes wrong:** Attempting to render `<img src={null}>` causes console warnings or broken image icons.
**Why it happens:** Seed data has `image_url: null` for all events (SEED-02). Real Pi images will have Supabase Storage URLs.
**How to avoid:** When `image_url` is null, render the existing `CategoryIllustration` component (already used in mock data mode). When `image_url` is non-null, render an `<img>` tag. The `LatestItemCard` and `RecentItemsList` components already use `CategoryIllustration` -- add conditional image rendering.
**Warning signs:** Broken image icons on the feed.

### Pitfall 5: Relative Timestamps Becoming Stale
**What goes wrong:** Relative timestamps ("2s ago") display correctly when data first loads but become inaccurate as time passes without new events.
**Why it happens:** `formatRelativeTime()` calculates based on `Date.now()` at render time. With SWR polling every 2s, components re-render on data change, but if data hasn't changed, timestamps don't update.
**How to avoid:** SWR's polling causes re-renders every 2 seconds, which recalculates relative timestamps. However, if `data` reference doesn't change (SWR returns cached data when response is identical), React may skip re-render. The `suppressHydrationWarning` already on time elements handles SSR/client mismatch. For truly stale timestamps, a separate small interval or `useSyncExternalStore` with a clock could help, but with 2s polling this is negligible.
**Warning signs:** Timestamps stuck at old values.

### Pitfall 6: Tree Equivalence Daily Scoping
**What goes wrong:** Tree count reflects all-time CO2 instead of today's CO2.
**Why it happens:** The `calculateTreesEquivalent` function comment says "caller is responsible for passing only today-scoped events." With mock data, all events were passed. With live data from `GET /events`, the response includes events from all time.
**How to avoid:** Filter events by today's date before passing to `calculateTreesEquivalent`:
```typescript
const todayEvents = events.filter(e =>
  new Date(e.timestamp).toDateString() === new Date().toDateString()
);
const trees = calculateTreesEquivalent(todayEvents);
```
**Warning signs:** Tree count seems too high.

## Code Examples

### API Response Type Definitions
```typescript
// lib/types.ts -- add these alongside existing SortEvent
// Source: apps/api/schemas.py (exact field-for-field match)

export interface MetricsData {
  readonly total_items: number;
  readonly recycling_rate: number;
  readonly co2_saved_kg: number;
  readonly waste_diverted_kg: number;
  readonly avg_confidence: number;
  readonly uncertain_rate: number;
  readonly fallback_rate: number;
}

export interface CategoryBreakdown {
  readonly label: string;
  readonly count: number;
  readonly percentage: number;
}

export interface BreakdownData {
  readonly categories: readonly CategoryBreakdown[];
}
```

### Field Mapping: Mock Data to API Response
```typescript
// Current mock → API mapping for hero-impact-section.tsx
// heroMockData.recycledPercent  → metrics.recycling_rate * 100
// heroMockData.co2SavedKg      → metrics.co2_saved_kg
// heroMockData.totalItemsSorted → metrics.total_items
// heroMockData.wasteDivertedKg  → metrics.waste_diverted_kg
```

### Conditional Image Rendering (INTG-03)
```typescript
// For LatestItemCard and RecentItemsList
{event.image_url ? (
  <img
    src={event.image_url}
    alt={`Sorted ${event.label} item`}
    className="h-full w-full object-cover rounded-lg"
  />
) : (
  <CategoryIllustration category={event.label} size="lg" />
)}
```

### Stale Data Warning Banner (D-03)
```typescript
// A small banner component for stale data state
function StaleDataWarning({ lastUpdated }: { readonly lastUpdated: Date }) {
  const secondsAgo = Math.round((Date.now() - lastUpdated.getTime()) / 1000);
  return (
    <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
      Last updated {secondsAgo}s ago -- connection lost
    </div>
  );
}
```

### Empty State (D-04)
```typescript
function BackendEmptyState({ apiUrl }: { readonly apiUrl: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium">Waiting for backend connection...</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Make sure the API is running at{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{apiUrl}</code>
      </p>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useEffect` + `setInterval` polling | SWR `refreshInterval` | SWR 1.0 (2022) | Eliminates manual interval management, adds deduplication/caching |
| Separate loading state per request | SWR `isLoading` vs `isValidating` | SWR 2.0 (2023) | Distinguishes initial load from background revalidation |
| Manual fetch + JSON parsing | SWR global fetcher in SWRConfig | SWR 1.0 | Single fetcher definition shared across all hooks |

**Deprecated/outdated:**
- `useSWRImmutable`: Not relevant -- we want frequent revalidation, not immutable caching
- `swr/infinite`: Not needed -- no pagination in this phase

## Open Questions

1. **Whether to add `next/image` for Supabase Storage URLs**
   - What we know: When Pi sends real images, `image_url` will be a Supabase Storage public URL. `next/image` provides optimization but requires configuring `remotePatterns` in `next.config.ts`.
   - What's unclear: Whether the Supabase Storage URL domain is known at build time for `next/image` configuration.
   - Recommendation: Use a plain `<img>` tag for now. Add `next/image` optimization in Phase 10 (Visual Polish) if needed. This avoids config complexity and works immediately with any URL.

2. **Whether the backend needs to run during frontend development**
   - What we know: After this phase, the frontend will not work without the backend running (mock data imports removed from components).
   - What's unclear: Whether developers will always have the backend running locally.
   - Recommendation: The D-04 empty state handles this gracefully. The mock-data.ts file is preserved but not imported by components -- it can be re-enabled temporarily if needed.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 |
| Config file | `apps/web/vitest.config.ts` |
| Quick run command | `cd apps/web && npx vitest run --reporter=verbose` |
| Full suite command | `cd apps/web && npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INTG-01 | SWR provider configures refreshInterval: 2000 | unit | `cd apps/web && npx vitest run hooks/ -x` | No -- Wave 0 |
| INTG-02 | useMetrics hook returns typed metrics from /metrics | unit | `cd apps/web && npx vitest run hooks/use-metrics -x` | No -- Wave 0 |
| INTG-03 | useEvents hook returns typed events from /events | unit | `cd apps/web && npx vitest run hooks/use-events -x` | No -- Wave 0 |
| INTG-04 | useBreakdown hook returns typed breakdown from /metrics/breakdown | unit | `cd apps/web && npx vitest run hooks/use-breakdown -x` | No -- Wave 0 |
| HERO-05 | HeroImpactSection renders metrics from useMetrics, not mock data | integration | `cd apps/web && npx vitest run components/dashboard/hero-impact-section -x` | No -- Wave 0 |
| FEED-06 | LiveFeedSection renders events from useEvents, not mock data | integration | `cd apps/web && npx vitest run components/dashboard/live-feed-section -x` | No -- Wave 0 |
| WSTE-03 | Waste chart component renders from useBreakdown data | integration | `cd apps/web && npx vitest run components/dashboard/ -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `cd apps/web && npx vitest run --reporter=verbose`
- **Per wave merge:** `cd apps/web && npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `apps/web/hooks/__tests__/use-metrics.test.ts` -- covers INTG-02
- [ ] `apps/web/hooks/__tests__/use-events.test.ts` -- covers INTG-03
- [ ] `apps/web/hooks/__tests__/use-breakdown.test.ts` -- covers INTG-04
- [ ] SWR mock setup: mock `fetch` globally in test setup for SWR hooks
- [ ] Framework install: SWR must be installed (`npm install swr`) before tests can import hooks

## Sources

### Primary (HIGH confidence)
- SWR official docs (https://swr.vercel.app/docs/api) -- API reference, refreshInterval, options
- SWR revalidation docs (https://swr.vercel.app/docs/revalidation) -- automatic polling behavior
- SWR error handling docs (https://swr.vercel.app/docs/error-handling) -- error retry, onErrorRetry
- SWR global config docs (https://swr.vercel.app/docs/global-configuration) -- SWRConfig provider
- `apps/api/schemas.py` -- backend response model definitions (EventResponse, MetricsResponse, BreakdownResponse)
- `apps/api/routers/events.py`, `apps/api/routers/metrics.py` -- endpoint implementations confirming response shapes
- `apps/api/config.py` -- CORS configuration confirming localhost:3000 is allowed
- `apps/web/package.json` -- current dependency list (no data fetching library installed)
- `apps/web/lib/types.ts` -- existing SortEvent type definition with snake_case fields
- `apps/web/lib/mock-data.ts` -- current mock data structure showing field mappings
- `npm view swr version` -- confirmed 2.4.1 current

### Secondary (MEDIUM confidence)
- Next.js 16 environment variables docs (bundled in node_modules) -- `NEXT_PUBLIC_` prefix for client-side env vars

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- SWR is verified current (2.4.1), official docs reviewed, API matches project needs exactly
- Architecture: HIGH -- patterns derived from SWR official docs + existing codebase structure analysis
- Pitfalls: HIGH -- derived from actual codebase inspection (CORS config verified, mock data structure analyzed, component imports traced)

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable -- SWR is mature, API spec is locked)
