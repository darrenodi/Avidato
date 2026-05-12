// Helpers to generate lessons during tests — no DB, no auth, direct AI calls.
// Wraps the same production code path (prompt builder + generation guard + failover).

import { mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import type { StudentProfile, BlockLesson } from '@/types/lesson-template'
import { buildModularLessonPrompt } from '@/lib/prompts/modular-lesson-prompt'
import { generateModularLessonWithGuard } from '@/lib/utils/modular-lesson-generation-guard'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { getSuggestedRolesAndScenarios } from '@/lib/constants/occupation-roles'
import { generateInstantLesson } from '@/lib/instantLessonGenerator'
import { buildTranscriptPrompt, type CEFRLevel, type YouTubeLessonData } from '@/lib/youtube-lesson-prompt'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'
import { A1LessonModule } from '@/lib/cefr/A1LessonModule'
import { A2LessonModule } from '@/lib/cefr/A2LessonModule'
import { B1LessonModule } from '@/lib/cefr/B1LessonModule'
import { B2LessonModule } from '@/lib/cefr/B2LessonModule'
import { C1LessonModule } from '@/lib/cefr/C1LessonModule'
import { C2LessonModule } from '@/lib/cefr/C2LessonModule'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCEFRModule(level: string) {
  const l = level.toLowerCase()
  if (l.includes('a1')) return new A1LessonModule()
  if (l.includes('a2') || l.includes('elementary')) return new A2LessonModule()
  if (l.includes('b1') || l.includes('intermediate')) return new B1LessonModule()
  if (l.includes('b2') || l.includes('upper')) return new B2LessonModule()
  if (l.includes('c1') || l.includes('advanced')) return new C1LessonModule()
  if (l.includes('c2') || l.includes('proficiency')) return new C2LessonModule()
  return new B1LessonModule()
}

// ─── Modular lesson generation ───────────────────────────────────────────────

export async function generateTestLesson(
  student: StudentProfile,
  lesson: BlockLesson,
  structureOverride: { category: string; modules: string[] },
  duration: 25 | 50 = 50
) {
  const { roles } = getSuggestedRolesAndScenarios(student.occupation)
  const cefrModule = getCEFRModule(student.level)

  const prompt = buildModularLessonPrompt(
    student,
    lesson,
    duration,
    roles,
    cefrModule.getVocabularyGuide(),
    cefrModule.getVocabularyGuide(),
    '',
    structureOverride
  )

  const result = await generateModularLessonWithGuard(
    prompt,
    async (p) => {
      const { rawText } = await generateWithProviderFailover({
        prompt: p,
        generationConfig: { maxOutputTokens: 16384 },
      })
      return rawText
    }
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result as any
}

// ─── YouTube lesson generation ────────────────────────────────────────────────

export async function generateTestYouTubeLesson(
  transcript: string,
  level: CEFRLevel
): Promise<YouTubeLessonData> {
  const prompt = buildTranscriptPrompt(transcript, level)
  const { rawText } = await generateWithProviderFailover({
    prompt,
    generationConfig: { maxOutputTokens: 16384 },
  })
  return cleanAndParseJSON<YouTubeLessonData>(extractJSONFromText(rawText))
}

// ─── Instant lesson re-export ─────────────────────────────────────────────────

export { generateInstantLesson }

// ─── Output saving ────────────────────────────────────────────────────────────
// Saves full AI output to test-outputs/lessons/ for human review.

const OUTPUT_DIR = resolve(process.cwd(), 'test-outputs', 'lessons')

export function saveOutput(name: string, data: unknown) {
  try {
    mkdirSync(OUTPUT_DIR, { recursive: true })
    const filename = `${name}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    writeFileSync(resolve(OUTPUT_DIR, filename), JSON.stringify(data, null, 2))
    console.log(`  📄 Output saved: test-outputs/lessons/${filename}`)
  } catch {
    // Non-fatal — don't fail tests if saving fails
  }
}

// ─── Module finder ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findModule(lesson: any, type: string): any {
  const mod = lesson.modules?.find((m: { type: string }) => m.type === type)
  if (!mod) throw new Error(`Module "${type}" not found in lesson. Available: ${lesson.modules?.map((m: { type: string }) => m.type).join(', ')}`)
  return mod
}
