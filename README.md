# TrustLens AI
### Intelligent Device Condition Analysis & Resale Price Estimation

TrustLens AI is a web-based device inspection platform that uses computer vision and intelligent analysis to evaluate the physical condition of electronic products. Users can upload product images, identify visible damage, understand its severity, and receive an estimated resale price based on the detected condition.

The platform combines a custom-trained YOLOv8 model with a React frontend and FastAPI backend to deliver an integrated device assessment experience.

---

## 📌 Project Overview

TrustLens AI addresses the challenge of evaluating used electronic devices before resale. Traditional inspections often depend on subjective human judgment, which can lead to inconsistent condition assessments and pricing.

The platform provides an AI-assisted approach by analyzing uploaded images and translating detected damage into understandable condition scores and price recommendations.

**Core workflow:**

1. Upload images of an electronic device.
2. Detect visible defects using the YOLOv8 model.
3. Calculate a damage severity score.
4. Estimate the device's resale value.
5. Generate an explanation of the assessment.
6. Save the analysis for future reference.

---

## ✨ Key Capabilities

| Module | Functionality |
|---|---|
| Image Analysis | Identifies visible cracks, scratches, and stains. |
| Defect Localization | Displays detected damage through bounding boxes. |
| Condition Assessment | Calculates a severity score using damage area and class weights. |
| Resale Estimation | Applies condition-based discount rules to the original price. |
| AI Explanation | Provides readable damage descriptions and resale guidance. |
| User Accounts | Supports registration, login, and protected application routes. |
| Assessment Dashboard | Allows users to review their previous inspection reports. |

---

## 🧰 Technology Architecture

| Component | Technologies |
|---|---|
| User Interface | React 18, Vite |
| Styling | Tailwind CSS |
| Backend Services | Python, FastAPI |
| Object Detection | YOLOv8n, Ultralytics |
| Database Layer | SQLAlchemy |
| Database | SQLite / PostgreSQL |
| Authentication | JWT, bcrypt |
| Image Processing | OpenCV / Python imaging libraries, where configured |
| Deployment | Vercel, Render |

---

## 📂 Repository Organization

```text
TrustLensAI/
│
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── requirements.txt
│   │
│   ├── model/
│   │   └── best_v2.pt
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── report.py
│   │   └── image.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   └── report.py
│   │
│   ├── routes/
│   │   ├── auth.py
│   │   ├── upload.py
│   │   ├── analyze.py
│   │   └── reports.py
│   │
│   ├── services/
│   │   ├── auth.py
│   │   ├── yolo.py
│   │   ├── severity.py
│   │   ├── pricing.py
│   │   ├── llm.py
│   │   └── storage.py
│   │
│   └── uploads/
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api/
│       │   └── axios.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── LoadingSpinner.jsx
│       └── pages/
│           ├── Landing.jsx
│           ├── Signup.jsx
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── Upload.jsx
│           └── AnalysisResult.jsx
│
├── ML models/
│   ├── YOLOv8_Model/
│   ├── merged_dataset/
│   ├── merge.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### System Requirements

Install the following tools before running the application:

- Python 3.10 or later
- Node.js 18 or later
- npm
- Git
- A compatible YOLOv8 model weights file

### 1. Get the Source Code

```bash
git clone https://github.com/nakulupadhyay/TrustLens_AI.git
cd TrustLens_AI
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\activate
```

For macOS/Linux:

```bash
source venv/bin/activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

If Ultralytics is not included in the requirements file:

```bash
pip install ultralytics
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder.

```env
DATABASE_URL=sqlite:///./trustlens.db

SECRET_KEY=replace_with_a_secure_random_key
ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

OPENAI_API_KEY=
```

Use PostgreSQL instead of SQLite by providing the appropriate database connection URL.

Generate a secure JWT secret using:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Configure the YOLOv8 Model

The trained model is expected at:

```text
backend/model/best_v2.pt
```

Make sure the model path matches the configuration in your backend.

The model is trained to recognize the following categories:

| Class ID | Detection Class |
|---|---|
| 0 | Crack |
| 1 | Good |
| 2 | Scratch |
| 3 | Stain |

**Model configuration:**

- Architecture: YOLOv8 Nano
- Training duration: 50 epochs
- Image resolution: 640 × 640
- Batch size: 16
- Detection categories: 4

If the trained weights are unavailable, the application may use placeholder detections if that fallback is implemented.

### 5. Launch the Backend

From the backend directory, execute:

```bash
uvicorn main:app --reload --port 8000
```

The backend will be available at:

http://localhost:8000

Interactive API documentation:

http://localhost:8000/docs

### 6. Launch the Frontend

Open a second terminal:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Open the application:

http://localhost:5173

---

## 🧠 How the AI Analysis Works

TrustLens AI follows a multi-stage processing workflow.

```text
       PRODUCT IMAGE
             |
             v
       IMAGE UPLOAD
             |
             v
       YOLOv8 DETECTION
             |
             v
       DAMAGE LOCALIZATION
             |
             v
      SEVERITY CALCULATION
             |
             v
      PRICE ESTIMATION
             |
             v
      EXPLANATION GENERATION
             |
             v
       FINAL ASSESSMENT
