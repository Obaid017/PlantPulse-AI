
import cv2
import numpy as np


def calculate_severity(img, leaf_mask):
    """
    img: OpenCV BGR image
    leaf_mask: YOLO binary leaf mask (0 or 255)
    """

    total_leaf_pixels = np.count_nonzero(leaf_mask)

    if total_leaf_pixels == 0:
        raise ValueError("Empty leaf mask")

    # 1. Detect healthy green pixels
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    lower_healthy = np.array([35, 20, 35])
    upper_healthy = np.array([95, 255, 255])

    healthy_mask = cv2.inRange(
        hsv,
        lower_healthy,
        upper_healthy
    )

    healthy_mask = cv2.bitwise_and(
        healthy_mask,
        leaf_mask
    )

    # 2. Candidate disease pixels
    disease_mask = cv2.subtract(
        leaf_mask,
        healthy_mask
    )

    # 3. Remove isolated one-pixel noise
    num_labels, labels, stats, _ = (
        cv2.connectedComponentsWithStats(
            disease_mask,
            connectivity=8
        )
    )

    filtered_mask = np.zeros_like(disease_mask)

    for i in range(1, num_labels):
        area = stats[i, cv2.CC_STAT_AREA]

        if area >= 2:
            filtered_mask[labels == i] = 255

    disease_mask = filtered_mask

    # 4. Calculate severity
    diseased_pixels = np.count_nonzero(disease_mask)

    Sd = diseased_pixels / total_leaf_pixels
    severity = Sd * 100

    # 5. Same levels as Colab
    if Sd == 0:
        level = "No affected area detected"
    elif Sd <= 0.25:
        level = "Low"
    elif Sd <= 0.50:
        level = "Mild"
    elif Sd <= 0.75:
        level = "Moderate"
    else:
        level = "Severe"

    return (
        round(severity, 2),
        level,
        disease_mask,
        int(total_leaf_pixels),
        int(diseased_pixels)
    )
