# Phase 10: Visual Polish and Demo Readiness - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish the existing dashboard to premium SaaS quality and make it demo-ready for judges. No new features — refine what exists across all 5 pages (Dashboard, Analytics, Impact, Model, Settings). Ensure the live demo loop works end-to-end: trigger event → dashboard updates within 2 seconds.

</domain>

<decisions>
## Implementation Decisions

### Demo Flow Choreography
- **D-01:** Demo events triggered via a visible demo button on the dashboard UI — no terminal switching needed
- **D-02:** Presenter sequence: Dashboard first (hero + live feed) → trigger event → show update → navigate Analytics → Impact → Model
- **D-03:** Reset capability available but optional — both fresh-start reset script and accumulate mode supported
- **D-04:** New event arrival indicated by a subtle green pulse/highlight on the latest item card and hero metrics — no toast notifications

### Animation and Transitions
- **D-05:** Overall motion level is subtle and professional — Stripe dashboard style, motion serves clarity, never distracts
- **D-06:** Animated counters on hero metrics and KPIs — numbers count up/down smoothly when values change
- **D-07:** Fade transition between pages (150-200ms) when navigating via sidebar
- **D-08:** Charts render instantly — no draw-in entrance animations

### Visual Consistency
- **D-09:** Light mode only — do not spend polish time on dark mode
- **D-10:** Placeholder images replaced with category-specific styled icons (bottle icon for plastic, newspaper for paper, etc.) — not blank/broken images or stock photos
- **D-11:** Sidebar active page indicator needs polish — ensure clear visual distinction for current page
- **D-12:** General consistency pass across all pages for spacing, typography weight, card shadows, color alignment

### Demo Environment
- **D-13:** Optimized for laptop screen (13-15") — judges gather around or projector at native resolution
- **D-14:** Backend required during demo — no offline fallback, existing error states are sufficient
- **D-15:** Light seed data (10-20 events) for demo start — enough for charts and history without being overwhelming
- **D-16:** "Demo Mode" indicator shown only when using fallback mock data (backend unreachable), not during normal operation

### Claude's Discretion
- Exact pulse animation timing and color intensity
- Category icon selection and styling approach
- Specific spacing/shadow adjustments found during consistency audit
- Fade transition implementation approach with Next.js app router
- Counter animation library or implementation (CSS vs. JS)
- Demo button placement and styling (prominent but not ugly)
- Reset script implementation details

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements are fully captured in decisions above and CLAUDE.md design direction.

### Design direction
- `CLAUDE.md` §Design Direction — color palette, tone, visual style references, anti-patterns
- `CLAUDE.md` §Critical UX Priorities — homepage priority order, core sections
- `CLAUDE.md` §Demo Requirements — demo loop expectations, what judges should see

### Existing UI contracts
- `.planning/phases/07-analytics-page/07-UI-SPEC.md` — Analytics page spacing, typography, color contracts (most recent UI-SPEC)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/web/components/ui/skeleton.tsx` — Base skeleton component with `animate-pulse`
- `apps/web/components/dashboard/backend-empty-state.tsx` — Error state for backend connection issues
- `apps/web/components/dashboard/stale-data-warning.tsx` — Amber banner with live counter for stale data
- `HeroSkeleton`, `FeedSkeleton` — Loading states matching component shapes
- `apps/web/app/globals.css` — Full eco color palette (`--eco-green`, `--eco-teal`, `--eco-blue`, `--eco-bg`) and custom animations (`float`, `cloud-drift`)

### Established Patterns
- CSS custom properties for all colors — changes propagate globally
- shadcn/ui components: Button, Card, Badge, Tooltip, Separator, Avatar, Sheet, Table, Select
- `apps/web/lib/mock-data.ts` — Mock data utilities (`ITEM_NAMES`, `formatNumber`, `sortEventsMockData`)
- SWR-based hooks (`useEvents`, `useBreakdown`, `useMetrics`) for data fetching with polling
- Responsive layout: desktop sidebar (256px fixed) + mobile Sheet drawer

### Integration Points
- Demo button needs to POST to backend `/events` endpoint
- Animated counters hook into existing `useMetrics()` and hero section data
- Page transitions affect `apps/web/app/layout.tsx` or individual page components
- Category icons need to integrate with existing `CATEGORY_CONFIG` in waste-composition-card

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-visual-polish-and-demo-readiness*
*Context gathered: 2026-03-21*
