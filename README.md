# TrustLens AI â€” Device Condition Verification Platform

> AI-powered product damage detection, severity scoring, and price recommendation using **YOLOv8** + **FastAPI** + **React**.

---

## âœ¨ Features

| Feature | Description |
|---|---|
| ðŸ” **Damage Detection** | YOLOv8 deep learning identifies cracks, scratches, and stains |
| ðŸ“Š **Severity Scoring** | 0â€“10 score using area-weighted detection analysis |
| ðŸ’° **Price Recommendation** | 5-tier discount system based on severity |
| ðŸ“‹ **Report History** | Full scan history per authenticated user |
| ðŸ” **JWT Authentication** | Secure signup/login with bcrypt password hashing |
| ðŸ“± **Responsive UI** | Dark professional design â€” mobile, tablet, desktop |

---

## ðŸ› ï¸ Technologies Used

### Backend
- **FastAPI** `0.115.0` â€” Python async web framework
- **SQLAlchemy** `2.0.23` â€” ORM for PostgreSQL/SQLite
- **psycopg2-binary** â€” PostgreSQL driver
- **python-jose** â€” JWT token creation & verification
- **passlib[bcrypt]** â€” Password hashing
- **ultralytics** `8.3.0` â€” YOLOv8 local inference
- **Uvicorn** â€” ASGI server

### Frontend
- **React** `18.2` + **Vite** `5.0` â€” SPA framework
- **React Router v6** â€” Client-side routing
- **Tailwind CSS v3** â€” Utility-first CSS
- **Axios** â€” HTTP client with JWT interceptor
- **react-hot-toast** â€” Toast notifications

### Database
- **Supabase PostgreSQL** (production / cloud)
- **SQLite** (optional local fallback)

---

## ðŸ“ Project Structure

```
TrustLens-AI/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ .env                    â† Your secrets (never commit!)
â”‚   â”œâ”€â”€ .env.example            â† Template for env vars
â”‚   â”œâ”€â”€ main.py                 â† FastAPI app entry point
â”‚   â”œâ”€â”€ config.py               â† Env variable loading
â”‚   â”œâ”€â”€ database.py             â† SQLAlchemy engine + session
â”‚   â”œâ”€â”€ requirements.txt
â”‚   â”œâ”€â”€ venv/                   â† Python virtual environment
â”‚   â”œâ”€â”€ yolo_model/             â† Place your .pt weights here
â”‚   â”œâ”€â”€ uploads/                â† Uploaded images (served as static)
â”‚   â”œâ”€â”€ models/                 â† SQLAlchemy ORM models
â”‚   â”‚   â”œâ”€â”€ user.py
â”‚   â”‚   â”œâ”€â”€ report.py
â”‚   â”‚   â””â”€â”€ image.py
â”‚   â”œâ”€â”€ routes/                 â† API route handlers
â”‚   â”‚   â”œâ”€â”€ auth.py
â”‚   â”‚   â”œâ”€â”€ upload.py
â”‚   â”‚   â”œâ”€â”€ analyze.py
â”‚   â”‚   â””â”€â”€ reports.py
â”‚   â”œâ”€â”€ schemas/                â† Pydantic request/response schemas
â”‚   â”‚   â”œâ”€â”€ auth.py
â”‚   â”‚   â””â”€â”€ report.py
â”‚   â””â”€â”€ services/               â† Business logic
â”‚       â”œâ”€â”€ auth.py             â† JWT + bcrypt
â”‚       â”œâ”€â”€ yolo.py             â† Local YOLO + HF Space inference
â”‚       â”œâ”€â”€ severity.py         â† Damage severity scoring
â”‚       â”œâ”€â”€ pricing.py          â† Price recommendation
â”‚       â”œâ”€â”€ llm.py              â† Explanation generator
â”‚       â””â”€â”€ storage.py          â† File upload & URL handling
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ .env                    â† VITE_API_BASE_URL
â”‚   â”œâ”€â”€ .env.example
â”‚   â”œâ”€â”€ index.html
â”‚   â”œâ”€â”€ vite.config.js
â”‚   â”œâ”€â”€ tailwind.config.js
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ App.jsx
â”‚       â”œâ”€â”€ main.jsx
â”‚       â”œâ”€â”€ index.css
â”‚       â”œâ”€â”€ api/
â”‚       â”‚   â””â”€â”€ axios.js
â”‚       â”œâ”€â”€ context/
â”‚       â”‚   â””â”€â”€ AuthContext.jsx
â”‚       â”œâ”€â”€ components/
â”‚       â”‚   â”œâ”€â”€ Navbar.jsx
â”‚       â”‚   â”œâ”€â”€ ProtectedRoute.jsx
â”‚       â”‚   â””â”€â”€ LoadingSpinner.jsx
â”‚       â””â”€â”€ pages/
â”‚           â”œâ”€â”€ Landing.jsx
â”‚           â”œâ”€â”€ Login.jsx
â”‚           â”œâ”€â”€ Signup.jsx
â”‚           â”œâ”€â”€ Dashboard.jsx
â”‚           â”œâ”€â”€ Upload.jsx
â”‚           â””â”€â”€ AnalysisResult.jsx
â”œâ”€â”€ start-backend.bat           â† One-click backend start (Windows)
â”œâ”€â”€ start-frontend.bat          â† One-click frontend start (Windows)
â”œâ”€â”€ render.yaml                 â† Render.com deployment config
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
```

