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
  context?: string
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
  type: 'noun' | 'verb' | 'adjective' | 'adverb'
  phonetics: string
  definition: string
  exampleSentence: string
  synonym?: string
  expressions?: string[]
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

function buildTranscriptPrompt(transcriptText: string, level: CEFRLevel, context?: string) {
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
GLOBAL LANGUAGE QUALITY RULES — APPLY EVERYWHERE
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

TONE — read every question out loud before keeping it:
  - Does it sound like something you'd ask a friend over coffee? If not — rewrite.
  - BANNED words and phrases that scream "AI wrote this":
    "resonate", "navigate", "landscape", "leverage", "dynamics", "paradigm",
    "facilitate", "implications", "aspects", "in terms of", "when it comes to",
    "have you ever found yourself", "what role does X play".
  - No business-school or essay-exam phrasing. No jargon.
  - Use SHORT, CASUAL words. Contractions are good. Dashes are fine.
  - If the question sounds like it belongs on a corporate training slide — kill it.

NO OVERLAP WITH DISCUSSION:
  Warm-up and discussion questions (Stage 4) must cover DIFFERENT angles.
  If the warm-up asks about brand loyalty, discussion must not also ask about loyalty.
  Check both sets before finalizing.

BAD warm-up questions:
  ❌ "Do you like cars?" — closed, one-word answer
  ❌ "What do you know about Volkswagen's profits?" — requires video knowledge
  ❌ "What is your opinion of the automotive industry?" — abstract, impersonal, exam-like
  ❌ "If you were leading a traditional industry, how would you balance legacy with disruption?"
     — too long, too abstract, business-school tone
  ❌ "If you could change one thing about how your workplace handles creativity, what would it be?"
     — professional/strategic, not personal or fun
  ❌ "Have you ever bought something like a gadget or appliance that turned out to be less
     impressive than expected, and do you prefer locally made products?" — two questions in one

GOOD warm-up questions:
  ✅ "Have you ever bought something you regretted because the brand turned out to be overhyped?"
  ✅ "What matters more to you when choosing a product — brand reputation or price?"
  ✅ "If you could only watch one TV show for the rest of your life, what would it be — and why?"
  ✅ "Have you ever been so bored in a meeting or class that you started doodling or daydreaming?"

══════════════════════════════════════════════
STAGE 2 — PRE-TEACH KEY VOCABULARY (5-7 min)
══════════════════════════════════════════════

Pick 5 SINGLE WORDS the student needs to understand the video OR that are closely
thematically connected to it.

TRANSCRIPT-FIRST, THEN SUPPLEMENT:
- First, try to find all 5 words from the transcript.
- If the transcript is too short, too simple, or too repetitive to supply 5 genuinely
  teachable words at CEFR ${level}, SUPPLEMENT with words that are:
    • thematically connected to the video's topic (e.g. a video about office boredom
      → "enthusiasm", "distraction", "monotonous")
    • level-appropriate for ${level}
    • would help the student TALK about the video afterward
- NEVER scrape the bottom of the barrel just to stay inside the transcript.
  A strong word from outside the transcript is always better than a weak word from inside it.

SELECTION RULES:
1. Content words only: nouns, verbs, adjectives, or adverbs.
2. Must be useful in completely different topics — not topic-locked.
3. Pitch difficulty correctly for CEFR ${level}:
   - A1/A2: genuinely unknown basics (e.g. "profit", "rival", "crisis")
   - B1/B2: mid-frequency news/general words (e.g. "plunge", "overtake", "urgency", "dominant")
   - C1/C2: sophisticated or formal vocabulary (e.g. "complacency", "erode", "trajectory")
4. Apply ALL global disqualifiers. Reject proper nouns, topic-locked technical terms,
   and any word most learners at ${level} already know.

SELF-CHECK before keeping a word:
  → "Will this word appear in a novel, news article, or conversation about a totally different topic?"
     If NO → reject.
  → "Do most ${level} learners already know this?"
     If YES → reject and find something harder.
  → "Is this just a common verb being presented as if it were difficult?"
     (e.g. "bounce", "grab", "watch", "look", "walk" — these are NOT vocabulary words)
     If YES → reject.
  → "Can the student decode this from word parts?" (e.g. "unreadable" = un + read + able)
     If YES → reject — transparent formations are not teachable vocabulary.

LENGTH RULE for definitions: Maximum 10 words. Simple and direct.
  ❌ "a promise or firm decision to do something, or the state of being dedicated to a cause"
  ✅ "a strong promise to do something"

  ❌ "to change your ideas or behaviour to deal with new situations or conditions"
  ✅ "to change in order to deal with new conditions"

