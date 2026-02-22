import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkAndUpdateGenerationLimit } from '@/app/actions/ai-generation'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'
import { getYouTubeTranscript, extractYouTubeVideoId, isTranscriptUnavailableError } from '@/lib/youtube-transcript'

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

interface GenerateYouTubeLessonRequest {
  youtubeUrl?: string
  transcriptText?: string
  level: CEFRLevel
}

// ---------------------------------------------------------------------------
// Lesson stage types — 6-stage 45-minute ESL lesson plan
// ---------------------------------------------------------------------------

interface WarmUpQuestion {
  id: number
  question: string
}

interface PreTeachItem {
  term: string
  type: 'word' | 'phrase' | 'collocation' | 'idiom'
  definition: string
  exampleSentence: string
  conceptCheckQuestion: string
}

interface GistQuestion {
  id: number
  question: string
}

interface DetailQuestion {
  id: number
  question: string
  answer: string
}

interface PhraseItem {
  term: string
  type: 'phrase' | 'collocation' | 'idiom' | 'expression'
  contextQuote: string
  meaning: string
  exampleSentence: string
  cefrTag: string
}

interface FillBlankItem {
  id: number
  sentence: string
  answer: string
}

interface DiscussionQuestion {
  id: number
  question: string
  followUp: string
}

interface ReflectionPrompt {
  id: number
  prompt: string
}

interface HomeworkTask {
  task: string
  type: 'writing' | 'speaking' | 'research'
}

// ---------------------------------------------------------------------------
// Full lesson response
// ---------------------------------------------------------------------------

interface YouTubeLessonResponse {
  videoId: string
  sourceUrl: string
  level: CEFRLevel
  title: string
  topic: string
  teacherNotes: string
  estimatedMinutes: number
  warmUp: WarmUpQuestion[]
  preTeach: PreTeachItem[]
  gistQuestions: GistQuestion[]
  detailQuestions: DetailQuestion[]
  phrases: PhraseItem[]
  fillBlanks: FillBlankItem[]
  discussion: DiscussionQuestion[]
  wrapUp: ReflectionPrompt[]
  homework: HomeworkTask
  transcriptPreview: string
  generatedAt: string
}

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const MAX_VIDEO_DURATION_SECONDS = 5 * 60
const MAX_TRANSCRIPT_CHARS = 18000

function normalizeManualTranscript(input: string): string {
  return input.replace(/\s+/g, ' ').trim()
}

