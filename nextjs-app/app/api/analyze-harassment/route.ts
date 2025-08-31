import { NextRequest, NextResponse } from 'next/server'

interface HarassmentAnalysis {
  isHarassment: boolean
  confidence: number
  harassmentType: string
  severity: 'low' | 'medium' | 'high'
  keywords: string[]
  description: string
  legalImplications: string
  recommendedActions: string[]
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

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text input is required' }, { status: 400 })
    }

    // Enhanced prompt for harassment analysis with legal punishment details
    const analysisPrompt = `You are an AI legal analyst specializing in Australian NSW law and harassment detection. Analyze the following text for potential harassment:

Text: "${text}"

Please analyze this text considering:
1. NSW Crimes Act 1900
2. NSW Anti-Discrimination Act 1977  
3. NSW Summary Offences Act 1988
4. Common law principles of harassment

Provide your analysis in this exact JSON format:
{
  "isHarassment": true/false,
  "confidence": 0.0-1.0,
  "harassmentType": "Verbal Harassment/Sexual Harassment/Stalking/Intimidation/None",
  "severity": "low/medium/high",
  "keywords": ["word1", "word2"],
  "description": "Brief analysis of why this is/isn't harassment",
  "legalImplications": "Specific NSW law implications",
  "recommendedActions": ["action1", "action2"],
  "punishmentRange": {
    "min": "Minimum penalty (e.g., $500 fine)",
    "max": "Maximum penalty (e.g., $100,000 compensation + 5 years imprisonment)",
    "details": "Detailed explanation of penalty range"
  },
  "lawSection": {
    "act": "Full name of the Act",
    "section": "Specific section number and title",
    "link": "Direct link to NSW legislation database",
    "description": "What this section covers"
  }
}

Focus on:
- Unwanted, offensive, or threatening behavior
- Sexual harassment and discrimination
- Stalking and intimidation
- Public order offenses
- NSW-specific legal context
- Exact punishment ranges and law sections

Be thorough but concise.`

    // Try to use Ollama for analysis
    let analysis: HarassmentAnalysis
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: analysisPrompt,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from Ollama')
      }

      const data = await response.json()
      const aiResponse = data.response?.trim() || ''

      // Try to parse the AI response as JSON
      try {
        // Extract JSON from the response (AI might add extra text)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        // Fallback to keyword-based analysis
        analysis = performFallbackAnalysis(text)
      }
    } catch (ollamaError) {
      console.error('Ollama not available, using fallback analysis:', ollamaError)
      // Use fallback analysis when Ollama is not available
      analysis = performFallbackAnalysis(text)
    }

    // Validate and clean the analysis
    analysis = validateAnalysis(analysis)

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Harassment analysis error:', error)
    
    // Return fallback analysis if everything fails
    const fallbackAnalysis = performFallbackAnalysis('')
    return NextResponse.json(fallbackAnalysis)
  }
}

