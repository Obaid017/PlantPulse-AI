"""PlantPulse AI FastAPI entry point.

Local development API; deploy behind authentication and HTTPS before
exposing it publicly.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.predict import router as predict_router

app = FastAPI(title="PlantPulse AI API", version="0.2.0")

# CORS mainly matters for Expo Web; native Android does not enforce
# browser origin restrictions. Keep this list limited to local dev origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:19006",
        "http://localhost:8081",
        "http://localhost:3000",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(health_router)
app.include_router(predict_router)
