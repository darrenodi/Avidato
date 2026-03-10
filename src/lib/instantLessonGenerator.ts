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

  const additionalContext = description ? `\nContext: ${description}` : '';

  return `Expert ${targetLanguage} teacher. Create a ${duration}-minute lesson on "${topic}" for ${studentName}.${additionalContext}

STUDENT: ${level} level, native ${nativeLanguage}, learning ${targetLanguage}.

LANGUAGE RULE: ALL content in EVERY JSON field MUST be in ${targetLanguage}. Zero English anywhere. ONLY exception: vocabulary "translation" field uses ${nativeLanguage}. Adapt complexity to ${level}.

GLOBAL FORMATTING RULES:
- NEVER use em dashes (—) anywhere. Use commas, periods, or semicolons instead.
- NEVER suggest or include background colors, colored badges, or colored containers in any content field.

EXERCISES:
1. vocabulary (10min): 6-8 items — {word, partOfSpeech, phonetics (IPA), definition, translation (${nativeLanguage} only), example, synonym, expressions[]}
2. warmup (8min): 2-3 discussion questions + instructions
3. dialogue (12min): Realistic conversation using vocabulary. Include ${studentName} as speaker. Fields: setting, characters[{name,role,avatar}], dialogue[{character,text}], instructions

DIALOGUE REALISM RULES (MANDATORY):
- START WITH SMALL TALK OR A NATURAL OPENER, NEVER THE MAIN TOPIC. The first 2-3 exchanges must ease in naturally before the main purpose. Use context-appropriate openers: complimenting the office, asking about the journey, commenting on the environment, referencing a previous interaction.
- INCLUDE AT LEAST ONE IMPERFECT MOMENT. Someone misspeaks and corrects themselves, a small misunderstanding gets quickly resolved, someone asks for clarification, or a detail was forgotten.
- THE OTHER PERSON MUST NOT ALWAYS AGREE. They must push back at least once, express mild hesitation, ask an unexpected follow-up, or challenge something said.
- USE NATURAL SPOKEN LANGUAGE. Contractions always. Natural fillers: "by the way", "actually", "to be honest", "that reminds me", "now that you mention it". No formal written constructions.
- VARY LINE LENGTHS. Some responses are a single word or short phrase. Some are longer. Not every line should be two sentences.
- MATCH REGISTER TO RELATIONSHIP. A first meeting with a client sounds different from a catch-up with a colleague.
- ADD THIRD PARTIES WHERE CONTEXT CALLS FOR IT. In a restaurant a waiter appears. In an office a passing colleague can interrupt.
- END AT A NATURAL PAUSE, NOT A NEAT RESOLUTION. Agree to follow up, suggest a next step, or leave something open.
- NEVER LET DIALOGUE BECOME AN INFORMATION DUMP. Information emerges through questions, reactions, and follow-ups across multiple turns.
4. comprehension (8min): 4-5 questions about the dialogue. Mix multiple-choice {question,type:"multiple-choice",options[],answer} and open-ended {question,type:"open-ended",answer}
5. roleplay (${duration === 50 ? '10' : '5'}min): Practice scenario — {scenario, roles[{name,description,keyPoints[]}]}
6. discussion (${duration === 50 ? '12' : '7'}min): 4-5 open questions + instructions

JSON OUTPUT:
{
  "title":"string",
  "lessonType":"instant",
  "difficulty":"${level}",
  "duration":${duration},
  "objective":"string",
  "skills":["Speaking","Listening","Reading","Vocabulary"],
  "vocabulary":[/* vocab items per spec above */],
  "context":"string",
  "exercises":[
    {"type":"vocabulary","title":"string","description":"string","content":{"vocabulary":[]},"timeMinutes":10},
    {"type":"warmup","title":"string","description":"string","content":{"questions":[],"instructions":"string"},"timeMinutes":8},
    {"type":"dialogue","title":"string","description":"string","content":{"setting":"string","characters":[],"dialogue":[],"instructions":"string"},"timeMinutes":12},
    {"type":"comprehension","title":"string","description":"string","content":{"questions":[]},"timeMinutes":8},
    {"type":"roleplay","title":"string","description":"string","content":{"scenario":"string","roles":[]},"timeMinutes":${duration === 50 ? 10 : 5}},
    {"type":"discussion","title":"string","description":"string","content":{"questions":[],"instructions":"string"},"timeMinutes":${duration === 50 ? 12 : 7}}
  ],
  "homework":"string",
  "materials":["string"],
  "teachingNotes":"string"
}

Return ONLY valid JSON, no trailing commas. Everything in ${targetLanguage}.`;
}
