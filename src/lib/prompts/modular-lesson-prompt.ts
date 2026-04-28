import { StudentProfile, BlockLesson } from '../../types/lesson-template';

// ─── Lesson structure categories ────────────────────────────────────────────
// Each category has 5 preset module sequences.
// Code picks one randomly — the AI never chooses the structure, only fills the content.

const STRUCTURES = {
  speaking: [
    ['warm-up', 'vocabulary-match', 'dialogue', 'matching-qa', 'roleplay', 'discussion', 'homework-writing'],
    ['warm-up', 'useful-language', 'dialogue', 'matching-qa', 'roleplay', 'talking-point', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'dialogue', 'matching-qa', 'talking-point', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'dialogue', 'matching-qa', 'roleplay', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'dialogue', 'matching-qa', 'roleplay', 'debate', 'homework-writing'],
  ],
  reading: [
    ['warm-up', 'vocabulary-match', 'reading-article', 'reading-scan', 'skim-main-idea', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'reading-article', 'matching-qa', 'vocabulary-in-text', 'debate', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'reading-article', 'reading-scan', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'reading-article', 'skim-main-idea', 'reading-scan', 'debate', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'reading-article', 'matching-qa', 'discussion', 'homework-writing'],
  ],
  vocabulary: [
    ['warm-up', 'vocabulary-cards', 'gap-fill', 'find-the-mistake', 'language-in-context', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'ordering', 'gap-fill', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'gap-fill', 'sentence-correction', 'discussion', 'homework-writing'],
    ['warm-up', 'phrasal-verbs', 'gap-fill', 'find-the-mistake', 'useful-language', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'language-in-context', 'gap-fill', 'talking-point', 'homework-writing'],
  ],
  grammar: [
    ['warm-up', 'vocabulary-cards', 'grammar-focus', 'find-the-mistake', 'sentence-correction', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'grammar-focus', 'gap-fill', 'find-the-mistake', 'discussion', 'homework-writing'],
    ['warm-up', 'grammar-focus', 'gap-fill', 'sentence-correction', 'roleplay', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'grammar-focus', 'ordering', 'gap-fill', 'discussion', 'homework-writing'],
    ['warm-up', 'language-in-context', 'grammar-focus', 'find-the-mistake', 'gap-fill', 'talking-point', 'homework-writing'],
  ],
  professional: [
    ['warm-up', 'useful-language', 'vocabulary-match', 'dialogue', 'matching-qa', 'discussion', 'homework-writing'],
    ['warm-up', 'useful-language', 'dialogue', 'matching-qa', 'roleplay', 'discussion', 'homework-writing'],
    ['warm-up', 'useful-language', 'dialogue', 'matching-qa', 'debate', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'dialogue', 'matching-qa', 'roleplay', 'debate', 'homework-writing'],
    ['warm-up', 'language-in-context', 'dialogue', 'matching-qa', 'roleplay', 'discussion', 'homework-writing'],
  ],
} as const

