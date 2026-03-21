---
phase: 05-backend-api-and-database
plan: 03
subsystem: api
tags: [fastapi, python, supabase, seed-data, testing, pytest]

# Dependency graph
requires:
  - phase: 05-01
    provides: FastAPI skeleton with config, DB client, constants
  - phase: 05-02
    provides: Service layer with apply_fallback and compute_impact functions
provides:
  - Idempotent seed script populating ~40 realistic demo events across all 4 waste categories
  - Default device upsert for Pi Sorter Alpha
  - Reproducible seed data generation with configurable random seed
  - 8 passing unit tests for seed generation logic
  - Verified Supabase connection with all 6 endpoints serving seeded data
affects: [06-integration]

# Tech tracking
tech-stack:
  added: []
  patterns: [idempotent wipe-and-reseed for demo data, reuse service layer functions in seed script]

key-files:
  created: [apps/api/seed.py, apps/api/tests/test_seed.py]
  modified: [apps/api/config.py]

key-decisions:
  - "Reuse apply_fallback and compute_impact from event_service in seed script for consistency with real event pipeline"
  - "Fixed .env path resolution relative to config module directory, not CWD"
  - "Seed images set to None per D-18 -- placeholder images deferred to future plan"

patterns-established:
  - "Seed script uses random.seed for reproducible output in tests, configurable via parameter"
  - "Wipe-and-reseed via Supabase delete-with-neq filter (Supabase requires a filter on delete)"
  - "Config .env path resolved via Path(__file__).resolve().parent for reliable module-level loading"

requirements-completed: [SEED-01, SEED-02, SEED-03]

# Metrics
duration: 5min
completed: 2026-03-21
---

# Phase 05 Plan 03: Seed Script Summary

**Idempotent seed script generating 40 realistic demo events with varied categories, confidence scores, and fallback states -- verified against live Supabase with all 6 endpoints returning correct data**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-21T22:03:00Z
- **Completed:** 2026-03-21T22:08:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint verified)
- **Files modified:** 3

## Accomplishments
- Seed script generates 40 events across all 4 waste categories (paper_cardboard, metal_glass, plastic, trash) with weighted random distribution
- Events include varied confidence scores (0.45-0.99) with some below 0.7 threshold triggering fallback to trash bin
- Script is fully idempotent: wipes existing events then reseeds, upserts default device
- All 6 API endpoints verified serving correct seeded data against live Supabase (user confirmed)
- 8 unit tests covering event count, category coverage, timestamps, fallback logic, impact values, field presence, and device ID

## Task Commits

Each task was committed atomically:

1. **Task 1: Create idempotent seed script with realistic demo data** - `368ff23` (feat)
2. **Task 2: Write tests for seed generation logic** - `2c99ce9` (test)
3. **Task 3: Fix .env path resolution for config module** - `9e142e0` (fix)

## Files Created/Modified
- `apps/api/seed.py` - Idempotent wipe-and-reseed script with generate_seed_events, wipe_data, and seed functions
- `apps/api/tests/test_seed.py` - 8 unit tests for seed data generation logic (pure tests, no Supabase mock needed)
- `apps/api/config.py` - Fixed .env path resolution to use Path(__file__).resolve().parent instead of relative path

## Decisions Made
- Reused apply_fallback and compute_impact from event_service.py in seed script to ensure seed data follows the exact same business logic as real events from the Pi
- Set image_url to None for all seed events per D-18 decision (placeholder images, not mock URLs)
- Fixed .env path to resolve relative to the config module's directory, ensuring the seed script works when run from any CWD

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed .env path resolution in config.py**
- **Found during:** Task 3 (running seed script against real Supabase)
- **Issue:** config.py used a relative .env path that failed when script was run from project root via `python -m apps.api.seed`
- **Fix:** Changed env_file to resolve via `Path(__file__).resolve().parent / ".env"` for reliable path regardless of CWD
- **Files modified:** apps/api/config.py
- **Verification:** Seed script successfully connects to Supabase and inserts 40 events
- **Committed in:** 9e142e0

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential fix for seed script to work from any directory. No scope creep.

## Issues Encountered
None beyond the .env path fix documented above.

## User Setup Required
**External services require manual configuration.** The following steps were completed by the user during the checkpoint:
- Supabase .env credentials configured (SUPABASE_URL, SUPABASE_KEY)
- SQL migration executed in Supabase Dashboard SQL Editor
- sort-images storage bucket created in Supabase Dashboard
- Seed script run successfully (40 events inserted)
- All 6 endpoints verified returning correct data

## Next Phase Readiness
- Phase 5 is now complete: FastAPI backend with 6 endpoints, SQL migration, seed data, and Supabase verified
- Backend is ready for Phase 6 (Data Integration and Polling) to wire the frontend
- 40 realistic seed events in the database provide immediate demo data for frontend development
- POST /events is ready for Pi runtime integration when hardware is available

## Self-Check: PASSED

All created files verified present. All 3 task commits (368ff23, 2c99ce9, 9e142e0) verified in git log. 8 seed tests pass. User confirmed all 6 endpoints serve correct data.

---
*Phase: 05-backend-api-and-database*
*Completed: 2026-03-21*
