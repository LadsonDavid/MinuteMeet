#!/bin/bash

# MinuteMeet Development Startup Script
# This script starts both backend and frontend services

echo "🚀 Starting MinuteMeet Development Environment..."
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use!"
        echo "   Please stop the existing service or change the port."
        echo ""
    fi
}

# Check if ports are available
check_port 8000
check_port 3000

# Start Backend
echo "🔧 Starting Backend (FastAPI) on http://localhost:8000..."
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend (Next.js) on http://localhost:3000..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

echo ""
echo "✅ MinuteMeet is starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
