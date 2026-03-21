# Architecture

## 1. End-to-End System

```text
User drops trash
    ↓
Physical funnel / staging mechanism
    ↓
Raspberry Pi camera captures staged item
    ↓
YOLO model performs inference on Pi
    ↓
Servo routes item to bin
    ↓
Pi uploads event + image to backend
    ↓
FastAPI writes metadata to Supabase Postgres
    ↓
Image stored in Supabase Storage
    ↓
Next.js dashboard polls backend every 1–2 seconds
    ↓
Live feed + impact metrics + charts refresh
```

## 2. Major Components

### A. Hardware sorter
Responsibilities:
- accept trash input
- reduce chaos with a funnel/staging mechanism
- allow one-item classification
- physically route item after classification

### B. Raspberry Pi runtime
Responsibilities:
- capture image from camera
- run inference using YOLO
- apply confidence threshold and fallback logic
- trigger servo motion
- package event data
- send event and image to backend

### C. FastAPI backend
Responsibilities:
- ingest events
- store event metadata
- store or coordinate image upload reference
- serve recent events and aggregate metrics

### D. Supabase Postgres
Responsibilities:
- store sort events
- store devices
- support aggregate queries

### E. Supabase Storage
Responsibilities:
- store snapshots from sorted items

### F. Next.js dashboard
Responsibilities:
- render live feed
- render hero impact metrics
- render waste composition charts
- render model summary metrics

## 3. Why this architecture

This architecture is ideal for the project because:
- Pi and backend both use Python-friendly workflows,
- the dashboard uses a polished modern web stack,
- Supabase reduces backend overhead,
- polling is simpler than websockets and still feels live.

## 4. Realtime Strategy

For hackathon reliability, use polling every 1–2 seconds from the frontend.

## 5. Event Lifecycle

1. Pi stages and classifies item.
2. Pi computes routed bin and fallback logic.
3. Pi saves image locally.
4. Pi uploads image or sends it with event flow.
5. Backend persists event.
6. Frontend fetches fresh data.
