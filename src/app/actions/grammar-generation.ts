'use server'

import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover';
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser';
import { getStudent } from './students'

/**
 * Grammar Lesson Generation
 * Generates focused grammar lessons using student profile for context
 */

interface GrammarLesson {
  title: string
  grammarTopic: string
  context: string
  explanation: {
    definition: string
    usage: string
    examples: string[]
  }
  exercises: {
    type: 'grammar-focus' | 'sentence-practice' | 'dialogue-practice' | 'fill-blanks' | 'multiple-choice' | 'sentence-building'
    title: string
    content: Record<string, unknown>
  }[]
}

export async function generateGrammarLesson(
  studentId: string,
  topic: string
): Promise<GrammarLesson> {
  try {
    // Fetch student profile
    const studentResponse = await getStudent(studentId)
    if (!studentResponse.success || !studentResponse.data) {
      throw new Error('Student not found')
    }

    const student = studentResponse.data

    const prompt = `Grammar lesson on "${topic}" for a ${student.level} ${student.targetLanguage} student.

STUDENT: ${student.name} (${student.ageGroup}), ${student.level}, native ${student.nativeLanguage}, learning ${student.targetLanguage}.
Goals: ${student.endGoals} | Occupation: ${student.occupation || 'N/A'} | Weaknesses: ${student.weaknesses || 'N/A'} | Interests: ${student.interests || 'N/A'}

LANGUAGE RULE: ALL content in EVERY JSON field MUST be in ${student.targetLanguage}. Zero English. Personalize examples to student's profile/interests. Use ${student.level}-appropriate vocabulary.

EXPLANATION GUIDELINES:
- Definition: one paragraph, level-scaled. Usage: bullet-style with example sentences. Examples: 3-5 personalized.
- Include Form, Contrasts, CommonMistakes [{incorrect,correct,why}], MiniChart [{label,example}] when relevant.
- Vivid, concise, concrete examples. Prefer simple sentences and everyday scenarios.
- Word count: A1 60-100w | A2 80-120w | B1 120-180w | B2 180-240w | C1/C2 240-400w

EXERCISES (6 required):
1. grammar-focus: Keys as relevant — explanation(string), form(string), structures[], uses[], contrasts[], commonMistakes[{incorrect,correct,why}], miniChart[{label,example}], tips[], registerNotes(string,C1+), examples[], keyPoints[]. B2+: ≥2 contrasts, ≥3 commonMistakes.
2. sentence-practice: [{sentence,context}]. Count: A1 4-6 | A2 6-8 | B1 8-10 | B2 10-12 | C1/C2 12-15.
3. dialogue-practice: {character1,character2,context,dialogue[{speaker,text}]}. Turns: A1/A2 6-8 | B1 8-10 | B2/C1 10-14.
4. fill-blanks: [{sentence(with _____),answer,hint}]. Count: A1 4-6 | A2/B1 6-8 | B2/C1 8-10.
5. multiple-choice: [{question,options[4],correctAnswer(index),explanation}]. Count: A1 3-4 | A2/B1 4-6 | B2/C1 6-8.
6. sentence-building: Mix ordering {instruction,words[],correct} and transformation {instruction,from,target}. Count: A1/A2 2-3 | B1 3-4 | B2/C1 4-5.

JSON OUTPUT:
{
  "title":"string",
  "grammarTopic":"${topic}",
  "context":"string",
  "explanation":{"definition":"string","usage":"string","examples":["string"]},
  "exercises":[
    {"type":"grammar-focus","title":"string","content":{/* per spec above */}},
    {"type":"sentence-practice","title":"string","content":{"sentences":[]}},
    {"type":"dialogue-practice","title":"string","content":{"character1":"string","character2":"string","context":"string","dialogue":[]}},
    {"type":"fill-blanks","title":"string","content":{"sentences":[]}},
    {"type":"multiple-choice","title":"string","content":{"questions":[]}},
    {"type":"sentence-building","title":"string","content":{"exercises":[]}}
  ]
}

Return ONLY valid JSON. No trailing commas. Everything in ${student.targetLanguage}.`;

    const { rawText: text } = await generateWithProviderFailover({
      prompt,
      generationConfig: {
        maxOutputTokens: 16384,
      }
    })

    // Extract and parse JSON using shared utilities (handles markdown fences, control chars, etc.)
    const jsonStr = extractJSONFromText(text)
    const parsedResponse = cleanAndParseJSON<GrammarLesson>(jsonStr)

    return parsedResponse
  } catch (error) {
    console.error('Error generating grammar lesson:', error)
    throw new Error('Failed to generate grammar lesson. Please try again.')
  }
}
