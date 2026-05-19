import { StudentProfile, BlockLesson } from '../../types/lesson-template';

// ─── Lesson structure categories ────────────────────────────────────────────
// Each category has 5 preset module sequences.
// Code picks one randomly — the AI never chooses the structure, only fills the content.

export const STRUCTURES = {
  // ── Speaking ─────────────────────────────────────────────────────────────
  speaking: [
    // S1 — Warm then phrases-led: ease in, then key phrases before dialogue
    ['warm-up', 'useful-language', 'dialogue', 'listening-true-false', 'matching-qa', 'roleplay', 'homework-writing'],
    // S2 — Cold open with vocab: dive straight into vocabulary cards, no warm-up
    ['vocabulary-cards', 'dialogue', 'listening-mcq', 'grammar-focus', 'discussion', 'homework-writing'],
    // S3 — Warm then lean: no listening, straight to debate after comprehension
    ['warm-up', 'vocabulary-match', 'dialogue', 'matching-qa', 'debate', 'homework-writing'],
    // S4 — Cold open with expressions: idioms first, then the dialogue that uses them
    ['useful-expressions', 'dialogue', 'listening-true-false', 'talking-point', 'homework-writing'],
    // S5 — Warm then language-in-context: functional phrases, then vocab, then production
    ['warm-up', 'language-in-context', 'vocabulary-cards', 'dialogue', 'matching-qa', 'roleplay', 'homework-writing'],
  ],
  // ── Reading ───────────────────────────────────────────────────────────────
  reading: [
    // R1 — Warm then scan + skim
    ['warm-up', 'vocabulary-match', 'reading-article', 'reading-scan', 'skim-main-idea', 'discussion', 'homework-writing'],
    // R2 — Cold open: vocab cards before reading, then deep in-text vocabulary work
    ['vocabulary-cards', 'reading-article', 'vocabulary-in-text', 'matching-qa', 'debate', 'homework-writing'],
    // R3 — Warm then scan + gap-fill
    ['warm-up', 'vocabulary-match', 'reading-article', 'reading-scan', 'gap-fill', 'discussion', 'homework-writing'],
    // R4 — Cold open with phrases: see the language first, then encounter it in the article
    ['useful-language', 'reading-article', 'skim-main-idea', 'reading-scan', 'roleplay', 'homework-writing'],
    // R5 — Warm then in-text vocabulary + error detection
    ['warm-up', 'vocabulary-cards', 'reading-article', 'vocabulary-in-text', 'find-the-mistake', 'talking-point', 'homework-writing'],
  ],
  // ── Vocabulary ────────────────────────────────────────────────────────────
  vocabulary: [
    // V1 — Warm then cards → gap-fill → error detection → functional language
    ['warm-up', 'vocabulary-cards', 'gap-fill', 'find-the-mistake', 'language-in-context', 'discussion', 'homework-writing'],
    // V2 — Cold open: straight into vocabulary match, then ordering and production
    ['vocabulary-match', 'ordering', 'gap-fill', 'useful-language', 'roleplay', 'homework-writing'],
    // V3 — Warm then match → gap-fill → correction → dialogue (lexis in real use)
    ['warm-up', 'vocabulary-match', 'gap-fill', 'sentence-correction', 'dialogue', 'homework-writing'],
    // V4 — Warm then phrasal verbs → error detection → expressions → discuss
    ['warm-up', 'phrasal-verbs', 'gap-fill', 'find-the-mistake', 'useful-expressions', 'discussion', 'homework-writing'],
    // V5 — Cold open: cards immediately, then language-in-context shows them in use
    ['vocabulary-cards', 'language-in-context', 'gap-fill', 'talking-point', 'homework-writing'],
  ],
  // ── Grammar ───────────────────────────────────────────────────────────────
  grammar: [
    // G1 — Warm then cards → grammar → gap-fill → correction
    ['warm-up', 'vocabulary-cards', 'grammar-focus', 'gap-fill', 'sentence-correction', 'discussion', 'homework-writing'],
    // G2 — Cold open with grammar: encounter the structure cold, then apply in dialogue
    ['grammar-focus', 'find-the-mistake', 'gap-fill', 'dialogue', 'discussion', 'homework-writing'],
    // G3 — Warm then grammar → errors → phrases → dialogue
    ['warm-up', 'grammar-focus', 'find-the-mistake', 'useful-language', 'dialogue', 'homework-writing'],
    // G4 — Warm then cards → grammar → ordering → gap-fill
    ['warm-up', 'vocabulary-cards', 'grammar-focus', 'ordering', 'gap-fill', 'discussion', 'homework-writing'],
    // G5 — Cold open with language-in-context: see patterns in use before the grammar rule
    ['language-in-context', 'grammar-focus', 'sentence-correction', 'gap-fill', 'talking-point', 'homework-writing'],
  ],
  // ── Professional ─────────────────────────────────────────────────────────
  professional: [
    // P1 — Warm + comprehensive: phrases + vocab, dialogue, listening, roleplay
    ['warm-up', 'useful-language', 'vocabulary-match', 'dialogue', 'listening-true-false', 'matching-qa', 'roleplay', 'homework-writing'],
    // P2 — Cold open with phrases: see the professional language before context
    ['useful-language', 'dialogue', 'listening-mcq', 'matching-qa', 'roleplay', 'discussion', 'homework-writing'],
    // P3 — Warm then vocab → phrases → dialogue → debate (no listening)
    ['warm-up', 'vocabulary-match', 'useful-language', 'dialogue', 'matching-qa', 'debate', 'homework-writing'],
    // P4 — Warm then expressions → dialogue → T/F → roleplay
    ['warm-up', 'useful-expressions', 'dialogue', 'listening-true-false', 'matching-qa', 'roleplay', 'homework-writing'],
    // P5 — Cold open with language-in-context: functional patterns first, then apply
    ['language-in-context', 'dialogue', 'matching-qa', 'roleplay', 'talking-point', 'homework-writing'],
  ],
  // ── Writing ───────────────────────────────────────────────────────────────
  writing: [
    // W1 — Phrases-led: study the target language, correct it, then produce
    ['warm-up', 'useful-language', 'sentence-correction', 'writing-task', 'homework-writing'],
    // W2 — Grammar-led: master the structure, then write using it
    ['warm-up', 'grammar-focus', 'find-the-mistake', 'writing-task', 'homework-writing'],
    // W3 — Critique and write: analyse weak examples, learn the conventions, then write
    ['warm-up', 'find-the-mistake', 'language-in-context', 'writing-task', 'homework-writing'],
    // W4 — Correction-led: study common errors in this writing type, then write accurately
    ['warm-up', 'sentence-correction', 'useful-language', 'gap-fill', 'writing-task', 'homework-writing'],
    // W5 — Cold open: language patterns straight away, then write
    ['language-in-context', 'grammar-focus', 'sentence-correction', 'writing-task', 'homework-writing'],
  ],
} as const