For each word provide:
  - IPA phonetics (e.g. "/ˈklæsɪfaɪd/")
  - a short definition (max 10 words)
  - one example sentence NOT from the transcript
  - a contextual synonym (leave empty string "" if no simple synonym exists at ${level})
  - 2-3 expressions/collocations that use the word naturally (empty array [] for A1 students)
    e.g. for "commit": ["commit a crime", "commit to a plan", "fully committed"]

══════════════════════════════════════════════
STAGE 3 — WATCH & COMPREHEND (8-10 min)
══════════════════════════════════════════════

The student watches the video ONCE, then answers 5 detail questions.

RULES:
- Each question targets ONE specific piece of information. No double-barreled questions.
- Mix question types — use each of these once:
    • 1 true/false question
    • 2 short-answer questions (specific facts, figures, or causes)
    • 1 inference: "What does the speaker mean when they say...?"
    • 1 cause-and-effect: "Why did X happen?"
- Answerable from the video alone. No outside knowledge required.
- Reference answers: 1-2 sentences max.

BAD detail questions:
  ❌ "What challenges does Germany face?" — vague, too many possible answers
  ❌ "What is mentioned regarding e-mobility strategy and infrastructure?" — double-barreled
  ❌ "Is the German car industry in trouble?" — obvious before watching

GOOD detail questions:
  ✅ "True or false: Porsche's profits fell by around 50% this year."
     Answer: False — they fell by 95%.
  ✅ "Why are German carmakers specifically losing market share in the US?"
     Answer: Because of tariffs.
  ✅ "What does the speaker mean when he says companies 'didn't feel the need to invest in e-mobility'?"
     Answer: They were making too much money from diesel cars to feel any pressure to change.

══════════════════════════════════════════════
STAGE 4 — DISCUSSION (8-10 min)
══════════════════════════════════════════════

The student has just watched the video and answered comprehension questions.
Now they react to what they saw — connecting the video's ideas to their own life.

5 discussion questions with teacher follow-up prompts.

CORE PRINCIPLE:
Every question must be SPARKED by something specific in the video — a claim,
a situation, a decision, a surprise. The student should feel like they're
discussing THIS video, not answering generic conversation questions.
But they answer from their own experience and opinions — NOT by recalling video facts.

RULES:
- Use each of these question types exactly once across the 5 questions:
    • Personal connection: "The video talks about X — have you experienced something like that?"
    • Agree/disagree: "The speaker says X — do you agree?"
    • Hypothetical: "If you were in that situation, what would you do?"
    • Comparison: "The video mentions X and Y — which matters more to you?"
    • Bigger picture: "This is about X — do you think it's happening in other areas too?"
- Do NOT repeat any theme or angle already used in the warm-up questions (Stage 1).
- Do NOT ask for factual recall. Wrong: "What did the speaker say about X?"
  Right: "The speaker argues X — does that match what you've seen?"
- Follow-ups push deeper: ask for reasons, real examples, or the opposite viewpoint.
  Do NOT just rephrase the main question.
- Do NOT write leading follow-ups that assume a "correct" answer.

TONE — mandatory for every question:
  - Sound like a teacher who just watched something interesting with a student
    and wants to chat about it — curious, relaxed, genuinely interested.
  - BANNED AI-tell words: "resonate", "navigate", "landscape", "leverage",
    "dynamics", "paradigm", "facilitate", "implications", "factor", "aspects",
    "in terms of", "when it comes to", "what role does X play".
  - NO essay-prompt phrasing: "To what extent...", "Discuss the role of...",
    "What factors contribute to..."
  - Use contractions. Use dashes. Keep it human.

QUESTION LENGTH: Main question max 30 words. Follow-up max 20 words.

BAD discussion questions:
  ❌ "What do you think about the German car industry?" — just asks for a vague opinion
  ❌ "Do you like electric cars?" — closed, shallow, barely connected to the video's point
  ❌ "How does technological disruption impact traditional industries?" — MBA exam, not a chat
  ❌ "To what extent did complacency play a role in the challenges discussed?"
     — essay prompt, nobody talks like this
  ❌ "What factors contribute to a company's ability to navigate change?"
     — pure AI slop, zero personality

GOOD discussion questions with follow-ups:
  ✅ "The speaker says these companies were too comfortable to bother changing —
     have you ever put off fixing something because it was still working OK?"
     Follow-up: "What finally pushed you to act?"
  ✅ "The video shows companies cutting thousands of jobs — if your employer was
     struggling, would you rather take a pay cut or risk layoffs?"
     Follow-up: "What would change your answer?"
  ✅ "The speaker claims some brands lost customers by ignoring what people wanted —
     has a company ever lost you as a customer? What happened?"
     Follow-up: "Could they have done anything to keep you?"

