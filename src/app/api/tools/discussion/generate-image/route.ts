import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface GenerateImageRequest {
  topic: string
  context?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json()
    const { topic, context } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const prompt = `Create a professional, educational illustration for an English language learning classroom about: "${topic}"
${context ? `Additional context: ${context}` : ''}

Requirements:
- Visually engaging and appropriate for language learners
- Clear, colorful, and high quality
- Educational and informative
- Suitable for classroom use
- No text or words in the image`

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    })

    if (!response.data || response.data.length === 0) {
      throw new Error('No image was generated')
    }

    const imageUrl = response.data[0].url
    if (!imageUrl) {
      throw new Error('Generated image has no URL')
    }

    return NextResponse.json({
      topic,
      imageUrl,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate image',
      },
      { status: 500 }
    )
  }
}
