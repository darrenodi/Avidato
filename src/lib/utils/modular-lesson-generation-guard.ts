/**
 * Quality gate for modular lesson generation.
 *
 * Wraps the raw AI generation call with a validate → regenerate loop.
 * Hard validator violations inject failure reasons into the next attempt's prompt.
 * After MAX_ATTEMPTS failures the guard throws — the lesson does NOT render.
 */

import { extractJSONFromText, cleanAndParseJSON } from './json-parser'
import { validateModularLesson } from './modular-lesson-validator'
import type { GeneratedLesson } from '../../types/lesson-template'

const MAX_ATTEMPTS = 3

/**
 * @param basePrompt  - The fully-built prompt (no violation context yet)
 * @param callAI      - Function that sends a prompt and returns raw text
 */
export async function generateModularLessonWithGuard(
  basePrompt: string,
  callAI: (prompt: string) => Promise<string>
): Promise<GeneratedLesson> {
  let previousViolations: string[] = []

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const prompt = previousViolations.length === 0
      ? basePrompt
      : basePrompt + buildViolationContext(previousViolations, attempt)

    const rawText = await callAI(prompt)
    const parsed = cleanAndParseJSON<GeneratedLesson>(extractJSONFromText(rawText))
    const { lesson, hardViolations } = validateModularLesson(parsed)

    if (hardViolations.length === 0) {
      if (attempt > 1) {
        console.log(`[lesson-guard] Lesson passed validation on attempt ${attempt}`)
      }
      return lesson as GeneratedLesson
    }

    console.warn(
      `[lesson-guard] Attempt ${attempt}/${MAX_ATTEMPTS} failed with ${hardViolations.length} violation(s):`,
      hardViolations
    )
    previousViolations = hardViolations
  }

  throw new Error(
    `Lesson generation failed validation after ${MAX_ATTEMPTS} attempts.\n` +
    `Final violations:\n${previousViolations.map(v => `  • ${v}`).join('\n')}\n` +
    `Please try regenerating or contact support if this persists.`
  )
}

function buildViolationContext(violations: string[], attempt: number): string {
  return `

VALIDATION FAILURES FROM ATTEMPT ${attempt - 1} — these exact problems appeared in your output and MUST be fixed before this lesson can be used. Each violation names the module and what must change:

${violations.map(v => `• ${v}`).join('\n')}

Fix each violation above. Other modules that were not flagged should remain unchanged unless fixing a violation requires a related change (e.g., adding a missing phrase to the dialogue).`
}
