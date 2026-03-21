# Phase 5: Backend API and Database - Research

**Researched:** 2026-03-21
**Domain:** FastAPI + Supabase Postgres + Supabase Storage
**Confidence:** HIGH

## Summary

This phase creates the entire backend from scratch: a FastAPI application with 6 endpoints, two Supabase Postgres tables, a Supabase Storage bucket for images, and a seed script for demo data. No Python code exists in the project yet, so the phase also establishes Python project structure, dependency management, and configuration patterns.

The stack is locked: FastAPI for the API, Supabase (managed Postgres + Storage) for persistence, and Python for all backend code. The Supabase Python SDK (`supabase` 2.28.3) provides a high-level client for both database operations and storage, eliminating the need for raw SQL drivers or ORMs. The Pi hardware is not ready -- the backend must work with seed data and be trivially ready for Pi integration later.

**Primary recommendation:** Use `supabase` Python SDK for all database and storage operations (no SQLAlchemy, no raw psycopg2). Keep the backend flat and simple -- a single `apps/api/` directory with routers, schemas, and a shared Supabase client. Compute aggregate metrics in Python from fetched rows (hackathon simplicity) rather than creating Postgres RPC functions.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** 4 waste categories: `paper_cardboard`, `metal_glass`, `plastic`, `trash`
- **D-02:** 1:1 category-to-bin mapping -- each category IS the bin. `routed_bin` stores the category name directly (e.g., `"metal_glass"`)
- **D-03:** `label` and `routed_bin` are the same value -- no item-level identification (no "soda_can" vs "beer_can"), just the category
- **D-04:** Confidence threshold for fallback to trash bin: 0.7
- **D-05:** No "unknown" class -- model always gives its best guess, fallback is purely confidence-based (below 0.7 -> trash)
- **D-06:** Valid categories hardcoded as a Python constant (`VALID_CATEGORIES`), not a database table
- **D-07:** `/metrics/breakdown` returns counts by category (4 slices max), not by specific item
- **D-08:** Pi sends image as multipart upload to `POST /events` -- backend receives the file and uploads to Supabase Storage. Pi only knows one endpoint.
- **D-09:** No file size or format constraints -- accept whatever the Pi sends (likely JPEG)
- **D-10:** Image naming convention in storage: `{timestamp}_{label}.jpg`
- **D-11:** No server-side thumbnail generation -- store original only, frontend handles sizing via CSS
- **D-12:** Per-event weight uses fixed average per category (no scale sensor on Pi)
- **D-13:** CO2 savings calculated via per-category multiplier applied to weight
- **D-14:** Trash-routed items get `waste_diverted_kg = 0` and `co2_saved_kg = 0` -- only non-trash categories count as diverted
- **D-15:** Recycling rate = non-trash items / total items (not a correctness metric)
- **D-16:** Seed data is temporary scaffolding -- will be deleted once Pi is connected
- **D-17:** Small set (~30-50 events) spread across the last few hours
- **D-18:** Placeholder images or skip images -- real Pi photos will replace them
- **D-19:** Wipe-and-reseed approach (idempotent) so demo state can be reset

