# Roadmap: Smart Waste Intelligence Platform

## Overview

Build a polished climate-tech SaaS dashboard that visualizes AI-powered trash sorting, prioritizing a working vertical slice (live feed end-to-end with mock data) before expanding to secondary pages and polish. The Pi hardware is deferred to v2 -- the dashboard and backend are built with seed data first, wired to Supabase, so the system is demo-ready the moment hardware comes online.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Frontend Shell and Navigation** - Next.js project with sidebar layout, routing, and eco-tech design system
- [ ] **Phase 2: Hero Impact Section** - Top-of-page impact metrics with CO2 saved, waste diverted, recycling rate, total items
- [ ] **Phase 3: Live Feed Components** - Prominent live feed with latest item image, labels, confidence, recent activity list
- [ ] **Phase 4: Dashboard Supporting Sections** - Waste composition chart, model performance card, KPI strip, sorting history
- [ ] **Phase 5: Backend API and Database** - FastAPI with all endpoints, Supabase Postgres schema, Storage bucket, seed data
- [ ] **Phase 6: Data Integration and Polling** - Wire frontend to live backend, 1-2s polling, all dashboard sections update in real time
- [ ] **Phase 7: Analytics Page** - Deeper category breakdowns, time-based trend charts, filterable event list
- [ ] **Phase 8: Impact Page** - Environmental equivalents, tangible comparisons, visually inspiring impact presentation
- [ ] **Phase 9: Model Detail and Settings Pages** - Confidence banding, distribution charts, device metadata, configuration view
- [ ] **Phase 10: Visual Polish and Demo Readiness** - Premium SaaS finish, consistency pass, demo loop validation

## Phase Details

### Phase 1: Frontend Shell and Navigation
**Goal**: Users see a professional SaaS application shell with working navigation between all pages
**Depends on**: Nothing (first phase)
**Requirements**: DASH-01, VISL-02
**Success Criteria** (what must be TRUE):
  1. App loads with a left sidebar showing navigation links for Dashboard, Analytics, Impact, Model, and Settings
  2. Clicking each nav item routes to the correct page (even if pages show placeholder content)
  3. UI uses shadcn/ui components with consistent styling across the shell
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Initialize Next.js project with TypeScript, Tailwind CSS, and shadcn/ui
- [x] 01-02-PLAN.md — Build app shell with sidebar, top bar, routing, and placeholder pages

### Phase 2: Hero Impact Section
**Goal**: Users immediately see inspiring environmental impact metrics as the first element on the dashboard
**Depends on**: Phase 1
**Requirements**: DASH-02, HERO-01, HERO-02, HERO-03, HERO-04, HERO-06, HERO-07, VISL-01, VISL-03, VISL-04
**Success Criteria** (what must be TRUE):
  1. Dashboard homepage displays hero impact section as the first visible element above the fold
  2. Hero shows total waste diverted (kg), CO2 saved (kg), recycling rate (%), and total items sorted -- using mock data
  3. Hero displays motivational message ("Great job! You've diverted X kg of waste today.") with illustrated eco background (sky, clouds, globe, leaves)
  4. Dashboard uses the eco-tech color palette (green primary, teal/blue accents, white cards)
  5. Typography is clean with strong visual hierarchy, cards have rounded corners and adequate whitespace
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — Hero impact section with motivational message, SVG illustration, and 3 stat cards

### Phase 3: Live Feed Components
**Goal**: Users can see the most recently sorted item with its image, classification details, and a scrollable activity log
**Depends on**: Phase 2
**Requirements**: DASH-03, FEED-01, FEED-02, FEED-03, FEED-04, FEED-05, FEED-07
**Success Criteria** (what must be TRUE):
  1. Dashboard homepage displays a prominent live feed section with a large image preview of the latest sorted item
  2. Each feed item shows label, color-coded bin badge (green=Recycled, brown=Composted, red=Trash), confidence score, and relative timestamp
  3. Recent activity list shows the last 10+ items with thumbnails below or beside the latest item
  4. The newest event is visually highlighted with a green status dot indicator
  5. Live feed displays "Equivalent to planting X trees" environmental translation badge
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — Data foundation: types, category config, relative time formatter, mock events, SVG illustrations
- [x] 03-02-PLAN.md — Feed components (LatestItemCard, RecentItemsList, LiveFeedSection) and dashboard page integration

### Phase 4: Dashboard Supporting Sections
**Goal**: Users see the full dashboard homepage with waste breakdown chart, model performance card, KPI strip, and sorting history
**Depends on**: Phase 3
**Requirements**: DASH-04, DASH-05, DASH-06, DASH-07, WSTE-01, WSTE-02, MODL-01, MODL-02, MODL-03
**Success Criteria** (what must be TRUE):
  1. Dashboard displays a KPI summary strip with key metrics
  2. Waste composition is shown as a pie or donut chart with category labels and percentages
  3. Model performance card shows average confidence, uncertain prediction rate, and fallback/default bin rate
  4. Recent sorting history list is visible on the dashboard homepage
  5. All sections render with mock data and look cohesive with the existing hero and live feed
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md — Metrics computation library, KPI chip strip in top bar, waste composition donut chart card
- [x] 04-02-PLAN.md — Model performance card with confidence distribution bar, dashboard page wiring

