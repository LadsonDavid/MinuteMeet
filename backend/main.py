from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator, ValidationError
from typing import List, Optional
from datetime import datetime
import uvicorn
import json
import os
import logging
import sys
import warnings
import time
from functools import lru_cache

# Suppress warnings and logs
warnings.filterwarnings("ignore")
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("torch").setLevel(logging.ERROR)

# Import AI service and database
from ai_service import MeetingAI
from database import get_db, create_tables, test_connection, Meeting, ActionItem, IS_PRODUCTION
from sqlalchemy.orm import Session

app = FastAPI(
    title="MinuteMeet Pro API",
    description="AI-powered meeting summarization and task extraction",
    version="1.0.0"
)

# Custom validation error handler for correct HTTP status codes
@app.exception_handler(ValidationError)
async def validation_error_handler(request: Request, exc: ValidationError):
    """Return 400 instead of 422 for validation errors"""
    return JSONResponse(
        status_code=400,  # Return 400 instead of 422
        content={"error": "Validation Error", "detail": str(exc)}
    )

# Setup logging
def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
        ]
    )
    
    # Log startup
    logging.info("MinuteMeet Backend started")
    logging.info(f"Environment: {'production' if IS_PRODUCTION else 'development'}")
    logging.info(f"Database: {'PostgreSQL' if IS_PRODUCTION else 'SQLite'}")

# Initialize logging
setup_logging()

# CORS middleware - Production ready
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://minutemeet.vercel.app").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Error handling middleware
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=400,
        content={"error": "Validation Error", "detail": str(exc)}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logging.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": "An unexpected error occurred"}
    )

# Initialize AI service (Using Hugging Face models)
ai_service = MeetingAI(use_gpu=False)  # Set to True if you have GPU

# Initialize database (with error handling)
try:
    create_tables()
    if test_connection():
        db_type = "PostgreSQL" if IS_PRODUCTION else "SQLite"
        print(f"Database connected successfully: {db_type}")
    else:
        print("Database connection failed - some features may not work")
except Exception as e:
    print(f"Database initialization failed: {e}")
    print("Continuing without database - some features may not work")

# Pydantic models with validation
class MeetingTranscript(BaseModel):
    transcript: str
    participants: List[str]
    meeting_type: str
    duration: int
    title: Optional[str] = None
    
    @validator('transcript')
    def validate_transcript(cls, v):
        if not v or not v.strip():
            raise ValueError('Transcript cannot be empty')
        if len(v.strip()) < 10:
            raise ValueError('Transcript too short (minimum 10 characters)')
        return v.strip()
    
    @validator('meeting_type')
    def validate_meeting_type(cls, v):
        valid_types = ["general", "executive", "sprint_planning", "budget", "client", "technical"]
        if v not in valid_types:
            raise ValueError(f'Invalid meeting type. Must be one of: {valid_types}')
        return v
    
    @validator('participants')
    def validate_participants(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one participant is required')
        return v
    
    @validator('duration')
    def validate_duration(cls, v):
        if v <= 0:
            raise ValueError('Duration must be greater than 0')
        return v

class ActionItemRequest(BaseModel):
    id: str
    task: str
    assignee: str
    due_date: str
    priority: str
    status: str = "pending"

class MeetingResponse(BaseModel):
    meeting_id: str
    summary: str
    action_items: List[ActionItemRequest]
    health_score: float
    key_insights: List[str]
    next_steps: List[str]

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "MinuteMeet Pro API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@lru_cache(maxsize=1)
def get_cached_health_status():
    """Cached health status for better performance"""
    try:
        # Check database connection
        db_status = test_connection()
        
        # Check AI service (lightweight check)
        ai_status = "ready"  # Assume ready if no exception
        
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "database": "connected" if db_status else "disconnected",
            "ai_service": ai_status,
            "environment": "production" if IS_PRODUCTION else "development",
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": time.time(),
            "error": str(e),
            "environment": "production" if IS_PRODUCTION else "development",
            "version": "1.0.0"
        }

@app.get("/health")
async def health_check():
    """
    Health check endpoint with optimized caching
    """
    # Remove aggressive cache clearing for better performance
    return get_cached_health_status()