### Claude's Discretion
- Exact fixed weight values per category
- Exact CO2 multiplier values per category
- Seed data distribution across categories and time
- FastAPI project structure and module organization
- Supabase client library choice and configuration
- Error response format and HTTP status codes

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| API-01 | GET /health returns service health status | Trivial FastAPI route, return `{"status": "ok"}` |
| API-02 | POST /events accepts sort event with image upload and metadata | FastAPI `UploadFile` + `Form` parameters, Supabase Storage upload, then DB insert |
| API-03 | GET /events returns recent events sorted newest first with limit parameter | Supabase `.select("*").order("timestamp", desc=True).limit(n)` |
| API-04 | GET /metrics returns aggregate metrics (total items, recycling rate, CO2 saved, waste diverted, avg confidence, uncertain rate, fallback rate) | Fetch all events, compute aggregates in Python |
| API-05 | GET /metrics/breakdown returns category counts and percentages | Fetch events, group by label in Python, compute counts/percentages |
| API-06 | GET /devices returns registered source devices | Supabase `.select("*")` from devices table |
| DB-01 | sort_events table with all specified columns | SQL CREATE TABLE with UUID pk, timestamptz, text, numeric, boolean columns |
| DB-02 | devices table with all specified columns | SQL CREATE TABLE with UUID pk, text columns, timestamptz |
| DB-03 | Supabase Storage bucket configured for item snapshots | Create public bucket via SDK or dashboard, set RLS policies for upload |
| SEED-01 | Realistic seed data generator with varied labels, confidence scores, timestamps | Python script generating ~30-50 events across 4 categories over last few hours |
| SEED-02 | Seed data includes representative item images in Supabase Storage | Use placeholder images or colored rectangles as stand-in images |
| SEED-03 | Seed script can populate database for demo without Pi hardware | Idempotent wipe-and-reseed script callable via `python -m seed` or similar |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| fastapi | 0.135.1 | Web framework / API | Confirmed in CLAUDE.md, latest stable, Pydantic v2 native |
| uvicorn | 0.42.0 | ASGI server | Standard FastAPI server, latest stable |
| supabase | 2.28.3 | Supabase client (DB + Storage + Auth) | Official Python SDK, includes postgrest, storage3, supabase-auth |
| pydantic | 2.12.5 | Data validation / schemas | Bundled with FastAPI, latest stable |
| pydantic-settings | 2.13.1 | Environment variable config | Official pattern for FastAPI settings management |
| python-multipart | 0.0.22 | Multipart form parsing | Required by FastAPI for file uploads (UploadFile) |
| python-dotenv | 1.2.2 | .env file loading | Used by pydantic-settings for local dev |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| httpx | 0.28.1 | HTTP client | Already a supabase dependency, use if needed for external calls |
| pillow | (latest) | Image generation | Only needed if generating colored placeholder images for seed data |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| supabase SDK | psycopg2 + raw SQL | More control but way more boilerplate; SDK is simpler for hackathon |
| supabase SDK | SQLAlchemy ORM | Massive overkill for 2 tables; adds migration complexity |
| Python aggregation | Postgres RPC functions | RPC is faster at scale but requires SQL functions in DB; Python is simpler for ~50 rows |
| pydantic-settings | os.environ directly | Loses validation, type safety, and .env file support |

**Installation:**
```bash
pip install fastapi uvicorn[standard] supabase pydantic-settings python-multipart python-dotenv
```

**Version verification:** All versions verified against PyPI on 2026-03-21. Python 3.14.2 confirmed compatible with all packages via dry-run install.

## Architecture Patterns

### Recommended Project Structure
```
apps/api/
  main.py              # FastAPI app, CORS, router mounting
  config.py            # Settings class (BaseSettings)
  db.py                # Supabase client singleton
  constants.py         # VALID_CATEGORIES, weight/CO2 constants
  routers/
    health.py          # GET /health
    events.py          # POST /events, GET /events
    metrics.py         # GET /metrics, GET /metrics/breakdown
    devices.py         # GET /devices
  schemas.py           # Pydantic request/response models
  services/
    event_service.py   # Business logic: image upload, impact calc, DB write
    metrics_service.py # Aggregate computation logic
  seed.py              # Seed script (runnable: python -m apps.api.seed)
  requirements.txt     # Pinned dependencies
  .env.example         # Template for required env vars
```

**Rationale:** File-type structure (routers/schemas/services) is appropriate for a small API with 6 endpoints. Each router file maps to a route group from CLAUDE.md (`/health`, `/events`, `/metrics`, `/devices`). Services separate business logic from route handlers for testability.

### Pattern 1: Supabase Client Singleton
**What:** Create one Supabase client instance at startup, share via module import
**When to use:** Every route that touches the database or storage

```python
# Source: https://supabase.com/docs/reference/python/introduction
from supabase import create_client, Client
from apps.api.config import settings

supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
```

### Pattern 2: FastAPI Settings with pydantic-settings
**What:** Type-safe environment variable loading with validation
**When to use:** App configuration (Supabase URL, key, CORS origins)

```python
# Source: https://fastapi.tiangolo.com/advanced/settings/
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
```

### Pattern 3: Multipart File Upload with Form Fields
**What:** Accept image + metadata in a single POST request
**When to use:** POST /events endpoint (Pi sends image + event data together)

```python
# Source: https://fastapi.tiangolo.com/tutorial/request-files/
from fastapi import UploadFile, File, Form

@router.post("/events")
async def create_event(
    label: str = Form(...),
    confidence: float = Form(...),
    source_device_id: str = Form(...),
    image: UploadFile = File(...),
):
    # Read image bytes
    image_bytes = await image.read()
    # Upload to Supabase Storage
    # Insert event record to DB
    ...
```

