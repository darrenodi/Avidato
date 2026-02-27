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

══════════════════════════════════════════════
GLOBAL LANGUAGE QUALITY RULES — APPLY EVERYWHERE
══════════════════════════════════════════════

These rules apply to vocabulary selection (Stage 2) AND phrase selection (Stage 4).

✅ ONLY select items that meet ALL of these criteria:
  - The word/phrase is ENGLISH. Never select words from other languages, even if they appear in the transcript (e.g. "jefe", "schadenfreude", "autobahn" used as a German brand name, etc.).
  - The item is genuinely TEACHABLE: a real ESL learner would benefit from knowing it.
  - The item is TRANSFERABLE: it can be used in many different topics and contexts, not just this one video.
  - The item is a CONTENT word or FIXED CHUNK: nouns, verbs, adjectives, adverbs, or multi-word expressions with a unified meaning.

❌ NEVER select any of the following — these are automatic disqualifiers:
  - Function words or grammar words: pronouns (I, you, he, they), articles (a, the), prepositions (in, on, at), conjunctions (and, but, because), auxiliary verbs (is, are, was, have), determiners (this, that, some).
  - Words that are too simple for the target CEFR level (e.g. "car", "big", "go" for B2).
  - Proper nouns: brand names, company names, country names, people's names (e.g. "Volkswagen", "Porsche", "Mercedes", "China", "Lars").
  - Words or phrases that are unique to this video's specific topic and cannot be reused in everyday conversation (e.g. "combustion engine", "charging infrastructure", "market share loss", "quarterly earnings").
  - Filler words, hesitation markers, or spoken discourse noises that appear in transcripts but are not real vocabulary items (e.g. "whoa", "uh", "um", "shoot", "hmm").
  - Non-English words or loanwords that are not established in English dictionaries.
  - Random verb + object pairs that any learner could construct (covered in full in Stage 4 rules below).

══════════════════════════════════════════════
STAGE 1 — WARM-UP (5 min)
══════════════════════════════════════════════

Generate 3 lead-in questions to activate prior knowledge about the video's topic.
Ask these BEFORE the student sees the video.

