/**
 * YouTube lesson tests
 *
 * Uses a fake ~800-word transcript about remote work productivity.
 * Level: B2 — good middle ground for testing vocabulary and phrase quality.
 *
 * Validates all 9 sections of the YouTube lesson format:
 * warmUp, preTeach, detailQuestions, discussion, phrases,
 * fillBlanks, speakingPractice, wrapUp, homework
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { YOUTUBE_TRANSCRIPT } from './fixtures'
import { generateTestYouTubeLesson, saveOutput } from './lesson-gen'
import type { YouTubeLessonData } from '@/lib/youtube-lesson-prompt'
import { assertNoEmDash, assertNoBannedWords } from './module-validators'

describe('YouTube Lesson (B2, remote work transcript)', () => {
  let lesson: YouTubeLessonData

  beforeAll(async () => {
    lesson = await generateTestYouTubeLesson(YOUTUBE_TRANSCRIPT, 'B2')
    saveOutput('youtube-b2', lesson)
    console.log('\n[YouTube] Title:', lesson.title)
    console.log('[YouTube] Topic:', lesson.topic)
  })

  // ── Top-level fields ────────────────────────────────────────────────────────

  it('has required top-level fields', () => {
    expect(typeof lesson.title).toBe('string')
    expect(lesson.title.length).toBeGreaterThan(3)
    expect(typeof lesson.topic).toBe('string')
    expect(typeof lesson.teacherNotes).toBe('string')
    expect(lesson.teacherNotes.length).toBeGreaterThan(20)
    expect(lesson.estimatedMinutes).toBe(50)
  })

  // ── Stage 1: Warm-up ─────────────────────────────────────────────────────

  it('warmUp: exactly 3 questions, each under 20 words', () => {
    expect(Array.isArray(lesson.warmUp)).toBe(true)
    expect(lesson.warmUp).toHaveLength(3)
    for (const q of lesson.warmUp) {
      expect(typeof q.question).toBe('string')
      expect(q.question.split(/\s+/).length, `question too long: "${q.question}"`).toBeLessThanOrEqual(20)
    }
  })

  it('warmUp: questions have sequential ids 1-3', () => {
    const ids = lesson.warmUp.map(q => q.id)
    expect(ids).toEqual([1, 2, 3])
  })

  // ── Stage 2: Pre-teach vocabulary ────────────────────────────────────────

  it('preTeach: exactly 5 items', () => {
    expect(lesson.preTeach).toHaveLength(5)
  })

  it('preTeach: each item has required fields and is a single word', () => {
    for (const item of lesson.preTeach) {
      expect(typeof item.term).toBe('string')
      // Must be a single word (no multi-word phrases)
      expect(item.term.trim().split(/\s+/).length, `"${item.term}" must be single word`).toBe(1)
      expect(['noun', 'verb', 'adjective', 'adverb'], `"${item.type}" is not a valid type`).toContain(item.type)
      expect(typeof item.phonetics).toBe('string')
      expect(item.phonetics, `"${item.term}" missing IPA phonetics`).toMatch(/\/.*\//)
      expect(typeof item.definition).toBe('string')
      expect(item.definition.split(/\s+/).length, `definition too long: "${item.definition}"`).toBeLessThanOrEqual(10)
      expect(typeof item.exampleSentence).toBe('string')
      expect(item.exampleSentence.length).toBeGreaterThan(10)
      // Proper nouns are banned
      const isProperNoun = /^[A-Z]/.test(item.term)
      expect(isProperNoun, `"${item.term}" appears to be a proper noun`).toBe(false)
    }
  })

  // ── Stage 3: Detail questions ─────────────────────────────────────────────

  it('detailQuestions: exactly 5 items with question and answer', () => {
    expect(lesson.detailQuestions).toHaveLength(5)
    for (const q of lesson.detailQuestions) {
      expect(typeof q.question).toBe('string')
      expect(q.question.length).toBeGreaterThan(10)
      expect(typeof q.answer).toBe('string')
      expect(q.answer.length).toBeGreaterThan(10)
    }
  })

  // ── Stage 4: Discussion ──────────────────────────────────────────────────

  it('discussion: exactly 5 questions with follow-ups', () => {
    expect(lesson.discussion).toHaveLength(5)
    for (const q of lesson.discussion) {
      expect(typeof q.question).toBe('string')
      expect(q.question.length).toBeGreaterThan(10)
      // Main question must not open with video reference
      expect(q.question, 'discussion opens with video reference').not.toMatch(/^(the video|the speaker|the panel|according to)/i)
      expect(typeof q.followUp).toBe('string')
      expect(q.followUp.length).toBeGreaterThan(5)
    }
  })

  // ── Stage 5a: Phrases (matching) ─────────────────────────────────────────

  it('phrases: exactly 8 items, only idioms and phrasal verbs', () => {
    expect(lesson.phrases).toHaveLength(8)
    for (const p of lesson.phrases) {
      expect(typeof p.term).toBe('string')
      expect(p.term.trim().split(/\s+/).length, `"${p.term}" must be multi-word phrase`).toBeGreaterThanOrEqual(2)
      expect(['idiom', 'phrasal verb'], `"${p.type}" is not idiom or phrasal verb`).toContain(p.type)
      expect(typeof p.meaning).toBe('string')
      expect(p.meaning.length).toBeGreaterThan(5)
    }
  })

  it('phrases: no duplicate base verbs', () => {
    const verbs = lesson.phrases.map(p => p.term.split(/\s+/)[0].toLowerCase())
    const unique = new Set(verbs)
    expect(unique.size, `duplicate base verbs: [${verbs.join(', ')}]`).toBe(verbs.length)
  })

  // ── Stage 5b: Fill-in-the-blanks ─────────────────────────────────────────

  it('fillBlanks: exactly 6 items with blank marker ________', () => {
    expect(lesson.fillBlanks).toHaveLength(6)
    for (const item of lesson.fillBlanks) {
      expect(typeof item.sentence).toBe('string')
      expect(item.sentence, `fill-blank sentence missing "________"`).toContain('________')
      expect(typeof item.answer).toBe('string')
      expect(item.answer.length).toBeGreaterThan(1)
      // Answer must not appear literally in sentence (answer leaking)
      expect(
        item.sentence.toLowerCase(),
        `answer "${item.answer}" leaked into sentence`
      ).not.toContain(item.answer.toLowerCase())
    }
  })

  // ── Stage 5c: Speaking practice ──────────────────────────────────────────

  it('speakingPractice: exactly 5 items, each under 15 words with bolded phrase', () => {
    expect(lesson.speakingPractice).toHaveLength(5)
    for (const item of lesson.speakingPractice) {
      expect(typeof item.question).toBe('string')
      expect(item.question.split(/\s+/).length, `question too long: "${item.question}"`).toBeLessThanOrEqual(15)
      // Must contain a bolded phrase (**phrase**)
      expect(item.question, `no bolded phrase in: "${item.question}"`).toContain('**')
    }
  })

  // ── Stage 6: Wrap-up ──────────────────────────────────────────────────────

  it('wrapUp: exactly 2 reflection prompts', () => {
    expect(lesson.wrapUp).toHaveLength(2)
    for (const p of lesson.wrapUp) {
      expect(typeof p.prompt).toBe('string')
      expect(p.prompt.length).toBeGreaterThan(15)
    }
  })

  it('homework: single task with type', () => {
    expect(lesson.homework).toBeDefined()
    expect(typeof lesson.homework.task).toBe('string')
    expect(lesson.homework.task.length).toBeGreaterThan(20)
    expect(['writing', 'speaking', 'research']).toContain(lesson.homework.type)
  })

  // ── Global quality ────────────────────────────────────────────────────────

  it('no em dashes in full lesson', () => {
    assertNoEmDash(lesson, 'youtube-lesson')
  })

  it('no banned AI words in full lesson', () => {
    assertNoBannedWords(lesson, 'youtube-lesson')
  })
})
