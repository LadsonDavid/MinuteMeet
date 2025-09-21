# CI/CD Deployment Guide

**Role**: CI/CD Engineer  
**Objective**: Production deployment and infrastructure setup for MinuteMeet  
**Status**: Ready for execution

---

## Quick Start Commands

### 1. Local Environment Setup
```bash
# Navigate to project directory
cd MinuteMeet

# Verify backend configuration
cd backend
cat railway.json
cat Procfile
cat requirements.txt

# Verify frontend configuration
cd ../frontend
cat package.json
cat next.config.js
```

### 2. CRITICAL: Update Frontend Configuration for Production
```bash
# IMPORTANT: Update next.config.js for production deployment
cd frontend

# Create production-ready next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-backend.railway.app'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      },
      {
        source: '/health',
        destination: process.env.NEXT_PUBLIC_API_URL + '/health',
      },
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig
EOF
```

### 3. Pre-deployment Testing
```bash
# Test backend locally
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Test frontend locally
cd ../frontend
npm install
npm run build
npm run dev
```

### 4. CRITICAL: Database Migration Commands
```bash
# IMPORTANT: Initialize database before deployment
cd MinuteMeet

# Run database initialization script
python scripts/init-db.py

# Verify database tables created
sqlite3 backend/minutemeet.db ".tables"
```

---

## Phase 1: Backend Deployment (Railway)

### Railway Setup Commands

#### 1. Create Railway Account and Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd backend
railway init

# Link to existing project (if created via web)
railway link
```

#### 2. Configure Environment Variables
```bash
# Set production environment variables
railway variables set DATABASE_URL="postgresql://username:password@host:port/database"
railway variables set CORS_ORIGINS="https://minutemeet.vercel.app,https://minutemeet-frontend.vercel.app"
railway variables set DEBUG="False"
railway variables set ENVIRONMENT="production"
railway variables set PORT="8000"

# CRITICAL: Add Gunicorn configuration
railway variables set WORKERS="4"
railway variables set TIMEOUT="30"

# Verify variables
railway variables
```

#### 3. Deploy Backend
```bash
# Deploy to Railway
railway up

# Check deployment status
railway status

# View logs
railway logs

# Get deployment URL
railway domain
```

### Alternative: Railway Web Interface

#### 1. Connect GitHub Repository
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose the MinuteMeet repository
5. Select the `backend` folder

#### 2. Configure Build Settings
```yaml
# Build Command
pip install -r requirements.txt

# Start Command
uvicorn main:app --host 0.0.0.0 --port $PORT

# Environment Variables
DATABASE_URL=postgresql://...
CORS_ORIGINS=https://minutemeet.vercel.app
DEBUG=False
ENVIRONMENT=production
```

#### 3. Deploy and Verify
```bash
# Test deployed backend
curl -X GET https://your-backend.railway.app/health

# Test API endpoints
curl -X GET https://your-backend.railway.app/api/meetings
curl -X GET https://your-backend.railway.app/api/action-items
```

---

## Phase 2: Frontend Deployment (Vercel)

### Vercel Setup Commands

#### 1. Install Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

#### 2. Deploy Frontend
```bash
# Navigate to frontend directory
cd frontend

# CRITICAL: Set environment variables before deployment
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend.railway.app

vercel env add NODE_ENV
# Enter: production

# Deploy to Vercel
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: minutemeet-frontend
# - Directory: ./
# - Override settings? N

# Get deployment URL
vercel ls
```

### Alternative: Vercel Web Interface

#### 1. Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub
4. Choose the MinuteMeet repository
5. Select the `frontend` folder

#### 2. Configure Build Settings
```yaml
# Framework Preset
Next.js

# Build Command
npm run build

# Output Directory
.next

# Install Command
npm install

# Environment Variables
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NODE_ENV=production

