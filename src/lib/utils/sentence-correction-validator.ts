/**
 * Sentence-correction validation utilities
 */

interface SentenceItem {
  incorrect?: string
  correct?: string
  errorType?: string
  explanation?: string
}

interface ValidationResult {
  isValid: boolean
  issues: string[]
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[\s\p{P}]+/gu, ' ').trim()
}

function isNoneLike(value?: string): boolean {
  if (!value) return true
  const v = value.trim().toLowerCase()
  return v === 'none' || v === 'n/a' || v === 'na' || v === 'no error' || v === 'correct'
}

function tokenDifferenceCount(a: string, b: string): number {
  const left = normalizeText(a).split(' ').filter(Boolean)
  const right = normalizeText(b).split(' ').filter(Boolean)
  const maxLen = Math.max(left.length, right.length)
  let diff = Math.abs(left.length - right.length)

  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    if (left[i] !== right[i]) diff += 1
  }

  return maxLen === 0 ? 0 : diff
}

function isSentenceCorrectionExercise(exercise: unknown): boolean {
  if (typeof exercise !== 'object' || exercise === null) return false
  const ex = exercise as { type?: string; title?: string; content?: unknown }
  const type = (ex.type || '').toLowerCase()
  const title = (ex.title || '').toLowerCase()
  const hasSentenceArray =
    typeof ex.content === 'object' &&
    ex.content !== null &&
    Array.isArray((ex.content as { sentences?: unknown[] }).sentences)

  if (!hasSentenceArray) return false
  return (
    type === 'sentence-correction' ||
    (type === 'grammar' && (title.includes('mistake') || title.includes('sentence correction')))
  )
}

export function validateSentenceCorrectionConstraints(parsedResponse: unknown): ValidationResult {
  const issues: string[] = []

  if (typeof parsedResponse !== 'object' || parsedResponse === null) {
    return { isValid: true, issues }
  }

  const resp = parsedResponse as { exercises?: unknown[] }
  if (!Array.isArray(resp.exercises)) {
    return { isValid: true, issues }
  }

  for (const exercise of resp.exercises) {
    if (!isSentenceCorrectionExercise(exercise)) continue

    const ex = exercise as { content?: { sentences?: unknown[] } }
    const sentences = ex.content?.sentences
    if (!Array.isArray(sentences) || sentences.length === 0) {
      issues.push('Sentence correction exercise has no sentences.')
      continue
    }

    for (let i = 0; i < sentences.length; i++) {
      const row = sentences[i] as SentenceItem
      if (typeof row !== 'object' || row === null) {
        issues.push(`Sentence ${i + 1} is not an object with incorrect/correct fields.`)
        continue
      }

      const incorrect = typeof row.incorrect === 'string' ? row.incorrect.trim() : ''
      const correct = typeof row.correct === 'string' ? row.correct.trim() : ''
      const errorType = typeof row.errorType === 'string' ? row.errorType.trim() : ''
      const explanation = typeof row.explanation === 'string' ? row.explanation.trim().toLowerCase() : ''

      if (!incorrect || !correct) {
        issues.push(`Sentence ${i + 1} is missing incorrect/correct text.`)
        continue
      }

      if (normalizeText(incorrect) === normalizeText(correct)) {
        issues.push(`Sentence ${i + 1} is already correct (incorrect equals correct).`)
      }

      if (isNoneLike(errorType)) {
        issues.push(`Sentence ${i + 1} has empty/none errorType.`)
      }

      if (explanation.includes('this sentence is correct') || explanation.includes('already correct')) {
        issues.push(`Sentence ${i + 1} explanation says the sentence is correct.`)
      }

      const diffCount = tokenDifferenceCount(incorrect, correct)
      if (diffCount === 0) {
        issues.push(`Sentence ${i + 1} has no detectable correction difference.`)
      } else if (diffCount > 4) {
        issues.push(`Sentence ${i + 1} appears to have multiple mistakes (too many token changes).`)
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}
