/**
 * Presentation Lesson Types - Engoo Format
 * Flexible exercises matching Engoo Global lesson structure
 */

export type ExerciseType = 'vocabulary' | 'expressions' | 'example' | 'dialogue' | 'manual' | 'roleplay' | 'discussion'

// Vocabulary Exercise - word list with definitions
export interface VocabularyExercise {
  type: 'vocabulary'
  title: string
  items: Array<{
    word: string
    pos: string // part of speech (Verb, Noun, Phrase, etc.)
    pronunciation: string
    definition: string
    example: string
  }>
}

// Expressions Exercise - useful phrases/expressions
export interface ExpressionsExercise {
  type: 'expressions'
  title: string
  items: string[]
}

// Dialogue Exercise - dialogue with speakers and comprehension questions
export interface DialogueExercise {
  type: 'dialogue'
  title: string
  introduction: string
  dialogue: Array<{
    speaker: string
    text: string
  }>
  comprehension: string[]
}

// Example Exercise - example presentation text
export interface ExampleExercise {
  type: 'example'
  title: string
  introduction: string
  content: string
}

// Manual Exercise - study tips and guidelines
export interface ManualExercise {
  type: 'manual'
  title: string
  introduction: string
  tips: Array<{
    title: string
    description: string
  }>
}

// Role Play Exercise - scenario for role playing
export interface RolePlayExercise {
  type: 'roleplay'
  title: string
  situation: string
  instructions: string
  suggestedExpressions?: string[]
}

// Discussion Exercise - discussion questions
export interface DiscussionExercise {
  type: 'discussion'
  title: string
  questions: string[]
}

export type PresentationExercise = VocabularyExercise | ExpressionsExercise | DialogueExercise | ExampleExercise | ManualExercise | RolePlayExercise | DiscussionExercise

export interface PresentationLesson {
  lessonType: 'presentation'
  title: string
  objective: string
  level: string
  duration: number
  presentationType: string
  audience: string
  exercises: PresentationExercise[]
}