RULES FOR WARM-UP QUESTIONS:
- Personal and easy to answer — the student can respond from their own life and opinions.
- Related to the broad theme, NOT to specific facts in the video (the student hasn't watched it yet).
- Conversational and natural — write them as a real teacher would ask a real person.
- Vary the question types: include at least one opinion question, one experience question, and one hypothetical or preference question.
- Avoid yes/no questions unless followed by a "Why?" or "Tell me more."

GOOD warm-up question examples (for a video about the German car industry):
  ✅ "What do you think makes a car brand feel prestigious or trustworthy?"
  ✅ "Have you ever bought something — a phone, a car, an appliance — and felt it wasn't worth the money? What happened?"
  ✅ "If you had to choose between a reliable but boring car and a stylish but unpredictable one, which would you pick and why?"

BAD warm-up question examples:
  ❌ "Do you like cars?" — too closed and shallow
  ❌ "What do you know about Volkswagen's profits?" — requires knowledge of the video content
  ❌ "What is your opinion of the automotive industry?" — too abstract and impersonal

══════════════════════════════════════════════
STAGE 2 — PRE-TEACH KEY VOCABULARY (5-7 min)
══════════════════════════════════════════════

Pick 5 SINGLE WORDS from the transcript that the student NEEDS to understand the video.

SELECTION RULES — READ CAREFULLY:
1. Choose CONTENT words only: nouns, verbs, or adjectives that carry meaning.
2. The word must appear in the transcript AND be useful outside this topic.
3. The word must be at an appropriate challenge level for CEFR ${level}:
   - A1/A2: everyday words the student may not know yet (e.g. "collapse", "rival", "profit")
   - B1/B2: mid-frequency words that appear in news and business contexts (e.g. "adapt", "dominant", "plunge")
   - C1/C2: sophisticated or nuanced vocabulary (e.g. "complacency", "trajectory", "erode")
4. Apply all GLOBAL LANGUAGE QUALITY RULES above. In particular:
   - Do NOT select proper nouns, function words, filler words, or non-English words.
   - Do NOT select words that are so basic that most students at CEFR ${level} already know them.
   - Do NOT select words that are purely technical or industry-specific with no everyday use.

SELF-CHECK before including a word: Ask yourself —
  "Would a learner at ${level} encounter this word again in a general news article, novel, or conversation about a completely different topic?"
  If NO → reject it and pick something else.

For each selected word: give a simple definition at CEFR ${level} level,
an example sentence (NOT from the transcript), and a concept-check question (CCQ).

══════════════════════════════════════════════
STAGE 3 — WATCH & COMPREHEND (8-10 min)
══════════════════════════════════════════════

The student watches the video ONCE.
- Write 5 detail questions about specific information: facts, figures, quotes, cause-effect.
  Include a short teacher reference answer for each detail question.
  Mix question types: true/false, short answer, "What does the speaker mean when they say...?"

══════════════════════════════════════════════
STAGE 4 — LANGUAGE FOCUS (12-15 min)
══════════════════════════════════════════════

This stage has three parts: 4a (Matching), 4b (Fill-in-the-Blanks), and 4c (Speaking Practice).

──────────────────────────────────────────────
PHRASE SELECTION — READ THIS CAREFULLY
──────────────────────────────────────────────

Extract 8 multi-word items from the transcript. Each item must be 2-5 words.

First, apply the GLOBAL LANGUAGE QUALITY RULES above to reject any non-English words,
filler expressions, or non-transferable topic-specific chunks.

WHAT MAKES A GOOD PHRASE:
A good phrase is a FIXED, REUSABLE chunk of English that students will encounter and use
again in many different contexts — not just this transcript. It should feel like a "building block"
that native speakers use naturally across topics.

SELECTION PRIORITY (fill 8 slots in this order):
1. IDIOMS — figurative expressions whose meaning isn't obvious from the individual words.
   Examples: "butterflies in your stomach", "in the long run", "break the ice"
2. PHRASAL VERBS — verb + particle combinations with non-literal meaning.
   Examples: "build up", "break down", "get over", "put on"
   ⚠ A phrasal verb MUST be a verb + particle (up, down, out, off, over, away, back, etc.)
   where the combination has a specific meaning different from the literal sum of its parts.
   Do NOT select casual spoken interjections like "wait", "oh wait", "go on", "hold on" unless
   they are genuine phrasal verbs with a teachable non-literal meaning.
3. FIXED EXPRESSIONS / DISCOURSE MARKERS — set phrases used to structure speech or add nuance.
   Examples: "as if that weren't enough", "speaking of which", "what matters is", "when it comes to"
4. STRONG COLLOCATIONS — word pairs that naturally go together and sound "right" to native ears.
   Examples: "chronic stress", "immune system", "comfort food", "vicious cycle"
   ⚠ A collocation must be a STRONG, FIXED pairing that native speakers use as a unit.
   Do NOT select random noun phrases that happen to appear together in this transcript
   (e.g. "key sectors", "charging infrastructure", "quarterly losses", "export market").
   SELF-CHECK: "Would this word pair appear as a vocabulary entry in a learner's dictionary or
   a Business English / Academic English word list?" If NO → reject it.

WHAT TO AVOID — DO NOT SELECT THESE:
❌ Filler words, interjections, or spoken hesitation markers used as "phrases":
   BAD: "whoa, wait" / "shoot" / "goodness me" / "you know" / "of course" / "I mean"
   These are transcript noise, not teachable fixed chunks.
❌ Random verb + object pairs that any learner could construct:
   BAD: "raise one's blood pressure", "lose market share", "make a decision", "take a risk"
❌ Topic-specific noun phrases that only make sense in this video's context:
   BAD: "key sectors", "charging infrastructure", "combustion engine cars", "export markets"
   BAD: "quarterly profits", "premium brand", "e-mobility strategy"
❌ Overly literal combinations where each word means exactly what it says:
   TEST: "Would an ESL textbook teach this as a set phrase or fixed expression?"
   If NO → don't include it.
❌ Long clauses or fragments of sentences.
❌ Single words disguised as phrases.
❌ Non-English words or brand names.

NORMALIZATION RULES:
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
- Keep sentences simple and natural. Set them in everyday scenarios, not industry-specific contexts.
- The sentence text (outside the blank) must NOT contain the answer phrase or its key words.

CRITICAL GRAMMAR CHECK:
Before finalizing each sentence, mentally insert the answer into the blank and READ THE COMPLETE SENTENCE aloud.
It MUST be 100% grammatically correct and natural-sounding. If not, REWRITE the sentence.

Common mistakes to AVOID:
- Do NOT place the blank after an auxiliary verb that clashes with the phrase's verb form.
  BAD: "Her resignation did _____ everyone." (answer: "come as a surprise")
  GOOD: "The announcement _____ to the whole department." (answer: "came as a surprise")
- Do NOT create redundancy where the phrase overlaps with surrounding words.
- The blank should be exactly where the phrase naturally sits in a fluent English sentence.

──────────────────────────────────────────────
STAGE 4c — SPEAKING USING THE PHRASES (5–7 min)
──────────────────────────────────────────────

Create 5 personal questions that force the student to USE a specific phrase from Stage 4 in their answer.
Each question targets ONE phrase. Bold the phrase using **double asterisks** inside the question text.

RULES:
- The question asks about a personal experience, opinion, or hypothetical situation from the student's own life.
- The phrase appears BOLDED in the question so the student knows exactly which phrase to use.
- NO blanks, NO underscores, NO gaps. The question is a complete, natural sentence.
- Keep all language appropriate for CEFR ${level}.
- Each of the 5 questions should target a DIFFERENT phrase from the 8 phrases.
- Questions should feel like something a real teacher would say in a real one-to-one lesson —
  specific, grounded, and genuinely interesting to answer.

CRITICAL — NATURAL INTEGRATION:
The phrase must fit ORGANICALLY into the question. Do NOT just paste the phrase into a generic template.

Step-by-step process for EACH question:
1. Pick the target phrase.
2. Think of a real-life scenario, personal experience, or opinion where that phrase naturally comes up.
3. Write a question about that scenario that INCLUDES the phrase as a natural part of the sentence.
4. Read the question aloud. Does it sound like something a real person would ask in a conversation?
   If it sounds forced, awkward, or like a textbook exercise, REWRITE it.
5. Check pronoun consistency: the question addresses "you" (the student), so adapt the phrase's pronouns accordingly.

QUESTION STYLE — model your questions on patterns like these:
  "Have you ever had to [phrase] when [situation]?"
  "Can you think of a time when you [phrase]?"
  "Is there someone in your life who tends to [phrase]? What do you think of that?"
  "Would you ever [phrase] if [hypothetical situation]?"
  "Do you think it's important to [phrase]? Why or why not?"
  "Describe a situation where [phrase] made a real difference."

BAD questions (DO NOT write questions like these):
  ❌ Pronoun clash: "Can you think of a time when someone told you something that was **news to me**?"
     Fix: "Has anyone ever given you news that was completely **out of the blue**?"
  ❌ Blank instead of phrase: "What strategies do you use to ________ after a hard day?"
  ❌ Phrase missing: "Tell me about a time when you felt really nervous." (where's the phrase?!)
  ❌ Generic template: "How do you feel about the concept of **putting your money where your mouth is**?"
  ❌ Vague and context-free: "Describe a situation where you had to **stand up for** something."

GOOD questions (aim for this quality):
  ✅ "Can you tell me about a time when you had **butterflies in your stomach** — maybe before a big presentation or an important meeting?"
  ✅ "Has a friend or colleague ever **let you down** when you were really counting on them? How did you handle it?"
  ✅ "Have you ever had to **take into account** someone else's needs or schedule before making a decision about your own plans?"
  ✅ "Is there something you've been putting off for a long time that you keep telling yourself you'll do **in the long run**?"
  ✅ "Have you ever had to **put your money where your mouth is** and actually commit to something risky that you'd been talking about?"

══════════════════════════════════════════════
STAGE 5 — DISCUSSION (8-10 min)
══════════════════════════════════════════════

Write 5 discussion questions that invite opinions, personal experience, and critical thinking.
NO factual recall from the video. Include a teacher follow-up prompt for each
(a secondary question the teacher can ask to push the conversation deeper).
Encourage the student to use vocabulary from stages 2 and 4 where natural.

RULES FOR DISCUSSION QUESTIONS:
- Each question should be genuinely thought-provoking and open-ended.
- Mix question types across the 5 questions:
    • Opinion questions ("Do you think...?", "How far do you agree that...?")
    • Personal experience questions ("Have you ever...?", "Can you think of a time when...?")
    • Hypothetical questions ("If you were in charge of X, what would you do?")
    • Comparison/evaluation questions ("Which do you think is more important: X or Y?")
    • Broad societal / global questions that connect the video's theme to the real world.
- Questions should feel relevant and engaging to an adult learner — not like a school exam.
- Follow-up prompts should genuinely extend the conversation, not just repeat the question.

GOOD discussion question example:
  "Some companies fail not because of bad products, but because they were too slow to change.
   Can you think of any example — from business, sport, or your own life — where someone lost
   their advantage simply by not adapting fast enough?"
  Follow-up: "What do you think makes it so hard for successful organisations to change course,
   even when they can see the problem coming?"

BAD discussion question example:
  ❌ "What do you think about the German car industry?" — too vague, too tied to the video
  ❌ "Do you like electric cars?" — too closed and shallow

══════════════════════════════════════════════
STAGE 6 — WRAP-UP (3-5 min)
══════════════════════════════════════════════

Write 2 reflection prompts: e.g., "What was the most interesting thing you learned?"
Also include 1 optional homework task (writing, speaking, or research).

══════════════════════════════════════════════
OUTPUT JSON ONLY — no markdown, no explanation:
══════════════════════════════════════════════
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
    { "id": 1, "question": "Can you tell me about a time when you had **butterflies in your stomach** — maybe before a big presentation or an important event?" }
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