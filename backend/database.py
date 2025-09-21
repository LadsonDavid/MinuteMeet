from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

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
    postgres_url = "postgresql://postgres:password@localhost:5432/minutemeet"
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
        print(f" Database connection failed: {e}")
        return False
