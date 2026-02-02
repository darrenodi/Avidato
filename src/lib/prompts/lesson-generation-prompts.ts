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

ENGOO STRUCTURE (6 exercises in this exact order):

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
COMPREHENSION FORMAT (SIMPLIFIED - OPEN-ENDED ONLY):
- 3 Structural open-ended questions ONLY
  * Format: "question", "type": "short-answer", "answer": "Full sentence answer"
  * Questions should test understanding of dialogue content, decisions made, reasoning, and key points
  * Each answer should be 1-2 sentences that directly address the question

- Total: Always 3 questions in this exact structure (open-ended only, no MCQ or True/False)

Format: { "type": "comprehension", "title": "Exercise 4: Comprehension", "description": "Answer questions about the dialogue", "content": { "questions": [
  {"question": "Q1 text (Open - structural)", "type": "short-answer", "answer": "Full sentence answer"},
  {"question": "Q2 text (Open - structural)", "type": "short-answer", "answer": "Full sentence answer"},
  {"question": "Q3 text (Open - structural)", "type": "short-answer", "answer": "Full sentence answer"}
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
Generate 10 sentences with VARIED and CREATIVE grammar mistakes. Use a mix of error types - distribute them creatively across the 10 sentences:

ERROR TYPE VARIETY (use at least 8 different types, be creative with examples):
1. **Conditional forms** - mixing real/unreal conditions: "If you will know the answer..." → "If you knew the answer..."
2. **Reported speech** - indirect speech mistakes: "He said me that..." → "He told me that..."
3. **Tenses** - mixing present/past, simple/continuous: "I am here for 5 years" → "I have been here for 5 years"
4. **Prepositions** - common prep errors: "Discuss about the topic" → "Discuss the topic"
5. **Make vs Do** - confusing these verbs: "make a decision" vs "do homework": "She made her homework" → "She did her homework"
6. **Gerund vs Infinitive** - wrong verb form: "I suggest you studying" → "I suggest you study" or "I enjoy to read" → "I enjoy reading"
7. **Adverb position** - word order mistakes: "He speaks English fluently well" → "He speaks English fluently"
8. **Subject-verb agreement** - singular/plural: "The team are ready" (US) → "The team is ready" (for US English)
9. **Articles (a/an/the)** - missing or incorrect: "He is doctor" → "He is a doctor"
10. **Passive voice** - active/passive confusion: "The report was completed by them yesterday" (awkward) → "They completed the report yesterday"
11. **Relative clauses** - wrong pronouns/missing verbs: "The person which I met..." → "The person who I met..." or "The person I met..."
12. **Word order** - general ordering issues: "She very much likes coffee" → "She likes coffee very much"

RULES:
- Each sentence MUST use real vocabulary from Exercise 1 or domain-specific terms
- Create realistic, contextual sentences (not artificial)
- Vary error types across the 10 sentences - NO repeated error types
- Each error should be subtle but clear when corrected (not trivial)
- Keep sentences professional and task-relevant
- Errors should be common learner mistakes, not obscure grammar

TUTOR VERSION: Shows [Show Answer] button that reveals the corrected sentence and error type label
STUDENT VERSION: Shows ONLY the incorrect sentence numbered 1-10, no answers visible (student writes their correction)

Format: { "type": "sentence-correction", "title": "Exercise 5: Sentence Correction", "description": "Fix grammar and syntax errors", "content": { "sentences": [
  { "incorrect": "If you will complete the project on time, we will celebrate.", "correct": "If you complete the project on time, we will celebrate.", "errorType": "conditional form" },
  { "incorrect": "He said me that the deadline was important.", "correct": "He told me that the deadline was important.", "errorType": "reported speech" },
  { "incorrect": "I am working in this company since 2019.", "correct": "I have been working in this company since 2019.", "errorType": "verb tense" },
  { "incorrect": "Let's discuss about the strategy for next quarter.", "correct": "Let's discuss the strategy for next quarter.", "errorType": "preposition" },
  { "incorrect": "She made her assignments very carefully.", "correct": "She did her assignments very carefully.", "errorType": "make vs do" },
  { "incorrect": "I suggest you studying the documentation before the meeting.", "correct": "I suggest you study the documentation before the meeting.", "errorType": "infinitive vs gerund" },
  { "incorrect": "The manager has decided that wisely.", "correct": "The manager has wisely decided that.", "errorType": "adverb position" },
  { "incorrect": "The data from our users are very important.", "correct": "The data from our users is very important.", "errorType": "subject-verb agreement" },
  { "incorrect": "I need to send the email to a manager.", "correct": "I need to send the email to the manager.", "errorType": "article" },
  { "incorrect": "The strategy was implemented by the team successfully.", "correct": "The team successfully implemented the strategy.", "errorType": "passive voice awkwardness" }
] }, "timeMinutes": 10 }

**Exercise 6: Discussion** (12 min)
MERGED DISCUSSION EXERCISE - Combines free practice and extended conversation into one section:
- Generate exactly 5 questions total
- Questions should be short, direct, and conversational
- NO instructional language (avoid "explain", "describe", "how do you approach", "tell me about")
- NO framing or explanations before questions
- Assume the student has real work experience
- Questions should sound like everyday conversation
- Mix of: personal experience, practical application, and related perspectives
- Questions can build on lesson topic OR broaden to related context
- Natural, engaging tone - NOT academic

QUESTION STYLE EXAMPLES (Engoo format):
- Instead of: "Can you describe your experience with presenting to clients?"
- Use: "What's the toughest part of client presentations for you?"
- Instead of: "How would you approach..."
- Use: "What would you do if...?"
- Instead of: "Tell me about your experience with..."
- Use: "When was the last time you...?"

Format: { "type": "discussion", "title": "Exercise 6: Discussion", "description": "Free practice", "content": { "questions": ["Question 1 - short and direct", "Question 2 - practical and relatable", "Question 3 - personal experience", "Question 4 - related perspective", "Question 5 - broader context or reflection"], "instructions": "Discuss freely" }, "timeMinutes": 12 }

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
  "exercises": [/* 6 exercises as formatted above - Exercises 1-6 (Exercise 6 merges old Exercises 6 and 7) */],
  "homework": "Review vocabulary and practice dialogue",
  "materials": [],
  "teachingNotes": ""
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}