---

## âš™ï¸ Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Backend runtime |
| Node.js | 18+ | Frontend build |
| npm | 8+ | Package manager |
| PostgreSQL | (via Supabase/Neon/etc.) | Database |

---

## ðŸš€ Installation & Local Setup

### Step 1 â€” Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/TrustLens-AI.git
cd TrustLens-AI
```

### Step 2 â€” Backend Setup

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate it (Windows PowerShell)
.\venv\Scripts\activate

# Install all dependencies
pip install -r requirements.txt
```

### Step 3 â€” Frontend Setup

```bash
cd frontend
npm install
```

---

## ðŸ—„ï¸ Database Setup

### Option A: Supabase (Recommended â€” Free Cloud PostgreSQL)

1. Go to [supabase.com](https://supabase.com) â†’ Create a new project
2. Navigate to: **Settings â†’ Database â†’ Connection String â†’ URI**
3. Copy the connection string, e.g.: `postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres`

> âš ï¸ **Important:** If your password contains special characters (`@`, `#`, `$`), URL-encode them:
> - `@` â†’ `%40`
> - `#` â†’ `%23`
> - `$` â†’ `%24`

4. Set `DATABASE_URL` in `backend/.env` (see Environment Variables section)

5. Tables are **auto-created** when you start the backend.

### Option B: Local SQLite (Simple, no server needed)

```env
DATABASE_URL=sqlite:///./trustlens.db
```

---

## ðŸ”§ Environment Variables

### Backend â€” `backend/.env`

```env
# Database
DATABASE_URL=postgresql://postgres:your%40password@db.project.supabase.co:5432/postgres

# JWT Security (generate with: python -c "import secrets; print(secrets.token_hex(32))")
SECRET_KEY=your-long-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Server URLs
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# YOLO Model
YOLO_MODEL_PATH=yolo_model/best_v2.pt   # path to your .pt weights file

# Optional: HuggingFace Space (overrides local YOLO)
HF_SPACE_URL=
```

### Frontend â€” `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## ðŸ¤– YOLO Model Setup (Optional)

Place your YOLOv8 `.pt` weights file inside:
```
backend/yolo_model/best_v2.pt
```

**If no model is present:** The app automatically uses placeholder/random detections so you can still test the full workflow.

**To download YOLOv8 nano** (lightweight, works on 8GB RAM):
```bash
cd backend
.\venv\Scripts\activate
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt'); import shutil; shutil.copy('yolov8n.pt', 'yolo_model/best_v2.pt')"
```

---

## â–¶ï¸ Running the Project Locally

### Start the Backend

**Option A â€” Using the provided script (Windows):**
```
Double-click: start-backend.bat
```

**Option B â€” Manual:**
```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend URL:** http://localhost:8000  
**API Documentation:** http://localhost:8000/docs

---

### Start the Frontend

**Option A â€” Using the provided script (Windows):**
```
Double-click: start-frontend.bat
```

**Option B â€” Manual:**
```bash
cd frontend
npm run dev
```

**Frontend URL:** http://localhost:5173

---

## ðŸŒ API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | Public | Register a new account |
| `POST` | `/auth/login` | Public | Login, returns JWT tokens |
| `GET` | `/auth/me` | Bearer | Get current user profile |
| `POST` | `/upload` | Bearer | Upload 1â€“5 device images |
| `POST` | `/analyze` | Bearer | Run AI damage analysis |
| `GET` | `/reports` | Bearer | List all user reports |
| `GET` | `/report/{id}` | Bearer | Get a specific report |
| `GET` | `/health` | Public | Health check |

---

## ðŸ“¦ Deployment

### Backend â€” Render.com

1. Create a **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** to `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables in Render Dashboard:
   - `DATABASE_URL` â†’ Your Supabase/Neon URL
   - `SECRET_KEY` â†’ A long random secret
   - `FRONTEND_URL` â†’ Your Vercel frontend URL
   - `BACKEND_URL` â†’ This service's Render URL

A `render.yaml` is already configured in the project root.

### Frontend â€” Vercel

1. Push the repo to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `VITE_API_BASE_URL` â†’ Your Render backend URL

A `frontend/vercel.json` is already configured for SPA routing.

---

## ðŸ”’ Security Notes

- `.env` files are in `.gitignore` â€” never committed to Git
- Passwords are hashed with bcrypt (never stored in plain text)
- JWT tokens expire after 30 minutes (configurable)
- SQL injection prevented by SQLAlchemy ORM parameterized queries
- CORS configured to only allow your frontend origin
- Never hardcode credentials in source code

---

## ðŸ—ï¸ Database Schema

```
users          reports              images
â”€â”€â”€â”€â”€â”€â”€â”€â”€      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€     â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
id (PK)        id (PK)              id (PK)
name           user_id â†’ users.id   report_id â†’ reports.id
email          base_price           url
password_hash  severity
role           recommended_price
created_at     explanation
               image_urls (JSON)
               detections (JSON)
               created_at
```

---

## ðŸ“„ License

This project is for educational and personal use. Original concept by Team 20 â€” customized and extended independently.

---

*Built with FastAPI Â· React Â· YOLOv8 Â· Supabase PostgreSQL Â· Tailwind CSS*

