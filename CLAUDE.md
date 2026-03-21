# CLAUDE.md

## Project Identity

You are building **Smart Waste Intelligence Platform**, a hackathon-ready but product-minded system that combines:

- a **hardware smart trash sorter**,
- a **computer vision perception model** running on a Raspberry Pi,
- and a **beautiful, earth-themed, SaaS-style analytics dashboard**.

This is not just a toy detector and not just a dashboard mockup. The goal is to produce a polished end-to-end system that feels like a real climate-tech SaaS product with live hardware integration.

## Core Product Story

The product should communicate four things immediately:

1. **Impact** — how much waste and CO2 the system has diverted or saved.
2. **Live operation** — users can see recent items being sorted in real time.
3. **Intelligence** — the system understands what is being thrown away.
4. **Credibility** — the product shows model confidence and operational metrics.

When a user lands on the dashboard, they should feel:

- “This is making a real environmental impact.”
- “This system is working right now.”
- “This looks like a real SaaS product, not a student prototype.”

## High-Level Project Scope

### Hardware side
A staged trash sorting system made from a trash can, cardboard, servos, glue, and optionally some 3D-printed parts.

Important constraint: **do not design around mid-air sorting**.

The system should assume that direct high-speed classification of tumbling trash is unreliable for a student build. The physical system should instead use a **staging or flow-control approach** so items become classifiable one at a time.

Recommended hardware design philosophy:

- Top opening accepts multiple items.
- Funnel or queueing geometry reduces them toward a staging chamber.
- One item at a time is presented to the camera.
- YOLO model classifies the item.
- Servo-controlled diverter or gate routes it.
- Pi sends an event and snapshot to the backend.

### Software side
The software product has two major components:

1. **Pi-side perception/control runtime**
2. **Web dashboard + backend analytics platform**

## Confirmed Tech Stack

Use this stack unless a very strong reason exists to change it.

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

### Backend
- FastAPI (Python)

### Database
- Supabase Postgres

### Storage
- Supabase Storage for captured images

### Raspberry Pi Runtime
- Python
- OpenCV
- Ultralytics YOLO
- GPIO / servo control
- HTTP requests to backend

### Hosting
- Vercel for frontend
- Render or Railway for backend
- Supabase for DB and storage

## Design Direction

The dashboard should feel:

- **professional**
- **scientific**
- **clean and premium**
- **slightly earth-themed**
- **SaaS-like, with a left nav**

Visual style references already discussed:

- GoHighLevel-like left sidebar layout
- Clean card-based SaaS dashboard
- Earth/climate palette inspired by the selected banner image and later dashboard mockups
- A balance between lively and polished: not sterile, not childish

### Color direction
Use a palette in this family:

- primary green
- teal / blue accents
- white cards
- light neutral or softly tinted background
- subtle gradients for hero and impact sections

### Tone
Avoid:

- overly cartoonish treatment
- cluttered analytics pages
- excessive dense technical charts

Prefer:

- strong typography
- clear hierarchy
- rounded corners
- whitespace
- subtle motion
- premium climate-tech look

## Critical UX Priorities

### Homepage priority order
The homepage must prioritize the following:

1. **Hero impact section** at the top
2. **Live feed** prominently on the first page
3. **Quick KPI strip**
4. **Waste composition summary**
5. **Model performance summary**

Sorting percentages and deeper analytics can live further down the page or on a secondary tab, but the homepage must make impact and real-time operation obvious immediately.

### Core homepage sections
#### 1. Hero Impact Section
This should be the first thing visible.

Show:
- total waste diverted
- CO2 saved
- recycling rate
- total items processed

This section should feel inspiring and high-level.

#### 2. Live Feed
This is one of the most important sections and should be more prominent than a typical analytics side panel.

The live feed should include:
- a large “Latest Sorted Item” area with image
- label
- bin destination
- confidence
- timestamp
- a recent activity list underneath or beside it

This section should clearly show that the hardware system is operating in real time.

#### 3. Waste Breakdown
Use a pie or bar chart to summarize category counts.

#### 4. Model Performance
Keep this understandable and not too academic.

Good metrics:
- average confidence
- uncertain rate
- fallback/default bin rate

Avoid making the page look like a research paper.

## Product Features to Build

### Required
- live feed of sorted items with images
- real-time metrics updates every 1–2 seconds
- hero impact section with environmental equivalents
- waste composition visualization
- model performance summary
- left sidebar SaaS navigation
- recent sorting history

### Nice-to-have if time permits
- trend charts over time
- multiple device/location support
- contamination rate or fallback route stats
- user accounts
- facility/location switcher
- impact comparisons over day/week/session

## Data Flow Requirements

### End-to-end flow
1. User drops trash into sorter.
2. Hardware system stages a single item.
3. Pi captures an image.
4. YOLO predicts a class.
5. Sorter routes the item.
6. Pi stores or uploads a snapshot.
7. Pi sends an event to the backend.
8. Backend writes event metadata to Postgres and image to storage.
9. Frontend polls the backend and refreshes the live feed and metrics.

### Event schema expectations
Every sorted item should produce an event with at least:

- id
- timestamp
- label
- routed_bin
- confidence
- image_url
- waste_diverted_kg
- co2_saved_kg
- source_device_id
- fallback_used (boolean)

## Hardware Assumptions That Must Inform The Software

This matters because the dashboard and backend should reflect real physical behavior.

