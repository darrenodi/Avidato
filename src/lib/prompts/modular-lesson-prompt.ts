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

RULES:
- ALL content in ${student.targetLanguage} (JSON keys and type values stay in English)
- NO em dashes (—). BANNED words: "resonate","navigate","landscape","leverage","dynamics","paradigm"
- Real names only in dialogues — NEVER bracket placeholders like [Name], [Student], [Number]
- Vocabulary: 6 single words only (no compound phrases), domain-specific, all appear in the dialogue
- Dialogue: 8-12 turns, small talk opener, one imperfect moment, one pushback, contractions + natural fillers, end at natural pause

ASSEMBLY RULES (${duration} min total):
- Pick 5-7 modules for 25 min, 7-9 modules for 50 min
- FIRST module: always warm-up or image-discussion
- LAST module: always homework-writing
- Do NOT repeat module types
- Do NOT include listening-* modules (no audio available)
- timeMinutes across all modules must sum to approximately ${duration}
- Every lesson must include at least one vocabulary module and at least one production module (roleplay, talking-point, your-turn-tell, your-turn-ask, debate)
- VARY the middle modules based on what actually serves the lesson goal. Do NOT default to dialogue + roleplay + discussion every time.
  Use dialogue only when the lesson is about conversational scenarios.
  Use grammar-focus or find-the-mistake when accuracy is the goal.
  Use reading-article when the lesson involves written texts or reports.
  Use gap-fill, complete-the-sentence, or ordering for language practice variety.
  Use useful-expressions or language-in-context to introduce functional phrases.
  Use noticing to draw attention to a specific pattern from a text or dialogue.
  Use talking-point or debate instead of discussion for opinion-based topics.
  Use your-turn-ask or your-turn-tell for low-pressure personalised speaking.
- Each lesson should feel structurally different from a generic speaking lesson. Mix skills: speaking + writing, reading + speaking, grammar + production, etc.

${levelGuide}
${cefrVocabGuide}

TUTOR NOTES: Each module must have a tutorNotes field — a short, specific instruction for what the tutor should DO (e.g. "Read aloud with student. Pause after each line and ask 'What does X mean?'" or "Give student 2 minutes to read alone, then close the text"). Not a description of the module — an action.

MODULE LIBRARY (pick from these types only):
warm-up               → { questions: string[3-4], instructions? }  // ALL questions must relate directly to the lesson topic — NEVER generic "How has your week been" openers
image-discussion      → { imagePlaceholders: [{label, description}], questions: string[] }
vocabulary-cards      → { vocabulary: [{word, partOfSpeech, phonetics, definition, example, synonym?}×6] }
vocabulary-match      → { pairs: [{term, definition}×6-10], instructions? }
useful-expressions    → { context?, expressions: string[6-10], instructions? }
useful-language       → { phrases: [{phrase, example}×4-6], practice: {sentences: [{prompt, answer}×4-6]} }
language-in-context   → { phrases: [{phrase, function, example?}×4-6], instructions? }
phrasal-verbs         → { pairs: [{verb, meaning, example?}×6-8], discussionQuestions?: string[] }
gap-fill              → { instructions, sentences: [{sentence(use ___ for blank), answer}×6-10], wordBank?: string[] }
complete-the-sentence → { instructions, questions: [{stem, options: string[3-4], answer: number(0-indexed), explanation?}×4-6] }
find-the-mistake      → { instructions, sentences: [{incorrect, correct, explanation?}×6-8] }
ordering              → { instructions, sentences: [{scrambled, correct}×5-8] }
fill-in-blanks-dialogue → { context?, characters:[{name,role?}], dialogue:[{character,text,blankIndex?:number}], answerPool:string[], answers:{[blankIndex]:string} }
sentence-correction   → { sentences: [{incorrect, correct, errorType, explanation}×8-10] }
grammar-focus         → { topic, explanation, table?:{headers:string[],rows:string[][]}, examples:[{label,sentence}×3-5], practice:{questions:[{stem,options:string[3-4],answer:number}×3-5]} }
dialogue              → { setting, characters:[{name,role?}×2], dialogue:[{character,text}×8-12], comprehension?:{type:"true-false"|"short-answer",questions:[{question,answer}×3-5]} }
reading-article       → { title?, text(paragraphs separated by \\n\\n), source?, glossary?:[{term,definition}] }
reading-scan          → { instructions, questions:[{question,answer}×4-8] }
vocabulary-in-text    → { instructions, items:[{definition,answer,paragraph?:number}×6-10] }
reading-section-prediction → { sections:[{heading}×3-5], items:[{content,answer:number(section index)}×3-5], instructions? }
skim-main-idea        → { options:string[3-4], answer:number(0-indexed), explanation? }
matching-qa           → { pairs:[{question,answer}×4-6], distractors?:string[] }
noticing              → { instruction, targetPattern, examples?:string[] }
roleplay              → { situation, roles:[{name,description,keyPoints?:string[]}×2], phrasesToUse?:string[], instructions? }
talking-point         → { studentA:{title,questions:string[3-4]}, studentB:{title,questions:string[3-4]}, instructions? }
discussion            → { questions:string[4-6], instructions? }
further-discussion    → { questions:string[4-6], instructions? }
debate                → { topic, sideA:{label,points:string[3-5]}, sideB:{label,points:string[3-5]}, instructions? }
your-turn-ask         → { questions:string[4-6], note? }
your-turn-answer      → { questions:string[4-6], note? }
your-turn-tell        → { prompts:string[3-5], example? }
homework-writing      → { task, prompts:string[4-6], wordCount?, instructions? }

JSON OUTPUT:
{
  "title": "${lesson.title}",
  "lessonType": "modular",
  "objective": "[By the end of this lesson, you'll be able to ${lesson.communicativeNeed} — MAX 120 chars in ${student.targetLanguage}]",
  "difficulty": ${student.level === 'beginner' ? 3 : student.level === 'elementary' ? 4 : student.level === 'intermediate' ? 6 : 8},
  "duration": ${duration},
  "skills": ["Speaking", "Vocabulary"],
  "modules": [
    {
      "type": "[module type from library]",
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
