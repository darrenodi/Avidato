/**
 * Post-generation validator for modular lessons.
 * Catches mechanical spec violations that the AI routinely ignores.
 * Fixes what can be fixed automatically; warns on semantic issues.
 */

import type { ModularLessonContent, LessonModule, UsefulLanguageContent, WarmUpContent, DiscussionContent, FurtherDiscussionContent, RoleplayContent, DialogueContent, HomeworkWritingContent } from '../../types/module-lesson'

// ─── Pattern lists ─────────────────────────────────────────────────────────

const BANNED_WARMUP_PATTERNS = [
  // Generic social filler — belongs in dialogue small talk, not warm-up
  /how\s+was\s+your\s+commute/i,
  /how\s+was\s+(?:your\s+)?(?:the\s+)?(?:weekend|commute|journey|drive|trip\s+in)/i,
  /did\s+you\s+(?:manage\s+to\s+get|get)\s+(?:any\s+)?(?:time\s+off|a\s+break|some\s+rest)/i,
  /did\s+you\s+(?:catch|watch|see)\s+the\s+(?:game|match|show|episode)/i,
  // Abstract synthesis / "considering X's global nature"
  /considering\s+the\s+\w+(?:'s)?\s+(?:global|international|complex|dynamic)/i,
  /in\s+(?:today's|the\s+modern)\s+(?:globalized|interconnected|complex)/i,
  // "What's one key lesson" — synthesis question
  /what(?:'s|\s+is)\s+one\s+key\s+(?:lesson|takeaway|insight)/i,
  // Presupposing unlikely events ("If you had to negotiate with a foreign minister...")
  /if\s+you\s+(?:had\s+to|were\s+to)\s+(?:negotiate|address|present\s+to)\s+(?:a\s+)?(?:foreign|international|global|world)/i,
  // Procedural / operational ("Walk me through the process of...")
  /walk\s+(?:me|us)\s+through\s+the\s+(?:process|steps|procedure)/i,
  // Multi-variable abstract synthesis
  /how\s+do\s+(?:you|we|companies)\s+balance\s+.{0,60}\s+with\s+.{0,60}\s+when/i,
]

const BANNED_DISCUSSION_PATTERNS = [
  // McKinsey case-interview style
  /how\s+would\s+you\s+(?:design|structure|build|implement)\s+a\s+(?:system|framework|strategy|process)\s+(?:to|that)/i,
  // Abstract multi-variable balancing
  /how\s+do\s+(?:you|we|companies)\s+balance\s+.{0,60}\s+with\s+.{0,60}\s+when/i,
  // Cross-cultural abstract (various phrasings)
  /considering\s+(?:cross[-\s]cultural|cultural\s+differences|different\s+cultures)/i,
  /especially\s+with\s+international\s+teams?/i,
  /across\s+(?:different\s+)?(?:cultures?|countries|international\s+teams?)/i,
  /in\s+(?:a\s+)?(?:global|multicultural|international)\s+(?:context|environment|setting)/i,
  // "What's the most challenging part" — abstract synthesis
  /what(?:'s|\s+is)\s+the\s+(?:most|biggest|hardest)\s+challenging\s+part\s+of/i,
  /what(?:'s|\s+is)\s+the\s+(?:most|biggest|greatest)\s+challenge\s+(?:in|when|with)/i,
  // "In your opinion, what factors" — too abstract
  /in\s+your\s+opinion,?\s+what\s+(?:factors|aspects|elements)\s+(?:contribute|determine|influence)/i,
]

// Phrases that signal success/achievement — inappropriate in failure/cost-overrun scenarios
const SUCCESS_PHRASES = [
  'hit the target',
  'hit our target',
  'meet the target',
  'on track',
  'ahead of schedule',
  'under budget',
  'exceeded expectations',
  'delivered on time',
]

// Scenario keywords that indicate a failure/problem context
const FAILURE_SCENARIO_KEYWORDS = [
  'over budget',
  'cost overrun',
  'behind schedule',
  'delay',
  'complaint',
  'problem',
  'issue',
  'failed',
  'failure',
  'mistake',
  'error',
  'dispute',
  'conflict',
]

// Rapport/warmth phrases — inappropriate when the roleplay scenario is adversarial
const RAPPORT_PHRASES = [
  'great to collaborate',
  'enjoy working with you',
  'appreciate your perspective',
  'it has been a pleasure',
  'looking forward to working',
  'great working with you',
  'glad we could connect',
]

// Adversarial scenario keywords — a roleplay with these shouldn't use rapport phrases
const ADVERSARIAL_SCENARIO_KEYWORDS = [
  'threaten',
  'report to',
  'escalate',
  'demand',
  'ultimatum',
  'angry',
  'hostile',
  'confront',
  'accuse',
]

// ─── Useful-language fixes ──────────────────────────────────────────────────

function fixUsefulLanguageModule(mod: LessonModule): void {
  const content = mod.content as UsefulLanguageContent
  if (!content?.phrases || !Array.isArray(content.phrases)) return

  // Fix 1: strip "from memory" / "recall from memory" from any instructions
  // (UsefulLanguageContent has no top-level instructions field — violations appear
  //  in tutorNotes or generated practice description embedded in practice sentences)
  if (mod.tutorNotes) {
    const before = mod.tutorNotes
    mod.tutorNotes = mod.tutorNotes
      .replace(/complete\s+(?:the\s+)?(?:phrase|stem)\s+from\s+memory/gi, 'complete the stem')
      .replace(/recall\s+(?:the\s+)?(?:phrase|stem)\s+from\s+memory/gi, 'complete the stem')
      .replace(/from\s+memory/gi, 'by completing the stem')
      .replace(/ask\s+(?:your\s+)?student\s+to\s+complete\s+the\s+(?:phrase|stem)\s+from\s+memory/gi,
               'say the stem aloud and ask your student to complete the phrase')
    if (mod.tutorNotes !== before) {
      console.log(`[validator] Fixed "from memory" in tutorNotes of module: ${mod.title}`)
    }
  }

  // Fix 2: ensure every phrase has a valid stem (min 3 visible words, hides last 1-2 content words)
  for (const phraseItem of content.phrases) {
    const words = phraseItem.phrase.trim().split(/\s+/)
    const needsNewStem = !phraseItem.stem || phraseItem.stem.trim() === '' ||
      // Stem has fewer than 3 visible words (e.g. "push back ....." = 2 words — bad)
      phraseItem.stem.replace(/\.+\s*$/, '').trim().split(/\s+/).length < 3

    if (needsNewStem) {
      const showCount = Math.max(3, words.length - 2)
      phraseItem.stem = words.slice(0, showCount).join(' ') + ' .....'
      console.log(`[validator] Fixed stem for phrase "${phraseItem.phrase}": "${phraseItem.stem}"`)
    }
  }
}

// ─── Homework wordCount format fix ─────────────────────────────────────────

function fixHomeworkModule(mod: LessonModule): void {
  const content = mod.content as HomeworkWritingContent
  if (!content?.wordCount) return
  // Append "words" if missing — catches "approximately 150" → "approximately 150 words"
  if (!/\d+\s*words/i.test(content.wordCount)) {
    const fixed = content.wordCount.trim().replace(/\.+$/, '') + ' words'
    console.log(`[validator] Fixed wordCount: "${content.wordCount}" → "${fixed}"`)
    content.wordCount = fixed
  }
}

// ─── Target phrase coverage in dialogue ────────────────────────────────────

function warnPhraseCoverageInDialogue(lesson: ModularLessonContent): void {
  const usefulLangMod = lesson.modules.find(m => m.type === 'useful-language')
  const dialogueMod = lesson.modules.find(m => m.type === 'dialogue')
  if (!usefulLangMod || !dialogueMod) return

  const ulContent = usefulLangMod.content as UsefulLanguageContent
  const dlContent = dialogueMod.content as DialogueContent
  if (!ulContent?.phrases || !dlContent?.dialogue) return

  const dialogueText = dlContent.dialogue.map(l => l.text.toLowerCase()).join(' ')

  for (const p of ulContent.phrases) {
    const normalized = p.phrase.toLowerCase().replace(/\s*\.+$/, '').trim()
    if (!dialogueText.includes(normalized)) {
      console.warn(`[validator] PHRASE COVERAGE — target phrase "${p.phrase}" does not appear in the dialogue`)
    }
  }
}

// ─── Warm-up warnings ──────────────────────────────────────────────────────

function warnWarmUpModule(mod: LessonModule): void {
  const content = mod.content as WarmUpContent
  if (!content?.questions || !Array.isArray(content.questions)) return

  for (const q of content.questions) {
    for (const pattern of BANNED_WARMUP_PATTERNS) {
      if (pattern.test(q)) {
        console.warn(`[validator] WARM-UP VIOLATION — abstract/banned question pattern in "${mod.title}": "${q}"`)
        break
      }
    }
  }
}

// ─── Discussion warnings ────────────────────────────────────────────────────

function warnDiscussionModule(mod: LessonModule): void {
  const content = mod.content as DiscussionContent | FurtherDiscussionContent
  if (!content?.questions || !Array.isArray(content.questions)) return

  for (const q of content.questions) {
    for (const pattern of BANNED_DISCUSSION_PATTERNS) {
      if (pattern.test(q)) {
        console.warn(`[validator] DISCUSSION VIOLATION — McKinsey/abstract question in "${mod.title}": "${q}"`)
        break
      }
    }
  }
}

// ─── Dialogue phrase-stacking warning ──────────────────────────────────────

function warnDialogueModule(mod: LessonModule, lesson: ModularLessonContent): void {
  const content = mod.content as DialogueContent
  if (!content?.dialogue || !Array.isArray(content.dialogue)) return

  // Collect target phrases from the lesson's useful-language module
  const usefulLangMod = lesson.modules.find(m => m.type === 'useful-language')
  if (!usefulLangMod) return
  const ulContent = usefulLangMod.content as UsefulLanguageContent
  if (!ulContent?.phrases || !Array.isArray(ulContent.phrases)) return

  const targetPhrases = ulContent.phrases.map(p => p.phrase.toLowerCase().replace(/\s+\.+$/, '').trim())
  if (targetPhrases.length === 0) return

  for (const line of content.dialogue) {
    const lineLower = line.text.toLowerCase()
    const matchedPhrases = targetPhrases.filter(tp => lineLower.includes(tp.replace(/\.+$/, '').trim()))
    if (matchedPhrases.length >= 2) {
      console.warn(
        `[validator] DIALOGUE PHRASE-STACKING — ${line.character} uses ${matchedPhrases.length} target phrases in one turn: ${matchedPhrases.map(p => `"${p}"`).join(', ')}`
      )
    }
  }
}

// ─── Roleplay phrase-fit warnings ──────────────────────────────────────────

function warnRoleplayModule(mod: LessonModule, lesson: ModularLessonContent): void {
  const content = mod.content as RoleplayContent
  if (!content?.situation) return

  const situationLower = content.situation.toLowerCase()

  // Check 1: success phrases in failure scenarios
  const isFailureScenario = FAILURE_SCENARIO_KEYWORDS.some(kw => situationLower.includes(kw))
  if (isFailureScenario && Array.isArray(content.phrasesToUse)) {
    for (const phrase of content.phrasesToUse) {
      const phraseLower = phrase.toLowerCase()
      if (SUCCESS_PHRASES.some(sp => phraseLower.includes(sp))) {
        console.warn(`[validator] ROLEPLAY VIOLATION — success phrase "${phrase}" used in failure scenario: "${content.situation.slice(0, 80)}..."`)
      }
    }
  }

  // Check 2: rapport phrases in adversarial scenarios
  const isAdversarialScenario = ADVERSARIAL_SCENARIO_KEYWORDS.some(kw => situationLower.includes(kw))
  if (isAdversarialScenario && Array.isArray(content.phrasesToUse)) {
    for (const phrase of content.phrasesToUse) {
      const phraseLower = phrase.toLowerCase()
      if (RAPPORT_PHRASES.some(rp => phraseLower.includes(rp))) {
        console.warn(`[validator] ROLEPLAY VIOLATION — rapport phrase "${phrase}" used in adversarial scenario: "${content.situation.slice(0, 80)}..."`)
      }
    }
  }

  // Check 3: lesson title/goal vs roleplay tone
  const lessonTitle = lesson.title?.toLowerCase() ?? ''
  const isRapportLesson = /rapport|relationship|network|connect|build.*trust|trust.*build/i.test(lessonTitle)
  if (isRapportLesson && isAdversarialScenario) {
    console.warn(`[validator] LESSON COHERENCE — lesson titled "${lesson.title}" has an adversarial roleplay scenario. Roleplay should reinforce lesson goal, not contradict it.`)
  }
}

// ─── Main entry point ───────────────────────────────────────────────────────

export function enforceModularLessonConstraints(lesson: unknown): unknown {
  if (typeof lesson !== 'object' || lesson === null) return lesson

  const modularLesson = lesson as ModularLessonContent
  if (!Array.isArray(modularLesson.modules)) return lesson

  for (const mod of modularLesson.modules) {
    switch (mod.type) {
      case 'useful-language':
        fixUsefulLanguageModule(mod)
        break
      case 'dialogue':
        warnDialogueModule(mod, modularLesson)
        break
      case 'warm-up':
        warnWarmUpModule(mod)
        break
      case 'discussion':
      case 'further-discussion':
        warnDiscussionModule(mod)
        break
      case 'roleplay':
        warnRoleplayModule(mod, modularLesson)
        break
      case 'homework-writing':
        fixHomeworkModule(mod)
        break
    }
  }

  // Cross-module checks
  warnPhraseCoverageInDialogue(modularLesson)

  return lesson
}
