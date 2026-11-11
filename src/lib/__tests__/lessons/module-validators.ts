// Per-module shape and content-quality validators.
// Each function receives a module's content and throws (via expect()) on violations.
// Import in test files and call after generation.

import { expect } from 'vitest'

// ─── Global quality checks ───────────────────────────────────────────────────

export const BANNED_WORDS = ['resonate', 'navigate', 'landscape', 'leverage', 'dynamics', 'paradigm']

export function assertNoEmDash(content: unknown, label: string) {
  const str = JSON.stringify(content)
  expect(str, `${label}: em dash found`).not.toContain('—')
}

export function assertNoBannedWords(content: unknown, label: string) {
  const str = JSON.stringify(content).toLowerCase()
  for (const word of BANNED_WORDS) {
    expect(str, `${label}: banned word "${word}" found`).not.toMatch(new RegExp(`\\b${word}\\b`))
  }
}

function quality(content: unknown, label: string) {
  assertNoEmDash(content, label)
  assertNoBannedWords(content, label)
}

// ─── Module type guards ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>

// ─── Per-module validators ────────────────────────────────────────────────────

export function validateWarmUp(content: AnyObj) {
  const label = 'warm-up'
  expect(Array.isArray(content.questions), `${label}: questions must be array`).toBe(true)
  expect(content.questions.length, `${label}: need 3-4 questions`).toBeGreaterThanOrEqual(3)
  expect(content.questions.length, `${label}: max 4 questions`).toBeLessThanOrEqual(4)
  for (const q of content.questions) {
    expect(typeof q, `${label}: question must be string`).toBe('string')
    expect(q.length, `${label}: question too short`).toBeGreaterThan(15)
  }
  quality(content, label)
}

export function validateVocabularyCards(content: AnyObj) {
  const label = 'vocabulary-cards'
  expect(Array.isArray(content.vocabulary), `${label}: vocabulary must be array`).toBe(true)
  expect(content.vocabulary.length, `${label}: need exactly 6 words`).toBe(6)
  for (const v of content.vocabulary) {
    expect(typeof v.word, `${label}: word must be string`).toBe('string')
    expect(v.word.trim().split(/\s+/).length, `${label}: "${v.word}" must be single word`).toBe(1)
    expect(typeof v.definition, `${label}: definition must be string`).toBe('string')
    expect(typeof v.phonetics, `${label}: phonetics must be string`).toBe('string')
    expect(typeof v.example, `${label}: example must be string`).toBe('string')
  }
  quality(content, label)
}

export function validateVocabularyMatch(content: AnyObj) {
  const label = 'vocabulary-match'
  expect(Array.isArray(content.groups), `${label}: groups must be array`).toBe(true)
  expect(content.groups.length, `${label}: need exactly 2 groups`).toBe(2)
  for (const g of content.groups) {
    expect(Array.isArray(g.pairs), `${label}: pairs must be array`).toBe(true)
    expect(g.pairs.length, `${label}: each group needs 5 pairs`).toBe(5)
    for (const p of g.pairs) {
      expect(typeof p.sentence, `${label}: pair.sentence must be string`).toBe('string')
      expect(p.sentence.length, `${label}: sentence too short`).toBeGreaterThan(10)
      expect(typeof p.term, `${label}: pair.term must be string`).toBe('string')
      expect(typeof p.definition, `${label}: pair.definition must be string`).toBe('string')
    }
  }
  quality(content, label)
}

export function validateUsefulLanguage(content: AnyObj) {
  const label = 'useful-language'
  expect(Array.isArray(content.phrases), `${label}: phrases must be array`).toBe(true)
  expect(content.phrases.length, `${label}: need 4-6 phrases`).toBeGreaterThanOrEqual(4)
  expect(content.phrases.length, `${label}: max 6 phrases`).toBeLessThanOrEqual(6)
  for (const p of content.phrases) {
    expect(typeof p.phrase, `${label}: phrase must be string`).toBe('string')
    expect(p.phrase.trim().split(/\s+/).length, `${label}: phrase "${p.phrase}" must be multi-word`).toBeGreaterThanOrEqual(2)
    expect(typeof p.stem, `${label}: stem must be string`).toBe('string')
    expect(typeof p.example, `${label}: example must be string`).toBe('string')
  }
  quality(content, label)
}