══════════════════════════════════════════════
STAGE 5 — LANGUAGE FOCUS (12-15 min)
══════════════════════════════════════════════

Three parts: 5a Matching, 5b Fill-in-the-Blanks, 5c Speaking Practice.

──────────────────────────────────────────────
PHRASE SELECTION — THE MOST IMPORTANT PART
──────────────────────────────────────────────

Extract exactly 8 phrases from the transcript.

ONLY TWO TYPES ARE ALLOWED:
  1. IDIOMS
  2. PHRASAL VERBS

No collocations. No fixed expressions. No discourse markers. Only idioms and phrasal verbs.

──────────────────────────────────────────────
TYPE 1: IDIOMS
──────────────────────────────────────────────
An idiom is a fixed multi-word expression whose meaning CANNOT be guessed from
the individual words. The meaning is figurative and non-literal.

✅ VALID IDIOMS — the kind you find in the Cambridge Dictionary of Idioms:
   "drop the ball" — nothing to do with balls; means to fail at a responsibility
   "bite the bullet" — nothing to do with bullets; means to endure something difficult
   "burn bridges" — nothing to do with fire; means to permanently damage a relationship
   "on thin ice" — nothing to do with ice; means in a risky or dangerous situation
   "get cold feet" — nothing to do with temperature; means to lose confidence before doing something

❌ NOT idioms — do not label these as idioms:
   "sharp drop" — literal: "sharp" modifies "drop" directly. Not figurative.
   "in trouble" — literal: the words mean exactly what they say.
   "clear strategy" — literal adjective + noun. No figurative layer.
   "feel the need" — generic verb + noun. Not a fixed expression.

──────────────────────────────────────────────
TYPE 2: PHRASAL VERBS
──────────────────────────────────────────────
A phrasal verb is a verb + particle (up, down, out, off, over, away, back, through, into, behind, on)
where the combination has a specific meaning that is different from or more specific than
the verb alone. It must be listed in the Oxford Phrasal Verbs Dictionary or equivalent.

✅ VALID PHRASAL VERBS:
   "catch up" — to reach the same level as others after being behind
   "keep up" — to maintain the same pace or level as others
   "switch back" — to return to a previous system, method, or choice
   "fall behind" — to make less progress than expected or than others
   "give up" — to stop trying
   "burn out" — to become exhausted from overwork
   "take off" — to suddenly become successful or popular
   "back down" — to withdraw from a position or argument

❌ NOT valid phrasal verbs — reject these:
   "be behind in" — "behind" here is a preposition, not a particle. Not a phrasal verb.
   "go on" — too literal, too basic. The verb means exactly what it says.
   "push on" / "push on go on" — garbled transcript speech. Not clean enough to teach.
   "play a role" — "role" is the object; "play" is literal. Not a phrasal verb.
   "feel the need" — "need" is the object. No particle. Not a phrasal verb.
   "look for" — too basic and too literal. Every A1 learner knows this.
   "put in" (effort/hours) — this is a collocation, NOT a phrasal verb.

──────────────────────────────────────────────
PHYSICAL MOVEMENT RULE — CRITICAL
──────────────────────────────────────────────
Verbs describing LITERAL PHYSICAL MOVEMENT are NEVER phrasal verbs or idioms:
   "bounce around" — literal: a ball bouncing. Not idiomatic.
   "bounce away" — literal: something bouncing away. Not idiomatic.
   "head into" / "heading into" — literal: walking into a room. Not idiomatic.
   "walk over" — literal: walking to a location.
   "run out" (of a room) — literal: physically running.
   "jump up" — literal: physically jumping.

If the verb describes something MOVING THROUGH SPACE in the transcript,
it is almost certainly literal and must be rejected.
The only exception is when the phrase has a CLEAR FIGURATIVE meaning
that has nothing to do with movement (e.g. "run out" of time, "jump in" to help).

──────────────────────────────────────────────
LITERALNESS TEST — MANDATORY FOR EVERY CANDIDATE
──────────────────────────────────────────────
Before accepting ANY phrase, ask:
  1. "If I replace each word with its dictionary definition, does the phrase
     still mean the same thing?" If YES → it's literal → REJECT.
  2. "Would a learner who knows each word individually understand this phrase
     without being taught it?" If YES → REJECT.
  3. "Does this phrase describe physical action in the transcript?"
     (e.g. a screensaver bouncing, someone walking into a room)
     If YES → REJECT.

