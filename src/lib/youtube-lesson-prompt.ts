// src/lib/youtube-lesson-prompt.ts
// Extracted from the YouTube lesson API route so it can be imported in tests
// without pulling in Next.js server-only modules.

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

// ─── Lesson stage types ──────────────────────────────────────────────────────

export interface WarmUpQuestion { id: number; question: string }

export interface PreTeachItem {
  term: string
  type: 'noun' | 'verb' | 'adjective' | 'adverb'
  phonetics: string
  definition: string
  exampleSentence: string
  synonym?: string
  expressions?: string[]
}

export interface DetailQuestion { id: number; question: string; answer: string }

export interface PhraseItem {
  term: string
  type: 'idiom' | 'phrasal verb' | 'collocation' | 'fixed expression'
  meaning: string
}

export interface FillBlankItem { id: number; sentence: string; answer: string }
export interface SpeakingPracticeItem { id: number; question: string; targetPhrase: string }
export interface DiscussionQuestion { id: number; question: string; followUp: string }
export interface ReflectionPrompt { id: number; prompt: string }
export interface HomeworkTask { task: string; type: 'writing' | 'speaking' | 'research' }

export interface YouTubeLessonData {
  title: string
  topic: string
  teacherNotes: string
  estimatedMinutes: number
  warmUp: WarmUpQuestion[]
  preTeach: PreTeachItem[]
  detailQuestions: DetailQuestion[]
  discussion: DiscussionQuestion[]
  phrases: PhraseItem[]
  fillBlanks: FillBlankItem[]
  speakingPractice: SpeakingPracticeItem[]
  wrapUp: ReflectionPrompt[]
  homework: HomeworkTask
}

export function normalizeManualTranscript(input: string): string {
  return input.replace(/\s+/g, ' ').trim()
}

