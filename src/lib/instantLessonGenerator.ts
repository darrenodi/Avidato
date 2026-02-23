// src/lib/instantLessonGenerator.ts
import { generateWithProviderFailover } from './ai/generate-with-provider-failover';
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
    const { rawText: text } = await generateWithProviderFailover({
      prompt,
      generationConfig: {
        maxOutputTokens: 16384,
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
1. EVERY piece of student-facing content MUST be in ${targetLanguage}. This includes:
   - The lesson title
   - All exercise titles and descriptions
   - All instructions, questions, dialogues, scenarios, role descriptions
   - All comprehension questions and answer options
   - Discussion questions
   Everything the student reads or hears must be in ${targetLanguage}. NO English anywhere.
2. ALL fields must be in ${targetLanguage} including: "objective", "context", "homework", "teachingNotes", "materials".
   The teacher can understand ${targetLanguage} — do NOT use English for any field.
3. Adapt difficulty to ${level} proficiency level
4. Duration: ${duration} minutes
5. Include vocabulary, dialogues, comprehension questions, and practice activities
6. Make it practical and engaging
7. Vocabulary items use ${nativeLanguage} ONLY in the "translation" field — everything else in ${targetLanguage}

LESSON STRUCTURE:

**Exercise 1: Vocabulary (10 minutes)**
Provide 6-8 vocabulary items related to "${topic}". Each item should include:
{
  "word": "word in ${targetLanguage}",
  "partOfSpeech": "part of speech in ${targetLanguage}",
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
All scenario descriptions, role descriptions, and key points must be in ${targetLanguage}.

**Exercise 6: Discussion (${duration === 50 ? '12' : '7'} minutes)**
4-5 open discussion questions in ${targetLanguage} that encourage the student to use the new vocabulary and expressions.

OUTPUT FORMAT (JSON):
{
  "title": "Lesson title in ${targetLanguage}",
  "lessonType": "instant",
  "difficulty": "${level}",
  "duration": ${duration},
  "objective": "What students will learn (in ${targetLanguage})",
  "skills": ["Speaking", "Listening", "Reading", "Vocabulary"],
  "vocabulary": [array of vocabulary items as specified above],
  "context": "Brief objectives about the lesson topic (in ${targetLanguage})",
  "exercises": [
    {
      "type": "vocabulary",
      "title": "title in ${targetLanguage}",
      "description": "description in ${targetLanguage}",
      "content": {
        "vocabulary": [vocabulary items array]
      },
      "timeMinutes": 10
    },
    {
      "type": "warmup",
      "title": "title in ${targetLanguage}",
      "description": "description in ${targetLanguage}",
      "content": {
        "questions": ["question 1 in ${targetLanguage}", "question 2 in ${targetLanguage}"],
        "instructions": "instructions in ${targetLanguage}"
      },
      "timeMinutes": 8
    },
    {
      "type": "dialogue",
      "title": "title in ${targetLanguage}",
      "description": "description in ${targetLanguage}",
      "content": {
        "setting": "description of the scenario in ${targetLanguage}",
        "characters": [
          {"name": "${studentName}", "role": "role in ${targetLanguage}", "avatar": "avatar description in ${targetLanguage}"},
          {"name": "Character name", "role": "role in ${targetLanguage}", "avatar": "avatar"}
        ],
        "dialogue": [
          {"character": "${studentName}", "text": "text in ${targetLanguage}"},
          {"character": "Other character", "text": "text in ${targetLanguage}"}
        ],
        "instructions": "instructions in ${targetLanguage}"
      },
      "timeMinutes": 12
    },
    {
      "type": "comprehension",
      "title": "title in ${targetLanguage}",
      "description": "description in ${targetLanguage}",
      "content": {
        "questions": [
          {
            "question": "Question in ${targetLanguage}",
            "type": "multiple-choice",
            "options": ["A) option in ${targetLanguage}", "B) option in ${targetLanguage}", "C) option in ${targetLanguage}", "D) option in ${targetLanguage}"],
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
      "title": "title in ${targetLanguage}",
      "description": "description in ${targetLanguage}",
      "content": {
        "scenario": "scenario description in ${targetLanguage}",
        "roles": [
          {"name": "${studentName}", "description": "role description in ${targetLanguage}", "keyPoints": ["point in ${targetLanguage}", "point in ${targetLanguage}"]},
          {"name": "Partner name", "description": "role description in ${targetLanguage}", "keyPoints": ["point in ${targetLanguage}", "point in ${targetLanguage}"]}
        ]
      },
      "timeMinutes": ${duration === 50 ? 10 : 5}
    },
    {
      "type": "discussion",
      "title": "title in ${targetLanguage}",
      "description": "description in ${targetLanguage}",
      "content": {
        "questions": ["Question 1 in ${targetLanguage}", "Question 2 in ${targetLanguage}"],
        "instructions": "instructions in ${targetLanguage}"
      },
      "timeMinutes": ${duration === 50 ? 12 : 7}
    }
  ],
  "homework": "Homework suggestion in ${targetLanguage}",
  "materials": ["Materials needed in ${targetLanguage}"],
  "teachingNotes": "Tips for teaching this lesson (in ${targetLanguage})"
}

CRITICAL LANGUAGE RULE:
- Every single field in the JSON must be in ${targetLanguage}. No English anywhere.
- Return ONLY valid JSON with no trailing commas.
- Use appropriate ${targetLanguage} grammar and vocabulary for ${level} level.

Generate the complete lesson now. Return ONLY the JSON.`;
}
