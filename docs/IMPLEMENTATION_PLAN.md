# Implementation Plan

## Phase 1: Frontend shell and mock data
- scaffold Next.js app
- create SaaS shell with left nav
- build homepage layout
- use mock recent events and metrics

## Phase 2: Backend and database
- create FastAPI app
- implement `/health`, `/events`, `/metrics`
- set up Supabase tables and storage

## Phase 3: Pi integration
- create event ingestion client on Pi
- upload snapshots
- create finalized event posts to backend

## Phase 4: Live data wiring
- replace mock data with real backend polling
- show recent event images
- wire hero metrics to live aggregates

## Phase 5: Polish
- refine charts
- improve motion
- tighten spacing and typography
- ensure demo loop is robust
