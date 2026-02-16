import { YoutubeTranscript, type TranscriptResponse } from 'youtube-transcript'

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/

export interface YouTubeTranscriptResult {
  videoId: string
  sourceUrl: string
  transcriptText: string
  segments: TranscriptResponse[]
  isTruncated: boolean
  durationSeconds: number
}

function getTranscriptDurationSeconds(segments: TranscriptResponse[]): number {
  return segments.reduce((maxDuration, segment) => {
    const end = Number(segment.offset || 0) + Number(segment.duration || 0)
    return end > maxDuration ? end : maxDuration
  }, 0)
}

function normalizeTranscriptText(segments: TranscriptResponse[]): string {
  return segments
    .map((segment) => segment.text?.trim())
    .filter((text): text is string => Boolean(text))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateTranscript(text: string, maxChars = 18000): { text: string; isTruncated: boolean } {
  if (text.length <= maxChars) {
    return { text, isTruncated: false }
  }

  const half = Math.floor(maxChars / 2)
  const firstPart = text.slice(0, half)
  const lastPart = text.slice(text.length - half)

  return {
    text: `${firstPart}\n\n[... transcript truncated for token limits ...]\n\n${lastPart}`,
    isTruncated: true,
  }
}

export function extractYouTubeVideoId(input: string): string | null {
  const value = input.trim()

  if (YOUTUBE_ID_REGEX.test(value)) {
    return value
  }

  try {
    const parsed = new URL(value)
    const hostname = parsed.hostname.toLowerCase()

    if (hostname.includes('youtube.com')) {
      const videoIdFromQuery = parsed.searchParams.get('v')
      if (videoIdFromQuery && YOUTUBE_ID_REGEX.test(videoIdFromQuery)) {
        return videoIdFromQuery
      }

      const pathParts = parsed.pathname.split('/').filter(Boolean)
      const embedIndex = pathParts.findIndex((part) => part === 'embed' || part === 'shorts')
      if (embedIndex !== -1 && pathParts[embedIndex + 1] && YOUTUBE_ID_REGEX.test(pathParts[embedIndex + 1])) {
        return pathParts[embedIndex + 1]
      }
    }

    if (hostname.includes('youtu.be')) {
      const pathVideoId = parsed.pathname.replace('/', '').trim()
      if (YOUTUBE_ID_REGEX.test(pathVideoId)) {
        return pathVideoId
      }
    }
  } catch {
    return null
  }

  return null
}

export async function getYouTubeTranscript(input: string): Promise<YouTubeTranscriptResult> {
  const videoId = extractYouTubeVideoId(input)

  if (!videoId) {
    throw new Error('Invalid YouTube URL or video ID.')
  }

  const transcriptSegments = await YoutubeTranscript.fetchTranscript(videoId)

  if (!Array.isArray(transcriptSegments) || transcriptSegments.length === 0) {
    throw new Error('No transcript available for this video.')
  }

  const normalizedTranscript = normalizeTranscriptText(transcriptSegments)
  const durationSeconds = getTranscriptDurationSeconds(transcriptSegments)

  if (!normalizedTranscript) {
    throw new Error('Transcript was empty for this video.')
  }

  const { text, isTruncated } = truncateTranscript(normalizedTranscript)

  return {
    videoId,
    sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
    transcriptText: text,
    segments: transcriptSegments,
    isTruncated,
    durationSeconds,
  }
}
