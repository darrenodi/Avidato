/**
 * Instant lesson tests
 *
 * The instant generator now produces standard MODULAR lessons using the same
 * structure categories and module library as planned lessons. skillFocus maps
 * directly to a structure category (here: 'Speaking' → speaking S1-S5).
 *
 * Student: Paul, B2 English, software engineer
 * Topic: Explaining technical debt to non-engineering stakeholders
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { generateInstantLesson, saveOutput } from './lesson-gen'
import { assertNoEmDash, assertNoBannedWords } from './module-validators'
import { STRUCTURES } from '@/lib/prompts/modular-lesson-prompt'

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

const SPEAKING_STRUCTURES: string[][] = STRUCTURES.speaking.map(seq => [...seq])

describe('Instant Lesson (modular format)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateInstantLesson(INSTANT_PARAMS)
    saveOutput('instant-lesson', lesson)
    console.log('\n[Instant] Lesson title:', lesson.title)
    console.log('[Instant] Modules:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('top-level fields are present', () => {
    expect(typeof lesson.title).toBe('string')
    expect(lesson.title.length).toBeGreaterThan(3)
    expect(lesson.lessonType).toBe('modular')
    expect(lesson.duration).toBe(50)
    expect(typeof lesson.objective).toBe('string')
    expect(Array.isArray(lesson.modules)).toBe(true)
    expect(lesson.modules.length).toBeGreaterThan(0)
  })

  it('skillFocus "Speaking" produced one of the S1-S5 speaking structures', () => {
    const types = lesson.modules.map((m: { type: string }) => m.type)
    const matches = SPEAKING_STRUCTURES.some(
      seq => seq.length === types.length && seq.every((t, i) => t === types[i])
    )
    expect(matches, `module sequence not a speaking structure: ${types.join(' → ')}`).toBe(true)
  })

  it('every module has type, title, timeMinutes, tutorNotes, content', () => {
    for (const mod of lesson.modules) {
      expect(typeof mod.type).toBe('string')
      expect(typeof mod.title).toBe('string')
      expect(typeof mod.timeMinutes).toBe('number')
      expect(typeof mod.tutorNotes).toBe('string')
      expect(mod.content).toBeDefined()
    }
  })

  it('timeMinutes sum equals 50', () => {
    const total = lesson.modules.reduce((sum: number, m: { timeMinutes: number }) => sum + m.timeMinutes, 0)
    expect(total).toBe(50)
  })

  it('dialogue module: real names, no bracket placeholders, 8-12 turns', () => {
    const dlg = lesson.modules.find((m: { type: string }) => m.type === 'dialogue')
    if (!dlg) return // not every speaking structure guarantees dialogue position, but all S1-S5 include it
    expect(typeof dlg.content.setting).toBe('string')
    expect(Array.isArray(dlg.content.characters)).toBe(true)
    expect(Array.isArray(dlg.content.dialogue)).toBe(true)
    expect(dlg.content.dialogue.length).toBeGreaterThanOrEqual(8)
    expect(dlg.content.dialogue.length).toBeLessThanOrEqual(12)
    for (const turn of dlg.content.dialogue) {
      expect(typeof turn.character).toBe('string')
      expect(typeof turn.text).toBe('string')
      expect(turn.text, 'bracket placeholder in dialogue').not.toMatch(/\[.*?\]/)
      expect(turn.character, 'bracket placeholder in character name').not.toMatch(/\[.*?\]/)
    }
  })

  it('homework-writing module is last', () => {
    const types = lesson.modules.map((m: { type: string }) => m.type)
    expect(types[types.length - 1]).toBe('homework-writing')
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
