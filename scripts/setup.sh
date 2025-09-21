#!/bin/bash

# MinuteMeet Setup Script
echo "Setting up MinuteMeet"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed."
    echo "Install from: https://python.org"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed."
    echo "Install from: https://nodejs.org"
    exit 1
fi

# Backend setup
echo "Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Download spaCy model
python -m spacy download en_core_web_sm

echo "Backend setup complete!"

# Frontend setup
echo "Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

echo "Frontend setup complete!"

# Database setup
echo "Setting up database..."
cd ../backend

# Initialize database
python scripts/init-db.py

echo "Database setup complete!"

echo "Setup complete! To start the application:"
echo "1. Backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "2. Frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:3000 in your browser"