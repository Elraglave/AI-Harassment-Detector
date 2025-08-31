'use client'

import { useState } from 'react'

interface AnalysisResult {
  isHarassment: boolean
  confidence: number
  harassmentType: string
  severity: 'low' | 'medium' | 'high'
  keywords: string[]
  description: string
  punishmentRange: {
    min: string
    max: string
    details: string
  }
  lawSection: {
    act: string
    section: string
    link: string
    description: string
  }
}

interface IncidentAnalyzerProps {
  onAnalysisComplete: (result: AnalysisResult) => void
}

export default function IncidentAnalyzer({ onAnalysisComplete }: IncidentAnalyzerProps) {
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/analyze-harassment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result: AnalysisResult = await response.json()
      onAnalysisComplete(result)
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Failed to analyze text. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearText = () => {
    setText('')
    setError('')
  }

  return (
    <div className="space-y-8">
      {/* Text Input */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <label htmlFor="incident-text" className="block text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Incident Description
        </label>
        <textarea
          id="incident-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the incident or paste transcribed text here..."
          className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white resize-none transition-all duration-200"
          rows={6}
        />
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          Provide a detailed description of the incident for comprehensive analysis.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={analyzeText}
          disabled={isAnalyzing || !text.trim()}
          className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Analyzing...
            </>
          ) : (
            'Analyze Text'
          )}
        </button>
        
        <button
          onClick={clearText}
          className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 hover:border-slate-400 text-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:border-slate-500 font-semibold rounded-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Clear Text
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <p className="text-sm text-slate-700 dark:text-slate-300">{error}</p>
        </div>
      )}

      {/* Analysis Instructions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-slate-600 dark:text-slate-400 text-lg">💡</span>
          </div>
          <div>
            <h5 className="font-semibold text-slate-900 dark:text-white mb-3">Analysis Guidelines</h5>
            <ul className="text-slate-700 dark:text-slate-300 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Be specific about what was said or done
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Include any threats, slurs, or offensive language
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Mention the context and location if relevant
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Our AI will analyze against NSW legal standards
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Framework Info */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-slate-600 dark:text-slate-400 text-lg">⚖️</span>
          </div>
          <div>
            <h5 className="font-semibold text-slate-900 dark:text-white mb-3">Legal Analysis Framework</h5>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              Our analysis considers multiple NSW laws including the Crimes Act 1900, Anti-Discrimination Act 1977, 
              Summary Offences Act 1988, and relevant case law. The AI will assess severity, identify applicable 
              legal sections, and provide punishment ranges based on NSW legislation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
