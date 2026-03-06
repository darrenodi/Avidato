'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import {
  getTestByToken,
  startSection,
  getNextTestQuestion,
  submitAnswer,
  getResultByToken,
} from '../../actions/placement-tests'

// ─── Types ───────────────────────────────────────────────────────────

interface TestAssignment {
  id: string
  shareToken: string
  status: string
  sections: string[]
  studentFullName: string | null
  student: { name: string } | null
  assignedBy: { name: string | null } | null
  attempts: SectionAttempt[]
  result: TestResult | null
}

interface SectionAttempt {
  id: string
  section: string
  status: string
  questionsAsked: number
  correctCount: number
  consecutiveCorrect: number
  consecutiveWrong: number
  currentLevel: string
  determinedLevel: string | null
  score: number | null
  timeSpentSecs: number
}

interface TestResult {
  overallLevel: string
  grammarLevel: string | null
  readingLevel: string | null
  grammarScore: number | null
  readingScore: number | null
  strengths: string[]
  weaknesses: string[]
  certificateId: string | null
  totalTimeSecs: number
}

interface Question {
  id: string
  stem: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  cefrLevel: string
  topic: string
  readingPassage: { title: string; content: string } | null
}

interface Progress {
  questionsAsked: number
  currentLevel: string
  maxQuestions: number
}

interface AnswerFeedback {
  isCorrect: boolean
  correctAnswer: string
  explanation: string | null
  sectionComplete: boolean
  progress: Progress
}

type Screen =
  | 'loading'
  | 'error'
  | 'welcome'
  | 'section-intro'
  | 'question'
  | 'section-complete'
  | 'test-complete'
  | 'results'

// ─── CEFR Level Config ──────────────────────────────────────────────

const CEFR_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  A1: { label: 'Beginner', color: '#22c55e', bg: 'bg-green-500' },
  A2: { label: 'Elementary', color: '#84cc16', bg: 'bg-lime-500' },
  B1: { label: 'Intermediate', color: '#eab308', bg: 'bg-yellow-500' },
  B2: { label: 'Upper Intermediate', color: '#f97316', bg: 'bg-orange-500' },
  C1: { label: 'Advanced', color: '#ef4444', bg: 'bg-red-500' },
  C2: { label: 'Proficiency', color: '#a855f7', bg: 'bg-purple-500' },
}

const SECTION_LABELS: Record<string, { title: string; icon: string; description: string }> = {
  grammar: {
    title: 'Grammar & Structure',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    description: 'Test your knowledge of English grammar, vocabulary, and sentence structure across all CEFR levels.',
  },
  reading: {
    title: 'Reading Comprehension',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    description: 'Read passages and answer comprehension questions to assess your reading ability.',
  },
}

// ─── Component ───────────────────────────────────────────────────────