### Phase 5: Backend API and Database
**Goal**: A running FastAPI backend with all endpoints, Supabase Postgres tables, image storage, and seed data for demo
**Depends on**: Nothing (can run in parallel with frontend phases, but listed here for vertical slice ordering)
**Requirements**: API-01, API-02, API-03, API-04, API-05, API-06, DB-01, DB-02, DB-03, SEED-01, SEED-02, SEED-03
**Success Criteria** (what must be TRUE):
  1. GET /health returns a 200 response with service status
  2. POST /events accepts a sort event with image upload and metadata, writes to Supabase, returns the created event
  3. GET /events returns recent events sorted newest-first with a limit parameter; GET /metrics returns aggregate metrics; GET /metrics/breakdown returns category counts; GET /devices returns device list
  4. sort_events and devices tables exist in Supabase Postgres with all specified columns
  5. Supabase Storage bucket is configured and event images are stored and retrievable via URL
  6. Seed script populates the database with realistic mock events and sample images for demo without Pi hardware
**Plans**: 3 plans

Plans:
- [x] 05-01-PLAN.md — FastAPI project skeleton with config, DB client, constants, schemas, health endpoint, SQL migration, and test infrastructure
- [x] 05-02-PLAN.md — All API endpoints (POST/GET events, metrics, breakdown, devices) with service layer and tests
- [x] 05-03-PLAN.md — Idempotent seed script for demo data with Supabase verification checkpoint

### Phase 6: Data Integration and Polling
**Goal**: The dashboard is fully wired to the live backend -- all sections update automatically every 1-2 seconds
**Depends on**: Phase 4, Phase 5
**Requirements**: HERO-05, FEED-06, WSTE-03, INTG-01, INTG-02, INTG-03, INTG-04
**Success Criteria** (what must be TRUE):
  1. Frontend polls the backend every 1-2 seconds for fresh data without manual refresh
  2. Hero metrics update automatically when new events are ingested
  3. Live feed refreshes automatically, showing new events with images from Supabase Storage
  4. Waste composition chart updates when new events arrive
  5. Adding a new event via POST /events causes all dashboard sections to reflect the change within 2 seconds
**Plans**: 2 plans

Plans:
- [x] 06-01-PLAN.md — Install SWR, create API types, fetcher, SWR provider, skeleton component, wire into layout
- [x] 06-02-PLAN.md — Create hooks (useMetrics, useEvents, useBreakdown), rewire hero + feed + waste chart from mock to live data

### Phase 7: Analytics Page
**Goal**: Users can explore deeper category breakdowns, time-based trends, and filter through sorting history
**Depends on**: Phase 6
**Requirements**: ANLY-01, ANLY-02, ANLY-03
**Success Criteria** (what must be TRUE):
  1. Analytics page shows deeper category breakdown charts beyond the homepage summary
  2. Analytics page shows time-based sorting trend charts (volume over time)
  3. Analytics page shows a recent event list with filtering capability
**Plans**: 1 plan

Plans:
- [ ] 07-01: TBD

### Phase 8: Impact Page
**Goal**: Users feel emotionally compelled by tangible environmental equivalents of the system's impact
**Depends on**: Phase 6
**Requirements**: IMPT-01, IMPT-02, IMPT-03
**Success Criteria** (what must be TRUE):
  1. Impact page shows total CO2 saved with environmental equivalents (trees saved, miles driven avoided)
  2. Impact page shows total waste diverted with tangible comparisons (e.g., trash bags, elephants)
  3. Impact metrics are visually inspiring, large, and prominent -- not buried in tables
**Plans**: 1 plan

Plans:
- [ ] 08-01-PLAN.md — Impact equivalents library, hero banner, CO2 equivalents grid, waste diversion stats, wired to live metrics

### Phase 9: Model Detail and Settings Pages
**Goal**: Users can inspect model performance in depth and view device configuration
**Depends on**: Phase 6
**Requirements**: MDTL-01, MDTL-02, MDTL-03, STNG-01, STNG-02
**Success Criteria** (what must be TRUE):
  1. Model page shows average confidence with confidence banding visualization
  2. Model page shows uncertain rate, fallback rate details, and a confidence distribution chart
  3. Settings page shows registered device metadata (name, location, status)
  4. Settings page allows viewing device configuration
**Plans**: 2 plans

Plans:
- [ ] 09-01-PLAN.md — Model detail page with confidence gauge, distribution chart, and detailed metric cards
- [ ] 09-02-PLAN.md — Settings page with device list, metadata display, and configuration panel

### Phase 10: Visual Polish and Demo Readiness
**Goal**: The product looks and feels like a premium climate-tech SaaS product, ready for judges
**Depends on**: Phase 7, Phase 8, Phase 9
**Requirements**: VISL-05
**Success Criteria** (what must be TRUE):
  1. Overall aesthetic is premium SaaS -- not cartoonish, not sterile -- consistently across all pages
  2. The demo loop works: adding an event causes hero metrics, live feed, waste breakdown, and charts to update within 2 seconds
  3. No visual inconsistencies, broken layouts, or placeholder content remain
**Plans**: 1 plan

Plans:
- [ ] 10-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10
(Phases 7, 8, 9 can execute in any order after Phase 6)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Frontend Shell and Navigation | 2/2 | Complete | 2026-03-21 |
| 2. Hero Impact Section | 1/1 | Complete | 2026-03-21 |
| 3. Live Feed Components | 0/2 | Not started | - |
| 4. Dashboard Supporting Sections | 0/2 | Not started | - |
| 5. Backend API and Database | 3/3 | Complete | 2026-03-21 |
| 6. Data Integration and Polling | 0/2 | Not started | - |
| 7. Analytics Page | 0/1 | Not started | - |
| 8. Impact Page | 0/1 | Not started | - |
| 9. Model Detail and Settings Pages | 0/2 | Not started | - |
| 10. Visual Polish and Demo Readiness | 0/1 | Not started | - |
