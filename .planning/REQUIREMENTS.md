# Requirements: Smart Waste Intelligence Platform

**Defined:** 2026-03-21
**Core Value:** When a user drops trash into the sorter, the dashboard updates within 2 seconds showing the sorted item, environmental impact, and live feed.

## v1 Requirements

### Dashboard Layout

- [ ] **DASH-01**: App has a left sidebar with navigation to Dashboard, Analytics, Impact, Model, Settings pages
- [ ] **DASH-02**: Dashboard homepage displays hero impact section as first visible element above the fold
- [ ] **DASH-03**: Dashboard homepage displays prominent live feed section with latest sorted item
- [ ] **DASH-04**: Dashboard homepage displays KPI summary strip
- [ ] **DASH-05**: Dashboard homepage displays waste composition chart
- [ ] **DASH-06**: Dashboard homepage displays model performance summary card
- [ ] **DASH-07**: Dashboard homepage displays recent sorting history list

### Hero Impact

- [ ] **HERO-01**: Hero section shows total waste diverted in kg
- [ ] **HERO-02**: Hero section shows total CO2 saved in kg
- [ ] **HERO-03**: Hero section shows recycling rate as percentage
- [ ] **HERO-04**: Hero section shows total items sorted count
- [ ] **HERO-05**: Hero metrics update automatically when new events arrive (1-2s polling)

### Live Feed

- [ ] **FEED-01**: Live feed shows the latest sorted item with large image preview
- [ ] **FEED-02**: Live feed shows item label, routed bin badge, and confidence score
- [ ] **FEED-03**: Live feed shows timestamp for each item
- [ ] **FEED-04**: Live feed shows a recent activity list of last 10+ items
- [ ] **FEED-05**: Live feed highlights newest event visually
- [ ] **FEED-06**: Live feed refreshes automatically every 1-2 seconds

### Waste Breakdown

- [ ] **WSTE-01**: Waste composition displayed as pie or donut chart
- [ ] **WSTE-02**: Chart shows category labels and percentages
- [ ] **WSTE-03**: Chart updates when new events arrive

### Model Performance

- [ ] **MODL-01**: Model summary shows average confidence score
- [ ] **MODL-02**: Model summary shows uncertain prediction rate
- [ ] **MODL-03**: Model summary shows fallback/default bin rate

### Analytics Page

- [ ] **ANLY-01**: Analytics page shows deeper category breakdown charts
- [ ] **ANLY-02**: Analytics page shows time-based sorting trend charts
- [ ] **ANLY-03**: Analytics page shows recent event list with filtering

### Impact Page

- [ ] **IMPT-01**: Impact page shows total CO2 saved with environmental equivalents (trees, miles driven)
- [ ] **IMPT-02**: Impact page shows total waste diverted with tangible comparisons
- [ ] **IMPT-03**: Impact metrics are visually inspiring and prominent

### Model Detail Page

- [ ] **MDTL-01**: Model page shows average confidence with confidence banding visualization
- [ ] **MDTL-02**: Model page shows uncertain rate and fallback rate details
- [ ] **MDTL-03**: Model page shows confidence distribution chart

### Settings Page

- [ ] **STNG-01**: Settings page shows registered device metadata (name, location, status)
- [ ] **STNG-02**: Settings page allows viewing device configuration

### Backend API

- [ ] **API-01**: GET /health returns service health status
- [ ] **API-02**: POST /events accepts sort event with image upload and metadata
- [ ] **API-03**: GET /events returns recent events sorted by newest first with limit parameter
- [ ] **API-04**: GET /metrics returns aggregate metrics (total items, recycling rate, CO2 saved, waste diverted, avg confidence, uncertain rate, fallback rate)
- [ ] **API-05**: GET /metrics/breakdown returns category counts and percentages
- [ ] **API-06**: GET /devices returns registered source devices

### Database

- [ ] **DB-01**: sort_events table stores id, timestamp, label, routed_bin, confidence, image_url, waste_diverted_kg, co2_saved_kg, fallback_used, source_device_id
- [ ] **DB-02**: devices table stores id, name, location_name, status, created_at
- [ ] **DB-03**: Supabase Storage bucket configured for item snapshot images

### Data Integration

- [ ] **INTG-01**: Frontend polls backend every 1-2 seconds for fresh data
- [ ] **INTG-02**: Hero metrics wired to live /metrics endpoint
- [ ] **INTG-03**: Live feed wired to live /events endpoint with images from Supabase Storage
- [ ] **INTG-04**: Charts wired to live /metrics/breakdown endpoint

### Seed Data

