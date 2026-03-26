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
      {content.questions.map((q, i) => (
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
        {content.questions.map((q, i) => (
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
      {content.vocabulary.map((v, i) => (
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

export function VocabularyMatchModule({ content, isStudentView, tutorNotes }: { content: VocabularyMatchContent; isStudentView?: boolean; tutorNotes?: string }) {
  const shuffled = React.useMemo(() => {
    const defs = content.pairs.map((p, i) => ({ def: p.definition, idx: i }))
    return [...defs].sort(() => Math.random() - 0.5)
  }, [content.pairs])

  return (
    <div className="space-y-4">
      {content.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div className="space-y-2">
          <SectionLabel text="Column A" />
          {content.pairs.map((p, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-900 dark:text-white">
              <span className="text-brand-primary font-medium w-5 flex-shrink-0">{i + 1}.</span>
              <span>{p.term}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <SectionLabel text="Column B" />
          {shuffled.map((item, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-gray-400 font-medium w-5 flex-shrink-0">{String.fromCharCode(97 + i)}.</span>
              <span>{item.def}</span>
            </div>
          ))}
        </div>
      </div>
      {!isStudentView && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <SectionLabel text="Answer key" />
          <div className="flex flex-wrap gap-2">
            {content.pairs.map((p, i) => {
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
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Useful Expressions ───────────────────────────────────────────────────────

export function UsefulExpressionsModule({ content, isStudentView, tutorNotes }: { content: UsefulExpressionsContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      {content.context && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.context}</p>}
      {content.instructions && <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>}
      <div className="space-y-2">
        {content.expressions.map((expr, i) => (
          <div key={i} className="border-l-2 border-brand-primary pl-3 py-0.5">
            <p className="text-gray-900 dark:text-white">&ldquo;{expr}&rdquo;</p>
          </div>
        ))}
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Useful Language ──────────────────────────────────────────────────────────

export function UsefulLanguageModule({ content, isStudentView, tutorNotes }: { content: UsefulLanguageContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <SectionLabel text="Phrases" />
        {content.phrases.map((p, i) => (
          <div key={i} className="border-l-2 border-brand-primary pl-3">
            <p className="font-medium text-gray-900 dark:text-white">{p.phrase}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-0.5">&ldquo;{p.example}&rdquo;</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <SectionLabel text="Practice — fill in the blanks" />
        {content.practice.sentences.map((s, i) => (
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
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Language in Context ──────────────────────────────────────────────────────

export function LanguageInContextModule({ content, isStudentView, tutorNotes }: { content: LanguageInContextContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      {content.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>}
      {content.phrases.map((p, i) => (
        <div key={i} className="border-l-2 border-brand-primary pl-3 py-0.5 space-y-0.5">
          <p className="font-medium text-gray-900 dark:text-white">&ldquo;{p.phrase}&rdquo;</p>
          <p className="text-xs font-medium text-teal-600 dark:text-teal-400">{p.function}</p>
          {p.example && <p className="text-xs text-gray-400 dark:text-gray-500 italic">{p.example}</p>}
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Phrasal Verbs ────────────────────────────────────────────────────────────

export function PhrasalVerbsModule({ content, isStudentView, tutorNotes }: { content: PhrasalVerbsContent; isStudentView?: boolean; tutorNotes?: string }) {
  const shuffled = React.useMemo(() => {
    return [...content.pairs.map((p, i) => ({ meaning: p.meaning, idx: i }))].sort(() => Math.random() - 0.5)
  }, [content.pairs])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div className="space-y-2">
          <SectionLabel text="Phrasal verb" />
          {content.pairs.map((p, i) => (
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
            {content.pairs.map((p, i) => {
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
      {content.pairs.some(p => p.example) && (
        <div className="space-y-1">
          <SectionLabel text="Examples" />
          {content.pairs.filter(p => p.example).map((p, i) => (
            <p key={i} className="text-xs text-gray-500 dark:text-gray-400 italic">&ldquo;{p.example}&rdquo;</p>
          ))}
        </div>
      )}
      {content.discussionQuestions && content.discussionQuestions.length > 0 && (
        <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-3">
          <SectionLabel text="Discussion" />
          {content.discussionQuestions.map((q, i) => (
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
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>
      {content.wordBank && content.wordBank.length > 0 && (
        <div>
          <SectionLabel text="Word bank" />
          <div className="flex flex-wrap gap-2">
            {content.wordBank.map((w, i) => (
              <span key={i} className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300">{w}</span>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        {content.sentences.map((s, i) => (
          <div key={i} className="flex gap-2 text-sm">
            <span className="text-brand-primary font-medium flex-shrink-0 w-5">{i + 1}.</span>
            <div className="flex-1">
              {isStudentView ? (
                <span className="text-gray-900 dark:text-white">{s.sentence}</span>
              ) : (
                <span className="text-gray-900 dark:text-white">
                  {s.sentence.replace('___', '')}
                  <span className="font-medium text-green-600 dark:text-green-400"> [{s.answer}]</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Complete the Sentence (MCQ) ──────────────────────────────────────────────

export function CompleteTheSentenceModule({ content, isStudentView, tutorNotes }: { content: CompleteTheSentenceContent; isStudentView?: boolean; tutorNotes?: string }) {
  const [selected, setSelected] = useState<Record<number, number>>({})

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>
      {content.questions.map((q, i) => (
        <div key={i} className="space-y-2">
          <div className="flex gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <span className="text-brand-primary flex-shrink-0">{i + 1}.</span>
            <span>{q.stem}</span>
          </div>
          <div className="flex flex-wrap gap-2 pl-5">
            {q.options.map((opt, j) => {
              const isCorrect = j === q.answer
              const isChosen = selected[i] === j
              const revealed = !isStudentView || isChosen
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
                  onClick={() => isStudentView && !selected[i] !== undefined && setSelected(prev => ({ ...prev, [i]: j }))}
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
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>
      {content.sentences.map((s, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="text-brand-primary font-medium flex-shrink-0 w-5">{i + 1}.</span>
          <div className="flex-1 space-y-0.5">
            {isStudentView ? (
              <p className="text-gray-900 dark:text-white">{s.incorrect}</p>
            ) : (
              <>
                <p className="text-red-500 dark:text-red-400 line-through">{s.incorrect}</p>
                <p className="text-green-600 dark:text-green-400">{s.correct}</p>
                {s.explanation && <p className="text-xs text-gray-400 dark:text-gray-500 italic">{s.explanation}</p>}
              </>
            )}
          </div>
        </div>
      ))}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
    </div>
  )
}

// ─── Ordering ─────────────────────────────────────────────────────────────────

export function OrderingModule({ content, isStudentView, tutorNotes }: { content: OrderingContent; isStudentView?: boolean; tutorNotes?: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">{content.instructions}</p>
      {content.sentences.map((s, i) => (
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
      {content.characters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {content.characters.map((c, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              {c.name}{c.role ? ` — ${c.role}` : ''}
            </span>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {content.dialogue.map((line, i) => {
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
          {content.answerPool.map((w, i) => (
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
      {content.sentences.map((s, i) => (
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
      <div className="border-l-4 border-brand-primary pl-4">
        <p className="font-semibold text-gray-900 dark:text-white">{content.topic}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.explanation}</p>
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
      {content.examples.length > 0 && (
        <div className="space-y-1">
          <SectionLabel text="Examples" />
          {content.examples.map((ex, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-green-500 flex-shrink-0">✓</span>
              <span className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-500 dark:text-gray-400">{ex.label}</span> {ex.sentence}</span>
            </div>
          ))}
        </div>
      )}
      {content.practice.questions.length > 0 && (
        <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3">
          <SectionLabel text="Practice" />
          {content.practice.questions.map((q, i) => (
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
  content.characters.forEach((c, i) => { charMap[c.name] = i })

  return (
    <div className="space-y-4">
      {content.setting && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-200 dark:border-gray-600 pl-3">{content.setting}</p>
      )}
      <div className="space-y-3">
        {content.dialogue.map((line, i) => (
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
          {content.glossary.map((g, i) => (
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
      {content.questions.map((q, i) => (
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
      {content.items.map((item, i) => (
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
        {content.sections.map((s, i) => (
          <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300 mb-1">
            <span className="font-medium text-brand-primary">{String.fromCharCode(65 + i)}.</span>
            <span>{s.heading}</span>
          </div>
        ))}
      </div>
      <div>
        <SectionLabel text="Which section contains this information?" />
        {content.items.map((item, i) => (
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
      {content.options.map((opt, i) => {
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
  const shuffledAnswers = React.useMemo(() => {
    return [...content.pairs.map((p, i) => ({ ans: p.answer, idx: i }))].sort(() => Math.random() - 0.5)
  }, [content.pairs])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div className="space-y-2">
          <SectionLabel text="Questions" />
          {content.pairs.map((p, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-900 dark:text-white">
              <span className="text-brand-primary font-medium w-5 flex-shrink-0">{i + 1}.</span>
              <span>{p.question}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <SectionLabel text="Answers" />
          {shuffledAnswers.map((item, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-gray-400 font-medium w-5 flex-shrink-0">{String.fromCharCode(97 + i)}.</span>
              <span>{item.ans}</span>
            </div>
          ))}
        </div>
      </div>
      {!isStudentView && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <SectionLabel text="Answer key" />
          <div className="flex flex-wrap gap-2">
            {content.pairs.map((_, i) => {
              const letter = String.fromCharCode(97 + shuffledAnswers.findIndex(s => s.idx === i))
              return <span key={i} className="text-xs px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">{i + 1} → {letter}</span>
            })}
          </div>
        </div>
      )}
      {!isStudentView && tutorNotes && <TutorNote note={tutorNotes} />}
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
          {content.examples.map((ex, i) => (
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
      {content.items.map((item, i) => (
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
      {content.options.map((opt, i) => {
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
      {content.questions.map((q, i) => (
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
      {content.questions.map((q, i) => (
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
          {content.options.map((opt, i) => (
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
      <p className="text-sm text-gray-600 dark:text-gray-300">Write the correct speaker: {content.speakers.map((s, i) => <span key={i} className="font-medium">{s}{i < content.speakers.length - 1 ? ', ' : ''}</span>)}</p>
      {content.questions.map((q, i) => (
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
  const visibleRoles = isStudentView ? content.roles.slice(0, 1) : content.roles
  return (
    <div className="space-y-4">
      <div>
        <SectionLabel text="Situation" />
        <p className="text-sm text-gray-700 dark:text-gray-300">{content.situation}</p>
      </div>
      <div className="space-y-3">
        {visibleRoles.map((role, i) => (
          <div key={i} className="border-l-2 border-gray-200 dark:border-gray-600 pl-3">
            <p className="font-medium text-gray-900 dark:text-white text-sm">{role.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{role.description}</p>
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
            {content.phrasesToUse.map((p, i) => (
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
      {content.questions.map((q, i) => (
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
      {content.questions.map((q, i) => (
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
      {content.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{content.instructions}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/10">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">{content.sideA.label}</p>
          <ul className="space-y-1">
            {content.sideA.points.map((pt, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-900 dark:text-white"><span className="text-blue-500">•</span>{pt}</li>
            ))}
          </ul>
        </div>
        <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50/50 dark:bg-orange-900/10">
          <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-2">{content.sideB.label}</p>
          <ul className="space-y-1">
            {content.sideB.points.map((pt, i) => (
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
      {content.questions.map((q, i) => (
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
      {content.questions.map((q, i) => (
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
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Talk about yourself. Use as much of the lesson language as you can.</p>
      {content.example && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic border-l-2 border-gray-200 dark:border-gray-600 pl-3">Example: &ldquo;{content.example}&rdquo;</p>
      )}
      <div className="space-y-2">
        {content.prompts.map((p, i) => (
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
      {content.prompts.length > 0 && (
        <div>
          <SectionLabel text="Consider" />
          <ul className="space-y-1">
            {content.prompts.map((p, i) => (
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
