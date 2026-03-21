# Phase 5: Backend API and Database - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

A running FastAPI backend with all endpoints, Supabase Postgres tables, image storage, and seed data for demo. The Pi hardware is not ready yet — this phase builds the "trailer hitch" so the Pi can plug in immediately when ready.

</domain>

<decisions>
## Implementation Decisions

### Waste categories and bin mapping
- **D-01:** 4 waste categories: `paper_cardboard`, `metal_glass`, `plastic`, `trash`
- **D-02:** 1:1 category-to-bin mapping — each category IS the bin. `routed_bin` stores the category name directly (e.g., `"metal_glass"`)
- **D-03:** `label` and `routed_bin` are the same value — no item-level identification (no "soda_can" vs "beer_can"), just the category
- **D-04:** Confidence threshold for fallback to trash bin: 0.7
- **D-05:** No "unknown" class — model always gives its best guess, fallback is purely confidence-based (below 0.7 → trash)
- **D-06:** Valid categories hardcoded as a Python constant (`VALID_CATEGORIES`), not a database table
- **D-07:** `/metrics/breakdown` returns counts by category (4 slices max), not by specific item

### Image upload flow
- **D-08:** Pi sends image as multipart upload to `POST /events` — backend receives the file and uploads to Supabase Storage. Pi only knows one endpoint.
- **D-09:** No file size or format constraints — accept whatever the Pi sends (likely JPEG)
- **D-10:** Image naming convention in storage: `{timestamp}_{label}.jpg`
- **D-11:** No server-side thumbnail generation — store original only, frontend handles sizing via CSS

### Environmental impact calculations
- **D-12:** Per-event weight uses fixed average per category (no scale sensor on Pi)
- **D-13:** CO2 savings calculated via per-category multiplier applied to weight
- **D-14:** Trash-routed items get `waste_diverted_kg = 0` and `co2_saved_kg = 0` — only non-trash categories count as diverted
- **D-15:** Recycling rate = non-trash items / total items (not a correctness metric)

### Seed data
- **D-16:** Seed data is temporary scaffolding — will be deleted once Pi is connected
- **D-17:** Small set (~30-50 events) spread across the last few hours
- **D-18:** Placeholder images or skip images — real Pi photos will replace them
- **D-19:** Wipe-and-reseed approach (idempotent) so demo state can be reset

### Claude's Discretion
- Exact fixed weight values per category
- Exact CO2 multiplier values per category
- Seed data distribution across categories and time
- FastAPI project structure and module organization
- Supabase client library choice and configuration
- Error response format and HTTP status codes

</decisions>

<specifics>
## Specific Ideas

- "Think of it like a trailer hitch — we have the truck, we'll attach the trailer soon"
- The backend should be trivially ready for Pi integration: one POST endpoint, standard multipart, done
- No over-engineering — hackathon reliability over enterprise patterns

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### API contract
- `docs/API_SPEC.md` — All endpoint definitions, request/response shapes, route groups
- `docs/ARCHITECTURE.md` §3 (FastAPI backend) — Backend responsibilities and event lifecycle

### Data model
- `docs/DATA_MODEL.md` — sort_events and devices table schemas, event semantics, environmental calculation approach

### System context
- `docs/ARCHITECTURE.md` §1 (End-to-End System) — Full data flow from Pi to dashboard
- `docs/ARCHITECTURE.md` §4 (Realtime Strategy) — Polling approach that frontend will use against these endpoints

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/web/lib/navigation.ts` pattern — readonly constant array pattern can inform `VALID_CATEGORIES` design
- `apps/web/lib/utils.ts` — `cn()` utility pattern for consistent code style reference

### Established Patterns
- Immutable constants with readonly types (from Phase 1 navigation config)
- No backend code exists yet — this phase creates the `apps/api/` or `backend/` directory from scratch

### Integration Points
- Frontend pages at `apps/web/app/` will consume these endpoints in Phase 6
- KPI chip strip in top bar (`apps/web/components/layout/top-bar.tsx`) will wire to `/metrics` in Phase 6
- Dashboard page (`apps/web/app/page.tsx`) currently shows placeholder cards — will wire to all endpoints

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-backend-api-and-database*
*Context gathered: 2026-03-21*