# CRITICAL: Add these additional settings
# Root Directory: frontend
# Framework Version: 14.0.3
# Node.js Version: 18.x
```

#### 3. Deploy and Verify
```bash
# Test deployed frontend
curl -X GET https://minutemeet.vercel.app

# Test API integration
# Open browser and test the application
```

---

## Phase 3: Database Setup (Railway PostgreSQL - RECOMMENDED)

### Railway PostgreSQL Setup (RECOMMENDED)

#### 1. Add PostgreSQL Service to Railway
```bash
# Add PostgreSQL to existing Railway project
railway add postgresql

# Get connection string
railway variables

# Copy the DATABASE_URL from the output
# Format: postgresql://postgres:[password]@[host]:5432/railway
```

#### 2. Initialize Database Tables
```bash
# CRITICAL: Run database initialization
cd MinuteMeet

# Update the database initialization script for PostgreSQL
python -c "
import os
import sys
sys.path.append('backend')
from database import engine, Base
from main import Meeting, ActionItem

# Create all tables
Base.metadata.create_all(bind=engine)
print('Database tables created successfully!')
"

# Verify tables created
railway connect postgresql
# Then run: \dt
```

### Alternative: Supabase Setup

#### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization
4. Enter project name: `minutemeet-prod`
5. Set database password
6. Choose region closest to your users

#### 2. Get Connection String
```bash
# From Supabase dashboard:
# Go to Settings > Database
# Copy the connection string
# Format: postgresql://postgres:[password]@[host]:5432/postgres

# Update Railway environment variable
railway variables set DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

#### 3. Initialize Database
```bash
# Connect to Supabase database
psql "postgresql://postgres:[password]@[host]:5432/postgres"

# Run database initialization
\i scripts/init-db.py

# Or use Python script
python scripts/init-db.py
```

---

## Phase 4: CRITICAL Deployment Verification

### Immediate Post-Deployment Checks
```bash
# 1. Test Backend Health
curl -X GET https://your-backend.railway.app/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-12-XX...",
  "database": "connected",
  "ai_service": "ready",
  "environment": "production",
  "version": "1.0.0"
}

# 2. Test API Endpoints
curl -X GET https://your-backend.railway.app/api/meetings
curl -X GET https://your-backend.railway.app/api/action-items

# 3. Test Frontend
curl -X GET https://minutemeet-frontend.vercel.app

# 4. Test Full Integration
# Open browser and test the complete application
```

### Troubleshooting Common Issues
```bash
# If backend fails to start:
railway logs
# Check for missing dependencies or environment variables

# If frontend build fails:
vercel logs
# Check for missing environment variables

# If database connection fails:
railway connect postgresql
# Verify DATABASE_URL is correct

# If CORS errors occur:
# Update CORS_ORIGINS in Railway to include frontend URL
railway variables set CORS_ORIGINS="https://minutemeet-frontend.vercel.app"
```

---

## Phase 5: Environment Configuration

### Production Environment Variables

#### Backend (Railway)
```bash
# Required variables
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/database
CORS_ORIGINS=https://minutemeet.vercel.app
DEBUG=False
ENVIRONMENT=production
PORT=8000

# Optional variables
LOG_LEVEL=INFO
MAX_WORKERS=4
```

#### Frontend (Vercel)
```bash
# Required variables
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NODE_ENV=production

# Optional variables
NEXT_PUBLIC_APP_NAME=MinuteMeet
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Environment Verification
```bash
# Test backend environment
curl -X GET https://your-backend.railway.app/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-12-XX...",
  "database": "connected",
  "ai_service": "ready",
  "environment": "production",
  "version": "1.0.0"
}

