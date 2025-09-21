'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { Select } from './ui/Select'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { LoadingSpinner, ProcessingAnimation } from './LoadingSpinner'
import { ErrorBoundary } from './ErrorBoundary'
import { ApiService, MeetingData } from '../lib/api'
import { formatTime } from '../lib/utils'
import { 
  Loader2, 
  Upload, 
  Users, 
  Clock, 
  FileText, 
  Sparkles, 
  Brain, 
  Target,
  CheckCircle,
  X,
  Plus,
  Zap
} from 'lucide-react'

interface MeetingProcessorProps {
  onMeetingProcessed: (data: any) => void
  onProcessingStart: () => void
  isProcessing: boolean
}

export function MeetingProcessor({ onMeetingProcessed, onProcessingStart, isProcessing }: MeetingProcessorProps) {
  const [formData, setFormData] = useState({
    title: '',
    transcript: '',
    participants: [] as string[],
    meetingType: 'general',
    duration: 60
  })
  const [participantInput, setParticipantInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    onProcessingStart()

    try {
      const meetingData: MeetingData = {
        title: formData.title,
        transcript: formData.transcript,
        participants: formData.participants,
        meeting_type: formData.meetingType,
        duration: formData.duration
      }

      const data = await ApiService.processMeeting(meetingData)
      onMeetingProcessed(data)
    } catch (error) {
      console.error('Error processing meeting:', error)
      setError(error instanceof Error ? error.message : 'Failed to process meeting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addParticipant = () => {
    if (participantInput.trim() && !formData.participants.includes(participantInput.trim())) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, participantInput.trim()]
      }))
      setParticipantInput('')
    }
  }

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addParticipant()
    }
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Process Your Meeting
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your meeting transcript and let AI extract insights, action items, and tasks
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <X className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Meeting Title
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Q4 Budget Planning Meeting"
                  required
                  className="h-12 text-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Meeting Type
                </label>
                <Select
                  value={formData.meetingType}
                  onChange={(e) => handleInputChange('meetingType', e.target.value)}
                >
                  <option value="general">General Meeting</option>
                  <option value="budget">Budget Planning</option>
                  <option value="planning">Project Planning</option>
                  <option value="retrospective">Retrospective</option>
                  <option value="client">Client Meeting</option>
                </Select>
              </motion.div>
            </div>

            {/* Participants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Participants
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add participant name"
                  className="flex-1 h-12"
                />
                <Button
                  type="button"
                  onClick={addParticipant}
                  variant="outline"
                  className="h-12 px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {formData.participants.map((participant, index) => (
                    <motion.div
                      key={participant}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="flex items-center gap-2 px-3 py-2 text-sm"
                      >
                        <Users className="w-4 h-4" />
                        {participant}
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="ml-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Duration
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    min="1"
                    max="480"
                    required
                    className="h-12 text-lg pr-16"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {formatTime(formData.duration)}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-end"
              >
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Character Count
                  </label>
                  <div className="h-12 flex items-center justify-center bg-gray-50 rounded-lg border">
                    <span className="text-2xl font-bold text-blue-600">
                      {formData.transcript.length.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-2">characters</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Transcript */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Meeting Transcript
              </label>
              <Textarea
                value={formData.transcript}
                onChange={(e) => handleInputChange('transcript', e.target.value)}
                placeholder="Paste your meeting transcript here..."
                rows={12}
                required
                className="resize-none text-base leading-relaxed"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting || isProcessing}
                className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isSubmitting || isProcessing ? (
                  <div className="flex items-center">
                    <ProcessingAnimation />
                    <span className="ml-3">Processing with AI...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="w-6 h-6 mr-3" />
                    <span>Process Meeting</span>
                    <Zap className="w-5 h-5 ml-3" />
                  </div>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Process Steps */}
          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Upload</h3>
              <p className="text-gray-600">Paste your meeting transcript</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Analyze</h3>
              <p className="text-gray-600">AI extracts insights & tasks</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Execute</h3>
              <p className="text-gray-600">Get actionable results</p>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    </ErrorBoundary>
  )
}
