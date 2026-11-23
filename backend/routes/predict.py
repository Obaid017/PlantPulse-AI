"""Prediction API placeholder. Real model integration is our next milestone."""

from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter()


@router.post("/predict")
async def predict_leaf(file: UploadFile = File(...)):
    # Do not return invented diseases or fake severity values.
    # Next we will load best.pt, verify the Supabase JWT, run YOLO and OpenCV,
    # and return real disease/severity/visualization results here.
    raise HTTPException(
        status_code=501,
        detail="AI prediction is not connected yet. This is the backend starter.",
    )
