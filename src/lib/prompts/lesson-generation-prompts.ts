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

FORMAT (concise version): "By the end of this lesson, ${student.name} will confidently [main skill], including [3-4 specific sub-skills]."


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

🚨 CRITICAL LANGUAGE REQUIREMENT:
All lesson content MUST be generated in ${student.targetLanguage}. This includes:
- All exercise instructions and descriptions
- All dialogue lines
- All vocabulary words, definitions, examples, expressions
- All comprehension questions
- All role-play scenarios
- All discussion questions
Do NOT use English or translate to English. Generate ONLY in ${student.targetLanguage}.

VOCABULARY RULES:
- EXACTLY 6 items, all SINGLE WORDS (verbs, adjectives, nouns, idioms, or phrasal verbs only)
- NO compound phrases (e.g., NO "purchase order", "key stakeholder", "product code")
- UNIQUE to THIS lesson - don't repeat vocabulary from other lessons
- DOMAIN-SPECIFIC to the actual task, not generic business words
- ALL 6 must appear naturally in the dialogue (Exercise 3)
- Level-appropriate synonyms (leave blank if no simple synonym exists for beginners)
- Include expressions/collocations (2-3 per word, empty for A1 students)

For vocabulary that's already been taught, naturally incorporate 2-3 of them in the dialogue ONLY - don't teach them again.

ENGOO STRUCTURE (7 exercises in this exact order):

**Exercise 1: Vocabulary** (8 min)
Format: { "type": "vocabulary", "title": "Exercise 1: Vocabulary", "content": { "vocabulary": [{ "word": "word1", "partOfSpeech": "verb", "phonetics": "/fəˈnetɪks/", "definition": "clear definition", "example": "example sentence", "synonym": "simple synonym or empty", "expressions": ["collocation 1", "collocation 2", "collocation 3"] }, ...6 items total] }, "timeMinutes": 8 }

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
- Each question should be 1-2 sentences max
- Questions directly relate to the work scenario in the dialogue
- Include follow-up potential ("Why?" or "What made you..." style)
- Questions should activate student's professional experience and perspective
- Just simple question text - no labels, titles, or metadata
- Do NOT include duplicate text
- Do NOT add metadata fields

Format: { "type": "warmup", "title": "Exercise 2: Warm-up", "description": "Discussion questions", "content": { "questions": ["Question 1 text", "Question 2 text", "Question 3 text"], "instructions": "Discuss the questions." }, "timeMinutes": 8 }

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

Format: { "type": "dialogue", "title": "Exercise 3: Dialogue", "description": "Practice with realistic scenario", "content": { "setting": "Max 150 chars: WHO, WHERE, WHAT", "characters": ["${student.name}", "Selected Role Name"], "dialogue": [{"character": "${student.name}", "text": "..."}, {"character": "Selected Role Name", "text": "..."}, ...8-12 total exchanges with alternating speakers], "instructions": "Read as ${student.name}" }, "timeMinutes": 12 }

**Exercise 4: Dialogue Comprehension** (8 min)
COMPREHENSION FORMAT (FIXED - DO NOT VARY):
- 2 MCQ questions with 3 options only (A, B, C)
  * CRITICAL: Correct answer MUST be randomly distributed - never put both answers in the same position (e.g., both in A, both in B)
  * For 2 MCQ questions: one correct answer should be in position A or C, the other in a DIFFERENT position (B or C, or A or B)
  * Each MCQ: "question", "type": "multiple-choice", "options": ["A) Option 1", "B) Option 2", "C) Option 3"], "answer": "A" or "B" or "C" (MUST be just the letter, not full text)
  * EXAMPLE of good randomization: Q1 answer "B", Q2 answer "C" - NOT "A" then "A"
- 1 True/False question
  * CRITICAL: Alternate the answer - if previous true/false was "true", this should lean toward "false", or vice versa to avoid patterns
  * Format: "question", "type": "true-false", "answer": "true" (lowercase string) OR "false" (lowercase string) - MUST be the literal string value, not "true or false"
  * Vary which one is correct - don't always make the first true/false question "true"
- 2 Structural open-ended questions
  * Format: "question", "type": "short-answer", "answer": "Full sentence answer"
