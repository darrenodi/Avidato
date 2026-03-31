'use client'

import React, { useState } from 'react'
import {
  WarmUpContent, ImageDiscussionContent, VocabularyCardsContent, VocabularyMatchContent,
  UsefulExpressionsContent, UsefulLanguageContent, LanguageInContextContent, PhrasalVerbsContent,
  GapFillContent, CompleteTheSentenceContent, FindTheMistakeContent, OrderingContent,
  FillInBlanksDialogueContent, SentenceCorrectionContent, GrammarFocusContent, DialogueContent,
  ReadingArticleContent, ReadingScanContent, VocabularyInTextContent, ReadingSectionPredictionContent,
  SkimMainIdeaContent, MatchingQAContent, NoticingContent,
  ListeningPredictionsContent, ListeningMainIdeaContent, ListeningTrueFalseContent,
  ListeningMCQContent, ListeningSpecificInfoContent, ListeningTableContent, ListeningComprehensionContent,
  RoleplayContent, TalkingPointContent, DiscussionContent, DebateContent,
  YourTurnAskContent, YourTurnAnswerContent, YourTurnTellContent, HomeworkWritingContent,
} from '@/types/module-lesson'

// ─── Utilities ────────────────────────────────────────────────────────────────

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function TutorNote({ note }: { note: string }) {
  return (
    <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Tutor note</p>
      <p className="text-sm text-amber-800 dark:text-amber-300">{note}</p>
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">{text}</p>
}

function AudioNote() {
  return (
    <div className="mb-4 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
      <span className="text-lg">🎧</span>
      <p className="text-sm text-gray-600 dark:text-gray-300">Audio required — play the recording while students complete this exercise.</p>
    </div>
  )
}

// ─── Warm-up ──────────────────────────────────────────────────────────────────

export function WarmUpModule({ content, isStudentView, tutorNotes }: { content: WarmUpContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      {content.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>}
      {(content.questions || []).map((q, i) => (
        <div key={i} className="flex gap-3 items-start">
          <svg className="flex-shrink-0 w-4 h-4 mt-1 text-brand-primary opacity-60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          <p className="text-gray-900 dark:text-white">{q}</p>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Image Discussion ─────────────────────────────────────────────────────────

export function ImageDiscussionModule({ content, isStudentView, tutorNotes }: { content: ImageDiscussionContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-4">
      {content.imageData ? (
        <img
          src={content.imageData}
          alt={content.imagePlaceholders[0]?.label || 'Discussion image'}
          className="w-full rounded-xl object-cover max-h-72"
        />
      ) : content.imagePlaceholders.length > 0 && (
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">{content.imagePlaceholders[0]?.label}</p>
          {!isStudentView && content.imagePlaceholders[0]?.description && (
            <p className="text-xs text-gray-300 dark:text-gray-600 italic mt-1">{content.imagePlaceholders[0].description}</p>
          )}
        </div>
      )}
      <div className="space-y-3">
        {(content.questions || []).map((q, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="font-bold text-brand-primary flex-shrink-0">{i + 1}.</span>
            <p className="text-gray-900 dark:text-white">{q}</p>
          </div>
        ))}
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Vocabulary Cards ─────────────────────────────────────────────────────────

export function VocabularyCardsModule({ content, isStudentView, tutorNotes }: { content: VocabularyCardsContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-4">
      {(content.vocabulary || []).map((v, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">{v.word}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{v.phonetics}</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex-shrink-0">{v.partOfSpeech}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{v.definition}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">&ldquo;{v.example}&rdquo;</p>
          {v.synonym && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">≈ {v.synonym}</p>}
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Vocabulary Match ─────────────────────────────────────────────────────────

interface NormalizedPair {
  sentence: string
  term: string
  definition: string
}

interface MatchGroup {
  label: string
  pairs: NormalizedPair[]
}

function HighlightedSentence({ sentence, term }: { sentence: string; term: string }) {
  if (!term || !sentence) return <span>{sentence}</span>
  const idx = sentence.toLowerCase().indexOf(term.toLowerCase())
  if (idx === -1) return <span>{sentence}</span>
  return (
    <span>
      {sentence.slice(0, idx)}
      <strong className="font-semibold underline decoration-brand-primary decoration-2 underline-offset-2">
        {sentence.slice(idx, idx + term.length)}
      </strong>
      {sentence.slice(idx + term.length)}
    </span>
  )
}

function VocabMatchGroup({ group, isStudentView }: { group: MatchGroup; isStudentView?: boolean; groupIndex: number }) {
  // assignments[sentenceIdx] = shuffledDefIdx
  const [assignments, setAssignments] = React.useState<Record<number, number>>({})
  const [selectedDef, setSelectedDef] = React.useState<number | null>(null)
  const [checked, setChecked] = React.useState(false)
  const [showAnswers, setShowAnswers] = React.useState(false)

  // Normalize: handle AI field name variants
  const pairs: NormalizedPair[] = (group.pairs || []).map(p => {
    const raw = p as unknown as Record<string, string>
    return {
      sentence: raw.sentence || raw.example || '',
      term: raw.term || raw.word || raw.phrase || raw.key || '',
      definition: raw.definition || raw.meaning || raw.desc || '',
    }
  })

  // Shuffle once on mount — useRef ensures it never re-shuffles on re-render
  const shuffledDefsRef = React.useRef<Array<{ def: string; originalIdx: number }> | null>(null)
  if (shuffledDefsRef.current === null) {
    shuffledDefsRef.current = fisherYates(pairs.map((p, i) => ({ def: p.definition, originalIdx: i })))
  }
  const shuffledDefs = shuffledDefsRef.current

  const usedDefIndices = React.useMemo(() => new Set(Object.values(assignments)), [assignments])
  const allAssigned = pairs.every((_, i) => assignments[i] !== undefined)
  const score = pairs.filter((_, i) => shuffledDefs[assignments[i]]?.originalIdx === i).length

  function handleDefClick(defIdx: number) {
    if (checked || showAnswers) return
    if (usedDefIndices.has(defIdx)) return
    setSelectedDef(prev => prev === defIdx ? null : defIdx)
  }

  function handleSentenceClick(sentIdx: number) {
    if (checked || showAnswers) return
    if (assignments[sentIdx] !== undefined) {
      setAssignments(prev => { const n = { ...prev }; delete n[sentIdx]; return n })
      return
    }
    if (selectedDef === null) return
    setAssignments(prev => ({ ...prev, [sentIdx]: selectedDef }))
    setSelectedDef(null)
  }

  // Tutor view: sentences with answers directly beneath
  if (!isStudentView) {
    return (
      <div className="space-y-3">
        {group.label && <p className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-2">{group.label}</p>}
        {pairs.map((pair, i) => (
          <div key={i} className="flex gap-3 text-sm">
            <span className="text-brand-primary font-bold w-5 flex-shrink-0 mt-0.5">{i + 1}.</span>
            <div>
              <p className="text-gray-900 dark:text-white"><HighlightedSentence sentence={pair.sentence} term={pair.term} /></p>
              <p className="text-green-700 dark:text-green-400 text-xs mt-0.5 italic">{pair.definition}</p>
            </div>
          </div>
        ))}
        {!showAnswers && (
          <button
            onClick={() => setShowAnswers(true)}
            className="mt-2 px-4 py-1.5 text-xs font-medium rounded-lg border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            Show answers
          </button>
        )}
      </div>
    )
  }

  // Student view: two-column — sentences left, lettered definitions right
  const effectiveAssignments = showAnswers
    ? pairs.reduce<Record<number, number>>((acc, _, i) => {
        const correctShuffledIdx = shuffledDefs.findIndex(s => s.originalIdx === i)
        return { ...acc, [i]: correctShuffledIdx }
      }, {})
    : assignments

  return (
    <div className="space-y-4">
      {group.label && <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{group.label}</p>}

      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
        {/* Left column: numbered sentences */}
        <div className="space-y-3">
          {pairs.map((pair, i) => {
            const assignedDefIdx = effectiveAssignments[i]
            const assignedLetter = assignedDefIdx !== undefined ? String.fromCharCode(97 + assignedDefIdx) : null
            const isCorrect = checked && shuffledDefs[assignedDefIdx]?.originalIdx === i
            const isWrong = checked && assignedDefIdx !== undefined && !isCorrect
            return (
              <div key={i} className="flex gap-2 items-start text-sm">
                <span className="text-brand-primary font-bold w-5 flex-shrink-0 mt-0.5">{i + 1}.</span>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white leading-snug">
                    <HighlightedSentence sentence={pair.sentence} term={pair.term} />
                  </p>
                  <button
                    onClick={() => handleSentenceClick(i)}
                    className={`mt-1 px-2.5 py-0.5 text-sm font-bold rounded border-2 min-w-[2.5rem] text-center transition-colors ${
                      showAnswers ? 'border-green-500 text-green-600 dark:text-green-400' :
                      isCorrect ? 'border-green-500 text-green-600 dark:text-green-400' :
                      isWrong ? 'border-red-400 text-red-500' :
                      assignedLetter ? 'border-brand-primary text-brand-primary cursor-pointer' :
                      selectedDef !== null ? 'border-dashed border-brand-primary/60 text-gray-400 cursor-pointer hover:border-brand-primary' :
                      'border-dashed border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    {assignedLetter ?? '—'}
                  </button>
                  {isWrong && (
                    <span className="text-green-600 dark:text-green-400 text-xs ml-2">
                      ✓ {String.fromCharCode(97 + shuffledDefs.findIndex(s => s.originalIdx === i))}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right column: lettered definitions */}
        <div className="space-y-3">
          {shuffledDefs.map((item, i) => {
            const isUsed = usedDefIndices.has(i) || showAnswers
            const isSel = selectedDef === i
            return (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium w-5 flex-shrink-0 mt-0.5">{String.fromCharCode(97 + i)}.</span>
                <button
                  onClick={() => handleDefClick(i)}
                  disabled={isUsed && !isSel}
                  className={`text-left leading-snug transition-colors ${
                    showAnswers ? 'text-gray-500 dark:text-gray-500 cursor-default' :
                    isSel ? 'text-brand-primary font-semibold cursor-pointer' :
                    isUsed ? 'text-gray-300 dark:text-gray-600 line-through cursor-default' :
                    'text-gray-700 dark:text-gray-300 hover:text-brand-primary cursor-pointer'
                  }`}
                >
                  {item.def}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap pt-1">
        {!checked && !showAnswers && (
          <button
            onClick={() => allAssigned && setChecked(true)}
            disabled={!allAssigned}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Check answers
          </button>
        )}
        {checked && (
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${score === pairs.length ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {score === pairs.length ? '✓ All correct!' : `${score} / ${pairs.length} correct`}
            </span>
            <button
              onClick={() => { setAssignments({}); setSelectedDef(null); setChecked(false) }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function VocabularyMatchModule({ content, isStudentView, tutorNotes }: { content: VocabularyMatchContent; isStudentView?: boolean; tutorNotes?: string }) {
  const groups: MatchGroup[] = content.groups?.length
    ? (content.groups as MatchGroup[])
    : [{ label: '', pairs: (content.pairs || []) as NormalizedPair[] }]

  return (
    <div className="space-y-6">
      {content.instructions && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>
      )}
      {groups.map((group, gi) => (
        <VocabMatchGroup key={gi} group={group} isStudentView={isStudentView} groupIndex={gi} />
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Useful Expressions ───────────────────────────────────────────────────────

export function UsefulExpressionsModule({ content, isStudentView, tutorNotes }: { content: UsefulExpressionsContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      {content.context && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.context}</p>}
      {isStudentView
        ? <p className="text-sm text-gray-500 dark:text-gray-400 italic">Complete each expression.</p>
        : <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Read the stem aloud. Ask your student to complete the expression, then use it in their own sentence.</p>
      }
      <div className="space-y-2">
        {(content.expressions || []).map((expr, i) => {
          const full = typeof expr === 'string' ? expr : expr.full
          const stem = typeof expr === 'string'
            ? full.trim().split(/\s+/).slice(0, 4).join(' ') + ' .....'
            : expr.stem
          return (
            <div key={i} className="border-l-2 border-brand-primary pl-3 py-0.5">
              {isStudentView
                ? <p className="text-gray-900 dark:text-white font-medium">{stem}</p>
                : <>
                    <p className="text-gray-900 dark:text-white font-medium">{stem}</p>
                    <p className="text-xs text-green-700 dark:text-green-400 italic mt-0.5">{full}</p>
                  </>
              }
            </div>
          )
        })}
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Useful Language ──────────────────────────────────────────────────────────

export function UsefulLanguageModule({ content, isStudentView, tutorNotes }: { content: UsefulLanguageContent; isStudentView?: boolean; tutorNotes?: string }) {
  const sentences = content.practice?.sentences || []
  // Normalize: AI sometimes generates phrases as plain strings instead of {phrase, example} objects
  const phrases = (content.phrases || []).map(p =>
    typeof p === 'string' ? { phrase: p as string, stem: undefined as string | undefined, example: '' } : p
  )
  return (
    <div className="space-y-5">
      {!isStudentView && (
        <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Say the stem and ask your student to complete the phrase from memory. Drill each one in a realistic sentence before moving on.</p>
      )}
      <div className="space-y-2">
        <SectionLabel text={isStudentView ? 'Complete the phrases' : 'Phrases'} />
        {phrases.map((p, i) => {
          const stem = p.stem || p.phrase.trim().split(/\s+/).slice(0, 4).join(' ') + ' .....'
          return (
            <div key={i} className="border-l-2 border-brand-primary pl-3">
              {isStudentView
                ? <p className="font-medium text-gray-900 dark:text-white">{stem}</p>
                : <>
                    <p className="font-medium text-gray-500 dark:text-gray-400">{stem}</p>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400 mt-0.5">{p.phrase}</p>
                    {p.example && <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-0.5">&ldquo;{p.example}&rdquo;</p>}
                  </>
              }
            </div>
          )
        })}
      </div>
      {sentences.length > 0 && (
        <div className="space-y-2">
          <SectionLabel text="Practice — fill in the blanks" />
          {sentences.map((s, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-brand-primary font-medium flex-shrink-0">{i + 1}.</span>
              <div>
                <span className="text-gray-900 dark:text-white">{s.prompt} </span>
                {!isStudentView
                  ? <span className="text-green-600 dark:text-green-400 font-medium">{s.answer}</span>
                  : <span className="inline-block w-24 border-b border-gray-400 dark:border-gray-500" />}
              </div>
            </div>
          ))}
        </div>
      )}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Language in Context ──────────────────────────────────────────────────────

function LanguageInContextItem({ phrase, fn, example, isStudentView }: { phrase: string; fn: string; example?: string; isStudentView?: boolean }) {
  const [revealed, setRevealed] = React.useState(false)
  const stem = phrase.trim().split(/\s+/).slice(0, 4).join(' ') + ' .....'
  if (isStudentView) {
    return (
      <div className="border-l-2 border-brand-primary pl-3 py-0.5">
        <p className="font-medium text-gray-900 dark:text-white">
          {revealed ? <>&ldquo;{phrase}&rdquo;</> : stem}
        </p>
        {!revealed && (
          <button onClick={() => setRevealed(true)} className="text-xs text-brand-primary hover:underline mt-0.5">
            Reveal
          </button>
        )}
      </div>
    )
  }
  return (
    <div className="border-l-2 border-brand-primary pl-3 py-0.5 space-y-0.5">
      <p className="font-medium text-gray-500 dark:text-gray-400">{stem}</p>
      <p className="text-sm font-medium text-green-700 dark:text-green-400">&ldquo;{phrase}&rdquo;</p>
      {fn && <p className="text-xs font-medium text-teal-600 dark:text-teal-400">{fn}</p>}
      {example && <p className="text-xs text-gray-400 dark:text-gray-500 italic">{example}</p>}
    </div>
  )
}

export function LanguageInContextModule({ content, isStudentView, tutorNotes }: { content: LanguageInContextContent; isStudentView?: boolean; tutorNotes?: string }) {
  // Normalize: AI sometimes generates an 'analysis' string array instead of phrases objects
  const rawContent = content as unknown as { analysis?: string[] }
  const phrases = content.phrases?.length
    ? content.phrases
    : (rawContent.analysis || []).map(a => ({ phrase: a, function: '', example: undefined }))
  return (
    <div className="space-y-3">
      {content.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>}
      {isStudentView
        ? <p className="text-sm text-gray-500 dark:text-gray-400 italic">Complete each phrase, then reveal to check.</p>
        : <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Say the stem aloud. Ask your student to complete the phrase, then discuss its function together.</p>
      }
      {phrases.map((p, i) => (
        <LanguageInContextItem key={i} phrase={p.phrase} fn={p.function} example={p.example} isStudentView={isStudentView} />
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Phrasal Verbs ────────────────────────────────────────────────────────────

export function PhrasalVerbsModule({ content, isStudentView, tutorNotes }: { content: PhrasalVerbsContent; isStudentView?: boolean; tutorNotes?: string }) {
  const shuffled = React.useMemo(() => {
    return [...(content.pairs || []).map((p, i) => ({ meaning: p.meaning, idx: i }))].sort(() => Math.random() - 0.5)
  }, [content.pairs])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div className="space-y-2">
          <SectionLabel text="Phrasal verb" />
          {(content.pairs || []).map((p, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-900 dark:text-white">
              <span className="text-brand-primary font-medium w-5 flex-shrink-0">{i + 1}.</span>
              <span className="font-medium">{p.verb}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <SectionLabel text="Meaning" />
          {shuffled.map((item, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-gray-400 font-medium w-5 flex-shrink-0">{String.fromCharCode(97 + i)}.</span>
              <span>{item.meaning}</span>
            </div>
          ))}
        </div>
      </div>
      {!isStudentView && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <SectionLabel text="Answer key" />
          <div className="flex flex-wrap gap-2">
            {(content.pairs || []).map((_p, i) => {
              const letter = String.fromCharCode(97 + shuffled.findIndex(s => s.idx === i))
              return (
                <span key={i} className="text-xs px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                  {i + 1} → {letter}
                </span>
              )
            })}
          </div>
        </div>
      )}
      {(content.pairs || []).some(p => p.example) && (
        <div className="space-y-1">
          <SectionLabel text="Examples" />
          {(content.pairs || []).filter(p => p.example).map((p, i) => (
            <p key={i} className="text-xs text-gray-500 dark:text-gray-400 italic">&ldquo;{p.example}&rdquo;</p>
          ))}
        </div>
      )}
      {content.discussionQuestions && content.discussionQuestions.length > 0 && (
        <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-3">
          <SectionLabel text="Discussion" />
          {(content.discussionQuestions || []).map((q, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-900 dark:text-white">
              <span className="text-brand-primary font-medium flex-shrink-0">{i + 1}.</span>
              <p>{q}</p>
            </div>
          ))}
        </div>
      )}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Gap Fill ─────────────────────────────────────────────────────────────────

export function GapFillModule({ content, isStudentView, tutorNotes }: { content: GapFillContent; isStudentView?: boolean; tutorNotes?: string }) {
  const [inputs, setInputs] = React.useState<Record<number, string>>({})
  const [checked, setChecked] = React.useState(false)
  // Normalize: strip any "Answer: X" the AI embeds in the sentence text
  const sentences = (content.sentences || []).map(s => ({
    ...s,
    sentence: s.sentence.replace(/\s*[\n\r]*\s*Answer\s*:\s*.+$/i, '').trim(),
  }))
  const allFilled = sentences.every((_, i) => inputs[i]?.trim())
  const score = sentences.filter((s, i) => inputs[i]?.trim().toLowerCase() === (s.answer || '').toLowerCase()).length

  if (!isStudentView) {
    return (
      <div className="space-y-4">
        {content.instructions && <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{content.instructions}</p>}
        {(content.wordBank || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(content.wordBank || []).map((w, i) => (
              <span key={i} className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-400">{w}</span>
            ))}
          </div>
        )}
        <div className="space-y-3">
          {sentences.map((s, i) => {
            const parts = s.sentence.split('___')
            return (
              <div key={i} className="flex items-baseline gap-1 text-sm flex-wrap">
                <span className="text-gray-400 w-6 flex-shrink-0 font-medium">{i + 1}.</span>
                <span className="text-gray-800 dark:text-gray-200">{parts[0]}</span>
                <span className="px-2 font-semibold text-green-600 dark:text-green-400 border-b-2 border-green-400">{s.answer}</span>
                {parts[1] && <span className="text-gray-800 dark:text-gray-200">{parts[1]}</span>}
              </div>
            )
          })}
        </div>
        {tutorNotes && <TutorNote note={tutorNotes} />}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {content.instructions && <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{content.instructions}</p>}
      {(content.wordBank || []).length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          {(content.wordBank || []).map((w, i) => (
            <span key={i} className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 font-medium">{w}</span>
          ))}
        </div>
      )}
      <div className="space-y-4">
        {sentences.map((s, i) => {
          const val = inputs[i] || ''
          const isCorrect = checked && val.trim().toLowerCase() === (s.answer || '').toLowerCase()
          const isWrong = checked && val.trim() && !isCorrect
          const parts = s.sentence.split('___')
          return (
            <div key={i} className="flex items-center gap-1 text-sm flex-wrap">
              <span className="text-gray-400 w-6 flex-shrink-0 font-medium">{i + 1}.</span>
              <span className="text-gray-800 dark:text-gray-200">{parts[0]}</span>
              <input
                type="text"
                value={val}
                onChange={e => !checked && setInputs(prev => ({ ...prev, [i]: e.target.value }))}
                className={`w-28 border-b-2 bg-transparent text-sm font-semibold text-center focus:outline-none transition-colors ${
                  isCorrect ? 'border-green-500 text-green-600 dark:text-green-400' :
                  isWrong ? 'border-red-400 text-red-500' :
                  'border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200'
                }`}
              />
              {parts[1] && <span className="text-gray-800 dark:text-gray-200">{parts[1]}</span>}
              {isWrong && <span className="text-green-600 dark:text-green-400 text-xs ml-1">(✓ {s.answer})</span>}
            </div>
          )
        })}
      </div>
      {!checked ? (
        <button
          onClick={() => allFilled && setChecked(true)}
          disabled={!allFilled}
          className="px-5 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check answers
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <span className={`text-sm font-medium ${score === sentences.length ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {score === sentences.length ? '✓ All correct!' : `${score} / ${sentences.length} correct`}
          </span>
          <button
            onClick={() => { setInputs({}); setChecked(false) }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Complete the Sentence (MCQ) ──────────────────────────────────────────────

export function CompleteTheSentenceModule({ content, isStudentView, tutorNotes }: { content: CompleteTheSentenceContent; isStudentView?: boolean; tutorNotes?: string }) {
  const [selected, setSelected] = useState<Record<number, number>>({})

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>
      {(content.questions || []).map((q, i) => (
        <div key={i} className="space-y-2">
          <div className="flex gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <span className="text-brand-primary flex-shrink-0">{i + 1}.</span>
            <span>{q.stem}</span>
          </div>
          <div className="flex flex-wrap gap-2 pl-5">
            {q.options.map((opt, j) => {
              const isCorrect = j === q.answer
              const isChosen = selected[i] === j
              let cls = 'px-3 py-1.5 text-sm rounded-lg border transition-colors '
              if (!isStudentView) {
                cls += isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              } else if (isChosen) {
                cls += isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 line-through'
              } else {
                cls += 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-brand-primary hover:text-brand-primary cursor-pointer'
              }
              return (
                <button
                  key={j}
                  className={cls}
                  onClick={() => isStudentView && selected[i] === undefined && setSelected(prev => ({ ...prev, [i]: j }))}
                  disabled={!isStudentView || selected[i] !== undefined}
                >
                  {String.fromCharCode(97 + j)}. {opt}
                </button>
              )
            })}
          </div>
          {!isStudentView && q.explanation && (
            <p className="pl-5 text-xs text-gray-400 dark:text-gray-500 italic">{q.explanation}</p>
          )}
          {isStudentView && selected[i] !== undefined && q.explanation && (
            <p className="pl-5 text-xs text-gray-400 dark:text-gray-500 italic">{q.explanation}</p>
          )}
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Find the Mistake ─────────────────────────────────────────────────────────

export function FindTheMistakeModule({ content, isStudentView, tutorNotes }: { content: FindTheMistakeContent; isStudentView?: boolean; tutorNotes?: string }) {
  const [revealed, setRevealed] = React.useState<Set<number>>(new Set())
  const sentences = content.sentences || []

  const toggleReveal = (i: number) => {
    setRevealed(prev => {
      const n = new Set(prev)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })
  }

  if (!isStudentView) {
    return (
      <div className="space-y-3">
        {content.instructions && <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{content.instructions}</p>}
        {sentences.map((s, i) => (
          <div key={i} className="border-l-2 border-red-200 dark:border-red-800 pl-3 space-y-0.5">
            <p className="text-sm text-red-500 dark:text-red-400 line-through">{s.incorrect}</p>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">{s.correct}</p>
            {s.explanation && <p className="text-xs text-gray-400 dark:text-gray-500 italic">{s.explanation}</p>}
          </div>
        ))}
        {tutorNotes && <TutorNote note={tutorNotes} />}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {content.instructions && <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{content.instructions}</p>}
      {sentences.map((s, i) => {
        const isRevealed = revealed.has(i)
        return (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="text-gray-400 text-sm w-5 flex-shrink-0 mt-0.5">{i + 1}.</span>
            <div className="flex-1 space-y-1">
              <p className={`text-sm ${isRevealed ? 'text-red-500 dark:text-red-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>{s.incorrect}</p>
              {isRevealed && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{s.correct}</p>
              )}
              {isRevealed && s.explanation && (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">{s.explanation}</p>
              )}
            </div>
            <button
              onClick={() => toggleReveal(i)}
              className="flex-shrink-0 px-2.5 py-1 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {isRevealed ? 'Hide' : 'Show'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── Ordering ─────────────────────────────────────────────────────────────────

export function OrderingModule({ content, isStudentView, tutorNotes }: { content: OrderingContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>
      {(content.sentences || []).map((s, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="text-brand-primary font-medium flex-shrink-0 w-5">{i + 1}.</span>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white italic">{s.scrambled}</p>
            {!isStudentView && <p className="text-green-600 dark:text-green-400 mt-0.5">→ {s.correct}</p>}
          </div>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Fill in Blanks Dialogue ──────────────────────────────────────────────────

export function FillInBlanksDialogueModule({ content, isStudentView, tutorNotes }: { content: FillInBlanksDialogueContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-4">
      {content.context && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.context}</p>}
      {(content.characters?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          {(content.characters || []).map((c, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              {c.name}{c.role ? ` — ${c.role}` : ''}
            </span>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {(content.dialogue || []).map((line, i) => {
          const answer = line.blankIndex !== undefined ? content.answers[String(line.blankIndex)] : undefined
          const text = line.blankIndex !== undefined
            ? line.text.replace('___', isStudentView ? '___' : `(${answer})`)
            : line.text
          return (
            <div key={i} className="flex gap-3">
              <span className="font-medium text-brand-primary flex-shrink-0 w-20 text-sm">{line.character}</span>
              <p className="text-sm text-gray-900 dark:text-white flex-1">{text}</p>
            </div>
          )
        })}
      </div>
      <div>
        <SectionLabel text="Answer pool" />
        <div className="flex flex-wrap gap-2">
          {(content.answerPool || []).map((w, i) => (
            <span key={i} className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300">{w}</span>
          ))}
        </div>
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Sentence Correction ──────────────────────────────────────────────────────

export function SentenceCorrectionModule({ content, isStudentView, tutorNotes }: { content: SentenceCorrectionContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      {(content.sentences || []).map((s, i) => (
        <div key={i} className="border-l-2 border-red-200 dark:border-red-800 pl-3">
          {isStudentView ? (
            <p className="text-sm text-gray-900 dark:text-white">{s.incorrect}</p>
          ) : (
            <>
              <p className="text-sm text-red-500 dark:text-red-400 line-through">{s.incorrect}</p>
              <p className="text-sm text-green-600 dark:text-green-400">{s.correct}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.errorType} — {s.explanation}</p>
            </>
          )}
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Grammar Focus ────────────────────────────────────────────────────────────

export function GrammarFocusModule({ content, isStudentView, tutorNotes }: { content: GrammarFocusContent; isStudentView?: boolean; tutorNotes?: string }) {
  const [selected, setSelected] = useState<Record<number, number>>({})

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{content.topic}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{content.explanation}</p>
      </div>
      {content.table && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {content.table.headers.map((h, i) => (
                  <th key={i} className="text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {(content.examples?.length ?? 0) > 0 && (
        <div className="space-y-1">
          <SectionLabel text="Examples" />
          {(content.examples || []).map((ex, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-green-500 flex-shrink-0">✓</span>
              <span className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-500 dark:text-gray-400">{ex.label}</span> {ex.sentence}</span>
            </div>
          ))}
        </div>
      )}
      {(content.practice?.questions?.length ?? 0) > 0 && (
        <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3">
          <SectionLabel text="Practice" />
          {(content.practice?.questions || []).map((q, i) => (
            <div key={i} className="space-y-2">
              <div className="flex gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-brand-primary flex-shrink-0">{i + 1}.</span>
                <span>{q.stem}</span>
              </div>
              <div className="flex flex-wrap gap-2 pl-5">
                {q.options.map((opt, j) => {
                  const isCorrect = j === q.answer
                  const isChosen = selected[i] === j
                  let cls = 'px-3 py-1.5 text-sm rounded-lg border transition-colors '
                  if (!isStudentView) {
                    cls += isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  } else if (isChosen) {
                    cls += isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 line-through'
                  } else {
                    cls += 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-brand-primary cursor-pointer'
                  }
                  return (
                    <button key={j} className={cls}
                      onClick={() => isStudentView && selected[i] === undefined && setSelected(p => ({ ...p, [i]: j }))}
                      disabled={!isStudentView || selected[i] !== undefined}>
                      {String.fromCharCode(97 + j)}. {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Dialogue ─────────────────────────────────────────────────────────────────

export function DialogueModule({ content, isStudentView, tutorNotes }: { content: DialogueContent; isStudentView?: boolean; tutorNotes?: string }) {
  const colors = ['text-brand-primary', 'text-teal-600 dark:text-teal-400', 'text-purple-600 dark:text-purple-400']
  const charMap: Record<string, number> = {}
  ;(content.characters || []).forEach((c, i) => { charMap[c.name] = i })

  // Normalize: AI sometimes generates a 'text' string blob instead of dialogue array
  const rawContent = content as unknown as { text?: string }
  const dialogueLines: { character: string; text: string }[] = content.dialogue?.length
    ? content.dialogue
    : (rawContent.text || '').split('\n').filter(Boolean).map(line => {
        const colon = line.indexOf(':')
        return colon > -1
          ? { character: line.slice(0, colon).trim(), text: line.slice(colon + 1).trim() }
          : { character: '', text: line.trim() }
      })

  return (
    <div className="space-y-4">
      {content.setting && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-200 dark:border-gray-600 pl-3">{content.setting}</p>
      )}
      <div className="space-y-3">
        {dialogueLines.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className={`font-semibold flex-shrink-0 w-24 text-sm ${colors[charMap[line.character] ?? 0]}`}>{line.character}</span>
            <p className="text-sm text-gray-900 dark:text-white flex-1">{line.text}</p>
          </div>
        ))}
      </div>
      {content.comprehension && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2">
          <SectionLabel text={content.comprehension.type === 'true-false' ? 'True or False?' : 'Check your understanding'} />
          {content.comprehension.questions.map((q, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-brand-primary font-medium flex-shrink-0">{i + 1}.</span>
              <div>
                <p className="text-gray-900 dark:text-white">{q.question}</p>
                {!isStudentView && (
                  <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">
                    {typeof q.answer === 'boolean' ? (q.answer ? 'True' : 'False') : q.answer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Reading Article ──────────────────────────────────────────────────────────

export function ReadingArticleModule({ content, isStudentView, tutorNotes }: { content: ReadingArticleContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-4">
      {content.title && <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{content.title}</h4>}
      <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed space-y-3">
        {content.text.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
      </div>
      {content.source && <p className="text-xs text-gray-400 dark:text-gray-500">Source: {content.source}</p>}
      {content.glossary && content.glossary.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-1">
          <SectionLabel text="Glossary" />
          {(content.glossary || []).map((g, i) => (
            <p key={i} className="text-xs text-gray-600 dark:text-gray-400"><span className="font-medium">{g.term}:</span> {g.definition}</p>
          ))}
        </div>
      )}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Reading Scan ─────────────────────────────────────────────────────────────

export function ReadingScanModule({ content, isStudentView, tutorNotes }: { content: ReadingScanContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>
      {(content.questions || []).map((q, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="text-brand-primary font-medium flex-shrink-0">{i + 1}.</span>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white">{q.question}</p>
            {!isStudentView && <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">{q.answer}</p>}
          </div>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Vocabulary in Text ───────────────────────────────────────────────────────

export function VocabularyInTextModule({ content, isStudentView, tutorNotes }: { content: VocabularyInTextContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>
      {(content.items || []).map((item, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="text-brand-primary font-medium flex-shrink-0">{i + 1}.</span>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white">{item.definition}{item.paragraph ? ` (para. ${item.paragraph})` : ''}</p>
            {!isStudentView && <p className="text-green-600 dark:text-green-400 text-xs mt-0.5 font-medium">{item.answer}</p>}
          </div>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Reading Section Prediction ───────────────────────────────────────────────

export function ReadingSectionPredictionModule({ content, isStudentView, tutorNotes }: { content: ReadingSectionPredictionContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-4">
      {content.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>}
      <div>
        <SectionLabel text="Sections" />
        {(content.sections || []).map((s, i) => (
          <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300 mb-1">
            <span className="font-medium text-brand-primary">{String.fromCharCode(65 + i)}.</span>
            <span>{s.heading}</span>
          </div>
        ))}
      </div>
      <div>
        <SectionLabel text="Which section contains this information?" />
        {(content.items || []).map((item, i) => (
          <div key={i} className="flex gap-2 text-sm mb-2">
            <span className="text-brand-primary font-medium flex-shrink-0">{i + 1}.</span>
            <div>
              <p className="text-gray-900 dark:text-white">{item.content}</p>
              {!isStudentView && <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">Section {String.fromCharCode(65 + item.answer)}</p>}
            </div>
          </div>
        ))}
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Skim Main Idea ───────────────────────────────────────────────────────────

export function SkimMainIdeaModule({ content, isStudentView, tutorNotes }: { content: SkimMainIdeaContent; isStudentView?: boolean; tutorNotes?: string }) {
  const [chosen, setChosen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">Skim the text and choose the best main idea.</p>
      {(content.options || []).map((opt, i) => {
        const isCorrect = i === content.answer
        let cls = 'w-full text-left px-3 py-2 text-sm rounded-lg border transition-colors '
        if (!isStudentView) {
          cls += isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
        } else if (chosen === i) {
          cls += isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
        } else {
          cls += 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-brand-primary cursor-pointer'
        }
        return (
          <button key={i} className={cls} onClick={() => isStudentView && chosen === null && setChosen(i)} disabled={!isStudentView || chosen !== null}>
            {String.fromCharCode(49 + i)}. {opt}
          </button>
        )
      })}
      {!isStudentView && content.explanation && <p className="text-xs text-gray-400 dark:text-gray-500 italic">{content.explanation}</p>}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Matching Q&A ─────────────────────────────────────────────────────────────

export function MatchingQAModule({ content, isStudentView, tutorNotes }: { content: MatchingQAContent; isStudentView?: boolean; tutorNotes?: string }) {
  const pairs = content.pairs || []
  const [revealed, setRevealed] = React.useState(false)

  // Student view: just questions — no answers visible, discuss then reveal
  if (isStudentView) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {pairs.map((p, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="text-brand-primary font-bold flex-shrink-0 w-5 mt-0.5">{i + 1}.</span>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">{p.question}</p>
                {revealed && (
                  <p className="mt-1 text-green-700 dark:text-green-400 text-sm border-l-2 border-green-400 pl-2">{p.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setRevealed(prev => !prev)}
          className="px-5 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-accent transition-colors"
        >
          {revealed ? 'Hide answers' : 'Show answers'}
        </button>
      </div>
    )
  }

  // Tutor view: questions + answers paired, show answers toggle
  return (
    <div className="space-y-3">
      {pairs.map((p, i) => (
        <div key={i} className="flex gap-3 text-sm">
          <span className="text-brand-primary font-bold flex-shrink-0 w-5 mt-0.5">{i + 1}.</span>
          <div>
            <p className="text-gray-900 dark:text-white font-medium">{p.question}</p>
            {revealed && <p className="text-green-700 dark:text-green-400 mt-0.5">{p.answer}</p>}
          </div>
        </div>
      ))}
      <button
        onClick={() => setRevealed(prev => !prev)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
      >
        {revealed ? 'Hide answers' : 'Show answers'}
      </button>
      {tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Noticing ─────────────────────────────────────────────────────────────────

export function NoticingModule({ content, isStudentView, tutorNotes }: { content: NoticingContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">{content.instruction}</p>
        {content.targetPattern && <p className="text-xs text-amber-700 dark:text-amber-400 italic">{content.targetPattern}</p>}
      </div>
      {content.examples && content.examples.length > 0 && (
        <div className="space-y-1">
          <SectionLabel text="Examples" />
          {(content.examples || []).map((ex, i) => (
            <p key={i} className="text-sm text-gray-700 dark:text-gray-300 italic">&ldquo;{ex}&rdquo;</p>
          ))}
        </div>
      )}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Listening: Predictions ───────────────────────────────────────────────────

export function ListeningPredictionsModule({ content, isStudentView, tutorNotes }: { content: ListeningPredictionsContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <AudioNote />
      <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>
      {(content.items || []).map((item, i) => (
        <div key={i} className="flex items-start gap-3 text-sm">
          <div className={`w-4 h-4 mt-0.5 flex-shrink-0 border-2 rounded ${!isStudentView && item.willBeMentioned ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-500'}`} />
          <span className="text-gray-900 dark:text-white">{item.statement}</span>
          {!isStudentView && <span className={`ml-auto text-xs flex-shrink-0 ${item.willBeMentioned ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>{item.willBeMentioned ? '✓' : '✗'}</span>}
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Listening: Main Idea ─────────────────────────────────────────────────────

export function ListeningMainIdeaModule({ content, isStudentView, tutorNotes }: { content: ListeningMainIdeaContent; isStudentView?: boolean; tutorNotes?: string }) {
  const [chosen, setChosen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      <AudioNote />
      <p className="text-sm text-gray-600 dark:text-gray-300">Listen and choose the best summary.</p>
      {(content.options || []).map((opt, i) => {
        const isCorrect = i === content.answer
        let cls = 'w-full text-left px-3 py-2 text-sm rounded-lg border transition-colors '
        if (!isStudentView) cls += isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
        else if (chosen === i) cls += isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
        else cls += 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-brand-primary cursor-pointer'
        return <button key={i} className={cls} onClick={() => isStudentView && chosen === null && setChosen(i)} disabled={!isStudentView || chosen !== null}>{String.fromCharCode(49 + i)}. {opt}</button>
      })}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Listening: True/False ────────────────────────────────────────────────────

export function ListeningTrueFalseModule({ content, isStudentView, tutorNotes }: { content: ListeningTrueFalseContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <AudioNote />
      {(content.questions || []).map((q, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="text-brand-primary font-medium flex-shrink-0">{i + 1}.</span>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white">{q.statement}</p>
            {!isStudentView && (
              <p className={`text-xs mt-0.5 font-medium ${q.answer ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {q.answer ? 'True' : 'False'}{q.note ? ` — ${q.note}` : ''}
              </p>
            )}
          </div>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Listening: MCQ ───────────────────────────────────────────────────────────

export function ListeningMCQModule({ content, isStudentView, tutorNotes }: { content: ListeningMCQContent; isStudentView?: boolean; tutorNotes?: string }) {
  const [selected, setSelected] = useState<Record<number, number>>({})
  return (
    <div className="space-y-4">
      <AudioNote />
      {(content.questions || []).map((q, i) => (
        <div key={i} className="space-y-2">
          <div className="flex gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <span className="text-brand-primary flex-shrink-0">{i + 1}.</span>
            <span>{q.question}</span>
          </div>
          <div className="flex flex-wrap gap-2 pl-5">
            {q.options.map((opt, j) => {
              const isCorrect = j === q.answer
              const isChosen = selected[i] === j
              let cls = 'px-3 py-1.5 text-sm rounded-lg border transition-colors '
              if (!isStudentView) cls += isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              else if (isChosen) cls += isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
              else cls += 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-brand-primary cursor-pointer'
              return <button key={j} className={cls} onClick={() => isStudentView && selected[i] === undefined && setSelected(p => ({ ...p, [i]: j }))} disabled={!isStudentView || selected[i] !== undefined}>{String.fromCharCode(97 + j)}. {opt}</button>
            })}
          </div>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Listening: Specific Info ─────────────────────────────────────────────────

export function ListeningSpecificInfoModule({ content, isStudentView, tutorNotes }: { content: ListeningSpecificInfoContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <AudioNote />
      <p className="text-sm font-medium text-gray-900 dark:text-white">{content.question}</p>
      {content.options && (
        <div className="flex flex-wrap gap-2">
          {(content.options || []).map((opt, i) => (
            <span key={i} className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">{opt}</span>
          ))}
        </div>
      )}
      {!isStudentView && <p className="text-green-600 dark:text-green-400 text-sm font-medium">{content.answer}</p>}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Listening: Table ─────────────────────────────────────────────────────────

export function ListeningTableModule({ content, isStudentView, tutorNotes }: { content: ListeningTableContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <AudioNote />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium"></th>
              {content.headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, i) => (
              <tr key={i}>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">{row.label}</td>
                {row.cells.map((cell, j) => {
                  const key = `${i}-${j}`
                  const answer = content.answers[key]
                  return (
                    <td key={j} className="px-3 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white min-w-[100px]">
                      {cell !== null ? cell : (!isStudentView && answer ? <span className="text-green-600 dark:text-green-400">{answer}</span> : <span className="text-gray-300 dark:text-gray-600">___</span>)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Listening: Comprehension (speaker ID) ────────────────────────────────────

export function ListeningComprehensionModule({ content, isStudentView, tutorNotes }: { content: ListeningComprehensionContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <AudioNote />
      <p className="text-sm text-gray-600 dark:text-gray-300">Write the correct speaker: {(content.speakers || []).map((s, i, arr) => <span key={i} className="font-medium">{s}{i < arr.length - 1 ? ', ' : ''}</span>)}</p>
      {(content.questions || []).map((q, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="text-brand-primary font-medium flex-shrink-0">{i + 1}.</span>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white">{q.statement}</p>
            {!isStudentView && <p className="text-green-600 dark:text-green-400 text-xs mt-0.5 font-medium">{q.answer}</p>}
          </div>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Roleplay ─────────────────────────────────────────────────────────────────

export function RoleplayModule({ content, isStudentView, tutorNotes }: { content: RoleplayContent; isStudentView?: boolean; tutorNotes?: string }) {
  // Normalize: AI sometimes generates roles as string[] and situation as 'scenario'
  const rawContent = content as unknown as { scenario?: string; roles?: (string | { name: string; description: string; keyPoints?: string[] })[] }
  const situation = content.situation || rawContent.scenario || ''
  const normalizedRoles = (rawContent.roles || []).map(r =>
    typeof r === 'string' ? { name: r, description: '', keyPoints: [] } : r
  )
  const visibleRoles = isStudentView ? normalizedRoles.slice(0, 1) : normalizedRoles
  return (
    <div className="space-y-4">
      {situation && (
        <div>
          <SectionLabel text="Situation" />
          <p className="text-sm text-gray-700 dark:text-gray-300">{situation}</p>
        </div>
      )}
      <div className="space-y-3">
        {visibleRoles.map((role, i) => (
          <div key={i} className="border-l-2 border-gray-200 dark:border-gray-600 pl-3">
            <p className="font-medium text-gray-900 dark:text-white text-sm">{role.name}</p>
            {role.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{role.description}</p>}
            {role.keyPoints && role.keyPoints.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {role.keyPoints.map((pt, j) => (
                  <li key={j} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-brand-primary">•</span>{pt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {content.phrasesToUse && content.phrasesToUse.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">Try to use these phrases:</p>
          <div className="flex flex-wrap gap-2">
            {(content.phrasesToUse || []).map((p, i) => (
              <span key={i} className="px-2 py-1 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-xs text-brand-primary italic">&ldquo;{p}&rdquo;</span>
            ))}
          </div>
        </div>
      )}
      {content.instructions && <p className="text-sm text-gray-600 dark:text-gray-300 italic">{content.instructions}</p>}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Talking Point ────────────────────────────────────────────────────────────

export function TalkingPointModule({ content, isStudentView, tutorNotes }: { content: TalkingPointContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-4">
      {content.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[content.studentA, content.studentB].map((card, ci) => (
          <div key={ci} className={`border rounded-lg p-4 ${ci === 0 ? 'border-brand-primary/30 bg-brand-primary/5' : 'border-teal-300/30 dark:border-teal-700/30 bg-teal-50/50 dark:bg-teal-900/10'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${ci === 0 ? 'text-brand-primary' : 'text-teal-600 dark:text-teal-400'}`}>{card.title}</p>
            <div className="space-y-2">
              {card.questions.map((q, i) => (
                <div key={i} className="flex gap-2 text-sm text-gray-900 dark:text-white">
                  <span className={`font-medium flex-shrink-0 ${ci === 0 ? 'text-brand-primary' : 'text-teal-600 dark:text-teal-400'}`}>{i + 1}.</span>
                  <p>{q}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Discussion ───────────────────────────────────────────────────────────────

export function DiscussionModule({ content, isStudentView, tutorNotes }: { content: DiscussionContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      {content.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>}
      {(content.questions || []).map((q, i) => (
        <div key={i} className="flex gap-3 items-start">
          <span className="font-bold text-brand-primary flex-shrink-0">{i + 1}.</span>
          <p className="text-gray-900 dark:text-white">{q}</p>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Further Discussion ───────────────────────────────────────────────────────

export function FurtherDiscussionModule({ content, isStudentView, tutorNotes }: { content: DiscussionContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      {content.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>}
      {(content.questions || []).map((q, i) => (
        <div key={i} className="flex gap-3 items-start">
          <span className="font-bold text-brand-primary flex-shrink-0">{i + 1}.</span>
          <p className="text-gray-900 dark:text-white">{q}</p>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Debate ───────────────────────────────────────────────────────────────────

export function DebateModule({ content, isStudentView, tutorNotes }: { content: DebateContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-brand-primary pl-4">
        <p className="font-semibold text-gray-900 dark:text-white">{content.topic}</p>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Choose one side. Prepare your arguments and defend your position with your tutor.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/10">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">{content.sideA.label}</p>
          <ul className="space-y-1">
            {(content.sideA?.points || []).map((pt, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-900 dark:text-white"><span className="text-blue-500">•</span>{pt}</li>
            ))}
          </ul>
        </div>
        <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50/50 dark:bg-orange-900/10">
          <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-2">{content.sideB.label}</p>
          <ul className="space-y-1">
            {(content.sideB?.points || []).map((pt, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-900 dark:text-white"><span className="text-orange-500">•</span>{pt}</li>
            ))}
          </ul>
        </div>
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Your Turn ────────────────────────────────────────────────────────────────

export function YourTurnAskModule({ content, isStudentView, tutorNotes }: { content: YourTurnAskContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Now ask your tutor these questions. Don&apos;t forget to ask follow-up questions!</p>
      {(content.questions || []).map((q, i) => (
        <div key={i} className="flex gap-3 items-start">
          <span className="font-bold text-brand-primary flex-shrink-0">{i + 1}.</span>
          <p className="text-gray-900 dark:text-white">{q}</p>
        </div>
      ))}
      {content.note && <p className="text-xs text-gray-400 dark:text-gray-500 italic">{content.note}</p>}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

export function YourTurnAnswerModule({ content, isStudentView, tutorNotes }: { content: YourTurnAnswerContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Answer these questions about yourself using the language from this lesson.</p>
      {(content.questions || []).map((q, i) => (
        <div key={i} className="flex gap-3 items-start">
          <span className="font-bold text-brand-primary flex-shrink-0">{i + 1}.</span>
          <p className="text-gray-900 dark:text-white">{q}</p>
        </div>
      ))}
      {content.note && <p className="text-xs text-gray-400 dark:text-gray-500 italic">{content.note}</p>}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

export function YourTurnTellModule({ content, isStudentView, tutorNotes }: { content: YourTurnTellContent; isStudentView?: boolean; tutorNotes?: string }) {
  // Normalize: AI sometimes generates a single 'prompt' string instead of 'prompts' array
  const rawContent = content as unknown as { prompt?: string }
  const prompts = content.prompts?.length ? content.prompts : (rawContent.prompt ? [rawContent.prompt] : [])
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Talk about yourself. Use as much of the lesson language as you can.</p>
      {content.example && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic border-l-2 border-gray-200 dark:border-gray-600 pl-3">Example: &ldquo;{content.example}&rdquo;</p>
      )}
      <div className="space-y-2">
        {prompts.map((p, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="font-bold text-brand-primary flex-shrink-0">{i + 1}.</span>
            <p className="text-gray-900 dark:text-white">{p}</p>
          </div>
        ))}
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Homework Writing ─────────────────────────────────────────────────────────

export function HomeworkWritingModule({ content, isStudentView, tutorNotes }: { content: HomeworkWritingContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700 dark:text-gray-300">{content.task}</p>
      {(content.prompts?.length ?? 0) > 0 && (
        <div>
          <SectionLabel text="Consider" />
          <ul className="space-y-1">
            {(content.prompts || []).map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-brand-primary">•</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}
      {content.wordCount && (
        <p className="text-xs text-gray-500 dark:text-gray-400">Write approximately {content.wordCount}.</p>
      )}
      {content.instructions && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>
      )}
      {!isStudentView && (
        <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Start next lesson by asking the student to share what they wrote.</p>
        </div>
      )}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}
