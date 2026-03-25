import { StudentProfile, BlockLesson } from '../../types/lesson-template'

export function buildPPPLessonPrompt(
  student: StudentProfile,
  lesson: BlockLesson,
  duration: 25 | 50,
  levelGuide: string,
  cefrVocabGuide: string,
  vocabularyContextSection: string
): string {
  const is50min = duration === 50
  const presTime = is50min ? 15 : 10
  const practTime = is50min ? 20 : 10
  const prodTime = is50min ? 10 : 5
  const hwTime = is50min ? 5 : 2

  return `Expert ${student.targetLanguage} instructor. Generate a PPP lesson as JSON.

STUDENT: ${student.name}, ${student.level}, ${student.ageGroup}, Goals: ${student.endGoals}
LESSON: ${lesson.title} | Need: ${lesson.communicativeNeed} | Key language: ${lesson.keyLanguageFeatures.join(', ')}
${vocabularyContextSection}

RULES:
- ALL content in ${student.targetLanguage} (JSON keys stay in English)
- NO em dashes (—). BANNED: "resonate","navigate","landscape","leverage","dynamics","paradigm"

STRUCTURE (${duration} min): Presentation (${presTime}min) → Practice (${practTime}min) → Production (${prodTime}min) → Homework (${hwTime}min)

${levelGuide}
${cefrVocabGuide}

**Exercise 1: Presentation** (${presTime} min)
Introduce target grammar with 3-4 contextual examples + 2-3 CCQs (CCQs must NOT use the target structure).
Format: { "type": "presentation", "title": "[Grammar Focus in ${student.targetLanguage}]", "content": { "targetStructure": "[in ${student.targetLanguage}]", "explanation": "[in ${student.targetLanguage}]", "examples": [{ "sentence": "[in ${student.targetLanguage}]", "note": "[optional in ${student.targetLanguage}]" }], "conceptCheckQuestions": ["[CCQ1 in ${student.targetLanguage}]","[CCQ2]","[CCQ3]"] }, "timeMinutes": ${presTime} }

**Exercise 2: Practice** (${practTime} min)
2 exercise types (gap-fill, transformation, matching, or word reorder). 4-6 items each. One correct answer only.
Format: { "type": "practice", "title": "[Practice Exercises in ${student.targetLanguage}]", "content": { "instructions": "[in ${student.targetLanguage}]", "exercises": [{ "type": "gap-fill", "items": [{ "id": 1, "prompt": "[sentence with _____ in ${student.targetLanguage}]", "answer": "[answer]", "hint": "[grammar hint]" }] }, { "type": "transformation", "items": [{ "id": 1, "prompt": "[original + instruction in ${student.targetLanguage}]", "answer": "[transformed]" }] }] }, "timeMinutes": ${practTime} }

**Exercise 3: Production** (${prodTime} min)
Student uses the target structure freely in a real communicative context.
Format: { "type": "production", "title": "[Speaking Task in ${student.targetLanguage}]", "content": { "scenario": "[context in ${student.targetLanguage}]", "task": "[what student must do, in ${student.targetLanguage}]", "targetStructure": "[remind what to use, in ${student.targetLanguage}]", "prompts": ["[sentence starter 1 in ${student.targetLanguage}]","[starter 2]"] }, "timeMinutes": ${prodTime} }

**Exercise 4: Homework** (${hwTime} min)
Format: { "type": "homework", "title": "[Homework in ${student.targetLanguage}]", "content": { "taskName": "[short name in ${student.targetLanguage}]", "description": "[what to do and why in ${student.targetLanguage}]", "instructions": "[step-by-step in ${student.targetLanguage}]" }, "timeMinutes": ${hwTime} }

JSON OUTPUT:
{
  "title": "${lesson.title}",
  "lessonType": "grammar",
  "objective": "[By the end of this lesson, you'll be able to ${lesson.communicativeNeed} — MAX 120 chars in ${student.targetLanguage}]",
  "difficulty": ${student.level === 'beginner' ? 3 : student.level === 'elementary' ? 4 : student.level === 'intermediate' ? 6 : 8},
  "duration": ${duration},
  "skills": ["Grammar","Speaking","Writing"],
  "vocabulary": [],
  "context": "${lesson.communicativeNeed}",
  "exercises": [/* 4 exercises in order */],
  "homework": "",
  "materials": [],
  "teachingNotes": "[tutor notes in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`
}

