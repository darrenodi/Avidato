import { StudentProfile, BlockLesson } from '../../types/lesson-template';

export function buildModularLessonPrompt(
  student: StudentProfile,
  lesson: BlockLesson,
  duration: 25 | 50,
  roles: string[],
  levelGuide: string,
  cefrVocabGuide: string,
  vocabularyContextSection: string
): string {
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
- Warm-up questions: ALL must relate directly to the lesson topic — NEVER generic "How has your week been" openers

${levelGuide}
${cefrVocabGuide}

TUTOR NOTES: Each module must have a tutorNotes field — a short specific action for the tutor (not a description).

─────────────────────────────────────────────────
LESSON BLUEPRINTS — choose ONE based on the lesson goal
─────────────────────────────────────────────────

BLUEPRINT 1 — READING & COMPREHENSION
Use for: articles, reports, industry topics, news-based lessons, text analysis
Modules: warm-up → vocabulary-match → reading-article → reading-scan → complete-the-sentence → discussion → homework-writing

BLUEPRINT 2 — DIALOGUE & INTERACTION
Use for: workplace conversations, meetings, customer calls, professional dialogue
Modules: warm-up → vocabulary-match → dialogue → matching-qa → language-in-context → roleplay → homework-writing

BLUEPRINT 3 — VOCABULARY & ACCURACY
Use for: expanding word range, idioms, phrasal verbs, precise language
Modules: warm-up → vocabulary-cards → gap-fill → find-the-mistake → grammar-focus → your-turn-ask → homework-writing

BLUEPRINT 4 — PROFESSIONAL COMMUNICATION
Use for: structured professional output — emails, updates, pitches, reports
Modules: warm-up → useful-language → vocabulary-match → dialogue → roleplay → discussion → homework-writing

BLUEPRINT 5 — OPINION & CRITICAL THINKING
Use for: debates, ethical questions, comparing views, current events
Modules: image-discussion → vocabulary-match → reading-article → skim-main-idea → reading-scan → debate → homework-writing

BLUEPRINT 6 — PHRASES & FUNCTIONAL LANGUAGE
Use for: expressions, functional phrases, situational language
Modules: warm-up → language-in-context → useful-expressions → ordering → talking-point → your-turn-tell → homework-writing

BLUEPRINT 7 — GRAMMAR IN USE
Use for: specific grammar point, tense focus, error patterns, accuracy work
Modules: warm-up → vocabulary-cards → grammar-focus → find-the-mistake → sentence-correction → discussion → homework-writing

─────────────────────────────────────────────────
TIMING:
- 50-min: generate ALL 7 modules from the blueprint
- 25-min: generate 5 modules — first + 3 middle + homework-writing
- timeMinutes must sum to ${duration}
─────────────────────────────────────────────────

CRITICAL SCHEMA RULES — exact shapes required or UI breaks:
- vocabulary-match → ALWAYS use 'groups' (never flat 'pairs'). Generate exactly 2 groups, 5-7 pairs each. Schema: { instructions, groups: [{label: "Group 1", pairs: [{term, definition}]}, {label: "Group 2", pairs: [{term, definition}]}] }
- useful-language → phrases MUST be objects [{phrase, example}] NEVER strings
- language-in-context → phrases MUST be objects [{phrase, function, example?}] NEVER 'analysis' key
- dialogue → MUST have: setting, characters:[{name,role?}], dialogue:[{character,text}]. NEVER a 'text' blob
- roleplay → roles MUST be objects [{name, description, keyPoints?}] NEVER strings. Use 'situation' not 'scenario'
- your-turn-tell → MUST use 'prompts' array NEVER singular 'prompt'
- reading-article → text must be 3-5 substantial paragraphs separated by \\n\\n. Minimum 300 words. Include a title.
- IMAGE-DISCUSSION module (Blueprint 5 only): one imagePlaceholder with detailed visual description for AI image generation

MODULE LIBRARY (for reference — only use types from your chosen blueprint):
warm-up               → { questions: string[3-4] }
image-discussion      → { imagePlaceholders: [{label, description}], questions: string[] }
vocabulary-cards      → { vocabulary: [{word, partOfSpeech, phonetics, definition, example, synonym?}×6] }
vocabulary-match      → { instructions, groups: [{label, pairs:[{term,definition}×5-7]}×2] }
useful-expressions    → { context?, expressions: string[6-10] }
useful-language       → { phrases: [{phrase:string, example:string}×4-6], practice: {sentences:[{prompt,answer}×4-6]} }
language-in-context   → { phrases: [{phrase:string, function:string, example?:string}×4-6] }
gap-fill              → { instructions, sentences: [{sentence(use ___ for blank), answer}×6-10], wordBank?: string[] }
complete-the-sentence → { instructions, questions: [{stem, options:string[4], answer:number(0-indexed)}×4-6] }
find-the-mistake      → { instructions, sentences: [{incorrect, correct, explanation?}×6-8] }
ordering              → { instructions, sentences: [{scrambled, correct}×5-8] }
sentence-correction   → { sentences: [{incorrect, correct, errorType, explanation}×8-10] }
grammar-focus         → { topic, explanation, table?:{headers,rows}, examples:[{label,sentence}×3-5], practice:{questions:[{stem,options:string[4],answer:number}×4-6]} }
dialogue              → { setting, characters:[{name,role?}×2], dialogue:[{character,text}×8-12], comprehension?:{type,questions:[{question,answer}×3-5]} }
reading-article       → { title, text(min 300 words, paragraphs separated by \\n\\n), glossary?:[{term,definition}] }
reading-scan          → { instructions, questions:[{question,answer}×4-8] }
vocabulary-in-text    → { instructions, items:[{definition,answer,paragraph?}×6-10] }
skim-main-idea        → { options:string[4], answer:number(0-indexed), explanation? }
matching-qa           → { pairs:[{question,answer}×4-6] }
noticing              → { instruction, targetPattern, examples?:string[] }
roleplay              → { situation, roles:[{name,description,keyPoints?:string[]}×2], phrasesToUse?:string[] }
talking-point         → { studentA:{title,questions:string[3-4]}, studentB:{title,questions:string[3-4]} }
discussion            → { questions:string[4-6] }
further-discussion    → { questions:string[4-6] }
debate                → { topic, sideA:{label,points:string[3-5]}, sideB:{label,points:string[3-5]} }
your-turn-ask         → { questions:string[4-6] }
your-turn-tell        → { prompts:string[3-5], example? }
homework-writing      → { task, prompts:string[3-5], wordCount?, instructions? }

JSON OUTPUT:
{
  "title": "${lesson.title}",
  "lessonType": "modular",
  "blueprint": [1-7],
  "objective": "[one sentence in ${student.targetLanguage}, max 120 chars]",
  "difficulty": ${student.level === 'beginner' ? 3 : student.level === 'elementary' ? 4 : student.level === 'intermediate' ? 6 : 8},
  "duration": ${duration},
  "skills": ["Speaking", "Vocabulary"],
  "modules": [
    {
      "type": "[module type from blueprint]",
      "title": "[module title in ${student.targetLanguage}]",
      "timeMinutes": [number],
      "tutorNotes": "[specific tutor action in ${student.targetLanguage}]",
      "content": { ... }
    }
  ],
  "teachingNotes": "[overall lesson notes for tutor in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}