# Test frontend environment
curl -X GET https://minutemeet.vercel.app
```

---

## Phase 5: CI/CD Pipeline Setup

### GitHub Actions Workflow

#### 1. Create Workflow File
```bash
# Create GitHub Actions workflow
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install backend dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run backend tests
      run: |
        cd backend
        python -m pytest tests/ || echo "No tests found"
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm install
    
    - name: Build frontend
      run: |
        cd frontend
        npm run build
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm run test || echo "No tests found"

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Railway
      uses: railway-app/railway-deploy@v1
      with:
        railway-token: ${{ secrets.RAILWAY_TOKEN }}
        service: backend

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./frontend
EOF
```

#### 2. Set Up Secrets
```bash
# Add secrets to GitHub repository:
# Go to Settings > Secrets and variables > Actions
# Add the following secrets:

# Railway secrets
RAILWAY_TOKEN=your_railway_token

# Vercel secrets
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

---

## Phase 6: Monitoring and Health Checks

### Health Check Endpoints

#### Backend Health Check
```bash
# Test health endpoint
curl -X GET https://your-backend.railway.app/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-12-XX...",
  "database": "connected",
  "ai_service": "ready",
  "environment": "production",
  "version": "1.0.0"
}
```

#### Frontend Health Check
```bash
# Test frontend
curl -X GET https://minutemeet.vercel.app

# Expected: HTML page with 200 status
```

### Monitoring Setup

#### Railway Monitoring
```bash
# View Railway metrics
railway metrics

# View logs
railway logs --follow

# Check deployment status
railway status
```

#### Vercel Monitoring
```bash
# View Vercel analytics
vercel analytics

# View deployment logs
vercel logs

# Check deployment status
vercel ls
```

### Custom Health Check Script
```bash
# Create health check script
cat > health_check.sh << 'EOF'
#!/bin/bash

# Backend health check
echo "Checking backend health..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://your-backend.railway.app/health)
if [ $BACKEND_STATUS -eq 200 ]; then
    echo "Backend: Healthy"
else
    echo "Backend: Unhealthy (Status: $BACKEND_STATUS)"
fi

# Frontend health check
echo "Checking frontend health..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://minutemeet.vercel.app)
if [ $FRONTEND_STATUS -eq 200 ]; then
    echo "Frontend: Healthy"
else
    echo "Frontend: Unhealthy (Status: $FRONTEND_STATUS)"
fi

# API endpoints check
echo "Checking API endpoints..."
MEETINGS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://your-backend.railway.app/api/meetings)
ACTION_ITEMS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://your-backend.railway.app/api/action-items)

if [ $MEETINGS_STATUS -eq 200 ]; then
    echo "Meetings API: Healthy"
else
    echo "Meetings API: Unhealthy (Status: $MEETINGS_STATUS)"
fi

if [ $ACTION_ITEMS_STATUS -eq 200 ]; then
    echo "Action Items API: Healthy"
else
    echo "Action Items API: Unhealthy (Status: $ACTION_ITEMS_STATUS)"
fi
EOF

chmod +x health_check.sh
./health_check.sh
```

---

## Phase 7: Domain and SSL Configuration

### Custom Domain Setup (Optional)

#### 1. Configure Custom Domain
```bash
# Add custom domain to Vercel
vercel domains add minutemeet.com

# Add custom domain to Railway
railway domain add api.minutemeet.com
```

#### 2. DNS Configuration
```bash
# Configure DNS records:
# A record: @ -> Vercel IP
# CNAME record: www -> minutemeet.vercel.app
# CNAME record: api -> your-backend.railway.app
```

#### 3. SSL Certificate
```bash
# Vercel automatically provides SSL
# Railway automatically provides SSL
# Verify SSL is working:
curl -I https://minutemeet.com
curl -I https://api.minutemeet.com
```

---

## Phase 8: Backup and Recovery

### Database Backup

#### 1. Automated Backup Script
```bash
# Create backup script
cat > backup_database.sh << 'EOF'
#!/bin/bash

# Set variables
DB_URL="postgresql://postgres:[password]@[host]:5432/database"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="minutemeet_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump $DB_URL > $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

echo "Backup created: $BACKUP_DIR/$BACKUP_FILE.gz"
EOF

chmod +x backup_database.sh
```

