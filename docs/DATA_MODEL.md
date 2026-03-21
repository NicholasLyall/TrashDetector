# Data Model

## 1. Core Table: sort_events

Suggested columns:

- `id` UUID primary key
- `timestamp` timestamptz not null
- `label` text not null
- `routed_bin` text not null
- `confidence` numeric not null
- `image_url` text
- `waste_diverted_kg` numeric default 0
- `co2_saved_kg` numeric default 0
- `fallback_used` boolean default false
- `source_device_id` uuid or text reference
- `created_at` timestamptz default now()

## 2. Devices Table

Suggested columns:
- `id`
- `name`
- `location_name`
- `status`
- `created_at`

## 3. Optional Daily Rollups

A derived table or materialized view can summarize:
- total items by day
- total CO2 saved by day
- total waste diverted by day
- category breakdown by day

## 4. Event Semantics

Each row in `sort_events` represents a finalized routing event, not a raw frame.

## 5. Environmental Calculations

Store per-event impact directly when possible for demo simplicity.
This avoids recalculating complex formulas on every frontend load.
