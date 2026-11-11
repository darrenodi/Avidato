/**
 * Speaking lesson tests — structures S1–S4
 *
 * Covered module types (15):
 *   S1 → warm-up, useful-language, dialogue, listening-true-false, gap-fill, roleplay, homework-writing
 *   S2 → vocabulary-cards, listening-mcq, register-upgrade, discussion
 *   S3 → vocabulary-match, matching-qa, debate
 *   S4 → useful-expressions, talking-point
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { PAUL, SPEAKING_LESSON, S1, S2, S3, S4 } from './fixtures'
import { generateTestLesson, findModule, saveOutput } from './lesson-gen'
import {
  validateWarmUp, validateUsefulLanguage, validateDialogue,
  validateListeningTrueFalse, validateMatchingQA, validateRoleplay,
  validateHomeworkWriting, validateVocabularyCards, validateListeningMCQ,
  validateRegisterUpgrade, validateGapFill, validateDiscussion, validateVocabularyMatch,
  validateDebate, validateUsefulExpressions, validateTalkingPoint,
} from './module-validators'

// ─── S1: Warm-up | Key Phrases | Dialogue | Listen T/F | Comprehension | Roleplay ───

describe('Speaking S1: warm-up → useful-language → dialogue → listening-true-false → gap-fill → roleplay', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(PAUL, SPEAKING_LESSON, S1)
    saveOutput('speaking-s1', lesson)
    console.log('\n[S1] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('lesson has correct top-level fields', () => {
    expect(typeof lesson.title).toBe('string')
    expect(lesson.title.length).toBeGreaterThan(3)
    expect(typeof lesson.objective).toBe('string')
    expect(lesson.duration).toBe(50)
    expect(Array.isArray(lesson.modules)).toBe(true)
  })

  it('module: warm-up', () => {
    const mod = findModule(lesson, 'warm-up')
    validateWarmUp(mod.content)
  })

  it('module: useful-language (Key Phrases)', () => {
    const mod = findModule(lesson, 'useful-language')
    validateUsefulLanguage(mod.content)
    // Confirm module title follows naming convention
    expect(mod.title).toBe('Key Phrases')
  })

  it('module: dialogue — shape, turn count, no bracket placeholders', () => {
    const mod = findModule(lesson, 'dialogue')
    validateDialogue(mod.content)
    // Title must start with "Dialogue - "
    expect(mod.title).toMatch(/^Dialogue - /)
  })

  it('module: listening-true-false — immediately follows dialogue', () => {
    const mod = findModule(lesson, 'listening-true-false')
    validateListeningTrueFalse(mod.content)
    expect(mod.title).toBe('Listen and Decide: True or False?')
  })

  it('module: gap-fill', () => {
    const mod = findModule(lesson, 'gap-fill')
    validateGapFill(mod.content)
    expect(mod.title).toBe('Gap Fill')
  })

  it('module: roleplay — situation not scenario, roles as objects', () => {
    const mod = findModule(lesson, 'roleplay')
    validateRoleplay(mod.content)
    // 'situation' not 'scenario'
    expect(mod.content.situation).toBeDefined()
    expect((mod.content as { scenario?: unknown }).scenario).toBeUndefined()
    expect(mod.title).toBe('Roleplay')
  })

  it('module: homework-writing — task, prompts, wordCount includes "words"', () => {
    const mod = findModule(lesson, 'homework-writing')
    validateHomeworkWriting(mod.content)
    expect(mod.title).toBe('Homework')
  })

  it('timeMinutes sum equals duration', () => {
    const total = lesson.modules.reduce((sum: number, m: { timeMinutes: number }) => sum + m.timeMinutes, 0)
    expect(total).toBe(50)
  })

  it('every module has tutorNotes', () => {
    for (const mod of lesson.modules) {
      expect(typeof mod.tutorNotes, `tutorNotes missing on "${mod.type}"`).toBe('string')
      expect(mod.tutorNotes.length, `tutorNotes too short on "${mod.type}"`).toBeGreaterThan(10)
    }
  })
})

// ─── S2: Vocabulary | Dialogue | Listen MCQ | Say It Better | Discussion ────────────

describe('Speaking S2: vocabulary-cards → dialogue → listening-mcq → register-upgrade → discussion', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(PAUL, SPEAKING_LESSON, S2)
    saveOutput('speaking-s2', lesson)
    console.log('\n[S2] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('module: vocabulary-cards — 6 single words, IPA, definition, example', () => {
    const mod = findModule(lesson, 'vocabulary-cards')
    validateVocabularyCards(mod.content)
    expect(mod.title).toBe('Vocabulary')
  })

  it('module: listening-mcq — 4 options per question, valid answer index', () => {
    const mod = findModule(lesson, 'listening-mcq')
    validateListeningMCQ(mod.content)
    expect(mod.title).toBe('Listening Comprehension')
  })

  it('module: register-upgrade — 5-6 basic/upgraded pairs', () => {
    const mod = findModule(lesson, 'register-upgrade')
    validateRegisterUpgrade(mod.content)
    expect(mod.title).toBe('Say It Better')
  })

  it('module: discussion — 4-6 questions, strings not objects', () => {
    const mod = findModule(lesson, 'discussion')
    validateDiscussion(mod.content)
    expect(mod.title).toBe('Discussion')
  })
})

// ─── S3: Vocabulary Match | Matching Q&A | Debate ───────────────────────────────────────────

describe('Speaking S3: vocabulary-match → matching-qa → debate', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(PAUL, SPEAKING_LESSON, S3)
    saveOutput('speaking-s3', lesson)
    console.log('\n[S3] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('module: vocabulary-match — exactly 2 groups × 5 pairs = 10 total', () => {
    const mod = findModule(lesson, 'vocabulary-match')
    validateVocabularyMatch(mod.content)
    expect(mod.title).toBe('Vocabulary Match')
    // vocabulary-cards must NOT also be present (no duplication)
    const hasCards = lesson.modules.some((m: { type: string }) => m.type === 'vocabulary-cards')
    expect(hasCards, 'vocabulary-cards and vocabulary-match both present').toBe(false)
  })

  it('module: matching-qa (Comprehension)', () => {
    const mod = findModule(lesson, 'matching-qa')
    validateMatchingQA(mod.content)
    expect(mod.title).toBe('Comprehension')
  })

  it('module: debate — topic, sideA, sideB with direct-opposite labels', () => {
    const mod = findModule(lesson, 'debate')
    validateDebate(mod.content)
    expect(mod.title).toBe('Debate')
  })
})

// ─── S4: Useful Expressions | Talking Point ──────────────────────────────────

describe('Speaking S4: useful-expressions → talking-point', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(PAUL, SPEAKING_LESSON, S4)
    saveOutput('speaking-s4', lesson)
    console.log('\n[S4] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('module: useful-expressions — fixed idioms, full + blank format', () => {
    const mod = findModule(lesson, 'useful-expressions')
    validateUsefulExpressions(mod.content)
    expect(mod.title).toBe('Useful Expressions')
  })

  it('module: talking-point — both studentA and studentB present with 3-4 questions each', () => {
    const mod = findModule(lesson, 'talking-point')
    validateTalkingPoint(mod.content)
    expect(mod.title).toBe('Talking Point')
  })
})
