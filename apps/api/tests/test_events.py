"""Tests for event service logic and GET /events endpoint."""

from unittest.mock import MagicMock, patch

from apps.api.services.event_service import apply_fallback, compute_impact


# --- Pure unit tests for apply_fallback ---


def test_apply_fallback_below_threshold():
    """Confidence below 0.7 should route to trash with fallback=True."""
    result = apply_fallback("plastic", 0.5)
    assert result == ("trash", True)


def test_apply_fallback_above_threshold():
    """Confidence above 0.7 should keep original label with fallback=False."""
    result = apply_fallback("plastic", 0.85)
    assert result == ("plastic", False)


def test_apply_fallback_at_threshold():
    """Confidence exactly at 0.7 should keep original label (not strictly less)."""
    result = apply_fallback("metal_glass", 0.7)
    assert result == ("metal_glass", False)


def test_apply_fallback_trash_label_low_confidence():
    """Trash label with low confidence still returns trash with fallback=True."""
    result = apply_fallback("trash", 0.3)
    assert result == ("trash", True)


# --- Pure unit tests for compute_impact ---


def test_compute_impact_non_trash():
    """Paper cardboard should return weight=0.15 and co2=0.15*1.1=0.165."""
    result = compute_impact("paper_cardboard")
    assert result == (0.15, 0.15 * 1.1)


def test_compute_impact_trash():
    """Trash should return zero impact since it goes to landfill (D-14)."""
    result = compute_impact("trash")
    assert result == (0.0, 0.0)


def test_compute_impact_plastic():
    """Plastic should return weight=0.08 and co2=0.08*1.8=0.144."""
    result = compute_impact("plastic")
    assert result == (0.08, 0.08 * 1.8)


def test_compute_impact_metal_glass():
    """Metal/glass should return weight=0.25 and co2=0.25*2.5=0.625."""
    result = compute_impact("metal_glass")
    assert result == (0.25, 0.25 * 2.5)


# --- Integration test for GET /events endpoint ---


def test_get_events_returns_list(client, sample_events):
    """GET /events should return 200 with a list of events."""
    mock_response = MagicMock()
    mock_response.data = sample_events

    with patch("apps.api.routers.events.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.order.return_value.limit.return_value.execute.return_value = (
            mock_response
        )
        response = client.get("/events")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 5
    assert data[0]["id"] == "e1"
    assert data[0]["label"] == "plastic"


def test_get_events_default_limit(client, sample_events):
    """GET /events without limit param should use default of 20."""
    mock_response = MagicMock()
    mock_response.data = sample_events

    with patch("apps.api.routers.events.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.order.return_value.limit.return_value.execute.return_value = (
            mock_response
        )
        response = client.get("/events")
        # Verify limit(20) was called
        mock_sb.table.return_value.select.return_value.order.return_value.limit.assert_called_with(20)

    assert response.status_code == 200


def test_get_events_custom_limit(client, sample_events):
    """GET /events?limit=5 should pass limit=5 to query."""
    mock_response = MagicMock()
    mock_response.data = sample_events[:2]

    with patch("apps.api.routers.events.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.order.return_value.limit.return_value.execute.return_value = (
            mock_response
        )
        response = client.get("/events?limit=5")
        mock_sb.table.return_value.select.return_value.order.return_value.limit.assert_called_with(5)

    assert response.status_code == 200
