# PlantPulse AI

**Groundnut Disease Detection, Severity Estimation and Early Crop Care**

Final Year Project (FYP) | BS Software Engineering  
**Project status:** Active development — updated **25 November 2026**  
**Repository:** https://github.com/Obaid017/PlantPulse-AI

PlantPulse AI is a farmer-focused mobile application for **groundnut (peanut) leaf disease detection**. Farmers take or select a photo of a groundnut leaf, and the app uses a locally hosted FastAPI service and a trained YOLO11m-Seg model to provide a possible disease class, prediction confidence, an estimated affected-leaf percentage, and visualizations. Successful checks can be saved to Supabase and opened again later.

The main goal is **early identification and timely crop care**, helping farmers inspect their fields and take appropriate action before a disease spreads. PlantPulse AI is an **in-development decision-support tool**, not a confirmed field diagnosis or pesticide prescription.

## Current development status

| Feature | Current status |
| --- | --- |
| Real Supabase email/password authentication | Implemented |
| React Native mobile screens and navigation | Implemented |
| Camera and gallery photo selection | Implemented |
| Automatic photo resizing / JPEG preparation | Implemented; further device testing ongoing |
| FastAPI `POST /predict` with YOLO11m-Seg | Implemented; runs locally on laptop |
| Five groundnut classification classes | Implemented |
| Prediction confidence and uncertainty handling | Implemented; validation still needed |
| OpenCV affected-area percentage and four severity levels | Implemented; estimates are not ground-truth lesion measurements |
| Affected-area red overlay and concentration heatmap | Implemented |
| Save real scans and images to Supabase | Implemented |
| Recent checks, History and complete saved reports | Implemented |
| Disease care and severity-specific advice (English/Urdu) | Implemented as a research-informed draft |
| Medicine reference catalog | Implemented; Pakistan crop-label doses are **not verified** |
| Community Hub posting and comments | **Not implemented — Coming Soon** |
| Dedicated groundnut / non-leaf image validator | **Not implemented** |
| Full model evaluation, field testing and deployment | In progress / planned |

**No fake scan results are used in the real application.** The app needs a running backend for predictions. Some older project documentation and milestones may still refer to initial setup work; this README reflects the current implementation.

## Groundnut classes and severity

The trained model currently predicts one of five classes:

1. Alternaria Leaf Spot
2. Early Leaf Spot
3. Late Leaf Spot
4. Rust
5. Healthy Leaf

For a non-healthy result, the backend estimates the fraction of the **segmented image region** identified as potentially affected using an OpenCV color-based method:

| Estimated affected area on the photographed leaf | App level |
| --- | --- |
| Above 0% to 25% | Low |
| Above 25% to 50% | Mild |
| Above 50% to 75% | Moderate |
| Above 75% to 100% | Severe |

A diseased-class prediction with **0% estimated affected area** is currently treated as **uncertain**, not a valid disease diagnosis. Healthy leaves do not receive a disease severity level.

**These levels are project-defined categories for one photograph, not field-wide severity or scientifically validated spray thresholds.** The red overlay and heatmap are derived from segmentation/color heuristics; the heatmap is **not Grad-CAM**. The severity method still needs comparison with expert-annotated lesion masks.

## Farmer workflow

1. Sign up or sign in.
2. Open **Check Leaf** and take or choose a clear groundnut-leaf photo.
3. The mobile app prepares the photo and sends it to FastAPI on the local network.
4. YOLO11m-Seg predicts the leaf class and mask. OpenCV estimates affected area for diseased predictions.
5. The app displays the **Plant Health Report**, including confidence, severity and visualizations when appropriate.
6. Farmers can separately select **View Treatment & Recommendations** to read causes, immediate actions, prevention, medicine information and follow-up advice in English or Urdu.
7. Successful healthy/diseased reports and images are saved to Supabase and appear under **Home → Recent Leaf Checks** and **History**.
8. **Share to Community** currently displays a **Coming Soon** message; it does not publish anything.

When a result is uncertain, the app asks for another groundnut-leaf photo and does **not** offer disease-specific treatment. A high model confidence alone does not prove the image contains a groundnut leaf. More non-leaf testing and an independent validator are still required.

## Technology stack

| Layer | Technology |
| --- | --- |
| Mobile application | React Native, Expo SDK 58, JavaScript |
| Navigation and UI | React Navigation, React Native, Expo Vector Icons |
| Backend API | Python, FastAPI, Uvicorn |
| Disease prediction | Ultralytics YOLO11m-Seg (`best.pt`) |
| Image processing | OpenCV, NumPy, Pillow |
| Mobile image preparation | Expo Image Picker and Expo Image Manipulator |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL with Row Level Security (RLS) |
| Image storage | Private Supabase Storage bucket (`plant-scans`) |
| Source control | Git and GitHub |

