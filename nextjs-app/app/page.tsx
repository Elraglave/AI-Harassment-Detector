'use client'

import { useState } from 'react'
import Image from 'next/image'
import VoiceRecorder from '@/components/voice-recorder'
import IncidentAnalyzer from '@/components/incident-analyzer'
import LegalGuidance from '@/components/legal-guidance'

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

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/90 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                NSW Anti-Harassment AI Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-base text-slate-600 dark:text-slate-400 font-medium">
                Unofficial Government Service
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/canberra_parliament_newsroom.jpg')`
            }}
          />
          {/* Fallback pattern if image fails to load */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-0 hover:opacity-100 transition-opacity duration-500"
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f8fafc;stop-opacity:0.9"/><stop offset="100%" style="stop-color:%23e2e8f0;stop-opacity:0.9"/></linearGradient><pattern id="b" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="scale(2)"><rect width="60" height="60" fill="%23f8fafc"/><path d="M0 0h60v60H0z" fill="%23e2e8f0"/><path d="M30 0v60M0 30h60" stroke="%23cbd5e1" stroke-width="1" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(%23a)"/><rect width="100%" height="100%" fill="url(%23b)"/></svg>')`
            }}
          />
          {/* Darker overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-slate-800/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 text-blue-800 text-base font-semibold mb-8 dark:bg-blue-900/40 dark:text-blue-300 shadow-sm">
              Incident Reporting & Legal Guidance
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight p-8 border-4 border-white/80 rounded-3xl bg-black/20 backdrop-blur-sm">
              Document Harassment
              <span className="block text-blue-600 mt-2">
                Understand Your Rights
              </span>
            </h1>
            <p className="text-2xl text-white mb-10 leading-relaxed max-w-4xl mx-auto">
              A comprehensive platform designed to assist citizens in documenting harassment incidents 
              and understanding their legal rights under NSW law. Built with AI-powered analysis and 
              comprehensive legal framework integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="https://www.police.nsw.gov.au/contact_us/report"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-10 py-5 bg-white hover:bg-gray-50 text-blue-600 font-bold text-lg rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-blue-600"
              >
                Report Incident
              </a>
              <a 
                href="https://legislation.nsw.gov.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-10 py-5 bg-white hover:bg-gray-50 text-slate-700 dark:text-slate-800 font-bold text-lg rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-slate-300 hover:border-slate-400"
              >
                Legal Resources
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Everything You Need for Incident Documentation
            </h2>
            <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              From voice recording to AI analysis and legal guidance, our platform provides comprehensive 
              tools to help you document and understand harassment incidents under NSW law.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <span className="text-4xl text-slate-600 dark:text-slate-400">🎙️</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Voice Recording
              </h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Record incidents in real-time with live transcription, or upload existing audio files 
                for analysis and documentation.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <span className="text-4xl text-slate-600 dark:text-slate-400">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                AI Analysis
              </h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Advanced AI-powered harassment detection with severity assessment, confidence scoring, 
                and keyword identification.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <span className="text-4xl text-slate-600 dark:text-slate-400">⚖️</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Legal Framework
              </h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Comprehensive NSW law guidance including relevant legislation, punishment ranges, 
                and direct links to official legal resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Interface */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 text-blue-800 text-base font-semibold mb-6 dark:bg-blue-900/40 dark:text-blue-300">
              🚀 Three-Step Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Report Your Incident
            </h2>
            <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Follow our streamlined process to document harassment incidents and receive comprehensive 
              legal guidance under NSW law.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Step 1: Incident Recording */}
            <div 
              className="relative group cursor-pointer"
              onClick={() => scrollToSection('incident-recording-section')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform group-hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <span className="text-white text-3xl font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Record Incident
                      </h3>
                      <p className="text-blue-100 text-sm mt-1">Voice & Audio Input</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Live speech transcription</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Audio file upload (MP3, WAV)</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Manual text input</span>
                    </div>
                  </div>
                </div>
              </div>
        </div>
        
            {/* Step 2: AI Analysis */}
            <div 
              className="relative group cursor-pointer"
              onClick={() => scrollToSection('ai-analysis-section')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform group-hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <span className="text-white text-3xl font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        AI Analysis
                      </h3>
                      <p className="text-green-100 text-sm mt-1">Smart Detection</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Harassment detection</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Severity assessment</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Confidence scoring</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          
            {/* Step 3: Legal Guidance */}
            <div 
              className="relative group cursor-pointer"
              onClick={() => scrollToSection('legal-guidance-section')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform group-hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <span className="text-white text-3xl font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Legal Guidance
                      </h3>
                      <p className="text-purple-100 text-sm mt-1">NSW Law Support</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Relevant legislation</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Punishment ranges</span>
              </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Legal resources</span>
              </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        
          {/* Interactive Components */}
          <div className="space-y-12">
            {/* Step 1: Incident Recording */}
            <div id="incident-recording-section" className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-8">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <span className="text-white text-4xl">🎙️</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      Record Incident Details
                    </h3>
                    <p className="text-blue-100 text-lg">
                      Use live transcription, upload audio files, or type manually
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-10">
                <VoiceRecorder />
              </div>
            </div>

            {/* Step 2: AI Analysis */}
            <div id="ai-analysis-section" className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-10 py-8">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <span className="text-white text-4xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      AI-Powered Analysis
                    </h3>
                    <p className="text-green-100 text-lg">
                      Advanced harassment detection with confidence scoring
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-10">
                <IncidentAnalyzer onAnalysisComplete={handleAnalysisComplete} />
              </div>
            </div>

            {/* Step 3: Legal Guidance */}
            <div id="legal-guidance-section" className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-10 py-8">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <span className="text-white text-4xl">⚖️</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      Legal Guidance & Resources
                    </h3>
                    <p className="text-purple-100 text-lg">
                      Comprehensive NSW law information and legal support
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-10">
                <LegalGuidance analysisResult={analysisResult} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Framework Information */}
      <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              NSW Legal Framework
            </h2>
            <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Our platform is built around comprehensive NSW legislation to ensure accurate legal 
              guidance and compliance with Australian law.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <a 
              href="https://legislation.nsw.gov.au/view/html/inforce/current/act-1900-040"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors">
                <span className="text-3xl text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">📋</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Crimes Act 1900</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Criminal offenses and penalties</p>
              <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view legislation ↗
              </div>
            </a>

            <a 
              href="https://legislation.nsw.gov.au/view/html/inforce/current/act-1977-048"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-100 dark:group-hover:bg-green-900/20 transition-colors">
                <span className="text-3xl text-slate-600 dark:text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Anti-Discrimination Act 1977</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Discrimination and harassment</p>
              <div className="mt-4 text-green-600 dark:text-green-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view legislation ↗
              </div>
            </a>

            <a 
              href="https://legislation.nsw.gov.au/view/html/inforce/current/act-1988-025"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/20 transition-colors">
                <span className="text-3xl text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">⚖️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Summary Offences Act 1988</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Minor offenses and public order</p>
              <div className="mt-4 text-purple-600 dark:text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view legislation ↗
              </div>
            </a>

            <a 
              href="https://supremecourt.nsw.gov.au/about-us/common-law-division.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/20 transition-colors">
                <span className="text-3xl text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400">📚</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Common Law</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Precedent-based legal principles</p>
              <div className="mt-4 text-amber-600 dark:text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view information ↗
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-16 text-center shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              Ready to Report an Incident?
            </h2>
            <p className="text-2xl text-blue-100 mb-10 max-w-4xl mx-auto leading-relaxed">
              This unofficial government platform helps you document harassment incidents, understand 
              your legal rights, and take appropriate action under NSW law. Your safety and legal 
              protection are our priority.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="https://www.police.nsw.gov.au/contact_us/report"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-xl transition-all duration-300 hover:bg-blue-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Report Incident
              </a>
              <a 
                href="https://legislation.nsw.gov.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-10 py-5 border-3 border-white text-white font-bold text-lg rounded-xl transition-all duration-300 hover:bg-white hover:text-blue-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                View Legal Resources
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Information */}
      <section className="py-20 sm:py-28 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h4 className="text-xl font-bold mb-6">Emergency Contacts</h4>
              <div className="space-y-3 text-slate-300 text-lg">
                <p><strong>Police:</strong> 000 (Emergency)</p>
                <p><strong>Crime Stoppers:</strong> 1800 333 000</p>
                <p><strong>1800RESPECT:</strong> 1800 737 732</p>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h4 className="text-xl font-bold mb-6">Legal Resources</h4>
              <div className="space-y-3 text-slate-300 text-lg">
                <p><strong>Legal Aid NSW:</strong> 1300 888 529</p>
                <p><strong>Anti-Discrimination NSW:</strong> 1800 670 812</p>
                <p><strong>NSW Police:</strong> 131 444</p>
          </div>
        </div>
        
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h4 className="text-xl font-bold mb-6">Important Notice</h4>
              <p className="text-slate-300 leading-relaxed text-lg">
                This platform provides educational information only and does not constitute legal advice. 
                For specific legal guidance, consult with a qualified legal professional.
              </p>
          </div>
        </div>
      </div>
      </section>
    </div>
  )
} 