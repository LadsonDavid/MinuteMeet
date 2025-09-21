'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Mic, Video, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface FileUploadProps {
  onFileUpload: (file: File, type: 'audio' | 'video' | 'transcript') => void
  isProcessing?: boolean
}

export function FileUpload({ onFileUpload, isProcessing = false }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<'audio' | 'video' | 'transcript' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError(null)
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    // Determine file type
    let detectedType: 'audio' | 'video' | 'transcript' | null = null
    
    if (['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'].includes(fileExtension || '')) {
      detectedType = 'audio'
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension || '')) {
      detectedType = 'video'
    } else if (['txt', 'doc', 'docx', 'pdf'].includes(fileExtension || '')) {
      detectedType = 'transcript'
    } else {
      setError('Unsupported file type. Please upload audio, video, or text files.')
      return
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size too large. Please upload files smaller than 100MB.')
      return
    }

    setUploadedFile(file)
    setFileType(detectedType)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setFileType(null)
    setError(null)
  }

  const processFile = () => {
    if (uploadedFile && fileType) {
      onFileUpload(uploadedFile, fileType)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Mic className="w-8 h-8 text-blue-600" />
      case 'video': return <Video className="w-8 h-8 text-purple-600" />
      case 'transcript': return <FileText className="w-8 h-8 text-green-600" />
      default: return <FileText className="w-8 h-8 text-gray-600" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'audio': return 'bg-blue-100 text-blue-800'
      case 'video': return 'bg-purple-100 text-purple-800'
      case 'transcript': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <Card className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Meeting File</h3>
          <p className="text-gray-600">
            Upload audio, video, or transcript files for AI processing
          </p>
        </div>

        {!uploadedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <motion.div
              animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drag and drop your file here
              </p>
              <p className="text-gray-600 mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                onChange={handleFileInput}
                accept=".mp3,.wav,.m4a,.aac,.ogg,.flac,.mp4,.avi,.mov,.wmv,.flv,.webm,.txt,.doc,.docx,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="mt-4">
                Choose File
              </Button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(fileType!)}
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(fileType!)}`}>
                  {fileType?.toUpperCase()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={processFile}
                disabled={isProcessing}
                className="flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Process File</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Supported formats: MP3, WAV, MP4, AVI, TXT, DOC, PDF (max 100MB)
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