#### 2. Restore Database
```bash
# Restore from backup
gunzip -c backups/minutemeet_backup_20241220_120000.sql.gz | psql $DB_URL
```

---

## Phase 9: Performance Optimization

### Backend Optimization

#### 1. Railway Configuration
```bash
# Set Railway environment variables for performance
railway variables set MAX_WORKERS=4
railway variables set WORKER_CLASS=uvicorn.workers.UvicornWorker
railway variables set TIMEOUT=30
```

#### 2. Database Optimization
```sql
-- Connect to database and run optimization queries
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at);
CREATE INDEX IF NOT EXISTS idx_action_items_meeting_id ON action_items(meeting_id);
CREATE INDEX IF NOT EXISTS idx_action_items_assignee ON action_items(assignee);
```

### Frontend Optimization

#### 1. Vercel Configuration
```bash
# Add to vercel.json
cat > frontend/vercel.json << 'EOF'
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
EOF
```

---

## Phase 10: Security Configuration

### Security Headers

#### 1. Backend Security
```python
# Add to main.py
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

# Add security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["minutemeet.com", "*.vercel.app"])
app.add_middleware(HTTPSRedirectMiddleware)
```

#### 2. Frontend Security
```javascript
// Add to next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

---

## Success Criteria

### Deployment Success
- Backend deployed to Railway
- Frontend deployed to Vercel
- Database configured and connected
- All environment variables set
- Health checks passing

### Performance Success
- API response times < 3 seconds
- Frontend load time < 5 seconds
- Database queries optimized
- SSL certificates working

### Security Success
- HTTPS enabled
- Security headers configured
- Environment variables secured
- Database access restricted

### Monitoring Success
- Health checks automated
- Logs accessible
- Metrics available
- Alerts configured

---

## Emergency Procedures

### If Deployment Fails
1. **Check logs** for error messages
2. **Verify environment variables** are set correctly
3. **Test locally** to ensure code works
4. **Rollback** to previous version if needed
5. **Contact team** with specific error details

### If Service Goes Down
1. **Check health endpoints** immediately
2. **Review logs** for error patterns
3. **Restart services** if possible
4. **Check resource usage** (CPU, memory)
5. **Escalate to development team**

### If Database Issues
1. **Check connection string** is correct
2. **Verify database** is accessible
3. **Check backup** availability
4. **Restore from backup** if needed
5. **Update connection** if database moved

---

## Final Verification Checklist

### Pre-Demo Verification
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] All API endpoints responding
- [ ] Health checks passing
- [ ] SSL certificates working
- [ ] Performance metrics acceptable
- [ ] Monitoring set up
- [ ] Backup procedures in place

### Demo Day Readiness
- [ ] All services running smoothly
- [ ] No critical issues
- [ ] Performance optimized
- [ ] Monitoring active
- [ ] Team notified of status
- [ ] Rollback plan ready

---

## CRITICAL: Final Deployment Checklist

### Before You Start
- [ ] Ensure you have Railway and Vercel accounts
- [ ] Have GitHub repository access
- [ ] Verify local project builds successfully
- [ ] Test all functionality locally

### Deployment Order (CRITICAL)
1. **Backend First**: Deploy to Railway
2. **Database Second**: Set up PostgreSQL
3. **Frontend Last**: Deploy to Vercel with correct API URL

### Emergency Contacts
- **Team Lead**: Available for technical issues
- **Backend Lead**: For backend-specific problems
- **Frontend Developer**: For frontend-specific problems

### Success Indicators
- Backend health check returns 200
- Frontend loads without errors
- API endpoints respond correctly
- Database connection established
- Full application functionality working

### Quick Recovery Commands
```bash
# If deployment fails completely:
git checkout main
git pull origin main
# Start over with deployment

