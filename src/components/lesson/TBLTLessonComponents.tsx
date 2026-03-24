'use client'

import React, { useState } from 'react'
import { VocabularyExercise, DialogueExercise } from './EngooLessonComponents'

/**
 * TBLT Lesson Components (Preply structure)
 * Lead-in → Task Prep → Task Performance → Post-task → Homework
 */

// ─── Lead-in ───────────────────────────────────────────────────────────────

interface LeadInContent {
  questions: string[]
  instructions?: string
}

export function LeadInExercise({ content }: { content: LeadInContent }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        {content.instructions || 'Discuss the questions with your tutor.'}
      </p>
      <ol className="space-y-3">
        {content.questions.map((q, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <p className="text-gray-900 dark:text-white pt-0.5">{q}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ─── Task Prep ─────────────────────────────────────────────────────────────

interface KeyPhrase {
  phrase: string
  usage: string
  example: string
}

interface TaskPrepContent {
  vocabulary: {
    word: string
    partOfSpeech: string
    phonetics: string
    definition: string
    example: string
    synonym?: string
    expressions?: string[]
  }[]
  keyPhrases: KeyPhrase[]
  modelDialogue: {
    setting: string
    characters: { name: string; role?: string; avatar?: string }[]
    dialogue: { character: string; text: string }[]
  }
}

export function TaskPrepExercise({ content }: { content: TaskPrepContent }) {
  const hasDialogue = content.modelDialogue?.dialogue?.length > 0
  const tabs = [
    { key: 'vocab' as const, label: 'Vocabulary' },
    { key: 'phrases' as const, label: 'Key Phrases' },
    ...(hasDialogue ? [{ key: 'dialogue' as const, label: 'Model Dialogue' }] : []),
  ]
  const [section, setSection] = useState<'vocab' | 'phrases' | 'dialogue'>(tabs[0].key)

  return (
    <div className="space-y-4">
      {/* Section tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSection(t.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              section === t.key
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {section === 'vocab' && content.vocabulary?.length > 0 && (
        <VocabularyExercise vocabulary={content.vocabulary} />
      )}

      {section === 'phrases' && content.keyPhrases?.length > 0 && (
        <ul className="space-y-2">
          {content.keyPhrases.map((kp, i) => (
            <li key={i} className="flex gap-3 items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary text-xs flex items-center justify-center font-semibold mt-0.5">
                {i + 1}
              </span>
              <p className="font-medium text-gray-900 dark:text-white">
                &ldquo;{kp.phrase}&rdquo;
              </p>
            </li>
          ))}
        </ul>
      )}

      {section === 'dialogue' && hasDialogue && (
        <DialogueExercise
          context={content.modelDialogue.setting}
          characters={content.modelDialogue.characters}
          dialogue={content.modelDialogue.dialogue}
        />
      )}
    </div>
  )
}

// ─── Task Performance ──────────────────────────────────────────────────────

interface TaskPerformanceContent {
  scenario: string
  roles: { name: string; description: string; keyPoints?: string[] }[]
  instructions: string
  phrasesToUse?: string[]
}

export function TaskPerformanceExercise({
  content,
  studentName,
  isStudentView = false,
}: {
  content: TaskPerformanceContent
  studentName?: string
  isStudentView?: boolean
}) {
  const [step, setStep] = useState<'prepare' | 'perform' | 'repeat'>('prepare')

  // First role is always the student's role; remaining roles are for the tutor
  const visibleRoles = isStudentView ? content.roles.slice(0, 1) : content.roles
  const displayName = (name: string) =>
    studentName && name === studentName ? 'You' : name

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex gap-1">
        {(['prepare', 'perform', 'repeat'] as const).map((s) => {
          const labels = { prepare: '1. Prepare', perform: '2. Perform', repeat: '3. Repeat' }
          return (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                step === s
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {labels[s]}
            </button>
          )
        })}
      </div>

      {step === 'prepare' && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Scenario</p>
            <p className="text-gray-700 dark:text-gray-300">{content.scenario}</p>
          </div>
          <div className="space-y-3">
            {visibleRoles.map((role, i) => (
              <div key={i} className="border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                <p className="font-medium text-gray-900 dark:text-white mb-0.5">{displayName(role.name)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">{role.description}</p>
                {role.keyPoints && role.keyPoints.length > 0 && (
                  <ul className="space-y-1">
                    {role.keyPoints.map((pt, j) => (
                      <li key={j} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-brand-primary">•</span>
                        {pt}
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
                  <span key={i} className="px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 italic">
                    &ldquo;{p}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setStep('perform')}
            className="w-full py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-accent transition-colors"
          >
            Start Roleplay
          </button>
        </div>
      )}

      {step === 'perform' && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Instructions</p>
            <p className="text-gray-700 dark:text-gray-300">{content.instructions}</p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Tutor monitors and takes notes.</p>
          <button
            onClick={() => setStep('repeat')}
            className="w-full py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-accent transition-colors"
          >
            Done — Get Feedback
          </button>
        </div>
      )}

      {step === 'repeat' && (
        <div className="space-y-3">
          <p className="text-gray-700 dark:text-gray-300">
            Apply the tutor&apos;s feedback and repeat the roleplay. Focus on the phrases you missed or the language points that need work.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Post-task ─────────────────────────────────────────────────────────────

interface PostTaskContent {
  grammarFocus: string
  explanation: string
  examples: string[]
  corrections?: { error: string; correction: string; rule: string }[]
}

export function PostTaskExercise({
  content,
  isStudentView = false,
}: {
  content: PostTaskContent
  isStudentView?: boolean
}) {
  const [showCorrections, setShowCorrections] = useState(false)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Grammar Focus</p>
        <p className="font-medium text-gray-900 dark:text-white">{content.grammarFocus}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Rule</p>
        <p className="text-gray-700 dark:text-gray-300">{content.explanation}</p>
      </div>

      {content.examples && content.examples.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Examples</p>
          <ul className="space-y-1">
            {content.examples.map((ex, i) => (
              <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-green-500">✓</span>
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.corrections && content.corrections.length > 0 && (
        <div>
          <button
            onClick={() => setShowCorrections(!showCorrections)}
            className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:underline"
          >
            <span>{showCorrections ? '▼' : '▶'}</span>
            Common errors from this task ({content.corrections.length})
          </button>
          {showCorrections && (
            <div className="mt-3 space-y-3">
              {content.corrections.map((c, i) => (
                <div key={i} className="border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                  <p className="text-red-500 dark:text-red-400 line-through mb-0.5">{c.error}</p>
                  <p className="text-green-600 dark:text-green-400 mb-1">{c.correction}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{c.rule}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isStudentView && (
        <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Tutor note</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Consider sending a follow-up grammar exercise on <strong className="text-gray-600 dark:text-gray-300">{content.grammarFocus}</strong> for independent practice — e.g. a gap-fill or sentence correction activity.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Homework ──────────────────────────────────────────────────────────────

interface HomeworkContent {
  taskName: string
  description: string
  instructions: string
}

export function HomeworkExercise({
  content,
  isStudentView = false,
}: {
  content: HomeworkContent
  isStudentView?: boolean
}) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{content.instructions || content.description}</p>
      {!isStudentView && (
        <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">To discuss next lesson</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Start next lesson by asking: &ldquo;Did you have a chance to try this? What did you notice?&rdquo;
          </p>
        </div>
      )}
    </div>
  )
}
