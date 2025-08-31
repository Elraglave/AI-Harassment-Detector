'use client'

import { useState, useRef, useEffect } from 'react'

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface VoiceRecorderProps {}

export default function VoiceRecorder({}: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      const recognition = recognitionRef.current
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setError('')
        console.log('Speech recognition started')
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setTranscription(prev => prev + ' ' + finalTranscript)
          setLiveTranscript('')
        } else {
          setLiveTranscript(interimTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setError(`Speech recognition error: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
        if (liveTranscript) {
          setTranscription(prev => prev + ' ' + liveTranscript)
          setLiveTranscript('')
        }
        console.log('Speech recognition ended')
      }
    }
  }, [isClient])

  const startLiveTranscription = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available')
      return
    }

    try {
      setTranscription('')
      setLiveTranscript('')
      recognitionRef.current.start()
    } catch (err) {
      console.error('Error starting speech recognition:', err)
      setError('Failed to start speech recognition')
    }
  }

  const stopLiveTranscription = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file')
      return
    }

    setIsProcessing(true)
    setError('')
    setUploadedFile(file)

    // Transcribe the uploaded file
    transcribeAudioFile(file)
  }

  const transcribeAudioFile = async (file: File) => {
    try {
      // Use OpenAI Whisper for real speech-to-text transcription
      await transcribeWithWhisper(file)
    } catch (err) {
      console.error('Whisper transcription failed:', err)
      // Fallback to manual input guidance
      setTranscription(`Audio file "${file.name}" uploaded successfully.\n\nPlease listen to this ${(file.size / 1024 / 1024).toFixed(2)}MB audio file and describe what you heard for incident reporting.\n\nInclude:\n• What was said or done\n• Any threats or offensive language\n• Context and location if relevant\n• Your emotional response\n\nThis manual description will be used for AI analysis and legal guidance.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const transcribeWithWhisper = async (file: File): Promise<void> => {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('audio', file)
      
      // Call our Whisper API endpoint
      const response = await fetch('/api/whisper-transcribe', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Whisper transcription failed')
      }
      
      const result = await response.json()
      
      if (result.transcription) {
        setTranscription(result.transcription)
      } else {
        throw new Error('No transcription received')
      }
    } catch (error) {
      console.error('Whisper API error:', error)
      throw error
    }
  }

  const analyzeAudioContent = (analysis: any, file: File): string => {
    const { duration, rms, dominantFreq, speechPatterns, channelCount } = analysis
    const fileName = file.name
    const fileSize = (file.size / 1024 / 1024).toFixed(2)
    
    let transcription = `Audio File: ${fileName} (${fileSize}MB)\n\n`
    transcription += `🔊 Audio Analysis Results:\n`
    transcription += `⏱️ Duration: ${duration.toFixed(1)} seconds\n`
    transcription += `📊 Channels: ${channelCount}\n`
    transcription += `🔊 Volume Level: ${rms > 0.1 ? 'High' : rms > 0.01 ? 'Medium' : 'Low'}\n`
    transcription += `🎵 Dominant Frequency: ${dominantFreq.toFixed(0)} Hz\n\n`
    
    if (speechPatterns.hasSpeech) {
      transcription += `🗣️ Speech Detected:\n`
      transcription += `• Speech segments: ${speechPatterns.speechSegments}\n`
      transcription += `• Silence segments: ${speechPatterns.silenceSegments}\n`
      transcription += `• Average segment length: ${speechPatterns.averageSegmentLength.toFixed(1)} samples\n\n`
      
      // Generate content based on speech characteristics
      if (speechPatterns.speechSegments > 5) {
        transcription += `📝 Content Analysis: This appears to be a conversation or detailed statement.\n`
        transcription += `Based on the speech patterns, it likely contains:\n`
        transcription += `• Multiple sentences or phrases\n`
        transcription += `• Natural speech rhythm\n`
        transcription += `• Clear articulation\n\n`
      } else if (speechPatterns.speechSegments > 2) {
        transcription += `📝 Content Analysis: This appears to be a brief statement or response.\n`
        transcription += `Based on the speech patterns, it likely contains:\n`
        transcription += `• A few sentences\n`
        transcription += `• Clear speech\n`
        transcription += `• Natural pauses\n\n`
      } else {
        transcription += `📝 Content Analysis: This appears to be a short utterance.\n`
        transcription += `Based on the speech patterns, it likely contains:\n`
        transcription += `• One or two phrases\n`
        transcription += `• Brief statement\n`
        transcription += `• Quick speech\n\n`
      }
    } else {
      transcription += `🔇 No clear speech patterns detected.\n`
      transcription += `This could be:\n`
      transcription += `• Background noise\n`
      transcription += `• Music or sounds\n`
      transcription += `• Very quiet speech\n\n`
    }
    
    transcription += `📋 Please listen to the audio and provide details:\n\n`
    transcription += `1️⃣ What was said or done:\n\n`
    transcription += `2️⃣ Context/Location:\n\n`
    transcription += `3️⃣ Any threats, slurs, or offensive language:\n\n`
    transcription += `4️⃣ How it made you feel:\n\n`
    transcription += `5️⃣ When this happened:\n\n`
    transcription += `This analysis will be combined with your description for AI harassment detection and legal guidance.`
    
    return transcription
  }

  const detectSpeechPatterns = (channel: Float32Array, sampleRate: number) => {
    const patterns = {
      hasSpeech: false,
      speechSegments: 0,
      silenceSegments: 0,
      averageSegmentLength: 0
    }
    
    // Simple speech detection based on amplitude variations
    const threshold = 0.01
    let currentSegment = 'silence'
    let segmentLength = 0
    const segments = []
    
    for (let i = 0; i < channel.length; i += Math.floor(sampleRate / 100)) { // Check every 10ms
      const amplitude = Math.abs(channel[i] || 0)
      const isSpeech = amplitude > threshold
      
      if (isSpeech !== (currentSegment === 'speech')) {
        if (segmentLength > 0) {
          segments.push({ type: currentSegment, length: segmentLength })
        }
        currentSegment = isSpeech ? 'speech' : 'silence'
        segmentLength = 1
      } else {
        segmentLength++
      }
    }
    
    // Add final segment
    if (segmentLength > 0) {
      segments.push({ type: currentSegment, length: segmentLength })
    }
    
    patterns.speechSegments = segments.filter(s => s.type === 'speech').length
    patterns.silenceSegments = segments.filter(s => s.type === 'silence').length
    patterns.hasSpeech = patterns.speechSegments > 0
    patterns.averageSegmentLength = segments.reduce((sum, s) => sum + s.length, 0) / segments.length
    
    return patterns
  }

  const generateTranscriptionFromAnalysis = (analysis: any, file: File): string => {
    const { duration, rms, dominantFreq, speechPatterns, channelCount } = analysis
    const fileName = file.name
    const fileSize = (file.size / 1024 / 1024).toFixed(2)
    
    let transcription = `Audio File: ${fileName} (${fileSize}MB)\n\n`
    transcription += `🔊 Audio Analysis Results:\n`
    transcription += `⏱️ Duration: ${duration.toFixed(1)} seconds\n`
    transcription += `📊 Channels: ${channelCount}\n`
    transcription += `🔊 Volume Level: ${rms > 0.1 ? 'High' : rms > 0.01 ? 'Medium' : 'Low'}\n`
    transcription += `🎵 Dominant Frequency: ${dominantFreq.toFixed(0)} Hz\n\n`
    
    if (speechPatterns.hasSpeech) {
      transcription += `🗣️ Speech Detected:\n`
      transcription += `• Speech segments: ${speechPatterns.speechSegments}\n`
      transcription += `• Silence segments: ${speechPatterns.silenceSegments}\n`
      transcription += `• Average segment length: ${speechPatterns.averageSegmentLength.toFixed(1)} samples\n\n`
      
      // Generate content based on speech characteristics
      if (speechPatterns.speechSegments > 5) {
        transcription += `📝 Content Analysis: This appears to be a conversation or detailed statement.\n`
        transcription += `Based on the speech patterns, it likely contains:\n`
        transcription += `• Multiple sentences or phrases\n`
        transcription += `• Natural speech rhythm\n`
        transcription += `• Clear articulation\n\n`
      } else if (speechPatterns.speechSegments > 2) {
        transcription += `📝 Content Analysis: This appears to be a brief statement or response.\n`
        transcription += `Based on the speech patterns, it likely contains:\n`
        transcription += `• A few sentences\n`
        transcription += `• Clear speech\n`
        transcription += `• Natural pauses\n\n`
      } else {
        transcription += `📝 Content Analysis: This appears to be a short utterance.\n`
        transcription += `Based on the speech patterns, it likely contains:\n`
        transcription += `• One or two phrases\n`
        transcription += `• Brief statement\n`
        transcription += `• Quick speech\n\n`
      }
    } else {
      transcription += `🔇 No clear speech patterns detected.\n`
      transcription += `This could be:\n`
      transcription += `• Background noise\n`
      transcription += `• Music or sounds\n`
      transcription += `• Very quiet speech\n\n`
    }
    
    transcription += `📋 Please listen to the audio and provide details:\n\n`
    transcription += `1️⃣ What was said or done:\n\n`
    transcription += `2️⃣ Context/Location:\n\n`
    transcription += `3️⃣ Any threats, slurs, or offensive language:\n\n`
    transcription += `4️⃣ How it made you feel:\n\n`
    transcription += `5️⃣ When this happened:\n\n`
    transcription += `This analysis will be combined with your description for AI harassment detection and legal guidance.`
    
    return transcription
  }

  const clearTranscription = () => {
    setTranscription('')
    setLiveTranscript('')
    setError('')
    setUploadedFile(null)
  }

  if (!isClient) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-10 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Live Speech Transcription */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Live Speech Transcription</h4>
          {isListening && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Recording...</span>
            </div>
        )}
      </div>

        {isListening && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-600 rounded-full animate-pulse"
                  style={{ 
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s` 
                  }}
                />
              ))}
          </div>
        </div>
      )}

        <div className="flex gap-3 mb-4">
          {!isListening ? (
              <button
              onClick={startLiveTranscription}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={isProcessing}
              >
              Start Live Transcription
              </button>
            ) : (
              <button
              onClick={stopLiveTranscription}
              className="inline-flex items-center px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
              Stop Transcription
              </button>
            )}
          </div>

        {liveTranscript && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">Live transcription:</p>
            <p className="text-slate-900 dark:text-white">{liveTranscript}</p>
          </div>
        )}
      </div>

      {/* File Upload */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upload Audio File</h4>
        
        {!uploadedFile ? (
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
              disabled={isProcessing}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Info */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 dark:text-blue-400 text-lg">🎵</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{uploadedFile.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type}
            </p>
          </div>
                </div>
                <button
                  onClick={() => {
                    setUploadedFile(null)
                    setTranscription('')
                    setError('')
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  ✕ Clear
                </button>
              </div>
            </div>
            
            {/* Processing Status */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Transcribing with OpenAI Whisper...
              </div>
            )}
          </div>
        )}
        
        {/* File Transcription Progress */}
        {isProcessing && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Transcribing with OpenAI Whisper...</span>
            </div>
            <div className="flex justify-center">
              <div className="flex items-center space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-blue-600 rounded-full animate-pulse"
                    style={{ 
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s` 
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center">
              Using OpenAI Whisper for high-accuracy speech-to-text transcription. Processing audio content in real-time.
            </p>
        </div>
      )}
      </div>

      {/* Current Transcription Display */}
      {transcription && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Current Transcription</h4>
            <button
              onClick={clearTranscription}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed">{transcription}</p>
          </div>
        </div>
      )}

      {/* Manual Transcription Input */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Manual Transcription Input</h4>
        <textarea
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          placeholder="Type or paste your incident description here..."
          className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white resize-none transition-all duration-200"
          rows={4}
        />
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          Use this area to manually type, edit, or paste your incident description.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <p className="text-sm text-slate-700 dark:text-slate-300">{error}</p>
        </div>
      )}

      {/* Legal Consent Notice */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-slate-600 dark:text-slate-400 text-lg">⚖️</span>
          </div>
          <div>
            <h5 className="font-semibold text-slate-900 dark:text-white mb-2">Legal Consent & Authorization</h5>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              By using this transcription service, you authorize the recording and analysis of audio content 
              for incident reporting and legal documentation purposes. This platform is designed to assist 
              with harassment incident documentation under NSW law.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden audio element for file playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
} 