"""Event endpoints: POST /events and GET /events (API-02, API-03)."""

from fastapi import APIRouter, File, Form, UploadFile

from apps.api.db import supabase
from apps.api.schemas import EventCreateResponse, EventResponse
from apps.api.services.event_service import create_event as create_event_service

router = APIRouter(tags=["events"])


@router.post("/events", response_model=EventCreateResponse)
async def create_event(
    label: str = Form(...),
    confidence: float = Form(...),
    source_device_id: str = Form(...),
    image: UploadFile = File(...),
) -> EventCreateResponse:
    """Create a new sort event with image upload.

    Accepts multipart form data from the Pi with label, confidence,
    device ID, and captured image. Applies fallback logic and
    computes environmental impact.
    """
    result = await create_event_service(label, confidence, source_device_id, image)
    return EventCreateResponse(**result)


@router.get("/events", response_model=list[EventResponse])
def get_events(limit: int = 20) -> list[EventResponse]:
    """Return recent sort events ordered newest first.

    Args:
        limit: Maximum number of events to return (default 20).
    """
    response = (
        supabase.table("sort_events")
        .select("*")
        .order("timestamp", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data
