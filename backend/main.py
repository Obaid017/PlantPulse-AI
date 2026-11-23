"""PlantPulse AI backend entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.predict import router as predict_router

app = FastAPI(title="PlantPulse AI API", version="0.1.0")

# CORS is useful for Expo Web. Phone apps are not browser-origin restricted.
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
