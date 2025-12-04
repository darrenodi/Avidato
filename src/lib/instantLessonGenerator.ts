// src/lib/instantLessonGenerator.ts
import { generateWithFailover } from './geminiFailover';
import { extractJSONFromText, cleanAndParseJSON } from './utils/json-parser';

interface InstantLessonParams {
  targetLanguage: string;
  nativeLanguage: string;
  level: string;
  topic: string;
  description?: string;
  duration: 25 | 50;
  studentName?: string;
}

interface GeneratedLesson {
  title: string;
  lessonType: string;
  difficulty: number | string;
  duration: number;
  objective: string;
  skills: string[];
  vocabulary: unknown[];
  context: string;
  exercises: unknown[];
  homework?: string;
  materials?: string[];
  teachingNotes?: string;
}

/**
 * Generate an instant lesson for any language
 * This is a simplified, language-agnostic version of the main lesson generator
 */
export async function generateInstantLesson(params: InstantLessonParams): Promise<GeneratedLesson> {
  const prompt = buildInstantLessonPrompt(params);

  try {
    const { rawText: text } = await generateWithFailover({
      prompt,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    // Extract and parse JSON
    const jsonStr = extractJSONFromText(text);
    const parsedResponse = cleanAndParseJSON<GeneratedLesson>(jsonStr);

    return parsedResponse;
  } catch (error) {
    console.error('Error generating instant lesson:', error);
    throw new Error('Failed to generate lesson. Please try again.');
  }
}

function buildInstantLessonPrompt(params: InstantLessonParams): string {
  const {
    targetLanguage,
    nativeLanguage,
    level,
    topic,
    description,
    duration,
    studentName = 'Student'
  } = params;

  const additionalContext = description ? `\n\nAdditional Context: ${description}` : '';

  return `You are an expert ${targetLanguage} language teacher. Generate a comprehensive ${duration}-minute lesson plan in ${targetLanguage} for teaching "${topic}".

STUDENT PROFILE:
- Native Language: ${nativeLanguage}
- Target Language: ${targetLanguage}
- Proficiency Level: ${level}
- Student Name: ${studentName}${additionalContext}

LESSON REQUIREMENTS:
1. ALL content must be in ${targetLanguage} (except instructions for the teacher, which can be in English)
2. Adapt difficulty to ${level} proficiency level
3. Duration: ${duration} minutes
4. Include vocabulary, dialogues, comprehension questions, and practice activities
5. Make it practical and engaging
6. Use ${nativeLanguage} translations for vocabulary items

LESSON STRUCTURE:

**Exercise 1: Vocabulary (10 minutes)**
Provide 6-8 vocabulary items related to "${topic}". Each item should include:
{
  "word": "word in ${targetLanguage}",
  "partOfSpeech": "part of speech",
  "phonetics": "IPA pronunciation",
  "definition": "definition in ${targetLanguage}",
  "translation": "translation in ${nativeLanguage}",
  "example": "example sentence in ${targetLanguage}",
  "synonym": "synonym in ${targetLanguage} (if applicable)",
  "expressions": ["common expressions or collocations in ${targetLanguage}"]
}

**Exercise 2: Warm-up (8 minutes)**
2-3 discussion questions in ${targetLanguage} to introduce the topic and activate prior knowledge.

**Exercise 3: Dialogue (12 minutes)**
Create a realistic dialogue in ${targetLanguage} where ${studentName} practices the topic. The dialogue should:
- Be entirely in ${targetLanguage}
- Use the vocabulary naturally
- Include ${studentName} as one of the speakers
- Alternate between ${studentName} and other character(s)
- Be appropriate for ${level} level

**Exercise 4: Comprehension (8 minutes)**
4-5 questions about the dialogue:
- 2-3 multiple-choice questions (in ${targetLanguage})
- 1-2 open-ended questions (in ${targetLanguage})

**Exercise 5: Practice Activity (${duration === 50 ? '10' : '5'} minutes)**
A role-play or practice scenario where the student can apply what they learned.

**Exercise 6: Discussion (${duration === 50 ? '12' : '7'} minutes)**
4-5 open discussion questions in ${targetLanguage} that encourage the student to use the new vocabulary and expressions.

OUTPUT FORMAT (JSON):
{
  "title": "Lesson title in ${targetLanguage}",
  "lessonType": "instant",
  "difficulty": "${level}",
  "duration": ${duration},
  "objective": "What students will learn (in English for teacher reference)",
  "skills": ["Speaking", "Listening", "Reading", "Vocabulary"],
  "vocabulary": [array of vocabulary items as specified above],
  "context": "Brief context about the lesson topic (in English for teacher reference)",
  "exercises": [
    {
      "type": "vocabulary",
      "title": "Exercise 1: Vocabulary",
      "description": "Learn and practice new vocabulary",
      "content": {
        "vocabulary": [vocabulary items array]
      },
      "timeMinutes": 10
    },
    {
      "type": "warmup",
      "title": "Exercise 2: Warm-up",
      "description": "Discussion questions to introduce the topic",
      "content": {
        "questions": ["question 1 in ${targetLanguage}", "question 2 in ${targetLanguage}", ...],
        "instructions": "Instructions in English for the teacher"
      },
      "timeMinutes": 8
    },
    {
      "type": "dialogue",
      "title": "Exercise 3: Dialogue",
      "description": "Practice with a real scenario",
      "content": {
        "setting": "Description of the scenario (in English for teacher)",
        "characters": [
          {"name": "${studentName}", "role": "Student", "avatar": "You are ${studentName}"},
          {"name": "Character name", "role": "Role description", "avatar": "avatar"}
        ],
        "dialogue": [
          {"character": "${studentName}", "text": "text in ${targetLanguage}"},
          {"character": "Other character", "text": "text in ${targetLanguage}"},
          ...
        ],
        "instructions": "Read the dialogue in ${targetLanguage}"
      },
      "timeMinutes": 12
    },
    {
      "type": "comprehension",
      "title": "Exercise 4: Comprehension",
      "description": "Answer questions about the dialogue",
      "content": {
        "questions": [
          {
            "question": "Question in ${targetLanguage}",
            "type": "multiple-choice",
            "options": ["A) option", "B) option", "C) option", "D) option"],
            "answer": "A"
          },
          {
            "question": "Question in ${targetLanguage}",
            "type": "open-ended",
            "answer": "Expected answer in ${targetLanguage}"
          }
        ]
      },
      "timeMinutes": 8
    },
    {
      "type": "roleplay",
      "title": "Exercise 5: Practice Activity",
      "description": "Practice the topic in a new situation",
      "content": {
        "scenario": "Scenario description (in English for teacher)",
        "roles": [
          {"name": "${studentName}", "description": "Role description", "keyPoints": ["point 1", "point 2"]},
          {"name": "Partner role", "description": "Role description", "keyPoints": ["point 1", "point 2"]}
        ]
      },
      "timeMinutes": ${duration === 50 ? 10 : 5}
    },
    {
      "type": "discussion",
      "title": "Exercise 6: Discussion",
      "description": "Discuss these questions using the vocabulary",
      "content": {
        "questions": ["Question 1 in ${targetLanguage}", "Question 2 in ${targetLanguage}", ...],
        "instructions": "Discuss these questions in ${targetLanguage}"
      },
      "timeMinutes": ${duration === 50 ? 12 : 7}
    }
  ],
  "homework": "Homework suggestion in English for teacher",
  "materials": ["Materials needed"],
  "teachingNotes": "Tips for teaching this lesson (in English for teacher)"
}

IMPORTANT:
- Return ONLY valid JSON
- All lesson content (vocabulary, dialogues, questions) must be in ${targetLanguage}
- Teacher instructions and metadata can be in English
- Ensure proper JSON formatting with no trailing commas
- Use appropriate ${targetLanguage} grammar and vocabulary for ${level} level

Generate the complete lesson now. Return ONLY the JSON.`;
}