### Important physical assumptions
- The system should be designed for **single-item classification after staging**, not chaotic in-air multi-item classification.
- Multiple items may be dropped into the top opening, but the physical system should queue or funnel them into a single-item staging chamber.
- The live feed reflects **final sorted events**, not every raw camera frame.
- Backend receives one finalized event per sorted item.

### Mechanical guidance
If implementation details are needed for mock data or future simulation, assume one of these practical strategies:
- funnel + narrow gate
- staging chamber + trap door
- servo-controlled diverter

## Perception Model Context

### Current plan
- Use Ultralytics YOLO
- Train/fine-tune off-device
- Deploy optimized inference to Raspberry Pi
- Prefer event-based snapshots over video streaming to dashboard

### Practical model constraints
This is a physical sorter, not a benchmark challenge.
Optimize for:
- robust inference on a fixed camera angle
- reliable classes that match routing decisions
- confidence thresholds and fallback behavior

Do not overcomplicate class taxonomies. The final classes should map cleanly to physical bins or meaningful waste categories.

## Real-Time Dashboard Behavior

### Update model
For the hackathon build, use **polling every 1–2 seconds** rather than introducing unnecessary websocket complexity.

That is sufficient to feel live during a demo and much simpler to implement reliably.

### Images
Do not attempt full video streaming unless there is extra time. The preferred design is:
- one captured image per sorted event
- optionally an annotated image if the team wants bounding boxes shown

The dashboard should display:
- latest item image prominently
- recent feed item thumbnails

## PRD/Implementation Philosophy

This project should feel like:

> Stripe Dashboard × Climate Tech × Real-Time AI Hardware

Every implementation decision should be filtered through:

1. Does it help the product feel real?
2. Does it help judges immediately understand the value?
3. Does it make the hardware + AI + analytics story stronger?

## Frontend Guidance

### Must-have pages
- Dashboard
- Analytics
- Impact
- Model
- Settings

### Navigation style
Left sidebar similar to modern SaaS tools.

### UI rules
- strong top-level hero
- prominent live feed
- clean cards
- high visual hierarchy
- charts only where they truly add value
- no clutter

### Homepage wireframe concept
- top hero impact block
- large live feed block
- supporting KPI strip
- breakdown chart
- model performance card

## Backend Guidance

### FastAPI responsibilities
- accept event ingestion from Pi
- return recent events
- return aggregate metrics
- optionally expose trend summaries

### Suggested route groups
- `/health`
- `/events`
- `/metrics`
- `/devices`

### Backend principles
- keep data schema clean
- write simple aggregations in SQL or backend layer
- do not prematurely overengineer

## Database Guidance

Use Supabase Postgres tables for:
- devices
- sort_events
- daily_impact_rollups (optional)
- configuration tables if needed

Use Supabase Storage for images.

## Demo Requirements

The product demo should visibly show:
- a piece of trash being sorted
- a new live-feed item appearing
- hero metrics changing
- waste breakdown updating

The ideal demo loop is:
1. someone drops an item,
2. hardware sorts it,
3. dashboard updates within two seconds,
4. impact metrics increment.

## Deliverables Claude Code Should Prioritize

### Phase 1
- polished frontend shell
- sidebar layout
- homepage with mock/live data
- FastAPI backend routes
- DB schema
- live feed cards
- hero metrics cards

### Phase 2
- Supabase integration
- image upload integration
- Pi event ingestion endpoint
- breakdown and impact calculations

### Phase 3
- settings and device metadata
- deeper analytics pages
- more refined animations and transitions

## Constraints

- The user prefers practical, polished outputs.
- Focus on an implementation that can realistically work during a hackathon.
- Avoid unnecessary enterprise complexity.
- Keep the product looking premium.
- The frontend must not look too cartoonish, but can retain a slightly lively eco-tech tone.

## Source Assets / References

Use the generated dashboard mockup as a visual layout reference:

- `a_2d_digital_graphic_displays_a_smart_recycling_da.png`

Use the banner-inspired aesthetic direction already discussed:
- eco palette
- clean nature-inspired gradients
- polished SaaS structure

## Final Instruction

When in doubt, bias toward:
- clean structure
- premium design
- prominent live feed
- emotionally resonant impact metrics
- simple, believable real-time integration

Build the product so that a judge can understand it in five seconds and remember it five minutes later.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Smart Waste Intelligence Platform**

A real-time climate-tech SaaS dashboard that visualizes AI-powered trash sorting from a Raspberry Pi hardware system. The platform combines a computer vision perception model (YOLO on Pi), a FastAPI backend with Supabase, and a polished Next.js analytics dashboard — designed to feel like a production SaaS product, not a student prototype. Built for a hackathon but with product-level polish.

**Core Value:** When a user drops trash into the sorter, the dashboard updates within 2 seconds showing the sorted item, environmental impact metrics, and live feed — making judges immediately understand this is a real, working climate-tech system.

### Constraints

- **Tech Stack**: Next.js + React + TypeScript + Tailwind + shadcn/ui + Recharts (frontend), FastAPI (backend), Supabase Postgres + Storage (data), Python + YOLO (Pi) — confirmed, do not change without strong reason
- **Timeline**: Hackathon timeline — ship fast, polish matters
- **Hardware**: Pi sorter uses staged single-item classification, not mid-air detection
- **Hosting**: Vercel (frontend), Render/Railway (backend), Supabase (DB/storage)
- **Real-time**: Polling every 1-2 seconds, no WebSocket complexity
- **Design**: Premium eco-tech SaaS, not cartoonish, not sterile — green/teal palette, white cards, clean hierarchy
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
