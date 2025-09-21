# UI/UX and Frontend Developer Implementation Tasks

## Primary Objective
Build a modern, responsive frontend interface for MinuteMeet Pro with professional UI/UX design and seamless integration with the AI backend.

## Timeline: 3-4 hours

---

## Phase 1: Project Setup and Dependencies (30 minutes)

### Step 1: Navigate to Frontend Directory
```bash
cd MinuteMeet/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Verify Next.js Setup
```bash
npm run dev
```

### Step 4: Check Required Dependencies
Ensure these packages are installed:
- next@14
- react@18
- tailwindcss@3
- framer-motion@10
- lucide-react@0.294
- zustand@4
- @radix-ui/react-* (shadcn/ui components)

---

## Phase 2: Core Component Development (90 minutes)

### Step 1: Create Header Component
Create `components/Header.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { Brain, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MinuteMeet Pro</h1>
              <p className="text-sm text-gray-600">AI Meeting Intelligence</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </nav>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  )
}
```

### Step 2: Create Footer Component
Create `components/Footer.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Brain, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">MinuteMeet Pro</h3>
                <p className="text-sm text-gray-400">AI Meeting Intelligence</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md text-lg leading-relaxed">
              Transform your meeting productivity with AI-powered summarization, 
              action item extraction, and intelligent task assignment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-lg mb-6">Product</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            </ul>
          </motion.div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 MinuteMeet. Built for Enterprise Productivity.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

### Step 3: Create Loading Spinner Component
Create `components/LoadingSpinner.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} text-blue-600`} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
```

### Step 4: Create Error Boundary Component
Create `components/ErrorBoundary.tsx`:

```tsx
'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## Phase 3: Meeting Processing Components (90 minutes)

### Step 1: Create Meeting Processor Component
Create `components/MeetingProcessor.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Mic, FileText, Users, Clock, Brain } from 'lucide-react'
import { ApiService } from '../lib/api'
import { LoadingSpinner } from './LoadingSpinner'

interface MeetingProcessorProps {
  onMeetingProcessed: (data: any) => void
  onProcessingStart: () => void
  isProcessing: boolean
}

export function MeetingProcessor({ onMeetingProcessed, onProcessingStart, isProcessing }: MeetingProcessorProps) {
  const [transcript, setTranscript] = useState('')
  const [participants, setParticipants] = useState('')
  const [meetingType, setMeetingType] = useState('general')
  const [duration, setDuration] = useState(30)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transcript.trim()) return

    onProcessingStart()

    try {
      const meetingData = {
        title: `${meetingType.charAt(0).toUpperCase() + meetingType.slice(1)} Meeting`,
        transcript: transcript.trim(),
        participants: participants.split(',').map(p => p.trim()).filter(p => p),
        meeting_type: meetingType,
        duration: duration
      }

      const result = await ApiService.processMeeting(meetingData)
      onMeetingProcessed(result)
    } catch (error) {
      console.error('Error processing meeting:', error)
      alert('Failed to process meeting. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Process Your Meeting</h2>
          <p className="text-blue-100">
            Upload your meeting transcript and let AI extract insights, action items, and summaries.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Type
              </label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General Meeting</option>
                <option value="executive">Executive Meeting</option>
                <option value="planning">Planning Meeting</option>
                <option value="budget">Budget Meeting</option>
                <option value="client">Client Meeting</option>
                <option value="technical">Technical Meeting</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="5"
                max="180"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants (comma-separated)
            </label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="John, Sarah, Mike, Lisa"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Transcript
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isProcessing || !transcript.trim()}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Process Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
```

