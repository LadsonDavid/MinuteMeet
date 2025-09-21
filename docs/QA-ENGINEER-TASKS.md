# QA Testing Guide

**Role**: QA Engineer  
**Objective**: Comprehensive testing and validation of MinuteMeet system  
**Status**: Ready for execution

---

## Quick Start Commands

### 1. System Health Check
```bash
# Navigate to project directory
cd MinuteMeet

# Start backend server
cd backend
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 2. Basic Health Verification
```bash
# Test backend health
curl -X GET http://localhost:8000/health

# Test API endpoints
curl -X GET http://localhost:8000/api/meetings
curl -X GET http://localhost:8000/api/action-items

# Test frontend
curl -X GET http://localhost:3000
```

---

## Phase 1: Functional Testing

### API Endpoint Testing

#### Health Endpoint Test
```bash
# Test health endpoint
curl -X GET http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-12-XX...",
  "database": "connected",
  "ai_service": "ready",
  "environment": "development",
  "version": "1.0.0"
}
```

#### Meetings API Testing
```bash
# Test GET meetings
curl -X GET http://localhost:8000/api/meetings

# Test POST meeting processing
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "John: We need to finalize the Q4 budget by Friday. Sarah: I will prepare the financial projections by Wednesday.",
    "participants": ["John", "Sarah"],
    "meeting_type": "budget",
    "duration": 30
  }'

# Test GET specific meeting
curl -X GET http://localhost:8000/api/meetings/{meeting_id}
```

#### Action Items API Testing
```bash
# Test GET action items
curl -X GET http://localhost:8000/api/action-items

# Test POST action item
curl -X POST http://localhost:8000/api/action-items \
  -H "Content-Type: application/json" \
  -d '{
    "id": "action_001",
    "meeting_id": "meeting_001",
    "task": "Prepare financial projections",
    "assignee": "Sarah",
    "due_date": "2024-12-25",
    "priority": "high",
    "status": "pending"
  }'

# Test PUT action item
curl -X PUT http://localhost:8000/api/action-items/action_001 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "action_001",
    "meeting_id": "meeting_001",
    "task": "Prepare financial projections",
    "assignee": "Sarah",
    "due_date": "2024-12-25",
    "priority": "high",
    "status": "completed"
  }'
```

### Frontend Component Testing

#### Build Testing
```bash
# Test frontend build
cd frontend
npm run build

# Test linting
npm run lint

# Test type checking
npx tsc --noEmit
```

#### Component Testing
```bash
# Test individual components
npm test

# Test with watch mode
npm run test:watch
```

### AI Service Testing

#### Meeting Processing Test
```bash
# Test AI summarization
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "CEO: We need to increase Q4 revenue by 25%. Sarah, prepare the financial analysis by Friday. CFO: I will review the budget allocations and identify cost savings opportunities. CTO: The new platform launch is on track for December 15th. We need 3 additional developers.",
    "participants": ["CEO", "CFO", "CTO"],
    "meeting_type": "executive",
    "duration": 60
  }'
```

#### AI Accuracy Test
```bash
# Test with different meeting types
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Alice: Welcome to our sprint planning. We have 3 major features to complete this sprint. Bob: The user authentication feature is ready for development. Carol: I will start on the payment integration module.",
    "participants": ["Alice", "Bob", "Carol"],
    "meeting_type": "sprint_planning",
    "duration": 45
  }'
```

---

## Phase 2: Integration Testing

### End-to-End Workflow Testing

#### Complete Meeting Processing Flow
```bash
# Step 1: Process a meeting
MEETING_RESPONSE=$(curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "John: We need to finalize the Q4 budget by Friday. Sarah: I will prepare the financial projections by Wednesday. Mike: I will coordinate with the marketing team for the campaign launch.",
    "participants": ["John", "Sarah", "Mike"],
    "meeting_type": "budget",
    "duration": 45
  }')

echo "Meeting processed: $MEETING_RESPONSE"

# Step 2: Get meeting ID from response
MEETING_ID=$(echo $MEETING_RESPONSE | jq -r '.meeting.id')

# Step 3: Retrieve the meeting
curl -X GET http://localhost:8000/api/meetings/$MEETING_ID

