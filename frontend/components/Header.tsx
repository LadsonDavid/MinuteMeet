'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Users, Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MinuteMeet</h1>
              <p className="text-sm text-gray-600 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Meeting Summarizer
              </p>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-2 text-sm text-gray-600 bg-yellow-50 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">AI-Powered</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Enterprise Ready</span>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden mt-4 ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}
