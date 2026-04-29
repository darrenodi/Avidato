/**
 * Post-generation validator for modular lessons.
 *
 * Architecture: two tiers.
 *   AUTO-FIX  — mechanical corrections applied silently (stem format, wordCount suffix,
 *               "from memory" text). These can't be wrong to apply.
 *   HARD      — spec violations that require regeneration of the lesson. Returned in
 *               hardViolations[]. The caller must NOT render the lesson if this is non-empty.
 *   WARN      — semantic issues logged but not blocking (pattern matching is imprecise
 *               and false positives on regeneration waste LLM calls).
 */

import type {
  ModularLessonContent,
  LessonModule,
  UsefulLanguageContent,
  WarmUpContent,
  DiscussionContent,
  FurtherDiscussionContent,
  RoleplayContent,
  DialogueContent,
  HomeworkWritingContent,
} from '../../types/module-lesson'

// ─── Return type ────────────────────────────────────────────────────────────

export interface ValidationResult {
  lesson: unknown
  /** Hard violations — lesson must not render; caller should regenerate */
  hardViolations: string[]
  /** Soft warnings — logged for visibility, do not block rendering */
  warnings: string[]
}

// ─── Function word list for fuzzy phrase matching ───────────────────────────

const FUNCTION_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'as', 'into',
  'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'our', 'their', 'its',
  'and', 'or', 'but', 'so', 'yet', 'nor', 'not',
])

function extractContentWords(phrase: string): string[] {
  return phrase.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1 && !FUNCTION_WORDS.has(w))
}

/**
 * Fuzzy: phrase is "covered" if all its content words appear in dialogueText.
 * Catches natural variants ("push the date back" covers "push back the date").
 */
function phraseAppearsInDialogue(phrase: string, dialogueText: string): boolean {
  const contentWords = extractContentWords(phrase)
  if (contentWords.length === 0) return true
  const lower = dialogueText.toLowerCase()
  return contentWords.every(w => lower.includes(w))
}

// ─── Pattern lists ─────────────────────────────────────────────────────────

