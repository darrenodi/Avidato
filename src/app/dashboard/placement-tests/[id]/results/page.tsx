'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { getPlacementResult, applyPlacementLevel } from '@/app/actions/placement-tests'

// ─── Types ───────────────────────────────────────────────────────────

interface Answer {
  isCorrect: boolean
  selectedAnswer: string
  timeTakenSecs: number
  questionOrder: number
  question: {
    stem: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctAnswer: string
    explanation: string | null
    topic: string
    cefrLevel: string
    recommendedTopic: string | null
  }
}

interface SectionAttempt {
  id: string
  section: string
  status: string
  questionsAsked: number
  correctCount: number
  currentLevel: string
  determinedLevel: string | null
  score: number | null
  timeSpentSecs: number
  answers: Answer[]
}

interface ResultData {
  overallLevel: string
  grammarLevel: string | null
  readingLevel: string | null
  grammarScore: number | null
  readingScore: number | null
  strengths: string[]
  weaknesses: string[]
  recommendations: Array<{ topic: string; level: string; reason: string }>
  certificateId: string | null
  totalTimeSecs: number
  assignment: {
    id: string
    sections: string[]
    studentFullName: string | null
    createdAt: string
    completedAt: string | null
    student: { name: string; level: string | null }
    attempts: SectionAttempt[]
  }
}

// ─── CEFR Config ─────────────────────────────────────────────────────

const CEFR_CONFIG: Record<string, { label: string; color: string; textClass: string; bgClass: string; borderClass: string }> = {
  A1: { label: 'Beginner', color: '#22c55e', textClass: 'text-green-600', bgClass: 'bg-green-50', borderClass: 'border-green-200' },
  A2: { label: 'Elementary', color: '#84cc16', textClass: 'text-lime-600', bgClass: 'bg-lime-50', borderClass: 'border-lime-200' },
  B1: { label: 'Intermediate', color: '#eab308', textClass: 'text-yellow-600', bgClass: 'bg-yellow-50', borderClass: 'border-yellow-200' },
  B2: { label: 'Upper Intermediate', color: '#f97316', textClass: 'text-orange-600', bgClass: 'bg-orange-50', borderClass: 'border-orange-200' },
  C1: { label: 'Advanced', color: '#ef4444', textClass: 'text-red-600', bgClass: 'bg-red-50', borderClass: 'border-red-200' },
  C2: { label: 'Proficiency', color: '#a855f7', textClass: 'text-purple-600', bgClass: 'bg-purple-50', borderClass: 'border-purple-200' },
}

// ─── Component ───────────────────────────────────────────────────────

