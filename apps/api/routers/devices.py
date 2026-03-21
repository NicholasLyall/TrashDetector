"""Device endpoints: GET /devices (API-06)."""

from fastapi import APIRouter

from apps.api.db import supabase
from apps.api.schemas import DeviceResponse

router = APIRouter(tags=["devices"])


@router.get("/devices", response_model=list[DeviceResponse])
def get_devices() -> list[DeviceResponse]:
    """Return list of registered source devices."""
    response = supabase.table("devices").select("*").execute()
    return response.data
