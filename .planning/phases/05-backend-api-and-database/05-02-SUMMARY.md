---
phase: 05-backend-api-and-database
plan: 02
subsystem: api
tags: [fastapi, python, supabase, pydantic, multipart, storage, metrics, pytest]

# Dependency graph
requires:
  - phase: 05-01
    provides: FastAPI skeleton with config, DB client, schemas, constants, health endpoint
provides:
  - POST /events endpoint with multipart image upload, fallback logic, and impact calculation
  - GET /events endpoint returning events newest-first with configurable limit
  - GET /metrics endpoint returning 7 aggregate fields (total, recycling rate, CO2, etc.)
  - GET /metrics/breakdown endpoint returning category counts and percentages
  - GET /devices endpoint returning registered device list
  - Service layer separating business logic from route handlers
  - 23 passing tests covering all endpoints with mocked Supabase
affects: [05-03, 06-integration]

# Tech tracking
tech-stack:
  added: []
  patterns: [service layer pattern separating business logic from routers, unittest.mock.patch for Supabase mocking in tests]

key-files:
  created: [apps/api/services/event_service.py, apps/api/services/metrics_service.py, apps/api/routers/events.py, apps/api/routers/metrics.py, apps/api/routers/devices.py, apps/api/tests/test_events.py, apps/api/tests/test_metrics.py, apps/api/tests/test_devices.py]
  modified: [apps/api/main.py, apps/api/tests/conftest.py]

key-decisions:
  - "Service layer pattern: event_service.py and metrics_service.py separate business logic from router handlers for testability"
  - "Mocked Supabase in tests via unittest.mock.patch on router-level imports for isolation"

patterns-established:
  - "Service functions are pure where possible (apply_fallback, compute_impact, compute_metrics, compute_breakdown)"
  - "Router handlers delegate all business logic to service layer, only handle HTTP concerns"
  - "Integration tests mock Supabase at the router module level (patch apps.api.routers.X.supabase)"
  - "Conftest provides shared sample_events and sample_devices fixtures for test data consistency"

requirements-completed: [API-02, API-03, API-04, API-05, API-06]

# Metrics
duration: 3min
completed: 2026-03-21
---

# Phase 05 Plan 02: API Endpoints Summary

**All 5 remaining endpoints (POST/GET events, GET metrics, GET breakdown, GET devices) with service layer, fallback logic, impact calculation, and 23 passing tests**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-21T21:37:15Z
- **Completed:** 2026-03-21T21:40:01Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Complete API surface: 6 endpoints total (health from Plan 01 + 5 new) covering all frontend data needs
- Service layer with pure functions for fallback logic (confidence < 0.7 routes to trash), impact calculation (per-category weights and CO2 multipliers), and metrics aggregation
- 23 passing tests (unit + integration) with fully mocked Supabase -- no real credentials needed
- POST /events handles full multipart upload flow: validation, fallback, impact, storage upload, DB insert

## Task Commits

Each task was committed atomically:

1. **Task 1: Create service layer with business logic and all router endpoints** - `8cdae6c` (feat)
2. **Task 2: Write tests for all endpoints with mocked Supabase** - `449e8a3` (test)

## Files Created/Modified
- `apps/api/services/event_service.py` - Fallback logic, impact calculation, Supabase storage upload, event creation
- `apps/api/services/metrics_service.py` - Aggregate metric computation and category breakdown
- `apps/api/routers/events.py` - POST /events (multipart form) and GET /events (limit param)
- `apps/api/routers/metrics.py` - GET /metrics and GET /metrics/breakdown
- `apps/api/routers/devices.py` - GET /devices
- `apps/api/main.py` - Updated to include all 4 routers (health, events, metrics, devices)
- `apps/api/tests/conftest.py` - Added sample_events and sample_devices fixtures
- `apps/api/tests/test_events.py` - 10 tests for fallback, impact, and event listing
- `apps/api/tests/test_metrics.py` - 7 tests for metrics aggregation and breakdown
- `apps/api/tests/test_devices.py` - 3 tests for device listing

## Decisions Made
- Service layer pattern: separated business logic into event_service.py and metrics_service.py for testability and clean router handlers
- Mocked Supabase at router module level (not globally) to ensure each test controls its own mock behavior
- Pure functions for fallback/impact/metrics logic -- no side effects, easy to unit test without mocking

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## Next Phase Readiness
- All 6 API endpoints operational -- ready for Plan 03 (seed data) and Phase 6 (frontend integration)
- Service layer is tested and can be extended with confidence
- POST /events is ready for Pi runtime to send multipart form data with images

## Self-Check: PASSED

All 8 created files verified present. Both task commits (8cdae6c, 449e8a3) verified in git log. All 23 tests pass.

---
*Phase: 05-backend-api-and-database*
*Completed: 2026-03-21*
