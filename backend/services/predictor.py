
from functools import lru_cache
from pathlib import Path

import cv2
import numpy as np
from ultralytics import YOLO

from services.severity import calculate_severity
from services.visualization import create_visualizations


MODEL_PATH = (
    Path(__file__).resolve().parents[1]
    / "models"
    / "best.pt"
)

CONFIDENCE_THRESHOLD = 0.75


@lru_cache(maxsize=1)
def get_model():
    if not MODEL_PATH.is_file():
        raise FileNotFoundError("Model not found")

    return YOLO(str(MODEL_PATH))


def predict_leaf(image):
    # Convert FastAPI PIL image to OpenCV BGR
    img = cv2.cvtColor(
        np.array(image.convert("RGB")),
        cv2.COLOR_RGB2BGR
    )

    height, width = img.shape[:2]

    model = get_model()

    # Same inference settings as Colab
    results = model.predict(
        source=img,
        conf=0.10,
        imgsz=640,
        retina_masks=True,
        device="cpu",
        verbose=False
    )

    result = results[0]

    if result.boxes is None or len(result.boxes) == 0:
        return {
            "status": "uncertain",
            "disease_name": None,
            "confidence": None,
            "severity_percent": None,
            "severity_level": None,
            "message": "Please take another clear leaf photo."
        }

    # Highest-confidence detection
    confidences = result.boxes.conf.cpu().numpy()
    best_idx = int(np.argmax(confidences))

    confidence = float(confidences[best_idx])

    class_id = int(
        result.boxes.cls[best_idx].item()
    )

    disease_name = str(
        result.names[class_id]
    ).replace("_", " ").strip().title()

    confidence_percent = round(
        confidence * 100,
        2
    )

    # Confidence threshold
    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "status": "uncertain",
            "disease_name": None,
            "confidence": confidence_percent,
            "severity_percent": None,
            "severity_level": None,
            "message": "Please take a clearer leaf photo."
        }

    # Healthy prediction
    normalized_name = disease_name.lower()

    if normalized_name in ["healthy", "healthy leaf"]:
        return {
            "status": "healthy",
            "disease_name": disease_name,
            "confidence": confidence_percent,
            "has_leaf_mask": (
                result.masks is not None
            ),
            "severity_percent": None,
            "severity_level": None,
            "affected_overlay": None,
            "concentration_heatmap": None,
            "message": "Your leaf appears healthy."
        }

    # Extract original YOLO binary mask
    if (
        result.masks is None
        or best_idx >= len(result.masks.data)
    ):
        return {
            "status": "uncertain",
            "disease_name": None,
            "confidence": confidence_percent,
            "has_leaf_mask": False,
            "severity_percent": None,
            "severity_level": None,
            "message": "Please take a clearer leaf photo."
        }

    mask = (
        result.masks.data[best_idx]
        .cpu()
        .numpy()
    )

    if mask.shape != (height, width):
        mask = cv2.resize(
            mask,
            (width, height),
            interpolation=cv2.INTER_NEAREST
        )

    leaf_mask = (
        (mask > 0.5).astype(np.uint8) * 255
    )

    if np.count_nonzero(leaf_mask) == 0:
        return {
            "status": "uncertain",
            "disease_name": None,
            "confidence": confidence_percent,
            "has_leaf_mask": False,
            "severity_percent": None,
            "severity_level": None,
            "message": "Please take a clearer leaf photo."
        }

    # Same severity calculation as Colab
    (
        severity,
        level,
        disease_mask,
        total_leaf_pixels,
        diseased_pixels
    ) = calculate_severity(img, leaf_mask)

    # Same visualizations as Colab
    visualizations = create_visualizations(
        img,
        leaf_mask,
        disease_mask
    )

    return {
        "status": "diseased",
        "disease_name": disease_name,
        "confidence": confidence_percent,
        "has_leaf_mask": True,
        "total_leaf_pixels": total_leaf_pixels,
        "candidate_affected_pixels": diseased_pixels,
        "severity_percent": severity,
        "severity_level": level,
        "affected_overlay": visualizations["affected_overlay"],
        "concentration_heatmap": visualizations["concentration_heatmap"],
        "message": "Possible disease detected in your leaf."
    }