# Step 4: Check action items
curl -X GET http://localhost:8000/api/action-items
```

### Database Integration Testing

#### Database Connection Test
```bash
# Test database connection
python -c "from database import test_connection; print('Database connected:', test_connection())"
```

#### Data Persistence Test
```bash
# Create test data
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Test meeting for data persistence",
    "participants": ["TestUser"],
    "meeting_type": "general",
    "duration": 30
  }'

# Verify data is stored
curl -X GET http://localhost:8000/api/meetings
```

---

## Phase 3: Performance Testing

### Response Time Testing

#### API Response Time Test
```bash
# Test health endpoint response time
time curl -X GET http://localhost:8000/health

# Test meeting processing response time
time curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Performance test meeting with longer transcript to test AI processing time and response accuracy under load conditions.",
    "participants": ["TestUser"],
    "meeting_type": "general",
    "duration": 30
  }'
```

#### Load Testing Script
```bash
# Create load test script
cat > load_test.py << 'EOF'
import requests
import time
import concurrent.futures

def test_endpoint():
    start_time = time.time()
    response = requests.get('http://localhost:8000/health')
    end_time = time.time()
    return {
        'status_code': response.status_code,
        'response_time': end_time - start_time
    }

# Run 10 concurrent requests
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(test_endpoint) for _ in range(10)]
    results = [future.result() for future in futures]

for i, result in enumerate(results):
    print(f"Request {i+1}: {result['status_code']} - {result['response_time']:.2f}s")
EOF

python load_test.py
```

### Memory Usage Testing

#### Memory Monitoring
```bash
# Monitor memory usage during AI processing
python -c "
import psutil
import time
from ai_service import MeetingAI

# Get initial memory
initial_memory = psutil.Process().memory_info().rss / 1024 / 1024
print(f'Initial memory: {initial_memory:.2f} MB')

# Initialize AI service
ai = MeetingAI(use_gpu=False)
ai_memory = psutil.Process().memory_info().rss / 1024 / 1024
print(f'After AI init: {ai_memory:.2f} MB')

# Process a meeting
transcript = 'Test meeting for memory monitoring with sufficient content to trigger AI processing and measure memory consumption during the summarization process.'
summary = ai.summarize_meeting(transcript, 'general')
final_memory = psutil.Process().memory_info().rss / 1024 / 1024
print(f'After processing: {final_memory:.2f} MB')
print(f'Memory increase: {final_memory - initial_memory:.2f} MB')
"
```

---

## Phase 4: Demo Scenario Testing

### Demo Data Testing

#### Executive Meeting Test
```bash
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "CEO: We need to increase Q4 revenue by 25%. Sarah, prepare the financial analysis by Friday. CFO: I will review the budget allocations and identify cost savings opportunities. CTO: The new platform launch is on track for December 15th. We need 3 additional developers. CEO: Approved. HR, start recruiting immediately. Marketing, prepare the launch campaign.",
    "participants": ["CEO", "CFO", "CTO", "HR", "Marketing"],
    "meeting_type": "executive",
    "duration": 60
  }'
```

#### Sprint Planning Test
```bash
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Alice: Welcome to our sprint planning. We have 3 major features to complete this sprint. Bob: The user authentication feature is ready for development. Carol: I will start on the payment integration module. Dave: What about the mobile app updates? Alice: Those are lower priority. Bob: I need help with the database migration. Carol: I can assist with that. Dave: When do we need to have everything ready? Alice: End of next week. We need to coordinate with the QA team for testing.",
    "participants": ["Alice", "Bob", "Carol", "Dave"],
    "meeting_type": "sprint_planning",
    "duration": 45
  }'
```

#### Budget Meeting Test
```bash
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "CFO: Our Q4 budget needs to be finalized by next Friday. We have $500K allocated for marketing. Marketing Lead: I will prepare the campaign strategy by Wednesday. CFO: The 15% increase in marketing budget is approved. CTO: We need $200K for the new platform infrastructure. CFO: Approved. Make sure to track ROI on all investments.",
    "participants": ["CFO", "Marketing Lead", "CTO"],
    "meeting_type": "budget",
    "duration": 30
  }'
