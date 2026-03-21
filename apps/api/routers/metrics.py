"""Metrics endpoints: GET /metrics and GET /metrics/breakdown (API-04, API-05)."""

from fastapi import APIRouter

from apps.api.db import supabase
from apps.api.schemas import BreakdownResponse, MetricsResponse
from apps.api.services.metrics_service import compute_breakdown, compute_metrics

router = APIRouter(tags=["metrics"])


@router.get("/metrics", response_model=MetricsResponse)
def get_metrics() -> MetricsResponse:
    """Return aggregate metrics for dashboard hero and KPI strip."""
    response = supabase.table("sort_events").select("*").execute()
    return compute_metrics(response.data)


@router.get("/metrics/breakdown", response_model=BreakdownResponse)
def get_breakdown() -> BreakdownResponse:
    """Return category counts and percentages for waste composition chart."""
    response = supabase.table("sort_events").select("*").execute()
    categories = compute_breakdown(response.data)
    return BreakdownResponse(categories=categories)