export function validateUsefulExpressions(content: AnyObj) {
  const label = 'useful-expressions'
  expect(Array.isArray(content.expressions), `${label}: expressions must be array`).toBe(true)
  expect(content.expressions.length, `${label}: need 6-10 expressions`).toBeGreaterThanOrEqual(6)
  expect(content.expressions.length, `${label}: max 10 expressions`).toBeLessThanOrEqual(10)
  for (const ex of content.expressions) {
    expect(typeof ex.full, `${label}: full must be string`).toBe('string')
    // {full, blank} shape (since Jul 2026): blank is the idiom substring hidden inside full
    expect(typeof ex.blank, `${label}: blank must be string`).toBe('string')
    expect(ex.full.includes(ex.blank), `${label}: blank "${ex.blank}" must appear in "${ex.full}"`).toBe(true)
    expect(ex.blank.trim().split(/\s+/).length, `${label}: expression "${ex.blank}" must be multi-word`).toBeGreaterThanOrEqual(2)
  }
  quality(content, label)
}

export function validateLanguageInContext(content: AnyObj) {
  const label = 'language-in-context'
  expect(Array.isArray(content.phrases), `${label}: phrases must be array`).toBe(true)
  expect(content.phrases.length, `${label}: need 4-6 phrases`).toBeGreaterThanOrEqual(4)
  expect(content.phrases.length, `${label}: max 6 phrases`).toBeLessThanOrEqual(6)
  for (const p of content.phrases) {
    expect(typeof p.phrase, `${label}: phrase must be string`).toBe('string')
    expect(p.phrase.trim().split(/\s+/).length, `${label}: phrase "${p.phrase}" must be multi-word`).toBeGreaterThanOrEqual(2)
    expect(typeof p.function, `${label}: function must be string`).toBe('string')
    // 'analysis' key is banned — only 'function' should be present
    expect((p as AnyObj).analysis, `${label}: banned 'analysis' key found`).toBeUndefined()
  }
  quality(content, label)
}

export function validatePhrasalVerbs(content: AnyObj) {
  const label = 'phrasal-verbs'
  expect(Array.isArray(content.pairs), `${label}: pairs must be array`).toBe(true)
  expect(content.pairs.length, `${label}: need 6-8 phrasal verbs`).toBeGreaterThanOrEqual(6)
  expect(content.pairs.length, `${label}: max 8 phrasal verbs`).toBeLessThanOrEqual(8)
  for (const p of content.pairs) {
    expect(typeof p.verb, `${label}: verb must be string`).toBe('string')
    expect(typeof p.meaning, `${label}: meaning must be string`).toBe('string')
  }
  quality(content, label)
}

export function validateGapFill(content: AnyObj) {
  const label = 'gap-fill'
  expect(Array.isArray(content.sentences), `${label}: sentences must be array`).toBe(true)
  expect(content.sentences.length, `${label}: need 6-10 sentences`).toBeGreaterThanOrEqual(6)
  expect(content.sentences.length, `${label}: max 10 sentences`).toBeLessThanOrEqual(10)
  for (const s of content.sentences) {
    expect(typeof s.sentence, `${label}: sentence must be string`).toBe('string')
    expect(s.sentence, `${label}: sentence must contain blank ___`).toContain('___')
    expect(typeof s.answer, `${label}: answer must be string`).toBe('string')
    // Answer must NOT appear literally in the sentence (answer leaking)
    expect(s.sentence.toLowerCase(), `${label}: answer "${s.answer}" leaked into sentence`).not.toContain(s.answer.toLowerCase())
  }
  quality(content, label)
}