- [ ] **SEED-01**: Realistic seed data generator produces mock sort events with varied labels, confidence scores, and timestamps
- [ ] **SEED-02**: Seed data includes representative item images in Supabase Storage
- [ ] **SEED-03**: Seed script can populate database for demo without Pi hardware

### Visual Design

- [ ] **VISL-01**: Dashboard uses eco-tech color palette (green primary, teal/blue accents, white cards)
- [ ] **VISL-02**: UI uses shadcn/ui components with consistent styling
- [ ] **VISL-03**: Typography is clean with strong visual hierarchy
- [ ] **VISL-04**: Cards use rounded corners, subtle shadows, adequate whitespace
- [ ] **VISL-05**: Overall aesthetic is premium SaaS, not cartoonish or sterile

## v2 Requirements

### Pi Runtime

- **PI-01**: Pi captures image from camera when item is staged
- **PI-02**: Pi runs YOLO inference locally and produces label + confidence
- **PI-03**: Pi applies confidence threshold and fallback logic for low-confidence items
- **PI-04**: Pi triggers servo to route item to correct bin
- **PI-05**: Pi packages event data and uploads image + metadata to backend
- **PI-06**: Pi supports configurable settings (camera, thresholds, backend URL)

### Advanced Features

- **ADV-01**: Trend charts showing sorting volume over day/week/session
- **ADV-02**: Multiple device/location support with facility switcher
- **ADV-03**: Contamination rate and fallback route statistics
- **ADV-04**: Count-up animations on hero impact numbers
- **ADV-05**: Daily impact rollup table for historical summaries

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication / accounts | Hackathon demo — no login required |
| WebSocket real-time updates | Polling at 1-2s is simpler and sufficient for demo |
| Video streaming from Pi | Event-based snapshots only — one image per sort |
| Mid-air trash classification | Hardware uses staged single-item approach |
| Mobile app | Web-only for hackathon |
| Multi-tenant / multi-org | Single deployment for demo |
| Payment / billing | Not applicable |
| OAuth / social login | No auth needed |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DASH-01 | Phase 1 | Pending |
| DASH-02 | Phase 2 | Pending |
| DASH-03 | Phase 3 | Pending |
| DASH-04 | Phase 4 | Pending |
| DASH-05 | Phase 4 | Pending |
| DASH-06 | Phase 4 | Pending |
| DASH-07 | Phase 4 | Pending |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| HERO-05 | Phase 6 | Pending |
| FEED-01 | Phase 3 | Pending |
| FEED-02 | Phase 3 | Pending |
| FEED-03 | Phase 3 | Pending |
| FEED-04 | Phase 3 | Pending |
| FEED-05 | Phase 3 | Pending |
| FEED-06 | Phase 6 | Pending |
| WSTE-01 | Phase 4 | Pending |
| WSTE-02 | Phase 4 | Pending |
| WSTE-03 | Phase 6 | Pending |
| MODL-01 | Phase 4 | Pending |
| MODL-02 | Phase 4 | Pending |
| MODL-03 | Phase 4 | Pending |
| ANLY-01 | Phase 7 | Pending |
| ANLY-02 | Phase 7 | Pending |
| ANLY-03 | Phase 7 | Pending |
| IMPT-01 | Phase 8 | Pending |
| IMPT-02 | Phase 8 | Pending |
| IMPT-03 | Phase 8 | Pending |
| MDTL-01 | Phase 9 | Pending |
| MDTL-02 | Phase 9 | Pending |
| MDTL-03 | Phase 9 | Pending |
| STNG-01 | Phase 9 | Pending |
| STNG-02 | Phase 9 | Pending |
| API-01 | Phase 5 | Pending |
| API-02 | Phase 5 | Pending |
| API-03 | Phase 5 | Pending |
| API-04 | Phase 5 | Pending |
| API-05 | Phase 5 | Pending |
| API-06 | Phase 5 | Pending |
| DB-01 | Phase 5 | Pending |
| DB-02 | Phase 5 | Pending |
| DB-03 | Phase 5 | Pending |
| INTG-01 | Phase 6 | Pending |
| INTG-02 | Phase 6 | Pending |
| INTG-03 | Phase 6 | Pending |
| INTG-04 | Phase 6 | Pending |
| SEED-01 | Phase 5 | Pending |
| SEED-02 | Phase 5 | Pending |
| SEED-03 | Phase 5 | Pending |
| VISL-01 | Phase 2 | Pending |
| VISL-02 | Phase 1 | Pending |
| VISL-03 | Phase 2 | Pending |
| VISL-04 | Phase 2 | Pending |
| VISL-05 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 56 total
- Mapped to phases: 56
- Unmapped: 0

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after roadmap creation (phase assignments refined)*