function buildTranscriptPrompt(transcriptText: string, level: CEFRLevel) {
  return `You are an expert ESL lesson planner creating a structured 45-minute lesson from a YouTube video transcript.

TARGET CEFR LEVEL: ${level}

TRANSCRIPT:
"""
${transcriptText}
"""

TASK:
Create a complete 6-stage lesson plan that a teacher can pick up and follow top-to-bottom.
Every item must be level-appropriate for CEFR ${level}.
The student watches the video ONCE only (for 4-5 minute videos, watching twice wastes time).

LESSON STAGES:

STAGE 1 — WARM-UP (5 min)
Generate 3 lead-in questions to activate prior knowledge about the video's topic.
These are asked BEFORE the student sees the video. They should be personal, easy to answer,
and related to the theme. Purpose: get the student talking and lower the affective filter.

STAGE 2 — PRE-TEACH KEY VOCABULARY (5-7 min)
Pick 5 words/phrases from the transcript that the student NEEDS to understand the video.
Choose items that would block comprehension if unknown — include collocations, phrasal verbs,
or idiomatic expressions, not just isolated single words.
For each: give a simple definition at CEFR ${level} level,
an example sentence (NOT from the transcript), and a concept-check question (CCQ).

STAGE 3 — WATCH & COMPREHEND (10-12 min)
The student watches the video ONCE. Before watching, give them gist questions to focus on
general understanding. After watching, ask detail questions for specific information.
- Write 3 gist questions (global understanding: main idea, speaker's purpose, topic).
- Write 5 detail questions (specific info: facts, figures, quotes, cause-effect).
  Include a short teacher reference answer for each detail question.
  Mix question types: true/false, short answer, "What does the speaker mean when they say...?"

STAGE 4 — LANGUAGE FOCUS: PHRASES & EXPRESSIONS (10-12 min)
This is the core vocabulary stage. Extract REUSABLE phrases, collocations, semi-idiomatic
expressions and natural chunks from the transcript — NOT isolated single words.
Focus on the types of language that make a student sound more fluent:
- Common collocations (e.g., "trigger a response", "a sense of accomplishment")
- Phrasal verbs and multi-word verbs (e.g., "get caught up in", "switch over to")
- Idiomatic / figurative expressions (e.g., "has a bad rap", "natural high")
- Useful everyday phrases (e.g., "for starters", "make it through")

Extract 8 items total. For each, tag its approximate CEFR level (the level at which
a learner would typically first encounter this expression).
Focus the selection around the target CEFR ${level} — most items should be AT or near
${level}, with 1-2 items slightly below (review/consolidation) and 1-2 slightly above (stretch).

Then create a FILL-IN-THE-BLANKS exercise using 6 of those 8 phrases.
Each sentence should have ONE blank where the phrase goes.
The sentence must be NEW (not from the transcript) and provide enough context
to work out the correct phrase. Put the answer phrase in the "answer" field.
The student sees a word box with all 6 phrases above the exercise.

STAGE 5 — DISCUSSION (10-12 min)
Write 5 discussion questions that invite opinions, personal experience, and application.
NO factual recall. Include a teacher follow-up prompt for each (a secondary question
the teacher can ask to push the conversation deeper). Encourage the student to
use phrases from stages 2 and 4.

STAGE 6 — WRAP-UP (3-5 min)
Write 2 reflection prompts: e.g., "What was the most interesting thing you learned?"
Also include 1 optional homework task (writing, speaking, or research).

OUTPUT JSON ONLY — no markdown, no explanation:
{
  "title": "Short engaging lesson title",
  "topic": "1-3 word topic label",
  "teacherNotes": "2-3 sentence teacher-facing summary of the lesson and its goals",
  "estimatedMinutes": 45,
  "warmUp": [
    { "id": 1, "question": "warm-up question" }
  ],
  "preTeach": [
    {
      "term": "word or phrase",
      "type": "collocation",
      "definition": "simple learner-friendly definition at target CEFR level",
      "exampleSentence": "Example using the word (not from transcript)",
      "conceptCheckQuestion": "Is X the same as Y? (yes/no style CCQ)"
    }
  ],
  "gistQuestions": [
    { "id": 1, "question": "gist question" }
  ],
  "detailQuestions": [
    { "id": 1, "question": "detail question", "answer": "short reference answer" }
  ],
  "phrases": [
    {
      "term": "multi-word expression or collocation",
      "type": "phrase",
      "contextQuote": "short quote from transcript where it appears",
      "meaning": "clear meaning at target level",
      "exampleSentence": "natural example sentence (not from transcript)",
      "cefrTag": "B1"
    }
  ],
  "fillBlanks": [
    {
      "id": 1,
      "sentence": "I ________ watching a documentary and forgot about dinner.",
      "answer": "got caught up in"
    }
  ],
  "discussion": [
    { "id": 1, "question": "discussion question", "followUp": "follow-up prompt for teacher" }
  ],
  "wrapUp": [
    { "id": 1, "prompt": "reflection prompt" }
  ],
  "homework": {
    "task": "description of homework task",
    "type": "writing"
  }
}

COUNTS (strict):
- warmUp: exactly 3 items
- preTeach: exactly 5 items (use type: "word", "phrase", "collocation", or "idiom")
- gistQuestions: exactly 3 items
- detailQuestions: exactly 5 items
- phrases: exactly 8 items (use type: "phrase", "collocation", "idiom", or "expression")
- fillBlanks: exactly 6 items (use 6 of the 8 phrases above)
- discussion: exactly 5 items
- wrapUp: exactly 2 items
- homework: exactly 1 item

Return ONLY valid JSON.`
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
    const transcriptText = body.transcriptText?.trim()
    const level = body.level

    if (!youtubeUrl && !transcriptText) {
      return NextResponse.json(
        { error: 'Provide a YouTube URL or paste transcript text.' },
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
      // Fallback: fetch transcript server-side (may fail on Vercel due to bot detection)
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

    const prompt = buildTranscriptPrompt(resolvedTranscriptText, level)

    const aiResult = await generateWithProviderFailover({
      prompt,
      generationConfig: {
        maxOutputTokens: 16384,
      },
    })

    const rawJSON = extractJSONFromText(aiResult.rawText)
    const parsed = cleanAndParseJSON<
      Omit<YouTubeLessonResponse, 'videoId' | 'sourceUrl' | 'level' | 'transcriptPreview' | 'generatedAt'>
    >(rawJSON)

    const transcriptPreview = resolvedTranscriptText.slice(0, 1200)

    const response: YouTubeLessonResponse = {
      videoId: resolvedVideoId,
      sourceUrl: resolvedSourceUrl,
      level,
      title: parsed.title || 'Untitled Lesson',
      topic: parsed.topic || '',
      teacherNotes: parsed.teacherNotes || '',
      estimatedMinutes: parsed.estimatedMinutes || 45,
      warmUp: Array.isArray(parsed.warmUp) ? parsed.warmUp : [],
      preTeach: Array.isArray(parsed.preTeach) ? parsed.preTeach : [],
      gistQuestions: Array.isArray(parsed.gistQuestions) ? parsed.gistQuestions : [],
      detailQuestions: Array.isArray(parsed.detailQuestions) ? parsed.detailQuestions : [],
      phrases: Array.isArray(parsed.phrases) ? parsed.phrases : [],
      fillBlanks: Array.isArray(parsed.fillBlanks) ? parsed.fillBlanks : [],
      discussion: Array.isArray(parsed.discussion) ? parsed.discussion : [],
      wrapUp: Array.isArray(parsed.wrapUp) ? parsed.wrapUp : [],
      homework: parsed.homework || { task: '', type: 'writing' },
      transcriptPreview,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(response)
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
