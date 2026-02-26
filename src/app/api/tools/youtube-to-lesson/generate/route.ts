import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkGenerationLimit, recordSuccessfulGeneration } from '@/app/actions/ai-generation'
import { checkYouTubeAccess, recordYouTubeGeneration } from '@/lib/feature-gates'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'
import { getYouTubeTranscript, extractYouTubeVideoId, isTranscriptUnavailableError } from '@/lib/youtube-transcript'
import { prisma } from '@/lib/prisma'

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

interface GenerateYouTubeLessonRequest {
  youtubeUrl?: string
  transcriptText?: string
  level: CEFRLevel
}

// ---------------------------------------------------------------------------
// Lesson stage types — 6-stage 50-minute ESL lesson plan
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
  type: 'idiom' | 'phrasal verb' | 'collocation' | 'fixed expression'
  meaning: string
}

interface FillBlankItem {
  id: number
  sentence: string
  answer: string
}

interface SpeakingPracticeItem {
  id: number
  question: string
  targetPhrase: string
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
  speakingPractice: SpeakingPracticeItem[]
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
  return `You are an expert ESL lesson planner creating a structured 50-minute lesson from a YouTube video transcript.

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

STAGE 3 — WATCH & COMPREHEND (8-10 min)
The student watches the video ONCE.
- Write 5 detail questions about specific information: facts, figures, quotes, cause-effect.
  Include a short teacher reference answer for each detail question.
  Mix question types: true/false, short answer, "What does the speaker mean when they say...?"

STAGE 4 — LANGUAGE FOCUS (12-15 min)

This stage has three parts: 4a (Matching), 4b (Fill-in-the-Blanks), and 4c (Speaking Practice).

──────────────────────────────────────────────
PHRASE SELECTION — READ THIS CAREFULLY
──────────────────────────────────────────────

Extract 8 multi-word items from the transcript. Each item must be 2-5 words.

WHAT MAKES A GOOD PHRASE:
A good phrase is a FIXED, REUSABLE chunk of English that students will encounter and use
again in many different contexts — not just this transcript. It should feel like a "building block"
that native speakers use naturally across topics.

SELECTION PRIORITY (fill 8 slots in this order):
1. IDIOMS — figurative expressions whose meaning isn't obvious from the individual words.
   Examples: "butterflies in your stomach", "in the long run", "break the ice"
2. PHRASAL VERBS — verb + particle combinations with non-literal meaning.
   Examples: "build up", "break down", "get over", "put on"
3. FIXED EXPRESSIONS / DISCOURSE MARKERS — set phrases used to structure speech or add nuance.
   Examples: "as if that weren't enough", "speaking of", "what matters is", "when it comes to"
4. STRONG COLLOCATIONS — word pairs that naturally go together and sound "right" to native ears.
   Examples: "chronic stress", "immune system", "comfort food", "visceral fat"

WHAT TO AVOID — DO NOT SELECT THESE:
❌ Random verb + object pairs that any learner could construct:
   BAD: "raise one's blood pressure" (just "raise" + any noun — not a fixed chunk)
   BAD: "increase one's chances" (generic verb + generic noun)
   BAD: "affect one's waistline" (just "affect" + noun)
   BAD: "curb one's stress" (just "curb" + noun)
❌ Phrases that only make sense within this specific transcript topic.
   BAD: "cholesterol plaque build up" (too technical/niche)
❌ Overly literal combinations where each word means exactly what it says and
   there is nothing "chunky" or idiomatic about the combination.
   TEST: Ask yourself — "Would an ESL textbook teach this as a set phrase?"
   If NO, don't include it.
❌ Long clauses or fragments of sentences.
❌ Single words disguised as phrases.

NORMALIZATION RULES:
- Convert transcript-specific objects into general-use patterns where natural:
  "replenish your energy stores" → "replenish one's energy" (if worth including)
  "dampen function of immune cells" → NOT worth including — too niche
- Use base/infinitive verb forms: "build up" not "builds up" or "building up"
- Remove articles when presenting the base form: "comfort food" not "the comfort foods"
- Keep the phrase in whatever form is most natural as a dictionary entry.

LABELLING — use these types accurately:
- "idiom" — figurative meaning, can't be guessed from individual words
- "phrasal verb" — verb + particle (up, down, out, off, over, etc.)
- "collocation" — strong natural word pair/triple that native speakers use as a unit
- "fixed expression" — a set phrase, discourse marker, or formulaic chunk

For each phrase provide a clear, concise meaning (one short sentence).

──────────────────────────────────────────────
EXERCISE 4a — MATCHING (included in the "phrases" array)
──────────────────────────────────────────────
The student matches each phrase to its meaning.
Make sure meanings are clear, concise, and distinguishable from each other.
Do NOT use synonyms between different meanings — each must be clearly different.

──────────────────────────────────────────────
EXERCISE 4b — FILL-IN-THE-BLANKS
──────────────────────────────────────────────
Create 6 gap-fill sentences using 6 of the 8 phrases.

RULES:
- Each sentence has ONE blank (represented by "________") where the phrase fits naturally.
- The "sentence" field MUST contain "________" (8 underscores) — NEVER write the answer inside the sentence.
  BAD: "The downturn could account for the decrease."  ← answer leaked into sentence!
  GOOD: "The downturn could ________ the decrease in spending."
- The answer must be the EXACT phrase from the phrases list (conjugated/inflected to fit the sentence grammatically).
- The sentence must be NEW (not from the transcript) and give enough context to identify the phrase.
- Keep sentences simple and natural.
- The sentence text (outside the blank) must NOT contain the answer phrase or its key words.

CRITICAL GRAMMAR CHECK:
Before finalizing each sentence, mentally insert the answer into the blank and READ THE COMPLETE SENTENCE aloud.
It MUST be 100% grammatically correct and natural-sounding. If not, REWRITE the sentence.

Common mistakes to AVOID:
- Do NOT place the blank after an auxiliary verb that clashes with the phrase's verb form.
  BAD: "Her resignation did _____ everyone." (answer: "come as a surprise")
  GOOD: "The announcement _____ to the whole department." (answer: "came as a surprise")
- Do NOT create redundancy where the phrase overlaps with surrounding words.
  BAD: "They _____ shared ownership." (answer: "hold ownership" → double "ownership")
  GOOD: "Several investors _____ of the company." (answer: "hold ownership")
- The blank should be exactly where the phrase naturally sits in a fluent English sentence.

STAGE 4c — SPEAKING USING THE PHRASES (5–7 min)

Create 5 personal questions that force the student to USE a specific phrase from Stage 4 in their answer.
Each question targets ONE phrase. Bold the phrase using **double asterisks** inside the question text.

RULES:
- The question asks about a personal experience, opinion, or hypothetical situation.
- The phrase appears BOLDED in the question so the student knows exactly which phrase to use.
- NO blanks, NO underscores, NO gaps. The question is a complete, natural sentence.
- Keep all language appropriate for CEFR ${level}.
- Each of the 5 questions should target a DIFFERENT phrase from the 8 phrases.
- PRONOUN CONSISTENCY: The question is addressed to "you" (the student). When embedding a phrase,
  adapt its pronouns to match the 2nd-person perspective of the question. Do NOT mix perspectives.
  BAD: "Can you think of a time when someone told you something that was completely **news to me**?"
       ← "me" clashes with "you" — broken perspective!
  GOOD: "Can you think of a time when something was completely **news to you**?"

GOOD EXAMPLES:
{ "id": 1, "question": "Can you tell me about a time when you had **butterflies in your stomach**?" }
{ "id": 2, "question": "Have you ever had to **take into account** someone else's feelings before making a decision?" }
{ "id": 3, "question": "Describe a moment when something **came as a surprise** to you." }

BAD EXAMPLES (DO NOT DO THIS):
{ "id": 1, "question": "What strategies do you find most effective to ________ after a challenging day?" }
{ "id": 1, "question": "Tell me about a situation where you felt really nervous." }  ← phrase not in the question


STAGE 5 — DISCUSSION (8-10 min)
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
  "estimatedMinutes": 50,
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
      "term": "butterflies in one's stomach",
      "type": "idiom",
      "meaning": "a nervous feeling you get before something important"
    }
  ],
  "fillBlanks": [
    {
      "id": 1,
      "sentence": "I always get ________ before a job interview.",
      "answer": "butterflies in my stomach"
    }
  ],
  "speakingPractice": [
    { "id": 1, "question": "Can you tell me about a time when you had **butterflies in your stomach**?" }
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
- preTeach: exactly 5 items (type: "noun", "verb", or "adjective")
- detailQuestions: exactly 5 items
- phrases: exactly 8 items, each term 2-5 words max (type: "idiom", "phrasal verb", "collocation", or "fixed expression")
- fillBlanks: exactly 6 items (answer must match a phrase from the list, inflected to fit the sentence)
- speakingPractice: exactly 5 items
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

    const allowed = await checkGenerationLimit(session.user.id)
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
    // -----------------------------------------------------------------------
    if (resolvedSourceUrl) {
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
    if (resolvedSourceUrl) {
      try {
        await prisma.youTubeLesson.upsert({
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
      } catch (saveError) {
        // Don't fail the request if library save fails
        console.error('Failed to save YouTube lesson to library:', saveError)
      }
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