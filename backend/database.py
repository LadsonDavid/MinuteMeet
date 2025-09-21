from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
from datetime import datetime
import os
import uuid

# Database configuration - Use PostgreSQL for both development and production
# Development: Docker Compose provides postgresql://postgres:password@db:5432/minutemeet
# Production: Railway provides DATABASE_URL
# Fallback: SQLite if PostgreSQL is not available

# Try PostgreSQL first, fallback to SQLite
def get_database_url():
    # Check if we have a custom DATABASE_URL (Railway production)
    if os.getenv("DATABASE_URL"):
        return os.getenv("DATABASE_URL")
    
    # Try PostgreSQL for local development
    postgres_password = os.getenv("POSTGRES_PASSWORD", "password")
    postgres_url = f"postgresql://postgres:{postgres_password}@localhost:5432/minutemeet"
    try:
        # Test PostgreSQL connection
        test_engine = create_engine(postgres_url)
        test_engine.connect()
        return postgres_url
    except:
        # Silent fallback to SQLite
        return "sqlite:///./minutemeet.db"

DATABASE_URL = get_database_url()
IS_PRODUCTION = os.getenv("ENVIRONMENT", "development") == "production"

# Create engine
engine = create_engine(DATABASE_URL)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Database Models
class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    transcript = Column(Text, nullable=False)
    participants = Column(Text, nullable=False)  # JSON string
    meeting_type = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    summary = Column(Text)
    health_score = Column(Float)
    key_insights = Column(Text)  # JSON string
    next_steps = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships for integrations
    integrations = relationship("MeetingIntegration", back_populates="meeting")
    file_uploads = relationship("FileUpload", back_populates="meeting")
    processing_tasks = relationship("ProcessingTask", back_populates="meeting")

class ActionItem(Base):
    __tablename__ = "action_items"
    
    id = Column(String, primary_key=True, index=True)
    meeting_id = Column(String, nullable=False, index=True)
    task = Column(Text, nullable=False)
    assignee = Column(String, nullable=False)
    due_date = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Enhanced Database Models for Meeting Integrations

class MeetingIntegration(Base):
    __tablename__ = "meeting_integrations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    meeting_id = Column(String, ForeignKey("meetings.id"))
    platform = Column(String)  # 'teams', 'zoom', 'google_meet'
    external_id = Column(String)  # External meeting ID
    webhook_data = Column(Text)  # Raw webhook payload
    created_at = Column(DateTime, server_default=func.now())
    
    meeting = relationship("Meeting", back_populates="integrations")

class FileUpload(Base):
    __tablename__ = "file_uploads"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    meeting_id = Column(String, ForeignKey("meetings.id"))
    filename = Column(String)
    file_type = Column(String)  # 'audio', 'video', 'transcript'
    file_size = Column(Integer)
    file_path = Column(String)
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    
    meeting = relationship("Meeting", back_populates="file_uploads")

class ProcessingTask(Base):
    __tablename__ = "processing_tasks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    meeting_id = Column(String, ForeignKey("meetings.id"))
    task_type = Column(String)  # 'async_processing', 'file_upload', 'webhook'
    status = Column(String, default="pending")  # 'pending', 'processing', 'completed', 'failed'
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    error_message = Column(Text)
    result_data = Column(Text)  # JSON string
    created_at = Column(DateTime, server_default=func.now())
    
    meeting = relationship("Meeting", back_populates="processing_tasks")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Test database connection
def test_connection():
    try:
        engine.connect()
        return True
    except Exception as e:
        return False