- Total: Always 5 questions in this exact structure

CRITICAL VALIDATION:
- MCQ answers MUST be exactly "A", "B", or "C" (single uppercase letter only)
- True/False answers MUST be exactly "true" or "false" (lowercase string literals, not "true or false")
- Do NOT include placeholder text like "[random A, B, or C]" - use actual values
- DO NOT create patterns like: all answers in position A or B
- DO randomize across all positions naturally

Format: { "type": "comprehension", "title": "Exercise 4: Comprehension", "description": "Answer questions about the dialogue", "content": { "questions": [
  {"question": "Q1 text (MCQ)", "type": "multiple-choice", "options": ["A) ...", "B) ...", "C) ..."], "answer": "B"},
  {"question": "Q2 text (MCQ)", "type": "multiple-choice", "options": ["A) ...", "B) ...", "C) ..."], "answer": "C"},
  {"question": "Q3 text (True/False)", "type": "true-false", "answer": "true"},
  {"question": "Q4 text (Open - structural)", "type": "short-answer", "answer": "Full sentence answer"},
  {"question": "Q5 text (Open - structural)", "type": "short-answer", "answer": "Full sentence answer"}
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
SENTENCE CORRECTION EXERCISE:
- Generate 10 sentences with intentional mistakes related to: tenses, word order, prepositions, subject-verb agreement, article usage, etc.
- Each sentence should be relevant to the lesson topic and use vocabulary from Exercise 1
- Provide CORRECTED versions of all 10 sentences
- Each item has: incorrect sentence, correct version, the error type (e.g., "verb tense", "word order", "preposition")

TUTOR VERSION: Shows [Correct] button that reveals the corrected sentence and error explanation
STUDENT VERSION: Shows ONLY the incorrect sentence, no answers visible (student writes their correction)

Format: { "type": "sentence-correction", "title": "Exercise 5: Sentence Correction", "description": "Fix grammar and syntax errors", "content": { "sentences": [
  { "incorrect": "I am working here since 2 years.", "correct": "I have been working here for 2 years.", "errorType": "verb tense" },
  { "incorrect": "She go to the office every day.", "correct": "She goes to the office every day.", "errorType": "subject-verb agreement" },
  ...10 total sentences with variety of error types
] }, "timeMinutes": 10 }

**Exercise 6: Discussion** (6 min)
Format: { "type": "discussion", "title": "Exercise 6: Discussion", "description": "Free practice", "content": { "questions": [5 discussion questions on the lesson topic], "instructions": "Use new vocabulary" }, "timeMinutes": 6 }

**Exercise 7: Further Discussion** (6 min)
UPDATED: Lighter, follow-up questions. Same structure and CSS format as Exercise 6.
- Questions should be engaging but lighter in tone
- General questions that broaden the conversation beyond the specific lesson topic
- Encourages natural conversation using vocabulary in different contexts
Format: { "type": "discussion", "title": "Exercise 7: Further Discussion", "description": "Free practice", "content": { "questions": [5 general discussion questions that relate to the broader topic area], "instructions": "Continue the conversation" }, "timeMinutes": 6 }

${levelGuide}

${cefrVocabGuide}

JSON OUTPUT:
{
  "title": "${topic.title}",
  "lessonType": "${(student.ageGroup === 'child' || student.ageGroup === 'teenager') ? 'Under-18' : 'interactive'}",
  "objective": "By the end of the lesson, ${student.name} will be able to confidently [INSERT SPECIFIC MAIN SKILL] in English, including [INSERT 3-4 SPECIFIC SUB-SKILLS]. FOLLOW THE FORMAT ABOVE EXACTLY.",
  "difficulty": ${student.level === 'beginner' ? '3' : student.level === 'elementary' ? '4' : student.level === 'intermediate' ? '6' : '8'},
  "duration": ${duration},
  "skills": ["Speaking", "Listening", "Reading", "Vocabulary"],
  "vocabulary": [],
  "context": "${topic.context}",
  "exercises": [/* 7 exercises as formatted above */],
  "homework": "Review vocabulary and practice dialogue",
  "materials": [],
  "teachingNotes": ""
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}
