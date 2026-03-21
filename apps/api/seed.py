"""Idempotent seed script for populating demo data (D-16 through D-19).

Creates a default device and ~40 realistic sort events across all waste
categories with varied confidence scores, timestamps, and fallback states.

Run as: python -m apps.api.seed
"""

import random
import uuid
from datetime import datetime, timedelta, timezone

from apps.api.constants import VALID_CATEGORIES
from apps.api.db import supabase
from apps.api.services.event_service import apply_fallback, compute_impact

# Fixed UUID for idempotent upsert (D-19)
SEED_DEVICE_ID: str = "d0000000-0000-0000-0000-000000000001"

# Default device record (D-19)
SEED_DEVICE: dict = {
    "id": SEED_DEVICE_ID,
    "name": "Pi Sorter Alpha",
    "location_name": "Lab Station 1",
    "status": "active",
}

# Category distribution weights: paper_cardboard, metal_glass, plastic, trash
_CATEGORY_WEIGHTS: list[int] = [25, 20, 30, 25]


def generate_seed_events(
    count: int = 40,
    *,
    seed: int | None = 42,
) -> list[dict]:
    """Generate realistic demo events spread across the last 3 hours (D-17).

    Events have varied confidence scores (0.45-0.99), including some below
    the 0.7 threshold to trigger fallback routing to trash (D-04).

    Args:
        count: Number of events to generate.
        seed: Random seed for reproducibility. Pass None for non-deterministic output.

    Returns:
        List of event dicts sorted by timestamp descending (newest first).
    """
    rng = random.Random(seed)
    now = datetime.now(timezone.utc)
    events: list[dict] = []

    for _ in range(count):
        label = rng.choices(VALID_CATEGORIES, weights=_CATEGORY_WEIGHTS, k=1)[0]
        confidence = round(rng.uniform(0.45, 0.99), 2)
        final_label, fallback_used = apply_fallback(label, confidence)
        waste_diverted_kg, co2_saved_kg = compute_impact(final_label)
        timestamp = now - timedelta(minutes=rng.randint(1, 180))

        event = {
            "id": str(uuid.UUID(int=rng.getrandbits(128), version=4)),
            "timestamp": timestamp.isoformat(),
            "label": final_label,
            "routed_bin": final_label,
            "confidence": confidence,
            "image_url": None,
            "waste_diverted_kg": waste_diverted_kg,
            "co2_saved_kg": co2_saved_kg,
            "fallback_used": fallback_used,
            "source_device_id": SEED_DEVICE_ID,
        }
        events.append(event)

    # Sort newest first
    sorted_events = sorted(events, key=lambda e: e["timestamp"], reverse=True)
    return sorted_events


def wipe_data() -> None:
    """Delete all rows from sort_events table.

    Uses a filter that matches all rows since Supabase requires
    a WHERE clause for DELETE operations.
    """
    supabase.table("sort_events").delete().neq(
        "id", "00000000-0000-0000-0000-000000000000"
    ).execute()


def seed(count: int = 40) -> None:
    """Wipe existing events and insert fresh demo data (D-19 idempotent).

    1. Deletes all existing sort_events
    2. Upserts the default device
    3. Generates and inserts new events

    Args:
        count: Number of events to generate and insert.
    """
    print("Wiping existing events...")
    wipe_data()

    print("Upserting default device...")
    supabase.table("devices").upsert(SEED_DEVICE).execute()

    print(f"Generating {count} seed events...")
    events = generate_seed_events(count)

    print("Inserting seed events...")
    supabase.table("sort_events").insert(events).execute()

    print(f"Seed complete: {count} events inserted")


if __name__ == "__main__":
    try:
        seed()
    except Exception as exc:
        error_msg = str(exc)
        if "SUPABASE_URL" in error_msg or "SUPABASE_KEY" in error_msg:
            print(
                "Error: Supabase credentials not configured.\n"
                "Create apps/api/.env with SUPABASE_URL and SUPABASE_KEY.\n"
                "See apps/api/.env.example for the template."
            )
        else:
            print(f"Seed failed: {error_msg}")
        raise SystemExit(1) from exc
