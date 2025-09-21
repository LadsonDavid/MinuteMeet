'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Video, 
  Users, 
  Settings, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Zap,
  Shield,
  Clock
} from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  features: string[]
}

export function IntegrationDashboard() {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Sync meeting schedules and details from Google Calendar',
      icon: Calendar,
      status: 'disconnected',
      features: ['Event sync', 'Meeting details', 'Attendee info', 'Automatic processing', 'Real-time updates']
    }
  ])

  const handleConnect = async (id: string) => {
    if (id !== 'calendar') return

    setConnecting(id)

    try {
      // Call backend to initiate Google OAuth flow
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/google/authorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to Google OAuth
        window.location.href = data.auth_url
      } else {
        const errorData = await response.json()
        if (errorData.error === 'Google OAuth not configured') {
          // Show detailed setup instructions
          const setupInstructions = errorData.setup_instructions
          const message = `
Google OAuth Setup Required:

${setupInstructions.step_1}
${setupInstructions.step_2}
${setupInstructions.step_3}
${setupInstructions.step_4}
${setupInstructions.step_5}

Add to your .env file:
GOOGLE_CLIENT_ID=${setupInstructions.env_vars.GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${setupInstructions.env_vars.GOOGLE_CLIENT_SECRET}
GOOGLE_REDIRECT_URI=${setupInstructions.env_vars.GOOGLE_REDIRECT_URI}

Then restart the backend server.
          `
          alert(message)
        } else {
          throw new Error(errorData.message || 'Failed to initiate Google OAuth')
        }
      }
    } catch (error) {
      console.error('Google Calendar connection error:', error)
      setConnecting(null)
      // Show error to user
      alert(`Failed to connect to Google Calendar: ${error.message}`)
    }
  }

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: 'disconnected' as const, lastSync: undefined }
          : integration
      )
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Google Calendar Integration</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect your Google Calendar to automatically import and process your meetings
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <integration.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                <ul className="space-y-1">
                  {integration.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {integration.lastSync && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-green-800">
                    <Clock className="w-4 h-4" />
                    <span>Last synced: {new Date(integration.lastSync).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                {integration.status === 'connected' ? (
                  <Button
                    variant="outline"
                    onClick={() => handleDisconnect(integration.id)}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnect(integration.id)}
                    disabled={connecting === integration.id}
                    className="flex-1"
                  >
                    {connecting === integration.id ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 mb-4">
                All integrations use OAuth 2.0 for secure authentication. Your data is encrypted 
                and never stored on our servers without your explicit consent.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>OAuth 2.0</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>GDPR compliant</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
