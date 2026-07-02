"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ClientThemeProvider from '@/components/ClientThemeProvider'
import { SpecialReportLessonDisplay } from '@/lib/lesson-displays'
import InstantLessonDisplay from '@/components/lesson/InstantLessonDisplay'
import ModularLessonDisplay from '@/components/lesson/ModularLessonDisplay'
import type { SpecialReportLessonContent } from '@/types/module-lesson'

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

  return (
    <ClientThemeProvider>
      <style>{`
        @media print {
          /* Hide UI chrome */
          header, footer, button, .no-print { display: none !important; }

          /* White page */
          body, html, .min-h-screen, .bg-\\[\\#f7f4ef\\] { background: white !important; }
          * { color: black !important; box-shadow: none !important; -webkit-print-color-adjust: exact; }

          /* Full-width, remove page padding */
          .max-w-5xl, .max-w-3xl { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
          main { padding: 0 !important; }

          /* Strip card chrome: no rounded corners, no shadow */
          [class*="rounded"] { border-radius: 0 !important; }
          [class*="shadow"] { box-shadow: none !important; }

          /* Flatten all backgrounds to white */
          [class*="bg-"] { background: white !important; }

          /* Module number box: print as white with black text + right border */
          .bg-\\[\\#1a3a5c\\] { background: white !important; border-right: 2px solid #333 !important; }

          /* Normalize all borders */
          [class*="border-"] { border-color: #ddd !important; }

          /* Module cards: clean section break between them */
          .space-y-8 > div { page-break-inside: avoid; break-inside: avoid; margin-bottom: 1.5rem !important; }

          /* Remove spacing overrides that look bad in print */
          .px-6 { padding-left: 1rem !important; padding-right: 1rem !important; }
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
              ) : lesson.content?.lessonType === 'special-report' ? (
                <SpecialReportLessonDisplay
                  lesson={lesson.content as unknown as SpecialReportLessonContent}
                  showObjectives={true}
                  showProgressBar={true}
                  showHeader={true}
                  isTutorView={false}
                />
              ) : (
                <div className="px-4 py-6 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-600 text-center">
                  This lesson uses a retired format and is no longer available. Please ask your tutor for an updated version.
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