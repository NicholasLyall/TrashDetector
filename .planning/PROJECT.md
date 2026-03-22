# Smart Waste Intelligence Platform

## What This Is

A real-time climate-tech SaaS dashboard that visualizes AI-powered trash sorting from a Raspberry Pi hardware system. The platform combines a computer vision perception model (YOLO on Pi), a FastAPI backend with Supabase, and a polished Next.js analytics dashboard — designed to feel like a production SaaS product, not a student prototype. Built for a hackathon but with product-level polish.

## Core Value

When a user drops trash into the sorter, the dashboard updates within 2 seconds showing the sorted item, environmental impact metrics, and live feed — making judges immediately understand this is a real, working climate-tech system.

## Requirements

### Validated

- [x] Left sidebar SaaS navigation (Dashboard, Analytics, Impact, Model, Settings) — Validated in Phase 1: Frontend Shell and Navigation
- [x] shadcn/ui components with consistent styling — Validated in Phase 1: Frontend Shell and Navigation
- [x] Hero impact section showing CO2 saved, waste diverted, recycling rate, total items — Validated in Phase 2: Hero Impact Section

- [x] Prominent live feed with latest sorted item image, label, confidence, bin badge — Validated in Phase 3: Live Feed Components
- [x] Recent sorting history list — Validated in Phase 3: Live Feed Components

### Active
- [x] Real-time dashboard updates via polling (1-2 second refresh) — Validated in Phase 6: Data Integration and Polling
- [x] Waste composition breakdown visualization (pie/bar chart) — Validated in Phase 6: Data Integration and Polling
- [ ] Model performance summary (avg confidence, uncertain rate, fallback rate)
- [x] Left sidebar SaaS navigation (Dashboard, Analytics, Impact, Model, Settings) — see Validated

- [ ] FastAPI backend with event ingestion, metrics, and breakdown endpoints
- [ ] Supabase Postgres schema (sort_events, devices tables)
- [ ] Supabase Storage for captured item images
- [ ] Event ingestion API accepting image + metadata from Pi
- [x] Analytics page with deeper category charts and time-based trends — Validated in Phase 7: Analytics Page
- [x] Impact page with environmental equivalents (trees saved, etc.) — Validated in Phase 8: Impact Page
- [ ] Model performance page with confidence banding
- [ ] Settings page with device metadata
- [ ] Seed/mock data for development before Pi is ready
- [ ] Pi runtime for camera capture, YOLO inference, servo control, event upload

### Out of Scope

- User authentication / accounts — hackathon demo, no login needed
- WebSocket real-time — polling is simpler and sufficient for demo
- Video streaming from Pi — event-based snapshots only
- Mid-air classification — staging chamber design assumed
- Mobile app — web-only
- Multi-tenant / multi-organization — single deployment
- Payment / billing — not applicable

## Context

- **Hackathon project** — judges are the primary audience. Must communicate value in 5 seconds.
- **Pi hardware not ready yet** — build dashboard and backend with mock data first, wire Pi later.
- **Supabase project exists** — "trash-detection-project" under Titan org, accessible via MCP server.
- **Design direction** — Stripe Dashboard x Climate Tech x Real-Time AI Hardware aesthetic.
- **Comprehensive docs exist** — PRD, Architecture, API Spec, Data Model, UI/UX Spec, Hardware Context, Model Context all in `/docs/`.
- **Mockup reference** — dashboard layout mockup exists as style guide.

## Constraints

- **Tech Stack**: Next.js + React + TypeScript + Tailwind + shadcn/ui + Recharts (frontend), FastAPI (backend), Supabase Postgres + Storage (data), Python + YOLO (Pi) — confirmed, do not change without strong reason
- **Timeline**: Hackathon timeline — ship fast, polish matters
- **Hardware**: Pi sorter uses staged single-item classification, not mid-air detection
- **Hosting**: Vercel (frontend), Render/Railway (backend), Supabase (DB/storage)
- **Real-time**: Polling every 1-2 seconds, no WebSocket complexity
- **Design**: Premium eco-tech SaaS, not cartoonish, not sterile — green/teal palette, white cards, clean hierarchy

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Polling over WebSocket | Simpler, hackathon-reliable, still feels live at 1-2s | — Pending |
| Event-based snapshots over video | One image per sorted item, simpler pipeline | — Pending |
| Supabase over raw Postgres | Managed DB + Storage reduces backend overhead | — Pending |
| Mock data first, Pi later | Hardware not ready, unblock dashboard development | — Pending |
| shadcn/ui component library | Polished, accessible, Tailwind-native | — Pending |
| Fine granularity phases | Complex multi-system project benefits from focused phases | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 after Phase 8 completion*
