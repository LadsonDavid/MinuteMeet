import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getHealthScoreColor(score: number): string {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
}

export function getHealthScoreBg(score: number): string {
  if (score >= 8) return 'bg-green-100';
  if (score >= 6) return 'bg-yellow-100';
  return 'bg-red-100';
}

export function calculateROI(meetingDuration: number, participants: number): {
  timeSaved: string;
  productivityBoost: string;
  monthlyValue: string;
} {
  const timeSavedHours = (meetingDuration * 0.4) / 60; // 40% time saved
  const productivityBoost = 40; // 40% productivity boost
  const hourlyRate = 75; // Average hourly rate
  const monthlyValue = (timeSavedHours * participants * hourlyRate * 4).toFixed(0);
  
  return {
    timeSaved: `${timeSavedHours.toFixed(1)}h`,
    productivityBoost: `${productivityBoost}%`,
    monthlyValue: `$${monthlyValue}`
  };
}