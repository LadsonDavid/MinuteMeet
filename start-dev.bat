@echo off
echo.
echo ========================================
echo   MinuteMeet Development Environment
echo ========================================
echo.

echo Starting Backend (FastAPI) on http://localhost:8000...
start "MinuteMeet Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo Starting Frontend (Next.js) on http://localhost:3000...
start "MinuteMeet Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to close this window...
pause >nul
