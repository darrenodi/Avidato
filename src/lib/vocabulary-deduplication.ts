/**
 * Vocabulary Deduplication Service
 * Prevents repeated vocabulary across student lessons
 */

import { prisma } from './prisma'
import { GeneratedLesson } from '../types/lesson-template'

interface ExtractedVocabulary {
  word: string
  definition: string
  partOfSpeech?: string
}

interface VocabularyContent {
  vocabulary?: Array<{
    word?: string
    definition?: string
    partOfSpeech?: string
  }>
}

/**
 * Extract vocabulary from a lesson's content
 */
export function extractVocabularyFromLesson(lesson: GeneratedLesson): ExtractedVocabulary[] {
  const vocabulary: ExtractedVocabulary[] = []

  if (!lesson.exercises) return vocabulary

  // Find vocabulary exercise (Exercise 1)
  const vocabExercise = lesson.exercises.find(ex => ex.type === 'vocabulary')
  
  if (!vocabExercise || !vocabExercise.content) return vocabulary

  const content = vocabExercise.content as VocabularyContent
  
  if (!Array.isArray(content.vocabulary)) return vocabulary

  return content.vocabulary.map((item) => ({
    word: item.word?.toLowerCase().trim() || '',
    definition: item.definition || '',
    partOfSpeech: item.partOfSpeech
  })).filter(v => v.word)
}

/**
 * Get all vocabulary taught to a student from their recent lessons
 * Uses last 10 lessons for broad coverage without too much data
 */
export async function getStudentVocabularyHistory(
  studentId: string,
  limit: number = 10
): Promise<ExtractedVocabulary[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { studentId },
      select: { content: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    const allVocabulary: ExtractedVocabulary[] = []
    const seenWords = new Set<string>()

    for (const lesson of lessons) {
      try {
        const lessonData = typeof lesson.content === 'string' 
          ? JSON.parse(lesson.content) 
          : lesson.content

        const extracted = extractVocabularyFromLesson(lessonData)
        
        for (const vocab of extracted) {
          const wordLower = vocab.word.toLowerCase()
          if (!seenWords.has(wordLower)) {
            seenWords.add(wordLower)
            allVocabulary.push(vocab)
          }
        }
      } catch (error) {
        console.error('Error parsing lesson content:', error)
        continue
      }
    }

    return allVocabulary
  } catch (error) {
    console.error('Error fetching student vocabulary history:', error)
    return []
  }
}

/**
 * Find duplicate words between generated lesson and student's history
 */
export function findDuplicateVocabulary(
  generatedVocabulary: ExtractedVocabulary[],
  previousVocabulary: ExtractedVocabulary[]
): ExtractedVocabulary[] {
  const prevWordsLower = new Set(
    previousVocabulary.map(v => v.word.toLowerCase())
  )

  return generatedVocabulary.filter(vocab =>
    prevWordsLower.has(vocab.word.toLowerCase())
  )
}

/**
 * Validate generated lesson vocabulary - check for duplicates
 * Returns duplicates if found, empty array if all unique
 */
export async function validateLessonVocabulary(
  studentId: string,
  lesson: GeneratedLesson
): Promise<{
  hasDuplicates: boolean
  duplicates: ExtractedVocabulary[]
  previousVocabulary: ExtractedVocabulary[]
}> {
  const generatedVocab = extractVocabularyFromLesson(lesson)
  const previousVocab = await getStudentVocabularyHistory(studentId)

  const duplicates = findDuplicateVocabulary(generatedVocab, previousVocab)

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    previousVocabulary: previousVocab
  }
}

/**
 * Log vocabulary duplicates for debugging
 */
export function logVocabularyValidation(validation: Awaited<ReturnType<typeof validateLessonVocabulary>>) {
  if (validation.hasDuplicates) {
    console.warn(`⚠️ Found ${validation.duplicates.length} duplicate vocabulary words:`)
    validation.duplicates.forEach(dup => {
      console.warn(`   - ${dup.word}`)
    })
  } else {
    console.log('✅ All vocabulary is unique')
  }
}
