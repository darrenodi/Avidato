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
- Real names only in dialogues — NEVER bracket placeholders like [Name], [Student], [Number]
- Vocabulary: 6 single words only (no compound phrases), domain-specific, all appear in the dialogue
- Dialogue: 8-12 turns, small talk opener, one imperfect moment, one pushback, contractions + natural fillers, end at natural pause
- Warm-up questions: ALL must be specific to the lesson topic — NEVER generic openers like "How has your week been"

${levelGuide}
${cefrVocabGuide}

TUTOR NOTES: Each module must have a tutorNotes field — a short, specific instruction for what the tutor should DO. Not a description of the module — an action.

─────────────────────────────────────────────────
LESSON BLUEPRINTS — choose ONE based on the lesson goal
─────────────────────────────────────────────────

BLUEPRINT 1 — CONVERSATION
Use for: everyday social topics, small talk, casual situations, personal life
Modules: warm-up → vocabulary-cards → dialogue → useful-expressions → roleplay → discussion → homework-writing

BLUEPRINT 2 — PROFESSIONAL COMMUNICATION
Use for: workplace emails, meetings, reports, formal language, internal business tasks
Modules: warm-up → useful-language → dialogue → language-in-context → roleplay → your-turn-tell → homework-writing

BLUEPRINT 3 — VOCABULARY FOCUS
Use for: expanding range, idioms, phrasal verbs, word fields, precise language
Modules: warm-up → vocabulary-cards → vocabulary-match → gap-fill → complete-the-sentence → your-turn-ask → homework-writing

BLUEPRINT 4 — GRAMMAR & ACCURACY
Use for: a specific tense or structure, common errors, improving correctness
Modules: warm-up → vocabulary-cards → grammar-focus → find-the-mistake → sentence-correction → talking-point → homework-writing

BLUEPRINT 5 — READING & COMPREHENSION
Use for: articles, reports, instructions, written texts, extracting information
Modules: warm-up → vocabulary-cards → reading-article → vocabulary-in-text → reading-scan → discussion → homework-writing

BLUEPRINT 6 — PRESENTATION & STRUCTURED SPEAKING
Use for: giving updates, pitches, structured monologues, formal spoken output
Modules: warm-up → useful-language → language-in-context → ordering → roleplay → your-turn-tell → homework-writing

BLUEPRINT 7 — OPINION & DEBATE
Use for: current events, ethical questions, comparing views, critical thinking
Modules: image-discussion → vocabulary-cards → useful-expressions → noticing → talking-point → debate → homework-writing

─────────────────────────────────────────────────
TIMING:
- 50-min lesson: generate ALL 7 modules from the blueprint. Distribute time across them.
- 25-min lesson: generate 5 modules — first module, 3 middle modules, last module (homework-writing). timeMinutes must sum to ${duration}.
- Do NOT deviate from the chosen blueprint's module order.
─────────────────────────────────────────────────

IMAGE-DISCUSSION module (Blueprint 7 only): include ONE imagePlaceholder with a detailed, realistic visual description so an AI image generator can produce it (e.g. "A heated town hall debate in a modern city council chamber, with two speakers at opposite podiums facing a diverse audience").

CRITICAL SCHEMA RULES — the following fields have EXACT required shapes. Using any other shape will break the UI:
- useful-language → phrases MUST be an array of objects: [{phrase: "...", example: "..."}]. NEVER a string array.
- useful-language → practice MUST be: {sentences: [{prompt: "...", answer: "..."}]}
- language-in-context → phrases MUST be an array of objects: [{phrase: "...", function: "...", example?: "..."}]. NEVER use an 'analysis' key.
- dialogue → content MUST have: setting (string), characters: [{name, role?}], dialogue: [{character, text}]. NEVER use a 'text' blob.
- roleplay → roles MUST be an array of objects: [{name: "...", description: "...", keyPoints?: [...]}]. NEVER a string array. Use 'situation' not 'scenario'.
- your-turn-tell → MUST use 'prompts' (array of strings). NEVER use a singular 'prompt' string.

JSON OUTPUT:
{
  "title": "${lesson.title}",
  "lessonType": "modular",
  "blueprint": [1-7],
  "objective": "[By the end of this lesson, you'll be able to ${lesson.communicativeNeed} — MAX 120 chars in ${student.targetLanguage}]",
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
  "teachingNotes": "[overall lesson notes for the tutor in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}
