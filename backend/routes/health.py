"""Simple health endpoint, used to check that FastAPI is running."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def check_health():
    return {"status": "ok", "service": "PlantPulse AI"}