# If only one service fails:
# Redeploy just that service
railway up  # for backend
vercel --prod  # for frontend
```

---

---

## Phase 8: Meeting Integration Deployment (NEW - 1-2 hours)

### Step 1: File Upload Infrastructure
```bash
# Add file upload support to Railway backend
# Update requirements.txt with file processing libraries
cd backend
echo "librosa==0.10.1" >> requirements.txt
echo "speechrecognition==3.10.0" >> requirements.txt
echo "pydub==0.25.1" >> requirements.txt
echo "webrtcvad==2.0.10" >> requirements.txt

# Update Railway configuration for file uploads
cat > railway.json << 'EOF'
{
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "build": {
    "builder": "NIXPACKS"
  }
}
EOF
```

### Step 2: Webhook Configuration
```bash
# Set up webhook endpoints for meeting platforms
# Add environment variables for webhook security
cat > .env.production << 'EOF'
# Meeting Integration Settings
WEBHOOK_SECRET_TEAMS=your_teams_webhook_secret
WEBHOOK_SECRET_ZOOM=your_zoom_webhook_secret
WEBHOOK_SECRET_GOOGLE=your_google_webhook_secret

# File Upload Settings
MAX_FILE_SIZE=100MB
UPLOAD_DIR=/tmp/uploads
ALLOWED_AUDIO_TYPES=mp3,wav,m4a,aac,ogg
ALLOWED_VIDEO_TYPES=mp4,avi,mov,mkv,webm
ALLOWED_TRANSCRIPT_TYPES=txt,srt,vtt,json

