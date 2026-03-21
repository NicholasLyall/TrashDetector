# Smart Waste Intelligence Dashboard PRD

## 1. Overview

The Smart Waste Intelligence Dashboard is a real-time web app that turns AI sorting events from a Raspberry Pi-powered trash sorter into a polished climate-tech dashboard experience.

The dashboard is intended to:
- show live sorting activity,
- quantify environmental impact,
- summarize waste composition,
- and provide technical credibility through simple model metrics.

## 2. Goals

### Primary goals
- Make the system feel alive through a prominent live feed.
- Make the system feel meaningful through impact metrics.
- Make the system feel credible through model performance summaries.
- Make the system feel premium through a polished SaaS UI.

### Non-goals
- Do not build a research-grade ML observability platform.
- Do not prioritize dense, expert-only technical dashboards.
- Do not make the homepage overly chart-heavy.

## 3. Target users
- hackathon judges
- teammates and builders
- sustainability-minded stakeholders
- future campus/facility users

## 4. Core user stories

### As a judge
I want to instantly understand environmental impact so I can grasp the product value quickly.

### As a judge
I want to see a live feed of recently sorted items so I know the system is real and operating.

### As a technical viewer
I want to see confidence and fallback metrics so I can trust the AI system.

### As a product-minded viewer
I want the dashboard to feel like a real SaaS product, not just a school demo.

## 5. Core features

### 5.1 Hero impact section
Show:
- total waste diverted
- total CO2 saved
- recycling rate
- total items sorted

### 5.2 Prominent live feed
Show:
- latest sorted item
- image thumbnail or large preview
- label
- routed bin
- confidence
- timestamp
- recent feed list

### 5.3 Waste composition breakdown
Show category distribution across recent or session data.

### 5.4 Model performance summary
Show:
- average confidence
- uncertain prediction rate
- fallback/default bin rate

### 5.5 Recent history and session visibility
Allow viewers to see how the system has been behaving over the recent session.

## 6. Information hierarchy

The homepage should prioritize this order:
1. Hero impact section
2. Live feed
3. KPI summary strip
4. Waste composition summary
5. Model performance summary

Sorting percentages and deeper breakdowns may live lower on the page or on secondary tabs.

## 7. Success criteria
- Dashboard updates new events within 1–2 seconds.
- A first-time viewer understands the core value in under 5 seconds.
- Live feed is obviously connected to hardware operation.
- Hero impact section is visually dominant.
- UI feels polished and cohesive.

## 8. Visual style
- modern SaaS
- scientific but approachable
- eco-tech palette
- clean cards and strong hierarchy
- not overly cartoonish

## 9. Primary navigation
- Dashboard
- Analytics
- Impact
- Model
- Settings

## 10. Functional requirements

### Dashboard page
Must include:
- hero impact cards
- prominent live feed
- KPI strip
- waste breakdown chart
- model summary card

### Analytics page
Should include:
- deeper category charts
- time-based trends
- recent event filtering

### Impact page
Should include:
- total CO2 saved
- total waste diverted
- impact equivalents such as trees or similar environmental translation

### Model page
Should include:
- average confidence
- confidence banding
- uncertain rate
- fallback rate

## 11. Data requirements
Each sort event should include:
- id
- timestamp
- label
- routed bin
- confidence
- image url
- co2_saved_kg
- waste_diverted_kg
- source device id
- fallback flag

## 12. Technical stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- FastAPI
- Supabase Postgres
- Supabase Storage
- Raspberry Pi Python runtime

## 13. Demo definition of success
A user drops trash in the sorter and within about two seconds:
- the latest item appears in the dashboard,
- the feed updates,
- the impact numbers increment,
- the dashboard tells a cohesive story.
