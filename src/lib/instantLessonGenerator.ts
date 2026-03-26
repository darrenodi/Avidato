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
  endGoals?: string;
  occupation?: string;
  interests?: string;
  weaknesses?: string;
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

export async function generateInstantLesson(params: InstantLessonParams): Promise<GeneratedLesson> {
  const prompt = buildInstantLessonPrompt(params);

  try {
    const { rawText: text } = await generateWithProviderFailover({
      prompt,
      generationConfig: {
        maxOutputTokens: 8192,
      },
    });

    const jsonStr = extractJSONFromText(text);
    return cleanAndParseJSON<GeneratedLesson>(jsonStr);
  } catch (error) {
    console.error('Error generating instant lesson:', error);
    throw new Error('Failed to generate lesson. Please try again.');
  }
}

function buildInstantLessonPrompt(params: InstantLessonParams): string {
  const { targetLanguage, nativeLanguage, level, topic, description, duration, studentName = 'Student', endGoals, occupation, interests, weaknesses } = params;
  const is50 = duration === 50;
  const taskPrepTime = is50 ? 10 : 8;
  const taskPerfTime = is50 ? 20 : 8;
  const postTaskTime = is50 ? 10 : 2;
  const hwTime = is50 ? 5 : 2;
  const additionalContext = description ? `\nContext: ${description}` : '';

  const bioLines = [
    endGoals && `Goals: ${endGoals}`,
    occupation && `Occupation: ${occupation}`,
    interests && `Interests: ${interests}`,
    weaknesses && `Areas to develop: ${weaknesses}`,
  ].filter(Boolean).join('\n');

  return `Expert ${targetLanguage} instructor. Generate a TBLT instant lesson as JSON.

STUDENT: ${studentName}, ${level}, native ${nativeLanguage}.${bioLines ? '\n' + bioLines : ''}
TOPIC: "${topic}"${additionalContext}

RULES:
- ALL content in ${targetLanguage} (JSON keys stay in English)
- Only vocabulary "translation" field uses ${nativeLanguage}
- NO em dashes (—). BANNED: "resonate","navigate","landscape","leverage","dynamics","paradigm"
- Adapt complexity to ${level}
- Model dialogue characters MUST have real first names (e.g. Emma, Carlos, Yuki, Amira). NEVER use placeholder text like [Name], [Student's Name], [Phone Number], [Number], [Address], or any bracket placeholders anywhere in dialogue lines or character names. If a character needs to say a name, number, or address, invent a realistic one.

STRUCTURE (${duration} min):
1. lead-in (5min): 3 questions to activate prior knowledge on "${topic}". Personal/story-based, NOT analytical.
2. task-prep (${taskPrepTime}min): 5 vocabulary words (single words only) + 4-5 key phrases + short model dialogue (6-8 lines, 2-3 characters, small talk opener, contractions, natural fillers)
3. task-performance (${taskPerfTime}min): realistic roleplay. ${studentName} = first role. Tutor = second role. Include 3-4 phrasesToUse from task-prep.
4. post-task (${postTaskTime}min): one grammar or language point likely to arise from this topic. 3-4 examples.
5. homework (${hwTime}min): one concrete real-world task to practise outside class.

JSON OUTPUT:
{
  "title": "string",
  "lessonType": "instant",
  "difficulty": "${level}",
  "duration": ${duration},
  "objective": "By the end, ${studentName} will be able to [specific communicative outcome] (MAX 120 chars in ${targetLanguage})",
  "skills": ["Speaking", "Vocabulary", "Listening"],
  "vocabulary": [],
  "context": "string",
  "exercises": [
    {"type":"lead-in","title":"string","description":"string","content":{"questions":["","",""],"instructions":"string"},"timeMinutes":5},
    {"type":"task-prep","title":"string","description":"string","content":{"vocabulary":[{"word":"","partOfSpeech":"","phonetics":"/ipa/","definition":"","example":"","synonym":"","translation":"(${nativeLanguage})"}],"keyPhrases":[{"phrase":"","usage":"","example":""}],"modelDialogue":{"setting":"","characters":[{"name":"","role":""}],"dialogue":[{"character":"","text":""}]}},"timeMinutes":${taskPrepTime}},
    {"type":"task-performance","title":"string","description":"string","content":{"scenario":"","roles":[{"name":"${studentName}","description":"","keyPoints":[]},{"name":"Tutor","description":"","keyPoints":[]}],"instructions":"","phrasesToUse":[]},"timeMinutes":${taskPerfTime}},
    {"type":"post-task","title":"string","description":"string","content":{"grammarFocus":"","explanation":"","examples":[],"corrections":[]},"timeMinutes":${postTaskTime}},
    {"type":"homework","title":"string","description":"string","content":{"taskName":"","description":"","instructions":""},"timeMinutes":${hwTime}}
  ],
  "homework": "",
  "materials": [],
  "teachingNotes": "string"
}

Return ONLY valid JSON. Everything in ${targetLanguage}.`;
}