export default function PlacementTestPage() {
  const params = useParams()
  const token = params.token as string

  // State
  const [screen, setScreen] = useState<Screen>('loading')
  const [error, setError] = useState<string | null>(null)
  const [assignment, setAssignment] = useState<TestAssignment | null>(null)

  // Current section
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)

  // Question state
  const [question, setQuestion] = useState<Question | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [passageProgress, setPassageProgress] = useState<{ current: number; total: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Timer
  const questionStartTime = useRef<number>(0)

  // Results
  const [results, setResults] = useState<{ studentName: string; result: TestResult } | null>(null)

  // ─── Load Test ──────────────────────────────────────────────────

  const loadTest = useCallback(async () => {
    setScreen('loading')
    const res = await getTestByToken(token)
    if (!res.success || !res.data) {
      setError(res.error || 'Failed to load test.')
      setScreen('error')
      return
    }

    const a = res.data.assignment as TestAssignment
    setAssignment(a)

    if (a.status === 'completed' && a.result) {
      setScreen('results')
      setResults({
        studentName: a.student?.name || a.studentFullName || 'Student',
        result: a.result,
      })
    } else {
      setScreen('welcome')
    }
  }, [token])

  useEffect(() => {
    loadTest()
  }, [loadTest])

  // ─── Section Helpers ────────────────────────────────────────────

  function getCompletedSections(): string[] {
    if (!assignment) return []
    return assignment.attempts
      .filter((a) => a.status === 'completed')
      .map((a) => a.section)
  }

  function getNextUncompletedSection(): string | null {
    if (!assignment) return null
    const completed = getCompletedSections()
    return assignment.sections.find((s) => !completed.includes(s)) || null
  }

  // ─── Start Section ─────────────────────────────────────────────

  async function handleStartSection(section: string) {
    setCurrentSection(section)
    setScreen('loading')

    const res = await startSection(token, section)
    if (!res.success || !res.data) {
      setError(res.error || 'Failed to start section.')
      setScreen('error')
      return
    }

    setAttemptId(res.data.attemptId as string)
    await loadNextQuestion(res.data.attemptId as string)
  }

  // ─── Load Next Question ────────────────────────────────────────

  async function loadNextQuestion(aId: string) {
    const res = await getNextTestQuestion(aId)
    if (!res.success || !res.data) {
      setError(res.error || 'Failed to load question.')
      setScreen('error')
      return
    }

    if (res.data.complete) {
      handleSectionDone()
      return
    }

    setQuestion(res.data.question as Question)
    setProgress(res.data.progress as Progress)
    setPassageProgress(res.data.passageProgress as { current: number; total: number } | null ?? null)
    questionStartTime.current = Date.now()
    setScreen('question')
  }

  // ─── Submit Answer (instant - click fires submit + loads next) ─

  async function handleSelectAndSubmit(answer: string) {
    if (!attemptId || !question || isSubmitting) return
    setIsSubmitting(true)

    const timeTaken = Math.round((Date.now() - questionStartTime.current) / 1000)

    // Submit answer and fetch next question in parallel
    const [submitRes] = await Promise.all([
      submitAnswer(attemptId, question.id, answer, timeTaken),
    ])

    if (!submitRes.success || !submitRes.data) {
      setError(submitRes.error || 'Failed to submit answer.')
      setScreen('error')
      setIsSubmitting(false)
      return
    }

    const fb = submitRes.data as unknown as AnswerFeedback
    setProgress(fb.progress)

    if (fb.sectionComplete) {
      setIsSubmitting(false)
      handleSectionDone()
    } else {
      // Load the next question immediately
      await loadNextQuestion(attemptId)
      setIsSubmitting(false)
    }
  }

  // ─── Section Done ──────────────────────────────────────────────

  function handleSectionDone() {
    // Reload test to get updated attempts
    getTestByToken(token).then((res) => {
      if (res.success && res.data) {
        const a = res.data.assignment as TestAssignment
        setAssignment(a)

        if (a.status === 'completed') {
          // Load results
          getResultByToken(token).then((rr) => {
            if (rr.success && rr.data) {
              setResults({
                studentName: (rr.data.studentName as string) || 'Student',
                result: rr.data.result as TestResult,
              })
              setScreen('results')
            } else {
              setScreen('test-complete')
            }
          })
        } else {
          setScreen('section-complete')
        }
      }
    })
  }

  // ─── Proceed to Next Section ───────────────────────────────────

  function handleNextSection() {
    const next = getNextUncompletedSection()
    if (next) {
      setCurrentSection(next)
      setScreen('section-intro')
    } else {
      setScreen('test-complete')
    }
  }

  // ─── Render ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Avidato"
              width={32}
              height={32}
              priority
            />
            <Image
              src="/logo-dec.svg"
              alt="Avidato"
              width={110}
              height={26}
              priority
            />
          </div>
          <span className="text-sm text-slate-500">Placement Test</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {screen === 'loading' && <LoadingScreen />}
        {screen === 'error' && <ErrorScreen message={error} onRetry={loadTest} />}
        {screen === 'welcome' && assignment && (
          <WelcomeScreen
            assignment={assignment}
            onStartSection={(section) => {
              setCurrentSection(section)
              setScreen('section-intro')
            }}
          />
        )}
        {screen === 'section-intro' && currentSection && (
          <SectionIntroScreen
            section={currentSection}
            onStart={() => handleStartSection(currentSection)}
          />
        )}
        {screen === 'question' && question && progress && (
          <QuestionScreen
            question={question}
            progress={progress}
            section={currentSection || 'grammar'}
            isSubmitting={isSubmitting}
            onSelectAnswer={handleSelectAndSubmit}
            passageProgress={passageProgress}
          />
        )}
        {screen === 'section-complete' && currentSection && (
          <SectionCompleteScreen
            section={currentSection}
            attempt={assignment?.attempts.find((a) => a.section === currentSection) || null}
            onNext={handleNextSection}
          />
        )}
        {screen === 'test-complete' && (
          <TestCompleteScreen onViewResults={() => loadTest()} />
        )}
        {screen === 'results' && results && (
          <ResultsScreen studentName={results.studentName} result={results.result} />
        )}
      </main>
    </div>
  )
}