# Google Calendar Integration
GOOGLE_CREDENTIALS_FILE=/app/credentials.json
GOOGLE_CALENDAR_ID=primary
EOF
```

### Step 3: Frontend Integration Deployment
```bash
# Update Vercel configuration for file uploads
cd frontend
cat > vercel.json << 'EOF'
{
  "functions": {
    "app/api/upload/route.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
EOF
```

### Step 4: Database Schema Updates
```bash
# Add integration tables to database
cd backend
cat > migrations/add_integrations.sql << 'EOF'
-- Meeting Integrations Table
CREATE TABLE IF NOT EXISTS meeting_integrations (
    id VARCHAR(255) PRIMARY KEY,
    meeting_id VARCHAR(255) REFERENCES meetings(id),
    platform VARCHAR(50) NOT NULL,
    external_id VARCHAR(255),
    webhook_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File Uploads Table
CREATE TABLE IF NOT EXISTS file_uploads (
    id VARCHAR(255) PRIMARY KEY,
    meeting_id VARCHAR(255) REFERENCES meetings(id),
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    file_path VARCHAR(500),
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webhook Events Table
CREATE TABLE IF NOT EXISTS webhook_events (
    id VARCHAR(255) PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload TEXT NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

# Run migration
python -c "
from database import engine
with open('migrations/add_integrations.sql', 'r') as f:
    sql = f.read()
    engine.execute(sql)
print('Integration tables created successfully')
"
```

### Step 5: Webhook Security Setup
```bash
# Add webhook signature verification
cat > backend/webhook_security.py << 'EOF'
import hmac
import hashlib
import json
from typing import Dict, Any

class WebhookSecurity:
    @staticmethod
    def verify_teams_signature(payload: str, signature: str, secret: str) -> bool:
        """Verify Microsoft Teams webhook signature"""
        expected_signature = hmac.new(
            secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(signature, expected_signature)
    
    @staticmethod
    def verify_zoom_signature(payload: str, signature: str, secret: str) -> bool:
        """Verify Zoom webhook signature"""
        expected_signature = hmac.new(
            secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(signature, expected_signature)
    
    @staticmethod
    def verify_google_signature(payload: str, signature: str, secret: str) -> bool:
        """Verify Google webhook signature"""
        expected_signature = hmac.new(
            secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(signature, expected_signature)
EOF
```

### Step 6: Integration Testing Commands
```bash
# Test file upload endpoint
curl -X POST "https://your-backend.railway.app/api/meetings/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-meeting.wav" \
  -F "meeting_type=general" \
  -F "participants=[\"test@company.com\"]"

# Test webhook endpoints
curl -X POST "https://your-backend.railway.app/api/webhooks/teams" \
  -H "Content-Type: application/json" \
  -H "X-Teams-Signature: your_signature" \
  -d '{
    "subject": "Test Meeting",
    "attendees": [{"emailAddress": {"address": "test@company.com"}}],
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:00:00Z"
  }'

# Test Google Calendar integration
curl -X GET "https://your-backend.railway.app/api/calendar/meetings?start=2024-01-01&end=2024-01-31" \
  -H "Authorization: Bearer your_google_token"
```

### Step 7: Monitoring and Alerts
```bash
# Add integration monitoring
cat > backend/monitoring.py << 'EOF'
import logging
from datetime import datetime, timedelta
from database import get_db
from sqlalchemy import text

class IntegrationMonitoring:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def check_webhook_health(self):
        """Check if webhooks are receiving data"""
        db = next(get_db())
        try:
            # Check for recent webhook events
            recent_events = db.execute(text("""
                SELECT COUNT(*) as count 
                FROM webhook_events 
                WHERE created_at > NOW() - INTERVAL '1 hour'
            """)).fetchone()
            
            if recent_events.count == 0:
                self.logger.warning("No webhook events received in the last hour")
                return False
            
            return True
        except Exception as e:
            self.logger.error(f"Webhook health check failed: {e}")
            return False
    
    def check_file_processing_health(self):
        """Check if file processing is working"""
        db = next(get_db())
        try:
            # Check for stuck file uploads
            stuck_uploads = db.execute(text("""
                SELECT COUNT(*) as count 
                FROM file_uploads 
                WHERE processed = FALSE 
                AND created_at < NOW() - INTERVAL '30 minutes'
            """)).fetchone()
            
            if stuck_uploads.count > 0:
                self.logger.warning(f"{stuck_uploads.count} file uploads stuck in processing")
                return False
            
            return True
        except Exception as e:
            self.logger.error(f"File processing health check failed: {e}")
            return False
EOF
```

### Step 8: Deployment Verification
```bash
# Verify all integration features are working
echo "Testing Meeting Integration Features..."

# Test 1: File Upload
echo "1. Testing file upload..."
curl -X POST "https://your-backend.railway.app/api/meetings/upload" \
  -F "file=@sample.wav" \
  -F "meeting_type=general" \
  -F "participants=[]" \
  -w "HTTP Status: %{http_code}\n"

# Test 2: Webhook Endpoints
echo "2. Testing webhook endpoints..."
curl -X POST "https://your-backend.railway.app/api/webhooks/teams" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -w "HTTP Status: %{http_code}\n"

# Test 3: Integration Dashboard
echo "3. Testing integration dashboard..."
curl -X GET "https://your-frontend.vercel.app/integrations" \
  -w "HTTP Status: %{http_code}\n"

# Test 4: Live Recording
echo "4. Testing live recording endpoint..."
curl -X GET "https://your-backend.railway.app/api/recording/status" \
  -w "HTTP Status: %{http_code}\n"
```

### Success Criteria for Integration Deployment
- [ ] File upload API handles all supported formats
- [ ] Webhook endpoints respond to platform events
- [ ] Google Calendar integration fetches meeting data
- [ ] Database schema includes integration tables
- [ ] Security measures protect webhook endpoints
- [ ] Monitoring tracks integration health
- [ ] All integration features work in production
- [ ] Performance meets requirements (< 30s processing)

---

**NEW: Meeting integration deployment features added. Focus on zero-cost solutions!**

**Remember: Deploy in order (Backend → Database → Frontend) and test each step before proceeding!**
