"""Tests for seed data generation logic (SEED-01, SEED-03).

All tests use generate_seed_events directly -- pure unit tests with
no Supabase calls or mocking required.
"""

from datetime import datetime, timedelta, timezone

from apps.api.constants import VALID_CATEGORIES
from apps.api.seed import SEED_DEVICE_ID, generate_seed_events

# Required fields per the sort_events schema
_REQUIRED_FIELDS = frozenset(
    {
        "id",
        "timestamp",
        "label",
        "routed_bin",
        "confidence",
        "image_url",
        "waste_diverted_kg",
        "co2_saved_kg",
        "fallback_used",
        "source_device_id",
    }
)


def test_generate_seed_events_count():
    """Generating 40 events returns exactly 40."""
    events = generate_seed_events(40)
    assert len(events) == 40


def test_generate_seed_events_all_categories_present():
    """All 4 valid categories appear among 40 generated events."""
    events = generate_seed_events(40)
    labels = {e["label"] for e in events}
    for category in VALID_CATEGORIES:
        assert category in labels, f"Category '{category}' missing from generated events"


def test_generate_seed_events_timestamps_within_3_hours():
    """All event timestamps are within the last 3 hours of generation time."""
    now = datetime.now(timezone.utc)
    three_hours_ago = now - timedelta(hours=3, minutes=1)  # small buffer
    events = generate_seed_events(40)

    for event in events:
        ts = datetime.fromisoformat(event["timestamp"])
        assert ts <= now, f"Event timestamp {ts} is in the future"
        assert ts >= three_hours_ago, f"Event timestamp {ts} is older than 3 hours"


def test_generate_seed_events_fallback_applied():
    """Some events have fallback_used=True (confidence below 0.7 threshold)."""
    events = generate_seed_events(40)
    fallback_count = sum(1 for e in events if e["fallback_used"])
    assert fallback_count > 0, "Expected some events with fallback_used=True"


def test_generate_seed_events_trash_zero_impact():
    """Trash-routed events have zero environmental impact (D-14)."""
    events = generate_seed_events(40)
    trash_events = [e for e in events if e["label"] == "trash"]
    assert len(trash_events) > 0, "Expected some trash events"

    for event in trash_events:
        assert event["waste_diverted_kg"] == 0.0, (
            f"Trash event should have 0 waste_diverted_kg, got {event['waste_diverted_kg']}"
        )
        assert event["co2_saved_kg"] == 0.0, (
            f"Trash event should have 0 co2_saved_kg, got {event['co2_saved_kg']}"
        )


def test_generate_seed_events_image_url_none():
    """All seed events have image_url=None per D-18 (placeholder images)."""
    events = generate_seed_events(40)
    for event in events:
        assert event["image_url"] is None, (
            f"Expected image_url to be None, got {event['image_url']}"
        )


def test_generate_seed_events_all_fields_present():
    """Each event dict contains all required fields."""
    events = generate_seed_events(40)
    for event in events:
        missing = _REQUIRED_FIELDS - set(event.keys())
        assert not missing, f"Event missing fields: {missing}"


def test_seed_device_id_is_fixed():
    """SEED_DEVICE_ID is a non-empty string and all events reference it."""
    assert isinstance(SEED_DEVICE_ID, str)
    assert len(SEED_DEVICE_ID) > 0

    events = generate_seed_events(40)
    for event in events:
        assert event["source_device_id"] == SEED_DEVICE_ID, (
            f"Expected source_device_id '{SEED_DEVICE_ID}', got '{event['source_device_id']}'"
        )
