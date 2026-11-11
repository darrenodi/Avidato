/**
 * Vocabulary lesson tests — structures V2 and V4
 *
 * Covered module types (3 new):
 *   V2 → ordering
 *   V4 → phrasal-verbs, gap-fill, find-the-mistake
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { PAUL, VOCABULARY_LESSON, V2, V4 } from './fixtures'
import { generateTestLesson, findModule, saveOutput } from './lesson-gen'
import {
  validateVocabularyMatch, validateOrdering, validateGapFill,
  validateUsefulLanguage, validateRoleplay, validateHomeworkWriting,
  validateWarmUp, validatePhrasalVerbs, validateFindTheMistake,
  validateUsefulExpressions, validateDiscussion,
} from './module-validators'

// ─── V2: Vocab Match | Ordering | Gap-fill | Useful Language | Roleplay ───────

describe('Vocabulary V2: vocabulary-match → ordering → gap-fill → useful-language → roleplay', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(PAUL, VOCABULARY_LESSON, V2)
    saveOutput('vocabulary-v2', lesson)
    console.log('\n[V2] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('lesson has correct top-level fields', () => {
    expect(lesson.category).toBe('vocabulary')
    expect(lesson.duration).toBe(50)
  })

  it('module: vocabulary-match', () => {
    validateVocabularyMatch(findModule(lesson, 'vocabulary-match').content)
  })

  it('module: ordering — 5-8 scrambled/correct pairs', () => {
    const mod = findModule(lesson, 'ordering')
    validateOrdering(mod.content)
    expect(mod.title).toBe('Ordering')
    // Each scrambled item must differ from its correct version
    for (const s of mod.content.sentences) {
      expect(s.scrambled, `scrambled equals correct: "${s.correct}"`).not.toBe(s.correct)
    }
  })

  it('module: gap-fill — blank present, answer not leaked into sentence', () => {
    const mod = findModule(lesson, 'gap-fill')
    validateGapFill(mod.content)
    expect(mod.title).toBe('Gap Fill')
  })

  it('module: useful-language', () => {
    validateUsefulLanguage(findModule(lesson, 'useful-language').content)
  })

  it('module: roleplay', () => {
    validateRoleplay(findModule(lesson, 'roleplay').content)
  })

  it('module: homework-writing', () => {
    validateHomeworkWriting(findModule(lesson, 'homework-writing').content)
  })
})

// ─── V4: Phrasal Verbs | Gap-fill | Find the Mistake | Expressions | Discussion ─

describe('Vocabulary V4: warm-up → phrasal-verbs → gap-fill → find-the-mistake → useful-expressions → discussion', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(PAUL, VOCABULARY_LESSON, V4)
    saveOutput('vocabulary-v4', lesson)
    console.log('\n[V4] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('module: warm-up', () => {
    validateWarmUp(findModule(lesson, 'warm-up').content)
  })

  it('module: phrasal-verbs — verb+particle, 6-8 items, each has meaning', () => {
    const mod = findModule(lesson, 'phrasal-verbs')
    validatePhrasalVerbs(mod.content)
    expect(mod.title).toBe('Phrasal Verbs')
    // Each verb must contain a space (verb + particle)
    for (const p of mod.content.pairs) {
      expect(p.verb.trim().split(/\s+/).length, `"${p.verb}" must be phrasal verb (verb + particle)`).toBeGreaterThanOrEqual(2)
    }
  })

  it('module: gap-fill — 6-10 sentences, each has ___ blank', () => {
    validateGapFill(findModule(lesson, 'gap-fill').content)
  })

  it('module: find-the-mistake — exactly 10 sentences, each has incorrect and correct', () => {
    const mod = findModule(lesson, 'find-the-mistake')
    validateFindTheMistake(mod.content)
    expect(mod.title).toBe('Find the Mistake')
    // Incorrect and correct must differ for every sentence
    for (const s of mod.content.sentences) {
      expect(s.incorrect, `incorrect equals correct: "${s.incorrect}"`).not.toBe(s.correct)
    }
  })

  it('module: useful-expressions — fixed idioms with full + blank', () => {
    validateUsefulExpressions(findModule(lesson, 'useful-expressions').content)
  })

  it('module: discussion', () => {
    validateDiscussion(findModule(lesson, 'discussion').content)
  })
})
