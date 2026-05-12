import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkGenerationLimit, recordSuccessfulGeneration } from '@/app/actions/ai-generation'
import { checkYouTubeAccess, recordYouTubeGeneration } from '@/lib/feature-gates'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'
import { getYouTubeTranscript, extractYouTubeVideoId, isTranscriptUnavailableError } from '@/lib/youtube-transcript'
import { prisma } from '@/lib/prisma'
import {
  type CEFRLevel,
  type YouTubeLessonData,
  type FillBlankItem,
  buildTranscriptPrompt,
  normalizeManualTranscript,
} from '@/lib/youtube-lesson-prompt'

interface GenerateYouTubeLessonRequest {
  youtubeUrl?: string
  transcriptText?: string
  level: CEFRLevel
  context?: string
}

interface YouTubeLessonResponse extends YouTubeLessonData {
  videoId: string
  sourceUrl: string
  level: CEFRLevel
  generatedAt: string
}

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const MAX_VIDEO_DURATION_SECONDS = 5 * 60
const MAX_TRANSCRIPT_CHARS = 18000

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check YouTube access based on plan tier
    const ytAccess = await checkYouTubeAccess(session.user.id)
    if (!ytAccess.allowed) {
      return NextResponse.json(
        { error: ytAccess.reason, upgrade: ytAccess.upgrade ?? false },
        { status: 403 }
      )
    }

    const allowed = await checkGenerationLimit(session.user.id)
    if (!allowed) {
      return NextResponse.json({ error: 'Daily generation limit exceeded' }, { status: 429 })
    }

    const body: GenerateYouTubeLessonRequest = await request.json()
    const youtubeUrl = body.youtubeUrl?.trim()
    const transcriptText = body.transcriptText?.trim()
    const level = body.level
    const context = body.context?.trim()

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'Please provide a YouTube video link.' },
        { status: 400 }
      )
    }

    if (!transcriptText) {
      return NextResponse.json(
        { error: 'Please paste the video transcript.' },
        { status: 400 }
      )
    }

    if (!level || !CEFR_LEVELS.includes(level)) {
      return NextResponse.json({ error: 'Valid CEFR level is required' }, { status: 400 })
    }

    let resolvedTranscriptText = ''
    let resolvedVideoId = 'manual'
    let resolvedSourceUrl = ''

    if (transcriptText) {
      const normalizedManualTranscript = normalizeManualTranscript(transcriptText)
      if (!normalizedManualTranscript) {
        return NextResponse.json(
          { error: 'Transcript text was empty after cleanup. Please paste readable transcript text.' },
          { status: 400 }
        )
      }

      resolvedTranscriptText = normalizedManualTranscript.slice(0, MAX_TRANSCRIPT_CHARS)

      // If a YouTube URL was also provided, extract video ID for metadata
      if (youtubeUrl) {
        const vid = extractYouTubeVideoId(youtubeUrl)
        if (vid) {
          resolvedVideoId = vid
          resolvedSourceUrl = `https://www.youtube.com/watch?v=${vid}`
        }
      }
    } else if (youtubeUrl) {
      const transcriptData = await getYouTubeTranscript(youtubeUrl)

      if (transcriptData.durationSeconds > MAX_VIDEO_DURATION_SECONDS) {
        return NextResponse.json(
          { error: 'Video is too long. Maximum supported duration is 5 minutes.' },
          { status: 400 }
        )
      }

      resolvedTranscriptText = transcriptData.transcriptText
      resolvedVideoId = transcriptData.videoId
      resolvedSourceUrl = transcriptData.sourceUrl
    }

    if (!resolvedTranscriptText) {
      return NextResponse.json(
        { error: 'Could not resolve transcript text from input.' },
        { status: 400 }
      )
    }

    // -----------------------------------------------------------------------
    // Dedup check: if this URL+level combo already exists, return it
    // (Skip when teacher provided custom context — they want a fresh generation)
    // -----------------------------------------------------------------------
    if (resolvedSourceUrl && !context) {
      const existing = await prisma.youTubeLesson.findUnique({
        where: {
          sourceUrl_level: { sourceUrl: resolvedSourceUrl, level },
        },
      })

      if (existing) {
        const existingData = existing.data as Record<string, unknown>
        return NextResponse.json({
          ...existingData,
          videoId: existing.videoId,
          sourceUrl: existing.sourceUrl,
          level: existing.level,
          title: existing.title,
          topic: existing.topic || '',
          generatedAt: existing.createdAt.toISOString(),
          _fromLibrary: true,
        })
      }
    }

    const prompt = buildTranscriptPrompt(resolvedTranscriptText, level, context)

    const aiResult = await generateWithProviderFailover({
      prompt,
      generationConfig: {
        maxOutputTokens: 16384,
      },
    })

    const rawJSON = extractJSONFromText(aiResult.rawText)
    const parsed = cleanAndParseJSON<
      Omit<YouTubeLessonResponse, 'videoId' | 'sourceUrl' | 'level' | 'generatedAt'>
    >(rawJSON)

    const response: YouTubeLessonResponse = {
      videoId: resolvedVideoId,
      sourceUrl: resolvedSourceUrl,
      level,
      title: parsed.title || 'Untitled Lesson',
      topic: parsed.topic || '',
      teacherNotes: parsed.teacherNotes || '',
      estimatedMinutes: parsed.estimatedMinutes || 50,
      warmUp: Array.isArray(parsed.warmUp) ? parsed.warmUp : [],
      preTeach: Array.isArray(parsed.preTeach) ? parsed.preTeach : [],
      detailQuestions: Array.isArray(parsed.detailQuestions) ? parsed.detailQuestions : [],
      phrases: Array.isArray(parsed.phrases) ? parsed.phrases : [],
      fillBlanks: Array.isArray(parsed.fillBlanks)
        ? parsed.fillBlanks.map((item: FillBlankItem) => {
            // Sanitize: if AI leaked the answer into the sentence, replace it with blanks
            if (item.sentence && item.answer && !item.sentence.includes('________')) {
              const escaped = item.answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              const regex = new RegExp(escaped, 'i')
              if (regex.test(item.sentence)) {
                return { ...item, sentence: item.sentence.replace(regex, '________') }
              }
            }
            return item
          })
        : [],
      speakingPractice: Array.isArray(parsed.speakingPractice) ? parsed.speakingPractice : [],
      discussion: Array.isArray(parsed.discussion) ? parsed.discussion : [],
      wrapUp: Array.isArray(parsed.wrapUp) ? parsed.wrapUp : [],
      homework: parsed.homework || { task: '', type: 'writing' },
      generatedAt: new Date().toISOString(),
    }

    await recordSuccessfulGeneration(session.user.id)
    await recordYouTubeGeneration(session.user.id)

    // -----------------------------------------------------------------------
    // Auto-save to YouTube Lessons library
    // -----------------------------------------------------------------------
    let savedLessonId: string | null = null
    if (resolvedSourceUrl) {
      try {
        const saved = await prisma.youTubeLesson.upsert({
          where: {
            sourceUrl_level: { sourceUrl: resolvedSourceUrl, level },
          },
          create: {
            videoId: resolvedVideoId,
            sourceUrl: resolvedSourceUrl,
            level,
            title: response.title,
            topic: response.topic || null,
            data: JSON.parse(JSON.stringify(response)),
            createdBy: session.user.id,
          },
          update: {
            // If it already exists (race condition), update data
            data: JSON.parse(JSON.stringify(response)),
            title: response.title,
            topic: response.topic || null,
          },
        })
        savedLessonId = saved.id
      } catch (saveError) {
        // Don't fail the request if library save fails
        console.error('Failed to save YouTube lesson to library:', saveError)
      }
    }

    return NextResponse.json({ ...response, savedLessonId })
  } catch (error) {
    console.error('Error generating YouTube lesson:', error)

    if (isTranscriptUnavailableError(error)) {
      return NextResponse.json(
        { error: 'YouTube blocks automatic transcript fetching from cloud servers. Please paste the transcript manually.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate lesson from YouTube video' },
      { status: 500 }
    )
  }
}