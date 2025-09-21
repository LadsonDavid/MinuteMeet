'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MeetingProcessor } from '../components/MeetingProcessor'
import { MeetingResults } from '../components/MeetingResults'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ApiService, ProcessedMeeting } from '@/lib/api'
import { 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react'

export default function Home() {
  const [meetingData, setMeetingData] = useState<ProcessedMeeting | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    // Check backend health on mount (client-side only)
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

    // Only run on client side
    if (typeof window !== 'undefined') {
      checkBackend()
    } else {
      setIsLoading(false)
      setBackendStatus('online') // Assume online for SSR
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
        <LoadingSpinner size="lg" text="Initializing MinuteMeet..." />
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
        
        <div className="container mx-auto px-4 py-6">
          {/* Simple Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI Meeting Summarizer
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your meetings with AI-powered summarization and action item extraction
            </p>
          </motion.div>

          {/* Main Content */}
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

        </div>

        <Footer />
      </main>
    </ErrorBoundary>
  )
}