export function validateFindTheMistake(content: AnyObj) {
  const label = 'find-the-mistake'
  expect(Array.isArray(content.sentences), `${label}: sentences must be array`).toBe(true)
  expect(content.sentences.length, `${label}: need exactly 10 sentences`).toBe(10)
  for (const s of content.sentences) {
    expect(typeof s.incorrect, `${label}: incorrect must be string`).toBe('string')
    expect(s.incorrect.length, `${label}: incorrect sentence too short`).toBeGreaterThan(10)
    expect(typeof s.correct, `${label}: correct must be string`).toBe('string')
    expect(s.correct.length, `${label}: correct sentence too short`).toBeGreaterThan(10)
  }
  quality(content, label)
}

export function validateOrdering(content: AnyObj) {
  const label = 'ordering'
  expect(Array.isArray(content.sentences), `${label}: sentences must be array`).toBe(true)
  expect(content.sentences.length, `${label}: need 5-8 items`).toBeGreaterThanOrEqual(5)
  expect(content.sentences.length, `${label}: max 8 items`).toBeLessThanOrEqual(8)
  for (const s of content.sentences) {
    expect(typeof s.scrambled, `${label}: scrambled must be string`).toBe('string')
    expect(typeof s.correct, `${label}: correct must be string`).toBe('string')
  }
  quality(content, label)
}

export function validateSentenceCorrection(content: AnyObj) {
  const label = 'sentence-correction'
  expect(Array.isArray(content.sentences), `${label}: sentences must be array`).toBe(true)
  expect(content.sentences.length, `${label}: need 8-10 sentences`).toBeGreaterThanOrEqual(8)
  expect(content.sentences.length, `${label}: max 10 sentences`).toBeLessThanOrEqual(10)
  for (const s of content.sentences) {
    expect(typeof s.incorrect, `${label}: incorrect must be string`).toBe('string')
    expect(typeof s.correct, `${label}: correct must be string`).toBe('string')
    expect(typeof s.errorType, `${label}: errorType must be string`).toBe('string')
  }
  quality(content, label)
}

export function validateGrammarFocus(content: AnyObj) {
  const label = 'grammar-focus'
  expect(typeof content.topic, `${label}: topic must be string`).toBe('string')
  expect(typeof content.explanation, `${label}: explanation must be string`).toBe('string')
  expect(Array.isArray(content.examples), `${label}: examples must be array`).toBe(true)
  expect(content.examples.length, `${label}: need 3-5 examples`).toBeGreaterThanOrEqual(3)
  for (const ex of content.examples) {
    // examples must be {label, sentence} objects NOT strings
    expect(typeof ex, `${label}: example must be object not string`).toBe('object')
    expect(typeof ex.label, `${label}: example.label must be string`).toBe('string')
    expect(typeof ex.sentence, `${label}: example.sentence must be string`).toBe('string')
  }
  expect(content.practice?.questions, `${label}: practice.questions must exist`).toBeDefined()
  expect(Array.isArray(content.practice.questions), `${label}: practice.questions must be array`).toBe(true)
  expect(content.practice.questions.length, `${label}: need 4-6 practice questions`).toBeGreaterThanOrEqual(4)
  for (const q of content.practice.questions) {
    expect(typeof q.stem, `${label}: q.stem must be string`).toBe('string')
    expect(Array.isArray(q.options), `${label}: q.options must be array`).toBe(true)
    expect(q.options.length, `${label}: q.options must have 4 items`).toBe(4)
    expect(typeof q.answer, `${label}: q.answer must be number`).toBe('number')
    expect(q.answer, `${label}: answer must be 0-3`).toBeGreaterThanOrEqual(0)
    expect(q.answer, `${label}: answer must be 0-3`).toBeLessThanOrEqual(3)
  }
  quality(content, label)
}

