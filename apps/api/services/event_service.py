"""Business logic for event creation: fallback, impact calculation, storage upload."""

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, UploadFile

from apps.api.constants import (
    CATEGORY_WEIGHTS,
    CO2_MULTIPLIERS,
    CONFIDENCE_THRESHOLD,
    VALID_CATEGORIES,
)
from apps.api.db import supabase


def apply_fallback(label: str, confidence: float) -> tuple[str, bool]:
    """Apply fallback logic based on confidence threshold (D-04, D-05).

    If confidence is below CONFIDENCE_THRESHOLD, route to trash bin.

    Returns:
        Tuple of (final_label, fallback_used).
    """
    if confidence < CONFIDENCE_THRESHOLD:
        return ("trash", True)
    return (label, False)


def compute_impact(label: str) -> tuple[float, float]:
    """Compute environmental impact for a sorted item (D-12, D-13, D-14).

    Trash-routed items get zero impact since they go to landfill.

    Returns:
        Tuple of (waste_diverted_kg, co2_saved_kg).
    """
    if label == "trash":
        return (0.0, 0.0)

    weight = CATEGORY_WEIGHTS[label]
    co2 = weight * CO2_MULTIPLIERS[label]
    return (weight, co2)


async def create_event(
    label: str,
    confidence: float,
    source_device_id: str,
    image: UploadFile,
) -> dict:
    """Create a new sort event with fallback logic, impact calculation, and image upload.

    Validates label, applies fallback if confidence is low, computes environmental
    impact, uploads image to Supabase Storage, and inserts the event record.

    Returns:
        Dict with event id and confirmation message.

    Raises:
        HTTPException: If label is not a valid category.
    """
    if label not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid label '{label}'. Must be one of: {', '.join(VALID_CATEGORIES)}",
        )

    final_label, fallback_used = apply_fallback(label, confidence)
    waste_diverted_kg, co2_saved_kg = compute_impact(final_label)

    timestamp = datetime.now(timezone.utc)
    image_path = f"{timestamp.strftime('%Y%m%d_%H%M%S')}_{final_label}.jpg"

    # Upload image to Supabase Storage (D-08, D-10)
    image_bytes = await image.read()
    supabase.storage.from_("sort-images").upload(
        path=image_path,
        file=image_bytes,
        file_options={"content-type": image.content_type or "image/jpeg"},
    )

    image_url = supabase.storage.from_("sort-images").get_public_url(image_path)

    event_id = str(uuid.uuid4())

    # Insert event record (D-02, D-03: label == routed_bin after fallback)
    supabase.table("sort_events").insert(
        {
            "id": event_id,
            "timestamp": timestamp.isoformat(),
            "label": final_label,
            "routed_bin": final_label,
            "confidence": confidence,
            "image_url": image_url,
            "waste_diverted_kg": waste_diverted_kg,
            "co2_saved_kg": co2_saved_kg,
            "fallback_used": fallback_used,
            "source_device_id": source_device_id,
        }
    ).execute()

    return {"id": event_id, "message": "event created"}
