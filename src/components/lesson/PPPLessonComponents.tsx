'use client'

import React, { useState } from 'react'
import { VocabularyExercise } from './EngooLessonComponents'

// ─── Presentation ───────────────────────────────────────────────────────────

interface PresentationContent {
  targetStructure: string
  explanation: string
  examples: { sentence: string; note?: string }[]
  conceptCheckQuestions: string[]
}

export function PresentationExercise({ content }: { content: PresentationContent }) {
  const [showCCQs, setShowCCQs] = useState(false)

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Target Structure</p>
        <p className="font-semibold text-gray-900 dark:text-white">{content.targetStructure}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Explanation</p>
        <p className="text-gray-700 dark:text-gray-300">{content.explanation}</p>
      </div>

      {content.examples?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Examples</p>
          <ul className="space-y-2">
            {content.examples.map((ex, i) => (
              <li key={i} className="border-l-2 border-brand-primary pl-3">
                <p className="text-gray-900 dark:text-white">{ex.sentence}</p>
                {ex.note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ex.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.conceptCheckQuestions?.length > 0 && (
        <div>
          <button
            onClick={() => setShowCCQs(!showCCQs)}
            className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:underline"
          >
            <span>{showCCQs ? '▼' : '▶'}</span>
            Concept Check Questions ({content.conceptCheckQuestions.length})
          </button>
          {showCCQs && (
            <ul className="mt-3 space-y-2">
              {content.conceptCheckQuestions.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{q}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Practice ───────────────────────────────────────────────────────────────

interface PracticeExerciseItem {
  id: number
  prompt: string
  answer: string
  hint?: string
}

interface PracticeContent {
  instructions: string
  exercises: {
    type: 'gap-fill' | 'transformation' | 'matching' | 'reorder'
    items: PracticeExerciseItem[]
  }[]
}

export function PracticeExercise({
  content,
  isStudentView = false,
}: {
  content: PracticeContent
  isStudentView?: boolean
}) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const toggle = (key: string) => {
    setRevealed(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const typeLabel: Record<string, string> = {
    'gap-fill': 'Fill in the Gap',
    'transformation': 'Sentence Transformation',
    'matching': 'Matching',
    'reorder': 'Word Order',
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300">{content.instructions}</p>

      {!isStudentView && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-brand-primary hover:underline"
        >
          {showAll ? 'Hide All Answers' : 'Show All Answers'}
        </button>
      )}

      {content.exercises?.map((ex, ei) => (
        <div key={ei} className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            {typeLabel[ex.type] || ex.type}
          </p>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {ex.items.map((item) => {
              const key = `${ei}-${item.id}`
              const show = showAll || revealed.has(key)
              return (
                <div key={item.id} className="p-3 flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-semibold flex items-center justify-center">
                    {item.id}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{item.prompt}</p>
                    {item.hint && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">({item.hint})</p>}
                    {show && (
                      <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">→ {item.answer}</p>
                    )}
                  </div>
                  {!isStudentView && (
                    <button
                      onClick={() => toggle(key)}
                      className="flex-shrink-0 text-xs text-brand-primary hover:underline"
                    >
                      {revealed.has(key) && !showAll ? 'Hide' : 'Check'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Production ─────────────────────────────────────────────────────────────

interface ProductionContent {
  scenario: string
  task: string
  targetStructure: string
  prompts?: string[]
}

export function ProductionExercise({ content }: { content: ProductionContent }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Scenario</p>
        <p className="text-gray-700 dark:text-gray-300">{content.scenario}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Your Task</p>
        <p className="text-gray-900 dark:text-white">{content.task}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Use This Structure</p>
        <p className="text-gray-700 dark:text-gray-300 italic">{content.targetStructure}</p>
      </div>
      {content.prompts && content.prompts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Sentence Starters</p>
          <div className="flex flex-wrap gap-2">
            {content.prompts.map((p, i) => (
              <span key={i} className="px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 italic">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
