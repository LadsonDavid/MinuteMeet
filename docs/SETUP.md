# Setup Guide - MinuteMeet

This guide shows you how to build and deploy MinuteMeet using open-source and tier-based services.

## Quick Start (5 minutes)

### 1. Clone and Setup
```bash
git clone https://github.com/your-org/MinuteMeet.git
cd MinuteMeet
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Start Development
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Configuration

### Environment Variables
```bash
# Copy example file
cp backend/env.example backend/.env

# Edit with your settings
nano backend/.env
```

### Database Setup
```bash
# Option 1: Local SQLite (Default)
# No additional setup required

# Option 2: PostgreSQL
# 1. Install PostgreSQL: https://postgresql.org/download/
# 2. Create database: createdb minutemeet
# 3. Update .env with local connection string

# Option 3: Docker PostgreSQL
# 1. Run: docker-compose up -d db
# 2. Database will be available at localhost:5432
```

## Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: minutemeet-frontend
# - Directory: ./
# - Override settings? No
```

### Backend (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up

# Set environment variables
railway variables set DATABASE_URL=sqlite:///./minutemeet.db
```

## Development Workflow

### Local Development
```bash
# Start all services
docker-compose up -d

# Or individually
# Backend
cd backend && uvicorn main:app --reload

# Frontend
cd frontend && npm run dev

# Database
# SQLite works automatically
```

### Testing
```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test
```

## Troubleshooting

### Common Issues

1. **AI Models Not Loading**
   ```bash
   # Solution: Use mock mode
   export MOCK_MODE=true
   ```

2. **Database Connection Failed**
   ```bash
   # Solution: Use SQLite
   export DATABASE_URL=sqlite:///./minutemeet.db
   ```

3. **Memory Issues**
   ```bash
   # Solution: Use smaller models
   export AI_MODEL=google/flan-t5-small
   ```

4. **Rate Limiting**
   ```bash
   # Solution: Add delays between requests
   export RATE_LIMIT_DELAY=1
   ```

---

**Next Action**: `cd MinuteMeet && ./scripts/setup.sh && echo "MinuteMeet is ready!"`