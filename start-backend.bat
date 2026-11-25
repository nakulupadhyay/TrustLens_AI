@echo off
REM =============================================
REM  TrustLens AI — Start Backend (Windows)
REM =============================================
echo.
echo [TrustLens AI] Starting FastAPI backend...
echo Backend URL: http://localhost:8000
echo API Docs:    http://localhost:8000/docs
echo.
cd /d "%~dp0backend"
call venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