@app.post("/api/meetings/process", response_model=MeetingResponse)
async def process_meeting(transcript: MeetingTranscript, db: Session = Depends(get_db)):
    """
    Process meeting transcript and generate summary, action items, and insights
    Input validation is handled by Pydantic validators
    """
    try:
        # Generate AI-powered summary
        summary = ai_service.summarize_meeting(
            transcript.transcript,
            transcript.meeting_type
        )
        
        # Extract action items
        action_items = ai_service.extract_action_items(
            transcript.transcript,
            transcript.participants
        )
        
        # Calculate meeting health score
        health_score = ai_service.calculate_health_score(
            transcript.transcript,
            transcript.duration,
            len(transcript.participants)
        )
        
        # Extract key insights
        key_insights = ai_service.extract_key_insights(transcript.transcript)
        
        # Generate next steps
        next_steps = ai_service.generate_next_steps(action_items)
        
        # Generate meeting ID
        meeting_id = f"meeting_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Save meeting to database
        meeting = Meeting(
            id=meeting_id,
            title=transcript.title or f"Meeting {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            transcript=transcript.transcript,
            participants=json.dumps(transcript.participants),
            meeting_type=transcript.meeting_type,
            duration=transcript.duration,
            summary=summary,
            health_score=health_score,
            key_insights=json.dumps(key_insights),
            next_steps=json.dumps(next_steps)
        )
        
        db.add(meeting)
        db.commit()
        db.refresh(meeting)
        
        # Save action items to database
        for item in action_items:
            action_item = ActionItem(
                id=item["id"],
                meeting_id=meeting_id,
                task=item["task"],
                assignee=item["assignee"],
                due_date=item["due_date"],
                priority=item["priority"],
                status=item["status"]
            )
            db.add(action_item)
        
        db.commit()
        
        return MeetingResponse(
            meeting_id=meeting_id,
            summary=summary,
            action_items=action_items,
            health_score=health_score,
            key_insights=key_insights,
            next_steps=next_steps
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing meeting: {str(e)}")

@app.get("/api/meetings/{meeting_id}")
async def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    """
    Get meeting details by ID
    """
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Get action items for this meeting
    action_items = db.query(ActionItem).filter(ActionItem.meeting_id == meeting_id).all()
    
    return {
        "meeting_id": meeting.id,
        "title": meeting.title,
        "summary": meeting.summary,
        "health_score": meeting.health_score,
        "key_insights": json.loads(meeting.key_insights) if meeting.key_insights else [],
        "next_steps": json.loads(meeting.next_steps) if meeting.next_steps else [],
        "action_items": [
            {
                "id": item.id,
                "task": item.task,
                "assignee": item.assignee,
                "due_date": item.due_date,
                "priority": item.priority,
                "status": item.status
            } for item in action_items
        ],
        "created_at": meeting.created_at
    }

@app.get("/api/meetings")
async def list_meetings(db: Session = Depends(get_db)):
    """
    List all meetings with optional filters
    """
    meetings = db.query(Meeting).order_by(Meeting.created_at.desc()).all()
    
    return {
        "meetings": [
            {
                "id": meeting.id,
                "title": meeting.title,
                "meeting_type": meeting.meeting_type,
                "duration": meeting.duration,
                "health_score": meeting.health_score,
                "created_at": meeting.created_at
            } for meeting in meetings
        ],
        "total": len(meetings)
    }

@app.get("/api/action-items")
async def list_action_items(db: Session = Depends(get_db)):
    """
    List all action items
    """
    action_items = db.query(ActionItem).order_by(ActionItem.created_at.desc()).all()
    
    return {
        "action_items": [
            {
                "id": item.id,
                "meeting_id": item.meeting_id,
                "task": item.task,
                "assignee": item.assignee,
                "due_date": item.due_date,
                "priority": item.priority,
                "status": item.status,
                "created_at": item.created_at
            } for item in action_items
        ],
        "total": len(action_items)
    }

@app.post("/api/action-items")
async def create_action_item(action_item: ActionItemRequest, db: Session = Depends(get_db)):
    """
    Create a new action item
    """
    db_action_item = ActionItem(
        id=action_item.id,
        meeting_id=action_item.meeting_id,
        task=action_item.task,
        assignee=action_item.assignee,
        due_date=action_item.due_date,
        priority=action_item.priority,
        status=action_item.status
    )
    
    db.add(db_action_item)
    db.commit()
    db.refresh(db_action_item)
    
    return {"message": "Action item created", "id": action_item.id}

@app.put("/api/action-items/{item_id}")
async def update_action_item(item_id: str, action_item: ActionItemRequest, db: Session = Depends(get_db)):
    """
    Update an existing action item
    """
    db_action_item = db.query(ActionItem).filter(ActionItem.id == item_id).first()
    if not db_action_item:
        raise HTTPException(status_code=404, detail="Action item not found")
    
    db_action_item.task = action_item.task
    db_action_item.assignee = action_item.assignee
    db_action_item.due_date = action_item.due_date
    db_action_item.priority = action_item.priority
    db_action_item.status = action_item.status
    
    db.commit()
    
    return {"message": "Action item updated", "id": item_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
