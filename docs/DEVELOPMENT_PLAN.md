# PlantPulse AI development roadmap

**Milestone 1 — this package**
- [x] Expo SDK 58 React Native app (JavaScript)
- [x] Clear folder structure; screens and services separated
- [x] Supabase sign up, sign in, session restore, sign out
- [x] Home, photo capture/selection, Profile, History/Community empty states
- [x] Real API request function (`POST /predict`) ready to connect
- [x] Minimal FastAPI `/health` endpoint
- [ ] Connected Supabase project credentials (set these locally)
- [ ] Physical-device run verified by user
- [ ] GitHub remote created and first push by user

**Milestone 2**
- [ ] Integrate trained YOLO11m-Seg weights into FastAPI
- [ ] Supabase JWT verification in FastAPI
- [ ] Apply 75% confidence threshold and healthy leaf rule
- [ ] OpenCV severity estimate and severity-level categories
- [ ] Red lesion overlay and heatmap as JPEG/Base64
- [ ] Real prediction on phone, test with held-out images

**Milestone 3**
- [ ] Store secure scan history + images in Supabase
- [ ] Add source-reviewed English/Urdu treatment recommendations
- [ ] Implement community posts + comments + image upload
- [ ] Add password reset and account preferences
- [ ] Containerize backend with Docker, document running on a second machine
- [ ] Test authorization, input validation, error states, and mobile usability

**Important ML limitation:** Current severity is estimated from color-based
OpenCV masks. It needs comparison with manually annotated disease regions.
No unverified treatment dosage should be shown as fact.