export function validateDialogue(content: AnyObj) {
  const label = 'dialogue'
  expect(typeof content.setting, `${label}: setting must be string`).toBe('string')
  expect(Array.isArray(content.characters), `${label}: characters must be array`).toBe(true)
  expect(content.characters.length, `${label}: need 2 characters`).toBeGreaterThanOrEqual(2)
  expect(Array.isArray(content.dialogue), `${label}: dialogue must be array`).toBe(true)
  expect(content.dialogue.length, `${label}: need 8-12 turns`).toBeGreaterThanOrEqual(8)
  expect(content.dialogue.length, `${label}: max 12 turns`).toBeLessThanOrEqual(12)
  for (const turn of content.dialogue) {
    expect(typeof turn.character, `${label}: turn.character must be string`).toBe('string')
    expect(typeof turn.text, `${label}: turn.text must be string`).toBe('string')
    expect(turn.text.length, `${label}: turn text too short`).toBeGreaterThan(5)
    // No bracket placeholders
    expect(turn.text, `${label}: bracket placeholder in dialogue`).not.toMatch(/\[.*?\]/)
  }
  quality(content, label)
}

export function validateReadingArticle(content: AnyObj) {
  const label = 'reading-article'
  expect(typeof content.title, `${label}: title must be string`).toBe('string')
  expect(typeof content.text, `${label}: text must be string`).toBe('string')
  expect(content.text.length, `${label}: text must be at least 300 chars`).toBeGreaterThanOrEqual(300)
  // Must have paragraph breaks
  expect(content.text, `${label}: text must have paragraph breaks`).toContain('\n\n')
  quality(content, label)
}

export function validateReadingScan(content: AnyObj) {
  const label = 'reading-scan'
  expect(Array.isArray(content.questions), `${label}: questions must be array`).toBe(true)
  expect(content.questions.length, `${label}: need 4-8 questions`).toBeGreaterThanOrEqual(4)
  expect(content.questions.length, `${label}: max 8 questions`).toBeLessThanOrEqual(8)
  for (const q of content.questions) {
    expect(typeof q.question, `${label}: question must be string`).toBe('string')
    expect(typeof q.answer, `${label}: answer must be string`).toBe('string')
  }
  quality(content, label)
}

export function validateVocabularyInText(content: AnyObj) {
  const label = 'vocabulary-in-text'
  expect(Array.isArray(content.items), `${label}: items must be array`).toBe(true)
  expect(content.items.length, `${label}: need 8-10 items`).toBeGreaterThanOrEqual(8)
  expect(content.items.length, `${label}: max 10 items`).toBeLessThanOrEqual(10)
  for (const item of content.items) {
    expect(typeof item.definition, `${label}: definition must be string`).toBe('string')
    expect(typeof item.answer, `${label}: answer must be string`).toBe('string')
    expect(typeof item.paragraph, `${label}: paragraph must be number`).toBe('number')
  }
  quality(content, label)
}

export function validateSkimMainIdea(content: AnyObj) {
  const label = 'skim-main-idea'
  expect(Array.isArray(content.options), `${label}: options must be array`).toBe(true)
  expect(content.options.length, `${label}: need exactly 4 options`).toBe(4)
  expect(typeof content.answer, `${label}: answer must be number`).toBe('number')
  expect(content.answer, `${label}: answer must be 0-3`).toBeGreaterThanOrEqual(0)
  expect(content.answer, `${label}: answer must be 0-3`).toBeLessThanOrEqual(3)
  quality(content, label)
}

export function validateMatchingQA(content: AnyObj) {
  const label = 'matching-qa'
  expect(Array.isArray(content.pairs), `${label}: pairs must be array`).toBe(true)
  expect(content.pairs.length, `${label}: need 4-6 pairs`).toBeGreaterThanOrEqual(4)
  expect(content.pairs.length, `${label}: max 6 pairs`).toBeLessThanOrEqual(6)
  for (const p of content.pairs) {
    expect(typeof p.question, `${label}: question must be string`).toBe('string')
    expect(typeof p.answer, `${label}: answer must be string`).toBe('string')
    expect(p.answer.length, `${label}: answer too short`).toBeGreaterThan(15)
  }
  quality(content, label)
}

export function validateListeningTrueFalse(content: AnyObj) {
  const label = 'listening-true-false'
  expect(Array.isArray(content.questions), `${label}: questions must be array`).toBe(true)
  expect(content.questions.length, `${label}: need 6-8 questions`).toBeGreaterThanOrEqual(6)
  expect(content.questions.length, `${label}: max 8 questions`).toBeLessThanOrEqual(8)
  for (const q of content.questions) {
    expect(typeof q.statement, `${label}: statement must be string`).toBe('string')
    expect(typeof q.answer, `${label}: answer must be boolean`).toBe('boolean')
  }
  quality(content, label)
}

