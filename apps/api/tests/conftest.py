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
