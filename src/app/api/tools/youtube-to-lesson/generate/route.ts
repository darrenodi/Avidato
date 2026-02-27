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
The student watches the video ONCE only.

══════════════════════════════════════════════
GLOBAL LANGUAGE QUALITY RULES — APPLY EVERYWHERE
══════════════════════════════════════════════

These rules apply to BOTH vocabulary (Stage 2) AND phrases (Stage 4).

✅ ONLY select items that meet ALL of these criteria:
  - The item is genuine English. Never select words from other languages.
  - The item is TEACHABLE: a real ESL learner at ${level} would benefit from knowing it.
  - The item is TRANSFERABLE: it works naturally in many different topics, not just this video.
  - The item is a content word or fixed chunk — not grammar glue.

❌ AUTOMATIC DISQUALIFIERS — never select these:
  - Function/grammar words: pronouns, articles, prepositions, conjunctions, auxiliaries.
  - Words too simple for CEFR ${level} (e.g. "car", "big", "fail", "need" for B2).
  - Proper nouns: brand names, company names, country names, people's names.
  - Topic-locked items: words or phrases that only make sense in this video's specific subject
    and cannot be reused in everyday conversations on other topics.
  - Transcript noise: filler words, hesitation markers, interjections
    (e.g. "uh", "um", "you know", "I mean", "goodness me", "shoot", "whoa").
  - Non-English words or unlisted loanwords.

══════════════════════════════════════════════
STAGE 1 — WARM-UP (5 min)
══════════════════════════════════════════════

Generate 3 lead-in questions asked BEFORE the student watches the video.
Purpose: get the student talking, lower the affective filter, connect to their own life.

RULES:
- Question 1 must be a PERSONAL EXPERIENCE question rooted in everyday life.
  It should be easy and low-stakes — any adult can answer it from their own experience.
  The topic link should be loose and natural, not forced.
- Question 2 must be an OPINION or PREFERENCE question — something with no right answer,
  where the student just shares what they think or believe.
- Question 3 must be a HYPOTHETICAL or "what would you do" question that invites imagination.
  Keep it grounded and realistic — not science fiction.
- ALL THREE questions must be conversational in tone. Write them the way a real teacher
  would speak to a student across a table, not the way an exam paper is written.
- NONE of the questions should require knowledge of the video content.
- AVOID "yes/no" questions unless they include "...why?" or "...tell me more."
- AVOID overly abstract or academic phrasing like "In your opinion, to what extent..."

BAD warm-up questions — DO NOT write like these:
  ❌ "Do you like cars?" — closed, shallow, one-word answer
  ❌ "What do you know about Volkswagen's profits?" — requires video knowledge
  ❌ "What is your opinion of the automotive industry?" — impersonal, abstract, exam-like
  ❌ "If you were leading a traditional industry, how would you balance legacy with disruption?"
     — too complex, too business-school, not personal

GOOD warm-up questions — aim for this quality:
  ✅ "Have you ever bought something — a phone, an appliance, maybe a car — that turned out to be
     way less impressive than you expected? What was it and what happened?"
  ✅ "When you're choosing between two products, what matters more to you: brand reputation,
     price, or features? Has that ever changed for you?"
  ✅ "If you could own any car in the world regardless of price, what would you choose and why?"

══════════════════════════════════════════════
STAGE 2 — PRE-TEACH KEY VOCABULARY (5-7 min)
══════════════════════════════════════════════

Pick 5 SINGLE WORDS from the transcript that the student needs to understand the video.

SELECTION RULES:
1. Content words only: nouns, verbs, or adjectives that carry real meaning.
2. The word must appear in the transcript AND be genuinely useful in other topics.
3. Pitch the difficulty correctly for CEFR ${level}:
   - A1/A2: basic but genuinely unknown words (e.g. "profit", "rival", "crisis")
   - B1/B2: mid-frequency words from news/business/general contexts
     (e.g. "plunge", "dominant", "adapt", "urgency", "overtake")
   - C1/C2: sophisticated, nuanced, or formal vocabulary
     (e.g. "complacency", "trajectory", "erode", "rhetoric")
4. Apply ALL global disqualifiers above. In particular:
   - Reject words most learners at ${level} already know.
   - Reject words that are purely technical or industry-specific.
   - Reject proper nouns.

SELF-CHECK for each word:
  → "Would a learner at ${level} encounter this exact word in a news article, novel,
     or conversation on a completely different topic?"
  If NO → reject it.

  → "Do most ${level} learners already know this word?"
  If YES → reject it and find something more challenging.

For each word: write a learner-friendly definition, a natural example sentence
(NOT from the transcript), and a concept-check question (CCQ).
CCQs should be short yes/no or either/or questions that confirm understanding without
just repeating the definition. Example: "If a company's profits plunge, do they go up or down?"

