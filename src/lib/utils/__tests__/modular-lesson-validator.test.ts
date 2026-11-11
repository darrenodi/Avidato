import { describe, it, expect, vi } from 'vitest'
import { validateModularLesson } from '../modular-lesson-validator'

vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})

const gapSentences = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ sentence: `We need to ___ the report ${i}.`, answer: 'finalise' }))

function lessonWith(...modules: { type: string; content: unknown }[]) {
  return {
    title: 'Test',
    modules: modules.map(m => ({ ...m, title: m.type, timeMinutes: 5, tutorNotes: 'x' })),
  }
}

describe('validateModularLesson — item counts', () => {
  it('passes a gap-fill inside the 6-10 range', () => {
    const { hardViolations } = validateModularLesson(lessonWith({ type: 'gap-fill', content: { sentences: gapSentences(6) } }))
    expect(hardViolations).toEqual([])
  })

  it('flags a gap-fill with too few sentences and says how many to add', () => {
    const { hardViolations } = validateModularLesson(lessonWith({ type: 'gap-fill', content: { sentences: gapSentences(5) } }))
    expect(hardViolations).toHaveLength(1)
    expect(hardViolations[0]).toMatch(/gap-fill .*has 5 sentences — spec requires 6-10\. Add 1 more\./)
  })

  it('flags too many items', () => {
    const { hardViolations } = validateModularLesson(lessonWith({ type: 'gap-fill', content: { sentences: gapSentences(11) } }))
    expect(hardViolations[0]).toMatch(/Remove 1\./)
  })

  it('requires exactly 6 vocabulary cards', () => {
    const words = (n: number) => Array.from({ length: n }, (_, i) => ({ word: `lexeme${i}`, definition: 'd', example: 'e' }))
    expect(validateModularLesson(lessonWith({ type: 'vocabulary-cards', content: { vocabulary: words(6) } })).hardViolations).toEqual([])
    expect(validateModularLesson(lessonWith({ type: 'vocabulary-cards', content: { vocabulary: words(5) } })).hardViolations[0])
      .toMatch(/spec requires exactly 6/)
  })

  it('checks nested arrays (debate sides)', () => {
    const { hardViolations } = validateModularLesson(lessonWith({
      type: 'debate',
      content: { topic: 't', sideA: { label: 'For', points: ['a', 'b', 'c'] }, sideB: { label: 'Against', points: ['a', 'b'] } },
    }))
    expect(hardViolations).toHaveLength(1)
    expect(hardViolations[0]).toMatch(/2 side B points/)
  })

  it('flags a missing list', () => {
    const { hardViolations } = validateModularLesson(lessonWith({ type: 'register-upgrade', content: {} }))
    expect(hardViolations[0]).toMatch(/no items array/)
  })
})

describe('validateModularLesson — item shapes', () => {
  it('flags gap-fill sentences with no ___ blank', () => {
    const sentences = gapSentences(6)
    sentences[2] = { sentence: 'We need to finalise the report.', answer: 'finalise' }
    const { hardViolations } = validateModularLesson(lessonWith({ type: 'gap-fill', content: { sentences } }))
    expect(hardViolations).toHaveLength(1)
    expect(hardViolations[0]).toMatch(/1 sentence\(s\) with no ___ blank/)
  })

  it('flags useful-expressions whose blank is not inside full', () => {
    const expressions = Array.from({ length: 6 }, () => ({ full: 'Let us get the ball rolling today.', blank: 'get the ball rolling' }))
    expect(validateModularLesson(lessonWith({ type: 'useful-expressions', content: { expressions } })).hardViolations).toEqual([])
    expressions[0] = { full: 'Let us start today.', blank: 'get the ball rolling' }
    expect(validateModularLesson(lessonWith({ type: 'useful-expressions', content: { expressions } })).hardViolations[0])
      .toMatch(/does not appear verbatim/)
  })
})

describe('validateModularLesson — auto-fixes', () => {
  it('converts vocabulary-in-text paragraph strings to numbers', () => {
    const items = Array.from({ length: 8 }, (_, i) => ({ definition: 'd', partOfSpeech: 'noun', paragraph: String(i + 1), answer: 'w' }))
    const { lesson, hardViolations, warnings } = validateModularLesson(lessonWith({ type: 'vocabulary-in-text', content: { items } }))
    expect(hardViolations).toEqual([])
    expect(warnings.some(w => w.includes('converted 8 paragraph'))).toBe(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((lesson as any).modules[0].content.items[0].paragraph).toBe(1)
  })
})
