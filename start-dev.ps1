# MinuteMeet Development Startup Script
# This script starts both backend and frontend services

Write-Host "🚀 Starting MinuteMeet Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if ports are available
if (Test-Port 8000) {
    Write-Host "⚠️  Port 8000 (Backend) is already in use!" -ForegroundColor Yellow
    Write-Host "   Please stop the existing service or change the port." -ForegroundColor Yellow
    Write-Host ""
}

if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 (Frontend) is already in use!" -ForegroundColor Yellow
    Write-Host "   Please stop the existing service or change the port." -ForegroundColor Yellow
    Write-Host ""
}

# Start Backend
Write-Host "🔧 Starting Backend (FastAPI) on http://localhost:8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend (Next.js) on http://localhost:3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

# Wait a moment for frontend to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ MinuteMeet is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "📚 API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script (services will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
