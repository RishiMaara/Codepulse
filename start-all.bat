@echo off
title CodePulse Launcher
cd /d "%~dp0"

echo =========================================
echo   Starting CodePulse - All Services
echo =========================================
echo.

echo [1/3] Starting Frontend (React/Vite)...
start "CodePulse Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo [2/3] Starting Backend (Express/Node)...
start "CodePulse Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo [3/3] Starting AI Service (FastAPI/Python)...
start "CodePulse AI" cmd /k "cd /d "%~dp0ai-service" && (if not exist venv python -m venv venv) && call venv\Scripts\activate.bat && pip install -r requirements.txt -q && uvicorn app:app --port 8000"

echo.
echo =========================================
echo   All services are starting in new CMD windows!
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:5000
echo   AI Service: http://localhost:8000
echo =========================================
echo.
pause
