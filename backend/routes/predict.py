
from io import BytesIO

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError
from starlette.concurrency import run_in_threadpool

from services.predictor import predict_leaf


router = APIRouter(tags=["Plant Disease Detection"])

MAX_FILE_SIZE = 8 * 1024 * 1024  # 8 MB
MAX_IMAGE_PIXELS = 12_000_000

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


@router.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Validate image format
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Please upload a JPG, PNG or WebP image.",
        )

    # Limit uploaded file size
    image_bytes = await file.read(MAX_FILE_SIZE + 1)

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image is too large. Please use a smaller photo.",
        )

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Please select a leaf photo.",
        )

    # Read and prepare image
    try:
        with Image.open(BytesIO(image_bytes)) as opened:
            if opened.width * opened.height > MAX_IMAGE_PIXELS:
                raise HTTPException(
                    status_code=413,
                    detail="Image resolution is too large.",
                )

            image = ImageOps.exif_transpose(opened).convert("RGB")

    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="We could not read this image.",
        )

    # Run the trained model
    try:
        prediction = await run_in_threadpool(
            predict_leaf,
            image,
        )

        return prediction

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="The plant checking service is not ready.",
        )
