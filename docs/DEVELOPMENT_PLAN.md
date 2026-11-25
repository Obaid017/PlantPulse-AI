# PlantPulse AI — Development Status & Roadmap

**Updated:** 25 November 2026  
**Goal:** A practical groundnut leaf disease detection and early-care application for farmers, starting with validated screening before adding a full Community Hub.

The checked boxes below describe **features implemented in the repository**; they do not imply full scientific validation or production readiness.

## Completed implementation

- [x] Multi-file React Native JavaScript application (Expo SDK 58)
- [x] Farmer-oriented Home, Check Leaf, History, Profile and navigation
- [x] Supabase Auth: sign-up, sign-in, session restoration and sign-out
- [x] Camera/gallery picking and JPEG photo preparation (longest dimension limited to 1920 pixels)
- [x] Local FastAPI `/health` and `POST /predict` endpoints
- [x] YOLO11m-Seg integration with the five classes (four diseases plus healthy)
- [x] 75% confidence rule, required nonempty segmentation mask, and uncertain-result handling
- [x] Refuse disease-specific advice when a diseased-class result has 0% measured affected area
- [x] OpenCV color-based affected-area estimate and four project-defined levels
- [x] Red candidate-disease overlay and concentration heatmap (not Grad-CAM)
- [x] Supabase history with original photo/overlay/heatmap paths and private signed URLs
- [x] Home recent-check preview and saved report detail screen
- [x] Research-informed bilingual treatment page with 16 disease/severity action rules
- [x] Basic field-condition questions: spread, wet weather and previous spray
- [x] Medicine information records labeled by their evidence/verification status
- [x] Community tab and Share action currently show a simple **Coming Soon** message
- [x] GitHub repository and .gitignore for local secrets and ML weights

## In progress / quality checks

- [ ] **Non-leaf rejection:** evaluate real groundnut leaves, other crops and everyday objects; improve with negative data or a separate groundnut validator. A YOLO mask does not confirm species.
- [ ] **Disease model evaluation:** class-wise metrics and representative independent test images, including field photographs.
- [ ] **Severity validation:** compare HSV-color estimates with manually labeled disease regions; assess lighting effects.
- [ ] **Usability:** improve farmer-facing text and error handling; test different Android devices, screen sizes, permission cases and networks.
- [ ] **Medicine verification:** collect current Pakistani groundnut-specific product labels; confirm active ingredients, actual disease claims, doses, spray limits, safety and harvest intervals before presenting prescriptions.
- [ ] **Database safety:** confirm cross-user RLS and private Storage policies with at least two accounts; verify old zero-severity history cases do not offer treatment.
- [ ] **Testing:** add reproducible API, mobile and database integration tests, not just manual screenshots.
- [ ] **Dependency reproducibility:** run and verify a fresh environment installation, then create a tested dependency lock/constraints strategy.

## Planned work

- [ ] Make a more robust leaf/non-leaf validation step and handle uncertainty distinctly from a confirmed invalid image.
- [ ] Save farmer field-question answers and the recommendation version together with each historical report.
- [ ] Implement Community Hub: posts, image sharing, replies, reporting, privacy and moderation.
- [ ] Improve password reset, profile and accessibility settings.
- [ ] Authenticate FastAPI requests as appropriate for production, add rate limits and protect image uploads.
- [ ] Dockerize and deploy FastAPI with stable HTTPS URL; remove dependence on laptop LAN IP.
- [ ] Test end-to-end data backup, resilience and production readiness.

## Key limitations to document in the FYP report

- Disease class confidence is not proof that the photograph contains a groundnut leaf.
- A segmentation mask can be generated for an unrelated object.
- Severity percentage describes candidate affected pixels of the **photographed region**, not whole-field infection.
- Four severity categories are **project-defined**, not proven spray thresholds.
- Current medication entries are research leads. The system does not have verified Pakistan-groundnut application doses.
- The Community Hub is not implemented yet.

See [`../README.md`](../README.md) for setup and [`MODULE2_TREATMENT_SETUP.md`](MODULE2_TREATMENT_SETUP.md) for recommendation-specific details.