export function validateListeningMCQ(content: AnyObj) {
  const label = 'listening-mcq'
  expect(Array.isArray(content.questions), `${label}: questions must be array`).toBe(true)
  expect(content.questions.length, `${label}: need 4-6 questions`).toBeGreaterThanOrEqual(4)
  expect(content.questions.length, `${label}: max 6 questions`).toBeLessThanOrEqual(6)
  for (const q of content.questions) {
    expect(typeof q.question, `${label}: question must be string`).toBe('string')
    expect(Array.isArray(q.options), `${label}: options must be array`).toBe(true)
    expect(q.options.length, `${label}: need 4 options`).toBe(4)
    expect(typeof q.answer, `${label}: answer must be number`).toBe('number')
  }
  quality(content, label)
}

export function validateRoleplay(content: AnyObj) {
  const label = 'roleplay'
  expect(typeof content.situation, `${label}: situation must be string`).toBe('string')
  expect(content.situation.length, `${label}: situation too short`).toBeGreaterThan(20)
  expect(Array.isArray(content.roles), `${label}: roles must be array`).toBe(true)
  expect(content.roles.length, `${label}: need exactly 2 roles`).toBe(2)
  for (const r of content.roles) {
    expect(typeof r.name, `${label}: role name must be string`).toBe('string')
    expect(typeof r.description, `${label}: role description must be string`).toBe('string')
    // roles must be objects not strings
    expect(typeof r, `${label}: role must be object`).toBe('object')
  }
  quality(content, label)
}

export function validateTalkingPoint(content: AnyObj) {
  const label = 'talking-point'
  expect(content.studentA, `${label}: studentA must exist`).toBeDefined()
  expect(content.studentB, `${label}: studentB must exist`).toBeDefined()
  expect(typeof content.studentA.title, `${label}: studentA.title must be string`).toBe('string')
  expect(typeof content.studentB.title, `${label}: studentB.title must be string`).toBe('string')
  expect(Array.isArray(content.studentA.questions), `${label}: studentA.questions must be array`).toBe(true)
  expect(Array.isArray(content.studentB.questions), `${label}: studentB.questions must be array`).toBe(true)
  expect(content.studentA.questions.length, `${label}: studentA needs 3-4 questions`).toBeGreaterThanOrEqual(3)
  expect(content.studentB.questions.length, `${label}: studentB needs 3-4 questions`).toBeGreaterThanOrEqual(3)
  quality(content, label)
}

export function validateDiscussion(content: AnyObj) {
  const label = 'discussion'
  expect(Array.isArray(content.questions), `${label}: questions must be array`).toBe(true)
  expect(content.questions.length, `${label}: need 4-6 questions`).toBeGreaterThanOrEqual(4)
  expect(content.questions.length, `${label}: max 6 questions`).toBeLessThanOrEqual(6)
  for (const q of content.questions) {
    expect(typeof q, `${label}: question must be string`).toBe('string')
    expect(q.length, `${label}: question too short`).toBeGreaterThan(15)
  }
  quality(content, label)
}

export function validateDebate(content: AnyObj) {
  const label = 'debate'
  expect(typeof content.topic, `${label}: topic must be string`).toBe('string')
  expect(content.sideA, `${label}: sideA must exist`).toBeDefined()
  expect(content.sideB, `${label}: sideB must exist`).toBeDefined()
  expect(typeof content.sideA.label, `${label}: sideA.label must be string`).toBe('string')
  expect(typeof content.sideB.label, `${label}: sideB.label must be string`).toBe('string')
  expect(Array.isArray(content.sideA.points), `${label}: sideA.points must be array`).toBe(true)
  expect(Array.isArray(content.sideB.points), `${label}: sideB.points must be array`).toBe(true)
  expect(content.sideA.points.length, `${label}: sideA needs 3-5 points`).toBeGreaterThanOrEqual(3)
  expect(content.sideB.points.length, `${label}: sideB needs 3-5 points`).toBeGreaterThanOrEqual(3)
  quality(content, label)
}

