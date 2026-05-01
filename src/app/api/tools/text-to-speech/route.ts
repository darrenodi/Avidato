import { NextRequest, NextResponse } from 'next/server'

const VOICE_ID = '6OzrBCQf8cjERkYgzSg8'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Audio not configured' }, { status: 503 })

    const body = await request.json()
    const text: string = body.text?.trim()

    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    if (text.length > 5000) return NextResponse.json({ error: 'Text too long (max 5000 characters)' }, { status: 400 })

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('ElevenLabs TTS error:', res.status, detail)
      return NextResponse.json({ error: `ElevenLabs error ${res.status}` }, { status: 502 })
    }

    const audio = await res.arrayBuffer()

    return new NextResponse(audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('TTS error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate audio' },
      { status: 500 }
    )
  }
}
