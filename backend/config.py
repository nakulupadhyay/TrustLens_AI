import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./trustlens.db")
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# YOLO model path for local inference
YOLO_MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "yolo_model/best_v2.pt")

# HuggingFace Space URL (optional — overrides local YOLO if set)
HF_SPACE_URL = os.getenv("HF_SPACE_URL", "")

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# YOLO model directory
YOLO_MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "yolo_model")
os.makedirs(YOLO_MODEL_DIR, exist_ok=True)
