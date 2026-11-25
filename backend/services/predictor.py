
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


def uncertain_result(
    message,
    confidence=None,
    has_leaf_mask=False
):
    """
    Return a consistent response when no reliable
    disease or healthy diagnosis can be made.
    """

    return {
        "status": "uncertain",
        "disease_name": None,
        "confidence": confidence,
        "has_leaf_mask": has_leaf_mask,
        "severity_percent": None,
        "severity_level": None,
        "affected_overlay": None,
        "concentration_heatmap": None,
        "message": message,
    }


def predict_leaf(image):

    # Convert PIL image to OpenCV BGR
    img = cv2.cvtColor(
        np.array(image.convert("RGB")),
        cv2.COLOR_RGB2BGR
    )

    height, width = img.shape[:2]

    model = get_model()

    # Preserve inference settings from Colab
    results = model.predict(
        source=img,
        conf=0.10,
        imgsz=640,
        retina_masks=True,
        device="cpu",
        verbose=False
    )

    result = results[0]

    # 1. Check whether YOLO returned any detection
    if (
        result.boxes is None
        or len(result.boxes) == 0
    ):
        return uncertain_result(
            "We could not identify a groundnut leaf "
            "reliably. Please take another clear photo."
        )

    # 2. Select highest-confidence detection
    confidences = result.boxes.conf.cpu().numpy()

    best_idx = int(np.argmax(confidences))

    confidence = float(confidences[best_idx])

    confidence_percent = round(
        confidence * 100,
        2
    )

    class_id = int(
        result.boxes.cls[best_idx].item()
    )

    disease_name = str(
        result.names[class_id]
    ).replace("_", " ").strip().title()

    # 3. Reject low-confidence predictions
    if confidence < CONFIDENCE_THRESHOLD:
        return uncertain_result(
            "The prediction is not reliable enough. "
            "Please take another clear leaf photo.",
            confidence=confidence_percent
        )

    # 4. Require a usable segmentation mask
    # BEFORE declaring a leaf healthy or diseased.
    if (
        result.masks is None
        or best_idx >= len(result.masks.data)
    ):
        return uncertain_result(
            "We could not confirm the leaf area. "
            "Please take another groundnut leaf photo.",
            confidence=confidence_percent
        )

    # 5. Extract the selected YOLO mask
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

    total_mask_pixels = int(
        np.count_nonzero(leaf_mask)
    )

    if total_mask_pixels == 0:
        return uncertain_result(
            "We could not identify a usable leaf area. "
            "Please take another photo.",
            confidence=confidence_percent
        )

    # Important:
    # A YOLO mask does not prove this object
    # is really a groundnut leaf. A dedicated
    # validator may still be needed.

    normalized_name = disease_name.lower()

    # 6. Healthy leaf
    if normalized_name in ["healthy", "healthy leaf"]:
        return {
            "status": "healthy",
            "disease_name": "Healthy Leaf",
            "confidence": confidence_percent,
            "has_leaf_mask": True,
            "severity_percent": None,
            "severity_level": None,
            "affected_overlay": None,
            "concentration_heatmap": None,
            "message": "Your leaf appears healthy."
        }

    # 7. Calculate affected area using
    # the existing OpenCV/Colab method.
    (
        severity,
        level,
        disease_mask,
        total_leaf_pixels,
        diseased_pixels
    ) = calculate_severity(
        img,
        leaf_mask
    )

    # 8. Do not issue a disease diagnosis
    # with zero estimated affected area.
    if (
        not np.isfinite(severity)
        or severity <= 0
        or diseased_pixels == 0
    ):
        return uncertain_result(
            "The disease prediction and affected-area "
            "estimate did not agree. Please take another "
            "clear groundnut leaf photo.",
            confidence=confidence_percent,
            has_leaf_mask=True
        )

    # 9. Only generate visualizations for
    # usable disease predictions.
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
        "affected_overlay": visualizations[
            "affected_overlay"
        ],
        "concentration_heatmap": visualizations[
            "concentration_heatmap"
        ],
        "message": (
            "Possible disease detected in your leaf."
        )
    }
