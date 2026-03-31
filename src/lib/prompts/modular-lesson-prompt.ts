import { StudentProfile, BlockLesson } from '../../types/lesson-template';

// ─── Lesson structure categories ────────────────────────────────────────────
// Each category has 5 preset module sequences.
// Code picks one randomly — the AI never chooses the structure, only fills the content.

const STRUCTURES = {
  speaking: [
    ['warm-up', 'vocabulary-match', 'dialogue', 'matching-qa', 'roleplay', 'discussion', 'homework-writing'],
    ['warm-up', 'useful-language', 'dialogue', 'language-in-context', 'roleplay', 'talking-point', 'homework-writing'],
    ['image-discussion', 'vocabulary-match', 'dialogue', 'roleplay', 'your-turn-tell', 'discussion', 'homework-writing'],
    ['warm-up', 'vocabulary-cards', 'dialogue', 'matching-qa', 'roleplay', 'your-turn-ask', 'homework-writing'],
    ['warm-up', 'useful-expressions', 'dialogue', 'language-in-context', 'roleplay', 'debate', 'homework-writing'],
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
    ['warm-up', 'vocabulary-match', 'useful-expressions', 'ordering', 'gap-fill', 'discussion', 'homework-writing'],
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
    ['warm-up', 'useful-language', 'vocabulary-match', 'dialogue', 'roleplay', 'discussion', 'homework-writing'],
    ['warm-up', 'useful-expressions', 'dialogue', 'matching-qa', 'language-in-context', 'roleplay', 'homework-writing'],
    ['image-discussion', 'useful-language', 'dialogue', 'roleplay', 'your-turn-tell', 'homework-writing'],
    ['warm-up', 'vocabulary-match', 'useful-expressions', 'dialogue', 'roleplay', 'debate', 'homework-writing'],
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
- Warm-up questions: ALL must relate directly to the lesson topic — NEVER generic openers

${levelGuide}
${cefrVocabGuide}

TUTOR NOTES: Each module must have a tutorNotes field — a short specific action for the tutor (not a description).

─────────────────────────────────────────────────
LESSON STRUCTURE (pre-selected — do not change)
Category: ${category}
Modules in order: ${selectedModules.join(' → ')}
timeMinutes must sum to exactly ${duration}
─────────────────────────────────────────────────

CRITICAL SCHEMA RULES — exact shapes required or UI breaks:
- vocabulary-match → 2 groups, 5-7 pairs each. Each pair: { sentence, term, definition }
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
vocabulary-match      → { instructions, groups: [{label, pairs:[{sentence,term,definition}×5-7]}×2] }
useful-expressions    → { context?, expressions: [{full: string, stem: string}×6-10] }
  stem = the phrase up to and including the key idiom/verb phrase, ending with "....." — student completes it
  Example: { full: "We need to iron out a few issues with the supplier.", stem: "We need to iron out ....." }
useful-language       → { phrases: [{phrase:string, stem:string, example:string}×4-6], practice: {sentences:[{prompt,answer}×4-6]} }
  stem = phrase shown to student with content words hidden: e.g. phrase "touch base on the schedule" → stem "touch base on ....."
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
