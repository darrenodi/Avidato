import { NextRequest, NextResponse } from 'next/server'

const VOICE_IDS = {
  narrator: 'pNInz6obpgDQGcFmaJgB',
  man1:     'CwhRBWXzGAHq8TQ4Fs17',
  man2:     'TX3LPaxmHKxFdv7VOQHJ',
  woman1:   'EXAVITQu4vr4xnSDxMaL',
  woman2:   'Xb7hH8MSUJpSbSDYk0k2',
  youngMan1:   'SOYHLrjzK2X1ezoPC6cr',
  youngWoman1: 'hpp4J3VqNfWAUOO0d1Us',
}

interface DialogueLine {
  speaker: string
  gender: 'male' | 'female' | 'narrator'
  text: string
}

function buildVoiceMap(lines: DialogueLine[], isKid: boolean): Map<string, string> {
  const voiceMap = new Map<string, string>()
  let maleCount = 0
  let femaleCount = 0

  for (const line of lines) {
    if (voiceMap.has(line.speaker)) continue

    if (line.gender === 'narrator') {
      voiceMap.set(line.speaker, VOICE_IDS.narrator)
    } else if (line.gender === 'male') {
      voiceMap.set(line.speaker, isKid ? VOICE_IDS.youngMan1 : maleCount % 2 === 0 ? VOICE_IDS.man1 : VOICE_IDS.man2)
      maleCount++
    } else {
      voiceMap.set(line.speaker, isKid ? VOICE_IDS.youngWoman1 : femaleCount % 2 === 0 ? VOICE_IDS.woman1 : VOICE_IDS.woman2)
      femaleCount++
    }
  }

  return voiceMap
}

async function fetchLineAudio(text: string, voiceId: string, apiKey: string): Promise<ArrayBuffer> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
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

  if (!res.ok) throw new Error(`ElevenLabs error ${res.status} for voice ${voiceId}`)
  return res.arrayBuffer()
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Audio not configured' }, { status: 503 })

  const body = await request.json()
  const lines: DialogueLine[] = body.lines
  const isKid: boolean = body.isKid ?? false

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: 'No dialogue lines provided' }, { status: 400 })
  }

  const voiceMap = buildVoiceMap(lines, isKid)

  // Generate all lines in parallel, stitch in original order
  const buffers = await Promise.all(
    lines.map(line => {
      const voiceId = voiceMap.get(line.speaker) ?? VOICE_IDS.narrator
      return fetchLineAudio(line.text, voiceId, apiKey)
    })
  )

  const totalBytes = buffers.reduce((sum, b) => sum + b.byteLength, 0)
  const stitched = new Uint8Array(totalBytes)
  let offset = 0
  for (const buf of buffers) {
    stitched.set(new Uint8Array(buf), offset)
    offset += buf.byteLength
  }

  return new NextResponse(stitched, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  })
}
