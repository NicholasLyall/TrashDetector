"""FastAPI application entry point for Smart Waste Intelligence Platform API."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.api.config import settings
from apps.api.routers import devices, events, health, metrics

app = FastAPI(
    title="Smart Waste Intelligence Platform API",
    version="1.0.0",
    description="Backend API for real-time AI-powered trash sorting analytics.",
)

# CORS middleware must be first (per research Pitfall 2)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(health.router)
app.include_router(events.router)
app.include_router(metrics.router)
app.include_router(devices.router)
