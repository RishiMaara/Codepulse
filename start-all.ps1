Write-Host "Starting Frontend (React/Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Starting Backend (Express/Node)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Write-Host "Starting AI Service (FastAPI/Python)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-service; if (!(Test-Path venv)) { Write-Host 'Creating venv...'; python -m venv venv }; .\venv\Scripts\activate; pip install -r requirements.txt; uvicorn app:app --port 8000"

Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "All services are starting in new windows!" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