// ─── Sub-Components ──────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#3d74b5]" />
        <p className="text-slate-500">Loading your test...</p>
      </div>
    </div>
  )
}

function ErrorScreen({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-slate-800">Something went wrong</h2>
        <p className="mb-6 text-slate-500">{message || 'An unexpected error occurred.'}</p>
        <button
          onClick={onRetry}
          className="rounded-xl bg-[#3d74b5] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d5a8e]"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

function WelcomeScreen({
  assignment,
  onStartSection,
}: {
  assignment: TestAssignment
  onStartSection: (section: string) => void
}) {
  const studentName = assignment.student?.name || assignment.studentFullName || 'Student'
  const completedSections = assignment.attempts
    .filter((a) => a.status === 'completed')
    .map((a) => a.section)
  const inProgressSections = assignment.attempts
    .filter((a) => a.status === 'in_progress')
    .map((a) => a.section)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        {/* Greeting */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3d74b5] to-[#5ebbc8]">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">
            Welcome, {studentName}!
          </h1>
          <p className="text-slate-500">
            Your English placement test is ready. This test will determine your CEFR level
            from A1 (Beginner) to C2 (Proficiency).
          </p>
        </div>

        {/* Info Cards */}
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <p className="text-2xl font-bold text-[#3d74b5]">{assignment.sections.length}</p>
            <p className="text-xs text-slate-500">
              {assignment.sections.length === 1 ? 'Section' : 'Sections'}
            </p>
          </div>
          <div className="rounded-xl bg-teal-50 p-4 text-center">
            <p className="text-2xl font-bold text-[#5ebbc8]">15-30</p>
            <p className="text-xs text-slate-500">Questions per section</p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-500">Adaptive</p>
            <p className="text-xs text-slate-500">Adjusts to your level</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Before you begin
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#5ebbc8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Answer each question to the best of your ability. There is no penalty for guessing.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#5ebbc8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              The test adapts to your level. Questions will get harder or easier based on your answers.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#5ebbc8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Each section takes approximately 10-15 minutes to complete.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#5ebbc8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              You cannot go back to previous questions. Take your time with each one.
            </li>
          </ul>
        </div>

        {/* Sections */}
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Test Sections
        </h3>
        <div className="space-y-3">
          {assignment.sections.map((section) => {
            const isCompleted = completedSections.includes(section)
            const isInProgress = inProgressSections.includes(section)
            const attempt = assignment.attempts.find((a) => a.section === section)
            const cfg = SECTION_LABELS[section] || {
              title: section,
              icon: '',
              description: '',
            }

            return (
              <div
                key={section}
                className={`rounded-xl border p-5 transition-all ${
                  isCompleted
                    ? 'border-green-200 bg-green-50'
                    : 'border-slate-200 bg-white hover:border-[#3d74b5]/30 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <svg className="h-5 w-5 text-[#3d74b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={cfg.icon} />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-800">{cfg.title}</h4>
                      <p className="text-xs text-slate-500">
                        {isCompleted
                          ? `Completed - Level: ${attempt?.determinedLevel || 'N/A'}`
                          : isInProgress
                          ? `In progress - ${attempt?.questionsAsked || 0} questions answered`
                          : cfg.description}
                      </p>
                    </div>
                  </div>
                  {!isCompleted && (
                    <button
                      onClick={() => onStartSection(section)}
                      className="rounded-lg bg-[#3d74b5] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d5a8e]"
                    >
                      {isInProgress ? 'Continue' : 'Start'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SectionIntroScreen({
  section,
  onStart,
}: {
  section: string
  onStart: () => void
}) {
  const cfg = SECTION_LABELS[section] || { title: section, icon: '', description: '' }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3d74b5] to-[#5ebbc8]">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={cfg.icon} />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-800">{cfg.title}</h2>
        <p className="mb-6 text-slate-500">{cfg.description}</p>

        <div className="mb-8 space-y-2 text-left">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-lg">15-30</span>
            <span className="text-sm text-slate-500">adaptive questions</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-lg">~15 min</span>
            <span className="text-sm text-slate-500">estimated duration</span>
          </div>
          {section === 'reading' && (
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-lg">Passages</span>
              <span className="text-sm text-slate-500">read carefully before answering</span>
            </div>
          )}
        </div>

        <button
          onClick={onStart}
          className="w-full rounded-xl bg-[#3d74b5] py-3. px-6 py-3 text-base font-semibold text-white transition-all hover:bg-[#2d5a8e] hover:shadow-lg"
        >
          Begin Section
        </button>
      </div>
    </div>
  )
}

function QuestionScreen({
  question,
  progress,
  section,
  isSubmitting,
  onSelectAnswer,
  passageProgress,
}: {
  question: Question
  progress: Progress
  section: string
  isSubmitting: boolean
  onSelectAnswer: (answer: string) => void
  passageProgress: { current: number; total: number } | null
}) {
  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD },
  ]

  const progressPercent = Math.round(
    (progress.questionsAsked / progress.maxQuestions) * 100
  )

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Question {progress.questionsAsked + 1}
            <span className="text-slate-300"> / up to {progress.maxQuestions}</span>
          </span>
          <span className="text-xs font-medium text-slate-400 uppercase">
            {section === 'reading' ? 'Reading' : 'Grammar'}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3d74b5] to-[#5ebbc8] transition-all duration-500 ease-out"
            style={{ width: `${Math.max(3, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Reading Passage */}
      {question.readingPassage && (
        <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#3d74b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-sm font-semibold text-[#3d74b5]">
                {question.readingPassage.title}
              </h3>
            </div>
            {passageProgress && (
              <span className="rounded-full bg-[#3d74b5]/10 px-3 py-1 text-xs font-medium text-[#3d74b5]">
                Question {passageProgress.current} of {passageProgress.total}
              </span>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto text-sm leading-relaxed text-slate-700 sm:max-h-80">
            {question.readingPassage.content.split('\n').map((para, i) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>
                {para}
              </p>
            ))}
          </div>
          {passageProgress && (
            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: passageProgress.total }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i < passageProgress.current
                      ? 'bg-[#3d74b5]'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Question Card */}
      <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        {/* Stem */}
        <p className="mb-6 text-lg font-medium leading-relaxed text-slate-800">
          {question.stem}
        </p>

        {/* Options - click to answer immediately */}
        <div className="space-y-3">
          {options.map(({ key, text }) => (
            <button
              key={key}
              onClick={() => onSelectAnswer(key)}
              disabled={isSubmitting}
              className={`group flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                isSubmitting
                  ? 'cursor-not-allowed border-slate-100 opacity-50'
                  : 'cursor-pointer border-slate-100 bg-white hover:border-[#3d74b5] hover:bg-blue-50 hover:shadow-sm active:scale-[0.98]'
              }`}
            >
              <span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-500 transition-colors group-hover:bg-[#3d74b5] group-hover:text-white"
              >
                {key}
              </span>
              <span className="text-base text-slate-600 group-hover:text-slate-800 group-hover:font-medium">
                {text}
              </span>
            </button>
          ))}
        </div>

        {/* Submitting indicator */}
        {isSubmitting && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading next question...
          </div>
        )}
      </div>
    </div>
  )
}

function SectionCompleteScreen({
  section,
  attempt,
  onNext,
}: {
  section: string
  attempt: SectionAttempt | null
  onNext: () => void
}) {
  const cfg = SECTION_LABELS[section] || { title: section, icon: '', description: '' }
  const level = attempt?.determinedLevel || 'B1'
  const cefrCfg = CEFR_CONFIG[level] || CEFR_CONFIG.B1

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-slate-800">Section Complete!</h2>
        <p className="mb-6 text-slate-500">
          You have finished the {cfg.title} section.
        </p>

        {attempt && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xl font-bold" style={{ color: cefrCfg.color }}>
                {level}
              </p>
              <p className="text-xs text-slate-400">Level</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xl font-bold text-slate-700">
                {attempt.correctCount}/{attempt.questionsAsked}
              </p>
              <p className="text-xs text-slate-400">Correct</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xl font-bold text-slate-700">
                {attempt.score !== null ? `${attempt.score}%` : '-'}
              </p>
              <p className="text-xs text-slate-400">Score</p>
            </div>
          </div>
        )}

        <button
          onClick={onNext}
          className="w-full rounded-xl bg-[#3d74b5] py-3.5 text-base font-semibold text-white transition-all hover:bg-[#2d5a8e] hover:shadow-lg"
        >
          Continue to Next Section
        </button>
      </div>
    </div>
  )
}

function TestCompleteScreen({ onViewResults }: { onViewResults: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-slate-800">Test Complete!</h2>
        <p className="mb-8 text-slate-500">
          Congratulations! You have completed all sections of the placement test.
          Your results are being prepared.
        </p>

        <button
          onClick={onViewResults}
          className="w-full rounded-xl bg-[#3d74b5] py-3.5 text-base font-semibold text-white transition-all hover:bg-[#2d5a8e] hover:shadow-lg"
        >
          View My Results
        </button>
      </div>
    </div>
  )
}

function ResultsScreen({
  studentName,
  result,
}: {
  studentName: string
  result: TestResult
}) {
  const level = result.overallLevel
  const cefrCfg = CEFR_CONFIG[level] || CEFR_CONFIG.B1

  const CEFR_DESCRIPTIONS: Record<string, string> = {
    A1: 'Can understand and use familiar everyday expressions and very basic phrases.',
    A2: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance.',
    B1: 'Can understand the main points of clear standard input on familiar matters regularly encountered.',
    B2: 'Can understand the main ideas of complex text on both concrete and abstract topics.',
    C1: 'Can understand a wide range of demanding, longer texts, and recognise implicit meaning.',
    C2: 'Can understand with ease virtually everything heard or read.',
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Certificate-style header */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="bg-gradient-to-r from-[#3d74b5] to-[#5ebbc8] px-6 py-8 text-center text-white sm:px-10 sm:py-10">
          <p className="mb-1 text-sm font-medium uppercase tracking-widest text-white/70">
            Placement Test Result
          </p>
          <h1 className="mb-1 text-2xl font-bold sm:text-3xl">{studentName}</h1>
          <p className="text-sm text-white/80">Avidato English Assessment</p>
        </div>

        <div className="px-6 py-8 text-center sm:px-10">
          {/* Level Badge */}
          <div className="mb-4">
            <div
              className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: `${cefrCfg.color}15` }}
            >
              <span
                className="text-4xl font-black"
                style={{ color: cefrCfg.color }}
              >
                {level}
              </span>
            </div>
            <h2
              className="text-xl font-bold"
              style={{ color: cefrCfg.color }}
            >
              {cefrCfg.label}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {CEFR_DESCRIPTIONS[level] || ''}
            </p>
          </div>

          {/* Section Scores */}
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {result.grammarLevel && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400 uppercase mb-1">Grammar</p>
                <p className="text-2xl font-bold" style={{ color: CEFR_CONFIG[result.grammarLevel]?.color || '#3d74b5' }}>
                  {result.grammarLevel}
                </p>
                {result.grammarScore !== null && (
                  <p className="text-sm text-slate-500">{result.grammarScore}% score</p>
                )}
              </div>
            )}
            {result.readingLevel && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400 uppercase mb-1">Reading</p>
                <p className="text-2xl font-bold" style={{ color: CEFR_CONFIG[result.readingLevel]?.color || '#3d74b5' }}>
                  {result.readingLevel}
                </p>
                {result.readingScore !== null && (
                  <p className="text-sm text-slate-500">{result.readingScore}% score</p>
                )}
              </div>
            )}
          </div>

          {/* Time */}
          {result.totalTimeSecs > 0 && (
            <p className="mb-6 text-sm text-slate-400">
              Completed in {formatTime(result.totalTimeSecs)}
            </p>
          )}

          {/* Strengths & Weaknesses */}
          {(result.strengths.length > 0 || result.weaknesses.length > 0) && (
            <div className="grid gap-4 text-left sm:grid-cols-2">
              {result.strengths.length > 0 && (
                <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Strengths
                  </h3>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-green-600 capitalize">
                        {s.replace(/-/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.weaknesses.length > 0 && (
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                    </svg>
                    Areas to Improve
                  </h3>
                  <ul className="space-y-1">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-amber-700 capitalize">
                        {w.replace(/-/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Certificate ID */}
          {result.certificateId && (
            <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400">Certificate ID</p>
              <p className="font-mono text-sm font-medium text-slate-600">
                {result.certificateId}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-400">
        This result has been shared with your teacher. Contact them for recommended next steps.
      </p>
    </div>
  )
}
