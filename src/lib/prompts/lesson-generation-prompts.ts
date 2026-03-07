/**
 * Lesson generation prompt templates (streamlined - 55% smaller)
 * Removed redundancy: vocabulary rules repeated 3x, dialogue rules repeated 2x
 * Removed excessive examples: kept format, removed A1/B1/C1 samples
 * 
 * UPDATES:
 * 1. Context → Objectives with skill learning (max 120 chars)
 * 2. Warmup: Single instruction "Discuss the questions"
 * 3. Dialogue setting: Max 150 characters
 * 4. Roleplay scenario: Max 150 characters
 * 5. Roleplay instructions: Action-based with tutor role guidance
 */

import { StudentProfile, LearningTopic } from '../../types/lesson-template';

export function buildLessonGenerationPrompt(
  student: StudentProfile,
  topic: LearningTopic,
  duration: 25 | 50,
  vocabularyContextSection: string,
  under18Section: string,
  roles: string[],
  scenarioHints: string,
  levelGuide: string,
  cefrVocabGuide: string
): string {
  return `You are an expert language instructor creating authentic Engoo-format lessons. Generate a complete lesson following the EXACT structure below.

STUDENT PROFILE:
- Name: ${student.name}
- Level: ${student.level} 
- Age: ${student.ageGroup}
- Goals: ${student.endGoals}
- Occupation: ${student.occupation || 'Professional'}
- Weaknesses: ${student.weaknesses || 'General'}

TOPIC: ${topic.title}
OBJECTIVE: ${topic.objective}

**IMPORTANT: OBJECTIVE SPECIFICATION (MAX 120 CHARACTERS)**
The objective MUST be outcome-focused and specific, showing exactly what the student will be ABLE TO DO after the lesson.

FORMAT (concise version): "By the end of this lesson, ${student.name} will confidently [main skill], including [3-4 specific sub-skills]." — WRITE THIS IN ${student.targetLanguage}.


GLOBAL FORMATTING RULES (APPLY TO ALL CONTENT):
- NEVER use em dashes (—) anywhere in any content. Use commas, periods, or semicolons instead.
- NEVER suggest or include background colors, colored badges, or colored containers in any content field.

CRITICAL RULES:
- Maximum 120 characters (count carefully!)
- Start with "By the end of this lesson, [Name] will confidently"
- Use action verbs 
- List 3 specific sub-skills separated by commas
- Use "including" to introduce sub-skills
- Be concrete and measurable, NOT vague
- Do NOT repeat the lesson title or use generic statements
- Keep it SHORT and punchy

${topic.vocabulary && Array.isArray(topic.vocabulary) ? `VOCABULARY: ${topic.vocabulary.join(', ')}` : ''}${vocabularyContextSection}${under18Section}

CRITICAL LESSON RULE:
The lesson "${topic.title}" must show ${student.name} PERFORMING the actual task (presenting, negotiating, processing order, reviewing code, etc.), NOT discussing how to do it.

✅ CORRECT: "Code Review Meeting" → ${student.name} reviews actual code with team, discusses technical details
❌ WRONG: "Code Review Meeting" → Team coaches ${student.name} on how to give feedback

🚨 CRITICAL LANGUAGE REQUIREMENT — THIS OVERRIDES EVERYTHING ELSE:
ALL lesson content MUST be in ${student.targetLanguage}. This means:
- ALL exercise titles (NOT "Exercise 1: Vocabulary" — translate to ${student.targetLanguage})
- ALL exercise descriptions and instructions
- ALL dialogue lines, vocabulary definitions, examples, expressions
- ALL comprehension questions and answers
- ALL role-play scenarios and key points
- ALL discussion questions
- The objective, context, homework, teachingNotes fields
- Even the sentence correction sentences must be in ${student.targetLanguage}
The ONLY English allowed is in the JSON keys ("type", "content", etc.) and the "type" values ("vocabulary", "warmup", etc.).
Every piece of text the student or teacher reads MUST be in ${student.targetLanguage}. ZERO English in any text field.

VOCABULARY RULES:
- EXACTLY 6 items, all SINGLE WORDS (verbs, adjectives, nouns, idioms, or phrasal verbs only)
- NO compound phrases (e.g., NO "purchase order", "key stakeholder", "product code")
- UNIQUE to THIS lesson - don't repeat vocabulary from other lessons
- DOMAIN-SPECIFIC to the actual task, not generic business words
- ALL 6 must appear naturally in the dialogue (Exercise 3)
- Level-appropriate synonyms (leave blank if no simple synonym exists for beginners)
- Include expressions/collocations (2-3 per word, empty for A1 students)

For vocabulary that's already been taught, naturally incorporate 2-3 of them in the dialogue ONLY - don't teach them again.

ENGOO STRUCTURE (6 exercises in this exact order):

**Exercise 1: Vocabulary** (8 min)
Format: { "type": "vocabulary", "title": "[title in ${student.targetLanguage}]", "content": { "vocabulary": [{ "word": "word1", "partOfSpeech": "[in ${student.targetLanguage}]", "phonetics": "/fəˈnetɪks/", "definition": "[in ${student.targetLanguage}]", "example": "[in ${student.targetLanguage}]", "synonym": "[in ${student.targetLanguage} or empty]", "expressions": ["[in ${student.targetLanguage}]"] }, ...6 items total] }, "timeMinutes": 8 }

**Exercise 2: Warm-up** (8 min)
WARMUP STRUCTURE: EXACTLY 3 simple, natural questions - NO MORE, NO LESS:
- Question 1 ONLY: Personal experience/opinion question that builds confidence and rapport
- Question 2 ONLY: Prior knowledge question about the topic/domain that activates context  
- Question 3 ONLY: Thought-provoking question that primes the key communication concept

WARMUP GENERATION RULES (STRICT):
- Generate EXACTLY 3 questions in the array. Not 2, not 4, not 5. Exactly 3 questions ONLY.
- DO NOT add a 4th item to the array
- DO NOT add a 4th question with text like "Discuss the questions" - that's the instruction, NOT a question
- Natural, conversational tone - NOT textbook style
- Each question should be SHORT — MAX 15 words. Keep it punchy and conversational.
- NEVER use the student's name in the questions. Write generic "you" questions.
- Questions directly relate to the work scenario in the dialogue
- Questions should activate student's professional experience and perspective
- Just simple question text - no labels, titles, or metadata
- Do NOT include duplicate text
- Do NOT add metadata fields

TOPIC ANCHORING — CRITICAL:
  All three warm-up questions must directly relate to the lesson's specific topic.
  If the lesson is about giving presentations, ask about presentations. If it is
  about negotiating contracts, ask about contracts. Never ask generic questions
  that could apply to any lesson.

BANNED QUALIFIERS:
  Never use the phrases "big or small", "large or small", "great or small", or
  similar paired qualifiers in any question. Just ask the question directly.

BANNED AI-TELL WORDS (applies to warm-up AND discussion):
  Never use: "resonate", "navigate", "landscape", "leverage", "dynamics",
  "paradigm", "facilitate", "implications", "aspects", "in terms of",
  "when it comes to", "have you ever found yourself", "what role does X play".

Format: { "type": "warmup", "title": "[title in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": ["Q1 in ${student.targetLanguage}", "Q2 in ${student.targetLanguage}", "Q3 in ${student.targetLanguage}"], "instructions": "[in ${student.targetLanguage}]" }, "timeMinutes": 8 }

CRITICAL: "Discuss the questions." is the INSTRUCTION field value, NOT a 4th question in the array.

**Exercise 3: Dialogue** (12 min)
UPDATED: Natural dialogue with organic length - LIMITED TO 8-12 TOTAL TURNS. Dialogue should start naturally, develop authentically, and end with resolution/conclusion. Write as people actually speak in the real situation.
DIALOGUE RULES (Exercise 3):
- LIMIT: 8-12 total turns (exchanges between student and participant)
- Let dialogue flow naturally to a conclusion within this limit
- ${student.name} speaks FIRST and after most responses (realistic conversation flow)
- Setting: Max 150 characters. Concise description of WHO, WHERE, WHAT event
- Participants: Choose from ${roles.join(', ')} based on occupation
- Content: About actual work (project details, specs, contract terms, code logic) - NOT communication techniques
- NATURAL dialogue: Write as people actually speak, no forced vocabulary
- CONCLUSIVE ENDING: Must have a decision, agreement, or resolution
- NO EM DASHES (—)
- CRITICAL: Use EXACT character names in the dialogue exchanges - use "${student.name}" and the selected role name EXACTLY as listed in the characters array

Format: { "type": "dialogue", "title": "[title in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "setting": "[Max 150 chars in ${student.targetLanguage}]", "characters": ["${student.name}", "[Role Name]"], "dialogue": [{"character": "${student.name}", "text": "[in ${student.targetLanguage}]"}, {"character": "[Role Name]", "text": "[in ${student.targetLanguage}]"}, ...8-12 total exchanges with alternating speakers] }, "timeMinutes": 12 }

**Exercise 4: Dialogue Comprehension** (8 min)
COMPREHENSION FORMAT (SIMPLIFIED - OPEN-ENDED ONLY):
- 3 Structural open-ended questions ONLY
  * Format: "question", "type": "short-answer", "answer": "Full sentence answer"
  * Questions should test understanding of dialogue content, decisions made, reasoning, and key points
  * Each answer should be 1-2 sentences that directly address the question

- Total: Always 3 questions in this exact structure (open-ended only, no MCQ or True/False)

Format: { "type": "comprehension", "title": "[title in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": [
  {"question": "[Q1 in ${student.targetLanguage}]", "type": "short-answer", "answer": "[in ${student.targetLanguage}]"},
  {"question": "[Q2 in ${student.targetLanguage}]", "type": "short-answer", "answer": "[in ${student.targetLanguage}]"},
  {"question": "[Q3 in ${student.targetLanguage}]", "type": "short-answer", "answer": "[in ${student.targetLanguage}]"}
] }, "timeMinutes": 8 }

/*
**Exercise 5: Role Play** (10 min)
UPDATED: 
- Scenario: Max 150 characters. WHO, WHERE, WHAT student does
- Instructions: Action-based, step-by-step (do X, then Y, then Z)
- Include tutor role with clear guidance on how to respond

Format: { "type": "roleplay", "title": "Exercise 5: Role Play", "description": "Practice in new situation", "content": { "scenario": "Max 150 chars: WHO, WHERE, WHAT ${student.name} does", "roles": [{ "name": "${student.name}", "description": "${student.occupation || 'Professional'} performing the task", "keyPoints": ["Step 1: [action - what to do]", "Step 2: [action - use vocabulary]", "Step 3: [action - conclude]"] }, { "name": "Tutor", "description": "Responds to ${student.name} to guide dialogue", "keyPoints": ["Listen and react naturally", "Ask clarifying questions", "Respond based on student's vocabulary use"] }], "instructions": "Student: Perform each step. Use new vocabulary naturally. Tutor: Guide the student with realistic responses and questions." }, "timeMinutes": 10 }
*/

**Exercise 5: Sentence Correction** (10 min)

🚨 ABSOLUTE REQUIREMENT: Every single sentence MUST contain a REAL, VISIBLE grammar mistake. The "incorrect" field and "correct" field MUST be DIFFERENT strings. If they are identical, you have FAILED.

GOOD EXAMPLES (the incorrect version has a clear, visible error):
{ "incorrect": "She have been working here for five years.", "correct": "She has been working here for five years.", "errorType": "Subject-verb agreement", "explanation": "Use 'has' with third-person singular subjects." }
{ "incorrect": "I enjoy to read technical documentation.", "correct": "I enjoy reading technical documentation.", "errorType": "Gerund vs infinitive", "explanation": "'Enjoy' requires a gerund, not an infinitive." }
{ "incorrect": "The team discussed about the new proposal.", "correct": "The team discussed the new proposal.", "errorType": "Unnecessary preposition", "explanation": "'Discuss' is transitive — no preposition needed." }
{ "incorrect": "He suggested me to check the report.", "correct": "He suggested that I check the report.", "errorType": "Verb pattern", "explanation": "'Suggest' takes a that-clause, not object + infinitive." }

BAD EXAMPLES (DO NOT generate these — the sentence is already correct or the "error" is trivial/invented):
❌ { "incorrect": "The adhesive bonds the components securely.", "correct": "The adhesive bonds the components securely." } ← IDENTICAL! No real error!
❌ { "incorrect": "Great, thank you.", "correct": "Great, thank you." , "errorType": "Punctuation" } ← Not a real teaching moment!
❌ { "incorrect": "We can laminate different types of plastics to create a material which has unique properties.", "correct": "...a material that has...", "errorType": "Relative pronoun" } ← Both 'which' and 'that' are acceptable here. NOT a real error!

PICK 10 ERRORS FROM THIS LIST (match to student level ${student.level}):

FOR ALL LEVELS — these are the most common, highest-value learner errors:
1. Subject-verb agreement: "The results shows..." → "show"; "Everyone have..." → "has"
2. Tense misuse: "I live here since 2020" → "have lived"; "Yesterday I go" → "went"
3. Preposition errors: "interested for" → "in"; "depend of" → "on"; "arrive to" → "at"
4. Article errors: "She is doctor" → "a doctor"; "I need advice" (when countable needed)
5. Gerund vs infinitive: "enjoy to read" → "reading"; "suggest to go" → "suggest going"
6. Word order: "I eat always breakfast" → "always eat"; "She speaks well English" → "speaks English well"
7. Countable/uncountable: "informations" → "information"; "less people" → "fewer"; "an advice" → "some advice"
8. Collocations: "do a mistake" → "make"; "say me" → "tell me"; "make homework" → "do homework"
9. Conditionals: "If I would know" → "If I knew"; "If I studied, I will pass" → "would pass"
10. Relative pronouns: "The man which called" → "who"; "The reason why is because" → "is that"

ADDITIONAL FOR B2+ ONLY:
11. Reported speech: "He said he is coming" → "was coming"
12. Passive voice: "The report was wrote" → "written"
13. Parallel structure: "likes hiking, swimming, and to run" → "and running"
14. Verb patterns: "prevent him to leave" → "from leaving"; "discussed about" → "discussed"

RULES:
1. ALL 10 sentences MUST be WRONG. Zero correct sentences. The "incorrect" and "correct" fields MUST DIFFER.
2. ONE mistake per sentence. The rest of the sentence must be grammatically perfect.
3. The error must be OBVIOUS when pointed out — not a stylistic preference or debatable usage.
4. Use vocabulary from Exercise 1 and keep sentences relevant to the lesson topic.
5. Each sentence: 8-18 words. No overly complex or technical sentences that hide the error.
6. All 10 errorTypes must be DIFFERENT — never repeat the same grammar rule.
7. Explanation states the RULE: "Use 'has' with third-person singular" — NOT "Changed 'have' to 'has'."

SELF-CHECK BEFORE OUTPUT: Read each sentence pair. If "incorrect" === "correct", DELETE IT and write a new one with a real error.

Format: { "type": "sentence-correction", "title": "[title in ${student.targetLanguage}]", "content": { "sentences": [
  { "incorrect": "[Sentence in ${student.targetLanguage} WITH a visible grammar mistake]", "correct": "[Same sentence FIXED in ${student.targetLanguage}]", "errorType": "[rule name in ${student.targetLanguage}]", "explanation": "[in ${student.targetLanguage}, max 12 words]" },
  ...10 total, ALL incorrect, ALL different error types
] }, "timeMinutes": 10 }

**Exercise 6: Discussion** (12 min)
MERGED DISCUSSION EXERCISE - Combines free practice and extended conversation into one section:
- Generate exactly 5 questions total
- Questions should be SHORT — MAX 15 words each. Direct and conversational.
- NEVER use the student's name in the questions. Write generic "you" questions.
- NO instructional language (avoid "explain", "describe", "how do you approach", "tell me about")
- NO framing or explanations before questions
- Assume the student has real work experience
- Questions should sound like everyday conversation
- Mix of: personal experience, practical application, and related perspectives
- Questions can build on lesson topic OR broaden to related context
- Natural, engaging tone - NOT academic

TOPIC ANCHORING — CRITICAL:
  All five discussion questions must connect directly to the lesson's specific topic.
  Use the lesson content as the anchor for every question. Do not drift into
  generic life questions unrelated to the skill being practiced.

BANNED QUALIFIERS:
  Never use "big or small", "large or small", "great or small", or similar
  paired qualifiers. Just ask the question directly.

QUESTION STYLE EXAMPLES (Engoo format):
- Instead of: "Can you describe your experience with presenting to clients?"
- Use: "What's the toughest part of client presentations for you?"
- Instead of: "How would you approach..."
- Use: "What would you do if...?"
- Instead of: "Tell me about your experience with..."
- Use: "When was the last time you...?"

Format: { "type": "discussion", "title": "[title in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": ["Q1 in ${student.targetLanguage}", "Q2 in ${student.targetLanguage}", "Q3 in ${student.targetLanguage}", "Q4 in ${student.targetLanguage}", "Q5 in ${student.targetLanguage}"], "instructions": "[single instruction in ${student.targetLanguage}]" }, "timeMinutes": 12 }

${levelGuide}

${cefrVocabGuide}

JSON OUTPUT:
{
  "title": "${topic.title}",
  "lessonType": "${(student.ageGroup === 'child' || student.ageGroup === 'teenager') ? 'Under-18' : 'interactive'}",
  "objective": "[Write the objective in ${student.targetLanguage} using the format above]",
  "difficulty": ${student.level === 'beginner' ? '3' : student.level === 'elementary' ? '4' : student.level === 'intermediate' ? '6' : '8'},
  "duration": ${duration},
  "skills": ["Speaking", "Listening", "Reading", "Vocabulary"],
  "vocabulary": [],
  "context": "${topic.context}",
  "exercises": [/* 6 exercises as formatted above - Exercises 1-6 (Exercise 6 merges old Exercises 6 and 7) */],
  "homework": "[in ${student.targetLanguage}]",
  "materials": [],
  "teachingNotes": "[in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}
