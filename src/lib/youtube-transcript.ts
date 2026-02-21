/**
 * YouTube Transcript Fetcher
 *
 * Self-contained implementation with zero third-party YouTube dependencies.
 * Fetches transcripts by scraping the YouTube watch page for the embedded
 * player response, extracting caption track URLs, and fetching the subtitle XML.
 *
 * Fallback order:
 *   1. ytInitialPlayerResponse from watch page HTML → caption track XML
 *   2. InnerTube /player API → caption track XML
 *
 * Both methods ultimately fetch the same XML caption files.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TranscriptSegment {
  text: string
  /** Start time in seconds */
  start: number
  /** Duration in seconds */
  duration: number
}

export interface YouTubeTranscriptResult {
  videoId: string
  sourceUrl: string
  transcriptText: string
  segments: TranscriptSegment[]
  isTruncated: boolean
  durationSeconds: number
  language: string
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class YouTubeTranscriptError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'YouTubeTranscriptError'
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent': USER_AGENT,
  'Accept-Language': 'en-US,en;q=0.9',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

const MAX_TRANSCRIPT_CHARS = 18_000

// ---------------------------------------------------------------------------
// Video ID extraction
// ---------------------------------------------------------------------------

export function extractYouTubeVideoId(input: string): string | null {
  const value = input.trim()

  if (YOUTUBE_ID_REGEX.test(value)) return value

  try {
    const parsed = new URL(value)
    const host = parsed.hostname.toLowerCase()

    if (host.includes('youtube.com')) {
      const v = parsed.searchParams.get('v')
      if (v && YOUTUBE_ID_REGEX.test(v)) return v

      const parts = parsed.pathname.split('/').filter(Boolean)
      const idx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'live')
      if (idx !== -1 && parts[idx + 1] && YOUTUBE_ID_REGEX.test(parts[idx + 1])) {
        return parts[idx + 1]
      }
    }

    if (host.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim()
      if (YOUTUBE_ID_REGEX.test(id)) return id
    }
  } catch {
    return null
  }

  return null
}

// ---------------------------------------------------------------------------
// HTML entity decoding
// ---------------------------------------------------------------------------

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

// ---------------------------------------------------------------------------
// Caption track types
// ---------------------------------------------------------------------------

interface CaptionTrack {
  baseUrl: string
  languageCode: string
  name?: string
  kind?: string // "asr" = auto-generated
}

// ---------------------------------------------------------------------------
// Method 1: Scrape ytInitialPlayerResponse from the watch page
// ---------------------------------------------------------------------------

async function fetchCaptionTracksFromWatchPage(videoId: string): Promise<CaptionTrack[]> {
  const url = `https://www.youtube.com/watch?v=${videoId}&hl=en`

  const res = await fetch(url, {
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new YouTubeTranscriptError(`YouTube watch page returned ${res.status}`)
  }

  const html = await res.text()

  // Handle consent page (GDPR)
  if (html.includes('action="https://consent.youtube.com/s"')) {
    throw new YouTubeTranscriptError(
      'YouTube consent page encountered — cannot extract transcript from server.'
    )
  }

  // Extract ytInitialPlayerResponse — try multiple patterns
  const match =
    html.match(/var\s+ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;\s*var\s/) ||
    html.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\})\s*;/)

  if (!match?.[1]) {
    throw new YouTubeTranscriptError('Could not find player response in watch page HTML.')
  }

  let playerResponse: Record<string, unknown>
  try {
    playerResponse = JSON.parse(match[1])
  } catch {
    throw new YouTubeTranscriptError('Failed to parse ytInitialPlayerResponse JSON.')
  }

  // Check playability
  const playability = playerResponse.playabilityStatus as Record<string, unknown> | undefined
  if (playability && playability.status !== 'OK') {
    const reason = (playability.reason as string) || 'Video is not playable'
    throw new YouTubeTranscriptError(reason)
  }

  const captions = playerResponse.captions as Record<string, unknown> | undefined
  const renderer = captions?.playerCaptionsTracklistRenderer as Record<string, unknown> | undefined
  const tracks = renderer?.captionTracks as CaptionTrack[] | undefined

  if (!tracks || tracks.length === 0) {
    throw new YouTubeTranscriptError('No caption tracks found for this video.')
  }

  return tracks.map((t) => ({
    baseUrl: t.baseUrl.replace(/\\u0026/g, '&').replace(/\\\//g, '/'),
    languageCode: t.languageCode || 'unknown',
    name:
      typeof t.name === 'object'
        ? ((t.name as { simpleText?: string }).simpleText ?? undefined)
        : undefined,
    kind: t.kind,
  }))
}