**Current architecture:** Expo app → local FastAPI/`/predict` for ML inference; Expo app → Supabase for authentication, saved reports, image storage and recommendation data. The backend is **not** a public production service yet.

## Repository layout

```text
PlantPulse-AI/
├── mobile/
│   ├── App.js
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── context/AuthContext.js
│       ├── data/
│       │   ├── diseaseCare.js
│       │   ├── severityRules.js
│       │   └── medicineCatalog.js
│       ├── navigation/RootNavigator.js
│       ├── screens/
│       │   ├── ScanScreen.js
│       │   ├── DiagnosisResultScreen.js
│       │   ├── SavedScanDetailScreen.js
│       │   ├── HistoryScreen.js
│       │   ├── TreatmentScreen.js
│       │   └── CommunityScreen.js
│       └── services/
│           ├── imageProcessingService.js
│           ├── predictionService.js
│           ├── scanHistoryService.js
│           ├── scanSaveService.js
│           ├── recommendationService.js
│           └── supabaseClient.js
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routes/
│   ├── services/
│   │   ├── predictor.py
│   │   ├── severity.py
│   │   └── visualization.py
│   └── models/best.pt          # local only; ignored by Git
├── database/
│   └── migrations/
│       ├── 20261124_create_scan_history.sql
│       └── 20261124_create_recommendation_catalog.sql
├── docs/
├── .gitignore
└── README.md
```

The repository does **not** contain model weights, uploaded datasets, `.env` credentials, the Python virtual environment or installed `node_modules`.

## Run locally on Windows

### 1. Requirements

- Windows 11, VS Code, Git
- Node.js and npm
- Python (the development environment has used Python 3.10)
- Expo Go on an Android phone compatible with the project's Expo SDK
- An existing Supabase project
- Laptop and phone on the same Wi-Fi or hotspot, with device-to-device access

Use separate terminals for Expo and FastAPI.

### 2. Supabase and mobile environment

From the project root, copy `mobile/.env.example` to `mobile/.env` and fill in:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLISHABLE-KEY
EXPO_PUBLIC_API_URL=http://YOUR-LAPTOP-WIFI-IP:8000
```

Use the **publishable key only** in the mobile app. Never put Supabase secret/service-role credentials into `EXPO_PUBLIC_` values.

Find the current laptop Wi-Fi IPv4 address with:

```powershell
ipconfig
```

Use the IPv4 address under the **active Wi-Fi adapter**, not VMware, WSL or disconnected adapters. A laptop's local IP may change after reconnecting or switching networks. Do not use `127.0.0.1` or `localhost` as the API host on a physical phone.

### 3. Set up the database and storage

In Supabase **SQL Editor**, paste and execute the actual SQL contents (not the filename) of:

1. `database/migrations/20261124_create_scan_history.sql`
2. `database/migrations/20261125_add_scan_image_paths.sql`
3. `database/migrations/20261124_create_recommendation_catalog.sql`

The second migration adds the three scan-image paths required by the existing mobile saving flow. It is safe to apply if those columns were already added manually. **Do not rerun the original scan-history script if its named policies already exist.**


Create a **private** Supabase Storage bucket named `plant-scans`. Configure appropriate Storage policies for authenticated uploads, reads and cleanup scoped to each user's own folder. The mobile code stores objects under `<user-id>/<scan-id-folder>/...` and retrieves temporary signed URLs. The application has previously been configured manually in Supabase; a fresh project still needs those bucket policies.

The recommendation migration seeds **5 plant classes**, **16 disease × severity rules**, and **4 medicine research records**. The mobile app also contains a bundled advice fallback.

### 4. Start the FastAPI backend

In a terminal:

```powershell
cd C:\Users\Obaid\PlantPulse-AI\backend
py -3.10 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip install ultralytics opencv-python numpy pillow
.\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Important:** `backend/requirements.txt` now lists the FastAPI, YOLO, OpenCV, NumPy, Pillow and local test dependencies. A fresh install can be large because Ultralytics requires PyTorch. If the virtual environment already exists, skip `py -3.10 -m venv .venv`; install missing packages with the requirements command only.

Place the separately backed-up trained model here:

```text
backend/models/best.pt
```

Test on the laptop:

- `http://127.0.0.1:8000/health` — service status
- `http://127.0.0.1:8000/docs` — FastAPI Swagger interface

Then test from the phone using `http://YOUR-LAPTOP-WIFI-IP:8000/docs`. If the phone cannot open it, check the IP, Wi-Fi/hotspot isolation, firewall and whether the backend is running.

### 5. Start Expo

In a second terminal:

```powershell
cd C:\Users\Obaid\PlantPulse-AI\mobile
npm install
npx expo start --clear
```

Scan the Expo QR code with Expo Go. If you edit `mobile/.env`, restart Expo so the application receives the updated API address.

The app needs a **running laptop backend** for ML inference. Supabase services require internet connectivity.

## Prediction and image handling

- `POST /predict` accepts JPEG, PNG or WebP uploads (maximum **8 MB**, maximum **12 megapixels** at the backend).
- The mobile app prepares camera/gallery images, resizes their longest side to at most **1920 pixels**, and saves them as JPEG before upload.
- The YOLO confidence acceptance threshold is **0.75**.
- An empty detection, low confidence, missing/empty mask, or diseased-class result with no measured affected area returns `uncertain`.
- Only healthy/diseased accepted predictions are stored in scan history.
- Disease red overlays and concentration heatmaps are produced by the Python backend. Healthy results have no severity or lesion visualization.

**Limitations:** A mask and a 75% confidence score are not an independent groundnut-species check. Non-leaf photos can still be misclassified, especially if they resemble the model's learned textures or colors. We need a proper validation dataset and likely negative-image training or a separate groundnut leaf validator.

## Treatment and prevention module

The treatment page is **separate from the diagnosis result** and includes:

- Cause and visible signs of the predicted disease
- Immediate early-stage action, spread risk and prevention
- Disease-specific advice for Low / Mild / Moderate / Severe
- Three optional field questions: symptoms on many plants, rainy/humid weather, previous spraying
- English/Urdu selection
- Pakistan-market medicine references and safety notes
- Follow-up inspection advice

The four medicine entries are **research leads**, not verified application instructions. The database has no validated Pakistan groundnut-label doses or spray intervals yet. Do not infer spray quantities from leaf severity, use products only if the current groundnut/disease label allows them, and confirm directions with qualified local agricultural guidance.

## Community Hub

The Community tab and **Share to Community** currently show **Coming Soon**. No posts, comments, image sharing or public publication are implemented yet.

## Testing checklist

- [ ] Sign up, verify email (when enabled), sign in and restore session
- [ ] Take a photo and choose one from the gallery
- [ ] Automatically prepare a large photo without exceeding the upload limit
- [ ] Run a real healthy groundnut sample
- [ ] Run real samples for all four disease classes
- [ ] Verify severity percentage, level, red overlay and heatmap
- [ ] Check an unrelated object; it should not trigger a treatment recommendation
- [ ] Confirm disease + 0% affected area is treated as uncertain
- [ ] Confirm uncertain results hide treatment and Community actions
- [ ] Verify accepted scans save in Supabase and open with images from History
- [ ] Test all 16 disease/severity advice combinations and both languages
- [ ] Verify Community shows Coming Soon and does not publish anything
- [ ] Test with different phones, camera resolutions and network conditions

These are **manual test cases**, not claims that they have all passed.

## Work still required

1. **Non-leaf and wrong-crop rejection:** collect representative positive and negative images; evaluate false acceptance/rejection; improve the validator.
2. **ML validation:** verify disease classification on independent images and compare lesion estimates against annotated regions.
3. **Medicine verification:** confirm up-to-date Pakistan-registered groundnut labels, suitable diseases, dose, timing and safety restrictions before offering actual spray prescriptions.
4. **Field follow-up:** store field-condition answers and versioned treatment advice with scan history.
5. **Community module:** implement posts, comments, photo uploads and suitable moderation/privacy controls.
6. **Production readiness:** improve the backend dependency manifest, authentication/authorization between services, testing, Docker and deployment to a stable HTTPS endpoint.

## GitHub and backups

This repository is already connected to GitHub. To publish additional local changes:

```powershell
git status
git add <paths-you-want-to-commit>
git diff --cached --name-only
git commit -m "Describe the update"
git push origin main
```

Never commit `mobile/.env`, backend secrets, datasets or trained model weights. Back up `backend/models/best.pt` separately (for example, in a private cloud drive).

---

**PlantPulse AI is a working FYP prototype under active development**, focused on helping farmers identify possible groundnut leaf diseases early and make better-informed care decisions. Its results and treatment information require further validation before field deployment.