export function selectStructure(communicativeNeed: string, lessonTitle?: string): { category: string; modules: string[] } {
  const combined = `${communicativeNeed} ${lessonTitle ?? ''}`.toLowerCase()
  let category: keyof typeof STRUCTURES

  if (/\bwrit[ei]|\bdraft|\bcompos[ei]|\bdocument\b|\bsummariz|\brecord\b|\bcompil[ei]|\bannotat|\breport\b/.test(combined)) {
    category = 'writing'
  } else if (/grammar|tense|structure|clause|verb form|syntax|accuracy/.test(combined)) {
    category = 'grammar'
  } else if (/read|article|text|comprehens|passage/.test(combined)) {
    category = 'reading'
  } else if (/vocabular|terminolog|word|idiom|phrase|expression|collocat|phrasal/.test(combined)) {
    category = 'vocabulary'
  } else if (/email|present|negotiat|pitch|meeting|professional|business|communicat|colleague|stakeholder|client|proposal|brief/.test(combined)) {
    category = 'professional'
  } else {
    category = 'speaking'
  }

  const options = STRUCTURES[category]
  const chosen = options[Math.floor(Math.random() * options.length)]
  return { category, modules: [...chosen] }
}

export function buildModularLessonPrompt(
  student: StudentProfile,
  lesson: BlockLesson,
  duration: 25 | 50,
  roles: string[],
  levelGuide: string,
  cefrVocabGuide: string,
  vocabularyContextSection: string,
  /** Test-only: force a specific structure instead of random selection */
  _testStructure?: { category: string; modules: string[] }
): string {
  const { category, modules } = _testStructure ?? selectStructure(lesson.communicativeNeed, lesson.title)

  // For 25-min lessons: trim to first + 3 middle + homework-writing
  const selectedModules = duration === 25
    ? [modules[0], ...modules.slice(1, -1).slice(0, 3), 'homework-writing']
    : modules

  const writingLessonRules = category === 'writing' ? `
WRITING LESSON DISCIPLINE — applies to every module in this lesson:
- vocabulary-cards: The student is ${student.level}, background in ${student.occupation || 'their professional field'}. Include ONLY field-specific terminology they would encounter in real professional documentation — precise terms that a native speaker at ${student.level} would need to look up or deliberately learn. NEVER include basic professional words they would have known before their first week in the role. Ask yourself: "Would a ${student.level} professional already know this word?" If yes, replace it with something more precise and domain-specific.
- language-in-context: Documentation-register phrases ONLY — the kind written inside real documents, not spoken in meetings. Correct type: "This method is intentionally...", "Note: this behaviour is by design because...", "Deprecated as of version...", "See also:", "This parameter is required when...", "For reference:", "This value defaults to...", "As of [version]..." — phrasing a writer uses in the document itself. BANNED: generic business phrases ("fosters collaboration", "reduces the barrier to", "provides context", "adds value", "ensures clarity") — these are filler, not writing conventions.
- find-the-mistake: Sentences must demonstrate errors in WRITING QUALITY specific to the document type — wrong register, over-vague explanation, unexplained abbreviations, passive where direct is needed, hedging language inappropriate for documentation, unnecessary preamble. NOT generic grammar mistakes.
- writing-task: Specify the exact document type, format, and technical audience. The student must produce something they could realistically submit or commit to a real project. Include specific professional constraints (word count, format, target reader). Planning notes must be actionable steps toward that specific output.
` : ''

  return `Expert ${student.targetLanguage} instructor. Generate a modular lesson as JSON.

STUDENT: ${student.name}, ${student.level}, ${student.ageGroup}
Goals: ${student.endGoals} | Occupation: ${student.occupation || 'Professional'} | Weaknesses: ${student.weaknesses || 'General'}
LESSON: ${lesson.title} | Objective: ${lesson.communicativeNeed} | Vocabulary seed: ${lesson.keyVocabulary.join(', ')} | Grammar: ${lesson.grammarFocus} | Activity: ${lesson.mainActivity}
Roles available: ${roles.join(', ')}
${vocabularyContextSection ? vocabularyContextSection + '\n' : ''}

RULES:
- ALL content in ${student.targetLanguage} (JSON keys and type values stay in English)
- NO em dashes (—). BANNED words: "resonate","navigate","landscape","leverage","dynamics","paradigm","mitigate","jeopardize","escalate","bottleneck","trade-off","iron out","flag","stakeholder","circle back"
- Real names only in dialogues — NEVER bracket placeholders

${writingLessonRules}
MODULE TYPES:
- vocabulary-cards: single words, bare headword only ("forthcoming" not "to be forthcoming"). CEFR gate: assign every word its CEFR band — below ${student.level} → replace.
- vocabulary-match: single words, collocations, idioms, phrasal verbs — teachable meaning units. No discourse markers, connectors, or sentence frames (those go in useful-language). Never in the same lesson as vocabulary-cards.
- useful-language: multi-word functional phrases (≥2 words), specific to this topic, at or above ${student.level}. Never generic. Never single words.
- useful-expressions: genuine idioms only — meaning NOT derivable from the individual words ("get cold feet" ✓, "get a job" ✗). Every entry needs a fixed memorisable completion. Complete standalone phrases ("To be fair,") go in useful-language instead.
- language-in-context: multi-word phrases with a specific communicative function. Not vocabulary.
- phrasal-verbs: verb + particle, NON-LITERAL meaning only.

DIALOGUE: natural professional register — idioms, phrasal verbs, colloquial language throughout, not just in small talk. Level: ${student.level}. Small talk: ≥2 genuine off-topic turns before the main topic; no sport/weather/weekend defaults. 8-12 turns total, one imperfect moment, one pushback, one emotional beat. Contractions. Varied turn length. ${student.name} drives resolutions — the other character creates pressure. Multi-speaker: ${student.name} speaks after every non-student turn. If useful-language/expressions present: every phrase appears naturally in the dialogue, max 1 per turn, spread across characters.

WARM-UP: 3-4 questions, easy enough for a tired ${student.level} student to answer in 20 seconds. Every question must be specific to this lesson — test: could it appear unchanged in a lesson on a completely different topic? If yes, rewrite. Banned: topic-agnostic work questions, non-expert framing ("explain X to a layperson"), procedural ("what is your process"), misconception ("what do people get wrong"), survey style ("how do you typically"), presupposed events, learner framing.

DISCUSSION/TALKING-POINT: personal and experiential ("tell me about a time you..."). Answerable using only language already in this lesson. Banned: meta questions about language or the lesson, non-expert framing, abstract synthesis, procedural questions.

GAP-FILL: sentence field = the sentence with ___ only. No hints, no answers inside the sentence.
DEBATE: 'topic' = one-sentence dilemma. 'sideA'/'sideB' = direct opposites.
ROLEPLAY: concrete details (numbers, names, deadlines). Non-student role has ≥3 specific behaviours. phrasesToUse lists only phrases that fit naturally in the scenario.
LESSON COHERENCE: dialogue and roleplay demonstrate the target skill successfully — a rapport lesson shows rapport built, a negotiation lesson ends in a successful negotiation.

CEFR FILTER: assign every vocabulary term, idiom, and expression a CEFR band before including it anywhere in the lesson. Below ${student.level} → replace. Applies to dialogue and discussion questions too.
VOCABULARY MATCH terms: must be genuinely non-guessable lexical items. Transparent compounds, descriptive phrases, discourse markers, and sentence frames are all banned.
TIMING: real classroom time — dialogue: 1.5 min/100 words + 2 min setup; comprehension: 1 min/question; gap-fill: 1 min/sentence; roleplay: min 5 min; warm-up: 1 min/question. Total = ${duration}.
TUTOR NOTES: every module. No filler. Required: predict a likely error based on ${student.nativeLanguage}, name the language point tested, give a concrete teacher action.

STRUCTURE DISCIPLINE — CRITICAL: Generate ONLY the modules listed in the pre-selected structure: ${selectedModules.join(', ')}. Do NOT add, insert, or substitute any module not in this list. If the structure does not include vocabulary-cards, do NOT generate a vocabulary-cards module under any name. If the structure does not include vocabulary-match, do NOT generate a vocabulary-match module. NEVER include both vocabulary-cards AND vocabulary-match in the same lesson — they teach the same words twice. If both appear in the structure list below, it is a data error — default to vocabulary-match only and omit vocabulary-cards.

HOMEWORK AND TUTOR NOTES — module references: NEVER reference a module that does not exist in this lesson's structure (${selectedModules.join(', ')}). If the homework says "use phrases from the Key Phrases module" but there is no useful-language module in this lesson, rewrite the homework to list the phrases explicitly instead.

${levelGuide}
${cefrVocabGuide}

TUTOR NOTES: Each module must have a tutorNotes field. BANNED — these are filler and add zero teaching value: "Encourage ${student.name} to share personal anecdotes", "Facilitate the dialogue", "Ensure ${student.name} understands the context", "Encourage ${student.name} to reflect on his experiences." Any note containing only "encourage", "facilitate", or "ensure understanding" without specifics is filler — rewrite it.
REQUIRED — tutor notes must be specific interventions tied to this student and this module:
- Predict a likely error based on the student's native language (${student.nativeLanguage}): e.g., if Spanish L1 and present perfect is in the dialogue, note "Spanish L1 speakers often use simple past where present perfect is needed — recast and elicit self-correction if this happens."
- Name the specific language point being tested in this module and what to watch for.
- Give a concrete action: not "encourage use of vocabulary" but "if ${student.name} paraphrases instead of using the target phrase, point to it on screen and ask them to retry the turn."

MODULE TITLES — CRITICAL: The title field of every module must be EXACTLY the string shown below for its type. No rewording, no descriptive additions, no creative variation. A warm-up titled "Professional Context Warm-up" or "Warm-up Discussion" is WRONG. A homework titled "Drafting a Formal Report" is WRONG. A vocabulary-match titled "Technical and Professional Vocabulary" is WRONG. Use the exact string.

The ONLY exceptions are dialogue (append a scene title) and reading-article (append an article title):

warm-up → "Warm-up"
vocabulary-cards → "Vocabulary"
vocabulary-match → "Vocabulary Match"
useful-language → "Key Phrases"
useful-expressions → "Useful Expressions"
language-in-context → "Language in Context"
dialogue → "Dialogue - [scene title, e.g. 'Dialogue - The Budget Review']"
matching-qa → "Comprehension"
reading-article → "Reading - [article title]"
reading-scan → "Reading Comprehension"
skim-main-idea → "Main Idea"
roleplay → "Roleplay"
discussion → "Discussion"
debate → "Debate"
talking-point → "Talking Point"
gap-fill → "Gap Fill"
find-the-mistake → "Find the Mistake"
sentence-correction → "Sentence Correction"
ordering → "Ordering"
grammar-focus → "Grammar Focus"
phrasal-verbs → "Phrasal Verbs"
vocabulary-in-text → "Contextual Vocabulary"
homework-writing → "Homework"
writing-task → "Writing Task"
listening-true-false → "Listen and Decide: True or False?"
listening-mcq → "Listening Comprehension"

─────────────────────────────────────────────────
LESSON STRUCTURE (pre-selected — do not change)
Category: ${category}
Modules in order: ${selectedModules.join(' → ')}
timeMinutes must sum to exactly ${duration}
─────────────────────────────────────────────────

CRITICAL SCHEMA RULES — exact shapes required or UI breaks:
- vocabulary-match → generate exactly 10 pairs. Always 2 groups of 5 pairs each. No exceptions.
  EVERY term MUST appear naturally in the lesson dialogue or reading passage — do NOT invent terms absent from other modules.
  Each pair: { sentence, term, definition }
  sentence = a complete, natural sentence where the term is used in realistic context
  term = the key word or phrase that appears in the sentence (shown bold in UI)
  definition = what the term means — written as a short phrase, NOT a sentence
  NEVER generate bare term→definition without a sentence. NEVER include the term itself in the definition.
  Example: { "sentence": "She really blew it during the presentation by arriving unprepared.", "term": "blew it", "definition": "failed to take advantage of an opportunity" }
  ACCURACY RULES (apply before outputting every pair):
  - The term must be used correctly per its actual definition — not just topically associated. Mentally substitute the definition into the sentence and confirm it still makes sense.
  - Technical terms must reflect real-world professional usage. Do not apply a term to objects or contexts it does not govern.
  - Each definition must match the specific term, not the sentence's broader meaning or social function.
  - Definitions must be distinct enough that only one answer is clearly correct. If two definitions are near-synonyms, replace one.
  - Each sentence must contain exactly one plausible target term — avoid sentences where multiple listed terms could be underlined.
  - After drafting all five pairs in a group, cross-check every term against every definition to confirm there is exactly one correct match per item. If any pair is ambiguous, replace it before outputting.
  - JUXTAPOSITION CHECK: Read all five definitions together as a list. No two definitions may share the same opening verb ("to maintain...", "to keep..."), overlap in semantic territory, or be near-synonyms. A student scanning the list must be able to immediately tell each definition apart from the others. If any two definitions could be confused, rewrite the weaker one to make the contrast obvious.
  - Prioritise accuracy over fluency — a precise but plain sentence is better than a polished but technically wrong one.
- useful-language → phrases MUST be objects [{phrase, example}] NEVER strings
- language-in-context → phrases MUST be objects [{phrase, function, example?}] NEVER 'analysis' key
- dialogue → MUST have: setting, characters:[{name,role?}], dialogue:[{character,text}]. NEVER a 'text' blob
- roleplay → roles MUST be objects [{name, description, keyPoints?}] NEVER strings. Use 'situation' not 'scenario'
- reading-article → text must be 3-5 substantial paragraphs separated by \\n\\n. Minimum 300 words. Include a title.
- image-discussion → one imagePlaceholder with detailed visual description for AI image generation

MODULE LIBRARY (only generate the modules listed in your structure above):
warm-up               → { questions: string[3-4] }
image-discussion      → { imagePlaceholders: [{label, description}], questions: string[] }
  label = a precise 2-4 word Pexels search query that would return a photo directly relevant to the student's occupation ("${student.occupation}") and this lesson's context. NEVER generic ("factory workers", "team meeting", "business discussion"). Good: "aerospace carbon fiber production", "pressure vessel inspection", "COPV composite manufacturing". The label must be specific enough that Pexels returns an industry-relevant image, not a generic workplace photo.
vocabulary-cards      → { vocabulary: [{word, partOfSpeech, phonetics, definition, example, synonym?}×6] }
  SINGLE WORDS only. No phrases, no collocations. Word appears in the lesson dialogue.
vocabulary-match      → { instructions, groups: [{label, pairs:[{sentence,term,definition}×5]}×2] }
  Always exactly 2 groups of 5 = 10 pairs total.
  NEVER appears in the same lesson as vocabulary-cards. Terms can be single words or multi-word collocations.
useful-expressions    → { context?, expressions: [{full: string, stem: string}×6-10] }
  FIXED EXPRESSIONS and IDIOMS only — non-literal, multi-word, specific to this lesson topic.
  stem = the expression up to and including the key idiom, ending with "....." — student completes it.
  Example format only (never reuse): { full: "She really blew it in that meeting.", stem: "She really blew it ....." }
  Every expression must be topic-specific. NEVER reuse any phrase shown in this prompt.
useful-language       → { phrases: [{phrase:string, stem:string, example:string}×4-6] }
  MULTI-WORD PHRASES only — functional chunks specific to this lesson's scenario. Minimum 2 words per phrase.
  NEVER generic phrases usable in any lesson. NEVER single words.
  stem = phrase with the last 1-3 content words hidden; the stem must contain at least 3 visible words so the student can identify which phrase it is. MINIMUM VISIBLE = 3 words. Examples: "push back the meeting date" → "push back the ….." (3 visible) | "due to unforeseen delays" → "due to unforeseen ….." (3 visible) | "catch up on the backlog" → "catch up on the ….." (4 visible). WRONG: "push back ….." (only 2 visible — student cannot identify the phrase). WRONG: stem that shows fewer words than the rule allows.
  Every phrase must be specific enough that it would sound odd in a completely different lesson.
  FRAMING: this module is a PRESENTATION and INTRODUCTION activity, not a memory drill. The student is encountering these phrases for the first time (or near-first time). The instructions field must frame it as "practise saying each phrase" or "study the phrase, then complete the stem" — NEVER "recall from memory" or "complete from memory." Every phrase listed MUST have its own stem entry — a phrase without a stem is a schema error.
language-in-context   → { phrases: [{phrase:string, function:string, example?:string}×4-6] }
  PHRASES only — never single words. Each has a clear communicative function (softening, hedging, emphasising, etc.).
phrasal-verbs         → { pairs: [{verb, meaning, example?}×6-8], discussionQuestions?:string[] }
  PHRASAL VERBS only — verb + particle, NON-LITERAL meaning. Verify each entry is genuinely non-literal.
gap-fill              → { instructions, sentences: [{sentence(use ___ for blank), answer}×6-10] }
  GAP-FILL CONTENT: test vocabulary words or grammar structures from this lesson — NEVER the same phrases already listed in a useful-language or useful-expressions module. The blank should target a single word or short form (verb tense, preposition, collocation) — not a complete multi-word phrase the student just read in a phrase list.
complete-the-sentence → { instructions, questions: [{stem, options:string[4], answer:number(0-indexed)}×4-6] }
find-the-mistake      → { instructions, sentences: [{incorrect, correct, explanation?}×10] }
  EXACTLY 10 sentences — no fewer. Every sentence MUST have a real, visible error. Vary error types: tense, preposition, article, subject-verb agreement, word order, collocation, gerund/infinitive, countable/uncountable, conditional, relative clause. Each error type appears at most once. Label sentences 1-10.
ordering              → { instructions, sentences: [{scrambled, correct}×5-8] }
sentence-correction   → { sentences: [{incorrect, correct, errorType, explanation}×8-10] }
grammar-focus         → { topic, explanation, table?:{headers,rows}, examples:[{label,sentence}×3-5], practice:{questions:[{stem,options:string[4],answer:number}×4-6]} }
dialogue              → { setting, characters:[{name,role?}×2], dialogue:[{character,text}×8-12] }
listening-true-false  → { questions:[{statement, answer:boolean, note?}×6-8] }
  LISTENING T/F: always immediately follows the dialogue it tests. Statements must be about specific facts, decisions, or details from the dialogue — NOT paraphrases of obvious facts. Mix true and false roughly 50/50. The 'note' field (tutor only) explains why the answer is true or false with a brief quote or reference. Title: "Listen and decide: True or False?"
listening-mcq         → { questions:[{question, options:string[4], answer:number(0-indexed)}×4-6] }
  LISTENING MCQ: always immediately follows the dialogue it tests. Questions target implied meaning, speaker attitude, or specific detail — NOT surface recall. Distractors must be plausible (e.g. based on words that appeared in the dialogue). Title: "Listen and answer the questions."
reading-article       → { title, text(min 300 words, paragraphs separated by \\n\\n), glossary?:[{term,definition}] }
reading-scan          → { instructions, questions:[{question,answer}×4-8] }
vocabulary-in-text    → { instructions, items:[{definition, partOfSpeech, paragraph, answer}×8-10] }
  Generate 8-10 items. Every item MUST include: paragraph number (1, 2, 3...) where the word appears, and partOfSpeech (noun / verb / adjective / adverb / idiom / phrase). Words must be distributed across ALL paragraphs of the reading — at least one word from each paragraph, never more than 2 from any single paragraph. Idioms and fixed expressions from the text count as valid items. The student reads the definition, finds the word in the specified paragraph.
skim-main-idea        → { options:string[4], answer:number(0-indexed), explanation? }
matching-qa           → { pairs:[{question,answer}×4-6] }
  When matching-qa immediately follows a dialogue or reading-article: write 4-6 comprehension questions about that content. Questions must probe character decisions, reasoning, implications, and language choices — NOT trivial recall ("Who said X?"). The answer must be a complete, specific response the tutor can give. Good example: Q: "Why did Marcus push back on the supplier's first offer?" A: "He felt the discount didn't reflect the volume they were committing to and wanted to anchor a better rate."
roleplay              → { situation, roles:[{name,description,keyPoints?:string[]}×2], phrasesToUse?:string[] }
talking-point         → { studentA:{title,questions:string[3-4]}, studentB:{title,questions:string[3-4]} }
  BOTH studentA and studentB are REQUIRED — omitting studentB is a schema error. studentA = student discusses the topic from their own perspective. studentB = student takes the tutor's perspective or a different stakeholder viewpoint on the same topic. Each card must have a distinct title and 3-4 different questions. Questions must be experiential ("Tell me about a time...", "Have you ever..."), never analytical ("Why is X important?").
discussion            → { questions:string[4-6] }
debate                → { topic, sideA:{label,points:string[3-5]}, sideB:{label,points:string[3-5]} }
homework-writing      → { task, prompts:string[3-5], wordCount?, instructions? }
  wordCount must always include the unit: "approximately 150 words" or "150-200 words" — NEVER just "approximately 150" or "150-200" without "words".
writing-task          → { brief, planningNotes?:string[3-5], modelText?:string, wordCount?:string, format?:string }
  brief = exact task: what to produce, for whom, in what register (e.g. "Write a README section explaining how to set up the service, addressed to a new developer joining the team")
  planningNotes = 3-5 bullet points guiding what to include — each should be specific to this task's content, not generic advice
  modelText = OPTIONAL — only for A2-B1 or highly specific formats. Max 80 words. Omit for B2+.
  wordCount = target with unit: "150-200 words"
  format = document type: "README file", "technical specification", "email", "memo", "report section" etc.

JSON OUTPUT:
{
  "title": "${lesson.title}",
  "lessonType": "modular",
  "category": "${category}",
  "objective": "[one sentence in ${student.targetLanguage}, max 120 chars]",
  "difficulty": ${student.level === 'beginner' ? 3 : student.level === 'elementary' ? 4 : student.level === 'intermediate' ? 6 : 8},
  "duration": ${duration},
  "skills": ["Speaking", "Vocabulary"],
  "modules": [
    {
      "type": "[module type]",
      "title": "[module title in ${student.targetLanguage}]",
      "timeMinutes": [number],
      "tutorNotes": "[specific tutor action in ${student.targetLanguage}]",
      "content": { ... }
    }
  ],
  "teachingNotes": "[overall lesson notes for tutor in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`
}