══════════════════════════════════════════════
STAGE 3 — WATCH & COMPREHEND (8-10 min)
══════════════════════════════════════════════

The student watches the video ONCE, then answers 5 detail questions.

RULES FOR DETAIL QUESTIONS:
- Each question must target ONE specific, clearly stated piece of information from the video.
  Do NOT combine two separate facts into one question.
- Mix question types across the 5 questions:
    • At least 1 true/false or correct/incorrect question
    • At least 2 short-answer questions about specific facts, figures, or causes
    • At least 1 "What does the speaker mean when they say...?" inference question
    • At least 1 cause-and-effect question ("Why did X happen?" / "What caused Y?")
- Questions must be answerable from the video alone — no outside knowledge needed.
- Reference answers must be concise (1-2 sentences max). Teachers use these to check, not read aloud.
- Do NOT write vague or double-barreled questions.

BAD detail questions:
  ❌ "What is mentioned as a key failing in Germany regarding e-mobility strategy and infrastructure?"
     — double-barreled (two separate issues in one question)
  ❌ "What challenges does Germany face?" — too vague, multiple correct answers
  ❌ "Is the German car industry in trouble?" — answered before watching

GOOD detail questions:
  ✅ "True or false: Porsche's profits fell by around 50% this year."
     Answer: False — they fell by 95%.
  ✅ "Why are German carmakers losing market share in the United States specifically?"
     Answer: Because of tariffs.
  ✅ "What does the speaker mean when he says German companies 'didn't feel the need to invest
     in e-mobility'?" Answer: They were making so much money from diesel/combustion cars
     that they had no financial pressure to change.

══════════════════════════════════════════════
STAGE 4 — LANGUAGE FOCUS (12-15 min)
══════════════════════════════════════════════

Three parts: 4a Matching, 4b Fill-in-the-Blanks, 4c Speaking Practice.

──────────────────────────────────────────────
PHRASE SELECTION — THE MOST IMPORTANT PART
──────────────────────────────────────────────

Extract 8 multi-word phrases from the transcript. Each must be 2-5 words.

GOLDEN RULE: Every phrase you select must be something you would find listed in a
well-known ESL reference such as the Oxford Phrasal Verbs Dictionary, the Cambridge
Dictionary of Idioms, or a Business/Academic English collocation list.
If you cannot imagine it appearing in such a reference — DO NOT select it.

SELECTION PRIORITY (fill all 8 slots working through this list):

1. IDIOMS — figurative expressions whose meaning cannot be guessed from the individual words.
   The meaning is non-literal and fixed.
   Examples: "drop the ball", "bite the bullet", "in the long run", "get cold feet"
   ✅ FROM THIS TRANSCRIPT: "drop the ball" is a clear idiom — select it.

2. PHRASAL VERBS — verb + particle where the combination has a specific, learnable meaning.
   The particle must be one of: up, down, out, off, over, away, back, through, into, on, behind.
   The meaning must be non-literal or idiomatic — NOT just the verb doing its literal action.
   Examples: "catch up", "switch back", "fall behind", "keep up", "give up", "burn out"
   ✅ FROM THIS TRANSCRIPT: "catch up", "keep up", "switch back", "fall behind" — all valid.
   ❌ "push on go on" — garbled transcript speech, not a clean phrasal verb. Reject.
   ❌ "go on" alone — too literal and too basic for most levels.

3. FIXED EXPRESSIONS / DISCOURSE MARKERS — set phrases used to frame or soften statements.
   These are formulaic: native speakers say them as a unit without constructing them word by word.
   Examples: "it's fair to say", "when it comes to", "as a matter of fact", "in a sense"
   ✅ FROM THIS TRANSCRIPT: "it's fair to say" — valid fixed expression.

4. STRONG COLLOCATIONS — word pairs or triples that native speakers use as a natural unit,
   listed in collocation dictionaries.
   Examples: "sense of urgency", "vicious cycle", "raise awareness", "meet a deadline"
   ✅ FROM THIS TRANSCRIPT: "sense of urgency" — strong, dictionary-listed collocation.
   ❌ "key sectors" — just adjective + noun, not a fixed collocation.
   ❌ "clear strategy" — generic, not a fixed pair.
   ❌ "sharp drop" — "sharp" combines freely with any noun. Not a fixed collocation.

HARD REJECTION LIST — never select phrases like these:
  ❌ Spoken fillers/interjections: "goodness me", "you know", "I mean", "of course", "way early"
  ❌ Generic verb + object: "make a decision", "take a risk", "lose market share", "play a role"
  ❌ Topic-locked noun phrases: "charging infrastructure", "combustion engine", "export market",
     "quarterly profits", "premium brand", "e-mobility strategy", "self-driving software"
  ❌ Literal combinations: any phrase where every word means exactly what it says and
     there is nothing idiomatic, fixed, or "chunky" about the pairing.

