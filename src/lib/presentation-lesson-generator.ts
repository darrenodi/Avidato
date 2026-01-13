/**
 * Presentation Lesson Generator Service
 * Generates presentation lessons in Engoo Global format
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { generateWithFailover } from './openaiFailover'
import { extractJSONFromText, cleanAndParseJSON } from './utils/json-parser'
import { StudentProfile } from '../types/lesson-template'
import { PresentationLesson } from '../types/presentation-lesson'
import { buildPresentationLessonPrompt } from './prompts/presentation-lesson-prompts'
import { extractPresentationContext } from './presentation-detection'

interface PresentationLessonGenerationParams {
  student: StudentProfile
  topic: string
  objective: string
}

/**
 * Generates a complete presentation lesson
 * @param params - Generation parameters
 * @returns A fully-formed PresentationLesson object
 */
export async function generatePresentationLesson(
  params: PresentationLessonGenerationParams
): Promise<PresentationLesson> {
  const { student, topic, objective } = params

  // Extract presentation context from topic and student profile
  const { presentationType, audience } = extractPresentationContext(
    topic,
    student.endGoals,
    student.occupation
  )

  // Build the presentation-specific prompt
  const prompt = buildPresentationLessonPrompt(student, topic, objective)

  try {
    const { rawText: text } = await generateWithFailover({
      prompt,
      generationConfig: {
        maxOutputTokens: 4000,
      },
    })

    // Extract and parse JSON
    const jsonStr = extractJSONFromText(text)
    const generatedContent = cleanAndParseJSON<any>(jsonStr)

    // Return the lesson with exercises
    return {
      lessonType: 'presentation',
      title: topic,
      objective,
      skills: ['Presentation', 'Public Speaking', 'Communication'],
      level: student.level,
      duration: 50,
      exercises: generatedContent.exercises || [],
      presentationType,
      audience,
    }
  } catch (error) {
    console.error('Error generating presentation lesson:', error)
    throw new Error('Failed to generate presentation lesson. Please try again.')
  }
}
