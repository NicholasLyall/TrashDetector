# API Spec

## Base Concept
FastAPI backend with a simple event ingestion and read model.

## 1. Health
### GET /health
Returns service health status.

Response:
```json
{ "status": "ok" }
```

## 2. Event Ingestion
### POST /events
Creates a new sort event.

Expected multipart or JSON-assisted upload flow should support:
- timestamp
- label
- routed_bin
- confidence
- source_device_id
- waste_diverted_kg
- co2_saved_kg
- fallback_used
- image file or image_url

Response:
```json
{
  "id": "uuid",
  "message": "event created"
}
```

## 3. Recent Events
### GET /events?limit=20
Returns recent events sorted by newest first.

Response:
```json
[
  {
    "id": "uuid",
    "timestamp": "2026-03-21T16:42:10Z",
    "label": "plastic_bottle",
    "routed_bin": "recycle",
    "confidence": 0.92,
    "image_url": "https://...",
    "fallback_used": false
  }
]
```

## 4. Metrics
### GET /metrics
Returns aggregate metrics for dashboard hero and KPI strip.

Response:
```json
{
  "total_items": 132,
  "recycling_rate": 0.67,
  "co2_saved_kg": 5.24,
  "waste_diverted_kg": 8.4,
  "avg_confidence": 0.88,
  "uncertain_rate": 0.11,
  "fallback_rate": 0.07
}
```

## 5. Breakdown
### GET /metrics/breakdown
Returns category counts and percentages.

Response:
```json
{
  "categories": [
    { "label": "plastic_bottle", "count": 42, "percentage": 0.32 },
    { "label": "paper", "count": 26, "percentage": 0.20 }
  ]
}
```

## 6. Device List
### GET /devices
Returns registered source devices.

## 7. Notes
- Keep APIs simple and hackathon-reliable.
- Favor clear response shapes for frontend ease.
