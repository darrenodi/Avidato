import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getYouTubeTranscript } from '@/lib/youtube-transcript'

/**
 * Lightweight endpoint that fetches ONLY the transcript text.
 * Used by the client-side flow: browser calls this → gets transcript →
 * sends transcript to /generate endpoint.
 *
 * This is separate from the full /generate endpoint so the client can
 * retry with manual transcript if server-side fetch fails.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const youtubeUrl = body.youtubeUrl?.trim()

    if (!youtubeUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })
    }

    const result = await getYouTubeTranscript(youtubeUrl)

    return NextResponse.json({
      videoId: result.videoId,
      transcriptText: result.transcriptText,
      language: result.language,
      durationSeconds: result.durationSeconds,
    })
  } catch (error) {
    console.error('Transcript fetch error:', error)
    const msg = error instanceof Error ? error.message : 'Failed to fetch transcript'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
