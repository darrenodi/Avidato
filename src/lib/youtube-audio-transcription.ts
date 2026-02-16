import OpenAI from 'openai'
import { toFile } from 'openai/uploads'
import ytdl from '@distube/ytdl-core'
import { extractYouTubeVideoId } from './youtube-transcript'

export class YouTubeASRUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'YouTubeASRUnavailableError'
  }
}

interface YouTubeASRResult {
  videoId: string
  sourceUrl: string
  transcriptText: string
  durationSeconds: number
}

const MAX_AUDIO_BYTES = 25 * 1024 * 1024

async function downloadYouTubeAudio(videoUrl: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const stream = ytdl(videoUrl, {
      filter: 'audioonly',
      quality: 'lowestaudio',
      highWaterMark: 1 << 25,
    })

    const chunks: Buffer[] = []
    let totalSize = 0

    stream.on('data', (chunk: Buffer) => {
      totalSize += chunk.length
      if (totalSize > MAX_AUDIO_BYTES) {
        stream.destroy(new YouTubeASRUnavailableError('Audio is too large for transcription fallback.'))
        return
      }
      chunks.push(chunk)
    })

    stream.on('error', (error) => {
      reject(error)
    })

    stream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
  })
}

export async function transcribeYouTubeAudio(input: string, maxDurationSeconds: number): Promise<YouTubeASRResult> {
  const videoId = extractYouTubeVideoId(input)
  if (!videoId) {
    throw new YouTubeASRUnavailableError('Invalid YouTube URL or video ID for ASR fallback.')
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new YouTubeASRUnavailableError('OPENAI_API_KEY is not configured for audio transcription fallback.')
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

  let videoInfo
  try {
    videoInfo = await ytdl.getInfo(videoUrl)
  } catch (error) {
    throw new YouTubeASRUnavailableError(
      `Unable to fetch YouTube video metadata for ASR fallback: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  const durationSeconds = Number(videoInfo.videoDetails.lengthSeconds || 0)
  if (!durationSeconds || Number.isNaN(durationSeconds)) {
    throw new YouTubeASRUnavailableError('Could not determine video duration for ASR fallback.')
  }

  if (durationSeconds > maxDurationSeconds) {
    throw new YouTubeASRUnavailableError('Video is too long. Maximum supported duration is 5 minutes.')
  }

  const audioBuffer = await downloadYouTubeAudio(videoUrl)
  if (!audioBuffer.length) {
    throw new YouTubeASRUnavailableError('Downloaded audio was empty for ASR fallback.')
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const file = await toFile(audioBuffer, `${videoId}.webm`, {
    type: 'audio/webm',
  })

  let transcriptionResult
  try {
    transcriptionResult = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file,
      response_format: 'verbose_json',
    })
  } catch (error) {
    throw new YouTubeASRUnavailableError(
      `ASR transcription request failed: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  const transcriptText = typeof transcriptionResult === 'string'
    ? transcriptionResult
    : (transcriptionResult.text || '').trim()

  if (!transcriptText) {
    throw new YouTubeASRUnavailableError('ASR transcription returned empty text.')
  }

  return {
    videoId,
    sourceUrl: videoUrl,
    transcriptText,
    durationSeconds,
  }
}

export function isYouTubeASRUnavailableError(error: unknown): boolean {
  if (error instanceof YouTubeASRUnavailableError) {
    return true
  }

  if (!error || typeof error !== 'object') {
    return false
  }

  const maybeError = error as { name?: unknown; message?: unknown }
  const name = typeof maybeError.name === 'string' ? maybeError.name : ''
  const message = typeof maybeError.message === 'string' ? maybeError.message.toLowerCase() : ''

  if (name === 'YouTubeASRUnavailableError') {
    return true
  }

  return (
    message.includes('asr') ||
    message.includes('transcription fallback') ||
    message.includes('audio is too large') ||
    message.includes('could not determine video duration')
  )
}