export function validateHomeworkWriting(content: AnyObj) {
  const label = 'homework-writing'
  expect(typeof content.task, `${label}: task must be string`).toBe('string')
  expect(content.task.length, `${label}: task too short`).toBeGreaterThan(20)
  expect(Array.isArray(content.prompts), `${label}: prompts must be array`).toBe(true)
  expect(content.prompts.length, `${label}: need 3-5 prompts`).toBeGreaterThanOrEqual(3)
  expect(content.prompts.length, `${label}: max 5 prompts`).toBeLessThanOrEqual(5)
  // wordCount must include the word "words" (not just a number)
  if (content.wordCount) {
    expect(String(content.wordCount).toLowerCase(), `${label}: wordCount must include "words"`).toContain('words')
  }
  quality(content, label)
}

export function validateWritingTask(content: AnyObj) {
  const label = 'writing-task'
  expect(typeof content.brief, `${label}: brief must be string`).toBe('string')
  expect(content.brief.length, `${label}: brief too short`).toBeGreaterThan(30)
  if (content.planningNotes) {
    expect(Array.isArray(content.planningNotes), `${label}: planningNotes must be array`).toBe(true)
    expect(content.planningNotes.length, `${label}: planningNotes need 3-5 items`).toBeGreaterThanOrEqual(3)
  }
  if (content.wordCount) {
    expect(String(content.wordCount).toLowerCase(), `${label}: wordCount must include "words"`).toContain('words')
  }
  quality(content, label)
}

export function validateRegisterUpgrade(content: AnyObj) {
  const label = 'register-upgrade'
  expect(Array.isArray(content.items), `${label}: items must be array`).toBe(true)
  expect(content.items.length, `${label}: need 5-6 items`).toBeGreaterThanOrEqual(5)
  expect(content.items.length, `${label}: max 6 items`).toBeLessThanOrEqual(6)
  for (const it of content.items) {
    expect(typeof it.basic, `${label}: basic must be string`).toBe('string')
    expect(typeof it.upgraded, `${label}: upgraded must be string`).toBe('string')
    expect(it.upgraded.trim().toLowerCase(), `${label}: upgraded must differ from basic`).not.toBe(it.basic.trim().toLowerCase())
  }
  quality(content, label)
}

// ─── Dispatcher: validate any module by type ─────────────────────────────────

const VALIDATORS: Record<string, (content: AnyObj) => void> = {
  'warm-up': validateWarmUp,
  'vocabulary-cards': validateVocabularyCards,
  'vocabulary-match': validateVocabularyMatch,
  'useful-language': validateUsefulLanguage,
  'useful-expressions': validateUsefulExpressions,
  'language-in-context': validateLanguageInContext,
  'phrasal-verbs': validatePhrasalVerbs,
  'gap-fill': validateGapFill,
  'find-the-mistake': validateFindTheMistake,
  'ordering': validateOrdering,
  'sentence-correction': validateSentenceCorrection,
  'grammar-focus': validateGrammarFocus,
  'register-upgrade': validateRegisterUpgrade,
  'dialogue': validateDialogue,
  'reading-article': validateReadingArticle,
  'reading-scan': validateReadingScan,
  'vocabulary-in-text': validateVocabularyInText,
  'skim-main-idea': validateSkimMainIdea,
  'matching-qa': validateMatchingQA,
  'listening-true-false': validateListeningTrueFalse,
  'listening-mcq': validateListeningMCQ,
  'roleplay': validateRoleplay,
  'talking-point': validateTalkingPoint,
  'discussion': validateDiscussion,
  'debate': validateDebate,
  'homework-writing': validateHomeworkWriting,
  'writing-task': validateWritingTask,
}

export function validateModule(type: string, content: AnyObj) {
  const validator = VALIDATORS[type]
  if (!validator) {
    throw new Error(`No validator registered for module type: "${type}"`)
  }
  validator(content)
}