// ---------------------------------------------------------------------------
// Method 2: InnerTube /player API
// ---------------------------------------------------------------------------

async function fetchCaptionTracksFromInnerTube(videoId: string): Promise<CaptionTrack[]> {
  const body = {
    context: {
      client: {
        clientName: 'WEB',
        clientVersion: '2.20260101.00.00',
        hl: 'en',
      },
    },
    videoId,
  }

  const res = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new YouTubeTranscriptError(`InnerTube /player returned ${res.status}`)
  }

  const data = (await res.json()) as Record<string, unknown>

  const playability = data.playabilityStatus as Record<string, unknown> | undefined
  if (playability && playability.status !== 'OK') {
    const reason = (playability.reason as string) || 'Video is not playable'
    throw new YouTubeTranscriptError(reason)
  }

  const captions = data.captions as Record<string, unknown> | undefined
  const renderer = captions?.playerCaptionsTracklistRenderer as Record<string, unknown> | undefined
  const tracks = renderer?.captionTracks as CaptionTrack[] | undefined

  if (!tracks || tracks.length === 0) {
    throw new YouTubeTranscriptError('No caption tracks found via InnerTube.')
  }

  return tracks.map((t) => ({
    baseUrl: t.baseUrl.replace(/\\u0026/g, '&').replace(/\\\//g, '/'),
    languageCode: t.languageCode || 'unknown',
    name:
      typeof t.name === 'object'
        ? ((t.name as { simpleText?: string }).simpleText ?? undefined)
        : undefined,
    kind: t.kind,
  }))
}

// ---------------------------------------------------------------------------
// Pick the best caption track (prefer manual English → any English → first)
// ---------------------------------------------------------------------------

function pickBestTrack(tracks: CaptionTrack[]): CaptionTrack {
  return (
    tracks.find((t) => t.languageCode.startsWith('en') && t.kind !== 'asr') ||
    tracks.find((t) => t.languageCode.startsWith('en')) ||
    tracks.find((t) => t.kind !== 'asr') ||
    tracks[0]
  )
}

// ---------------------------------------------------------------------------
// Fetch + parse subtitle content into segments
// ---------------------------------------------------------------------------