### Pattern 4: Impact Calculation at Ingestion Time
**What:** Compute waste_diverted_kg and co2_saved_kg when event is created, store as columns
**When to use:** POST /events -- derive values from label before DB insert

```python
# Per D-12, D-13, D-14
CATEGORY_WEIGHTS = {
    "paper_cardboard": 0.15,  # kg average per item
    "metal_glass": 0.25,
    "plastic": 0.08,
    "trash": 0.12,
}

CO2_MULTIPLIERS = {
    "paper_cardboard": 1.1,   # kg CO2 saved per kg diverted
    "metal_glass": 2.5,
    "plastic": 1.8,
    "trash": 0.0,             # trash = no diversion
}

def compute_impact(label: str) -> tuple[float, float]:
    weight = CATEGORY_WEIGHTS.get(label, 0.0)
    if label == "trash":
        return 0.0, 0.0
    co2 = weight * CO2_MULTIPLIERS.get(label, 0.0)
    return weight, co2
```

### Pattern 5: Confidence-Based Fallback Logic
**What:** If confidence < 0.7, override label to "trash" and set fallback_used=True
**When to use:** POST /events, before computing impact

```python
# Per D-04, D-05
CONFIDENCE_THRESHOLD = 0.7

def apply_fallback(label: str, confidence: float) -> tuple[str, bool]:
    if confidence < CONFIDENCE_THRESHOLD:
        return "trash", True
    return label, False
```

### Anti-Patterns to Avoid
- **Raw SQL in route handlers:** Use the Supabase SDK's query builder. Do not import psycopg2 or write raw SQL strings in endpoint functions.
- **Global mutable state:** Do not store event counts or metrics in module-level variables. Always query Supabase for fresh data.
- **Async Supabase client for this project:** The sync `create_client` is sufficient. Using `acreate_client` adds complexity for no benefit at hackathon scale (~50 rows, single user).
- **SQLAlchemy models alongside Supabase SDK:** Pick one. For this project, Supabase SDK is simpler.
- **Storing computed metrics in the DB:** Compute on read. With ~50 rows, Python aggregation is instant.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| File upload parsing | Custom multipart parser | FastAPI `UploadFile` + `python-multipart` | Edge cases in multipart boundaries, encoding |
| Environment config | Manual os.environ reads | `pydantic-settings` BaseSettings | Type validation, .env support, defaults |
| Database queries | Raw SQL string concatenation | Supabase SDK query builder (.select, .insert, .eq) | SQL injection prevention, type safety |
| Storage URL generation | Manual URL construction | `supabase.storage.from_("bucket").get_public_url()` | URL format may change across regions/versions |
| CORS handling | Custom middleware | FastAPI `CORSMiddleware` | Proper preflight handling, spec compliance |
| UUID generation | Custom ID schemes | Postgres `gen_random_uuid()` or `uuid.uuid4()` | Uniqueness guarantees, standard format |
| Request validation | Manual field checking | Pydantic models via FastAPI | Automatic error messages, type coercion |

**Key insight:** With only 2 tables and 6 endpoints, every piece of "infrastructure" you hand-roll is wasted time. The Supabase SDK + FastAPI do 95% of the work.

## Common Pitfalls

### Pitfall 1: Supabase Storage Content-Type Header Case Sensitivity
**What goes wrong:** Uploading to Supabase Storage with capitalized "Content-Type" in file_options stores the multipart envelope instead of the file bytes.
**Why it happens:** Supabase Storage parses headers case-sensitively in some versions.
**How to avoid:** Always use lowercase `"content-type"` in file_options when uploading:
```python
supabase.storage.from_("sort-images").upload(
    path=f"{timestamp}_{label}.jpg",
    file=image_bytes,
    file_options={"content-type": "image/jpeg"}
)
```
**Warning signs:** Images appear corrupted or show multipart boundary text when opened.

### Pitfall 2: Forgetting CORS Middleware for Frontend
**What goes wrong:** Next.js frontend on localhost:3000 gets CORS errors calling FastAPI on localhost:8000.
**Why it happens:** Browsers enforce same-origin policy; FastAPI does not add CORS headers by default.
**How to avoid:** Add CORSMiddleware as the FIRST middleware:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
**Warning signs:** "Access-Control-Allow-Origin" errors in browser console.

