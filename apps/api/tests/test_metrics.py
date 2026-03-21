"""Tests for metrics service and endpoints."""

from unittest.mock import MagicMock, patch

from apps.api.services.metrics_service import compute_breakdown, compute_metrics


# --- Pure unit tests for compute_metrics ---


def test_compute_metrics_empty():
    """Empty event list should return all-zero metrics."""
    result = compute_metrics([])
    assert result == {
        "total_items": 0,
        "recycling_rate": 0.0,
        "co2_saved_kg": 0.0,
        "waste_diverted_kg": 0.0,
        "avg_confidence": 0.0,
        "uncertain_rate": 0.0,
        "fallback_rate": 0.0,
    }


def test_compute_metrics_with_events(sample_events):
    """Metrics should be correctly computed from sample events.

    Sample events: plastic(0.92), trash/fallback(0.55), metal_glass(0.88),
    paper_cardboard(0.76), trash(0.95).
    - total: 5
    - non_trash: 3 (plastic, metal_glass, paper_cardboard)
    - recycling_rate: 3/5 = 0.6
    - co2: 0.144 + 0.0 + 0.625 + 0.165 + 0.0 = 0.934 -> 0.93
    - waste_diverted: 0.08 + 0.0 + 0.25 + 0.15 + 0.0 = 0.48
    - avg_confidence: (0.92 + 0.55 + 0.88 + 0.76 + 0.95) / 5 = 0.812 -> 0.81
    - uncertain: 1 (confidence 0.55 < 0.7)
    - uncertain_rate: 1/5 = 0.2
    - fallback: 1 (e2)
    - fallback_rate: 1/5 = 0.2
    """
    result = compute_metrics(sample_events)

    assert result["total_items"] == 5
    assert result["recycling_rate"] == 0.6
    assert result["co2_saved_kg"] == 0.93
    assert result["waste_diverted_kg"] == 0.48
    assert result["avg_confidence"] == 0.81
    assert result["uncertain_rate"] == 0.2
    assert result["fallback_rate"] == 0.2


def test_compute_metrics_all_trash():
    """All-trash events should have 0 recycling rate and 0 impact."""
    events = [
        {
            "label": "trash",
            "confidence": 0.9,
            "co2_saved_kg": 0.0,
            "waste_diverted_kg": 0.0,
            "fallback_used": False,
        },
        {
            "label": "trash",
            "confidence": 0.8,
            "co2_saved_kg": 0.0,
            "waste_diverted_kg": 0.0,
            "fallback_used": False,
        },
    ]
    result = compute_metrics(events)

    assert result["total_items"] == 2
    assert result["recycling_rate"] == 0.0
    assert result["co2_saved_kg"] == 0.0
    assert result["waste_diverted_kg"] == 0.0


# --- Pure unit tests for compute_breakdown ---


def test_compute_breakdown(sample_events):
    """Breakdown should return categories sorted by count descending.

    Sample events: plastic(1), trash(2), metal_glass(1), paper_cardboard(1).
    Sorted: trash(2), then plastic/metal_glass/paper_cardboard(1 each).
    """
    result = compute_breakdown(sample_events)

    assert isinstance(result, list)
    assert len(result) == 4

    # First entry should be trash with count 2
    assert result[0]["label"] == "trash"
    assert result[0]["count"] == 2
    assert result[0]["percentage"] == 0.4

    # Remaining entries have count 1
    remaining_labels = {r["label"] for r in result[1:]}
    assert remaining_labels == {"plastic", "metal_glass", "paper_cardboard"}
    for entry in result[1:]:
        assert entry["count"] == 1
        assert entry["percentage"] == 0.2


def test_compute_breakdown_empty():
    """Empty event list should return empty breakdown."""
    result = compute_breakdown([])
    assert result == []


# --- Integration tests for metrics endpoints ---


def test_get_metrics_returns_shape(client, sample_events):
    """GET /metrics should return 200 with all 7 metric fields."""
    mock_response = MagicMock()
    mock_response.data = sample_events

    with patch("apps.api.routers.metrics.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.execute.return_value = (
            mock_response
        )
        response = client.get("/metrics")

    assert response.status_code == 200
    data = response.json()

    expected_fields = {
        "total_items",
        "recycling_rate",
        "co2_saved_kg",
        "waste_diverted_kg",
        "avg_confidence",
        "uncertain_rate",
        "fallback_rate",
    }
    assert set(data.keys()) == expected_fields
    assert data["total_items"] == 5


def test_get_breakdown_returns_categories(client, sample_events):
    """GET /metrics/breakdown should return 200 with categories list."""
    mock_response = MagicMock()
    mock_response.data = sample_events

    with patch("apps.api.routers.metrics.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.execute.return_value = (
            mock_response
        )
        response = client.get("/metrics/breakdown")

    assert response.status_code == 200
    data = response.json()

    assert "categories" in data
    assert isinstance(data["categories"], list)
    assert len(data["categories"]) == 4

    # Each category should have label, count, percentage
    for cat in data["categories"]:
        assert "label" in cat
        assert "count" in cat
        assert "percentage" in cat