```

### UI/UX Testing

#### Frontend Navigation Test
```bash
# Test all frontend routes
curl -X GET http://localhost:3000/
curl -X GET http://localhost:3000/meetings
curl -X GET http://localhost:3000/action-items
```

#### Responsive Design Test
```bash
# Test mobile viewport
# Use browser dev tools to test different screen sizes:
# - Mobile: 375x667
# - Tablet: 768x1024
# - Desktop: 1920x1080
```

---

## Phase 5: Error Handling Testing

### Error Scenario Testing

#### Invalid Input Testing
```bash
# Test with empty transcript
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "",
    "participants": [],
    "meeting_type": "general",
    "duration": 0
  }'

# Test with invalid meeting type
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Test meeting",
    "participants": ["TestUser"],
    "meeting_type": "invalid_type",
    "duration": 30
  }'

# Test with missing required fields
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Test meeting"
  }'
```

#### Network Error Testing
```bash
# Test with backend down
# Stop backend server and test frontend error handling
# Expected: Graceful error display, retry mechanisms
```

### Fallback System Testing

#### AI Service Fallback Test
```bash
# Test AI service with very short transcript
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Hi",
    "participants": ["TestUser"],
    "meeting_type": "general",
    "duration": 5
  }'
```

---

## Phase 6: Security Testing

### Input Validation Testing

#### SQL Injection Test
```bash
# Test for SQL injection in meeting processing
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Test meeting\"; DROP TABLE meetings; --",
    "participants": ["TestUser"],
    "meeting_type": "general",
    "duration": 30
  }'
```

#### XSS Testing
```bash
# Test for XSS in meeting processing
curl -X POST http://localhost:8000/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Test meeting <script>alert(\"XSS\")</script>",
    "participants": ["TestUser"],
    "meeting_type": "general",
    "duration": 30
  }'
```

---

## Test Report Generation

### Automated Test Report
```bash
# Create test report script
cat > generate_test_report.py << 'EOF'
import requests
import json
import time
from datetime import datetime

def test_endpoint(url, method='GET', data=None):
    try:
        start_time = time.time()
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data)
        end_time = time.time()
        
        return {
            'url': url,
            'method': method,
            'status_code': response.status_code,
            'response_time': end_time - start_time,
            'success': response.status_code < 400,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        return {
            'url': url,
            'method': method,
            'status_code': 'ERROR',
            'response_time': 0,
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

# Test all endpoints
tests = [
    ('http://localhost:8000/health', 'GET'),
    ('http://localhost:8000/api/meetings', 'GET'),
    ('http://localhost:8000/api/action-items', 'GET'),
    ('http://localhost:8000/api/meetings/process', 'POST', {
        'transcript': 'Test meeting for automated testing',
        'participants': ['TestUser'],
        'meeting_type': 'general',
        'duration': 30
    })
]

results = []
for test in tests:
    if len(test) == 2:
        result = test_endpoint(test[0], test[1])
    else:
        result = test_endpoint(test[0], test[1], test[2])
    results.append(result)

# Generate report
report = {
    'test_date': datetime.now().isoformat(),
    'total_tests': len(results),
    'passed_tests': sum(1 for r in results if r['success']),
    'failed_tests': sum(1 for r in results if not r['success']),
    'results': results
}

print(json.dumps(report, indent=2))
EOF

python generate_test_report.py > test_report.json
```

---

## Success Criteria

### Functional Testing
- All API endpoints return correct status codes
- Frontend builds without errors
- AI service processes meetings correctly
- Database operations work properly

### Performance Testing
- API response times < 3 seconds
- AI processing < 5 seconds
- Memory usage < 2GB
- Concurrent users supported

### Integration Testing
- End-to-end workflows complete successfully
- Data persistence works correctly
- Error handling graceful
- Fallback systems functional

### Demo Testing
- All demo scenarios work perfectly
- UI/UX smooth and professional
- No critical issues found
- System ready for presentation

---

## Emergency Procedures

### If Tests Fail
1. **Document the failure** with error details
2. **Check system logs** for error messages
3. **Verify environment** setup and dependencies
4. **Report to team** with specific error information
5. **Implement workaround** if possible

### If System Unstable
1. **Restart services** (backend/frontend)
2. **Check resource usage** (memory/CPU)
3. **Verify database connection**
4. **Test with minimal data**
5. **Escalate to development team**

---