export default function PlacementTestResultsPage() {
  const params = useParams()
  const router = useRouter()
  const assignmentId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResultData | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [levelApplied, setLevelApplied] = useState(false)
  const [applyingLevel, setApplyingLevel] = useState(false)
  const [promptDismissed, setPromptDismissed] = useState(false)
  const hasFetched = useRef(false)

  const loadResult = useCallback(async () => {
    setLoading(true)
    const res = await getPlacementResult(assignmentId)
    if (!res.success || !res.data) {
      setError(res.error || 'Failed to load results.')
      setLoading(false)
      return
    }
    setResult(res.data.result as unknown as ResultData)
    setLoading(false)
  }, [assignmentId])

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      loadResult()
    }
  }, [loadResult])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  useEffect(() => {
    if (!result || levelApplied || promptDismissed) return
    const timer = setTimeout(() => setPromptDismissed(true), 30000)
    return () => clearTimeout(timer)
  }, [result, levelApplied, promptDismissed])

  const handleApplyLevel = async () => {
    setApplyingLevel(true)
    const res = await applyPlacementLevel(assignmentId)
    if (res.success) {
      setLevelApplied(true)
      if (result) {
        setResult({
          ...result,
          assignment: {
            ...result.assignment,
            student: { ...result.assignment.student, level: result.overallLevel },
          },
        })
      }
    }
    setApplyingLevel(false)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/placement-tests')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Placement Test Results
            </h1>
            {result && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {result.assignment.student?.name || result.assignment.studentFullName || 'Student'}
                {result.assignment.completedAt && (
                  <span> &middot; Completed {formatDate(result.assignment.completedAt)}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#3d74b5]" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {result && !loading && (
          <>
            {/* Overall Result Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="bg-gradient-to-r from-[#3d74b5] to-[#5ebbc8] px-6 py-6 text-center text-white">
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/60">
                  Overall CEFR Level
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-5xl font-black">{result.overallLevel}</span>
                  <span className="text-lg font-medium text-white/80">
                    {CEFR_CONFIG[result.overallLevel]?.label || ''}
                  </span>
                </div>
              </div>

              <div className="grid divide-y sm:grid-cols-4 sm:divide-x sm:divide-y-0 divide-slate-100 dark:divide-slate-700">
                {result.grammarLevel && (
                  <div className="px-5 py-4 text-center">
                    <p className="text-xs text-slate-400 uppercase mb-1">Grammar</p>
                    <p className="text-2xl font-bold" style={{ color: CEFR_CONFIG[result.grammarLevel]?.color }}>
                      {result.grammarLevel}
                    </p>
                    {result.grammarScore !== null && (
                      <p className="text-sm text-slate-500">{result.grammarScore}%</p>
                    )}
                  </div>
                )}
                {result.readingLevel && (
                  <div className="px-5 py-4 text-center">
                    <p className="text-xs text-slate-400 uppercase mb-1">Reading</p>
                    <p className="text-2xl font-bold" style={{ color: CEFR_CONFIG[result.readingLevel]?.color }}>
                      {result.readingLevel}
                    </p>
                    {result.readingScore !== null && (
                      <p className="text-sm text-slate-500">{result.readingScore}%</p>
                    )}
                  </div>
                )}
                <div className="px-5 py-4 text-center">
                  <p className="text-xs text-slate-400 uppercase mb-1">Time</p>
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                    {formatTime(result.totalTimeSecs)}
                  </p>
                </div>
                <div className="px-5 py-4 text-center">
                  <p className="text-xs text-slate-400 uppercase mb-1">Certificate</p>
                  <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 break-all">
                    {result.certificateId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Level Update Prompt */}
            {(() => {
              const currentLevel = result.assignment.student?.level
              const determinedLevel = result.overallLevel
              const shouldPrompt = (!currentLevel || currentLevel !== determinedLevel) && !levelApplied && !promptDismissed

              if (shouldPrompt) {
                return (
                  <div className="flex items-center justify-between rounded-xl border border-[#3d74b5]/20 bg-white px-5 py-4 dark:border-[#3d74b5]/30 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3d74b5]/10 text-[#3d74b5]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {currentLevel
                            ? <>Student is currently set to <span className="font-bold">{currentLevel}</span> but tested at <span className="font-bold">{determinedLevel}</span></>
                            : <>Student has no level set. Test determined <span className="font-bold">{determinedLevel}</span></>
                          }
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Update their profile to match the placement result?
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleApplyLevel}
                      disabled={applyingLevel}
                      className="flex-shrink-0 rounded-lg bg-[#3d74b5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f5f9a] disabled:opacity-50"
                    >
                      {applyingLevel ? 'Updating...' : `Set to ${determinedLevel}`}
                    </button>
                  </div>
                )
              }

              if (levelApplied) {
                return (
                  <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 dark:border-green-800/40 dark:bg-slate-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Student level updated to {determinedLevel}
                    </p>
                  </div>
                )
              }

              return null
            })()}
            {/* Strengths & Weaknesses */}
            {(result.strengths.length > 0 || result.weaknesses.length > 0) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {result.strengths.length > 0 && (
                  <div className="rounded-xl border border-green-200 bg-white p-5 dark:border-green-800/40 dark:bg-slate-800">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Strengths
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.strengths.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 capitalize dark:bg-green-900/30 dark:text-green-300"
                        >
                          {s.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {result.weaknesses.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-white p-5 dark:border-amber-800/40 dark:bg-slate-800">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                      </svg>
                      Areas to Improve
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.weaknesses.map((w, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 capitalize dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {w.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <svg className="h-4 w-4 text-[#3d74b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  Recommended Focus Areas
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-700/50"
                    >
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${
                          CEFR_CONFIG[rec.level]?.bgClass || 'bg-slate-100'
                        } ${CEFR_CONFIG[rec.level]?.textClass || 'text-slate-600'}`}
                      >
                        {rec.level}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-700 capitalize dark:text-slate-200">
                          {rec.topic.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-slate-500">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Detail Toggles */}
            {result.assignment.attempts.map((attempt) => {
              const isExpanded = expandedSection === attempt.section
              const sectionLabel = attempt.section === 'grammar' ? 'Grammar & Structure' : 'Reading Comprehension'

              return (
                <div
                  key={attempt.section}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                >
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : attempt.section)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-800 dark:text-white">
                        {sectionLabel}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        {attempt.correctCount}/{attempt.questionsAsked} correct
                      </span>
                      {attempt.determinedLevel && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            CEFR_CONFIG[attempt.determinedLevel]?.bgClass || ''
                          } ${CEFR_CONFIG[attempt.determinedLevel]?.textClass || ''}`}
                        >
                          {attempt.determinedLevel}
                        </span>
                      )}
                    </div>
                    <svg
                      className={`h-5 w-5 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {isExpanded && attempt.answers && (
                    <div className="border-t border-slate-100 dark:border-slate-700">
                      <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                        {attempt.answers.map((answer, idx) => {
                          const q = answer.question
                          const levelCfg = CEFR_CONFIG[q.cefrLevel] || CEFR_CONFIG.B1
                          const options: Record<string, string> = {
                            A: q.optionA,
                            B: q.optionB,
                            C: q.optionC,
                            D: q.optionD,
                          }

                          return (
                            <div key={idx} className="px-5 py-4">
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2">
                                  <span className="mt-0.5 flex-shrink-0">
                                    {answer.isCorrect ? (
                                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                      </span>
                                    ) : (
                                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </span>
                                    )}
                                  </span>
                                  <p className="text-sm text-slate-700 dark:text-slate-200">
                                    {q.stem}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${levelCfg.bgClass} ${levelCfg.textClass}`}
                                  >
                                    {q.cefrLevel}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {answer.timeTakenSecs}s
                                  </span>
                                </div>
                              </div>

                              {/* Show selected vs correct if wrong */}
                              {!answer.isCorrect && (
                                <div className="ml-7 mb-1 space-y-1">
                                  <p className="text-xs text-red-500">
                                    <span className="font-medium">Selected:</span>{' '}
                                    {answer.selectedAnswer}) {options[answer.selectedAnswer] || ''}
                                  </p>
                                  <p className="text-xs text-green-600">
                                    <span className="font-medium">Correct:</span>{' '}
                                    {q.correctAnswer}) {options[q.correctAnswer] || ''}
                                  </p>
                                </div>
                              )}

                              {/* Topic tag */}
                              <div className="ml-7 mt-1 flex items-center gap-2">
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 capitalize dark:bg-slate-700 dark:text-slate-400">
                                  {q.topic.replace(/-/g, ' ')}
                                </span>
                                {q.explanation && !answer.isCorrect && (
                                  <span className="text-[10px] text-slate-400 italic">
                                    {q.explanation}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
