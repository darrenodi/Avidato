'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ClientThemeProvider from '@/components/ClientThemeProvider'

// ---------------------------------------------------------------------------
// Types — student-safe subset (no answers, no teacher notes, no CCQs, no follow-ups)
// ---------------------------------------------------------------------------

interface WarmUpQuestion { id: number; question: string }

interface PreTeachItem {
  term: string
  type: 'word' | 'phrase' | 'collocation' | 'idiom'
  definition: string
  exampleSentence: string
}

interface GistQuestion { id: number; question: string }
interface DetailQuestion { id: number; question: string }

interface PhraseItem {
  term: string
  type: 'phrase' | 'collocation' | 'idiom' | 'expression'
  meaning: string
  exampleSentence: string
  cefrTag?: string
}

interface FillBlankItem { id: number; sentence: string }
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
  gistQuestions: GistQuestion[]
  detailQuestions: DetailQuestion[]
  phrases: PhraseItem[]
  fillBlanks: FillBlankItem[]
  fillBlanksWordBox?: string[]
  discussion: DiscussionQuestion[]
  wrapUp: ReflectionPrompt[]
}

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  A2: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  B1: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
  B2: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300',
  C1: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  C2: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StageHeader({ num, label, time, icon }: { num: number; label: string; time: string; icon: string }) {
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

  // Shuffle word box so answers aren't in order
  const shuffledWordBox = lesson?.fillBlanksWordBox
    ? [...lesson.fillBlanksWordBox].sort(() => Math.random() - 0.5)
    : []

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
                      <p className="text-gray-900 dark:text-white">{q.id}. {q.question}</p>
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
                  Learn these words and phrases before watching the video.
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
                        <span className="font-medium">Meaning:</span> {item.definition}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Example:</span> <em>{item.exampleSentence}</em>
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 3: Watch & Comprehend (single watch) ---- */}
            <Card>
              <StageHeader num={3} label="Watch & Comprehend" time="10-12 min" icon="▶️" />
              <YouTubeEmbed videoId={lesson.videoId} instruction="Watch the video and answer the questions below." />

              {/* Gist questions */}
              {lesson.gistQuestions?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Before Watching — General Understanding
                  </h4>
                  <div className="space-y-3">
                    {lesson.gistQuestions.map((q) => (
                      <div key={q.id} className="p-3 rounded-lg bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800/30">
                        <p className="text-gray-900 dark:text-white">{q.id}. {q.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detail questions */}
              {lesson.detailQuestions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    After Watching — Specific Details
                  </h4>
                  <div className="space-y-3">
                    {lesson.detailQuestions.map((q) => (
                      <div key={q.id} className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                        <p className="text-gray-900 dark:text-white">{q.id}. {q.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* ---- STAGE 4: Language Focus — Phrases & Fill-in-the-Blanks ---- */}
            {(lesson.phrases?.length > 0 || lesson.fillBlanks?.length > 0) && (
              <Card>
                <StageHeader num={4} label="Language Focus: Phrases & Expressions" time="10-12 min" icon="🗣️" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Useful phrases and expressions from the video. Learn them to sound more natural.
                </p>

                {/* Phrases */}
                {lesson.phrases?.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {lesson.phrases.map((item, i) => (
                      <div key={`ph-${i}`} className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-gray-900 dark:text-white">{item.term}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300">
                            {item.type}
                          </span>
                          {item.cefrTag && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${CEFR_COLORS[item.cefrTag] || 'bg-gray-100 text-gray-600'}`}>
                              {item.cefrTag}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.meaning}</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                          <span className="font-medium">Example:</span> {item.exampleSentence}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fill-in-the-blanks exercise */}
                {lesson.fillBlanks?.length > 0 && (
                  <div className="mt-6 p-5 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/30">
                    <h4 className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-3">
                      ✏️ Fill in the Blanks — Use the phrases from the box
                    </h4>
                    {/* Word box (shuffled so answers aren't in order) */}
                    {shuffledWordBox.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-md bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-700">
                        {shuffledWordBox.map((word, i) => (
                          <span key={`wb-${i}`} className="text-sm px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-800/40 text-teal-800 dark:text-teal-300 font-medium">
                            {word}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Sentences with blanks */}
                    <div className="space-y-3">
                      {lesson.fillBlanks.map((fb) => (
                        <div key={fb.id} className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-medium text-teal-700 dark:text-teal-400 mr-2">{fb.id}.</span>
                          {fb.sentence}
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
                <StageHeader num={5} label="Discussion" time="10-12 min" icon="💡" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Discuss these questions with your teacher. Try to use the phrases you learned.
                </p>
                <div className="space-y-3">
                  {lesson.discussion.map((q) => (
                    <div key={q.id} className="p-4 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30">
                      <p className="text-gray-900 dark:text-white font-medium">{q.id}. {q.question}</p>
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
                      <p className="text-gray-900 dark:text-white">{r.id}. {r.prompt}</p>
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
