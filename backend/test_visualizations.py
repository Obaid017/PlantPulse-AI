
import requests
import base64
from pathlib import Path

# FastAPI prediction endpoint
API_URL = "http://127.0.0.1:8000/predict"

# Ask for an image from your computer
image_path = input("Enter full leaf image path: ").strip().strip('"')

image = Path(image_path)

if not image.is_file():
    print("Image not found. Check the path.")
    raise SystemExit(1)

# Send the real image to FastAPI
with open(image, "rb") as file:
    response = requests.post(
        API_URL,
        files={"file": (image.name, file, "image/jpeg")},
        timeout=180,
    )

response.raise_for_status()

data = response.json()

print("\nDisease:", data.get("disease_name"))
print("Confidence:", data.get("confidence"))
print("Affected area:", data.get("severity_percent"))
print("Severity level:", data.get("severity_level"))

# Folder for generated images
output_folder = Path("visualization_outputs")
output_folder.mkdir(exist_ok=True)

# Save both visualizations
for key, filename in [
    ("affected_overlay", "red_overlay.jpg"),
    ("concentration_heatmap", "heatmap.jpg"),
]:
    encoded = data.get(key)

    if encoded:
        base64_data = encoded.split(",", 1)[-1]

        output_path = output_folder / filename

        output_path.write_bytes(
            base64.b64decode(base64_data)
        )

        print("Saved:", output_path.resolve())
    else:
        print(filename, "- Not available for this result")

print("\nTest completed.")
