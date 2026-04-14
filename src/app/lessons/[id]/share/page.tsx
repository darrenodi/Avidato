"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ClientThemeProvider from '@/components/ClientThemeProvider'
import { Under18LessonDisplay } from '@/lib/lesson-displays/under-18-display'
import InstantLessonDisplay from '@/components/lesson/InstantLessonDisplay'
import ModularLessonDisplay from '@/components/lesson/ModularLessonDisplay'
import {
  VocabularyExercise,
  WarmupExercise,
  DialogueExercise,
  ComprehensionExercise,
  RolePlayExercise,
  DiscussionExercise,
  PreparationExercise,
  FinalPrepExercise,
  UsefulExpressionsExercise,
} from '@/components/lesson/EngooLessonComponents'
import {
  LeadInExercise,
  TaskPrepExercise,
  TaskPerformanceExercise,
  PostTaskExercise,
  HomeworkExercise,
} from '@/components/lesson/TBLTLessonComponents'
import { PresentationExercise, PracticeExercise, ProductionExercise } from '@/components/lesson/PPPLessonComponents'
import { WarmerExercise, LanguageInputExercise, CommunicativeActivityExercise, WrapUpExercise } from '@/components/lesson/CLTLessonComponents'

interface StudentInfo {
  id: string
  name: string
  level: string
}

interface BaseExerciseContent {
  instructions?: string
  [key: string]: unknown
}

interface LessonExercise {
  type: string
  title?: string
  description?: string
  timeMinutes?: number
  content: BaseExerciseContent
}

interface GrammarExplanationBlock {
  definition?: string
  usage?: string
  examples?: string[]
}

interface GrammarFocusContent extends BaseExerciseContent {
  explanation?: string
  uses?: Array<string | { use?: string; text?: string; example?: string }>
  structures?: Array<string | { pattern?: string; note?: string }>
  contrasts?: Array<string | { contrast?: string; explanation?: string }>
  commonMistakes?: Array<{ incorrect: string; correct: string; why?: string }>
  examples?: string[]
}

interface FillBlankSentence { sentence: string; answer: string; hint?: string }
interface MultipleChoiceQuestion { question: string; options: string[]; correctAnswer: number; explanation?: string }
interface SentenceBuildingItem { instruction: string; words?: string[]; correct?: string; target?: string; from?: string }
interface SentencePracticeItem { sentence: string; context?: string }
interface DialogueLine { speaker: string; text: string }

interface GrammarExerciseContent extends BaseExerciseContent {
  sentences?: FillBlankSentence[] | SentencePracticeItem[]
  questions?: MultipleChoiceQuestion[]
  exercises?: SentenceBuildingItem[]
  dialogue?: DialogueLine[]
  explanation?: string
  uses?: unknown
  structures?: unknown
  contrasts?: unknown
  commonMistakes?: unknown
  examples?: unknown
}

interface SharedLessonContent {
  title?: string
  objective?: string
  context?: string
  duration?: number
  difficulty?: number
  lessonType?: string
  isGrammarLesson?: boolean
  grammarTopic?: string
  explanation?: GrammarExplanationBlock
  skills?: string[]
  vocabulary?: Array<string | { word?: string; term?: string; definition?: string; example?: string; partOfSpeech?: string; phonetics?: string }>
  exercises?: LessonExercise[]
  homework?: string
  materials?: string[]
  teachingNotes?: string
}

interface SharedLessonData {
  id: string
  createdAt: string
  content: SharedLessonContent
  student: StudentInfo
}

interface GrammarExercise {
  type: string
  title?: string
  content: GrammarExerciseContent
}

