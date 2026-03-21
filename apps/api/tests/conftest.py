"""Shared test fixtures for the API test suite.

Environment variables are set before any app imports to ensure
Settings() validation passes without a real .env file.
"""

import os

import pytest

# Set dummy env vars BEFORE importing any app modules.
# This prevents Settings() from failing during test collection.
os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_KEY", "test-key-not-real")

from fastapi.testclient import TestClient  # noqa: E402

from apps.api.main import app  # noqa: E402


@pytest.fixture()
def client():
    """Provide a sync test client for non-async endpoint tests."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def sample_events():
    """Sample event records for testing metrics and breakdown computation."""
    return [
        {
            "id": "e1",
            "timestamp": "2026-03-21T16:00:00Z",
            "label": "plastic",
            "routed_bin": "plastic",
            "confidence": 0.92,
            "image_url": "https://test.com/1.jpg",
            "waste_diverted_kg": 0.08,
            "co2_saved_kg": 0.144,
            "fallback_used": False,
            "source_device_id": "d1",
            "created_at": "2026-03-21T16:00:00Z",
        },
        {
            "id": "e2",
            "timestamp": "2026-03-21T15:55:00Z",
            "label": "trash",
            "routed_bin": "trash",
            "confidence": 0.55,
            "image_url": "https://test.com/2.jpg",
            "waste_diverted_kg": 0.0,
            "co2_saved_kg": 0.0,
            "fallback_used": True,
            "source_device_id": "d1",
            "created_at": "2026-03-21T15:55:00Z",
        },
        {
            "id": "e3",
            "timestamp": "2026-03-21T15:50:00Z",
            "label": "metal_glass",
            "routed_bin": "metal_glass",
            "confidence": 0.88,
            "image_url": "https://test.com/3.jpg",
            "waste_diverted_kg": 0.25,
            "co2_saved_kg": 0.625,
            "fallback_used": False,
            "source_device_id": "d1",
            "created_at": "2026-03-21T15:50:00Z",
        },
        {
            "id": "e4",
            "timestamp": "2026-03-21T15:45:00Z",
            "label": "paper_cardboard",
            "routed_bin": "paper_cardboard",
            "confidence": 0.76,
            "image_url": None,
            "waste_diverted_kg": 0.15,
            "co2_saved_kg": 0.165,
            "fallback_used": False,
            "source_device_id": "d1",
            "created_at": "2026-03-21T15:45:00Z",
        },
        {
            "id": "e5",
            "timestamp": "2026-03-21T15:40:00Z",
            "label": "trash",
            "routed_bin": "trash",
            "confidence": 0.95,
            "image_url": "https://test.com/5.jpg",
            "waste_diverted_kg": 0.0,
            "co2_saved_kg": 0.0,
            "fallback_used": False,
            "source_device_id": "d1",
            "created_at": "2026-03-21T15:40:00Z",
        },
    ]


@pytest.fixture()
def sample_devices():
    """Sample device records for testing device endpoint."""
    return [
        {
            "id": "d1",
            "name": "Pi Sorter Alpha",
            "location_name": "Lab A",
            "status": "online",
            "created_at": "2026-03-20T10:00:00Z",
        },
        {
            "id": "d2",
            "name": "Pi Sorter Beta",
            "location_name": None,
            "status": "offline",
            "created_at": "2026-03-21T08:00:00Z",
        },
    ]