async function fetchSubtitleContent(track: CaptionTrack): Promise<TranscriptSegment[]> {
  // Try JSON3 first — more reliable than XML
  const json3Url = `${track.baseUrl}&fmt=json3`

  try {
    const res = await fetch(json3Url, {
      headers: DEFAULT_HEADERS,
      cache: 'no-store',
    })

    if (res.ok) {
      const text = await res.text()
      if (text.length > 0) {
        // Might be JSON or XML depending on YouTube's mood
        if (text.trimStart().startsWith('{')) {
          const segments = parseJson3Response(JSON.parse(text))
          if (segments.length > 0) return segments
        }
      }
    }
  } catch {
    // Fall through to plain XML
  }

  // Fallback: fetch raw XML subtitle file
  const res = await fetch(track.baseUrl, {
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new YouTubeTranscriptError(`Caption request returned ${res.status}`)
  }

  const xml = await res.text()
  if (!xml || xml.length === 0) {
    throw new YouTubeTranscriptError('Caption response was empty.')
  }

  return parseSubtitleXML(xml)
}

function parseJson3Response(data: unknown): TranscriptSegment[] {
  const events = (
    data as {
      events?: Array<{
        tStartMs?: number
        dDurationMs?: number
        segs?: Array<{ utf8?: string }>
      }>
    }
  ).events

  if (!events?.length) return []

  const segments: TranscriptSegment[] = []

  for (const event of events) {
    const text = (event.segs || [])
      .map((s) => s.utf8 || '')
      .join('')
      .replace(/\n/g, ' ')
      .trim()

    if (!text) continue

    segments.push({
      text: decodeHtmlEntities(text),
      start: (event.tStartMs || 0) / 1000,
      duration: (event.dDurationMs || 0) / 1000,
    })
  }

  return segments
}

function parseSubtitleXML(xml: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = []
  const regex = /<text\s+start="([^"]*?)"\s+dur="([^"]*?)"[^>]*>([\s\S]*?)<\/text>/g

  let m: RegExpExecArray | null
  while ((m = regex.exec(xml)) !== null) {
    const text = decodeHtmlEntities(m[3] || '')
      .replace(/\n/g, ' ')
      .trim()
    if (!text) continue

    segments.push({
      text,
      start: parseFloat(m[1]) || 0,
      duration: parseFloat(m[2]) || 0,
    })
  }

  return segments
}

// ---------------------------------------------------------------------------
// Normalize + truncate
// ---------------------------------------------------------------------------

function buildTranscriptText(segments: TranscriptSegment[]): string {
  return segments
    .map((s) => s.text.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getDurationSeconds(segments: TranscriptSegment[]): number {
  return segments.reduce((max, s) => {
    const end = s.start + s.duration
    return end > max ? end : max
  }, 0)
}

function truncateTranscript(
  text: string,
  maxChars = MAX_TRANSCRIPT_CHARS
): { text: string; isTruncated: boolean } {
  if (text.length <= maxChars) return { text, isTruncated: false }

  const half = Math.floor(maxChars / 2)
  return {
    text: `${text.slice(0, half)}\n\n[... transcript truncated for token limits ...]\n\n${text.slice(-half)}`,
    isTruncated: true,
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function getYouTubeTranscript(input: string): Promise<YouTubeTranscriptResult> {
  const videoId = extractYouTubeVideoId(input)
  if (!videoId) {
    throw new YouTubeTranscriptError('Invalid YouTube URL or video ID.')
  }

  // Try to get caption tracks — watch page first, then InnerTube fallback
  let tracks: CaptionTrack[]
  let lastError: Error | undefined

  try {
    tracks = await fetchCaptionTracksFromWatchPage(videoId)
  } catch (e) {
    lastError = e instanceof Error ? e : new Error(String(e))
    try {
      tracks = await fetchCaptionTracksFromInnerTube(videoId)
    } catch (e2) {
      const msg1 = lastError.message
      const msg2 = e2 instanceof Error ? e2.message : String(e2)
      throw new YouTubeTranscriptError(
        `Could not get caption tracks. Watch page: ${msg1}. InnerTube: ${msg2}`
      )
    }
  }

  const track = pickBestTrack(tracks)

  // Fetch the actual subtitle content
  const segments = await fetchSubtitleContent(track)

  if (segments.length === 0) {
    throw new YouTubeTranscriptError('Caption track returned no transcript segments.')
  }

  const rawText = buildTranscriptText(segments)
  if (!rawText) {
    throw new YouTubeTranscriptError('Transcript was empty after processing.')
  }

  const { text, isTruncated } = truncateTranscript(rawText)
  const durationSeconds = getDurationSeconds(segments)

  return {
    videoId,
    sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
    transcriptText: text,
    segments,
    isTruncated,
    durationSeconds,
    language: track.languageCode,
  }
}

// ---------------------------------------------------------------------------
// Error type guard
// ---------------------------------------------------------------------------

export function isTranscriptUnavailableError(error: unknown): boolean {
  if (error instanceof YouTubeTranscriptError) return true
  if (!error || typeof error !== 'object') return false

  const e = error as { name?: string; message?: string }
  if (e.name === 'YouTubeTranscriptError') return true

  const msg = (e.message || '').toLowerCase()
  return (
    msg.includes('no caption tracks') ||
    msg.includes('no transcript') ||
    msg.includes('transcript') ||
    msg.includes('caption')
  )
}
