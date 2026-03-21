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

## 3. Homepage Layout (from mockup)

```text
┌──────────┬─────────────────────────────────────────────────┐
│ SIDEBAR  │ TOP BAR                                         │
│          │ ☰ Smart Dashboard ▾   [KPI chips strip] avatar  │
│ ECO      ├─────────────────────────────────────────────────┤
│ DASHBOARD│ HERO IMPACT SECTION (illustrated bg)            │
│          │ "Great job! You've diverted X kg today."        │
│ Dashboard│ [68% Recycled] [21kg CO2] [241 Items Sorted]   │
│ Analytics├──────────────────────────┬──────────────────────┤
│ Impact   │ LIVE FEED               │ WASTE COMPOSITION    │
│ Model    │ 🟢 Live Feed            │ BREAKDOWN            │
│ Settings │ 🌲 Equivalent to X trees│ [Pie/donut chart]    │
│          │ [Large item preview]    │ Legend: Plastic, Food │
│          │ Name | Badge | Conf     │ Paper, Misc          │
│          ├──────────────────────────┤ "View Analytics →"   │
│          │ RECENT ITEMS            ├──────────────────────┤
│          │ thumb | name | badge    │ MODEL PERFORMANCE    │
│          │ thumb | name | badge    │ 89% Avg Confidence   │
│          │ thumb | name | badge    │ 11% Uncertain Rate   │
│ Admin 👤 │ thumb | name | badge    │ 9% Fallback to Trash │
│          │                         │ [Confidence dist bar]│
└──────────┴──────────────────────────┴──────────────────────┘
```

### Key mockup details
- **Top bar KPI chips**: Total Items, Recycling Rate, Avg Confidence, Fallback Rate — always visible
- **Hero background**: Illustrated sky with clouds, globe, and floating green leaves — not a flat gradient
- **Hero message**: Motivational text ("Great job! You've diverted X kg of waste today.")
- **Hero stat cards**: Three cards in a row with icons (recycle icon, cloud/globe, bin)
- **Live feed "trees" badge**: "Equivalent to planting X trees" with tree icon — environmental translation
- **Bin badge colors**: Green = Recycled, Brown/amber = Composted, Red = Trash
- **Recent items**: Thumbnails, item name + confidence, color-coded badge, relative timestamp
- **Waste composition**: Pie chart with 4 categories, colored legend, "View Full Analytics →" link
- **Model performance**: Three metric cards + confidence distribution horizontal bar chart
- **Sidebar**: "ECO DASHBOARD" branding at top, Admin user with avatar at bottom

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