function selectStructure(communicativeNeed: string): { category: string; modules: string[] } {
  const need = communicativeNeed.toLowerCase()
  let category: keyof typeof STRUCTURES

  if (/grammar|tense|structure|clause|verb form|syntax|accuracy/.test(need)) {
    category = 'grammar'
  } else if (/read|article|text|comprehens|passage|report/.test(need)) {
    category = 'reading'
  } else if (/vocabular|word|idiom|phrase|expression|collocat|phrasal/.test(need)) {
    category = 'vocabulary'
  } else if (/email|present|negotiat|pitch|report|meeting|professional|business/.test(need)) {
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
  vocabularyContextSection: string
): string {
  const { category, modules } = selectStructure(lesson.communicativeNeed)

  // For 25-min lessons: trim to first + 3 middle + homework-writing
  const selectedModules = duration === 25
    ? [modules[0], ...modules.slice(1, -1).slice(0, 3), 'homework-writing']
    : modules

  return `Expert ${student.targetLanguage} instructor. Generate a modular lesson as JSON.

STUDENT: ${student.name}, ${student.level}, ${student.ageGroup}
Goals: ${student.endGoals} | Occupation: ${student.occupation || 'Professional'} | Weaknesses: ${student.weaknesses || 'General'}
LESSON: ${lesson.title} | Need: ${lesson.communicativeNeed}
Key language: ${lesson.keyLanguageFeatures.join(', ')}
Roles available: ${roles.join(', ')}
${vocabularyContextSection ? vocabularyContextSection + '\n' : ''}

CONTENT RULES:
- ALL content in ${student.targetLanguage} (JSON keys and type values stay in English)
- NO em dashes (—). BANNED words: "resonate","navigate","landscape","leverage","dynamics","paradigm","mitigate","jeopardize","escalate","bottleneck","trade-off","iron out","flag","stakeholder","circle back"
- Real names only in dialogues — NEVER bracket placeholders

MODULE TYPE DISCIPLINE — no mixing:
- vocabulary-cards = SINGLE WORDS only. No phrases, no compound nouns, no collocations. One word, one entry.
- vocabulary-match = terms must be words OR multi-word collocations/phrases. NEVER appears in the same lesson as vocabulary-cards — they would duplicate the same words. If the structure includes both, generate only vocabulary-match and omit vocabulary-cards entirely.
- useful-language (Key Phrases) = MULTI-WORD PHRASES only. Minimum 2 words. These are functional chunks a speaker uses as a unit in real conversation. NEVER a single word. NEVER a generic phrase that could appear in any professional lesson ("Can you clarify that?", "I'd like to discuss...", "Let's move on"). Every phrase must be specific enough to this lesson's topic that it would sound odd in a completely different scenario.
- useful-expressions = FIXED EXPRESSIONS or IDIOMS only. Non-literal, multi-word, fixed in form. Examples of the type: "get the ball rolling", "cut to the chase", "get cold feet". NEVER plain sentence phrases. NEVER single words. The student completes the expression from the stem.
- language-in-context = PHRASES only. Never single words. Phrases that have a specific communicative function (softening, requesting, hedging, emphasising). Not generic vocabulary.
- phrasal-verbs = PHRASAL VERBS only — verb + particle with NON-LITERAL meaning. "Turn off the light" is NOT a phrasal verb entry (literal). "Burn out", "put off", "fall through" are correct entries. Never include an entry whose meaning follows directly from the verb + preposition in a literal sense.

DIALOGUE — language quality and small talk rules:
The dialogue must sound like two real professionals talking — not a textbook exercise. Characters must use colloquial expressions, idioms, and phrasal verbs naturally throughout, the way people actually speak at work. These are NOT inserted for teaching purposes — they arise because that is how people talk. Examples of the register to aim for: "that caught me off guard", "I'll be honest with you", "we're not quite there yet", "that's on me", "let's not get ahead of ourselves", "I dropped the ball on that", "it's a bit of a stretch", "we need to get our ducks in a row", "that's fair enough", "I'd push back on that a bit", "to be fair", "between you and me", "I can't wrap my head around it", "it slipped through the cracks". Mix idioms, phrasal verbs, hedging expressions, and colloquial fillers throughout every dialogue — not just in the small talk section. The language level must match the student's CEFR level (${student.level}) — lower levels use simpler colloquial language, higher levels use more idiomatic register.
Small talk: GENUINE off-topic conversation for at least 2 turns before any mention of the main lesson topic. Topics: commute, weather, something they saw or heard, a minor personal detail, weekend plans. Must feel like two real people who know each other. NEVER use the main topic as the small talk hook ("By the way, how's the project?" is NOT small talk). After small talk, one character naturally transitions to the main subject.
Beyond small talk: 8-12 turns total, one imperfect moment (misunderstanding, forgotten detail, correction), one genuine pushback, one emotional reaction (relief, surprise, mild frustration). Contractions throughout. Vary turn length. End at a natural pause, not a tidy resolution.

WARM-UP questions: Write 3-4 questions. Purpose: ACTIVATION, not assessment. A warm-up gets the student talking comfortably before the lesson begins — it is not a test of the lesson's ideas.
CALIBRATION RULE: Every warm-up question must pass this test — "Can a tired ${student.level} student answer this in 20 seconds without thinking hard?" If the answer is no, the question is too complex and must be replaced. Questions must be answerable in 1-2 sentences without using any of the lesson's target language.
BANNED question types (these are dead on arrival — replace with anything else):
- Abstract synthesis: "Considering X's global nature, how do you ensure Y across different cultural interpretations of Z?" — this is a Harvard essay prompt, not a conversation starter. Never combine two abstract concepts into one question.
- Procedural/audit framing: "How do you decide whether X is Y?", "What is your process for Z?", "What is the first thought that goes through your mind when X?"
- Presupposing unlikely events: "When you present data showing a dip..." — what if they haven't? Dead end.
- Learner framing: "What do you find helpful when learning X?"
- Survey style: "How do you typically...", "What kind of X do you find..."
- Balance questions with two obvious sides: "How do you balance X with Y?" — only use if the tension is genuinely surprising, not an obvious professional trade-off everyone knows.
Questions should feel like something a direct colleague asks over coffee. One question about a specific failure or awkward professional moment, one demanding a strong opinion the student might disagree with, one based on something concrete and observable about their role. First question must be the most direct and easiest to answer — not the most sophisticated.

GAP-FILL: the 'sentence' field contains ONLY the sentence with ___ for the blank. NEVER append "Answer:", the answer, or any hint inside the sentence field. Before finalising, mentally substitute the answer into ___ and confirm the full sentence is grammatically and idiomatically correct — if it isn't, rewrite.

DEBATE: always include a clear 'topic' field summarising the dilemma in one sentence, and 'sideA'/'sideB' labels that are direct opposites. The student must pick one side and argue it.

PHRASES IN DIALOGUE: if the lesson includes a useful-language or useful-expressions module, every phrase from that module MUST appear naturally in the dialogue — put each phrase in the mouth of one of the characters as a real utterance. CONSISTENCY CHECK: count the phrases listed in the useful-language module and confirm every one appears in both the dialogue AND (if a gap-fill module is in the structure) at least one gap-fill sentence. No phrase may appear in the list but be absent from any exercise. Run this check before outputting the JSON.

DISCUSSION / TALKING-POINT: Student speaking modules — the student answers, the tutor listens.
BANNED — these are McKinsey case interview questions, not discussion triggers:
- Abstract synthesis: "How do you balance detailed data analysis with the risk of getting bogged down in the weeds when reporting to executives?" — requires vocabulary not taught in this lesson and demands 10 minutes to answer.
- Cross-cultural/multi-variable abstract: "How do you ensure X is understood across different cultural interpretations of Y?" — C-suite essay prompt.
- NEVER ask meta questions about the lesson. NEVER ask about explaining something to a non-technical person.
- NEVER ask procedural/process questions: "How do you decide when X?", "What steps do you take when Z?"
REQUIRED: Every discussion question must be personal, concrete, and experiential. "Tell me about a time you..." beats every abstract question. The question must be answerable by referencing a specific moment, event, or opinion the student holds — not by describing a general practice. Questions must be answerable using only language already in the lesson — do not introduce new idioms ("bogged down in the weeds", "systemic") in discussion questions that were never taught.

DIALOGUE — multi-speaker turn order: If the dialogue has more than 2 characters, ${student.name} MUST speak immediately after every non-student turn. No two non-student characters may ever speak consecutively. The pattern must always be: [non-student] → [${student.name}] → [non-student] → [${student.name}]. Non-student speakers rotate among themselves but only when ${student.name} has spoken in between. This rule is absolute — in a 1-on-1 lesson the tutor reads all non-student roles, so back-to-back non-student lines mean the tutor is performing a monologue while the student waits. Non-student characters may speak MORE per turn (longer speech) to compensate — ${student.name} does not need to match them in length every turn.

DIALOGUE — student drives the resolution: ${student.name} is the learner. In the dialogue, ${student.name} must be the character who proposes compromises, solutions, or key professional moves — NOT the other character. The other character creates pressure, obstacles, or pushback. ${student.name} navigates and resolves. If the other character proposes the solution before ${student.name} gets a chance, rewrite so ${student.name} gets there first.

CEFR LEVEL FILTER — dialogue and all modules: Before including any idiom, expression, or domain-specific term anywhere in the lesson, check it is at or below ${student.level}. "Professional context" does NOT mean "high CEFR." A B2 student in a professional role needs functional clarity — not idiomatic flourish above their level. Idioms like "perfect storm", "blip", "systemic" (as metaphor), "recurring theme" (metaphorical), "in the weeds" are C1+. They MUST NOT appear in a ${student.level} lesson unless they are explicitly taught in a vocabulary module. If they appear in the dialogue unannounced, remove or replace them. This applies to discussion questions too — do not introduce vocabulary in a question that was never taught in the lesson.

TIMING REALITY CHECK: timeMinutes must reflect actual classroom time, not aspirational estimates. Use these benchmarks: dialogue (1.5 min per 100 words to read aloud + 2 min setup) — a 350-word dialogue needs at least 7 min, not 12 min that includes other activities. Comprehension: 1 min per question. Gap-fill: 1 min per sentence. Roleplay: minimum 5 min. Warm-up: 1 min per question. If the timeMinutes sum doesn't match ${duration}, adjust module times to fit — do not round-number everything to 5 or 10 min.

VOCABULARY TERM LEVEL CHECK: Before including any vocabulary term or phrase, verify it is genuinely at ${student.level} level. A term that a learner one level below would already know is unjustifiable. At B2+: never include terms like "delivery date", "meeting", "customer", "order" — these are A1/A2. Choose terms that are domain-specific, professionally precise, and unlikely to be in a lower-level learner's passive vocabulary.

VOCABULARY MATCH — term field format: The 'term' field must be a genuinely teachable item — a word or expression a learner could not simply guess from its parts.
- Idioms and phrasal expressions: GOOD — "stepped up to the plate", "get our ducks in a row", "wrap my head around", "fallen through the cracks" — non-literal meaning, not guessable
- Collocations with non-obvious meaning: GOOD — "collective effort", "push back", "commend" — worth knowing as a unit or as a precise word
- Transparent compound nouns: BAD — "production targets", "supply chain issues", "team performance" — the meaning is obvious from the two words; nothing to teach; no meaningful definition is possible that differs from the literal reading
- Adverb-padded terms: BAD — "specifically commend" → trim to "commend"; "really stepped up" → trim to "stepped up to the plate"
- Descriptive phrases: BAD — "meeting the production targets", "acknowledging another person's perspective" — these are paraphrases of the sentence, not vocabulary items
If a term cannot have a SHORT definition that would surprise the learner, replace it with a different sentence and term entirely. Every term in a vocabulary-match must earn its place by being genuinely non-obvious.

ROLEPLAY — specificity required: The situation must include concrete details — specific numbers, names, products, deadlines, constraints. Do not write a generic summary. The non-student role must have at least 3 specific behaviours listed in keyPoints (e.g. "insist the order must ship by Friday regardless", "dismiss the shortage as a logistics failure", "threaten to escalate to the regional manager"). The phrasesToUse field must explicitly list the target phrases from the dialogue — not a vague instruction like "observe if the student uses key phrases."
ROLEPLAY — pragmatic coherence: Before assigning each phrase to phrasesToUse, verify the roleplay situation creates natural conditions where a speaker would actually say that phrase. A scenario about a cost overrun or missed target CANNOT naturally use phrases like "hit the targets" or "on track" — the situation prevents it. Only include phrases whose speech act fits the scenario. Replace any phrase that cannot be used naturally given the situation.

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
- your-turn-tell → MUST use 'prompts' array NEVER singular 'prompt'
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
  stem = phrase with content words hidden, e.g. phrase "push back on the timeline" → stem "push back on ....."
  Every phrase must be specific enough that it would sound odd in a completely different lesson.
  FRAMING: this module is a PRESENTATION and INTRODUCTION activity, not a memory drill. The student is encountering these phrases for the first time (or near-first time). The instructions field must frame it as "practise saying each phrase" or "study the phrase, then complete the stem" — NEVER "recall from memory" or "complete from memory." Every phrase listed MUST have its own stem entry — a phrase without a stem is a schema error.
language-in-context   → { phrases: [{phrase:string, function:string, example?:string}×4-6] }
  PHRASES only — never single words. Each has a clear communicative function (softening, hedging, emphasising, etc.).
phrasal-verbs         → { pairs: [{verb, meaning, example?}×6-8], discussionQuestions?:string[] }
  PHRASAL VERBS only — verb + particle, NON-LITERAL meaning. Verify each entry is genuinely non-literal.
gap-fill              → { instructions, sentences: [{sentence(use ___ for blank), answer}×6-10] }
complete-the-sentence → { instructions, questions: [{stem, options:string[4], answer:number(0-indexed)}×4-6] }
find-the-mistake      → { instructions, sentences: [{incorrect, correct, explanation?}×6-8] }
ordering              → { instructions, sentences: [{scrambled, correct}×5-8] }
sentence-correction   → { sentences: [{incorrect, correct, errorType, explanation}×8-10] }
grammar-focus         → { topic, explanation, table?:{headers,rows}, examples:[{label,sentence}×3-5], practice:{questions:[{stem,options:string[4],answer:number}×4-6]} }
dialogue              → { setting, characters:[{name,role?}×2], dialogue:[{character,text}×8-12] }
reading-article       → { title, text(min 300 words, paragraphs separated by \\n\\n), glossary?:[{term,definition}] }
reading-scan          → { instructions, questions:[{question,answer}×4-8] }
vocabulary-in-text    → { instructions, items:[{definition, partOfSpeech, paragraph, answer}×8-10] }
  Generate 8-10 items. Every item MUST include: paragraph number (1, 2, 3...) where the word appears, and partOfSpeech (noun / verb / adjective / adverb / idiom / phrase). Words must be distributed across ALL paragraphs of the reading — at least one word from each paragraph, never more than 2 from any single paragraph. Idioms and fixed expressions from the text count as valid items. The student reads the definition, finds the word in the specified paragraph.
skim-main-idea        → { options:string[4], answer:number(0-indexed), explanation? }
matching-qa           → { pairs:[{question,answer}×4-6] }
  When matching-qa immediately follows a dialogue or reading-article: write 4-6 comprehension questions about that content. Questions must probe character decisions, reasoning, implications, and language choices — NOT trivial recall ("Who said X?"). The answer must be a complete, specific response the tutor can give. Good example: Q: "Why did Marcus push back on the supplier's first offer?" A: "He felt the discount didn't reflect the volume they were committing to and wanted to anchor a better rate."
roleplay              → { situation, roles:[{name,description,keyPoints?:string[]}×2], phrasesToUse?:string[] }
talking-point         → { studentA:{title,questions:string[3-4]}, studentB:{title,questions:string[3-4]} }
discussion            → { questions:string[4-6] }
debate                → { topic, sideA:{label,points:string[3-5]}, sideB:{label,points:string[3-5]} }
your-turn-ask         → { questions:string[4-6] }
your-turn-tell        → { prompts:string[3-5], example? }
homework-writing      → { task, prompts:string[3-5], wordCount?, instructions? }

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