FINAL SELF-CHECK for each phrase:
  → "Is this listed in an ESL dictionary or collocation reference?"
  → "Can I use this phrase naturally in a conversation about cooking, relationships, or sport?"
  → "Would an ESL teacher explicitly teach this as a set chunk?"
  All three answers must be YES. If any answer is NO → reject and replace.

NORMALIZATION:
- Present verbs in base/infinitive form: "catch up" not "caught up"
- Remove articles from base form: "sense of urgency" not "a sense of urgency"
- Use "one's" for pronouns: "drop the ball" (no pronoun needed here)

LABELS — use accurately:
  "idiom" | "phrasal verb" | "collocation" | "fixed expression"

──────────────────────────────────────────────
EXERCISE 4a — MATCHING
──────────────────────────────────────────────
Each phrase gets a clear, concise meaning (one short sentence).
Meanings must be clearly distinguishable — do NOT use near-synonyms across different meanings.

──────────────────────────────────────────────
EXERCISE 4b — FILL-IN-THE-BLANKS
──────────────────────────────────────────────
Create 6 gap-fill sentences using 6 of the 8 phrases.

RULES:
- Each sentence has exactly ONE blank: "________" (8 underscores). Never write the answer in the sentence field.
- The answer is the phrase from the list, inflected to fit the sentence grammatically.
- Each sentence must be set in an EVERYDAY scenario — not the video's topic.
  Use contexts like: sport, work, relationships, school, travel, cooking, health.
- The sentence must provide enough context to identify the correct phrase.
- The key words of the phrase must NOT appear in the surrounding sentence.

CRITICAL GRAMMAR VERIFICATION — do this for every sentence:
  Step 1: Write the sentence with the blank.
  Step 2: Insert the answer into the blank.
  Step 3: Read the complete sentence aloud in your head.
  Step 4: Is it 100% grammatically natural? If not — REWRITE the sentence, not the answer.

COMMON GRAMMAR MISTAKES — avoid these:
  ❌ Auxiliary clash: "She did ________ on the project." + answer "drop the ball"
     → "She did drop the ball" sounds unnatural as a standalone sentence without context.
     BETTER: "The whole team was counting on her, but she ________ at the worst possible moment."
  ❌ Tense mismatch: sentence implies past but answer is base form.
  ❌ Answer leaking into sentence: "He experienced a ________ drop in his grades." + answer "sharp drop"
     → "drop" appears twice. Rewrite: "His grades ________ after he stopped attending class." + answer "dropped sharply"
     (or use a different phrase entirely)
  ❌ Redundant surrounding words that overlap with the phrase meaning.

GOOD fill-in-the-blank examples:
  ✅ "After missing a month of training, she had to work twice as hard to ________ with the rest of the team."
     Answer: catch up
  ✅ "The project manager ________ by forgetting to send the client the final report."
     Answer: dropped the ball
  ✅ "________ that learning a language takes years of consistent practice."
     Answer: It's fair to say

──────────────────────────────────────────────
EXERCISE 4c — SPEAKING PRACTICE
──────────────────────────────────────────────
Create 5 personal questions. Each targets ONE phrase from the 8, bolded with **double asterisks**.

RULES:
- Each question must be about the student's own life: their experiences, opinions, habits, relationships.
- The bolded phrase must sit naturally inside the question — not pasted in awkwardly.
- NO blanks, NO underscores. The question is complete and the phrase is visible.
- Use a different phrase for each of the 5 questions.
- Questions must feel like natural teacher-to-student conversation — specific, warm, human.

PROCESS for writing each question:
  1. Pick the phrase.
  2. Think of a real everyday scenario where that phrase naturally comes up.
  3. Write a question grounded in that scenario that includes the phrase.
  4. Read it aloud. Does it sound like something a real person would ask? If not — rewrite it.
  5. Check: does "you" in the question correctly match the phrase's pronoun form?
     e.g. "drop the ball" → "have you ever **dropped the ball**..." ✅
          "have a hard time" → "do you ever **have a hard time**..." ✅

BAD speaking questions — never write like these:
  ❌ Pronoun clash: "Can you think of when **drop the ball** happened to someone?"
  ❌ Generic template: "How do you feel about the idea of **catching up**?"
  ❌ Phrase missing from question: "Tell me about a time you failed at something important."
  ❌ Vague scenario: "Describe a situation where you had to **keep up** somehow."
  ❌ Built around a bad phrase: "Have you ever arrived **way early** for something?"

