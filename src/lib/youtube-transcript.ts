import { YoutubeTranscript, type TranscriptResponse } from 'youtube-transcript'

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/

class YouTubeTranscriptUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'YouTubeTranscriptUnavailableError'
  }
}

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

function normalizeCaptionUrl(baseUrl: string): string {
  return baseUrl
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
}

async function fetchTranscriptViaCaptionTracks(videoId: string): Promise<TranscriptResponse[]> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}&hl=en`
  const watchPageResponse = await fetch(watchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'text/html,application/xhtml+xml',
    },
    cache: 'no-store',
  })

  if (!watchPageResponse.ok) {
    throw new YouTubeTranscriptUnavailableError('Could not load YouTube watch page for transcript lookup.')
  }

  const watchPageHtml = await watchPageResponse.text()
  const playerResponseMatch = watchPageHtml.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\})\s*;/)

  if (!playerResponseMatch?.[1]) {
    throw new YouTubeTranscriptUnavailableError('Could not find player response for transcript extraction.')
  }

  let playerResponse: unknown
  try {
    playerResponse = JSON.parse(playerResponseMatch[1])
  } catch {
    throw new YouTubeTranscriptUnavailableError('Failed to parse YouTube player response JSON.')
  }

  const captions = (playerResponse as {
    captions?: {
      playerCaptionsTracklistRenderer?: {
        captionTracks?: Array<{ baseUrl: string; languageCode?: string }>
      }
    }
  }).captions?.playerCaptionsTracklistRenderer?.captionTracks

  if (!captions || captions.length === 0) {
    throw new YouTubeTranscriptUnavailableError('No captions tracks found for this video.')
  }

  const preferredTrack =
    captions.find((track) => track.languageCode?.toLowerCase().startsWith('en')) ?? captions[0]

  if (!preferredTrack?.baseUrl) {
    throw new YouTubeTranscriptUnavailableError('Caption track exists but has no usable transcript URL.')
  }

  const captionJsonUrl = `${normalizeCaptionUrl(preferredTrack.baseUrl)}&fmt=json3`
  const captionResponse = await fetch(captionJsonUrl, { cache: 'no-store' })

  if (!captionResponse.ok) {
    throw new YouTubeTranscriptUnavailableError('Failed to fetch caption payload from YouTube.')
  }

  let captionJson: unknown
  try {
    captionJson = await captionResponse.json()
  } catch {
    throw new YouTubeTranscriptUnavailableError('Caption payload was not valid JSON.')
  }

  const events = (captionJson as { events?: Array<{ tStartMs?: number; dDurationMs?: number; segs?: Array<{ utf8?: string }> }> }).events

  if (!events || events.length === 0) {
    throw new YouTubeTranscriptUnavailableError('Caption events are empty for this video.')
  }

  const transcriptSegments: TranscriptResponse[] = events
    .map((event) => {
      const text = (event.segs || [])
        .map((segment) => segment.utf8 || '')
        .join('')
        .replace(/\n/g, ' ')
        .trim()

      return {
        text: decodeHtmlEntities(text),
        offset: Number(event.tStartMs || 0) / 1000,
        duration: Number(event.dDurationMs || 0) / 1000,
      }
    })
    .filter((segment) => Boolean(segment.text))

  if (transcriptSegments.length === 0) {
    throw new YouTubeTranscriptUnavailableError('Caption events did not contain readable transcript text.')
  }

  return transcriptSegments
}

interface TimedTextTrack {
  langCode: string
  kind?: string
}

function parseTimedTextTracks(xml: string): TimedTextTrack[] {
  const trackRegex = /<track\b([^>]*?)\/?>(?:<\/track>)?/g
  const attrRegex = /(\w+)="([^"]*)"/g
  const tracks: TimedTextTrack[] = []

  let trackMatch: RegExpExecArray | null
  while ((trackMatch = trackRegex.exec(xml)) !== null) {
    const attrsRaw = trackMatch[1]
    const attrs: Record<string, string> = {}

    let attrMatch: RegExpExecArray | null
    while ((attrMatch = attrRegex.exec(attrsRaw)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2]
    }

    const langCode = attrs.lang_code
    if (!langCode) continue

    tracks.push({
      langCode,
      kind: attrs.kind,
    })
  }

  return tracks
}

function parseTimedTextTranscript(xml: string): TranscriptResponse[] {
  const textRegex = /<text\s+([^>]*?)>([\s\S]*?)<\/text>/g
  const attrRegex = /(\w+)="([^"]*)"/g

  const segments: TranscriptResponse[] = []
  let textMatch: RegExpExecArray | null

  while ((textMatch = textRegex.exec(xml)) !== null) {
    const attrsRaw = textMatch[1]
    const textRaw = textMatch[2] || ''
    const attrs: Record<string, string> = {}

    let attrMatch: RegExpExecArray | null
    while ((attrMatch = attrRegex.exec(attrsRaw)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2]
    }

    const start = Number(attrs.start || 0)
    const duration = Number(attrs.dur || 0)
    const text = decodeHtmlEntities(textRaw).replace(/\n/g, ' ').trim()

    if (!text) continue

    segments.push({
      text,
      offset: Number.isFinite(start) ? start : 0,
      duration: Number.isFinite(duration) ? duration : 0,
    })
  }

  return segments
}

async function fetchTranscriptViaTimedTextApi(videoId: string): Promise<TranscriptResponse[]> {
  const listUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`
  const listResponse = await fetch(listUrl, { cache: 'no-store' })

  if (!listResponse.ok) {
    throw new YouTubeTranscriptUnavailableError('Timedtext track list request failed.')
  }

  const listXml = await listResponse.text()
  const tracks = parseTimedTextTracks(listXml)
  if (tracks.length === 0) {
    throw new YouTubeTranscriptUnavailableError('No timedtext tracks found for this video.')
  }

  const preferredTrack =
    tracks.find((track) => track.langCode.toLowerCase().startsWith('en') && track.kind !== 'asr') ||
    tracks.find((track) => track.langCode.toLowerCase().startsWith('en')) ||
    tracks.find((track) => track.kind !== 'asr') ||
    tracks[0]

  const transcriptUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${encodeURIComponent(preferredTrack.langCode)}${preferredTrack.kind ? `&kind=${encodeURIComponent(preferredTrack.kind)}` : ''}`
  const transcriptResponse = await fetch(transcriptUrl, { cache: 'no-store' })

  if (!transcriptResponse.ok) {
    throw new YouTubeTranscriptUnavailableError('Timedtext transcript request failed.')
  }

  const transcriptXml = await transcriptResponse.text()
  const segments = parseTimedTextTranscript(transcriptXml)

  if (segments.length === 0) {
    throw new YouTubeTranscriptUnavailableError('Timedtext transcript payload was empty.')
  }

  return segments
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

  let transcriptSegments: TranscriptResponse[] = []
  let primaryError: unknown

  try {
    transcriptSegments = await YoutubeTranscript.fetchTranscript(videoId)
  } catch {
    try {
      transcriptSegments = await fetchTranscriptViaCaptionTracks(videoId)
    } catch (captionTrackError) {
      primaryError = captionTrackError
      transcriptSegments = await fetchTranscriptViaTimedTextApi(videoId)
    }
  }

  if (!Array.isArray(transcriptSegments) || transcriptSegments.length === 0) {
    const primaryReason =
      primaryError instanceof Error ? primaryError.message : 'Unknown primary transcript error'
    throw new YouTubeTranscriptUnavailableError(`No transcript available for this video. ${primaryReason}`)
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

export function isTranscriptUnavailableError(error: unknown): boolean {
  return error instanceof YouTubeTranscriptUnavailableError
}
