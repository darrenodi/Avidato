/**
 * YouTube Transcript Fetcher
 *
 * Two-method approach:
 *   1. Node.js (primary) — scrape ytInitialPlayerResponse from watch page,
 *      fetch caption XML/JSON3 directly. Works on any server.
 *   2. Python fallback — spawn youtube-transcript-api via child_process.
 *      Only used if Node.js method fails AND python3 is available.
 */

import { spawn } from 'child_process'
import path from 'path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TranscriptSegment {
  text: string
  start: number
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
const MAX_TRANSCRIPT_CHARS = 18_000
const PYTHON_TIMEOUT_MS = 30_000

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent': USER_AGENT,
  'Accept-Language': 'en-US,en;q=0.9',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

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
  kind?: string
}

// ===================================================================
// METHOD 1: Node.js — scrape watch page for caption tracks
// ===================================================================

async function fetchCaptionTracksFromWatchPage(videoId: string): Promise<CaptionTrack[]> {
  const url = `https://www.youtube.com/watch?v=${videoId}&hl=en`

  const res = await fetch(url, { headers: DEFAULT_HEADERS, cache: 'no-store' })
  if (!res.ok) throw new YouTubeTranscriptError(`YouTube watch page returned ${res.status}`)

  const html = await res.text()

  if (html.includes('action="https://consent.youtube.com/s"')) {
    throw new YouTubeTranscriptError('YouTube consent page — cannot extract transcript server-side.')
  }

  const match =
    html.match(/var\s+ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;\s*var\s/) ||
    html.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\})\s*;/)

  if (!match?.[1]) throw new YouTubeTranscriptError('Could not find player response in page HTML.')

  let player: Record<string, unknown>
  try {
    player = JSON.parse(match[1])
  } catch {
    throw new YouTubeTranscriptError('Failed to parse ytInitialPlayerResponse.')
  }

  const playability = player.playabilityStatus as Record<string, unknown> | undefined
  if (playability && playability.status !== 'OK') {
    throw new YouTubeTranscriptError((playability.reason as string) || 'Video is not playable')
  }

  const captions = player.captions as Record<string, unknown> | undefined
  const renderer = captions?.playerCaptionsTracklistRenderer as Record<string, unknown> | undefined
  const tracks = renderer?.captionTracks as CaptionTrack[] | undefined

  if (!tracks?.length) throw new YouTubeTranscriptError('No caption tracks found for this video.')

  return tracks.map((t) => ({
    baseUrl: t.baseUrl.replace(/\\u0026/g, '&').replace(/\\\//g, '/'),
    languageCode: t.languageCode || 'unknown',
    name: typeof t.name === 'object' ? ((t.name as { simpleText?: string }).simpleText ?? undefined) : undefined,
    kind: t.kind,
  }))
}

async function fetchCaptionTracksFromInnerTube(videoId: string): Promise<CaptionTrack[]> {
  const res = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
    method: 'POST',
    headers: { ...DEFAULT_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      context: { client: { clientName: 'WEB', clientVersion: '2.20260101.00.00', hl: 'en' } },
      videoId,
    }),
    cache: 'no-store',
  })

  if (!res.ok) throw new YouTubeTranscriptError(`InnerTube /player returned ${res.status}`)

  const data = (await res.json()) as Record<string, unknown>

  const playability = data.playabilityStatus as Record<string, unknown> | undefined
  if (playability && playability.status !== 'OK') {
    throw new YouTubeTranscriptError((playability.reason as string) || 'Video is not playable')
  }

  const captions = data.captions as Record<string, unknown> | undefined
  const renderer = captions?.playerCaptionsTracklistRenderer as Record<string, unknown> | undefined
  const tracks = renderer?.captionTracks as CaptionTrack[] | undefined

  if (!tracks?.length) throw new YouTubeTranscriptError('No caption tracks found via InnerTube.')

  return tracks.map((t) => ({
    baseUrl: t.baseUrl.replace(/\\u0026/g, '&').replace(/\\\//g, '/'),
    languageCode: t.languageCode || 'unknown',
    name: typeof t.name === 'object' ? ((t.name as { simpleText?: string }).simpleText ?? undefined) : undefined,
    kind: t.kind,
  }))
}

function pickBestTrack(tracks: CaptionTrack[]): CaptionTrack {
  return (
    tracks.find((t) => t.languageCode.startsWith('en') && t.kind !== 'asr') ||
    tracks.find((t) => t.languageCode.startsWith('en')) ||
    tracks.find((t) => t.kind !== 'asr') ||
    tracks[0]
  )
}

async function fetchSubtitleContent(track: CaptionTrack): Promise<TranscriptSegment[]> {
  // Try JSON3 first
  try {
    const res = await fetch(`${track.baseUrl}&fmt=json3`, { headers: DEFAULT_HEADERS, cache: 'no-store' })
    if (res.ok) {
      const text = await res.text()
      if (text.length > 0 && text.trimStart().startsWith('{')) {
        const segments = parseJson3(JSON.parse(text))
        if (segments.length > 0) return segments
      }
    }
  } catch { /* fall through */ }

  // Fallback: raw XML
  const res = await fetch(track.baseUrl, { headers: DEFAULT_HEADERS, cache: 'no-store' })
  if (!res.ok) throw new YouTubeTranscriptError(`Caption request returned ${res.status}`)

  const xml = await res.text()
  if (!xml) throw new YouTubeTranscriptError('Caption response was empty.')

  return parseSubtitleXML(xml)
}

