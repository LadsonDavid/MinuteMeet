'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { ErrorBoundary } from './ErrorBoundary'
import { ProcessedMeeting, ActionItem } from '@/lib/api'
import { 
  getPriorityColor, 
  getHealthScoreColor, 
  getHealthScoreBg, 
  calculateROI,
  formatTime 
} from '@/lib/utils'
import { 
  CheckCircle, 
  Clock, 
  User, 
  TrendingUp, 
  Download, 
  Share2,
  ArrowLeft,
  Calendar,
  Target,
  Brain,
  Sparkles,
  BarChart3,
  Users,
  Zap,
  Star,
  AlertCircle,
  CheckCircle2,
  Circle,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react'

interface MeetingResultsProps {
  meetingData: ProcessedMeeting
  onNewMeeting: () => void
}

export function MeetingResults({ meetingData, onNewMeeting }: MeetingResultsProps) {
  const { summary, action_items, health_score, key_insights, next_steps, meeting_id } = meetingData
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'insights'>('overview')

  const roi = calculateROI(60, action_items.length) // Assuming 60 min meeting

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const exportResults = () => {
    const exportData = {
      meeting_id,
      summary,
      action_items,
      health_score,
      key_insights,
      next_steps,
      exported_at: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-${meeting_id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <ErrorBoundary>
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={onNewMeeting}
            variant="outline"
            className="flex items-center px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Meeting
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="flex items-center px-4 py-2"
              onClick={exportResults}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => copyToClipboard(summary)}
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy Summary'}
            </Button>
          </div>
        </motion.div>

        {/* Health Score Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`p-6 ${getHealthScoreBg(health_score)} border-0`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <motion.div
                    className={`text-2xl font-bold ${getHealthScoreColor(health_score)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  >
                    {health_score.toFixed(1)}
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Meeting Health Score</h3>
                  <p className="text-gray-600">
                    {health_score >= 8 ? 'Excellent meeting!' : 
                     health_score >= 6 ? 'Good meeting' : 'Needs improvement'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < Math.floor(health_score / 2) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex space-x-1 bg-gray-100 p-1 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'actions', label: 'Action Items', icon: Target },
            { id: 'insights', label: 'Insights', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Meeting Summary */}
              <Card className="p-8 shadow-lg border-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Meeting Summary</h2>
                    <p className="text-gray-600">AI-generated insights from your meeting</p>
                  </div>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">{summary}</p>
                </div>
              </Card>

              {/* ROI Metrics */}
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Meeting ROI</h2>
                    <p className="text-gray-600">Value generated from this meeting</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-4xl font-bold text-blue-600 mb-2">{roi.timeSaved}</div>
                    <p className="text-gray-600 font-medium">Time Saved</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-4xl font-bold text-green-600 mb-2">{roi.productivityBoost}</div>
                    <p className="text-gray-600 font-medium">Productivity Boost</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-4xl font-bold text-purple-600 mb-2">{roi.monthlyValue}</div>
                    <p className="text-gray-600 font-medium">Monthly Value</p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'actions' && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-lg border-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Action Items</h2>
                      <p className="text-gray-600">{action_items.length} tasks identified</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">
                    {action_items.length} items
                  </Badge>
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {action_items.map((item: ActionItem, index: number) => (
                      <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-6 rounded-r-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-3">{item.task}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                <span className="font-medium">{item.assignee}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{item.due_date}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="capitalize">{item.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge className={`${getPriorityColor(item.priority)} px-3 py-1`}>
                              {item.priority}
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Key Insights */}
              {key_insights && key_insights.length > 0 && (
                <Card className="p-8 shadow-lg border-0">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Key Insights</h2>
                      <p className="text-gray-600">{key_insights.length} insights discovered</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {key_insights.map((insight: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start p-4 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <CheckCircle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-lg">{insight}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Next Steps */}
              {next_steps && next_steps.length > 0 && (
                <Card className="p-8 shadow-lg border-0">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <ArrowRight className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Next Steps</h2>
                      <p className="text-gray-600">{next_steps.length} recommended actions</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {next_steps.map((step: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start p-4 bg-purple-50 rounded-lg border border-purple-200"
                      >
                        <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 text-lg">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  )
}
