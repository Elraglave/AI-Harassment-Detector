import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!openaiApiKey) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        transcription: `Audio file "${audioFile.name}" uploaded successfully.\n\nPlease listen to this ${(audioFile.size / 1024 / 1024).toFixed(2)}MB audio file and describe what you heard for incident reporting.\n\nInclude:\n• What was said or done\n• Any threats or offensive language\n• Context and location if relevant\n• Your emotional response\n\nThis manual description will be used for AI analysis and legal guidance.`
      })
    }

    // Create a new FormData for OpenAI API (they expect a file, not base64)
    const openaiFormData = new FormData()
    
    // Convert the File to a Blob and append it
    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type })
    openaiFormData.append('file', audioBlob, audioFile.name)
    openaiFormData.append('model', 'whisper-1')
    openaiFormData.append('response_format', 'text')
    openaiFormData.append('language', 'en')
    openaiFormData.append('prompt', 'This is an incident report recording. Please transcribe exactly what is said, including any offensive language, threats, or harassment content. Do not censor or modify the content.')
    
    // Call OpenAI Whisper API with proper file upload
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        // Don't set Content-Type here - let the browser set it with the boundary for FormData
      },
      body: openaiFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error:', errorData)
      
      // Fallback to manual input guidance
      return NextResponse.json({
        error: 'OpenAI transcription failed',
        transcription: `Audio file "${audioFile.name}" uploaded successfully.\n\nPlease listen to this ${(audioFile.size / 1024 / 1024).toFixed(2)}MB audio file and describe what you heard for incident reporting.\n\nInclude:\n• What was said or done\n• Any threats or offensive language\n• Context and location if relevant\n• Your emotional response\n\nThis manual description will be used for AI analysis and legal guidance.`
      })
    }

    const transcription = await response.text()
    
    if (!transcription || transcription.trim() === '') {
      return NextResponse.json({
        error: 'No transcription content received',
        transcription: `Audio file "${audioFile.name}" uploaded successfully.\n\nPlease listen to this ${(audioFile.size / 1024 / 1024).toFixed(2)}MB audio file and describe what you heard for incident reporting.\n\nInclude:\n• What was said or done\n• Any threats or offensive language\n• Context and location if relevant\n• Your emotional response\n\nThis manual description will be used for AI analysis and legal guidance.`
      })
    }

    return NextResponse.json({ 
      transcription: transcription.trim(),
      method: 'OpenAI Whisper',
      fileInfo: {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type
      }
    })

  } catch (error) {
    console.error('Whisper transcription error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process audio transcription',
        transcription: "Transcription failed due to server error. Please type your incident description manually.",
        method: "Error Fallback"
      },
      { status: 500 }
    )
  }
}