function parseJson3(data: unknown): TranscriptSegment[] {
  const events = (data as {
    events?: Array<{ tStartMs?: number; dDurationMs?: number; segs?: Array<{ utf8?: string }> }>
  }).events
  if (!events?.length) return []

  const segments: TranscriptSegment[] = []
  for (const ev of events) {
    const text = (ev.segs || []).map((s) => s.utf8 || '').join('').replace(/\n/g, ' ').trim()
    if (!text) continue
    segments.push({ text: decodeHtmlEntities(text), start: (ev.tStartMs || 0) / 1000, duration: (ev.dDurationMs || 0) / 1000 })
  }
  return segments
}

function parseSubtitleXML(xml: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = []
  const regex = /<text\s+start="([^"]*?)"\s+dur="([^"]*?)"[^>]*>([\s\S]*?)<\/text>/g
  let m: RegExpExecArray | null
  while ((m = regex.exec(xml)) !== null) {
    const text = decodeHtmlEntities(m[3] || '').replace(/\n/g, ' ').trim()
    if (!text) continue
    segments.push({ text, start: parseFloat(m[1]) || 0, duration: parseFloat(m[2]) || 0 })
  }
  return segments
}

async function getTranscriptViaNodeJS(videoId: string): Promise<{ segments: TranscriptSegment[]; language: string }> {
  let tracks: CaptionTrack[]
  let lastErr: Error | undefined

  try {
    tracks = await fetchCaptionTracksFromWatchPage(videoId)
  } catch (e) {
    lastErr = e instanceof Error ? e : new Error(String(e))
    try {
      tracks = await fetchCaptionTracksFromInnerTube(videoId)
    } catch (e2) {
      throw new YouTubeTranscriptError(
        `Node.js: Watch page: ${lastErr.message}. InnerTube: ${e2 instanceof Error ? e2.message : String(e2)}`
      )
    }
  }

  const track = pickBestTrack(tracks)
  const segments = await fetchSubtitleContent(track)

  if (segments.length === 0) throw new YouTubeTranscriptError('Caption track returned no segments.')
  return { segments, language: track.languageCode }
}

// ===================================================================
// METHOD 2: Python fallback — youtube-transcript-api via child_process
// ===================================================================

interface PythonResult {
  videoId: string
  language: string
  segments: TranscriptSegment[]
  text: string
}

function getTranscriptViaPython(videoId: string): Promise<PythonResult> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'get_transcript.py')
    const proc = spawn('python3', [scriptPath, videoId])

    let stdout = ''
    let stderr = ''

    const timer = setTimeout(() => {
      proc.kill('SIGTERM')
      reject(new YouTubeTranscriptError('Python transcript script timed out.'))
    }, PYTHON_TIMEOUT_MS)

    proc.stdout.on('data', (d: Buffer) => { stdout += d.toString() })
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString() })

    proc.on('close', (code) => {
      clearTimeout(timer)
      if (code !== 0) {
        let msg = `Python exited with code ${code}`
        try {
          const err = JSON.parse(stderr.trim())
          if (err.error) msg = err.error
        } catch {
          if (stderr.trim()) msg = stderr.trim()
        }
        reject(new YouTubeTranscriptError(msg))
        return
      }
      try {
        resolve(JSON.parse(stdout.trim()) as PythonResult)
      } catch {
        reject(new YouTubeTranscriptError('Failed to parse Python script output.'))
      }
    })

    proc.on('error', (err) => {
      clearTimeout(timer)
      reject(new YouTubeTranscriptError(`Python not available: ${err.message}`))
    })
  })
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function getDurationSeconds(segments: TranscriptSegment[]): number {
  return segments.reduce((max, s) => Math.max(max, s.start + s.duration), 0)
}

function buildText(segments: TranscriptSegment[]): string {
  return segments.map((s) => s.text.replace(/\n/g, ' ').trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

function truncateTranscript(text: string, maxChars = MAX_TRANSCRIPT_CHARS): { text: string; isTruncated: boolean } {
  if (text.length <= maxChars) return { text, isTruncated: false }
  const half = Math.floor(maxChars / 2)
  return {
    text: `${text.slice(0, half)}\n\n[... transcript truncated for token limits ...]\n\n${text.slice(-half)}`,
    isTruncated: true,
  }
}

// ---------------------------------------------------------------------------
// Main export — Node.js first, Python fallback
// ---------------------------------------------------------------------------

export async function getYouTubeTranscript(input: string): Promise<YouTubeTranscriptResult> {
  const videoId = extractYouTubeVideoId(input)
  if (!videoId) throw new YouTubeTranscriptError('Invalid YouTube URL or video ID.')

  let segments: TranscriptSegment[]
  let language = 'en'
  let nodeError: string | undefined

  // Method 1: Node.js scraping
  try {
    const result = await getTranscriptViaNodeJS(videoId)
    segments = result.segments
    language = result.language
  } catch (e) {
    nodeError = e instanceof Error ? e.message : String(e)
    console.warn('Node.js transcript failed, trying Python fallback:', nodeError)

    // Method 2: Python fallback
    try {
      const pyResult = await getTranscriptViaPython(videoId)
      segments = pyResult.segments
      language = pyResult.language
    } catch (pyErr) {
      const pyMsg = pyErr instanceof Error ? pyErr.message : String(pyErr)
      throw new YouTubeTranscriptError(
        `All transcript methods failed. Node.js: ${nodeError}. Python: ${pyMsg}`
      )
    }
  }

  const rawText = buildText(segments)
  if (!rawText) throw new YouTubeTranscriptError('Transcript was empty after processing.')

  const { text, isTruncated } = truncateTranscript(rawText)

  return {
    videoId,
    sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
    transcriptText: text,
    segments,
    isTruncated,
    durationSeconds: getDurationSeconds(segments),
    language,
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
  return msg.includes('transcript') || msg.includes('caption')
}
