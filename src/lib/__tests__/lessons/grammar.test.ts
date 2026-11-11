/**
 * Grammar lesson tests — structure G1
 *
 * Covered module type (1 new):
 *   G1 → sentence-correction
 *   (warm-up, vocabulary-cards, grammar-focus, gap-fill, discussion already covered)
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { ELENA, GRAMMAR_LESSON, G1 } from './fixtures'
import { generateTestLesson, findModule, saveOutput } from './lesson-gen'
import {
  validateWarmUp, validateVocabularyCards, validateGrammarFocus,
  validateGapFill, validateSentenceCorrection, validateDiscussion,
  validateHomeworkWriting,
} from './module-validators'

// ─── G1: Warm-up | Vocab Cards | Grammar Focus | Gap Fill | Sentence Correction | Discussion ─

describe('Grammar G1: warm-up → vocabulary-cards → grammar-focus → gap-fill → sentence-correction → discussion', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(ELENA, GRAMMAR_LESSON, G1)
    saveOutput('grammar-g1', lesson)
    console.log('\n[G1] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('lesson has correct top-level fields', () => {
    expect(lesson.category).toBe('grammar')
    expect(lesson.duration).toBe(50)
    expect(typeof lesson.title).toBe('string')
  })

  it('module: warm-up', () => {
    validateWarmUp(findModule(lesson, 'warm-up').content)
  })

  it('module: vocabulary-cards — 6 single words', () => {
    validateVocabularyCards(findModule(lesson, 'vocabulary-cards').content)
  })

  it('module: grammar-focus — {label, sentence} objects not strings', () => {
    const mod = findModule(lesson, 'grammar-focus')
    validateGrammarFocus(mod.content)
    // Explicitly verify examples are objects (the bug we fixed in print route)
    for (const ex of mod.content.examples) {
      expect(typeof ex).toBe('object')
      expect(typeof ex.label).toBe('string')
      expect(typeof ex.sentence).toBe('string')
    }
  })

  it('module: gap-fill — 6-10 sentences, each has ___ blank', () => {
    validateGapFill(findModule(lesson, 'gap-fill').content)
  })

  it('module: sentence-correction — 8-10 sentences with errorType', () => {
    const mod = findModule(lesson, 'sentence-correction')
    validateSentenceCorrection(mod.content)
    expect(mod.title).toBe('Sentence Correction')
    // Incorrect and correct must differ
    for (const s of mod.content.sentences) {
      expect(s.incorrect, 'incorrect equals correct').not.toBe(s.correct)
      expect(typeof s.errorType).toBe('string')
      expect(s.errorType.length).toBeGreaterThan(2)
    }
  })

  it('module: discussion', () => {
    validateDiscussion(findModule(lesson, 'discussion').content)
  })

  it('module: homework-writing', () => {
    validateHomeworkWriting(findModule(lesson, 'homework-writing').content)
  })

  it('timeMinutes sum equals 50', () => {
    const total = lesson.modules.reduce((s: number, m: { timeMinutes: number }) => s + m.timeMinutes, 0)
    expect(total).toBe(50)
  })
})
