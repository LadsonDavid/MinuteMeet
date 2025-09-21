"""
Basic tests for the AI service
"""
import pytest
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_service import MeetingAI

@pytest.fixture
def ai_service():
    """Create an AI service instance for testing"""
    return MeetingAI(use_gpu=False)

def test_ai_service_initialization(ai_service):
    """Test that AI service initializes correctly"""
    assert ai_service is not None
    assert hasattr(ai_service, 'summarize_meeting')
    assert hasattr(ai_service, 'extract_action_items')
    assert hasattr(ai_service, 'calculate_health_score')

def test_health_status(ai_service):
    """Test health status check"""
    health = ai_service.get_health_status()
    assert isinstance(health, dict)
    assert "ai_service" in health
    assert "timestamp" in health

def test_summarize_meeting_basic(ai_service):
    """Test basic meeting summarization"""
    transcript = "CEO: We need to increase Q4 revenue by 25%. Sarah, prepare the financial analysis by Friday."
    summary = ai_service.summarize_meeting(transcript, "executive")
    
    assert isinstance(summary, str)
    assert len(summary) > 0

def test_extract_action_items_basic(ai_service):
    """Test basic action item extraction"""
    transcript = "CEO: We need to increase Q4 revenue by 25%. Sarah, prepare the financial analysis by Friday."
    participants = ["CEO", "Sarah"]
    
    action_items = ai_service.extract_action_items(transcript, participants)
    
    assert isinstance(action_items, list)
    # Should extract at least one action item
    assert len(action_items) > 0

def test_calculate_health_score_basic(ai_service):
    """Test basic health score calculation"""
    transcript = "CEO: We need to increase Q4 revenue by 25%. Sarah, prepare the financial analysis by Friday."
    duration = 30
    participant_count = 2
    
    health_score = ai_service.calculate_health_score(transcript, duration, participant_count)
    
    assert isinstance(health_score, (int, float))
    assert 0 <= health_score <= 10

def test_input_validation(ai_service):
    """Test input validation"""
    # Test empty transcript
    with pytest.raises(ValueError):
        ai_service._validate_input("", "executive")
    
    # Test short transcript
    with pytest.raises(ValueError):
        ai_service._validate_input("Hi", "executive")
    
    # Test invalid meeting type
    with pytest.raises(ValueError):
        ai_service._validate_input("Valid transcript", "invalid_type")
    
    # Test valid input
    assert ai_service._validate_input("Valid transcript for testing", "executive") == True
