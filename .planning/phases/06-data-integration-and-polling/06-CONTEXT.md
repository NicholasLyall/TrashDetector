# Phase 6: Data Integration and Polling - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire every dashboard section to the live FastAPI backend with 1-2 second polling. Hero metrics, live feed, waste composition chart, and KPI strip all update automatically without manual refresh. Mock data is replaced by real API calls.

Requirements covered: HERO-05, FEED-06, WSTE-03, INTG-01, INTG-02, INTG-03, INTG-04.

</domain>

<decisions>
## Implementation Decisions

### Loading states
- **D-01:** Skeleton loaders on initial page load — shimmer placeholders matching the shape of each section (hero stat cards, feed cards, chart area) until first data fetch completes
- **D-02:** Each section manages its own loading state independently (hero skeletons, feed skeletons, chart skeleton) so sections can render as their data arrives

### Error & disconnection behavior
- **D-03:** When backend becomes unreachable during operation, show stale data (last successfully fetched values) with a subtle toast or banner: "Last updated Xs ago — connection lost"
- **D-04:** When backend has never been reachable (first load, API not running), show skeletons for ~5 seconds then transition to a friendly empty state: "Waiting for backend connection..." with the configured API URL displayed for debugging
- **D-05:** Polling continues attempting reconnection in the background — dashboard auto-recovers when backend comes back

### Connection status indicator
- **D-06:** No visible connection status indicator during normal operation — only surface status when errors occur (via stale-data warning per D-03 or empty state per D-04)

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

</decisions>

<specifics>
## Specific Ideas

- The dashboard should feel resilient — never show a broken or empty state during a demo. Stale data is better than no data.
- The "Waiting for backend connection..." empty state helps developers during setup without looking like a crash
- Skeleton loaders matching section shapes (not a generic spinner) communicate that the app is well-built and loading specific content

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Backend API contract
- `docs/API_SPEC.md` — All endpoint definitions and response shapes that frontend must consume
- `apps/api/schemas.py` — Pydantic response models (EventResponse, MetricsResponse, BreakdownResponse, DeviceResponse) defining exact field names and types

### Data model
- `docs/DATA_MODEL.md` — sort_events and devices table schemas, event field semantics

### Frontend components to wire
- `apps/web/components/dashboard/hero-impact-section.tsx` — Currently imports from mock-data.ts, needs rewiring to /metrics
- `apps/web/lib/mock-data.ts` — Current mock data module to be replaced by API hooks
- `apps/web/app/page.tsx` — Dashboard homepage that assembles all sections

### Prior phase decisions
- `.planning/phases/05-backend-api-and-database/05-CONTEXT.md` — Category system (D-01–D-07), image upload flow (D-08–D-11), environmental impact calculations (D-12–D-15)
- `.planning/phases/02-hero-impact-section/02-CONTEXT.md` — Hero layout (D-01–D-06), daily scoping (D-03), mock data approach (D-13)
- `.planning/phases/03-live-feed-components/03-CONTEXT.md` — Feed category presentation (D-01–D-04), mock image strategy (D-05–D-09), tree equivalence (D-10–D-13)

### Architecture
- `docs/ARCHITECTURE.md` §4 (Realtime Strategy) — Polling approach that this phase implements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Mock data module** (`lib/mock-data.ts`): Contains `heroMockData` and `formatNumber()` — structure shows the data shape components expect
- **cn() utility** (`lib/utils.ts`): clsx + tailwind-merge for conditional class composition
- **shadcn/ui Skeleton** component may be available or easily added from shadcn registry

### Established Patterns
- **Component location**: Feature components in `components/dashboard/`, primitives in `components/ui/`
- **Client components**: `"use client"` directive on components with hooks/interactivity
- **Immutability**: `as const` for constants, readonly types
- **CSS variables**: `hsl(var(--name))` pattern for theming, oklch color space
- **Backend CORS**: Already configured with `cors_origins` setting (defaults to `http://localhost:3000`)

### Integration Points
- **HeroImpactSection** imports `heroMockData` → rewire to `GET /metrics` response
- **Field mapping**: `heroMockData.recycledPercent` → `metrics.recycling_rate * 100`, `heroMockData.co2SavedKg` → `metrics.co2_saved_kg`, `heroMockData.totalItemsSorted` → `metrics.total_items`, `heroMockData.wasteDivertedKg` → `metrics.waste_diverted_kg`
- **Backend config** (`apps/api/config.py`): Uses Pydantic BaseSettings with `.env` file — frontend will need corresponding env var for API URL
- **No data-fetching libraries** currently installed — Phase 6 introduces the data layer

</code_context>

<deferred>
## Deferred Ideas

- Count-up animations on hero numbers when values change — Phase 10 Visual Polish (ADV-04)
- WebSocket real-time updates — out of scope, polling is sufficient for demo
- Multiple device switching / facility selector — v2 feature (ADV-02)

</deferred>

---

*Phase: 06-data-integration-and-polling*
*Context gathered: 2026-03-21*
