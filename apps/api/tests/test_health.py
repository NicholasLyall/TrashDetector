"""Tests for the health check endpoint (API-01)."""


def test_health_returns_200_with_status_ok(client):
    """GET /health should return 200 with {"status": "ok"}."""
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"


def test_health_response_has_no_extra_fields(client):
    """Health response should only contain the status field."""
    response = client.get("/health")
    data = response.json()

    assert set(data.keys()) == {"status"}