export function buildTranscriptPrompt(transcriptText: string, level: CEFRLevel, context?: string): string {
  const contextBlock = context
    ? `\n\nTEACHER CONTEXT (use this to inform your choices — vocabulary, question topics, examples, etc.):\n"""\n${context}\n"""\n`
    : ''

  return `You are an expert ESL lesson planner creating a structured 50-minute lesson from a YouTube video transcript.

TARGET CEFR LEVEL: ${level}${contextBlock}

TRANSCRIPT:
"""
${transcriptText}
"""

TASK:
Create a complete 6-stage lesson plan that a teacher can pick up and follow top-to-bottom.
Every item must be level-appropriate for CEFR ${level}.
The student watches the video ONCE only.

══════════════════════════════════════════════
GLOBAL FORMATTING RULES — APPLY TO ALL CONTENT
══════════════════════════════════════════════

NO EM DASHES:
  Never use em dashes anywhere in any lesson output. Use commas, full stops,
  colons, or restructure the sentence instead.

BANNED QUALIFIERS:
  Never use the phrases "big or small", "large or small", "great or small",
  or similar paired qualifiers in any question. Just ask the question directly.

NO DIRECT ADDRESS BY NAME:
  Never address the student by name inside any question, prompt, or instruction.
  "Maria, what do you think about...?" is WRONG. Ask directly: "What do you think about...?"

BANNED AI-TELL WORDS (applies to ALL stages):
  Never use these anywhere in any question, prompt, or instruction:
  "resonate", "navigate", "landscape", "leverage", "dynamics", "paradigm",
  "facilitate", "implications", "aspects", "in terms of", "when it comes to",
  "have you ever found yourself", "what role does X play".

══════════════════════════════════════════════
GLOBAL LANGUAGE QUALITY RULES — VOCABULARY & PHRASES
══════════════════════════════════════════════

These rules apply to BOTH vocabulary (Stage 2) AND phrases (Stage 5).

✅ ONLY select items that meet ALL of these criteria:
  - Genuine English — never select words from other languages.
  - TEACHABLE — a real ESL learner at ${level} would benefit from knowing it.
  - TRANSFERABLE — works naturally across many different topics and contexts, not just this video.
  - A content word or fixed chunk — not grammar glue.

❌ AUTOMATIC DISQUALIFIERS — never select these:
  - Function/grammar words: pronouns, articles, prepositions, conjunctions, auxiliaries.
  - Words too simple for CEFR ${level}.
  - Proper nouns: brand names, company names, country names, people's names.
  - Topic-locked items: only make sense in this specific video, cannot be reused elsewhere.
  - Transcript noise: filler words, hesitation markers, interjections
    (e.g. "uh", "um", "you know", "I mean", "goodness me", "whoa").
  - Non-English words.

══════════════════════════════════════════════
STAGE 1 — WARM-UP (5 min)
══════════════════════════════════════════════

Generate 3 lead-in questions asked BEFORE the student watches the video.
Purpose: get the student talking, lower the affective filter, connect to their own life.

LENGTH RULE: Each question must be ONE sentence. Maximum 20 words. No multi-part questions.
If you find yourself writing "and" to join two questions — split them or cut one half.

QUESTION TYPES — one of each, in this order:
  Q1: PERSONAL EXPERIENCE — easy, low-stakes, rooted in the student's everyday life.
      The topic connection should be loose and natural.
  Q2: OPINION or PREFERENCE — no right answer, student just shares what they think.
  Q3: HYPOTHETICAL — "what would you do if..." — grounded and realistic, not abstract.
      Must be PERSONAL and LOW-STAKES — about everyday life, fun scenarios, or silly dilemmas.
      NEVER about professional strategy, leadership, business decisions, or workplace management.
      Think: "If you could only eat one food forever..." not "If you were leading a company..."

ALL questions must:
  - Sound like a real teacher talking to a real person, not an exam paper.
  - Be impossible to answer with just "yes" or "no" (or include "...why?").
  - Require zero knowledge of the video content.

TOPIC ANCHORING — CRITICAL:
  All three warm-up questions must directly relate to the video's specific topic.
  Never ask generic questions that could apply to any lesson.

══════════════════════════════════════════════
STAGE 2 — PRE-TEACH KEY VOCABULARY (5-7 min)
══════════════════════════════════════════════

Pick 5 SINGLE WORDS the student needs to understand the video OR that are closely
thematically connected to it.

SELECTION RULES:
1. Content words only: nouns, verbs, adjectives, or adverbs.
2. Must be useful in completely different topics — not topic-locked.
3. Pitch difficulty correctly for CEFR ${level}.

For each word provide:
  - IPA phonetics
  - a short definition (max 10 words)
  - one example sentence NOT from the transcript
  - a contextual synonym (leave empty string "" if no simple synonym exists at ${level})
  - 2-3 expressions/collocations that use the word naturally (empty array [] for A1 students)

══════════════════════════════════════════════
STAGE 3 — WATCH & COMPREHEND (8-10 min)
══════════════════════════════════════════════

The student watches the video ONCE, then answers 5 detail questions.

RULES:
- Each question targets ONE specific piece of information. No double-barreled questions.
- Mix question types: 1 true/false/not given, 2 short-answer, 1 inference, 1 cause-and-effect.
- Answerable from the video alone. No outside knowledge required.
- Reference answers: 1-2 sentences max.

══════════════════════════════════════════════
STAGE 4 — DISCUSSION (8-10 min)
══════════════════════════════════════════════

5 discussion questions with teacher follow-up prompts.

CORE PRINCIPLE:
Discussion questions are about the TOPIC, not about the video itself. Do NOT open
questions with "The video says...", "The speaker mentions...", etc.

RULES:
- Use each question type exactly once: personal connection, agree/disagree, hypothetical, comparison, bigger picture.
- Do NOT repeat any theme already used in the warm-up.
- Do NOT ask for factual recall about the video.
- BANNED AI-tell words: "resonate", "navigate", "landscape", "leverage", "dynamics", "paradigm".

══════════════════════════════════════════════
STAGE 5 — LANGUAGE FOCUS (12-15 min)
══════════════════════════════════════════════

Three parts: 5a Matching (8 phrases), 5b Fill-in-the-Blanks (6 sentences), 5c Speaking Practice (5 questions).

PHRASE SELECTION:
Extract exactly 8 phrases from the transcript. ONLY idioms and phrasal verbs — no collocations.
An idiom = non-literal, figurative. A phrasal verb = verb + particle with non-literal meaning.

For 5a Matching: each phrase gets one clear meaning (max 12 words).
For 5b Fill-in-the-Blanks: 6 sentences using 6 of the 8 phrases, set in everyday scenarios unrelated to the video.
For 5c Speaking Practice: 5 personal questions, each targeting ONE phrase (bolded with **asterisks**), max 15 words each.

══════════════════════════════════════════════
STAGE 6 — WRAP-UP (3-5 min)
══════════════════════════════════════════════

2 reflection prompts (one about content, one about language) and 1 specific homework task.

══════════════════════════════════════════════
OUTPUT JSON ONLY — no markdown, no explanation, no code fences:
══════════════════════════════════════════════
{
  "title": "Short engaging lesson title",
  "topic": "1-3 word topic label",
  "teacherNotes": "2-3 sentence teacher-facing summary",
  "estimatedMinutes": 50,
  "warmUp": [{ "id": 1, "question": "question (max 20 words)" }],
  "preTeach": [{
    "term": "single word",
    "type": "noun",
    "phonetics": "/fəˈnetɪks/",
    "definition": "max 10 words",
    "exampleSentence": "Example not from transcript",
    "synonym": "contextual synonym or empty string",
    "expressions": ["collocation 1", "collocation 2"]
  }],
  "detailQuestions": [{ "id": 1, "question": "detail question", "answer": "1-2 sentence reference answer" }],
  "discussion": [{ "id": 1, "question": "discussion question (max 30 words)", "followUp": "follow-up (max 20 words)" }],
  "phrases": [{ "term": "drop the ball", "type": "idiom", "meaning": "to fail at a responsibility" }],
  "fillBlanks": [{ "id": 1, "sentence": "sentence with ________", "answer": "phrase" }],
  "speakingPractice": [{ "id": 1, "question": "question with **bolded phrase**", "targetPhrase": "phrase" }],
  "wrapUp": [{ "id": 1, "prompt": "reflection prompt" }],
  "homework": { "task": "specific homework description", "type": "writing" }
}

COUNTS (strict — no exceptions):
- warmUp: exactly 3 items
- preTeach: exactly 5 items (type: "noun", "verb", "adjective", or "adverb")
- detailQuestions: exactly 5 items
- discussion: exactly 5 items
- phrases: exactly 8 items (type: "idiom" or "phrasal verb" ONLY)
- fillBlanks: exactly 6 items
- speakingPractice: exactly 5 items
- wrapUp: exactly 2 items
- homework: exactly 1 item

Return ONLY valid JSON. No markdown. No explanation. No code fences.`
}