export function buildCLTLessonPrompt(
  student: StudentProfile,
  lesson: BlockLesson,
  duration: 25 | 50,
  levelGuide: string,
  cefrVocabGuide: string,
  vocabularyContextSection: string
): string {
  const isWorkplace = /business|professional|work|office|career|corporate|workplace|job|colleague|meeting|presentation|negotiat|email/i
    .test(`${student.endGoals} ${student.occupation || ''}`)

  if (isWorkplace) {
    return buildBusinessCLTPrompt(student, lesson, duration, levelGuide, cefrVocabGuide, vocabularyContextSection)
  }

  const is50min = duration === 50
  const isKid = ['child','kid','under 12','under 18','teen'].some(k => student.ageGroup.toLowerCase().includes(k))
  const inputTime = is50min ? 15 : 10
  const activityTime = is50min ? 20 : 8
  const wrapTime = is50min ? 10 : 2

  return `Expert ${student.targetLanguage} instructor. Generate a CLT lesson as JSON.

STUDENT: ${student.name}, ${student.level}, ${student.ageGroup}, Goals: ${student.endGoals}, Interests: ${student.interests || 'general topics'}
LESSON: ${lesson.title} | Need: ${lesson.communicativeNeed} | Key language: ${lesson.keyLanguageFeatures.join(', ')}
${vocabularyContextSection}

RULES:
- ALL content in ${student.targetLanguage} (JSON keys stay in English)
- NO em dashes (—). BANNED: "resonate","navigate","landscape","leverage","dynamics","paradigm"
${isKid ? '- YOUNG LEARNER: simple, fun, age-appropriate. Topics: hobbies, school, family, games. Activities should feel like games.' : ''}

STRUCTURE (${duration} min): Warmer (5min) → Language Input (${inputTime}min) → Communicative Activity (${activityTime}min) → Wrap-up (${wrapTime}min)

${levelGuide}
${cefrVocabGuide}

**Exercise 1: Warmer** (5 min)
Get student speaking immediately. ${isKid ? 'Make it a game.' : 'Relevant to lesson topic.'}
- "instructions" = tutor setup (not shown to student). "prompts" = what student responds to (shown to student).
- "prompts" must invite immediate personal responses — stories, opinions, quick reactions. NEVER analytical: "How can X impact Y?", "Why is X important?", "What are the implications of X?"
- Never use student name.
Format: { "type": "warmer", "title": "[Warm-up in ${student.targetLanguage}]", "content": { "activity": "[activity type in ${student.targetLanguage}]", "instructions": "[TUTOR SETUP — not shown to student]", "prompts": ["[prompt 1 in ${student.targetLanguage}]","[prompt 2]","[prompt 3]"] }, "timeMinutes": 5 }

**Exercise 2: Language Input** (${inputTime} min)
4-6 single words. Title = generic word for "Vocabulary" in ${student.targetLanguage}.
- ${cefrVocabGuide}
Design the vocabulary list FIRST, then write the dialogue around it.
DIALOGUE: 10-14 lines, 2 characters. Design a realistic situation that REQUIRES every vocabulary word to arise naturally — do not insert words into an unrelated story. Start with small talk, never jump straight to the main topic. Include one imperfect moment (misunderstanding, correction, forgotten detail). Other person pushes back at least once. At least one genuine emotional reaction. Contractions + natural fillers ("actually", "to be honest", "by the way"). Vary line lengths. End at a natural pause.
- Each dialogue line: "speaker" (name), "gender" ("male"/"female"), "text"
- "instruction": one sentence telling the student to read the dialogue aloud with the tutor, in ${student.targetLanguage}
Format: { "type": "language-input", "title": "[Vocabulary in ${student.targetLanguage}]", "content": { "instruction": "[Read the dialogue aloud with your tutor — in ${student.targetLanguage}]", "vocabulary": [{ "word": "[word]", "partOfSpeech": "[in ${student.targetLanguage}]", "phonetics": "/ipa/", "definition": "[in ${student.targetLanguage}]", "example": "[in ${student.targetLanguage}]", "synonym": "[or empty]" }], "contextDialogue": [{ "speaker": "[name]", "gender": "male", "text": "[in ${student.targetLanguage}]" }] }, "timeMinutes": ${inputTime} }

**Exercise 3: Communicative Activity** (${activityTime} min)
Student communicates freely. Meaning over perfection. ${isKid ? 'Make it playful.' : 'Relevant to real communication needs.'}
- "instructions" = TUTOR SETUP only (not shown to student). Never use student real name anywhere in this exercise.
- "studentCharacter" = fictional name (e.g. Alex, Sam). "studentRole" = their brief in ${student.targetLanguage}.
- "prompts" = task cues shown to student. Refer to tutor as "the tutor" if needed.
Format: { "type": "communicative-activity", "title": "[Speaking Activity in ${student.targetLanguage}]", "content": { "activityName": "[in ${student.targetLanguage}]", "instructions": "[TUTOR SETUP — not shown to student]", "studentCharacter": "[fictional name]", "studentRole": "[brief in ${student.targetLanguage} — no real names]", "tutorRole": "[how tutor participates in ${student.targetLanguage}]", "tutorQuestions": ["[sample Q1 for tutor to ask — in ${student.targetLanguage}]","[Q2]","[Q3]","[Q4]","[Q5]"], "prompts": ["[cue 1 in ${student.targetLanguage}]","[cue 2]"] }, "timeMinutes": ${activityTime} }

**Exercise 4: Wrap-up** (${wrapTime} min)
reviewQuestions = tutor asks orally. Plain questions, never address student by name.
Format: { "type": "wrap-up", "title": "[Review & Homework in ${student.targetLanguage}]", "content": { "reviewQuestions": ["[Q in ${student.targetLanguage}]","[Q2]"], "homework": "[specific task in ${student.targetLanguage}]" }, "timeMinutes": ${wrapTime} }

JSON OUTPUT:
{
  "title": "${lesson.title}",
  "lessonType": "conversation",
  "objective": "[By the end of this lesson, you'll be able to ${lesson.communicativeNeed} — MAX 120 chars in ${student.targetLanguage}]",
  "difficulty": ${student.level === 'beginner' ? 3 : student.level === 'elementary' ? 4 : student.level === 'intermediate' ? 6 : 8},
  "duration": ${duration},
  "skills": ["Speaking","Listening","Vocabulary"],
  "vocabulary": [],
  "context": "${lesson.communicativeNeed}",
  "exercises": [/* 4 exercises in order */],
  "homework": "",
  "materials": [],
  "teachingNotes": "[tutor notes in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`
}

