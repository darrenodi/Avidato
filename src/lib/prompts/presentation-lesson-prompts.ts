/**
 * Presentation Lesson Generation Prompts - Engoo Format
 * Generates flexible exercises matching Engoo Global lesson structure
 */

import { StudentProfile } from '../../types/lesson-template'

export function buildPresentationLessonPrompt(
  student: StudentProfile,
  topic: string,
  objective: string
): string {
  return `You are an expert English language teacher creating a presentation lesson in Engoo Global format.

STUDENT PROFILE:
- Name: ${student.name}
- Level: ${student.level}
- Target Language: ${student.targetLanguage}
- Goals: ${student.endGoals}

LESSON DETAILS:
- Topic: ${topic}
- Objective: ${objective}

Create 4-5 exercises by flexibly mixing these types based on what best teaches this presentation topic:

EXERCISE TYPES AND FORMATS:

1. VOCABULARY Exercise
{
  "type": "vocabulary",
  "title": "Presentation Vocabulary",
  "items": [
    {
      "word": "word in ${student.targetLanguage}",
      "pos": "Verb|Noun|Phrase|etc",
      "pronunciation": "phonetic",
      "definition": "definition in ${student.targetLanguage}",
      "example": "example sentence in ${student.targetLanguage}"
    }
  ]
}

2. EXPRESSIONS Exercise
{
  "type": "expressions",
  "title": "Useful Expressions for Presentations",
  "items": ["phrase 1 in ${student.targetLanguage}", "phrase 2 in ${student.targetLanguage}", ...]
}

3. EXAMPLE Exercise
{
  "type": "example",
  "title": "Example Presentation",
  "introduction": "Introduction text in ${student.targetLanguage}",
  "content": "Full presentation text in ${student.targetLanguage} (200-400 words)"
}

4. DIALOGUE Exercise
{
  "type": "dialogue",
  "title": "Dialogue: Presenter and Audience",
  "introduction": "Context in ${student.targetLanguage}",
  "dialogue": [
    {"speaker": "Person Name", "text": "dialogue text in ${student.targetLanguage}"},
    ...
  ],
  "comprehension": ["Question 1 in ${student.targetLanguage}?", "Question 2?", ...]
}

5. MANUAL Exercise
{
  "type": "manual",
  "title": "Study Manual: How to Deliver a Presentation",
  "introduction": "Introduction text in ${student.targetLanguage}",
  "tips": [
    {
      "title": "Tip Name",
      "description": "Detailed explanation in ${student.targetLanguage}"
    }
  ]
}

6. ROLEPLAY Exercise
{
  "type": "roleplay",
  "title": "Role Play Activity",
  "situation": "Situation description in ${student.targetLanguage}",
  "instructions": "What to do in ${student.targetLanguage}",
  "suggestedExpressions": ["phrase 1", "phrase 2", ...]
}

7. DISCUSSION Exercise
{
  "type": "discussion",
  "title": "Discussion Questions",
  "questions": ["Question 1 in ${student.targetLanguage}?", "Question 2?", ...]
}

RULES:
- Return ONLY valid JSON, no markdown
- ALL content MUST be in ${student.targetLanguage}
- Choose 4-5 exercises (mix types intelligently for the topic)
- Vocabulary: 6-8 words
- Expressions: 10-15 phrases
- Example: 250-400 words
- Dialogue: 3-4 exchanges + 3-4 comprehension questions
- Manual: introduction + 4-6 tips
- RolePlay: clear situation + instructions
- Discussion: 4-6 questions

RESPOND WITH ONLY THIS JSON STRUCTURE:
{
  "exercises": [
    ... your exercises here ...
  ]
}`
}
