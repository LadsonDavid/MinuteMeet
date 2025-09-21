const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface MeetingData {
  title: string;
  transcript: string;
  participants: string[];
  meeting_type: string;
  duration: number;
}

export interface ProcessedMeeting {
  meeting_id: string;
  summary: string;
  action_items: ActionItem[];
  health_score: number;
  key_insights: string[];
  next_steps: string[];
}

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  due_date: string;
  priority: string;
  status: string;
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  database?: string;
  ai_service?: string;
}

export class ApiService {
  static async processMeeting(meetingData: MeetingData): Promise<ProcessedMeeting> {
    const response = await fetch(`${API_BASE_URL}/api/meetings/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to process meeting: ${response.statusText}`);
    }

    return response.json();
  }

  static async getMeetings(): Promise<{ meetings: ProcessedMeeting[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/api/meetings`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch meetings: ${response.statusText}`);
    }

    return response.json();
  }

  static async getMeeting(id: string): Promise<ProcessedMeeting> {
    const response = await fetch(`${API_BASE_URL}/api/meetings/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch meeting: ${response.statusText}`);
    }

    return response.json();
  }

  static async healthCheck(): Promise<HealthCheck> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }
}
