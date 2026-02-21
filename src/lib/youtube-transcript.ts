/**
 * YouTube Transcript Fetcher
 *
 * Spawns a Python script that uses the youtube-transcript-api library
 * (which actually works, unlike every Node.js YouTube transcript package).
 *
 * The Python script outputs JSON to stdout with the transcript data.
 * This module parses it and returns a typed result.
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
// Spawn Python script
// ---------------------------------------------------------------------------

interface PythonTranscriptResult {
  videoId: string
  language: string
  segments: TranscriptSegment[]
  text: string
}

function runPythonTranscript(videoId: string): Promise<PythonTranscriptResult> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'get_transcript.py')
    const proc = spawn('python3', [scriptPath, videoId])

    let stdout = ''
    let stderr = ''

    const timeout = setTimeout(() => {
      proc.kill('SIGTERM')
      reject(new YouTubeTranscriptError('Python transcript script timed out after 30s.'))
    }, PYTHON_TIMEOUT_MS)

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString()
    })

    proc.stderr.on('data', (data: Buffer) => {
      stderr += data.toString()
    })

    proc.on('close', (code) => {
      clearTimeout(timeout)

      if (code !== 0) {
        // Try to parse structured error from stderr
        let errorMsg = `Python script exited with code ${code}`
        try {
          const errJson = JSON.parse(stderr.trim())
          if (errJson.error) errorMsg = errJson.error
        } catch {
          if (stderr.trim()) errorMsg = stderr.trim()
        }
        reject(new YouTubeTranscriptError(errorMsg))
        return
      }

      try {
        const data = JSON.parse(stdout.trim()) as PythonTranscriptResult
        resolve(data)
      } catch {
        reject(new YouTubeTranscriptError('Failed to parse Python script output.'))
      }
    })

    proc.on('error', (err) => {
      clearTimeout(timeout)
      reject(
        new YouTubeTranscriptError(
          `Failed to spawn Python process: ${err.message}. Ensure python3 and youtube-transcript-api are installed.`
        )
      )
    })
  })
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

  const data = await runPythonTranscript(videoId)

  if (!data.segments || data.segments.length === 0) {
    throw new YouTubeTranscriptError('Transcript returned no segments.')
  }

  // Clean up segment text (replace newlines, decode entities, normalize whitespace)
  const cleanedSegments = data.segments.map((s) => ({
    ...s,
    text: s.text.replace(/\n/g, ' ').trim(),
  }))

  const rawText = cleanedSegments
    .map((s) => s.text)
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!rawText) {
    throw new YouTubeTranscriptError('Transcript was empty after processing.')
  }

  const { text, isTruncated } = truncateTranscript(rawText)
  const durationSeconds = getDurationSeconds(cleanedSegments)

  return {
    videoId: data.videoId,
    sourceUrl: `https://www.youtube.com/watch?v=${data.videoId}`,
    transcriptText: text,
    segments: cleanedSegments,
    isTruncated,
    durationSeconds,
    language: data.language || 'en',
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