```

### 1. Object Detection

The YOLOv8 model processes the uploaded image and identifies visible defects.

Each detection provides information such as:

- Detected defect category
- Confidence score
- Bounding box coordinates
- Estimated affected image area

### 2. Severity Evaluation

The system calculates a damage score using the detected area and the relative importance of each defect category.

The damage weights are:

| Damage Category | Weight | Interpretation |
|---|---:|---|
| Crack | 1.0 | Structural damage |
| Scratch | 0.6 | Surface damage |
| Stain | 0.4 | Cosmetic damage |
| Good | 0 | No detected damage |

The scoring approach considers both the amount of affected area and the type of damage rather than treating every detection equally.

The resulting score is normalized to a scale of 0–10.

### 3. Resale Price Calculation

After determining the severity level, the pricing engine applies a corresponding discount to the device's base price.

| Severity Score | Condition | Discount |
|---|---|---:|
| 0 | Good | 0% |
| 1–2 | Minor | 10% |
| 3–4 | Moderate | 25% |
| 5–7 | Severe | 40% |
| 8–10 | Critical | 55% |

The recommended price is calculated as:

\[
P_r = P_o \times \left(1-\frac{D}{100}\right)
\]

Where:

- \(P_r\) = Recommended resale price
- \(P_o\) = Original device price
- \(D\) = Applicable discount percentage

**Example:**

For a device with an original price of ₹20,000 and a moderate damage classification:

\[
P_r = 20000 \times (1-0.25)
\]

\[
P_r = ₹15,000
\]

The final price is an estimate based on the application's configured pricing rules, not a guaranteed market valuation.

---

## 🔌 Backend API Reference

The backend exposes REST endpoints for authentication, image processing, and report management.

| HTTP Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | Public | Create an account |
| POST | `/auth/login` | Public | Authenticate a user |
| POST | `/auth/logout` | Application-dependent | Handle logout |
| GET | `/auth/me` | Protected | Retrieve user details |
| POST | `/upload` | Protected | Upload product images |
| POST | `/analyze` | Protected | Execute damage analysis |
| GET | `/reports` | Protected | Retrieve saved reports |
| GET | `/report/{id}` | Protected | View individual report details |

For request parameters and response schemas, refer to the Swagger documentation at `/docs`.

---

## 🌍 Live Application

The deployed application can be accessed through the following links:

| Service | Link |
|---|---|
| Web Application | [TrustLens AI – Frontend](https://trustlens-ai-xi.vercel.app/) |
| Backend Service | [FastAPI Backend](https://trustlens-ai-cqk8.onrender.com) |
| API Documentation | [Local Swagger Docs](http://localhost:8000/docs) |

---

## 🚀 Deployment Guide

### Backend Deployment – Render

1. Create a Web Service on [Render](https://render.com/).
2. Connect the GitHub repository.
3. Set the root directory to `backend`.
4. Configure the build command:

```bash
pip install -r requirements.txt
```

5. Configure the start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

6. Add the required environment variables through the Render dashboard.

### Frontend Deployment – Vercel

1. Import the GitHub repository into [Vercel](https://vercel.com/).
2. Select `frontend` as the root directory.
3. Set the environment variable:

```env
VITE_API_BASE_URL=your_deployed_backend_url
```

4. Build and deploy the application.

---

## 🔐 Security & Data Handling

The application includes several security-related mechanisms:

- Password hashing using bcrypt.
- JWT-based authentication.
- Protected API routes.
- Environment-based configuration.
- Database access through SQLAlchemy.
- Configurable CORS origins.
- Separation of frontend and backend configuration.

**Security recommendation:** Never upload `.env` files, database credentials, private API keys, or authentication secrets to a public GitHub repository.

---

## 🔮 Future Enhancements

Potential improvements to the platform include:

- Support for additional electronic device categories.
- More detailed damage classification.
- Improved price estimation using market data.
- Cloud-based image storage.
- Advanced model evaluation and monitoring.
- Downloadable inspection reports.
- Improved performance for large image uploads.

---

## 📜 License & Attribution

This repository should retain the applicable license and attribution notices for any third-party code, datasets, model weights, or components used in the project.

The project documentation describes the implementation and features of TrustLens AI. Refer to the original licenses of its dependencies and training datasets for usage conditions.

---

**TrustLens AI | Computer Vision · Device Inspection · Intelligent Pricing**
