"""
Basic tests for the main FastAPI application
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] in ["healthy", "unhealthy"]

def test_api_docs():
    """Test that API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200

def test_redoc():
    """Test that ReDoc documentation is accessible"""
    response = client.get("/redoc")
    assert response.status_code == 200

def test_meetings_endpoint():
    """Test the meetings endpoint"""
    response = client.get("/api/meetings")
    assert response.status_code == 200
    data = response.json()
    assert "meetings" in data

def test_action_items_endpoint():
    """Test the action items endpoint"""
    response = client.get("/api/action-items")
    assert response.status_code == 200
    data = response.json()
    assert "action_items" in data

def test_meeting_processing():
    """Test meeting processing endpoint with valid data"""
    test_data = {
        "transcript": "CEO: We need to increase Q4 revenue by 25%. Sarah, prepare the financial analysis by Friday.",
        "participants": ["CEO", "Sarah"],
        "meeting_type": "executive",
        "duration": 30
    }
    
    response = client.post("/api/meetings/process", json=test_data)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "action_items" in data
    assert "health_score" in data

def test_meeting_processing_invalid_data():
    """Test meeting processing with invalid data"""
    test_data = {
        "transcript": "",  # Empty transcript should fail
        "participants": ["CEO"],
        "meeting_type": "executive",
        "duration": 30
    }
    
    response = client.post("/api/meetings/process", json=test_data)
    assert response.status_code == 400

def test_meeting_processing_invalid_type():
    """Test meeting processing with invalid meeting type"""
    test_data = {
        "transcript": "Test meeting",
        "participants": ["CEO"],
        "meeting_type": "invalid_type",  # Invalid type should fail
        "duration": 30
    }
    
    response = client.post("/api/meetings/process", json=test_data)
    assert response.status_code == 400
