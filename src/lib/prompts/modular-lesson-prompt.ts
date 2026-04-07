import { StudentProfile, BlockLesson } from '../../types/lesson-template';

// ─── Lesson structure categories ────────────────────────────────────────────
// Each category has 5 preset module sequences.
// Code picks one randomly — the AI never chooses the structure, only fills the content.

const STRUCTURES = {
  speaking: [
    ['warm-up', 'vocabulary-match', 'dialogue', 'matching-qa', 'roleplay', 'discussion', 'homework-writing'],
    ['warm-up', 'useful-language', 'dialogue', 'matching-qa', 'roleplay', 'talking-point', 'homework-writing'],
    ['image-discussion', 'vocabulary-match', 'dialogue', 'matching-qa', 'your-turn-tell', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'dialogue', 'matching-qa', 'roleplay', 'your-turn-ask', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'dialogue', 'matching-qa', 'roleplay', 'debate', 'homework-writing'],
  ],
  reading: [
    ['warm-up', 'vocabulary-match', 'reading-article', 'reading-scan', 'skim-main-idea', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'reading-article', 'matching-qa', 'vocabulary-in-text', 'debate', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'reading-article', 'reading-scan', 'discussion', 'your-turn-tell', 'homework-writing'],
    ['image-discussion', 'vocabulary-match', 'reading-article', 'skim-main-idea', 'reading-scan', 'debate', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'reading-article', 'matching-qa', 'discussion', 'homework-writing'],
  ],
  vocabulary: [
    ['warm-up', 'vocabulary-cards', 'gap-fill', 'find-the-mistake', 'language-in-context', 'your-turn-tell', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'ordering', 'gap-fill', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'vocabulary-match', 'gap-fill', 'sentence-correction', 'your-turn-ask', 'homework-writing'],
    ['warm-up', 'phrasal-verbs', 'gap-fill', 'find-the-mistake', 'useful-language', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'language-in-context', 'gap-fill', 'talking-point', 'homework-writing'],
  ],
  grammar: [
    ['warm-up', 'vocabulary-cards', 'grammar-focus', 'find-the-mistake', 'sentence-correction', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'grammar-focus', 'gap-fill', 'find-the-mistake', 'your-turn-tell', 'homework-writing'],
    ['warm-up', 'grammar-focus', 'gap-fill', 'sentence-correction', 'roleplay', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'grammar-focus', 'ordering', 'gap-fill', 'discussion', 'homework-writing'],
    ['warm-up', 'language-in-context', 'grammar-focus', 'find-the-mistake', 'gap-fill', 'talking-point', 'homework-writing'],
  ],
  professional: [
    ['warm-up', 'useful-language', 'vocabulary-match', 'dialogue', 'matching-qa', 'discussion', 'homework-writing'],
    ['warm-up', 'useful-language', 'dialogue', 'matching-qa', 'roleplay', 'homework-writing'],
    ['image-discussion', 'useful-language', 'dialogue', 'matching-qa', 'your-turn-tell', 'homework-writing'],
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
${vocabularyContextSection}

CONTENT RULES:
- ALL content in ${student.targetLanguage} (JSON keys and type values stay in English)
- NO em dashes (—). BANNED words: "resonate","navigate","landscape","leverage","dynamics","paradigm"
- Real names only in dialogues — NEVER bracket placeholders
- Dialogue: 8-12 turns, small talk opener, one imperfect moment, one pushback, contractions + natural fillers
- Warm-up questions: Write 3-4 questions that make the student think and speak immediately. Questions must be rooted in the student's real job (${student.occupation}) and the specific lesson topic. They should provoke an opinion, recall a real moment, or spark a reaction — not describe a process or list steps. Vary the angle of each question so they do not feel like a survey.
- gap-fill sentences: the 'sentence' field contains ONLY the sentence with ___ for the blank. NEVER append "Answer:", the answer, or any hint text inside the sentence field — the answer goes in the separate 'answer' field only. Before finalising each sentence, mentally substitute the answer into ___ and confirm the full sentence is grammatically and idiomatically correct — if it isn't, rewrite the sentence until it is.
- Debate module: always include a clear 'topic' field summarising the dilemma in one sentence, and 'sideA'/'sideB' labels that are direct opposites. The student must pick one side and argue it.
- Phrases in dialogue: if the lesson includes a useful-language or useful-expressions module, every phrase from that module MUST appear naturally in the dialogue — put each phrase in the mouth of one of the characters as a real utterance.
- discussion / your-turn-ask / your-turn-tell: These are STUDENT SPEAKING PRACTICE modules — the student answers, the tutor listens and gives feedback. NEVER frame questions as "ask your tutor" or imply role reversal. Write questions the student answers from their own experience, opinion, or professional context. Questions must be about the lesson topic — genuine speaking prompts that require the student to produce language about the subject. NEVER ask meta questions about the lesson (e.g. "Which part felt difficult?", "What did you find challenging?", "How did the roleplay go?"). Write questions as if the lesson activity never happened — just the topic. NEVER ask questions about explaining something to a non-technical person or stakeholder (e.g. "How would you explain this to someone without a technical background?", "How would you simplify this for a non-expert?") — these are lazy, generic prompts that do not require the student to actually use the target language in context.

${levelGuide}
${cefrVocabGuide}

TUTOR NOTES: Each module must have a tutorNotes field — a short specific action for the tutor (not a description).

MODULE TITLES: Use these exact title formats — no creative variations:
- warm-up → "Warm-up"
- vocabulary-cards → "Vocabulary"
- vocabulary-match → "Vocabulary Match"
- useful-language → "Key Phrases"
- useful-expressions → "Useful Expressions"
- language-in-context → "Language in Context"
- dialogue → "Dialogue - [descriptive title of the specific scenario, e.g. 'Dialogue - The Budget Review']"
- matching-qa → "Comprehension"
- reading-article → "Reading - [descriptive title of the article]"
- reading-scan → "Reading Comprehension"
- skim-main-idea → "Main Idea"
- roleplay → "Roleplay"
- discussion → "Discussion"
- debate → "Debate"
- your-turn-ask → "Your Turn"
- your-turn-tell → "Your Turn"
- talking-point → "Talking Point"
- gap-fill → "Gap Fill"
- find-the-mistake → "Find the Mistake"
- sentence-correction → "Sentence Correction"
- ordering → "Ordering"
- grammar-focus → "Grammar Focus"
- phrasal-verbs → "Phrasal Verbs"
- image-discussion → "Image Discussion"
- homework-writing → "Homework"

─────────────────────────────────────────────────
LESSON STRUCTURE (pre-selected — do not change)
Category: ${category}
Modules in order: ${selectedModules.join(' → ')}
timeMinutes must sum to exactly ${duration}
─────────────────────────────────────────────────

CRITICAL SCHEMA RULES — exact shapes required or UI breaks:
- vocabulary-match → generate 8-10 pairs total. Use 1 group if ≤8 pairs total; use 2 groups if 9-10 pairs total. Each group must have at least 4 pairs — never put fewer than 4 pairs in a single group.
  EVERY term MUST appear naturally in the lesson dialogue or reading passage — do NOT invent terms absent from other modules.
  Each pair: { sentence, term, definition }
  sentence = a complete, natural sentence where the term is used in realistic context
  term = the key word or phrase that appears in the sentence (shown bold in UI)
  definition = what the term means — written as a short phrase, NOT a sentence
  NEVER generate bare term→definition without a sentence. NEVER include the term itself in the definition.
  Example: { "sentence": "She really blew it during the presentation by arriving unprepared.", "term": "blew it", "definition": "failed to take advantage of an opportunity" }
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
vocabulary-cards      → { vocabulary: [{word, partOfSpeech, phonetics, definition, example, synonym?}×6] }
vocabulary-match      → { instructions, groups: [{label, pairs:[{sentence,term,definition}×4-5]}×1-2] }
  (1 group for ≤8 pairs total, 2 groups for 9-10 pairs total; minimum 4 pairs per group)
useful-expressions    → { context?, expressions: [{full: string, stem: string}×6-10] }
  stem = the phrase up to and including the key idiom/verb phrase, ending with "....." — student completes it
  Example (format only — NEVER use this phrase): { full: "She handed over the project files.", stem: "She handed over ....." }
  Phrases MUST be chosen dynamically to match the specific lesson topic. NEVER reuse example phrases from this prompt. Each lesson must have a completely different set of expressions suited to its context.
useful-language       → { phrases: [{phrase:string, stem:string, example:string}×4-6], practice: {sentences:[{prompt,answer}×4-6]} }
  stem = phrase shown to student with content words hidden: e.g. phrase "touch base on the schedule" → stem "touch base on ....."
  Phrases MUST be chosen dynamically to match the specific lesson topic. NEVER reuse example phrases from this prompt.
language-in-context   → { phrases: [{phrase:string, function:string, example?:string}×4-6] }
phrasal-verbs         → { pairs: [{verb, meaning, example?}×6-8], discussionQuestions?:string[] }
gap-fill              → { instructions, sentences: [{sentence(use ___ for blank), answer}×6-10] }
complete-the-sentence → { instructions, questions: [{stem, options:string[4], answer:number(0-indexed)}×4-6] }
find-the-mistake      → { instructions, sentences: [{incorrect, correct, explanation?}×6-8] }
ordering              → { instructions, sentences: [{scrambled, correct}×5-8] }
sentence-correction   → { sentences: [{incorrect, correct, errorType, explanation}×8-10] }
grammar-focus         → { topic, explanation, table?:{headers,rows}, examples:[{label,sentence}×3-5], practice:{questions:[{stem,options:string[4],answer:number}×4-6]} }
dialogue              → { setting, characters:[{name,role?}×2], dialogue:[{character,text}×8-12] }
reading-article       → { title, text(min 300 words, paragraphs separated by \\n\\n), glossary?:[{term,definition}] }
reading-scan          → { instructions, questions:[{question,answer}×4-8] }
vocabulary-in-text    → { instructions, items:[{definition,answer,paragraph?}×6-10] }
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
