# Phase 2: Hero Impact Section - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users immediately see inspiring environmental impact metrics as the first element on the dashboard homepage. This phase builds the hero section component with mock data. Live polling and backend wiring come in Phase 6.

Requirements covered: DASH-02, HERO-01, HERO-02, HERO-03, HERO-04, HERO-06, HERO-07, VISL-01, VISL-03, VISL-04.

</domain>

<decisions>
## Implementation Decisions

### Layout structure
- **D-01:** One large "headline" metric (motivational message featuring waste diverted kg) with 3 smaller supporting stat cards below it (Recycled %, CO2 saved kg, Total Items Sorted)
- **D-02:** The motivational message IS the headline — "Great job! You've diverted X kg of waste today." — large and bold, centered above the cards, first thing the user reads
- **D-03:** The "today" scoping — motivational number reflects today's impact (resets daily), not all-time cumulative

### Metric presentation
- **D-04:** Numbers displayed inline with units (e.g., "1,247 kg", "89%", "342 items")
- **D-05:** Each of the 3 stat cards gets a prominent colored Lucide icon (e.g., Recycle for recycled %, Cloud/Leaf for CO2, Trash2/Package for total items)
- **D-06:** No change indicators or trend arrows for now — just cumulative values

### Background illustration
- **D-07:** Full illustrated scene — SVG artwork of sky, clouds, and floating green leaves (no globe). Assets need to be created or sourced as inline SVGs
- **D-08:** Subtle CSS animation on leaves — gentle floating or swaying motion
- **D-09:** Uses the eco theme colors (--eco-green, --eco-teal, --eco-blue) for the illustration palette, not photorealistic

### Container treatment
- **D-10:** Hero section is contained in a rounded card with the gradient/illustration as the card background (not full-bleed edge-to-edge)

### Motivational message
- **D-11:** Encouraging/personal tone matching the mockup — "Great job! You've diverted X kg of waste today."
- **D-12:** Positioned above the 3 stat cards, centered, as the hero headline

### Mock data
- **D-13:** Use hardcoded realistic mock values for now (backend integration comes in Phase 6). Values should feel plausible for a single-location daily operation

### Claude's Discretion
- Exact SVG illustration design and leaf positions
- Animation timing and easing
- Specific Lucide icon choices per metric
- Gradient color stops within the eco palette
- Exact spacing, padding, and typography sizing
- Card shadow depth and border radius

</decisions>

<specifics>
## Specific Ideas

- Layout matches the dashboard mockup at `docs/dashboard-reference.png` — illustrated hero banner with motivational text above 3 stat cards
- Tone is encouraging and personal, not corporate — "Great job!" voice
- The hero should feel inspiring and emotionally resonant, not like a dry stats panel
- No globe in the illustration — keep it to sky, clouds, and floating leaves with theme colors

</specifics>

<canonical_refs>
## Canonical References

### Visual design
- `docs/dashboard-reference.png` — Dashboard mockup showing hero section layout, stat card arrangement, and illustrated background style

### Requirements
- `.planning/REQUIREMENTS.md` §Hero Impact — HERO-01 through HERO-07 requirements
- `.planning/REQUIREMENTS.md` §Visual Design — VISL-01, VISL-03, VISL-04

### Existing code
- `apps/web/app/globals.css` — Eco palette CSS variables (--eco-green, --eco-teal, --eco-blue, --eco-bg)
- `apps/web/components/ui/card.tsx` — Card component for hero container and stat cards
- `apps/web/components/ui/badge.tsx` — Badge component if needed for labels
- `apps/web/app/page.tsx` — Dashboard homepage where hero section will be placed

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Card component** (`components/ui/card.tsx`): Card, CardHeader, CardTitle, CardContent — use for hero container and individual stat cards
- **Badge component** (`components/ui/badge.tsx`): Multiple variants — potential for metric labels
- **Lucide icons** (`lucide-react` v0.577.0): Already installed, used in sidebar — Recycle, Leaf, Cloud, Trash2, Package all available
- **cn() utility** (`lib/utils.ts`): clsx + tailwind-merge for conditional classes

### Established Patterns
- **Component location**: UI primitives in `components/ui/`, feature components should go in `components/dashboard/`
- **Styling approach**: Tailwind classes + CSS variables via `hsl(var(--name))` pattern
- **Dark mode**: Full dark mode CSS variables defined — hero should work in both themes

### Integration Points
- **Dashboard page** (`app/page.tsx`): Currently a placeholder — hero section becomes the first child element
- **App shell** (`components/layout/app-shell.tsx`): Main content area has `p-6` padding and `space-y-6` between sections
- **Color system**: `--eco-green: 142 71% 45%`, `--eco-teal: 174 62% 47%`, `--eco-blue: 199 89% 48%` already defined

</code_context>

<deferred>
## Deferred Ideas

- Count-up animations on hero numbers — ADV-04 in REQUIREMENTS.md, could be added in Phase 10 (polish)
- Daily impact comparison ("12% more than yesterday") — would need backend data, defer to Phase 6+

</deferred>

---

*Phase: 02-hero-impact-section*
*Context gathered: 2026-03-21*