### Pitfall 3: Supabase Storage Bucket Not Public
**What goes wrong:** `get_public_url()` returns a URL but the browser gets 403 when loading the image.
**Why it happens:** Buckets are private by default. `get_public_url()` does not verify the bucket is actually public.
**How to avoid:** Create the bucket with `public=True`, or set it public in the Supabase dashboard. For hackathon simplicity, use a public bucket (no RLS needed for reads).
**Warning signs:** Images load in Supabase dashboard but not from public URLs.

### Pitfall 4: Missing python-multipart for File Uploads
**What goes wrong:** FastAPI raises a runtime error when receiving multipart form data.
**Why it happens:** `python-multipart` is not a FastAPI dependency by default; it must be explicitly installed.
**How to avoid:** Include `python-multipart` in requirements.txt.
**Warning signs:** Error message: "Install python-multipart".

### Pitfall 5: RLS Blocking Inserts Without Policies
**What goes wrong:** Supabase returns 403/empty response when inserting into tables.
**Why it happens:** Row Level Security is enabled by default on new tables in Supabase. Without policies, all operations are denied.
**How to avoid:** Either disable RLS on the tables (acceptable for hackathon with service_role key) or create permissive INSERT/SELECT policies. Using the `service_role` key bypasses RLS entirely.
**Warning signs:** Inserts silently return empty data or throw permission errors.

