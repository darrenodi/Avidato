import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkAndUpdateGenerationLimit } from '@/app/actions/ai-generation'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'
import { getYouTubeTranscript, isTranscriptUnavailableError } from '@/lib/youtube-transcript'

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

interface GenerateYouTubeLessonRequest {
  youtubeUrl: string
  level: CEFRLevel
}

interface DiscussionQuestion {
  id: number
  question: string
  focus: 'theme' | 'opinion' | 'language-in-context' | 'application'
}

interface VocabularyItem {
  term: string
  termType: 'word' | 'phrase'
  contextQuote: string
  meaning: string
  discussionPrompt: string
}

interface YouTubeLessonResponse {
  videoId: string
  sourceUrl: string
  level: CEFRLevel
  title: string
  summary: string
  discussionQuestions: DiscussionQuestion[]
  vocabulary: VocabularyItem[]
  phrases: VocabularyItem[]
  transcriptPreview: string
  generatedAt: string
}

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const MAX_VIDEO_DURATION_SECONDS = 5 * 60

function buildTranscriptPrompt(transcriptText: string, level: CEFRLevel) {
  return `You are an expert language tutor building a DISCUSSION lesson from a YouTube transcript.

TARGET CEFR LEVEL: ${level}

TRANSCRIPT:
"""
${transcriptText}
"""

TASK:
Create a lesson pack from this transcript focused on DISCUSSION (not comprehension).

STRICT RULES:
1) Do NOT produce factual recall questions (no “what happened first”, no quiz style).
2) Questions must invite opinions, interpretation, personal experience, and application.
3) Include language-in-context questions about specific words/phrases used in the transcript.
4) Extract vocabulary that fits CEFR ${level}, and also extract interesting phrases from the transcript.
5) Every vocabulary/phrase item must include a short context quote from the transcript.
6) Keep language natural and learner-appropriate for level ${level}.

OUTPUT JSON ONLY:
{
  "title": "Short lesson title",
  "summary": "2-3 sentence teacher-facing summary",
  "discussionQuestions": [
    {
      "id": 1,
      "question": "discussion question",
      "focus": "theme"
    }
  ],
  "vocabulary": [
    {
      "term": "word",
      "termType": "word",
      "contextQuote": "short quote from transcript",
      "meaning": "simple learner-friendly meaning",
      "discussionPrompt": "question that uses this word in context"
    }
  ],
  "phrases": [
    {
      "term": "phrase from transcript",
      "termType": "phrase",
      "contextQuote": "short quote from transcript",
      "meaning": "simple learner-friendly meaning",
      "discussionPrompt": "question that uses this phrase in context"
    }
  ]
}

COUNTS:
- discussionQuestions: 10 items with mixed focus values from [theme, opinion, language-in-context, application]
- vocabulary: 8 items (single words)
- phrases: 6 items (multi-word expressions)

Return JSON only.`
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowed = await checkAndUpdateGenerationLimit(session.user.id)
    if (!allowed) {
      return NextResponse.json({ error: 'Daily generation limit exceeded' }, { status: 429 })
    }

    const body: GenerateYouTubeLessonRequest = await request.json()
    const youtubeUrl = body.youtubeUrl?.trim()
    const level = body.level

    if (!youtubeUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })
    }

    if (!level || !CEFR_LEVELS.includes(level)) {
      return NextResponse.json({ error: 'Valid CEFR level is required' }, { status: 400 })
    }

    const transcriptData = await getYouTubeTranscript(youtubeUrl)

    if (transcriptData.durationSeconds > MAX_VIDEO_DURATION_SECONDS) {
      return NextResponse.json(
        { error: 'Video is too long. Maximum supported duration is 5 minutes.' },
        { status: 400 }
      )
    }

    const prompt = buildTranscriptPrompt(transcriptData.transcriptText, level)

    const aiResult = await generateWithProviderFailover({
      prompt,
      generationConfig: {
        maxOutputTokens: 8192,
      },
    })

    const rawJSON = extractJSONFromText(aiResult.rawText)
    const parsed = cleanAndParseJSON<
      Omit<YouTubeLessonResponse, 'videoId' | 'sourceUrl' | 'level' | 'transcriptPreview' | 'generatedAt'>
    >(rawJSON)

    const transcriptPreview = transcriptData.transcriptText.slice(0, 1200)

    const response: YouTubeLessonResponse = {
      videoId: transcriptData.videoId,
      sourceUrl: transcriptData.sourceUrl,
      level,
      title: parsed.title,
      summary: parsed.summary,
      discussionQuestions: Array.isArray(parsed.discussionQuestions) ? parsed.discussionQuestions : [],
      vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
      phrases: Array.isArray(parsed.phrases) ? parsed.phrases : [],
      transcriptPreview,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating YouTube lesson:', error)

    if (isTranscriptUnavailableError(error)) {
      return NextResponse.json(
        { error: error.message || 'Transcript is unavailable for this video. Try another video with captions.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate lesson from YouTube video' },
      { status: 500 }
    )
  }
}