const BANNED_WARMUP_PATTERNS = [
  /how\s+was\s+your\s+commute/i,
  /how\s+was\s+(?:your\s+)?(?:the\s+)?(?:weekend|commute|journey|drive|trip\s+in)/i,
  /did\s+you\s+(?:manage\s+to\s+get|get)\s+(?:any\s+)?(?:time\s+off|a\s+break|some\s+rest)/i,
  /did\s+you\s+(?:catch|watch|see)\s+the\s+(?:game|match|show|episode)/i,
  /considering\s+the\s+\w+(?:'s)?\s+(?:global|international|complex|dynamic)/i,
  /in\s+(?:today's|the\s+modern)\s+(?:globalized|interconnected|complex)/i,
  /what(?:'s|\s+is)\s+one\s+key\s+(?:lesson|takeaway|insight)/i,
  /if\s+you\s+(?:had\s+to|were\s+to)\s+(?:negotiate|address|present\s+to)\s+(?:a\s+)?(?:foreign|international|global|world)/i,
  /walk\s+(?:me|us)\s+through\s+the\s+(?:process|steps|procedure)/i,
  /how\s+do\s+(?:you|we|companies)\s+balance\s+.{0,60}\s+with\s+.{0,60}\s+when/i,
]

const BANNED_DISCUSSION_PATTERNS = [
  /how\s+would\s+you\s+(?:design|structure|build|implement)\s+a\s+(?:system|framework|strategy|process)\s+(?:to|that)/i,
  /how\s+do\s+(?:you|we|companies)\s+balance\s+.{0,60}\s+with\s+.{0,60}\s+when/i,
  /considering\s+(?:cross[-\s]cultural|cultural\s+differences|different\s+cultures)/i,
  /especially\s+with\s+international\s+teams?/i,
  /across\s+(?:different\s+)?(?:cultures?|countries|international\s+teams?)/i,
  /in\s+(?:a\s+)?(?:global|multicultural|international)\s+(?:context|environment|setting)/i,
  /what(?:'s|\s+is)\s+the\s+(?:most|biggest|hardest)\s+challenging\s+part\s+of/i,
  /what(?:'s|\s+is)\s+the\s+(?:most|biggest|greatest)\s+challenge\s+(?:in|when|with)/i,
  /in\s+your\s+opinion,?\s+what\s+(?:factors|aspects|elements)\s+(?:contribute|determine|influence)/i,
]

const SUCCESS_PHRASES = ['hit the target', 'hit our target', 'meet the target', 'on track', 'ahead of schedule', 'under budget', 'exceeded expectations', 'delivered on time']
const FAILURE_SCENARIO_KEYWORDS = ['over budget', 'cost overrun', 'behind schedule', 'delay', 'complaint', 'problem', 'issue', 'failed', 'failure', 'mistake', 'error', 'dispute', 'conflict']
const RAPPORT_PHRASES = ['great to collaborate', 'enjoy working with you', 'appreciate your perspective', 'it has been a pleasure', 'looking forward to working', 'great working with you', 'glad we could connect']
const ADVERSARIAL_SCENARIO_KEYWORDS = ['threaten', 'report to', 'escalate', 'demand', 'ultimatum', 'angry', 'hostile', 'confront', 'accuse']

// ─── Auto-fixes ─────────────────────────────────────────────────────────────

function fixUsefulLanguageModule(mod: LessonModule, warnings: string[]): void {
  const content = mod.content as UsefulLanguageContent
  if (!content?.phrases || !Array.isArray(content.phrases)) return

  if (mod.tutorNotes) {
    const before = mod.tutorNotes
    mod.tutorNotes = mod.tutorNotes
      .replace(/complete\s+(?:the\s+)?(?:phrase|stem)\s+from\s+memory/gi, 'complete the stem')
      .replace(/recall\s+(?:the\s+)?(?:phrase|stem)\s+from\s+memory/gi, 'complete the stem')
      .replace(/from\s+memory/gi, 'by completing the stem')
      .replace(/ask\s+(?:your\s+)?student\s+to\s+complete\s+the\s+(?:phrase|stem)\s+from\s+memory/gi,
        'say the stem aloud and ask your student to complete the phrase')
    if (mod.tutorNotes !== before) {
      warnings.push(`Auto-fixed "from memory" in tutorNotes of "${mod.title}"`)
    }
  }

  for (const phraseItem of content.phrases) {
    const words = phraseItem.phrase.trim().split(/\s+/)
    const visibleWords = phraseItem.stem
      ? phraseItem.stem.replace(/\.+\s*$/, '').trim().split(/\s+/).length
      : 0
    if (!phraseItem.stem || visibleWords < 3) {
      const showCount = Math.max(3, words.length - 2)
      phraseItem.stem = words.slice(0, showCount).join(' ') + ' .....'
      warnings.push(`Auto-fixed stem for phrase "${phraseItem.phrase}" → "${phraseItem.stem}"`)
    }
  }
}

function fixHomeworkModule(mod: LessonModule, warnings: string[]): void {
  const content = mod.content as HomeworkWritingContent
  if (!content?.wordCount) return
  if (!/\d+\s*words/i.test(content.wordCount)) {
    const fixed = content.wordCount.trim().replace(/[.…]+$/, '') + ' words'
    warnings.push(`Auto-fixed wordCount: "${content.wordCount}" → "${fixed}"`)
    content.wordCount = fixed
  }
}

// ─── Hard violation checks ──────────────────────────────────────────────────

/** Template placeholders in any module title or content text */
function checkTemplatePlaceholders(lesson: ModularLessonContent, hardViolations: string[]): void {
  const PLACEHOLDER = /\{\{[^}]+\}\}|\[[A-Z][A-Z_ ]+\]|\[topic\]|\[name\]|\[student\]/g
  const lessonText = JSON.stringify(lesson)
  const matches = lessonText.match(PLACEHOLDER)
  if (matches) {
    hardViolations.push(`Unfilled template placeholders found: ${[...new Set(matches)].join(', ')}`)
  }
}

/** Every target phrase from useful-language must appear (fuzzy) in the dialogue */
function checkPhraseCoverage(lesson: ModularLessonContent, hardViolations: string[]): void {
  const ulMod = lesson.modules.find(m => m.type === 'useful-language')
  const dlMod = lesson.modules.find(m => m.type === 'dialogue')
  if (!ulMod || !dlMod) return

  const ulContent = ulMod.content as UsefulLanguageContent
  const dlContent = dlMod.content as DialogueContent
  if (!ulContent?.phrases || !dlContent?.dialogue) return

  const dialogueText = dlContent.dialogue.map(l => l.text).join(' ')
  const missing: string[] = []

  for (const p of ulContent.phrases) {
    if (!phraseAppearsInDialogue(p.phrase, dialogueText)) {
      missing.push(`"${p.phrase}"`)
    }
  }

  if (missing.length > 0) {
    hardViolations.push(
      `Target phrase(s) from Key Phrases module do not appear in the dialogue: ${missing.join(', ')}. ` +
      `Every key phrase MUST appear in the dialogue. Add them naturally to the dialogue turns.`
    )
  }
}

// ─── Soft warnings ───────────────────────────────────────────────────────────

function warnWarmUp(mod: LessonModule, warnings: string[]): void {
  const content = mod.content as WarmUpContent
  if (!content?.questions) return
  for (const q of content.questions) {
    for (const pattern of BANNED_WARMUP_PATTERNS) {
      if (pattern.test(q)) {
        warnings.push(`Warm-up banned pattern: "${q.slice(0, 80)}"`)
        break
      }
    }
  }
}

function warnDiscussion(mod: LessonModule, warnings: string[]): void {
  const content = mod.content as DiscussionContent | FurtherDiscussionContent
  if (!content?.questions) return
  for (const q of content.questions) {
    for (const pattern of BANNED_DISCUSSION_PATTERNS) {
      if (pattern.test(q)) {
        warnings.push(`Discussion abstract/McKinsey question: "${q.slice(0, 100)}"`)
        break
      }
    }
  }
}

function warnDialoguePhraseStacking(mod: LessonModule, lesson: ModularLessonContent, warnings: string[]): void {
  const content = mod.content as DialogueContent
  if (!content?.dialogue) return
  const ulMod = lesson.modules.find(m => m.type === 'useful-language')
  if (!ulMod) return
  const ulContent = ulMod.content as UsefulLanguageContent
  if (!ulContent?.phrases) return

  const targetPhrases = ulContent.phrases.map(p => extractContentWords(p.phrase))

  for (const line of content.dialogue) {
    const lineLower = line.text.toLowerCase()
    const hits = targetPhrases.filter(cw => cw.length > 0 && cw.every(w => lineLower.includes(w)))
    if (hits.length >= 2) {
      warnings.push(`Dialogue phrase-stacking: ${line.character} uses ${hits.length} target phrases in one turn`)
    }
  }
}

function warnRoleplay(mod: LessonModule, lesson: ModularLessonContent, warnings: string[]): void {
  const content = mod.content as RoleplayContent
  if (!content?.situation) return
  const situationLower = content.situation.toLowerCase()

  const isFailure = FAILURE_SCENARIO_KEYWORDS.some(kw => situationLower.includes(kw))
  if (isFailure && Array.isArray(content.phrasesToUse)) {
    for (const phrase of content.phrasesToUse) {
      if (SUCCESS_PHRASES.some(sp => phrase.toLowerCase().includes(sp))) {
        warnings.push(`Roleplay: success phrase "${phrase}" in failure scenario`)
      }
    }
  }

  const isAdversarial = ADVERSARIAL_SCENARIO_KEYWORDS.some(kw => situationLower.includes(kw))
  if (isAdversarial && Array.isArray(content.phrasesToUse)) {
    for (const phrase of content.phrasesToUse) {
      if (RAPPORT_PHRASES.some(rp => phrase.toLowerCase().includes(rp))) {
        warnings.push(`Roleplay: rapport phrase "${phrase}" in adversarial scenario`)
      }
    }
  }

  const isRapportLesson = /rapport|relationship|network|connect|build.*trust/i.test(lesson.title ?? '')
  if (isRapportLesson && isAdversarial) {
    warnings.push(`Lesson coherence: rapport-building lesson "${lesson.title}" has adversarial roleplay`)
  }
}

// ─── Main entry point ───────────────────────────────────────────────────────

export function validateModularLesson(lesson: unknown): ValidationResult {
  const hardViolations: string[] = []
  const warnings: string[] = []

  if (typeof lesson !== 'object' || lesson === null) {
    hardViolations.push('Lesson is not a valid object')
    return { lesson, hardViolations, warnings }
  }

  const modularLesson = lesson as ModularLessonContent

  if (!Array.isArray(modularLesson.modules) || modularLesson.modules.length === 0) {
    hardViolations.push('Lesson has no modules array')
    return { lesson, hardViolations, warnings }
  }

  // Auto-fixes first
  for (const mod of modularLesson.modules) {
    switch (mod.type) {
      case 'useful-language': fixUsefulLanguageModule(mod, warnings); break
      case 'homework-writing': fixHomeworkModule(mod, warnings); break
    }
  }

  // Hard checks
  checkTemplatePlaceholders(modularLesson, hardViolations)
  checkPhraseCoverage(modularLesson, hardViolations)

  // Soft warnings
  for (const mod of modularLesson.modules) {
    switch (mod.type) {
      case 'warm-up': warnWarmUp(mod, warnings); break
      case 'discussion':
      case 'further-discussion': warnDiscussion(mod, warnings); break
      case 'dialogue': warnDialoguePhraseStacking(mod, modularLesson, warnings); break
      case 'roleplay': warnRoleplay(mod, modularLesson, warnings); break
    }
  }

  // Log warnings (these don't block)
  for (const w of warnings) console.log(`[lesson-validator] ${w}`)
  for (const v of hardViolations) console.error(`[lesson-validator] HARD VIOLATION: ${v}`)

  return { lesson, hardViolations, warnings }
}

/** @deprecated Use validateModularLesson instead */
export function enforceModularLessonConstraints(lesson: unknown): unknown {
  return validateModularLesson(lesson).lesson
}