function buildBusinessCLTPrompt(
  student: StudentProfile,
  lesson: BlockLesson,
  duration: 25 | 50,
  levelGuide: string,
  cefrVocabGuide: string,
  vocabularyContextSection: string
): string {
  const is50min = duration === 50
  const vocabTime = is50min ? 5 : 3
  const exprTime = is50min ? 10 : 5
  const dialogueTime = is50min ? 20 : 10
  const roleplayTime = is50min ? 10 : 5
  const discussionTime = is50min ? 5 : 2

  return `Expert ${student.targetLanguage} business English instructor. Generate a business CLT lesson as JSON.

STUDENT: ${student.name}, ${student.level}, ${student.ageGroup}, Goals: ${student.endGoals}${student.occupation ? `, Occupation: ${student.occupation}` : ''}
LESSON: ${lesson.title} | Need: ${lesson.communicativeNeed} | Key language: ${lesson.keyLanguageFeatures.join(', ')}
${vocabularyContextSection}

RULES:
- ALL content in ${student.targetLanguage} (JSON keys stay in English)
- NO em dashes (—). BANNED: "resonate","navigate","landscape","leverage","dynamics","paradigm"
- Business context throughout: workplace scenarios, professional relationships, real tasks

STRUCTURE (${duration} min): Vocabulary (${vocabTime}min) → Useful Expressions (${exprTime}min) → Dialogue (${dialogueTime}min) → Role Play (${roleplayTime}min) → Discussion (${discussionTime}min)

${levelGuide}
${cefrVocabGuide}

**Exercise 1: Vocabulary** (${vocabTime} min)
4-6 single words specific to this business topic. Title = generic word for "Vocabulary" in ${student.targetLanguage}.
Format: { "type": "vocabulary", "title": "[Vocabulary in ${student.targetLanguage}]", "content": { "vocabulary": [{ "word": "[word]", "partOfSpeech": "[in ${student.targetLanguage}]", "phonetics": "/ipa/", "definition": "[in ${student.targetLanguage}]", "example": "[business example in ${student.targetLanguage}]", "synonym": "[or empty]" }] }, "timeMinutes": ${vocabTime} }

**Exercise 2: Useful Expressions** (${exprTime} min)
IMPORTANT: Design these expressions FIRST — the dialogue in Ex 3 will be built around them.
4-6 natural business expressions/phrases for this communicative need. Title = generic word for "Useful Expressions" in ${student.targetLanguage}.
Each expression: the phrase itself, what it means/when to use it, a short example in context.
Format: { "type": "useful-expressions", "title": "[Useful Expressions in ${student.targetLanguage}]", "content": { "expressions": [{ "phrase": "[expression in ${student.targetLanguage}]", "meaning": "[explanation in ${student.targetLanguage}]", "example": "[short example in ${student.targetLanguage}]" }] }, "timeMinutes": ${exprTime} }

**Exercise 3: Dialogue** (${dialogueTime} min)
LANGUAGE REQUIREMENT: Every vocabulary word from Ex 1 AND every expression from Ex 2 must appear. Design the situation to REQUIRE them — do not insert them into an unrelated story.
10-14 lines, 2 professional characters in a workplace setting. Start with small talk, never jump straight to the main topic. Include one imperfect moment (misunderstanding, a follow-up question, a clarification). One person pushes back or disagrees at least once. At least one genuine emotional reaction (relief, surprise, mild frustration). Contractions + natural fillers. Vary line lengths. End at a natural pause.
- "cast": array of speakers with name + gender for audio playback
- Each dialogue line: "character" (name), "text" (line in ${student.targetLanguage})
- "instructions": one sentence telling student to read the dialogue aloud with the tutor, in ${student.targetLanguage}
Format: { "type": "dialogue", "title": "[Dialogue in ${student.targetLanguage}]", "content": { "context": "[brief setting description in ${student.targetLanguage}]", "instructions": "[Read the dialogue aloud with your tutor — in ${student.targetLanguage}]", "cast": [{ "name": "[Speaker 1 name]", "gender": "male" }, { "name": "[Speaker 2 name]", "gender": "female" }], "characters": [{ "name": "[Speaker 1 name]", "role": "[job title in ${student.targetLanguage}]" }, { "name": "[Speaker 2 name]", "role": "[job title in ${student.targetLanguage}]" }], "dialogue": [{ "character": "[name]", "text": "[line in ${student.targetLanguage}]" }] }, "timeMinutes": ${dialogueTime} }

**Exercise 4: Role Play** (${roleplayTime} min)
Student practices the communicative need in a new but similar workplace scenario. Uses the same expressions in a different context.
- Never use student real name. Use fictional names.
Format: { "type": "roleplay", "title": "[Role Play in ${student.targetLanguage}]", "content": { "scenario": "[workplace situation in ${student.targetLanguage}]", "roles": [{ "name": "[fictional student name]", "description": "[their role brief in ${student.targetLanguage}]", "keyPoints": ["[point 1 in ${student.targetLanguage}]","[point 2]"] }, { "name": "[tutor character name]", "description": "[tutor role brief in ${student.targetLanguage}]" }], "instructions": "[how to run the roleplay in ${student.targetLanguage}]" }, "timeMinutes": ${roleplayTime} }

**Exercise 5: Discussion** (${discussionTime} min)
3-5 open discussion questions connecting the lesson topic to the student's real work life. Never use student name. Questions must invite personal experience ("Have you ever...", "In your experience...", "What would you do if...") — NEVER analytical ("Why is X important?", "What are the implications of X?").
Format: { "type": "discussion", "title": "[Discussion in ${student.targetLanguage}]", "content": { "questions": ["[Q1 in ${student.targetLanguage}]","[Q2]","[Q3]","[Q4]","[Q5]"] }, "timeMinutes": ${discussionTime} }

JSON OUTPUT:
{
  "title": "${lesson.title}",
  "lessonType": "business",
  "objective": "[By the end of this lesson, you'll be able to ${lesson.communicativeNeed} — MAX 120 chars in ${student.targetLanguage}]",
  "difficulty": ${student.level === 'beginner' ? 3 : student.level === 'elementary' ? 4 : student.level === 'intermediate' ? 6 : 8},
  "duration": ${duration},
  "skills": ["Speaking","Vocabulary","Listening"],
  "vocabulary": [],
  "context": "${lesson.communicativeNeed}",
  "exercises": [/* 5 exercises in order */],
  "homework": "",
  "materials": [],
  "teachingNotes": "[tutor notes in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`
}
