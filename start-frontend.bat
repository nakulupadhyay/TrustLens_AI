@echo off
REM =============================================
REM  TrustLens AI — Start Frontend (Windows)
REM =============================================
echo.
echo [TrustLens AI] Starting React frontend...
echo Frontend URL: http://localhost:5173
echo.
cd /d "%~dp0frontend"
npm run dev