function performFallbackAnalysis(text: string): HarassmentAnalysis {
  const lowerText = text.toLowerCase()
  
  // Enhanced keyword-based analysis with more comprehensive coverage
  const harassmentKeywords = [
    // Racial slurs and offensive terms
    'nigga', 'nigger', 'faggot', 'dyke', 'kike', 'spic', 'chink', 'gook', 'wetback',
    // General offensive language
    'slut', 'whore', 'bitch', 'cunt', 'fuck', 'shit', 'ass', 'dick', 'pussy',
    'bastard', 'motherfucker', 'fucker', 'dumbass', 'idiot', 'stupid', 'retard',
    // Threatening language
    'kill', 'hurt', 'beat', 'rape', 'attack', 'fight', 'punch', 'kick', 'stab',
    'gun', 'knife', 'weapon', 'danger', 'death', 'die', 'threat', 'intimidate',
    // Stalking and harassment
    'follow', 'stalk', 'watch', 'spy', 'harass', 'annoy', 'bother', 'scare', 'fear',
    // Sexual harassment
    'sexy', 'hot', 'beautiful', 'gorgeous', 'baby', 'honey', 'sweetheart',
    'kiss', 'touch', 'feel', 'body', 'curve', 'ass', 'boob', 'leg', 'breast',
    'penis', 'vagina', 'naked', 'strip', 'sex', 'sexual', 'porn', 'pornography'
  ]
  
  const sexualKeywords = [
    'sexy', 'hot', 'beautiful', 'gorgeous', 'baby', 'honey', 'sweetheart',
    'kiss', 'touch', 'feel', 'body', 'curve', 'ass', 'boob', 'leg', 'breast',
    'penis', 'vagina', 'naked', 'strip', 'sex', 'sexual', 'porn', 'pornography',
    'prostitute', 'hooker', 'escort', 'slut', 'whore', 'bitch'
  ]
  
  const threateningKeywords = [
    'kill', 'hurt', 'beat', 'rape', 'attack', 'fight', 'punch', 'kick', 'stab',
    'gun', 'knife', 'weapon', 'danger', 'death', 'die', 'threat', 'intimidate',
    'scare', 'fear', 'terrorize', 'bully', 'harass', 'annoy', 'bother'
  ]
  
  const racialKeywords = [
    'nigga', 'nigger', 'faggot', 'dyke', 'kike', 'spic', 'chink', 'gook', 'wetback',
    'coon', 'spook', 'jigaboo', 'jungle bunny', 'porch monkey', 'nappy head'
  ]
  
  let isHarassment = false
  let harassmentType = 'None'
  let severity: 'low' | 'medium' | 'high' = 'low'
  let confidence = 0.0
  let keywords: string[] = []
  
  // Count matches for different types
  const harassmentMatches = harassmentKeywords.filter(word => lowerText.includes(word)).length
  const sexualMatches = sexualKeywords.filter(word => lowerText.includes(word)).length
  const threateningMatches = threateningKeywords.filter(word => lowerText.includes(word)).length
  const racialMatches = racialKeywords.filter(word => lowerText.includes(word)).length
  
  // Determine harassment type and severity based on matches
  if (racialMatches > 0) {
    isHarassment = true
    harassmentType = 'Verbal Harassment (Racial)'
    severity = racialMatches > 1 ? 'high' : 'medium'
    confidence = Math.min(0.7 + (racialMatches * 0.1), 0.95)
    keywords = racialKeywords.filter(word => lowerText.includes(word))
  } else if (threateningMatches > 0) {
    isHarassment = true
    harassmentType = 'Intimidation'
    severity = threateningMatches > 2 ? 'high' : 'medium'
    confidence = Math.min(0.6 + (threateningMatches * 0.15), 0.9)
    keywords = threateningKeywords.filter(word => lowerText.includes(word))
  } else if (sexualMatches > 2) {
    isHarassment = true
    harassmentType = 'Sexual Harassment'
    severity = sexualMatches > 4 ? 'high' : 'medium'
    confidence = Math.min(0.5 + (sexualMatches * 0.1), 0.85)
    keywords = sexualKeywords.filter(word => lowerText.includes(word))
  } else if (harassmentMatches > 1) {
    isHarassment = true
    harassmentType = 'Verbal Harassment'
    severity = harassmentMatches > 3 ? 'medium' : 'low'
    confidence = Math.min(0.4 + (harassmentMatches * 0.1), 0.8)
    keywords = harassmentKeywords.filter(word => lowerText.includes(word))
  }
  
  // Additional context-based detection
  if (!isHarassment) {
    // Check for offensive context even without explicit keywords
    const offensiveContext = [
      'offended', 'uncomfortable', 'scared', 'threatened', 'harassed',
      'unwanted', 'inappropriate', 'disgusting', 'vulgar', 'rude'
    ]
    
    const contextMatches = offensiveContext.filter(word => lowerText.includes(word)).length
    if (contextMatches > 0) {
      isHarassment = true
      harassmentType = 'Verbal Harassment'
      severity = 'low'
      confidence = 0.3 + (contextMatches * 0.1)
      keywords = offensiveContext.filter(word => lowerText.includes(word))
    }
  }
  
  // Generate punishment range and law section based on harassment type
  const legalInfo = getLegalInfo(harassmentType)
  
  return {
    isHarassment,
    confidence,
    harassmentType,
    severity,
    keywords,
    description: isHarassment 
      ? `This text contains ${harassmentType.toLowerCase()} elements that may constitute harassment under NSW law. The content includes offensive language and/or threatening behavior.`
      : 'This text does not appear to contain clear harassment elements based on keyword analysis.',
    legalImplications: isHarassment
      ? `May violate NSW ${harassmentType.includes('Sexual') ? 'Anti-Discrimination Act 1977' : harassmentType.includes('Racial') ? 'Anti-Discrimination Act 1977' : 'Summary Offences Act 1988'}`
      : 'No immediate legal concerns identified.',
    recommendedActions: isHarassment
      ? ['Document the incident immediately', 'Consider reporting to authorities', 'Seek legal advice if needed', 'Contact Anti-Discrimination NSW if applicable']
      : ['Continue monitoring the situation', 'Document any escalation', 'Seek help if you feel unsafe'],
    punishmentRange: legalInfo.punishmentRange,
    lawSection: legalInfo.lawSection
  }
}