GOOD speaking questions — aim for this quality:
  ✅ "Has there ever been a moment at work or school when you felt you'd really **dropped the ball** —
     and what did you do about it?"
  ✅ "Is there a skill, a subject, or a hobby where you've had to work really hard to **catch up**
     with people around you?"
  ✅ "When it comes to deadlines or responsibilities, would you say you generally have a strong
     **sense of urgency**, or do you tend to take things more slowly?"
  ✅ "Have you ever had to **switch back** to an old way of doing something after trying a new
     approach that didn't work? What happened?"
  ✅ "Is there an area of your life — work, health, relationships — where you feel you've been
     **falling behind** and want to do something about it?"

══════════════════════════════════════════════
STAGE 5 — DISCUSSION (8-10 min)
══════════════════════════════════════════════

Write 5 discussion questions. These invite opinions, personal experience, and critical thinking.
NO factual recall. Each has a teacher follow-up prompt to push the conversation deeper.

RULES:
- Mix question types across the 5 — use each of these once:
    • Personal experience: "Have you ever / Can you think of a time when..."
    • Opinion: "Do you think... / How far do you agree that..."
    • Hypothetical: "If you were... / What would you do if..."
    • Comparison: "Which do you think matters more: X or Y? Why?"
    • Broad/societal: connects the video's theme to the wider world
- Questions should feel engaging to an adult learner. They should spark a real conversation,
  not feel like an exam or comprehension check.
- Every question must be thematically connected to the video but NOT require remembering
  specific facts from the video. The student should be able to answer from their own experience.
- Follow-up prompts must genuinely DEEPEN the conversation — push for reasons, examples,
  or a counter-argument. Do NOT just rephrase the original question.
- Do NOT write leading follow-ups that suggest the "right" answer.
  ❌ "How might excessive national pride hinder necessary changes?" — leading
  ✅ "Do you think that pride in a national identity can ever work against progress? Why?" — open

BAD discussion questions:
  ❌ "What do you think about the German car industry?" — too tied to the video, too vague
  ❌ "Do you like electric cars?" — closed, shallow
  ❌ Questions where the follow-up just restates the main question in different words.

GOOD discussion question with follow-up:
  ✅ "Some companies hold on to what made them successful for too long and miss the moment
     to change. Can you think of an example — from business, sport, or everyday life — where
     someone lost their lead simply by not adapting in time?"
  Follow-up: ✅ "Why do you think it's so hard for successful people or organisations to change
     course, even when they can see the problem coming?"

══════════════════════════════════════════════
STAGE 6 — WRAP-UP (3-5 min)
══════════════════════════════════════════════

Write 2 reflection prompts. These are open, personal, and easy to answer.
One should ask about content (what they learned or found interesting).
One should ask about language (a word, phrase, or idea they want to remember or use).

Also include 1 homework task. Vary the type (writing, speaking, or research).
The task should be specific enough that the student knows exactly what to do,
and should require them to use language from the lesson naturally.

══════════════════════════════════════════════
OUTPUT JSON ONLY — no markdown, no explanation, no code fences:
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
      "conceptCheckQuestion": "Short yes/no or either/or CCQ"
    }
  ],
  "detailQuestions": [
    { "id": 1, "question": "detail question", "answer": "short reference answer" }
  ],
  "phrases": [
    {
      "term": "drop the ball",
      "type": "idiom",
      "meaning": "to fail to do something that was your responsibility, especially at a critical moment"
    }
  ],
  "fillBlanks": [
    {
      "id": 1,
      "sentence": "The project manager ________ by forgetting to send the client the final report.",
      "answer": "dropped the ball"
    }
  ],
  "speakingPractice": [
    { "id": 1, "question": "Has there ever been a moment at work or school when you felt you'd really **dropped the ball** — and what did you do about it?" }
  ],
  "discussion": [
    { "id": 1, "question": "discussion question", "followUp": "follow-up prompt for teacher" }
  ],
  "wrapUp": [
    { "id": 1, "prompt": "reflection prompt" }
  ],
  "homework": {
    "task": "specific description of the homework task",
    "type": "writing"
  }
}

COUNTS (strict — no exceptions):
- warmUp: exactly 3 items
- preTeach: exactly 5 items (type must be "noun", "verb", or "adjective")
- detailQuestions: exactly 5 items (mix of question types as specified above)
- phrases: exactly 8 items, each 2-5 words (type: "idiom", "phrasal verb", "collocation", or "fixed expression")
- fillBlanks: exactly 6 items (answer inflected to fit sentence; sentence contains "________")
- speakingPractice: exactly 5 items (phrase bolded with **double asterisks**)
- discussion: exactly 5 items (each with "question" and "followUp")
- wrapUp: exactly 2 items
- homework: exactly 1 item (with "task" and "type")

Return ONLY valid JSON. No markdown. No explanation. No code fences.`
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