function SharedFillBlanks({ exercise }: { exercise: GrammarExercise }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showHints, setShowHints] = useState<Record<number, boolean>>({})
  const sentences = (exercise?.content?.sentences as Array<{ sentence: string; answer: string; hint?: string }> | undefined) || []
  if (!sentences.length) return null
  const isCorrect = (i: number) => (answers[i] || '').trim().toLowerCase() === sentences[i].answer.trim().toLowerCase()
  return (
    <div className="space-y-4">
      {sentences.map((s, i) => {
        const val = answers[i] || ''
        const correct = val.length > 0 && isCorrect(i)
        const wrong = val.length > 0 && !isCorrect(i)
        return (
          <div
            key={i}
            className={`rounded p-4 text-sm ${
              correct
                ? 'bg-green-50 border border-green-300'
                : wrong
                ? 'bg-red-50 border border-red-300'
                : 'border border-gray-200 dark:border-gray-700'
            }`}
          >
            <p className="mb-2 text-gray-800 dark:text-gray-200">{s.sentence}</p>
            <input
              type="text"
              value={val}
              onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
              placeholder="Type your answer..."
              className={`px-3 py-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${
                correct ? 'border-green-500' : wrong ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {s.hint && (
              <div className="mt-2">
                <button
                  onClick={() => setShowHints({ ...showHints, [i]: !showHints[i] })}
                  className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-600"
                >
                  Hint
                </button>
                {showHints[i] && (
                  <span className="ml-2 text-xs text-yellow-700 dark:text-yellow-400">{s.hint}</span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SharedMultipleChoice({ exercise }: { exercise: GrammarExercise }) {
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [touched, setTouched] = useState<Record<number, boolean>>({})
  const questions = (exercise?.content?.questions as Array<{
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }> | undefined) || []
  if (!questions.length) return null
  return (
    <ul className="space-y-4">
      {questions.map((q, qi) => {
        const chosen = selected[qi]
        const correct = chosen === q.correctAnswer
        return (
          <li
            key={qi}
            className={`rounded p-4 text-sm ${
              correct
                ? 'bg-green-50 border border-green-300'
                : touched[qi] && chosen !== undefined
                ? 'bg-red-50 border border-red-300'
                : 'border border-gray-200 dark:border-gray-700'
            }`}
          >
            <p className="font-medium text-gray-900 dark:text-white mb-2">{q.question}</p>
            <div className="space-y-1">
              {q.options.map((opt, oi) => {
                const optionSelected = chosen === oi
                const optionIsCorrect = oi === q.correctAnswer
                const highlight =
                  optionSelected && touched[qi]
                    ? optionIsCorrect
                      ? 'bg-green-100 text-green-900'
                      : 'bg-red-100 text-red-900'
                    : optionIsCorrect && correct
                    ? 'bg-green-100 text-green-900'
                    : ''
                return (
                  <label key={oi} className={`flex items-center gap-3 cursor-pointer rounded px-2 py-1 ${highlight}`}>
                    <input
                      type="radio"
                      name={`shared-mcq-${qi}`}
                      checked={optionSelected}
                      onChange={() => {
                        setSelected({ ...selected, [qi]: oi })
                        setTouched({ ...touched, [qi]: true })
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                  </label>
                )
              })}
            </div>
            {touched[qi] && q.explanation && (
              <div className="text-xs text-gray-600 dark:text-gray-400 italic mt-2">{q.explanation}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function SharedSentenceBuilding({ exercise }: { exercise: GrammarExercise }) {
  const [orders, setOrders] = useState<Record<number, string[]>>({})
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [touched, setTouched] = useState<Record<number, boolean>>({})
  const [dragInfo, setDragInfo] = useState<{ ex: number; from: number } | null>(null)
  const list =
    (exercise?.content?.exercises as Array<{
      instruction: string
      words?: string[]
      correct?: string
      target?: string
      from?: string
    }> | undefined) || []
  if (!list.length) return null
  const expectedFor = (i: number) => (list[i].correct || list[i].target || '')
  const tokens = (s: string) => s.split(/\s+/).filter(Boolean)
  return (
    <div className="space-y-4">
      {list.map((ex, i) => {
        const expected = expectedFor(i)
        const hasOrdering = Array.isArray(ex.words) && ex.words.length > 0
        const order = orders[i] || ex.words || []
        const correctOrder = hasOrdering && expected && JSON.stringify(order) === JSON.stringify(tokens(expected))
        const typed = answers[i] || ''
        const textCorrect = !hasOrdering && expected && typed.trim().toLowerCase() === expected.trim().toLowerCase()
        const green = correctOrder || textCorrect
        const red = touched[i] && !green && (hasOrdering || typed.trim().length > 0)
        return (
          <div
            key={i}
            className={`rounded p-4 text-sm ${
              green
                ? 'bg-green-50 border border-green-300'
                : red
                ? 'bg-red-50 border border-red-300'
                : 'border border-gray-200 dark:border-gray-700'
            }`}
          >
            <p className="font-medium text-gray-900 dark:text-white mb-2">{ex.instruction}</p>
            {hasOrdering ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {order.map((w, wi) => (
                  <span
                    key={`${w}-${wi}`}
                    draggable
                    onDragStart={() => setDragInfo({ ex: i, from: wi })}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!dragInfo || dragInfo.ex !== i) return
                      const current = [...order]
                      const [moved] = current.splice(dragInfo.from, 1)
                      current.splice(wi, 0, moved)
                      setOrders({ ...orders, [i]: current })
                      setTouched({ ...touched, [i]: true })
                    }}
                    className={`px-2 py-1 rounded cursor-move select-none ${
                      green
                        ? 'bg-green-100 text-green-900'
                        : red
                        ? 'bg-red-100 text-red-900'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={typed}
                onChange={(e) => {
                  setAnswers({ ...answers, [i]: e.target.value })
                  setTouched({ ...touched, [i]: true })
                }}
                placeholder="Type your sentence..."
                className={`w-full px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${
                  green ? 'border-green-500' : red ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            )}
            {ex.from && <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">Source: {ex.from}</div>}
            {!green && (
              <div className="mt-2">
                <button
                  onClick={() => setTouched({ ...touched, [i]: true })}
                  className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-600"
                >
                  Check Answer
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SharedGrammarLesson({ lesson }: { lesson: SharedLessonData }) {
  const content = lesson.content || {}
  const title = content?.title || ''
  const grammarTopic = content?.grammarTopic || ''
  const context = content?.context || ''
  const explanation = content?.explanation || {}
  const exercises = (Array.isArray(content?.exercises) ? content.exercises : []) as GrammarExercise[]

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        {grammarTopic && (
          <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 mb-4 font-medium">
            Grammar Focus: {grammarTopic}
          </p>
        )}
        {context && <p className="text-gray-600 dark:text-gray-300 mb-4">{context}</p>}
        {explanation && (explanation.definition || explanation.usage || explanation.examples) && (
          <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
            {explanation.definition && (
              <>
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Definition</h2>
                <p className="text-blue-800 dark:text-blue-200 mb-4 whitespace-pre-line">{explanation.definition}</p>
              </>
            )}
            {explanation.usage && (
              <>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Usage</h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4 whitespace-pre-line">{explanation.usage}</p>
              </>
            )}
            {Array.isArray(explanation.examples) && (
              <ul className="space-y-2">
                {explanation.examples.map((ex: string, i: number) => (
                  <li key={i} className="text-blue-700 dark:text-blue-300 italic">{ex}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {exercises.length > 0 && (
        <div className="space-y-6">
          {exercises.map((ex: GrammarExercise, idx: number) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
            >
              {ex.title && <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{ex.title}</h4>}
              {ex.type === 'grammar-focus' && (
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  {ex?.content?.explanation && (
                    <p className="whitespace-pre-line">{String(ex.content.explanation)}</p>
                  )}
                  {Array.isArray(ex?.content?.uses) && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Main Uses</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {Array.isArray((ex.content as GrammarFocusContent).uses) && (ex.content as GrammarFocusContent).uses!.map((u: string | { use?: string; text?: string; example?: string }, i: number) => {
                          if (typeof u === 'string') return <li key={i}>{u}</li>
                          const text = u.use || u.text || ''
                          const example = u.example ? ` – ${u.example}` : ''
                          return (
                            <li key={i}>
                              {text}
                              {example}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(ex?.content?.structures) && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Structures</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {Array.isArray((ex.content as GrammarFocusContent).structures) && (ex.content as GrammarFocusContent).structures!.map((s: string | { pattern?: string; note?: string }, i: number) => {
                          if (typeof s === 'string') return <li key={i}>{s}</li>
                          const pattern = s.pattern || ''
                          const note = s.note ? ` – ${s.note}` : ''
                          return (
                            <li key={i}>
                              {pattern}
                              {note}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(ex?.content?.contrasts) && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Contrasts</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {Array.isArray((ex.content as GrammarFocusContent).contrasts) && (ex.content as GrammarFocusContent).contrasts!.map((c: string | { contrast?: string; explanation?: string }, i: number) => {
                          if (typeof c === 'string') return <li key={i}>{c}</li>
                          const head = c.contrast
                          const expl = c.explanation ? `: ${c.explanation}` : ''
                          return (
                            <li key={i}>
                              {head}
                              {expl}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(ex?.content?.commonMistakes) && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Common Mistakes</h5>
                      <ul className="space-y-2">
                        {Array.isArray((ex.content as GrammarFocusContent).commonMistakes) && (ex.content as GrammarFocusContent).commonMistakes!.map((m: { incorrect: string; correct: string; why?: string }, i: number) => (
                          <li
                            key={i}
                            className="border border-red-200 dark:border-red-800 rounded p-3 text-xs"
                          >
                            <div className="text-red-700 dark:text-red-300">
                              <span className="font-semibold">Incorrect:</span> {m.incorrect}
                            </div>
                            <div className="text-green-700 dark:text-green-300">
                              <span className="font-semibold">Correct:</span> {m.correct}
                            </div>
                            {m.why && (
                              <div className="text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Why:</span> {m.why}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(ex?.content?.examples) && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Examples</h5>
                      <ul className="space-y-1 italic">
                        {ex.content.examples.map((e: string, i: number) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
                  {ex.type === 'sentence-practice' && Array.isArray(ex?.content?.sentences) && (
                    <ul className="space-y-2 text-sm">
                      {(ex.content.sentences as SentencePracticeItem[]).map((s, i) => (
                        <li key={i} className="rounded p-3">
                          <div className="text-gray-900 dark:text-white">{s.sentence}</div>
                          {s.context && (
                            <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 italic">{s.context}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {ex.type === 'dialogue-practice' && Array.isArray(ex?.content?.dialogue) && (
                    <div className="space-y-3 text-sm">
                      {(ex.content.dialogue as DialogueLine[]).map((line, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="font-semibold text-blue-600 dark:text-blue-400 min-w-[90px]">{line.speaker}</span>
                          <span className="flex-1 text-gray-700 dark:text-gray-300">{line.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
              {ex.type === 'fill-blanks' && Array.isArray(ex?.content?.sentences) && <SharedFillBlanks exercise={ex} />}
              {ex.type === 'multiple-choice' && Array.isArray(ex?.content?.questions) && <SharedMultipleChoice exercise={ex} />}
              {ex.type === 'sentence-building' && Array.isArray(ex?.content?.exercises) && <SharedSentenceBuilding exercise={ex} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const renderExerciseContent = (exercise: { type: string; content: BaseExerciseContent; timeMinutes: number }, studentName?: string) => {
  const content = exercise.content || {}
  switch (exercise.type) {
    case 'vocabulary':
      if (Array.isArray(content?.vocabulary)) {
        return <VocabularyExercise vocabulary={content.vocabulary} />
      }
      break
    case 'warmup':
      if (Array.isArray(content?.questions)) {
        return <WarmupExercise questions={content.questions} />
      }
      break
    case 'dialogue':
      if (Array.isArray(content?.dialogue)) {
        const rawDialogue = content.dialogue as Array<Record<string, unknown>>
        const transformedDialogue = rawDialogue.map((l) => ({
          character: (l.speaker || l.character || 'Unknown') as string,
          text: (l.line || l.text || '') as string,
        }))
        const characters = (content.characters as { name: string; role?: string }[]) ||
          [...new Set(transformedDialogue.map(l => l.character))].map(name => ({ name }))
        const setting = (content.setting as string) || (content.context as string) || ''
        const castSpeakers = content.cast as { name: string; gender: 'male' | 'female' }[] | undefined
        return (
          <DialogueExercise context={setting} characters={characters} dialogue={transformedDialogue} instructions={(content.instructions as string) || ''} speakers={castSpeakers} />
        )
      }
      break
    case 'useful-expressions':
      if (Array.isArray(content?.expressions)) {
        return (
          <UsefulExpressionsExercise
            expressions={content.expressions as { phrase: string; meaning: string; example?: string }[]}
            instructions={content.instructions as string | undefined}
          />
        )
      }
      break
    case 'useful-phrases':
      if (Array.isArray(content?.phrases)) {
        return (
          <div className="space-y-3">
            {!!content.context && (
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{String(content.context)}</p>
            )}
            {(content.phrases as Array<{ phrase: string; usage: string }>).map((item, index) => (
              <div key={index} className="flex gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <span className="flex-shrink-0 w-7 h-7 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.phrase}</p>
                  {item.usage && <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{item.usage}</p>}
                </div>
              </div>
            ))}
          </div>
        )
      }
      break
    case 'comprehension':
      if (Array.isArray(content?.questions)) {
        return <ComprehensionExercise questions={content.questions} hideAnswers={true} />
      }
      break
    case 'roleplay':
      if (content?.scenario && Array.isArray(content?.roles)) {
        return (
          <RolePlayExercise scenario={content.scenario as string} roles={content.roles} instructions={(content.instructions as string) || ''} timeMinutes={exercise.timeMinutes} />
        )
      }
      break
    case 'discussion':
      if (Array.isArray(content?.questions)) {
        return <DiscussionExercise questions={content.questions} instructions={content.instructions as string} />
      }
      break
    case 'preparation':
      if (Array.isArray(content?.questions)) {
        return <PreparationExercise questions={content.questions} tips={content.tips as string[]} />
      }
      break
    case 'sentenceCorrection':
    case 'sentence_correction':
    case 'sentence-correction':
      if (Array.isArray(content?.sentences)) {
        return (
          <div className="space-y-3">
            {(content.sentences as Array<{incorrect: string; correct: string; errorType: string}>).map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {item.incorrect}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
      break
    case 'final-prep':
    case 'finalPrep':
    case 'finalprep':
      return (
        <FinalPrepExercise phrases={(content.phrases as string[]) || []} checklist={(content.checklist as string[]) || []} confidence={(content.confidence as string[]) || []} />
      )
    case 'lead-in':
      if (Array.isArray(content?.questions)) {
        return <LeadInExercise content={{ questions: content.questions as string[], instructions: content.instructions as string }} />
      }
      break
    case 'task-prep':
      return <TaskPrepExercise content={content as unknown as Parameters<typeof TaskPrepExercise>[0]['content']} />
    case 'task-performance':
      if (content?.scenario && content?.roles) {
        return <TaskPerformanceExercise content={content as unknown as Parameters<typeof TaskPerformanceExercise>[0]['content']} studentName={studentName} isStudentView={true} />
      }
      break
    case 'post-task':
      if (content?.grammarFocus) {
        return <PostTaskExercise content={content as unknown as Parameters<typeof PostTaskExercise>[0]['content']} isStudentView={true} />
      }
      break
    case 'homework':
      if (content?.taskName) {
        return <HomeworkExercise content={content as unknown as Parameters<typeof HomeworkExercise>[0]['content']} isStudentView={true} />
      }
      break
    case 'presentation':
      return <PresentationExercise content={content as unknown as Parameters<typeof PresentationExercise>[0]['content']} />
    case 'practice':
      return <PracticeExercise content={content as unknown as Parameters<typeof PracticeExercise>[0]['content']} isStudentView={true} />
    case 'production':
      return <ProductionExercise content={content as unknown as Parameters<typeof ProductionExercise>[0]['content']} />
    case 'warmer':
      return <WarmerExercise content={content as unknown as Parameters<typeof WarmerExercise>[0]['content']} isStudentView={true} />
    case 'language-input':
      return <LanguageInputExercise content={content as unknown as Parameters<typeof LanguageInputExercise>[0]['content']} />
    case 'communicative-activity':
      return <CommunicativeActivityExercise content={content as unknown as Parameters<typeof CommunicativeActivityExercise>[0]['content']} isStudentView={true} />
    case 'wrap-up':
      return <WrapUpExercise content={content as unknown as Parameters<typeof WrapUpExercise>[0]['content']} isStudentView={true} />
  }
  return (
    <div className="whitespace-pre-wrap text-gray-900 dark:text-white">{typeof exercise.content === 'string' ? exercise.content : JSON.stringify(exercise.content, null, 2)}</div>
  )
}


export default function SharedLessonPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const lessonId = params?.id as string
  const printMode = searchParams?.get('print') === '1'
  const [lesson, setLesson] = useState<SharedLessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Auto-trigger print dialog when ?print=1 and lesson is loaded
  useEffect(() => {
    if (printMode && !loading && lesson) {
      setTimeout(() => window.print(), 500)
    }
  }, [printMode, loading, lesson])

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/lessons/${lessonId}/share`)
        const data = await res.json()
        if (res.ok) {
          setLesson(data)
        } else {
          setError(data.error || 'Failed to load lesson')
        }
      } catch (e) {
        console.error(e)
        setError('Failed to load lesson. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [lessonId])

  const [openEx, setOpenEx] = useState<Set<number>>(new Set([0,1,2,3,4,5,6,7,8,9]))

  const toggleEx = (index: number) => {
    setOpenEx(prev => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }

  return (
    <ClientThemeProvider>
      <style>{`
        @media print {
          header, footer, button, .no-print { display: none !important; }
          body, .min-h-screen { background: white !important; }
          .max-w-5xl { max-width: 100% !important; padding: 0 !important; }
          * { color: black !important; border-color: #ccc !important; box-shadow: none !important; }
          .bg-white, [class*="bg-gray"], [class*="bg-brand"], [class*="dark\\:"] { background: white !important; }
        }
      `}</style>
      <div className="min-h-screen bg-[#f7f4ef]">
        <header className="bg-white border-b border-gray-200/60 no-print">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Avidato Logo" width={28} height={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              <Image src="/logo-dec.svg" alt="Avidato" width={80} height={24} className="h-4 sm:h-5" />
            </Link>
            {lesson && (
              <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">{lesson.student.name}</span>
            )}
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading lesson...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Unable to Load Lesson</h3>
              <p className="text-sm sm:text-base text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {!loading && !error && lesson && (
            <>
              {lesson.content?.isGrammarLesson ? (
                <SharedGrammarLesson lesson={lesson} />
              ) : lesson.content?.lessonType === 'instant' ? (
                <InstantLessonDisplay
                  lesson={{
                    title: lesson.content.title || '',
                    lessonType: lesson.content.lessonType || 'instant',
                    difficulty: lesson.content.difficulty || 0,
                    duration: lesson.content.duration || 0,
                    objective: lesson.content.objective || '',
                    skills: lesson.content.skills || [],
                    context: lesson.content.context || '',
                    vocabulary: (lesson.content.vocabulary?.filter(v => typeof v === 'object') || []) as Array<{
                      word?: string
                      term?: string
                      definition?: string
                      example?: string
                      partOfSpeech?: string
                      phonetics?: string
                    }>,
                    exercises: (lesson.content.exercises || []).map(ex => ({
                      type: ex.type || '',
                      title: ex.title || '',
                      description: ex.description || '',
                      content: ex.content || '',
                      timeMinutes: ex.timeMinutes || 0
                    })),
                    homework: lesson.content.homework,
                    materials: lesson.content.materials,
                    teachingNotes: lesson.content.teachingNotes
                  }}
                  isStudentView={true}
                  studentName={lesson.student?.name}
                />
              ) : lesson.content?.lessonType === 'modular' ? (
                <ModularLessonDisplay
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  lesson={lesson.content as any}
                  isStudentView={true}
                  studentName={lesson.student?.name}
                />
              ) : lesson.content?.lessonType === 'Under-18' ? (
                <Under18LessonDisplay
                  lesson={{
                    metadata: {
                      id: lesson.id,
                      title: lesson.content.title || '',
                      level: lesson.student.level,
                      topic: lesson.content.title || '',
                      duration: lesson.content.duration || 0,
                      difficulty: lesson.content.difficulty || 0,
                      targetAudience: 'Under 18',
                      ageGroup: 'Under 18',
                    },
                    learningObjectives: {
                      communicative: [lesson.content.objective || ''],
                      linguistic: lesson.content.skills || [],
                      cultural: [],
                    },
                    exercises: (lesson.content.exercises || []).map((ex: LessonExercise, i: number) => ({
                      id: `exercise-${i}`,
                      number: i + 1,
                      type: ex.type,
                      title: ex.title || '',
                      description: ex.description || '',
                      timeMinutes: ex.timeMinutes || 0,
                      instructions: ex?.content?.instructions || 'Complete this exercise',
                      content: (ex?.content as Record<string, unknown>) || {},
                    })),
                  }}
                  showObjectives={true}
                  showProgressBar={true}
                  isTutorView={false}
                />
              ) : (
                <div className="xl:flex xl:gap-10">
                  {/* Progress sidebar dots — xl+ only */}
                  <aside className="hidden xl:block w-10 flex-shrink-0">
                    <div className="sticky top-8 flex flex-col items-center gap-3 pt-2">
                      {(lesson.content.exercises || []).map((_: LessonExercise, i: number) => {
                        const dotColors = ['bg-[#2d6a4f]', 'bg-[#b5620b]', 'bg-[#4a3f8f]', 'bg-[#0e7490]', 'bg-[#9d174d]']
                        return (
                          <button
                            key={i}
                            onClick={() => document.getElementById(`ex-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                            className={`w-2.5 h-2.5 rounded-full transition-opacity hover:opacity-100 ${dotColors[i % dotColors.length]} ${openEx.has(i) ? 'opacity-80' : 'opacity-30'}`}
                            aria-label={`Go to exercise ${i + 1}`}
                          />
                        )
                      })}
                    </div>
                  </aside>

                  <div className="flex-1 min-w-0">
                    {/* Hero */}
                    <div className="mb-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-500">{lesson.student.level}</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-500">{lesson.content.duration} min</span>
                        {lesson.content.lessonType && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#2d6a4f]/10 text-[#2d6a4f] border border-[#2d6a4f]/20">{lesson.content.lessonType === 'Under-18' ? 'Kids' : lesson.content.lessonType}</span>
                        )}
                      </div>
                      <h1 className="font-fraunces text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-5">{lesson.content.title}</h1>
                      {lesson.content.objective && (
                        <div className="border-l-4 border-[#2d6a4f] pl-4 py-0.5 mb-5">
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            {lesson.content.objective.replace(new RegExp(`\\b${lesson.student.name}\\b`, 'gi'), 'you').replace(/\byou will\b/gi, "you'll")}
                          </p>
                        </div>
                      )}
                      {Array.isArray(lesson.content.skills) && lesson.content.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {lesson.content.skills.map((s: string) => (
                            <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-[#2d6a4f]/10 text-[#2d6a4f] font-medium">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Exercise cards */}
                    <div className="space-y-3">
                      {(lesson.content.exercises || []).map((exercise: LessonExercise, index: number) => {
                        const badgeColors = ['bg-[#2d6a4f]', 'bg-[#b5620b]', 'bg-[#4a3f8f]', 'bg-[#0e7490]', 'bg-[#9d174d]']
                        const badgeColor = badgeColors[index % badgeColors.length]
                        const isOpen = openEx.has(index)
                        return (
                          <div key={index} id={`ex-${index}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <button
                              onClick={() => toggleEx(index)}
                              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/80 transition-colors"
                            >
                              <span className={`${badgeColor} text-white text-xs font-bold w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 tabular-nums`}>
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm">{exercise.title}</p>
                                {exercise.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{exercise.description}</p>}
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-xs text-gray-400">{exercise.timeMinutes} min</span>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>
                            {isOpen && (
                              <div className="px-5 pb-5 pt-1 border-t border-gray-100 overflow-x-auto">
                                {renderExerciseContent({ type: exercise.type, content: exercise.content, timeMinutes: exercise.timeMinutes || 0 }, lesson.student.name)}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="text-center pt-8 pb-4">
                      <p className="text-gray-400 text-xs">Lesson created with Avidato · {new Date(lesson.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {!loading && !lesson && !error && (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Lesson Not Available</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">This lesson may have been removed or is no longer accessible.</p>
              <Link href="/" className="inline-flex items-center px-6 py-3 rounded-md bg-brand-primary text-white hover:bg-brand-accent text-sm font-medium">Visit Avidato</Link>
            </div>
          )}
        </main>
      </div>
    </ClientThemeProvider>
  )
}