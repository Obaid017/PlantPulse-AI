
import base64
import cv2
import numpy as np


def encode_image(image):
    # PNG preserves the generated visualization
    success, buffer = cv2.imencode(".png", image)

    if not success:
        raise ValueError("Could not encode image")

    encoded = base64.b64encode(
        buffer.tobytes()
    ).decode("ascii")

    return "data:image/png;base64," + encoded


def generate_disease_heatmap(
    clean_leaf,
    disease_mask,
    leaf_mask
):
    # Same heatmap function as Google Colab
    disease_binary = (
        disease_mask > 0
    ).astype(np.float32)

    leaf_binary = (
        leaf_mask > 0
    ).astype(np.float32)

    height, width = leaf_binary.shape

    sigma = max(
        3,
        int(min(height, width) * 0.012)
    )

    # 1. Calculate local disease concentration
    blurred_disease = cv2.GaussianBlur(
        disease_binary,
        (0, 0),
        sigmaX=sigma,
        sigmaY=sigma
    )

    blurred_leaf = cv2.GaussianBlur(
        leaf_binary,
        (0, 0),
        sigmaX=sigma,
        sigmaY=sigma
    )

    density = np.divide(
        blurred_disease,
        blurred_leaf,
        out=np.zeros_like(blurred_disease),
        where=blurred_leaf > 0.01
    )

    density[leaf_mask == 0] = 0

    # 2. Normalize disease concentration
    valid_values = density[
        (leaf_mask > 0) & (density > 0.005)
    ]

    normalized = np.zeros_like(density)

    if valid_values.size > 0:
        scale = np.percentile(valid_values, 98)

        if scale > 0:
            normalized = np.clip(
                density / scale,
                0,
                1
            )

    # 3. Green -> Yellow -> Red (OpenCV BGR)
    colors = np.zeros_like(clean_leaf)

    t = normalized

    colors[:, :, 0] = 0

    colors[:, :, 1] = np.where(
        t <= 0.5,
        255,
        255 * (2 - 2 * t)
    )

    colors[:, :, 2] = np.where(
        t <= 0.5,
        510 * t,
        255
    )

    # 4. Apply heatmap to the leaf
    heatmap_output = clean_leaf.copy()

    active = (
        (leaf_mask > 0)
        & (normalized > 0.06)
    )

    alpha = 0.60

    heatmap_output[active] = (
        (1 - alpha)
        * clean_leaf[active].astype(np.float32)
        + alpha
        * colors[active].astype(np.float32)
    ).astype(np.uint8)

    heatmap_output[leaf_mask == 0] = 0

    return heatmap_output


def create_visualizations(img, leaf_mask, disease_mask):

    # Isolate leaf on a black background
    clean_leaf = cv2.bitwise_and(
        img,
        img,
        mask=leaf_mask
    )

    # Red overlay: same as Colab
    output_img = clean_leaf.copy()

    affected = disease_mask > 0

    red = np.array(
        [0, 0, 255],
        dtype=np.float32
    )

    output_img[affected] = (
        0.6 * clean_leaf[affected].astype(np.float32)
        + 0.4 * red
    ).astype(np.uint8)

    # Heatmap: same as Colab
    heatmap_img = generate_disease_heatmap(
        clean_leaf,
        disease_mask,
        leaf_mask
    )

    return {
        "affected_overlay": encode_image(output_img),
        "concentration_heatmap": encode_image(heatmap_img)
    }
