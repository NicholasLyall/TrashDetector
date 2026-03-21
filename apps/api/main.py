"""FastAPI application entry point for Smart Waste Intelligence Platform API."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.api.config import settings
from apps.api.routers import health

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

# Health check
app.include_router(health.router)

# Placeholder includes for future plans:
# app.include_router(events.router)   # Plan 02
# app.include_router(metrics.router)  # Plan 02
# app.include_router(devices.router)  # Plan 02
