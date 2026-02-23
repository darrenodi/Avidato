import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkAndUpdateGenerationLimit } from '@/app/actions/ai-generation'
import { checkYouTubeAccess, recordYouTubeGeneration } from '@/lib/feature-gates'
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
  type: 'noun' | 'verb' | 'adjective'
  definition: string
  exampleSentence: string
  conceptCheckQuestion: string
}

interface DetailQuestion {
  id: number
  question: string
  answer: string
}

interface PhraseItem {
  term: string
  type: 'phrase' | 'collocation' | 'idiom' | 'expression'
  meaning: string
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
  detailQuestions: DetailQuestion[]
  phrases: PhraseItem[]
  fillBlanks: FillBlankItem[]
  discussion: DiscussionQuestion[]
  wrapUp: ReflectionPrompt[]
  homework: HomeworkTask
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
Pick 5 SINGLE WORDS from the transcript that the student NEEDS to understand the video.
Choose individual nouns, verbs, or adjectives — NOT phrases, collocations, or multi-word expressions.
For each: give a simple definition at CEFR ${level} level,
an example sentence (NOT from the transcript), and a concept-check question (CCQ).

STAGE 3 — WATCH & COMPREHEND (10-12 min)
The student watches the video ONCE.
- Write 5 detail questions about specific information: facts, figures, quotes, cause-effect.
  Include a short teacher reference answer for each detail question.
  Mix question types: true/false, short answer, "What does the speaker mean when they say...?"

STAGE 4 — LANGUAGE FOCUS: MATCHING & FILL-IN-THE-BLANKS (10-12 min)
Extract 8 SHORT, REUSABLE phrases and collocations from the transcript.
Each phrase must be 2-4 words maximum. NOT isolated single words. NOT long clauses or sentences.
Focus on language that makes a student sound more fluent:
- Common collocations (e.g., "make a decision", "take into account")
- Phrasal verbs (e.g., "get caught up in", "switch over to")
- Fixed expressions (e.g., "for starters", "make it through", "on the spot")

CRITICAL RULES FOR PHRASES:
- Maximum 4 words per phrase. NEVER exceed this.
- Use phrases EXACTLY as they appear in the transcript — do not invent new ones.
- Each phrase must be a recognizable, reusable chunk of language.
- Do NOT use full clauses like "tackle the subject of climate change" — just "tackle the subject".
- Do NOT use abstract or poetic language like "dive into the bottomless ocean".

For each phrase provide a clear, concise meaning (one short sentence).

The student will do TWO exercises with these phrases:

Exercise 4a — MATCHING: match each phrase to its meaning.
Make sure meanings are clear, concise, and distinguishable from each other.

Exercise 4b — FILL-IN-THE-BLANKS: create 6 gap-fill sentences using 6 of the 8 phrases.
RULES:
- Each sentence has ONE blank where the phrase fits naturally.
- The answer in the "answer" field must be the EXACT phrase from the phrases list (2-4 words).
- The sentence must be NEW (not from the transcript) and give enough context to identify the phrase.
- Keep sentences simple and natural — not literary or abstract.

CRITICAL GRAMMAR CHECK FOR FILL-IN-THE-BLANKS:
Before finalizing each sentence, mentally insert the answer into the blank and READ THE COMPLETE SENTENCE.
It MUST be 100% grammatically correct and natural-sounding. If it is not, REWRITE the sentence.

Common mistakes to AVOID:
- Do NOT place the blank after an auxiliary verb that clashes with the phrase's verb form.
  BAD: "Her resignation did _____ everyone." (answer: "come as a surprise" → "did come as a surprise" is wrong)
  GOOD: "Her sudden resignation _____ to the entire team." (answer: "came as a surprise" — but this changes the phrase, so restructure)
  BETTER: "The announcement _____ to the whole department." (answer: "came as a surprise")
- Do NOT create redundancy where the phrase overlaps with surrounding words.
  BAD: "They _____ shared ownership of the building." (answer: "hold ownership" → "hold ownership shared ownership")
  GOOD: "Several investors _____ of the company." (answer: "hold ownership")
- Do NOT put the phrase where it sounds unnatural or forced.
  BAD: "The project was successful, _____." (answer: "to some degree" — reads awkwardly at end)
  GOOD: "_____, the new policy has improved efficiency." (answer: "To some degree")
- The blank should be exactly where the phrase naturally appears in a fluent English sentence. Read it aloud.

STAGE 5 — DISCUSSION (10-12 min)
Write 5 discussion questions that invite opinions, personal experience, and application.
NO factual recall. Include a teacher follow-up prompt for each (a secondary question
the teacher can ask to push the conversation deeper). Encourage the student to
use the vocabulary from stages 2 and 4.

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
      "term": "single word",
      "type": "noun",
      "definition": "simple learner-friendly definition at target CEFR level",
      "exampleSentence": "Example using the word (not from transcript)",
      "conceptCheckQuestion": "Is X the same as Y? (yes/no style CCQ)"
    }
  ],
  "detailQuestions": [
    { "id": 1, "question": "detail question", "answer": "short reference answer" }
  ],
  "phrases": [
    {
      "term": "get caught up in",
      "type": "phrase",
      "meaning": "to become so involved in something that you forget other things"
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
- preTeach: exactly 5 items (use type: "noun", "verb", or "adjective")
- detailQuestions: exactly 5 items
- phrases: exactly 8 items, each term 2-4 words max (use type: "phrase", "collocation", "idiom", or "expression")
- fillBlanks: exactly 6 items (answer must be an exact phrase from the list above, 2-4 words)
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

    // Check YouTube access based on plan tier
    const ytAccess = await checkYouTubeAccess(session.user.id)
    if (!ytAccess.allowed) {
      return NextResponse.json(
        { error: ytAccess.reason, upgrade: ytAccess.upgrade ?? false },
        { status: 403 }
      )
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
      Omit<YouTubeLessonResponse, 'videoId' | 'sourceUrl' | 'level' | 'generatedAt'>
    >(rawJSON)

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
      detailQuestions: Array.isArray(parsed.detailQuestions) ? parsed.detailQuestions : [],
      phrases: Array.isArray(parsed.phrases) ? parsed.phrases : [],
      fillBlanks: Array.isArray(parsed.fillBlanks) ? parsed.fillBlanks : [],
      discussion: Array.isArray(parsed.discussion) ? parsed.discussion : [],
      wrapUp: Array.isArray(parsed.wrapUp) ? parsed.wrapUp : [],
      homework: parsed.homework || { task: '', type: 'writing' },
      generatedAt: new Date().toISOString(),
    }

    // Record successful YouTube generation for rate limiting
    await recordYouTubeGeneration(session.user.id)

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