NO DUPLICATES: Never include two forms of the same base verb.
  ❌ "bounce around" + "bounce away" — same verb, both literal
  ❌ "take off" + "take on" — acceptable individually but check variety

──────────────────────────────────────────────
PHRASE SELECTION PROCESS — FOLLOW THIS EXACTLY
──────────────────────────────────────────────

Step 1: Scan the entire transcript and list every candidate phrasal verb and idiom.
Step 2: For each candidate, ask:
  a) Is it a genuine idiom (non-literal, figurative) OR a genuine phrasal verb (verb + particle)?
  b) Is it listed in a major ESL dictionary (Oxford Phrasal Verbs, Cambridge Idioms)?
  c) Can it be used naturally in conversations about cooking, sport, relationships, travel?
  All three must be YES. If any is NO → discard it.
Step 3: From your validated list, select the 8 best items — prioritising variety
  (mix of idioms and phrasal verbs) and usefulness at CEFR ${level}.
Step 4: If the transcript does not contain 8 valid items — AND IT OFTEN WON'T —
  supplement aggressively with phrasal verbs and idioms that are:
    • THEMATICALLY CONNECTED to the video's topic or situations
    • genuinely idiomatic (pass the literalness test)
    • level-appropriate for CEFR ${level}
  For example, a video about workplace boredom might only have 2-3 genuine idioms
  in the transcript. Supplement with related ones like "zone out", "slack off",
  "kill time", "wind down", "goof off" — all thematically connected and teachable.
  NEVER lower your quality standards just to stay inside the transcript.
  A related idiom not in the transcript is ALWAYS better than a literal phrase from it.

NORMALIZATION:
  - Base/infinitive form: "catch up" not "caught up"
  - No articles: "drop the ball" not "drop the balls"
  - Use "one's" only when the idiom requires a possessive: "drag one's feet"

──────────────────────────────────────────────
EXERCISE 5a — MATCHING
──────────────────────────────────────────────
Each phrase gets one clear meaning (max 12 words).
Meanings must be clearly distinct — no near-synonyms across different items.

──────────────────────────────────────────────
EXERCISE 5b — FILL-IN-THE-BLANKS
──────────────────────────────────────────────
6 sentences using 6 of the 8 phrases.

RULES:
- Each sentence has exactly ONE blank: "________". Never write the answer in the sentence.
- The answer is the phrase inflected to fit the sentence grammatically.
- Set each sentence in an EVERYDAY scenario unrelated to the video's topic.
  Use contexts like: sport, relationships, school, health, travel, cooking, work.
- Provide enough context that only one phrase fits naturally.
- The key words of the answer phrase must NOT appear in the surrounding sentence.

GRAMMAR VERIFICATION — mandatory for every sentence:
  1. Write the sentence with the blank.
  2. Insert the answer.
  3. Read the complete sentence aloud mentally.
  4. Is it 100% natural and grammatically correct? If not — rewrite the sentence.

COMMON ERRORS TO AVOID:
  ❌ Answer leaking: "His grades experienced a ________ drop." + answer "sharp drop" → "drop" appears twice.
  ❌ Auxiliary clash: "She did ________ on the project." + answer "drop the ball" → unnatural.
  ❌ Tense mismatch: past context but answer is base form without inflection.
  ❌ Redundancy: surrounding words overlap with the phrase's meaning.

GOOD fill-in-the-blank examples:
  ✅ "After missing a month of training, she worked twice as hard to ________ with the rest of the group."
     Answer: catch up
  ✅ "The whole team was counting on him, but he ________ at the worst possible moment."
     Answer: dropped the ball
  ✅ "She was so exhausted from working seven days a week that she finally ________."
     Answer: burned out

──────────────────────────────────────────────
EXERCISE 5c — SPEAKING PRACTICE
──────────────────────────────────────────────
5 personal questions, each targeting ONE phrase, bolded with **double asterisks**.

RULES:
- About the student's own life: experiences, opinions, habits, relationships.
- The bolded phrase sits naturally inside the question — not bolted on.
- No blanks. The question is complete.
- One different phrase per question.
- MAX 15 WORDS per question. Shorter = better. If it's over 15 words, cut it down.
- The question must make immediate sense — no setup needed, no explaining the scenario.
- Sound like something a friend would casually ask over coffee.
- BANNED phrasing: "Can you describe a situation where...",
  "How do you feel about the idea of...", "Have you ever found yourself...",
  "Imagine you're trying to...", "Has there been a time when you really wanted to...".
  These sound like a survey or a writing exam, not a person.
