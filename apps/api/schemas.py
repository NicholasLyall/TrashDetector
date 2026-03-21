"""Pydantic v2 response models for all API endpoints.

Defined interface-first so downstream plans can implement endpoints
against stable response contracts.
"""

from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    """GET /health response."""

    status: str


class EventCreateResponse(BaseModel):
    """POST /events response."""

    id: str
    message: str


class EventResponse(BaseModel):
    """GET /events response item."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    timestamp: str
    label: str
    routed_bin: str
    confidence: float
    image_url: str | None
    waste_diverted_kg: float
    co2_saved_kg: float
    fallback_used: bool
    source_device_id: str


class MetricsResponse(BaseModel):
    """GET /metrics response."""

    total_items: int
    recycling_rate: float
    co2_saved_kg: float
    waste_diverted_kg: float
    avg_confidence: float
    uncertain_rate: float
    fallback_rate: float


class CategoryBreakdown(BaseModel):
    """Single category entry in breakdown response."""

    label: str
    count: int
    percentage: float


class BreakdownResponse(BaseModel):
    """GET /metrics/breakdown response."""

    categories: list[CategoryBreakdown]


class DeviceResponse(BaseModel):
    """GET /devices response item."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    location_name: str | None
    status: str
    created_at: str
