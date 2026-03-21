# UI / UX Spec

## 1. Design Intent

The dashboard should feel:
- professional
- scientific
- eco-tech
- premium
- clean

Not too sterile and not too cartoonish.

## 2. Primary Layout Pattern

Use a SaaS application shell:
- left sidebar navigation
- top-level main content area
- card-based sections
- strong spacing and hierarchy

## 3. Homepage Layout

```text
┌────────────────────────────────────────────────────────────┐
│ HERO IMPACT SECTION                                       │
│ CO2 saved | waste diverted | recycling rate | total items │
└────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┬────────────────────────┐
│ LIVE FEED                         │ WASTE BREAKDOWN        │
│ latest item large preview         │ pie / bar chart        │
│ recent activity list              │ summary legend         │
└───────────────────────────────────┴────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ KPI STRIP                                                 │
│ avg confidence | uncertain rate | fallback rate | uptime  │
└────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┬────────────────────────┐
│ RECENT SORT HISTORY               │ MODEL PERFORMANCE      │
│ table or list                     │ confidence summary     │
└───────────────────────────────────┴────────────────────────┘
```

## 4. Sidebar Navigation
- Dashboard
- Analytics
- Impact
- Model
- Settings

## 5. Hero Impact Section
This must be visually dominant and should be the first thing visible above the fold.

Use:
- large numbers
- subtle gradient background
- white or softly tinted cards
- light motion/count-up behavior if feasible

## 6. Live Feed
This should be highly prominent.

### Structure
- large latest item card
- image preview
- routed bin badge
- confidence badge
- timestamp
- vertical recent list

### Behavior
- refresh every 1–2 seconds
- newest event highlighted
- image-first presentation

## 7. Charts
Use Recharts and keep chart count disciplined.

Preferred charts:
- pie or donut for waste composition
- bar chart for category counts
- simple confidence distribution if included

## 8. Color Direction
Suggested palette family:
- green primary
- teal/blue secondary
- clean white cards
- light background
- soft borders and shadows

## 9. Visual Reference
Use the generated mockup image as the primary layout inspiration.
