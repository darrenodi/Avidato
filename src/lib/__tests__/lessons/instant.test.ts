/**
 * Instant (TBLT) lesson tests
 *
 * Tests the TBLT-format instant lesson generator directly.
 * Covers 5 exercise types: lead-in, task-prep, task-performance, post-task, homework.
 *
 * Student: Paul, B2 English, software engineer
 * Topic: Discussing technical debt with your team
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { generateInstantLesson, saveOutput } from './lesson-gen'
import { assertNoEmDash, assertNoBannedWords } from './module-validators'

const INSTANT_PARAMS = {
  targetLanguage: 'English',
  nativeLanguage: 'Spanish',
  level: 'B2',
  topic: 'Explaining technical debt to non-engineering stakeholders',
  description: 'Paul needs to explain why certain code improvements are necessary to a product manager who focuses on features not infrastructure.',
  duration: 50 as const,
  skillFocus: 'Speaking',
  studentName: 'Paul',
  endGoals: 'Communicate technical concepts clearly to non-technical colleagues',
  occupation: 'Software Engineer',
  interests: 'Technology, cycling',
  weaknesses: 'Explaining complex topics simply, handling pushback',
}

describe('Instant Lesson (TBLT format)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateInstantLesson(INSTANT_PARAMS)
    saveOutput('instant-lesson', lesson)
    console.log('\n[Instant] Lesson title:', lesson.title)
    console.log('[Instant] Exercises:', lesson.exercises?.map((e: { type: string }) => e.type).join(', '))
  })

  it('top-level fields are present', () => {
    expect(typeof lesson.title).toBe('string')
    expect(lesson.title.length).toBeGreaterThan(3)
    expect(lesson.lessonType).toBe('instant')
    expect(lesson.duration).toBe(50)
    expect(typeof lesson.objective).toBe('string')
    expect(Array.isArray(lesson.exercises)).toBe(true)
  })

  it('has exactly 5 exercises in TBLT order', () => {
    expect(lesson.exercises).toHaveLength(5)
    const types = lesson.exercises.map((e: { type: string }) => e.type)
    expect(types[0]).toBe('lead-in')
    expect(types[1]).toBe('task-prep')
    expect(types[2]).toBe('task-performance')
    expect(types[3]).toBe('post-task')
    expect(types[4]).toBe('homework')
  })

  it('exercise: lead-in — 3 activation questions', () => {
    const ex = lesson.exercises.find((e: { type: string }) => e.type === 'lead-in')
    expect(Array.isArray(ex.content.questions)).toBe(true)
    expect(ex.content.questions.length).toBe(3)
    for (const q of ex.content.questions) {
      expect(typeof q).toBe('string')
      expect(q.length).toBeGreaterThan(15)
    }
    expect(ex.timeMinutes).toBe(5)
  })

  it('exercise: task-prep — vocabulary (single words), key phrases, model dialogue', () => {
    const ex = lesson.exercises.find((e: { type: string }) => e.type === 'task-prep')
    const c = ex.content

    // vocabulary: 5 single words
    expect(Array.isArray(c.vocabulary)).toBe(true)
    expect(c.vocabulary.length).toBe(5)
    for (const v of c.vocabulary) {
      expect(typeof v.word).toBe('string')
      expect(v.word.trim().split(/\s+/).length, `"${v.word}" must be single word`).toBe(1)
      expect(typeof v.definition).toBe('string')
      expect(typeof v.translation).toBe('string')
    }

    // key phrases: 4-5 phrases
    expect(Array.isArray(c.keyPhrases)).toBe(true)
    expect(c.keyPhrases.length).toBeGreaterThanOrEqual(4)
    expect(c.keyPhrases.length).toBeLessThanOrEqual(5)

    // model dialogue: setting, characters with real names, 6-8 lines
    expect(c.modelDialogue).toBeDefined()
    expect(typeof c.modelDialogue.setting).toBe('string')
    expect(Array.isArray(c.modelDialogue.characters)).toBe(true)
    expect(Array.isArray(c.modelDialogue.dialogue)).toBe(true)
    expect(c.modelDialogue.dialogue.length).toBeGreaterThanOrEqual(6)
    expect(c.modelDialogue.dialogue.length).toBeLessThanOrEqual(8)

    // No bracket placeholders in dialogue
    for (const turn of c.modelDialogue.dialogue) {
      expect(typeof turn.character).toBe('string')
      expect(typeof turn.text).toBe('string')
      expect(turn.text, 'bracket placeholder in dialogue').not.toMatch(/\[.*?\]/)
      // No [Name] or [Number] etc.
      expect(turn.character, 'bracket placeholder in character name').not.toMatch(/\[.*?\]/)
    }
  })

  it('exercise: task-performance — Paul as first role, 3-4 phrasesToUse', () => {
    const ex = lesson.exercises.find((e: { type: string }) => e.type === 'task-performance')
    const c = ex.content
    expect(typeof c.scenario).toBe('string')
    expect(Array.isArray(c.roles)).toBe(true)
    expect(c.roles.length).toBe(2)
    // Paul must be first role
    expect(c.roles[0].name).toBe('Paul')
    // Second role is Tutor
    expect(c.roles[1].name).toBe('Tutor')
    // phrasesToUse
    expect(Array.isArray(c.phrasesToUse)).toBe(true)
    expect(c.phrasesToUse.length).toBeGreaterThanOrEqual(3)
    expect(c.phrasesToUse.length).toBeLessThanOrEqual(4)
  })

  it('exercise: post-task — grammar focus with examples and corrections', () => {
    const ex = lesson.exercises.find((e: { type: string }) => e.type === 'post-task')
    const c = ex.content
    expect(typeof c.grammarFocus).toBe('string')
    expect(typeof c.explanation).toBe('string')
    expect(Array.isArray(c.examples)).toBe(true)
    expect(c.examples.length).toBeGreaterThanOrEqual(3)
  })

  it('exercise: homework — concrete real-world task', () => {
    const ex = lesson.exercises.find((e: { type: string }) => e.type === 'homework')
    const c = ex.content
    expect(typeof c.taskName).toBe('string')
    expect(typeof c.description).toBe('string')
    expect(c.description.length).toBeGreaterThan(20)
  })

  it('no em dashes in full lesson', () => {
    assertNoEmDash(lesson, 'instant-lesson')
  })

  it('no banned AI words in full lesson', () => {
    assertNoBannedWords(lesson, 'instant-lesson')
  })

  it('objective is in target language (English) and under 120 chars', () => {
    expect(typeof lesson.objective).toBe('string')
    expect(lesson.objective.length).toBeLessThanOrEqual(120)
  })
})
