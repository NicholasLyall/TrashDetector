"""Tests for GET /devices endpoint."""

from unittest.mock import MagicMock, patch


def test_get_devices_returns_list(client, sample_devices):
    """GET /devices should return 200 with a list of devices."""
    mock_response = MagicMock()
    mock_response.data = sample_devices

    with patch("apps.api.routers.devices.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.execute.return_value = (
            mock_response
        )
        response = client.get("/devices")

    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 2

    # Verify device fields
    device = data[0]
    assert device["id"] == "d1"
    assert device["name"] == "Pi Sorter Alpha"
    assert device["location_name"] == "Lab A"
    assert device["status"] == "online"
    assert "created_at" in device


def test_get_devices_empty_list(client):
    """GET /devices with no registered devices should return empty list."""
    mock_response = MagicMock()
    mock_response.data = []

    with patch("apps.api.routers.devices.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.execute.return_value = (
            mock_response
        )
        response = client.get("/devices")

    assert response.status_code == 200
    data = response.json()
    assert data == []


def test_get_devices_with_null_location(client, sample_devices):
    """Devices with null location_name should serialize correctly."""
    mock_response = MagicMock()
    mock_response.data = sample_devices

    with patch("apps.api.routers.devices.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.execute.return_value = (
            mock_response
        )
        response = client.get("/devices")

    data = response.json()
    # Second device has null location_name
    assert data[1]["location_name"] is None
