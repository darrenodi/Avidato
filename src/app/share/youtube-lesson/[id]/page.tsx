'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ClientThemeProvider from '@/components/ClientThemeProvider'
import { formatText } from '@/lib/format-text'

// ---------------------------------------------------------------------------
// Types — student-safe subset (no answers, no teacher notes, no CCQs, no follow-ups)
// ---------------------------------------------------------------------------

interface WarmUpQuestion { id: number; question: string }

interface PreTeachItem {
  term: string
  type: 'noun' | 'verb' | 'adjective'
  definition: string
  exampleSentence: string
}

interface DetailQuestion { id: number; question: string }

interface PhraseItem {
  term: string
  type: 'idiom' | 'phrasal verb' | 'collocation' | 'fixed expression'
  meaning: string
}

interface FillBlankItem {
  id: number
  sentence: string
}

interface SpeakingPracticeItem {
  id: number
  question: string
}

interface DiscussionQuestion { id: number; question: string }
interface ReflectionPrompt { id: number; prompt: string }

interface StudentLesson {
  videoId: string
  level: string
  title: string
  topic: string
  estimatedMinutes: number
  warmUp: WarmUpQuestion[]
  preTeach: PreTeachItem[]
  detailQuestions: DetailQuestion[]
  phrases: PhraseItem[]
  fillBlanks?: FillBlankItem[]
  fillBlanksWordBox?: string[]
  speakingPractice?: SpeakingPracticeItem[]
  discussion: DiscussionQuestion[]
  wrapUp: ReflectionPrompt[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StageHeader({ num, label, time, icon }: { num: number | string; label: string; time: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm font-bold shrink-0">
        {num}
      </span>
      <h3 className="flex-1 text-lg font-semibold text-gray-900 dark:text-white">
        {icon} {label}
      </h3>
      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 whitespace-nowrap">
        {time}
      </span>
    </div>
  )
}

function YouTubeEmbed({ videoId, instruction }: { videoId: string; instruction: string }) {
  if (!videoId || videoId === 'manual') return null
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{instruction}</p>
      <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Interactive matching game
// ---------------------------------------------------------------------------

interface MatchState { [wordIndex: number]: number | null }
interface MatchFeedback { [wordIndex: number]: 'correct' | 'incorrect' | null }

function PhraseMatchingGame({ phrases }: { phrases: PhraseItem[] }) {
  const [shuffledMeanings] = useState(() =>
    phrases.map((p) => p.meaning).sort(() => Math.random() - 0.5)
  )
  const [matches, setMatches] = useState<MatchState>({})
  const [feedback, setFeedback] = useState<MatchFeedback>({})
  const [draggedDef, setDraggedDef] = useState<number | null>(null)
  const [allCorrect, setAllCorrect] = useState(false)

  const checkAnswers = () => {
    const newFeedback: MatchFeedback = {}
    let correctCount = 0
    phrases.forEach((item, wordIdx) => {
      const selectedDefIdx = matches[wordIdx]
      if (selectedDefIdx !== null && selectedDefIdx !== undefined) {
        if (shuffledMeanings[selectedDefIdx] === item.meaning) {
          newFeedback[wordIdx] = 'correct'
          correctCount++
        } else {
          newFeedback[wordIdx] = 'incorrect'
        }
      }
    })
    setFeedback(newFeedback)
    setAllCorrect(correctCount === phrases.length)
  }

  const resetGame = () => {
    setMatches({})
    setFeedback({})
    setAllCorrect(false)
    setDraggedDef(null)
  }

  const handleDropOnWord = (wordIdx: number, defIdx: number) => {
    setMatches({ ...matches, [wordIdx]: defIdx })
    setFeedback({ ...feedback, [wordIdx]: null })
    setDraggedDef(null)
  }

  const clearMatch = (wordIdx: number) => {
    const m = { ...matches }; delete m[wordIdx]
    setMatches(m)
    setFeedback({ ...feedback, [wordIdx]: null })
  }

  const getMatchedDef = (wordIdx: number) => {
    const di = matches[wordIdx]
    return di !== null && di !== undefined ? shuffledMeanings[di] : null
  }

  const isDefMatched = (defIdx: number) => Object.values(matches).includes(defIdx)
  const progress = Object.keys(matches).length
  const total = phrases.length

  return (
    <div className="mt-6 space-y-4">
      {/* Header */}
      <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/30">
        <h4 className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-2">
          🎯 Match the Phrases to Their Meanings
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Drag a meaning from the right and drop it next to the matching phrase.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Progress: {progress}/{total} matched
          </span>
          {allCorrect && progress === total && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
              ✓ Perfect!
            </span>
          )}
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${allCorrect && progress === total ? 'bg-green-500' : 'bg-teal-500'}`}
            style={{ width: `${total > 0 ? (progress / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Matching grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Phrases + drop zones */}
        <div className="lg:col-span-2 space-y-3">
          {phrases.map((item, wordIdx) => {
            const matchedDef = getMatchedDef(wordIdx)
            const isCorrect = feedback[wordIdx] === 'correct'
            const isIncorrect = feedback[wordIdx] === 'incorrect'
            return (
              <div
                key={wordIdx}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => draggedDef !== null && handleDropOnWord(wordIdx, draggedDef)}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                  isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : isIncorrect ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  : draggedDef !== null ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-700'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex-shrink-0 min-w-[120px]">
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.term}</div>
                </div>
                <div className="flex-1">
                  {matchedDef ? (
                    <div className={`p-3 rounded-lg text-sm transition-colors ${
                      isCorrect ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 border border-green-400'
                      : isIncorrect ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 border border-red-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300'
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <span>{matchedDef}</span>
                        <button onClick={() => clearMatch(wordIdx)} className="text-lg hover:opacity-70 transition-opacity flex-shrink-0 leading-none">✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400 text-sm">
                      Drop meaning here
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {isCorrect && <span className="text-2xl">✓</span>}
                  {isIncorrect && <span className="text-2xl">✗</span>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Meanings to drag */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 h-fit border border-gray-200 dark:border-gray-600">
          <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Meanings</h4>
          <div className="space-y-2">
            {shuffledMeanings.map((meaning, defIdx) => {
              const matched = isDefMatched(defIdx)
              const isDragging = draggedDef === defIdx
              return (
                <div
                  key={defIdx}
                  draggable={!matched}
                  onDragStart={() => !matched && setDraggedDef(defIdx)}
                  onDragEnd={() => setDraggedDef(null)}
                  onClick={() => {
                    if (draggedDef === defIdx) setDraggedDef(null)
                    else if (!matched) setDraggedDef(defIdx)
                  }}
                  className={`p-3 rounded-lg text-xs leading-relaxed transition-all border-2 select-none ${
                    isDragging ? 'border-teal-400 bg-teal-100 dark:bg-teal-900/40 text-gray-900 dark:text-white transform scale-105 shadow-lg cursor-grabbing'
                    : matched ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow cursor-grab'
                  }`}
                >
                  {meaning}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={checkAnswers} disabled={progress === 0}
          className="flex-1 py-3 px-4 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
          Check Answers
        </button>
        <button onClick={resetGame}
          className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
          Reset
        </button>
      </div>

      {allCorrect && progress === total && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">Excellent Work!</h3>
          <p className="text-green-700 dark:text-green-300">All phrases matched correctly!</p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function SharedYouTubeLessonContent() {
  const { theme, setTheme } = useTheme()
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [lesson, setLesson] = useState<StudentLesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const id = params?.id as string | undefined
    if (!id) {
      setError('No lesson ID provided.')
      setLoading(false)
      return
    }

    fetch(`/api/tools/youtube-to-lesson/share?id=${encodeURIComponent(id)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Lesson not found')
        }
        return res.json()
      })
      .then((data) => setLesson(data))
      .catch((err) => setError(err.message || 'Failed to load lesson'))
      .finally(() => setLoading(false))
  }, [params])

  const logoSrc = mounted && theme === 'light' ? '/logo.svg' : '/white-logo.svg'
  const nameSrc = mounted && theme === 'light' ? '/logo-dec.svg' : '/white-logo-dec.svg'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ---- Header ---- */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image src={logoSrc} alt="Avidato Logo" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
            <Image src={nameSrc} alt="Avidato" width={80} height={24} className="h-5 sm:h-6" />
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {theme === 'dark' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* ---- Content ---- */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Lesson Not Found</h3>
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}. Please ask your teacher to share the lesson again.
            </p>
          </div>
        )}

        {/* Lesson content */}
        {lesson && !loading && (
          <div className="space-y-6">
            {/* ---- Lesson Title ---- */}
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
                  {lesson.topic && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Topic: {lesson.topic}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                    {lesson.level}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    ~{lesson.estimatedMinutes} min
                  </span>
                </div>
              </div>
            </Card>

            {/* ---- STAGE 1: Warm-Up ---- */}
            {lesson.warmUp?.length > 0 && (
              <Card>
                <StageHeader num={1} label="Warm-Up" time="5 min" icon="💬" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Discuss these questions with your teacher before watching.
                </p>
                <div className="space-y-3">
                  {lesson.warmUp.map((q) => (
                    <div key={q.id} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                      <p className="text-gray-900 dark:text-white">{q.id}. {formatText(q.question)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 2: Key Vocabulary ---- */}
            {lesson.preTeach?.length > 0 && (
              <Card>
                <StageHeader num={2} label="Key Vocabulary" time="5-7 min" icon="📖" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Learn these words before watching the video.
                </p>
                <div className="space-y-4">
                  {lesson.preTeach.map((item, i) => (
                    <div key={`pt-${i}`} className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-bold text-gray-900 dark:text-white text-lg">{item.term}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-800/40 text-violet-700 dark:text-violet-300">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        <span className="font-medium">Meaning:</span> {formatText(item.definition)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Example:</span> <em>{formatText(item.exampleSentence)}</em>
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 3: Watch & Comprehend ---- */}
            <Card>
              <StageHeader num={3} label="Watch & Comprehend" time="8-10 min" icon="▶️" />
              <YouTubeEmbed videoId={lesson.videoId} instruction="Watch the video and answer the questions below." />

              {lesson.detailQuestions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    After Watching — Specific Details
                  </h4>
                  <div className="space-y-3">
                    {lesson.detailQuestions.map((q) => (
                      <div key={q.id} className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                        <p className="text-gray-900 dark:text-white">{q.id}. {formatText(q.question)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* ---- STAGE 4: Language Focus — Matching, Fill-in-the-Blanks & Speaking ---- */}
            {lesson.phrases?.length > 0 && (
              <Card>
                <StageHeader num={4} label="Language Focus: Idioms & Expressions" time="12-15 min" icon="🗣️" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Idioms, phrasal verbs, collocations and fixed expressions from the video. Match each item to its meaning.
                </p>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">4a — Match Phrase to Meaning</h4>
                <PhraseMatchingGame phrases={lesson.phrases} />

                {/* 4b — Fill-in-the-blanks */}
                {lesson.fillBlanks && lesson.fillBlanks.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">4b — Fill in the Blanks</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Use the phrases from the word box to complete each sentence.You may have to change the form of the word.
                    </p>

                    {/* Word box */}
                    <div className="flex flex-wrap gap-2 mb-5 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {(lesson.fillBlanksWordBox || []).map((word, i) => (
                        <span key={`wb-${i}`} className="text-sm px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium">
                          {word}
                        </span>
                      ))}
                    </div>

                    {/* Sentences */}
                    <div className="space-y-3">
                      {lesson.fillBlanks.map((fb) => (
                        <div key={`fb-${fb.id}`} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                          <p className="text-gray-900 dark:text-white">{fb.id}. {formatText(fb.sentence)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4c — Speaking Practice using phrases */}
                {lesson.speakingPractice && lesson.speakingPractice.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">4c — Speaking Practice</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Discuss these questions with your teacher. Try to use the phrases and idioms you just learned in your answers.
                    </p>
                    <div className="space-y-3">
                      {lesson.speakingPractice.map((sp) => (
                        <div key={`sp-${sp.id}`} className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/30">
                          <p className="text-gray-900 dark:text-white">{sp.id}. {formatText(sp.question)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* ---- STAGE 5: Discussion ---- */}
            {lesson.discussion?.length > 0 && (
              <Card>
                <StageHeader num={5} label="Discussion" time="8-10 min" icon="💡" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Discuss these questions with your teacher. Try to use the phrases you learned.
                </p>
                <div className="space-y-3">
                  {lesson.discussion.map((q) => (
                    <div key={q.id} className="p-4 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30">
                      <p className="text-gray-900 dark:text-white font-medium">{q.id}. {formatText(q.question)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 6: Wrap-Up ---- */}
            {lesson.wrapUp?.length > 0 && (
              <Card>
                <StageHeader num={6} label="Wrap-Up" time="3-5 min" icon="✅" />
                <div className="space-y-3">
                  {lesson.wrapUp.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-900 dark:text-white">{r.id}. {formatText(r.prompt)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- Footer ---- */}
            <div className="text-center py-4">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Generated by Avidato &middot; YouTube Lesson Tool
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function SharedYouTubeLessonPage() {
  return (
    <ClientThemeProvider>
      <SharedYouTubeLessonContent />
    </ClientThemeProvider>
  )
}