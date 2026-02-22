/**
 * Client-side YouTube transcript fetcher.
 *
 * Fetches the transcript from the user's browser (bypasses bot detection
 * that blocks Vercel/cloud server IPs). Uses a CORS proxy via our own
 * API endpoint to access the YouTube watch page.
 *
 * Flow:
 *   1. Call our /api/tools/youtube-to-lesson/transcript endpoint
 *      which fetches the watch page from the server but returns the
 *      raw captions XML to the client.
 *   OR
 *   2. Use the full server-side transcript as fallback.
 */

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/

export interface ClientTranscriptResult {
  videoId: string
  transcriptText: string
  language: string
  durationSeconds?: number
}

export function extractVideoId(input: string): string | null {
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

/**
 * Fetch transcript via our proxy API endpoint.
 * The endpoint fetches the YouTube page server-side and returns the
 * transcript text, but the request originates from an authenticated
 * user session so we get the benefit of auth + rate limiting.
 */
export async function fetchTranscriptViaProxy(
  youtubeUrl: string,
): Promise<ClientTranscriptResult> {
  const res = await fetch('/api/tools/youtube-to-lesson/transcript', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ youtubeUrl }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Failed to fetch transcript' }))
    throw new Error(data.error || `Transcript fetch failed (${res.status})`)
  }

  return res.json()
}