### Pitfall 6: Sync vs Async Supabase Client Confusion
**What goes wrong:** Mixing `create_client` (sync) with `await` calls, or using `acreate_client` unnecessarily.
**Why it happens:** The Supabase Python SDK has both sync and async variants.
**How to avoid:** Use sync `create_client` throughout. FastAPI handles sync functions in a thread pool automatically. Only use async if you specifically need realtime subscriptions (we don't).
**Warning signs:** `TypeError: object Response can't be used in 'await' expression`.

## Code Examples

Verified patterns from official sources:

### POST /events - Full Flow
```python
# Source: FastAPI docs + Supabase Python docs
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

router = APIRouter()

@router.post("/events")
async def create_event(
    label: str = Form(...),
    confidence: float = Form(...),
    source_device_id: str = Form(...),
    image: UploadFile = File(...),
):
    # 1. Apply fallback logic (D-04, D-05)
    final_label, fallback_used = apply_fallback(label, confidence)

    # 2. Compute impact (D-12, D-13, D-14)
    waste_diverted, co2_saved = compute_impact(final_label)

    # 3. Upload image to Supabase Storage (D-08, D-10)
    timestamp = datetime.now(timezone.utc)
    image_path = f"{timestamp.strftime('%Y%m%d_%H%M%S')}_{final_label}.jpg"
    image_bytes = await image.read()

    supabase.storage.from_("sort-images").upload(
        path=image_path,
        file=image_bytes,
        file_options={"content-type": image.content_type or "image/jpeg"}
    )

    # 4. Get public URL
    image_url = supabase.storage.from_("sort-images").get_public_url(image_path)

    # 5. Insert event into database
    event_id = str(uuid.uuid4())
    response = supabase.table("sort_events").insert({
        "id": event_id,
        "timestamp": timestamp.isoformat(),
        "label": final_label,
        "routed_bin": final_label,  # D-03: label == routed_bin
        "confidence": confidence,
        "image_url": image_url,
        "waste_diverted_kg": waste_diverted,
        "co2_saved_kg": co2_saved,
        "fallback_used": fallback_used,
        "source_device_id": source_device_id,
    }).execute()

    return {"id": event_id, "message": "event created"}
```

### GET /events - Query with Order and Limit
```python
# Source: https://supabase.com/docs/reference/python/order
@router.get("/events")
def get_events(limit: int = 20):
    response = (
        supabase.table("sort_events")
        .select("*")
        .order("timestamp", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data
```

### GET /metrics - Aggregate Computation
```python
# Source: Application logic per CONTEXT.md decisions
@router.get("/metrics")
def get_metrics():
    response = supabase.table("sort_events").select("*").execute()
    events = response.data

    if not events:
        return {
            "total_items": 0, "recycling_rate": 0.0,
            "co2_saved_kg": 0.0, "waste_diverted_kg": 0.0,
            "avg_confidence": 0.0, "uncertain_rate": 0.0, "fallback_rate": 0.0,
        }

    total = len(events)
    non_trash = sum(1 for e in events if e["label"] != "trash")
    fallback_count = sum(1 for e in events if e["fallback_used"])
    uncertain_count = sum(1 for e in events if e["confidence"] < 0.7)

    return {
        "total_items": total,
        "recycling_rate": round(non_trash / total, 2) if total else 0.0,
        "co2_saved_kg": round(sum(e["co2_saved_kg"] for e in events), 2),
        "waste_diverted_kg": round(sum(e["waste_diverted_kg"] for e in events), 2),
        "avg_confidence": round(sum(e["confidence"] for e in events) / total, 2),
        "uncertain_rate": round(uncertain_count / total, 2) if total else 0.0,
        "fallback_rate": round(fallback_count / total, 2) if total else 0.0,
    }
```

### SQL Table Creation
```sql
-- sort_events table (DB-01)
CREATE TABLE IF NOT EXISTS sort_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    label TEXT NOT NULL,
    routed_bin TEXT NOT NULL,
    confidence NUMERIC NOT NULL,
    image_url TEXT,
    waste_diverted_kg NUMERIC DEFAULT 0,
    co2_saved_kg NUMERIC DEFAULT 0,
    fallback_used BOOLEAN DEFAULT false,
    source_device_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- devices table (DB-02)
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location_name TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- For hackathon: disable RLS or use service_role key
ALTER TABLE sort_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for service role" ON sort_events FOR ALL USING (true);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for service role" ON devices FOR ALL USING (true);
```

### Seed Script Pattern
```python
# Idempotent wipe-and-reseed (D-19)
import random
from datetime import datetime, timedelta, timezone

CATEGORIES = ["paper_cardboard", "metal_glass", "plastic", "trash"]

def seed():
    # Wipe existing data
    supabase.table("sort_events").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

    # Seed device
    device_id = "device-pi-001"
    supabase.table("devices").upsert({
        "id": device_id,
        "name": "Pi Sorter Alpha",
        "location_name": "Lab Station 1",
        "status": "active",
    }).execute()

    # Generate ~40 events over last 3 hours
    now = datetime.now(timezone.utc)
    for i in range(40):
        label = random.choice(CATEGORIES)
        confidence = round(random.uniform(0.5, 0.99), 2)
        final_label, fallback = apply_fallback(label, confidence)
        waste, co2 = compute_impact(final_label)
        ts = now - timedelta(minutes=random.randint(1, 180))

        supabase.table("sort_events").insert({
            "timestamp": ts.isoformat(),
            "label": final_label,
            "routed_bin": final_label,
            "confidence": confidence,
            "waste_diverted_kg": waste,
            "co2_saved_kg": co2,
            "fallback_used": fallback,
            "source_device_id": device_id,
            # image_url can be None for seed data (D-18)
        }).execute()
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| supabase-py v1.x (sync only) | supabase v2.28.x (sync + async) | 2024 | Use sync `create_client` for simplicity |
| FastAPI < 0.100 (Pydantic v1) | FastAPI 0.135 (Pydantic v2 native) | 2023 | Use `model_config` instead of `class Config` |
| Manual CORS headers | FastAPI CORSMiddleware | Stable | Always use middleware, never manual headers |
| pydantic BaseSettings (v1) | pydantic-settings separate package | 2023 | `pip install pydantic-settings`, import from there |
| Supabase Storage v1 API | Storage3 with unified SDK | 2024 | Upload/URL methods are part of main `supabase` package |

**Deprecated/outdated:**
- `pydantic.BaseSettings`: Moved to `pydantic_settings.BaseSettings` in Pydantic v2
- `supabase` v1.x: Completely different API surface; v2.x uses method chaining
- `response_model` class Config: Use `model_config = ConfigDict(...)` in Pydantic v2

## Open Questions

1. **Supabase table creation approach**
   - What we know: Tables can be created via Supabase dashboard SQL editor, CLI migrations, or MCP server
   - What's unclear: Whether the Supabase MCP server is available in this environment for automated table creation
   - Recommendation: Provide SQL CREATE TABLE statements in a migration file (`apps/api/migrations/001_initial.sql`). Execute via Supabase dashboard SQL editor or MCP if available. Keep the SQL file in git for reproducibility.

2. **Placeholder images for seed data (SEED-02)**
   - What we know: D-18 says "placeholder images or skip images"
   - What's unclear: Whether to generate actual image files or just leave image_url as null
   - Recommendation: Leave image_url as null for seed data. This is simpler and explicitly temporary (D-16). The live feed cards should handle null image_url gracefully.

3. **Service role key vs. anon key**
   - What we know: Using the service_role key bypasses RLS entirely. The anon key requires RLS policies.
   - What's unclear: Which key is configured for this project
   - Recommendation: Use the service_role key for the backend (server-side, not exposed to browser). This avoids RLS complexity for the hackathon. Store in .env, never commit.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | pytest (latest) |
| Config file | `apps/api/pytest.ini` or `pyproject.toml` -- none exists, create in Wave 0 |
| Quick run command | `cd apps/api && python -m pytest tests/ -x -q` |
| Full suite command | `cd apps/api && python -m pytest tests/ -v` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| API-01 | GET /health returns 200 with status ok | unit | `pytest tests/test_health.py -x` | Wave 0 |
| API-02 | POST /events accepts multipart and creates event | integration | `pytest tests/test_events.py::test_create_event -x` | Wave 0 |
| API-03 | GET /events returns ordered list with limit | integration | `pytest tests/test_events.py::test_get_events -x` | Wave 0 |
| API-04 | GET /metrics returns correct aggregates | unit | `pytest tests/test_metrics.py::test_get_metrics -x` | Wave 0 |
| API-05 | GET /metrics/breakdown returns category counts | unit | `pytest tests/test_metrics.py::test_breakdown -x` | Wave 0 |
| API-06 | GET /devices returns device list | integration | `pytest tests/test_devices.py -x` | Wave 0 |
| DB-01 | sort_events table has all columns | manual-only | Verify via Supabase dashboard | N/A |
| DB-02 | devices table has all columns | manual-only | Verify via Supabase dashboard | N/A |
| DB-03 | Storage bucket exists and is public | manual-only | Verify via Supabase dashboard | N/A |
| SEED-01 | Seed script generates realistic events | integration | `pytest tests/test_seed.py -x` | Wave 0 |
| SEED-02 | Seed data includes images (or null placeholder) | manual-only | Run seed, check DB | N/A |
| SEED-03 | Seed script is runnable and idempotent | integration | `pytest tests/test_seed.py::test_idempotent -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `cd apps/api && python -m pytest tests/ -x -q`
- **Per wave merge:** `cd apps/api && python -m pytest tests/ -v`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `apps/api/pyproject.toml` -- project config with pytest settings
- [ ] `apps/api/tests/conftest.py` -- shared fixtures (mock Supabase client, test app)
- [ ] `apps/api/tests/test_health.py` -- covers API-01
- [ ] `apps/api/tests/test_events.py` -- covers API-02, API-03
- [ ] `apps/api/tests/test_metrics.py` -- covers API-04, API-05
- [ ] `apps/api/tests/test_devices.py` -- covers API-06
- [ ] `apps/api/tests/test_seed.py` -- covers SEED-01, SEED-03
- [ ] Framework install: `pip install pytest httpx` -- pytest for tests, httpx for FastAPI TestClient

## Sources

### Primary (HIGH confidence)
- [FastAPI official docs](https://fastapi.tiangolo.com/) - File uploads, CORS, settings, project structure
- [Supabase Python reference](https://supabase.com/docs/reference/python/introduction) - Client init, select, insert, order, limit, storage upload, get_public_url
- [PyPI](https://pypi.org/project/supabase/) - Version 2.28.3 confirmed current
- [PyPI](https://pypi.org/project/fastapi/) - Version 0.135.1 confirmed current
- Local pip index - All package versions verified against PyPI registry 2026-03-21

### Secondary (MEDIUM confidence)
- [Supabase Storage docs](https://supabase.com/docs/guides/storage/buckets/fundamentals) - Public bucket configuration, RLS policies
- [FastAPI CORS docs](https://fastapi.tiangolo.com/tutorial/cors/) - CORSMiddleware must be first middleware
- [Supabase Python Storage upload](https://supabase.com/docs/reference/python/storage-from-upload) - Content-type case sensitivity issue
- [FastAPI project structure best practices](https://github.com/zhanymkanov/fastapi-best-practices) - File-type vs domain-based structure

### Tertiary (LOW confidence)
- CO2 multiplier values (Claude's discretion, recommended values are reasonable estimates but not sourced from EPA or specific databases)
- Category weight values (Claude's discretion, rough averages for common waste items)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages verified against PyPI, versions confirmed, Python 3.14 compatibility tested
- Architecture: HIGH - FastAPI + Supabase SDK is well-documented, patterns verified from official docs
- Pitfalls: HIGH - Content-type issue documented in Supabase GitHub issues, CORS/RLS issues are commonly reported
- Impact calculations: MEDIUM - Weight and CO2 values are Claude's discretion (reasonable but unverified estimates)

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable packages, 30-day window)
