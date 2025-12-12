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
LESSON CONTEXT (Max 120 chars): Write a brief, clear statement of what the student will learn and practice - focus on learning outcomes (specific skills, communication approaches, or competencies) in the lesson context. Keep concise and direct.
${topic.context ? `CONTEXT: ${topic.context}` : ''}
${topic.vocabulary && Array.isArray(topic.vocabulary) ? `VOCABULARY: ${topic.vocabulary.join(', ')}` : ''}${vocabularyContextSection}${under18Section}

CRITICAL LESSON RULE:
The lesson "${topic.title}" must show ${student.name} PERFORMING the actual task (presenting, negotiating, processing order, reviewing code, etc.), NOT discussing how to do it.

✅ CORRECT: "Code Review Meeting" → ${student.name} reviews actual code with team, discusses technical details
❌ WRONG: "Code Review Meeting" → Team coaches ${student.name} on how to give feedback

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
UPDATED: Natural, engaging questions that set context for the lesson. No generic openers.
Format: { "type": "warmup", "title": "Exercise 2: Warm-up", "description": "Discussion questions", "content": { "questions": [2-3 natural, contextual questions that engage student with the topic], "instructions": "Discuss the questions." }, "timeMinutes": 8 }

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
CRITICAL MCQ FORMAT:
- Each MCQ MUST have: "question", "type": "multiple-choice", "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"], "answer": "A" (use letter only)
- Each MCQ answer MUST use DIFFERENT letters (Q1: A, Q2: D, Q3: B - never repeat a letter)
- Open-ended questions: "question", "type": "short-answer", "answer": "Full sentence answer"
Format: { "type": "comprehension", "title": "Exercise 4: Comprehension", "description": "Answer questions about the dialogue", "content": { "questions": [{"question": "Q1 text", "type": "multiple-choice", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "A"}, {"question": "Q2 text", "type": "multiple-choice", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "D"}, {"question": "Q3 text", "type": "short-answer", "answer": "Full sentence"}] }, "timeMinutes": 8 }

**Exercise 5: Role Play** (10 min)
UPDATED: 
- Scenario: Max 150 characters. WHO, WHERE, WHAT student does
- Instructions: Action-based, step-by-step (do X, then Y, then Z)
- Include tutor role with clear guidance on how to respond

Format: { "type": "roleplay", "title": "Exercise 5: Role Play", "description": "Practice in new situation", "content": { "scenario": "Max 150 chars: WHO, WHERE, WHAT ${student.name} does", "roles": [{ "name": "${student.name}", "description": "${student.occupation || 'Professional'} performing the task", "keyPoints": ["Step 1: [action - what to do]", "Step 2: [action - use vocabulary]", "Step 3: [action - conclude]"] }, { "name": "Tutor", "description": "Responds to ${student.name} to guide dialogue", "keyPoints": ["Listen and react naturally", "Ask clarifying questions", "Respond based on student's vocabulary use"] }], "instructions": "Student: Perform each step. Use new vocabulary naturally. Tutor: Guide the student with realistic responses and questions." }, "timeMinutes": 10 }

**Exercise 6: Discussion** (6 min)
Format: { "type": "discussion", "title": "Exercise 6: Discussion", "description": "Free practice", "content": { "questions": [3-4 discussion questions on the lesson topic], "instructions": "Use new vocabulary" }, "timeMinutes": 6 }

**Exercise 7: Further Discussion** (6 min)
UPDATED: Lighter, tech-related follow-up questions. Same structure and CSS format as Exercise 6.
- Questions should be engaging but lighter in tone
- Related to tech/professional world but not the core lesson topic
- Encourages natural conversation using vocabulary in different contexts
Format: { "type": "discussion", "title": "Exercise 7: Further Discussion", "description": "Free practice", "content": { "questions": [2-3 lighter, tech-related discussion questions], "instructions": "Continue the conversation" }, "timeMinutes": 6 }

${levelGuide}

${cefrVocabGuide}

JSON OUTPUT:
{
  "title": "${topic.title}",
  "lessonType": "${(student.ageGroup === 'child' || student.ageGroup === 'teenager') ? 'Under-18' : 'interactive'}",
  "objective": "${topic.objective}",
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