- BANNED structures: long subordinate clauses, appositives ("perhaps for work or..."),
  multi-part questions joined with "and", conditional chains.
- Use casual, direct language. Contractions and dashes are encouraged.
- If the question sounds like it was generated by a chatbot — rewrite it.
- If a student would need to re-read the question to understand it — rewrite it.

PROCESS:
  1. Pick the phrase.
  2. Think of a real everyday scenario where that phrase naturally comes up.
  3. Write a SHORT, punchy question that includes the phrase.
  4. Count the words. Over 15? Cut it.
  5. Read it aloud. Would you actually say this to someone? If not — rewrite.
  6. Check pronoun agreement with "you": "have you ever **dropped the ball**..." ✅

BAD speaking questions:
  ❌ Too long: "Have you ever had to keep someone on the line for a long time on the phone, perhaps for work or customer service?"
  ❌ Too complex: "If you had an important call that needed to be transferred, who is someone you would trust to put you on with the right person?"
  ❌ Needs explanation: "Imagine you're trying to sell something you really believe in — what's one creative way you might try to sweeten the deal?"
  ❌ Pronoun clash: "Can you think of when **drop the ball** happened?"
  ❌ Generic template: "How do you feel about the idea of **catching up**?"
  ❌ Phrase absent: "Tell me about a time you failed at something."
  ❌ AI survey tone: "Can you describe a time when you had to **catch up** with changes in your professional or personal life?"

GOOD speaking questions:
  ✅ "When's the last time you really **dropped the ball** on something?"
  ✅ "What's something you've been **putting off** for way too long?"
  ✅ "Have you ever **burned out** from doing too much?"
  ✅ "Who's the best person you know at **talking people into** things?"
  ✅ "What kind of behaviour **rubs you the wrong way** at work?"

══════════════════════════════════════════════
STAGE 6 — WRAP-UP (3-5 min)
══════════════════════════════════════════════

2 reflection prompts — open, personal, easy to answer:
  - One about content: what they found interesting or surprising.
  - One about language: a word or phrase they want to use this week.

1 homework task — specific enough that the student knows exactly what to do.
Rotate type across lessons: writing, speaking, or research.
Must require using language from the lesson naturally.

══════════════════════════════════════════════
OUTPUT JSON ONLY — no markdown, no explanation, no code fences:
══════════════════════════════════════════════
{
  "title": "Short engaging lesson title",
  "topic": "1-3 word topic label",
  "teacherNotes": "2-3 sentence teacher-facing summary of the lesson and its goals",
  "estimatedMinutes": 50,
  "warmUp": [
    { "id": 1, "question": "warm-up question (max 20 words, one sentence)" }
  ],
  "preTeach": [
    {
      "term": "single word",
      "type": "noun",
      "phonetics": "/fəˈnetɪks/",
      "definition": "max 10 words",
      "exampleSentence": "Example sentence not from transcript",
      "synonym": "contextual synonym or empty string",
      "expressions": ["collocation 1", "collocation 2"]
    }
  ],
  "detailQuestions": [
    { "id": 1, "question": "detail question", "answer": "1-2 sentence reference answer" }
  ],
  "discussion": [
    { "id": 1, "question": "discussion question (max 30 words)", "followUp": "follow-up (max 20 words)" }
  ],
  "phrases": [
    {
      "term": "drop the ball",
      "type": "idiom",
      "meaning": "to fail at a responsibility at a critical moment"
    }
  ],
  "fillBlanks": [
    {
      "id": 1,
      "sentence": "The whole team was counting on him, but he ________ at the worst possible moment.",
      "answer": "dropped the ball"
    }
  ],
  "speakingPractice": [
    { "id": 1, "question": "Has there ever been a moment at work or school when you felt you'd **dropped the ball** — what happened?" }
  ],
  "wrapUp": [
    { "id": 1, "prompt": "reflection prompt" }
  ],
  "homework": {
    "task": "specific homework description",
    "type": "writing"
  }
}

COUNTS (strict — no exceptions):
- warmUp: exactly 3 items
- preTeach: exactly 5 items (type: "noun", "verb", "adjective", or "adverb")
- detailQuestions: exactly 5 items
- discussion: exactly 5 items
- phrases: exactly 8 items, each 2-5 words (type: "idiom" or "phrasal verb" ONLY)
- fillBlanks: exactly 6 items
- speakingPractice: exactly 5 items
- wrapUp: exactly 2 items
- homework: exactly 1 item

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
    const context = body.context?.trim()

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