function getLegalInfo(harassmentType: string) {
  const legalInfoMap: Record<string, any> = {
    'Verbal Harassment (Racial)': {
      punishmentRange: {
        min: 'Apology and community service order',
        max: '$100,000 compensation + injunctions + community service',
        details: 'Racial vilification under Anti-Discrimination Act carries significant civil penalties including compensation for emotional distress, injunctions to prevent further harassment, and community service orders.'
      },
      lawSection: {
        act: 'Anti-Discrimination Act 1977 (NSW) - Act No. 48 of 1977',
        section: 'Section 20C - Racial Vilification',
        link: 'https://www.legislation.nsw.gov.au/view/html/inforce/current/act-1977-048#sec.20C',
        description: 'Prohibits public acts that incite hatred, serious contempt, or severe ridicule of a person or group on the ground of race. This includes verbal harassment, written material, and public displays that promote racial hatred.'
      }
    },
    'Sexual Harassment': {
      punishmentRange: {
        min: 'Apology and training requirements',
        max: '$100,000 compensation + injunctions + community service',
        details: 'Sexual harassment cases can result in significant compensation awards, injunctions to prevent future harassment, and mandatory training or community service orders.'
      },
      lawSection: {
        act: 'Anti-Discrimination Act 1977 (NSW) - Act No. 48 of 1977',
        section: 'Section 22A - Sexual Harassment',
        link: 'https://www.legislation.nsw.gov.au/view/html/inforce/current/act-1977-048#sec.22A',
        description: 'Prohibits unwelcome sexual advances, requests for sexual favors, or other conduct of a sexual nature that creates a hostile environment. Applies in employment, education, and provision of goods and services.'
      }
    },
    'Stalking': {
      punishmentRange: {
        min: 'Community service order + restraining order',
        max: '5 years imprisonment + $5,500 fine',
        details: 'Stalking offenses can range from community service and restraining orders for first-time offenders to significant imprisonment and fines for serious cases.'
      },
      lawSection: {
        act: 'Crimes Act 1900 (NSW) - Act No. 40 of 1900',
        section: 'Section 562AB - Stalking or Intimidation',
        link: 'https://www.legislation.nsw.gov.au/view/html/inforce/current/act-1900-040#sec.562AB',
        description: 'Criminalizes following, watching, or contacting someone repeatedly in a way that causes fear or apprehension. This includes cyberstalking and physical surveillance that creates reasonable fear.'
      }
    },
    'Intimidation': {
      punishmentRange: {
        min: 'Community service order + restraining order',
        max: '5 years imprisonment',
        details: 'Intimidation cases can result in community service and restraining orders for minor cases, escalating to imprisonment for serious threats causing fear of harm.'
      },
      lawSection: {
        act: 'Crimes Act 1900 (NSW) - Act No. 40 of 1900',
        section: 'Section 13 - Intimidation',
        link: 'https://www.legislation.nsw.gov.au/view/html/inforce/current/act-1900-040#sec.13',
        description: 'Criminalizes conduct that causes reasonable fear of physical or mental harm to another person. This includes threats, gestures, and behavior intended to intimidate or cause fear.'
      }
    },
    'Verbal Harassment': {
      punishmentRange: {
        min: 'Warning and apology',
        max: '$1,100 fine or 6 months imprisonment',
        details: 'Verbal harassment under Summary Offences Act can result in warnings for minor cases, escalating to fines and imprisonment for serious or repeated offenses.'
      },
      lawSection: {
        act: 'Summary Offences Act 1988 (NSW) - Act No. 25 of 1988',
        section: 'Section 4A - Offensive Conduct',
        link: 'https://www.legislation.nsw.gov.au/view/html/inforce/current/act-1988-025#sec.4A',
        description: 'Prohibits offensive conduct in or near a public place that causes or is likely to cause offense to reasonable persons. This includes verbal abuse, threatening language, and behavior that disturbs public order.'
      }
    }
  }
  
  return legalInfoMap[harassmentType] || legalInfoMap['Verbal Harassment']
}

function validateAnalysis(analysis: any): HarassmentAnalysis {
  return {
    isHarassment: Boolean(analysis.isHarassment),
    confidence: Math.max(0, Math.min(1, Number(analysis.confidence) || 0.5)),
    harassmentType: analysis.harassmentType || 'None',
    severity: ['low', 'medium', 'high'].includes(analysis.severity) ? analysis.severity : 'low',
    keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
    description: analysis.description || 'Analysis completed',
    legalImplications: analysis.legalImplications || 'Legal analysis pending',
    recommendedActions: Array.isArray(analysis.recommendedActions) ? analysis.recommendedActions : [],
    punishmentRange: analysis.punishmentRange || {
      min: 'Warning',
      max: 'Fine or imprisonment',
      details: 'Penalty depends on severity and circumstances'
    },
    lawSection: analysis.lawSection || {
      act: 'Relevant NSW Act',
      section: 'Specific section',
      link: 'https://www.legislation.nsw.gov.au/',
      description: 'Legal provision covering this offense'
    }
  }
}
