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
  VocabularyMatchContent,
  MatchingQAContent,
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
 * Both phrase and dialogue are normalised the same way before comparison so
 * contractions (we've → weve, we'll → well) match correctly.
 */
function phraseAppearsInDialogue(phrase: string, dialogueText: string): boolean {
  const contentWords = extractContentWords(phrase)
  if (contentWords.length === 0) return true
  // Strip apostrophes before other non-alpha chars so "we've" → "weve" (not "we ve")
  const normalised = dialogueText.toLowerCase().replace(/'/g, '').replace(/[^a-z\s]/g, ' ')
  return contentWords.every(w => normalised.includes(w))
}

// ─── Pattern lists ─────────────────────────────────────────────────────────

const BANNED_WARMUP_PATTERNS = [
  // Generic social filler
  /how\s+was\s+your\s+commute/i,
  /how\s+was\s+(?:your\s+)?(?:the\s+)?(?:weekend|commute|journey|drive|trip\s+in)/i,
  /did\s+you\s+(?:manage\s+to\s+get|get)\s+(?:any\s+)?(?:time\s+off|a\s+break|some\s+rest)/i,
  /did\s+you\s+(?:catch|watch|see)\s+the\s+(?:game|match|show|episode)/i,
  // Abstract / complex synthesis
  /considering\s+the\s+\w+(?:'s)?\s+(?:global|international|complex|dynamic)/i,
  /in\s+(?:today's|the\s+modern)\s+(?:globalized|interconnected|complex)/i,
  /what(?:'s|\s+is)\s+one\s+key\s+(?:lesson|takeaway|insight)/i,
  /if\s+you\s+(?:had\s+to|were\s+to)\s+(?:negotiate|address|present\s+to)\s+(?:a\s+)?(?:foreign|international|global|world)/i,
  /how\s+do\s+(?:you|we|companies)\s+balance\s+.{0,60}\s+with\s+.{0,60}\s+when/i,
  // Procedural / audit framing (spec: "How do you decide whether X?", "What is your process for Z?")
  /how\s+do\s+you\s+decide\s+(?:when|whether|if|which|who|what)/i,
  /what\s+is\s+(?:the\s+)?first\s+thing\s+(?:you|that)\s+(?:check|do|think|consider|go)/i,
  /what\s+(?:steps|approach|process|method|procedure)\s+do\s+you\s+(?:take|use|follow)\s+(?:when|if|to)/i,
  /what\s+is\s+your\s+(?:process|approach|strategy|method)\s+for/i,
  /walk\s+(?:me|us)\s+through\s+the\s+(?:process|steps|procedure)/i,
  // Survey / frequency framing
  /how\s+do\s+you\s+(?:typically|usually)/i,
  /what\s+kind\s+of\s+.{0,30}\s+do\s+you\s+(?:find|prefer|enjoy)/i,
  // "Most effective way to" — prescriptive advice-seeking
  /(?:what(?:\s+is)?\s+the\s+)?most\s+effective\s+way\s+to/i,
  // "What makes X feel/seem Y" — abstract quality judgment
  /what\s+makes\s+.{0,40}\s+(?:feel|seem|sound|appear)\s+/i,
  // Learner framing (spec: "What do you find helpful when learning X?")
  /what\s+do\s+you\s+find\s+(?:helpful|useful|effective)\s+when\s+(?:learn|study|practis)/i,
]

const BANNED_DISCUSSION_PATTERNS = [
  // Abstract synthesis / design questions
  /how\s+would\s+you\s+(?:design|structure|build|implement)\s+a\s+(?:system|framework|strategy|process)\s+(?:to|that)/i,
  /how\s+do\s+(?:you|we|companies)\s+balance\s+.{0,60}\s+with\s+.{0,60}\s+when/i,
  // Cross-cultural / international
  /considering\s+(?:cross[-\s]cultural|cultural\s+differences|different\s+cultures)/i,
  /especially\s+with\s+international\s+teams?/i,
  /across\s+(?:different\s+)?(?:cultures?|countries|international\s+teams?)/i,
  /in\s+(?:a\s+)?(?:global|multicultural|international)\s+(?:context|environment|setting)/i,
  // Superlative challenge framing — catches "most difficult part", "biggest challenge in", etc.
  /what(?:'s|\s+is)\s+the\s+(?:most|biggest|greatest|hardest)\s+(?:difficult|challenging|hard|complex)\s+(?:part|aspect|element|challenge)\s+(?:of|about|in|when)/i,
  /what(?:'s|\s+is)\s+the\s+(?:most|biggest|greatest)\s+challenge\s+(?:in|when|with)/i,
  /in\s+your\s+opinion,?\s+what\s+(?:factors|aspects|elements)\s+(?:contribute|determine|influence)/i,
  // "Most effective way to" — prescriptive, not experiential
  /(?:what(?:\s+is)?\s+the\s+)?most\s+effective\s+way\s+to/i,
  // Procedural / process questions (spec: "How do you decide when X?", "What steps do you take when Z?")
  /how\s+do\s+you\s+decide\s+(?:when|whether|if|which|who|what)/i,
  /what\s+is\s+(?:the\s+)?first\s+thing\s+(?:you|that)\s+(?:check|do|think|consider|go)/i,
  /what\s+(?:steps|approach|process|method|procedure)\s+do\s+you\s+(?:take|use|follow)\s+(?:when|if|to)/i,
  /what\s+is\s+your\s+(?:process|approach|strategy|method)\s+for/i,
  // Maintenance / sustainability — "How do you maintain/ensure X?" is process not experience
  /how\s+do\s+you\s+(?:maintain|ensure|sustain|preserve)\s+/i,
  // Survey / frequency framing
  /how\s+do\s+you\s+(?:typically|usually)/i,
  // "What makes X feel/seem Y" — abstract quality judgment
  /what\s+makes\s+.{0,40}\s+(?:feel|seem|sound|appear)\s+/i,
]

const SUCCESS_PHRASES = ['hit the target', 'hit our target', 'meet the target', 'on track', 'ahead of schedule', 'under budget', 'exceeded expectations', 'delivered on time']
const FAILURE_SCENARIO_KEYWORDS = ['over budget', 'cost overrun', 'behind schedule', 'delay', 'complaint', 'problem', 'issue', 'failed', 'failure', 'mistake', 'error', 'dispute', 'conflict']
const RAPPORT_PHRASES = ['great to collaborate', 'enjoy working with you', 'appreciate your perspective', 'it has been a pleasure', 'looking forward to working', 'great working with you', 'glad we could connect']
const ADVERSARIAL_SCENARIO_KEYWORDS = ['threaten', 'report to', 'escalate', 'demand', 'ultimatum', 'angry', 'hostile', 'confront', 'accuse']

// ─── Auto-fixes ─────────────────────────────────────────────────────────────

/**
 * Strip unfilled `[name]` / `[student]` placeholders from all string fields.
 * The AI sometimes generates phrases like "What are your thoughts, [name]?"
 * instead of using the actual student name. We strip the token rather than
 * blocking regeneration, since removing it produces a valid phrase.
 */
function fixUnfilledNamePlaceholders(lesson: ModularLessonContent, warnings: string[]): void {
  const PLACEHOLDER = /,?\s*\[name\]|\[student\]/gi
  const raw = JSON.stringify(lesson)
  if (!PLACEHOLDER.test(raw)) return
  PLACEHOLDER.lastIndex = 0

  const fixed = raw.replace(PLACEHOLDER, '')
  try {
    const parsed = JSON.parse(fixed) as ModularLessonContent
    Object.assign(lesson, parsed)
    warnings.push('Auto-fixed [name]/[student] placeholders — stripped from phrase text')
  } catch {
    // If re-parse fails somehow, leave the lesson as-is and let the hard check catch it
  }
}

function fixUsefulLanguageModule(mod: LessonModule, warnings: string[]): void {
  const content = mod.content as UsefulLanguageContent
  if (!content?.phrases || !Array.isArray(content.phrases)) return

  if (mod.tutorNotes) {
    const before = mod.tutorNotes
    // Expanded pattern list — covers known paraphrases of recall/memory-drill framing.
    // When a new variant surfaces in production, add it here.
    mod.tutorNotes = mod.tutorNotes
      .replace(/from\s+memory/gi, 'by completing the stem')
      .replace(/recall\s+(?:the\s+)?(?:phrase|stem|expression)/gi, 'complete the stem')
      .replace(/test\s+(?:their|his|her|student(?:'s)?)\s+recall/gi, 'practise with the stem')
      .replace(/produce\s+(?:the\s+)?(?:phrase|expression)\s+(?:from|without)\s+(?:memory|looking|notes)/gi, 'complete the stem')
      .replace(/without\s+looking\s+at\s+(?:the\s+)?(?:phrase|text|notes)/gi, 'using the stem as a prompt')
      .replace(/ask\s+(?:your\s+)?student\s+to\s+(?:recall|remember)\s+(?:the\s+)?(?:phrase|expression)/gi,
        'say the stem aloud and ask your student to complete the phrase')
    if (mod.tutorNotes !== before) {
      warnings.push(`Auto-fixed memory-drill framing in tutorNotes of "${mod.title}"`)
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
  // The UI renders: "Write approximately {wordCount}." — strip any "approximately" or "write"
  // prefix the AI may have added to prevent "Write approximately approximately N words."
  const before = content.wordCount
  let wc = before.trim()
    .replace(/^write\s+/i, '')
    .replace(/^approximately\s+/i, '')
    .replace(/[.…]+$/, '')
    .trim()
  if (!/\d+\s*words/i.test(wc)) {
    wc = wc + ' words'
  }
  if (wc !== before) {
    warnings.push(`Auto-fixed wordCount: "${before}" → "${wc}"`)
    content.wordCount = wc
  }
}

// ─── Structural count checks ─────────────────────────────────────────────────

function checkVocabularyMatchStructure(mod: LessonModule, hardViolations: string[]): void {
  const content = mod.content as VocabularyMatchContent
  if (!content?.groups) return  // flat `pairs` format — skip (backward compat)
  if (content.groups.length !== 2) {
    hardViolations.push(
      `vocabulary-match (module: vocabulary-match) must have exactly 2 groups, found ${content.groups.length}. ` +
      `Restructure into exactly 2 groups of 5 pairs each.`
    )
    return
  }
  for (let i = 0; i < content.groups.length; i++) {
    const g = content.groups[i]
    const count = g.pairs?.length ?? 0
    if (count !== 5) {
      hardViolations.push(
        `vocabulary-match group ${i + 1} ("${g.label}") must have exactly 5 pairs, found ${count}. ` +
        `Add or remove pairs to reach exactly 5.`
      )
    }
  }
}

function checkDialogueTurnCount(mod: LessonModule, hardViolations: string[]): void {
  const content = mod.content as DialogueContent
  if (!content?.dialogue) return
  const count = content.dialogue.length
  if (count < 8 || count > 12) {
    hardViolations.push(
      `dialogue (module: dialogue) has ${count} turns — spec requires 8-12. ` +
      `${count < 8 ? `Add ${8 - count} more turns to reach the minimum.` : `Remove ${count - 12} turns to reach the maximum.`}`
    )
  }
}

function checkUsefulLanguagePhrases(mod: LessonModule, hardViolations: string[]): void {
  const content = mod.content as UsefulLanguageContent
  if (!content?.phrases) return
  const count = content.phrases.length
  if (count < 4 || count > 6) {
    hardViolations.push(
      `useful-language (module: "${mod.title}") has ${count} phrases — spec requires 4-6. ` +
      `${count < 4 ? `Add ${4 - count} more phrases.` : `Remove ${count - 6} phrases.`}`
    )
  }
  const singleWord = content.phrases.filter(p => p.phrase.trim().split(/\s+/).length < 2)
  if (singleWord.length > 0) {
    hardViolations.push(
      `useful-language (module: "${mod.title}") contains single-word entries: ${singleWord.map(p => `"${p.phrase}"`).join(', ')}. ` +
      `Every entry must be a multi-word functional phrase (minimum 2 words). Replace with phrase-length entries.`
    )
  }
}

function checkMatchingQACount(mod: LessonModule, hardViolations: string[]): void {
  const content = mod.content as MatchingQAContent
  if (!content?.pairs) {
    hardViolations.push(`matching-qa (module: "${mod.title}") has no pairs array`)
    return
  }
  const count = content.pairs.length
  if (count < 4 || count > 6) {
    hardViolations.push(
      `matching-qa (module: "${mod.title}") has ${count} Q&A pairs — spec requires 4-6. ` +
      `${count < 4 ? `Add ${4 - count} more comprehension questions.` : `Remove ${count - 6} pairs.`}`
    )
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

/** Check required fields are present on each module */
function checkRequiredModuleFields(lesson: ModularLessonContent, hardViolations: string[]): void {
  for (const mod of lesson.modules) {
    if (!mod.type) { hardViolations.push(`Module missing required field: type`); continue }
    if (!mod.title) hardViolations.push(`Module "${mod.type}" missing required field: title`)
    if (mod.timeMinutes == null) hardViolations.push(`Module "${mod.type}" missing required field: timeMinutes`)
    if (!mod.content) { hardViolations.push(`Module "${mod.type}" has no content object`); continue }

    // Per-type content checks
    switch (mod.type) {
      case 'useful-language': {
        const c = mod.content as UsefulLanguageContent
        if (!c.phrases || c.phrases.length === 0)
          hardViolations.push(`useful-language module has no phrases`)
        break
      }
      case 'dialogue': {
        const c = mod.content as DialogueContent
        if (!c.dialogue || c.dialogue.length === 0)
          hardViolations.push(`dialogue module has no dialogue lines`)
        break
      }
      case 'warm-up': {
        const c = mod.content as WarmUpContent
        if (!c.questions || c.questions.length === 0)
          hardViolations.push(`warm-up module has no questions`)
        break
      }
    }
  }
}

/** Roleplay phrase-fit: deterministic pattern match — promoted to hard */
function checkRoleplayPhraseFit(mod: LessonModule, lesson: ModularLessonContent, hardViolations: string[]): void {
  const content = mod.content as RoleplayContent
  if (!content?.situation) return
  const situationLower = content.situation.toLowerCase()
  const phrases = Array.isArray(content.phrasesToUse) ? content.phrasesToUse : []

  const isFailure = FAILURE_SCENARIO_KEYWORDS.some(kw => situationLower.includes(kw))
  for (const phrase of phrases) {
    if (isFailure && SUCCESS_PHRASES.some(sp => phrase.toLowerCase().includes(sp))) {
      hardViolations.push(
        `Roleplay (module: roleplay): phrase "${phrase}" signals success/achievement but the scenario is about a failure/problem. ` +
        `Remove this phrase from phrasesToUse and replace with one that fits a problem-resolution context.`
      )
    }
  }

  const isAdversarial = ADVERSARIAL_SCENARIO_KEYWORDS.some(kw => situationLower.includes(kw))
  for (const phrase of phrases) {
    if (isAdversarial && RAPPORT_PHRASES.some(rp => phrase.toLowerCase().includes(rp))) {
      hardViolations.push(
        `Roleplay (module: roleplay): phrase "${phrase}" expresses warmth/rapport but the scenario is adversarial/confrontational. ` +
        `This phrase will sound sarcastic or inappropriate. Replace it with a phrase that fits a tense scenario.`
      )
    }
  }

  const isRapportLesson = /rapport|relationship|network|connect|build.*trust/i.test(lesson.title ?? '')
  if (isRapportLesson && isAdversarial) {
    hardViolations.push(
      `Lesson coherence (module: roleplay): lesson is titled "${lesson.title}" (rapport-building) but the roleplay scenario is adversarial. ` +
      `Rewrite the roleplay so the student practises building or maintaining rapport, not surviving a confrontation.`
    )
  }
}

// ─── Soft warnings ───────────────────────────────────────────────────────────

function checkWarmUpQuestions(mod: LessonModule, hardViolations: string[]): void {
  const content = mod.content as WarmUpContent
  if (!content?.questions) return
  const banned: string[] = []
  for (const q of content.questions) {
    for (const pattern of BANNED_WARMUP_PATTERNS) {
      if (pattern.test(q)) {
        banned.push(`"${q.slice(0, 100)}"`)
        break
      }
    }
  }
  if (banned.length > 0) {
    hardViolations.push(
      `Warm-up (module: warm-up) contains ${banned.length} question(s) that violate the 20-second-answerability rule or fall into a banned pattern: ` +
      `${banned.join('; ')}. ` +
      `Rewrite each flagged question to be personal, concrete, and answerable in 20 seconds without lesson target language.`
    )
  }
}

function checkDiscussionQuestions(mod: LessonModule, hardViolations: string[]): void {
  const content = mod.content as DiscussionContent | FurtherDiscussionContent
  if (!content?.questions) return
  const banned: string[] = []
  for (const q of content.questions) {
    for (const pattern of BANNED_DISCUSSION_PATTERNS) {
      if (pattern.test(q)) {
        banned.push(`"${q.slice(0, 100)}"`)
        break
      }
    }
  }
  if (banned.length > 0) {
    hardViolations.push(
      `Discussion (module: ${mod.type}) contains ${banned.length} question(s) violating the spec prohibition on abstract synthesis and cross-cultural questions: ` +
      `${banned.join('; ')}. ` +
      `Replace each with a personal-experience question: "Tell me about a time you..." or "Have you ever had to..."`)
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

// (roleplay checks promoted to hard — see checkRoleplayPhraseFit above)

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
  fixUnfilledNamePlaceholders(modularLesson, warnings)
  for (const mod of modularLesson.modules) {
    switch (mod.type) {
      case 'useful-language': fixUsefulLanguageModule(mod, warnings); break
      case 'homework-writing': fixHomeworkModule(mod, warnings); break
    }
  }

  // Hard checks
  checkRequiredModuleFields(modularLesson, hardViolations)
  checkTemplatePlaceholders(modularLesson, hardViolations)
  checkPhraseCoverage(modularLesson, hardViolations)

  // Per-module checks (hard violations + soft warnings)
  for (const mod of modularLesson.modules) {
    switch (mod.type) {
      case 'warm-up':
        checkWarmUpQuestions(mod, hardViolations)
        break
      case 'discussion':
      case 'further-discussion':
        checkDiscussionQuestions(mod, hardViolations)
        break
      case 'dialogue':
        checkDialogueTurnCount(mod, hardViolations)
        warnDialoguePhraseStacking(mod, modularLesson, warnings)
        break
      case 'roleplay':
        checkRoleplayPhraseFit(mod, modularLesson, hardViolations)
        break
      case 'vocabulary-match':
        checkVocabularyMatchStructure(mod, hardViolations)
        break
      case 'useful-language':
        checkUsefulLanguagePhrases(mod, hardViolations)
        break
      case 'matching-qa':
        checkMatchingQACount(mod, hardViolations)
        break
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
