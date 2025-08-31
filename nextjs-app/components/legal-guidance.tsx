'use client'

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

interface LegalGuidanceProps {
  analysisResult: AnalysisResult | null
}

export default function LegalGuidance({ analysisResult }: LegalGuidanceProps) {
  if (!analysisResult) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">⚖️</div>
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          No Analysis Results Yet
        </h4>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
          Use the AI Analysis section above to analyze your incident and receive comprehensive legal guidance.
        </p>
      </div>
    )
  }

  // Debug logging - remove this after fixing the issue
  console.log('Punishment Range Debug:', {
    min: analysisResult.punishmentRange.min,
    max: analysisResult.punishmentRange.max,
    fullRange: analysisResult.punishmentRange
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      case 'medium': return 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
      case 'high': return 'bg-slate-300 text-slate-900 border-slate-400 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-500'
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return '⚠️'
      case 'medium': return '⚡'
      case 'high': return '🚨'
      default: return 'ℹ️'
    }
  }

  return (
    <div className="space-y-8">
      {/* Analysis Summary */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Analysis Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {analysisResult.isHarassment ? '🚨' : '✅'}
              </span>
              <span className={`font-bold text-lg ${
                analysisResult.isHarassment ? 'text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'
              }`}>
                {analysisResult.isHarassment ? 'HARASSMENT DETECTED' : 'No Harassment Detected'}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <span className="text-slate-900 dark:text-white font-medium">
                Confidence: {Math.round(analysisResult.confidence * 100)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">{getSeverityIcon(analysisResult.severity)}</span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(analysisResult.severity)}`}>
                {analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)} Severity
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">🏷️</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {analysisResult.harassmentType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Harassment Details */}
      {analysisResult.isHarassment && (
        <>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Incident Details</h4>
            
            <div className="space-y-6">
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-white mb-3">Description</h5>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysisResult.description}</p>
              </div>
              
              <div>
                <h5 className="font-semibold text-slate-900 dark:text-white mb-3">Identified Keywords</h5>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Punishment Range */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Legal Consequences</h4>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h6 className="font-semibold text-slate-900 dark:text-white mb-2">Minimum Penalty</h6>
                  <p className="text-slate-700 dark:text-slate-300">{analysisResult.punishmentRange.min}</p>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h6 className="font-semibold text-slate-900 dark:text-white mb-2">Maximum Penalty</h6>
                  <p className="text-slate-700 dark:text-slate-300">{analysisResult.punishmentRange.max}</p>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h6 className="font-semibold text-slate-900 dark:text-white mb-2">Additional Details</h6>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysisResult.punishmentRange.details}</p>
              </div>
            </div>
          </div>

          {/* Law Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Relevant Legislation</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h6 className="font-semibold text-slate-900 dark:text-white mb-2">Full Act Name & Number</h6>
                <p className="text-slate-700 dark:text-slate-300 font-medium">{analysisResult.lawSection.act}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This is the official name you can search for if the link becomes unavailable
                </p>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h6 className="font-semibold text-slate-900 dark:text-white mb-2">Specific Section</h6>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">{analysisResult.lawSection.section}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  The exact section that applies to this type of harassment
                </p>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h6 className="font-semibold text-slate-900 dark:text-white mb-2">Legal Description</h6>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysisResult.lawSection.description}</p>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h6 className="font-semibold text-slate-900 dark:text-white mb-2">Official Legislation Link</h6>
                <a 
                  href={analysisResult.lawSection.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-semibold"
                >
                  View Full Law Section
                  <span className="text-sm">↗</span>
                </a>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Direct link to NSW legislation database
                </p>
              </div>
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Recommended Legal Actions</h4>
            
            <div className="space-y-6">
              {analysisResult.severity === 'high' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚨</span>
                    <div>
                      <h6 className="font-semibold text-red-800 dark:text-red-200 mb-2">Immediate Legal Action Required</h6>
                      <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                        Due to the high severity of this incident, immediate legal action is strongly recommended:
                      </p>
                      <ul className="text-red-700 dark:text-red-300 text-sm mt-2 space-y-1">
                        <li>• File a formal police report immediately</li>
                        <li>• Contact a legal professional for representation</li>
                        <li>• Consider applying for a restraining order</li>
                        <li>• Document all future incidents thoroughly</li>
                        <li>• This case may proceed to criminal court</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {analysisResult.severity === 'medium' && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h6 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Formal Complaint Recommended</h6>
                      <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                        This incident warrants formal legal action to prevent escalation:
                      </p>
                      <ul className="text-amber-700 dark:text-amber-300 text-sm mt-2 space-y-1">
                        <li>• File a formal complaint with relevant authorities</li>
                        <li>• Consider mediation or alternative dispute resolution</li>
                        <li>• May result in fines or community service orders</li>
                        <li>• Document any future incidents</li>
                        <li>• Seek legal advice if the behavior continues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {analysisResult.severity === 'low' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h6 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Warning & Education Approach</h6>
                      <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                        This incident may be resolved through less formal measures:
                      </p>
                      <ul className="text-blue-700 dark:text-blue-300 text-sm mt-2 space-y-1">
                        <li>• Consider a formal warning letter</li>
                        <li>• Request an apology and behavior change</li>
                        <li>• May involve educational programs or training</li>
                        <li>• Document the incident for future reference</li>
                        <li>• Escalate if the behavior persists</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h6 className="font-semibold text-slate-900 dark:text-white mb-3">General Legal Process</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h6 className="font-medium text-slate-700 dark:text-slate-300">For Civil Cases:</h6>
                    <ul className="text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                      <li>• File complaint with Anti-Discrimination NSW</li>
                      <li>• May result in compensation orders</li>
                      <li>• Can include injunctions and training requirements</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-slate-700 dark:text-slate-300">For Criminal Cases:</h6>
                    <ul className="text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                      <li>• Police investigation and charges</li>
                      <li>• Court proceedings and sentencing</li>
                      <li>• May include fines, imprisonment, or community service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* General Legal Information */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">NSW Legal Framework</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="font-semibold text-slate-900 dark:text-white">Key Legislation</h5>
            <ul className="text-slate-700 dark:text-slate-300 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Crimes Act 1900 (NSW)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Anti-Discrimination Act 1977
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Summary Offences Act 1988
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Common Law Principles
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-slate-900 dark:text-white">Your Rights</h5>
            <ul className="text-slate-700 dark:text-slate-300 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Right to report incidents
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Protection from retaliation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Access to legal support
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                Confidentiality protection
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-slate-600 dark:text-slate-400 text-lg">⚠️</span>
          </div>
          <div>
            <h5 className="font-semibold text-slate-900 dark:text-white mb-2">Important Legal Notice</h5>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              This platform provides educational information only and does not constitute legal advice. 
              For specific legal guidance, consult with a qualified legal professional. In emergency 
              situations, contact NSW Police immediately at 000.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
