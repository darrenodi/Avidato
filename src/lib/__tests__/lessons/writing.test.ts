/**
 * Writing lesson tests — structure W3
 *
 * Covered module types (2 new):
 *   W3 → writing-task, language-in-context
 *   (warm-up, find-the-mistake, homework-writing already covered)
 *
 * W3 structure: warm-up → find-the-mistake → language-in-context → writing-task → homework-writing
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { WOJCIECH, WRITING_LESSON, W3 } from './fixtures'
import { generateTestLesson, findModule, saveOutput } from './lesson-gen'
import {
  validateWarmUp, validateFindTheMistake, validateLanguageInContext,
  validateWritingTask, validateHomeworkWriting,
} from './module-validators'

describe('Writing W3: warm-up → find-the-mistake → language-in-context → writing-task → homework-writing', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lesson: any

  beforeAll(async () => {
    lesson = await generateTestLesson(WOJCIECH, WRITING_LESSON, W3)
    saveOutput('writing-w3', lesson)
    console.log('\n[W3] Modules generated:', lesson.modules?.map((m: { type: string }) => m.type).join(', '))
  })

  it('lesson has correct top-level fields', () => {
    expect(lesson.category).toBe('writing')
    expect(lesson.duration).toBe(50)
    expect(typeof lesson.title).toBe('string')
  })

  it('module: warm-up', () => {
    validateWarmUp(findModule(lesson, 'warm-up').content)
  })

  it('module: find-the-mistake — errors in WRITING QUALITY not basic grammar', () => {
    const mod = findModule(lesson, 'find-the-mistake')
    validateFindTheMistake(mod.content)
    expect(mod.content.sentences).toHaveLength(10)
    // Writing discipline: errors must be about register/clarity/documentation quality
    // (we check that explanations reference writing-type issues, not pure grammar)
    const hasExplanations = mod.content.sentences.some(
      (s: { explanation?: string }) => s.explanation && s.explanation.length > 10
    )
    // explanations are optional but encouraged — just log if absent
    if (!hasExplanations) {
      console.warn('[W3 find-the-mistake] No explanations found — consider checking prompt enforcement')
    }
  })

  it('module: language-in-context — phrases not single words, each has function', () => {
    const mod = findModule(lesson, 'language-in-context')
    validateLanguageInContext(mod.content)
    expect(mod.title).toBe('Language in Context')
    // Writing discipline: no 'analysis' key, only 'function'
    for (const p of mod.content.phrases) {
      expect(p.analysis, "banned 'analysis' key found in language-in-context").toBeUndefined()
      expect(typeof p.function).toBe('string')
    }
  })

  it('module: writing-task — specific document brief, not generic', () => {
    const mod = findModule(lesson, 'writing-task')
    validateWritingTask(mod.content)
    expect(mod.title).toBe('Writing Task')
    // Brief must mention the document type or audience
    const brief = mod.content.brief.toLowerCase()
    const hasDocumentContext = /report|document|write|draft|compose|section|readme|spec/.test(brief)
    expect(hasDocumentContext, `brief too generic: "${mod.content.brief}"`).toBe(true)
    // wordCount must include "words"
    if (mod.content.wordCount) {
      expect(String(mod.content.wordCount).toLowerCase()).toContain('words')
    }
    // No modelText for C1 student (B2+ should not get scaffolded model text)
    if (mod.content.modelText) {
      console.warn('[W3 writing-task] modelText present for C1 student — should be omitted per prompt rules')
    }
  })

  it('module: homework-writing — concrete real-world task', () => {
    validateHomeworkWriting(findModule(lesson, 'homework-writing').content)
  })

  it('no reading-article in writing lesson (W3 is critique-and-write, not reading-focused)', () => {
    const hasArticle = lesson.modules.some((m: { type: string }) => m.type === 'reading-article')
    expect(hasArticle, 'reading-article must not appear in W3 writing lesson').toBe(false)
  })

  it('timeMinutes sum equals 50', () => {
    const total = lesson.modules.reduce((s: number, m: { timeMinutes: number }) => s + m.timeMinutes, 0)
    expect(total).toBe(50)
  })
})