### Step 2: Create Meeting Results Component
Create `components/MeetingResults.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Users, Target, TrendingUp, ArrowLeft, FileText } from 'lucide-react'

interface MeetingResultsProps {
  meetingData: any
  onNewMeeting: () => void
}

export function MeetingResults({ meetingData, onNewMeeting }: MeetingResultsProps) {
  const { summary, action_items, health_score, key_insights, next_steps } = meetingData

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-6">
        <button
          onClick={onNewMeeting}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Process Another Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Meeting Summary</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </motion.div>

          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-6"
          >
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Action Items</h3>
            </div>
            <div className="space-y-3">
              {action_items.map((item: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{item.task}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>Assignee: {item.assignee}</span>
                      <span>Due: {item.due_date}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.priority === 'high' ? 'bg-red-100 text-red-800' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Meeting Health</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {health_score.toFixed(1)}/10
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(health_score / 10) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {health_score >= 8 ? 'Excellent' : 
                 health_score >= 6 ? 'Good' : 
                 health_score >= 4 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
          </motion.div>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-3">
              {key_insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="space-y-3">
              {next_steps.map((step: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-green-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
```

---

## Phase 4: API Integration (60 minutes)

### Step 1: Create API Service
Create `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface MeetingData {
  title: string
  transcript: string
  participants: string[]
  meeting_type: string
  duration: number
}

export interface ProcessedMeeting {
  meeting_id: string
  summary: string
  action_items: ActionItem[]
  health_score: number
  key_insights: string[]
  next_steps: string[]
}

export interface ActionItem {
  id: string
  task: string
  assignee: string
  due_date: string
  priority: string
  status: string
}

export interface HealthCheck {
  status: string
  timestamp: string
  database?: string
  ai_service?: string
}

export class ApiService {
  static async processMeeting(meetingData: MeetingData): Promise<ProcessedMeeting> {
    const response = await fetch(`${API_BASE_URL}/api/meetings/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to process meeting: ${response.statusText}`)
    }

    return response.json()
  }

  static async getMeetings(): Promise<{ meetings: ProcessedMeeting[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/api/meetings`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch meetings: ${response.statusText}`)
    }

    return response.json()
  }

  static async getMeeting(id: string): Promise<ProcessedMeeting> {
    const response = await fetch(`${API_BASE_URL}/api/meetings/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch meeting: ${response.statusText}`)
    }

    return response.json()
  }

  static async healthCheck(): Promise<HealthCheck> {
    const response = await fetch(`${API_BASE_URL}/health`)
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`)
    }

    return response.json()
  }
}
```

### Step 2: Update Main Page
Update `app/page.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MeetingProcessor } from '../components/MeetingProcessor'
import { MeetingResults } from '../components/MeetingResults'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ApiService } from '../lib/api'
import { ProcessedMeeting } from '../lib/api'
import { Brain, Target, TrendingUp, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react'

export default function Home() {
  const [meetingData, setMeetingData] = useState<ProcessedMeeting | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/health')
        if (response.ok) {
          const data = await response.json()
          setBackendStatus('online')
        } else {
          setBackendStatus('offline')
        }
      } catch (error) {
        console.error('Backend health check failed:', error)
        setBackendStatus('offline')
      } finally {
        setIsLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      checkBackend()
    } else {
      setIsLoading(false)
      setBackendStatus('online')
    }
  }, [])

  const handleMeetingProcessed = (data: ProcessedMeeting) => {
    setMeetingData(data)
    setIsProcessing(false)
  }

  const handleProcessingStart = () => {
    setIsProcessing(true)
  }

  const handleNewMeeting = () => {
    setMeetingData(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" text="Initializing MinuteMeet Pro..." />
      </div>
    )
  }

  if (backendStatus === 'offline') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Backend Unavailable
          </h1>
          <p className="text-gray-600 mb-6">
            The AI processing service is currently offline. Please ensure the backend is running on port 8000.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <Brain className="w-4 h-4" />
              <span>AI-Powered Meeting Intelligence</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Meetings</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              AI-powered meeting summarization that extracts action items, 
              assigns tasks, and boosts team productivity by 40%
            </p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: Brain, title: "AI Analysis", desc: "Advanced NLP processing" },
                { icon: Target, title: "Action Items", desc: "Automatic task extraction" },
                { icon: TrendingUp, title: "ROI Tracking", desc: "Measure meeting value" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {!meetingData ? (
                <motion.div
                  key="processor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <MeetingProcessor 
                    onMeetingProcessed={handleMeetingProcessed}
                    onProcessingStart={handleProcessingStart}
                    isProcessing={isProcessing}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <MeetingResults 
                    meetingData={meetingData}
                    onNewMeeting={handleNewMeeting}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!meetingData && (
            <motion.div 
              className="text-center mt-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Meetings?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of teams already using AI to make their meetings more productive and actionable.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Free to try</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Setup in 2 minutes</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <Footer />
      </main>
    </ErrorBoundary>
  )
}
```

---

## Phase 5: Styling and Responsiveness (60 minutes)

### Step 1: Update Global Styles
Update `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer components {
  .gradient-text {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  }
  
  .glass-effect {
    @apply bg-white/80 backdrop-blur-sm border border-white/20;
  }
  
  .shadow-glow {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Step 2: Add Custom Animations
Create `lib/animations.ts`:

```typescript
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const scaleIn = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { type: "spring", stiffness: 300 }
}
```

---

## Phase 6: Testing and Optimization (30 minutes)

### Step 1: Test Responsive Design
```bash
# Test on different screen sizes
npm run dev
```

### Step 2: Test API Integration
```bash
# Ensure backend is running
cd ../backend
uvicorn main:app --reload

# Test frontend
cd ../frontend
npm run dev
```

### Step 3: Performance Optimization
- Optimize images and assets
- Implement lazy loading
- Add error boundaries
- Test loading states

---

## Success Criteria

### Technical Requirements
- [ ] All components render without errors
- [ ] Responsive design works on all screen sizes
- [ ] API integration functions correctly
- [ ] Loading states and error handling work
- [ ] Animations are smooth and performant

### Design Requirements
- [ ] Professional, modern UI design
- [ ] Consistent color scheme and typography
- [ ] Intuitive user experience
- [ ] Accessible design patterns
- [ ] Mobile-first responsive design

### Performance Requirements
- [ ] Fast loading times (< 3 seconds)
- [ ] Smooth animations (60fps)
- [ ] No layout shifts
- [ ] Optimized bundle size
- [ ] Cross-browser compatibility

---

## Handoff to Team

### For AI Developer
- Frontend is ready to consume AI API
- Error handling for AI service failures
- Loading states during AI processing

### For Backend Developer
- Frontend expects specific API response format
- Error handling for API failures
- CORS configuration for frontend

### For Product Manager
- Professional UI ready for demo
- User experience flows completed
- Responsive design for all devices

---

## Notes

- All components are built with TypeScript for type safety
- Framer Motion provides smooth animations
- Tailwind CSS ensures consistent styling
- Error boundaries prevent crashes
- Loading states improve user experience

---

## Phase 8: Meeting Integration Frontend Features (NEW - 2-3 hours)

### Step 1: File Upload Component
Create `components/FileUpload.tsx` for handling audio/video/transcript file uploads with drag-and-drop interface.

### Step 2: Integration Dashboard Component  
Create `components/IntegrationDashboard.tsx` for managing Microsoft Teams, Zoom, and Google Calendar connections.

### Step 3: Live Recording Component
Create `components/LiveRecording.tsx` for real-time meeting recording with WebRTC.

### Step 4: Update Main Page
Add tab navigation to switch between manual input, file upload, live recording, and integrations.

### Step 5: Integration Testing
Test all file upload formats, live recording functionality, and integration connections.

### Success Criteria for Integration Features
- [ ] File upload supports audio, video, and transcript files
- [ ] Live recording works with microphone access
- [ ] Integration dashboard manages platform connections
- [ ] All components are responsive and accessible
- [ ] Error handling for upload failures
- [ ] Loading states during processing

---

**NEW: Meeting integration frontend features added. Focus on zero-cost solutions!**
