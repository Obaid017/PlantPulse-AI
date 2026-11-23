# PlantPulse AI — Real FYP Application (Milestone 1)

This is the **actual development project**, not the previous Expo Snack demo.
It uses **React Native (Expo SDK 58), Supabase Auth, and Python FastAPI**.
There are **no fake scan results or demo accounts**.

## What works in this milestone?

- Supabase email/password **sign up**, **sign in**, **session restore**, and **sign out**
- Farmer-friendly mobile Home, Scan, Profile, History, Community screens
- Real camera/gallery photo selection and image preview
- `/health` endpoint in FastAPI
- Mobile API service ready to call `/predict` once your model is connected

**Not yet integrated:** YOLO, image-based diagnosis, scan history persistence,
community data, treatment data, and Docker. `POST /predict` intentionally returns
HTTP **501** rather than claiming a fake prediction. This is an incremental
production project, not a finished application.

## 1 — Requirements (Windows 11)

- Node.js **22.13 or later** and npm
- Python 3.11–3.13
- Git, VS Code
- Expo Go for **SDK 58** on your phone (your phone already showed SDK 58)
- A free/paid Supabase account (you choose the plan)
- Laptop and phone on the same Wi-Fi for the local FastAPI service

You can verify your installations in VS Code terminal:

```bash
node -v
npm -v
python --version
git --version
```

## 2 — Set up Supabase Auth

1. Create a project: https://supabase.com/dashboard
2. Open your project and find the **Project URL** and **publishable key**
   (Connect / API Keys section in the Supabase dashboard).
3. Copy `mobile/.env.example` to **`mobile/.env`**.
4. Replace the example Supabase URL and publishable key in `mobile/.env`.
5. Under **Authentication > Providers**, confirm Email is enabled.
6. If email confirmation is enabled, a newly registered user must verify their
   email and then sign in. For this first milestone we do not implement
   password-reset or app deep-link handling.

Never put a **secret** or **service_role** key in an Expo `EXPO_PUBLIC_` variable.
Supabase's **publishable** key is designed for client apps. Enable Row Level
Security before we add private application tables.

## 3 — Run the mobile application

From the project root:

```bash
cd mobile
npm install
npx expo install --fix
npx expo start --clear
```

Scan the QR code with the **SDK 58** Expo Go app. Verify that the Welcome screen,
Sign Up, Sign In, Home, Scan, and Sign Out all work. `npm install` and Expo
commands need an internet connection on your own laptop.

**Why no Snack now?** We are building a real multi-file app for VS Code. Expo
Snack was useful for design experiments; this project will be maintained locally.

## 4 — Run FastAPI (separate VS Code terminal)

```bash
cd backend
python -m venv .venv
```

Activate it:

- Windows PowerShell: `.venv\Scripts\Activate.ps1`
- Windows CMD: `.venv\Scripts\activate.bat`

Then:

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Check **http://127.0.0.1:8000/health** on the laptop. Expected response:

```json
{"status":"ok","service":"PlantPulse AI"}
```

For a **physical phone**, find your laptop's Wi-Fi IP using `ipconfig` on
Windows and set this in `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.5:8000
```

Replace the IP with **your own laptop IP**. Do not use `localhost` on the phone.
Restart Expo after changing `.env`. Allow port 8000 through Windows Firewall
only on your trusted local network if needed.

The photo picker works now; clicking **Check Leaf** calls FastAPI but receives
`501 AI prediction is not connected yet` until Milestone 2. This is expected.

## 5 — Start GitHub from day one

From the **PlantPulse-AI root folder**, after downloading and extracting:

```bash
git init
git branch -M main
git add .
git commit -m "Initial PlantPulse AI app structure and Supabase auth"
```

Create a **private** empty repository named `PlantPulse-AI` at
https://github.com/new (do **not** add a README there because this folder has one).
Copy the repository URL and then run:

```bash
git remote add origin https://github.com/YOUR-USERNAME/PlantPulse-AI.git
git push -u origin main
```

Replace `YOUR-USERNAME`. If prompted, authenticate using Git Credential Manager
or GitHub Desktop. `.gitignore` prevents `.env`, dependencies and ML weights
from being committed. **Before every push, check `git status`.**

## File responsibility guide

| File or folder | Purpose |
| --- | --- |
| `mobile/App.js` | Only sets up app providers/navigation |
| `mobile/src/screens/` | One screen per file |
| `mobile/src/components/` | Reusable button, input, page layout, logo |
| `mobile/src/context/AuthContext.js` | User login/session state |
| `mobile/src/services/supabaseClient.js` | Supabase configuration |
| `mobile/src/services/predictionService.js` | Future real FastAPI request |
| `mobile/src/navigation/RootNavigator.js` | Login flow, tabs, results |
| `backend/main.py` | FastAPI application entry |
| `backend/routes/` | API endpoints |
| `database/` | Future RLS/database migrations |
| `docs/` | Milestones and testing notes |

## First manual test checklist

- [ ] Supabase URL and key configured
- [ ] App opens without crossing phone status bar
- [ ] Account can be registered with real email/password
- [ ] Email verification works if required
- [ ] Can sign in and sign out
- [ ] Restart app and session is restored
- [ ] Camera/gallery picks a real image
- [ ] FastAPI `/health` works
- [ ] GitHub private repository has initial code (no secrets)

**Note:** We have not run this on your device. Please report any error messages
from your Windows terminal or Expo Go so we can resolve compatibility issues.
