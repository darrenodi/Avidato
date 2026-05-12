/**
 * Reading lesson tests — structures R1 and R2
 *
 * Covered module types (4 new on top of speaking):
 *   R1 → reading-article, reading-scan, skim-main-idea
 *   R2 → vocabulary-in-text
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { AIKO, READING_LESSON, R1, R2 } from './fixtures'
import { generateTestLesson, findModule, saveOutput } from './lesson-gen'
import {
  validateWarmUp, validateVocabularyMatch, validateReadingArticle,
  validateReadingScan, validateSkimMainIdea, validateDiscussion,
  validateHomeworkWriting, validateVocabularyCards, validateVocabularyInText,
  validateMatchingQA, validateDebate,
} from './module-validators'

// ─── R1: Warm-up | Vocab Match | Article | Scan | Skim | Discussion ──────────

describe('Reading R1: warm-up → vocabulary-match → reading-article → reading-scan → skim-main-idea → discussion', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(AIKO, READING_LESSON, R1)
    saveOutput('reading-r1', lesson)
    console.log('\n[R1] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('lesson has correct top-level fields', () => {
    expect(typeof lesson.title).toBe('string')
    expect(lesson.category).toBe('reading')
    expect(lesson.duration).toBe(50)
  })

  it('module: warm-up', () => {
    validateWarmUp(findModule(lesson, 'warm-up').content)
  })

  it('module: vocabulary-match — no vocabulary-cards duplicate', () => {
    const mod = findModule(lesson, 'vocabulary-match')
    validateVocabularyMatch(mod.content)
    const hasCards = lesson.modules.some((m: { type: string }) => m.type === 'vocabulary-cards')
    expect(hasCards, 'vocabulary-cards and vocabulary-match both present').toBe(false)
  })

  it('module: reading-article — min 300 words, paragraph breaks', () => {
    const mod = findModule(lesson, 'reading-article')
    validateReadingArticle(mod.content)
    // Title format: "Reading - [article title]"
    expect(mod.title).toMatch(/^Reading - /)
  })

  it('module: reading-scan — 4-8 questions with answers', () => {
    const mod = findModule(lesson, 'reading-scan')
    validateReadingScan(mod.content)
    expect(mod.title).toBe('Reading Comprehension')
  })

  it('module: skim-main-idea — 4 options, valid answer index', () => {
    const mod = findModule(lesson, 'skim-main-idea')
    validateSkimMainIdea(mod.content)
    expect(mod.title).toBe('Main Idea')
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

// ─── R2: Vocab Cards | Article | Vocab in Text | Comprehension | Debate ──────

describe('Reading R2: vocabulary-cards → reading-article → vocabulary-in-text → matching-qa → debate', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(AIKO, READING_LESSON, R2)
    saveOutput('reading-r2', lesson)
    console.log('\n[R2] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('module: vocabulary-cards', () => {
    validateVocabularyCards(findModule(lesson, 'vocabulary-cards').content)
  })

  it('module: reading-article', () => {
    validateReadingArticle(findModule(lesson, 'reading-article').content)
  })

  it('module: vocabulary-in-text — 8-10 items, each with paragraph number and partOfSpeech', () => {
    const mod = findModule(lesson, 'vocabulary-in-text')
    validateVocabularyInText(mod.content)
    expect(mod.title).toBe('Contextual Vocabulary')
    // Items must span multiple paragraphs (not all from paragraph 1)
    const paragraphs = new Set(mod.content.items.map((i: { paragraph: number }) => i.paragraph))
    expect(paragraphs.size, 'all vocabulary-in-text items from same paragraph').toBeGreaterThanOrEqual(2)
  })

  it('module: matching-qa', () => {
    validateMatchingQA(findModule(lesson, 'matching-qa').content)
  })

  it('module: debate', () => {
    validateDebate(findModule(lesson, 'debate').content)
  })
})
