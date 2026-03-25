'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { fetchTranscriptViaProxy, extractVideoId } from '@/lib/youtube-transcript-client'
import { formatText } from '@/lib/format-text'
import EditSectionModal, { EditButton } from '@/components/lesson/EditSectionModal'

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

// ---------------------------------------------------------------------------
// Types — matches backend 6-stage structure
// ---------------------------------------------------------------------------

interface WarmUpQuestion { id: number; question: string }

interface PreTeachItem {
  term: string
  type: 'noun' | 'verb' | 'adjective' | 'adverb'
  phonetics: string
  definition: string
  exampleSentence: string
  synonym?: string
  expressions?: string[]
}

interface DetailQuestion { id: number; question: string; answer: string }

interface PhraseItem {
  term: string
  type: 'idiom' | 'phrasal verb' | 'collocation' | 'fixed expression'
  meaning: string
}

interface FillBlankItem {
  id: number
  sentence: string
  answer: string
}

interface SpeakingPracticeItem {
  id: number
  question: string
}

interface DiscussionQuestion { id: number; question: string; followUp: string }
interface ReflectionPrompt { id: number; prompt: string }
interface HomeworkTask { task: string; type: 'writing' | 'speaking' | 'research' }

interface YouTubeLessonResult {
  videoId: string
  sourceUrl: string
  level: CEFRLevel
  title: string
  topic: string
  teacherNotes: string
  estimatedMinutes: number
  warmUp: WarmUpQuestion[]
  preTeach: PreTeachItem[]
  detailQuestions: DetailQuestion[]
  phrases: PhraseItem[]
  fillBlanks: FillBlankItem[]
  speakingPractice: SpeakingPracticeItem[]
  discussion: DiscussionQuestion[]
  wrapUp: ReflectionPrompt[]
  homework: HomeworkTask
  generatedAt: string
}

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const LEVEL_DESCRIPTIONS: Record<CEFRLevel, string> = {
  A1: 'Elementary - Complete beginner',
  A2: 'Elementary - Can communicate in simple tasks',
  B1: 'Intermediate - Can discuss familiar topics',
  B2: 'Intermediate - Can discuss most topics fluently',
  C1: 'Advanced - Can use language flexibly',
  C2: 'Mastery - Native-like proficiency',
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
      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
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
                  : draggedDef !== null ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  : 'border-gray-200 dark:border-gray-600'
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
        <div className="rounded-lg p-4 h-fit border border-gray-200 dark:border-gray-600">
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
// Helper components
// ---------------------------------------------------------------------------

function StageHeader({ num, label, time, onEdit }: { num: number | string; label: string; time: string; onEdit?: () => void }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm font-bold shrink-0">
        {num}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{label}</h3>
      </div>
      {onEdit && <EditButton onClick={onEdit} label="Edit" />}
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function YouTubeToLessonPage() {
  const { status } = useSession()
  const router = useRouter()

  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [manualTranscript, setManualTranscript] = useState('')
  const [context, setContext] = useState('')
  const [level, setLevel] = useState<CEFRLevel>('B1')
  const [showTranscriptInput, setShowTranscriptInput] = useState(false)
  const [showContext, setShowContext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'transcript' | 'lesson' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [transcriptError, setTranscriptError] = useState<string | null>(null)
  const [result, setResult] = useState<YouTubeLessonResult | null>(null)
  const [showAnswers, setShowAnswers] = useState(true)
  const [playingWord, setPlayingWord] = useState<string | null>(null)
  const [loadingWord, setLoadingWord] = useState<string | null>(null)
  const [shareCopied, setShareCopied] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [editingStage, setEditingStage] = useState<string | null>(null)

  const playAudio = async (word: string) => {
    try {
      setLoadingWord(word)
      let response = await fetch(`/api/vocabulary/${encodeURIComponent(word)}/audio`)
      if (response.status >= 500) {
        await new Promise(r => setTimeout(r, 1000))
        response = await fetch(`/api/vocabulary/${encodeURIComponent(word)}/audio`)
      }
      if (response.status === 403 || !response.ok) return
      const data = await response.json()
      const audio = new Audio(data.audioUrl)
      setPlayingWord(word)
      audio.onended = () => setPlayingWord(null)
      audio.onerror = () => setPlayingWord(null)
      await audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
    } finally {
      setLoadingWord(null)
    }
  }

  // Shuffle fill-in-the-blanks word box once per generated result
  const shuffledWordBox = useMemo(() => {
    if (!result?.fillBlanks) return []
    return [...result.fillBlanks.map(fb => fb.answer)].sort(() => Math.random() - 0.5)
  }, [result])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  // -----------------------------------------------------------------------
  // Share: POST student-safe data to API, get short link
  // -----------------------------------------------------------------------
  const handleShare = async () => {
    if (!result || shareLoading) return
    setShareLoading(true)
    try {
      // Build student-safe version: strip answers, teacher notes, CCQs, follow-ups, homework
      const studentData = {
        videoId: result.videoId,
        level: result.level,
        title: result.title,
        topic: result.topic,
        estimatedMinutes: result.estimatedMinutes,
        warmUp: result.warmUp,
        preTeach: (result.preTeach || []).map(({ term, type, phonetics, definition, exampleSentence, synonym, expressions }) => ({
          term, type, phonetics, definition, exampleSentence, ...(synonym && { synonym }), ...(expressions?.length && { expressions }),
        })),
        detailQuestions: (result.detailQuestions || []).map(({ id, question }) => ({ id, question })),
        phrases: (result.phrases || []).map(({ term, type, meaning }) => ({
          term, type, meaning,
        })),
        fillBlanks: (result.fillBlanks || []).map(({ id, sentence }) => ({ id, sentence })),
        fillBlanksWordBox: (result.fillBlanks || []).map(fb => fb.answer).sort(() => Math.random() - 0.5),
        speakingPractice: (result.speakingPractice || []).map(({ id, question }) => ({ id, question })),
        discussion: (result.discussion || []).map(({ id, question }) => ({ id, question })),
        wrapUp: result.wrapUp,
      }

      const res = await fetch('/api/tools/youtube-to-lesson/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create share link')

      const shareUrl = `${window.location.origin}/share/youtube-lesson/${data.id}`
      await navigator.clipboard.writeText(shareUrl)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 3000)
    } catch (err) {
      console.error('Share error:', err)
      setError('Failed to create share link. Please try again.')
    } finally {
      setShareLoading(false)
    }
  }

  // -----------------------------------------------------------------------
  // Generate
  // -----------------------------------------------------------------------
  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setTranscriptError(null)
    setLoading(true)
    setShowAnswers(true)
    setShareCopied(false)
    setResult(null)

    try {
      let transcriptText = manualTranscript.trim()
      const url = youtubeUrl.trim()

      if (url && !transcriptText) {
        setLoadingStage('transcript')
        try {
          const transcriptResult = await fetchTranscriptViaProxy(url)
          transcriptText = transcriptResult.transcriptText
          if (transcriptResult.durationSeconds && transcriptResult.durationSeconds > 300) {
            throw new Error('Video is too long. Maximum supported duration is 5 minutes.')
          }
        } catch {
          setTranscriptError('auto-fetch-failed')
          setLoading(false)
          setLoadingStage(null)
          return
        }
      }

      if (!transcriptText) {
        setError('Please paste a transcript or provide a YouTube URL.')
        setLoading(false)
        setLoadingStage(null)
        return
      }

      setLoadingStage('lesson')
      const videoId = url ? extractVideoId(url) : null

      const response = await fetch('/api/tools/youtube-to-lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcriptText, youtubeUrl: url || undefined, level, context: context.trim() || undefined }),
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 403 && data.upgrade) {
          setError(data.error || 'You have reached your YouTube lesson limit. Upgrade your plan for more.')
          setLoading(false)
          setLoadingStage(null)
          return
        }
        throw new Error(data.error || 'Failed to generate lesson')
      }

      if (videoId && !data.videoId) {
        data.videoId = videoId
        data.sourceUrl = `https://www.youtube.com/watch?v=${videoId}`
      }

      // Redirect to the saved lesson detail page
      if (data.savedLessonId) {
        router.push(`/dashboard/youtube-lessons/${data.savedLessonId}`)
        return
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      setLoadingStage(null)
    }
  }

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200 dark:shadow-red-900/30">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.8 19 12 19 12 19s4.8 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.3 2.8-5.3 2.7z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">YouTube to Lesson</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Turn any video into a full 50-minute lesson plan</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <form onSubmit={handleGenerate} className="p-6 space-y-6">

            {/* YouTube URL — primary field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Video URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.8 19 12 19 12 19s4.8 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.3 2.8-5.3 2.7z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-900 transition-colors text-sm"
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">Max 5 minutes. Transcript is fetched automatically.</p>
            </div>

            {/* Transcript error — auto-fetch failed */}
            {transcriptError && (
              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Auto-fetch unavailable</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">YouTube blocks server requests. Get the transcript from youtube-transcript.io and paste it below.</p>
                  </div>
                </div>
                <button type="button" onClick={() => window.open('https://www.youtube-transcript.io/', '_blank')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-100 dark:bg-amber-800/40 hover:bg-amber-200 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-200 rounded-lg border border-amber-300 dark:border-amber-700 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open youtube-transcript.io
                </button>
              </div>
            )}

            {/* Paste transcript — toggle or always shown when error */}
            {(transcriptError || showTranscriptInput) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Transcript</label>
                <textarea
                  value={manualTranscript}
                  onChange={(e) => setManualTranscript(e.target.value)}
                  placeholder="Paste the video transcript here..."
                  rows={7}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:bg-white dark:focus:bg-gray-900 transition-colors text-sm resize-none"
                />
              </div>
            )}

            {!transcriptError && (
              <button type="button" onClick={() => setShowTranscriptInput(s => !s)}
                className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors -mt-3">
                <svg className={`w-3 h-3 transition-transform ${showTranscriptInput ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showTranscriptInput ? 'Hide transcript field' : 'Or paste transcript manually'}
              </button>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-700" />

            {/* CEFR Level pills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Level</label>
              <div className="flex flex-wrap gap-2">
                {CEFR_LEVELS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setLevel(v)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      level === v
                        ? 'border-brand-primary bg-brand-primary text-white shadow-sm'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-primary/40 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{LEVEL_DESCRIPTIONS[level]}</p>
            </div>

            {/* Context — collapsible optional */}
            <div>
              <button type="button" onClick={() => setShowContext(s => !s)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                <svg className={`w-4 h-4 transition-transform ${showContext ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Student context
                <span className="text-xs font-normal bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">Optional</span>
              </button>
              {showContext && (
                <div className="mt-3">
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. My student is a 30-year-old nurse from Brazil who struggles with phrasal verbs."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:bg-white dark:focus:bg-gray-900 transition-colors text-sm resize-none"
                  />
                </div>
              )}
            </div>

            {/* General error */}
            {error && (
              <div className={`p-4 rounded-xl border ${
                error.includes('Premium')
                  ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <p className={`text-sm ${error.includes('Premium') ? 'text-purple-800 dark:text-purple-300' : 'text-red-800 dark:text-red-300'}`}>{error}</p>
                {error.includes('Premium') && (
                  <a href="/pricing" className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    View Plans &rarr;
                  </a>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (!youtubeUrl.trim() && !manualTranscript.trim())}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  {loadingStage === 'transcript' ? 'Fetching transcript...' : 'Generating lesson...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.8 19 12 19 12 19s4.8 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.3 2.8-5.3 2.7z"/>
                  </svg>
                  Generate Lesson Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* ============================================================== */}
        {/* LESSON PLAN RESULT — 6 Stages                                   */}
        {/* ============================================================== */}
        {result && (
          <div className="space-y-6 mt-8">
            {/* ---- Lesson Header ---- */}
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{result.title}</h2>
                  {result.topic && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Topic: {result.topic}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                    {result.level}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    ~{result.estimatedMinutes} min
                  </span>
                </div>
              </div>

              {result.teacherNotes && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Teacher Notes</p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">{result.teacherNotes}</p>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={() => setShowAnswers(!showAnswers)}
                  className="text-sm px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {showAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>

                <button type="button" onClick={handleShare} disabled={shareLoading}
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                  {shareLoading ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>Sharing...</>
                  ) : shareCopied ? (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-600 dark:text-green-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share with Student
                    </>
                  )}
                </button>

                {result.sourceUrl && (
                  <a href={result.sourceUrl} target="_blank" rel="noreferrer"
                    className="ml-auto text-sm text-brand-primary hover:underline font-medium">
                    Open Video &rarr;
                  </a>
                )}
              </div>
            </Card>

            {/* ---- STAGE 1: Warm-Up ---- */}
            {result.warmUp.length > 0 && (
              <Card>
                <StageHeader num={1} label="Warm-Up" time="5 min" onEdit={() => setEditingStage('warmUp')} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Ask these BEFORE watching. Get the student talking about the topic.
                </p>
                <div className="space-y-3">
                  {result.warmUp.map((q) => (
                    <div key={q.id} className="p-3 rounded-lg">
                      <p className="text-gray-900 dark:text-white">{q.id}. {formatText(q.question)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 2: Pre-Teach Vocabulary ---- */}
            {result.preTeach.length > 0 && (
              <Card>
                <StageHeader num={2} label="Pre-Teach Vocabulary" time="5-7 min" onEdit={() => setEditingStage('preTeach')} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Teach these BEFORE watching. They&apos;re essential for understanding the video.
                </p>
                <div className="space-y-4">
                  {result.preTeach.map((item, i) => (
                    <div key={`pt-${i}`} className="p-4 rounded-lg">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{item.term}</span>
                        {item.synonym && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 italic"><sub>{item.synonym}</sub></span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {item.type}
                        </span>
                        <button
                          onClick={() => playAudio(item.term)}
                          disabled={loadingWord === item.term}
                          className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                          aria-label={`Play audio for ${item.term}`}
                        >
                          {playingWord === item.term ? (
                            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6h4a1 1 0 001-1v-4a1 1 0 00-1-1H9z" /></svg>
                          ) : loadingWord === item.term ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6h4a1 1 0 001-1v-4a1 1 0 00-1-1H9z" /></svg>
                          )}
                        </button>
                        {item.phonetics && (
                          <span className="text-orange-600 dark:text-orange-400 font-mono text-sm">{item.phonetics}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        {formatText(item.definition)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        {formatText(item.exampleSentence)}
                      </p>
                      {item.expressions && item.expressions.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Useful phrases:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.expressions.map((expr, ei) => (
                              <span key={ei} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">{expr}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 3: Watch & Comprehend ---- */}
            <Card>
              <StageHeader num={3} label="Watch & Comprehend" time="8-10 min" onEdit={() => setEditingStage('detailQuestions')} />
              <YouTubeEmbed videoId={result.videoId} instruction="Play the video. The student watches once and answers the comprehension questions below." />

              {/* Detail questions */}
              {result.detailQuestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">After Watching — Detail Questions</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Ask these AFTER the video. Check specific comprehension.
                  </p>
                  <div className="space-y-3">
                    {result.detailQuestions.map((q) => (
                      <div key={q.id} className="p-3 rounded-lg">
                        <p className="text-gray-900 dark:text-white mb-1">{q.id}. {formatText(q.question)}</p>
                        {showAnswers && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="font-medium">Answer:</span> {formatText(q.answer)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* ---- STAGE 4: Discussion ---- */}
            {result.discussion.length > 0 && (
              <Card>
                <StageHeader num={4} label="Discussion" time="8-10 min" onEdit={() => setEditingStage('discussion')} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Encourage the student to use the vocabulary from Stage 2.
                </p>
                <div className="space-y-4">
                  {result.discussion.map((q) => (
                    <div key={q.id} className="p-4 rounded-lg">
                      <p className="text-gray-900 dark:text-white font-medium">{q.id}. {formatText(q.question)}</p>
                      {showAnswers && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <span className="font-medium">Follow-up:</span> {formatText(q.followUp)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 5: Language Focus — Matching, Fill-in-the-Blanks & Speaking ---- */}
            {result.phrases && result.phrases.length > 0 && (
              <Card>
                <StageHeader num={5} label="Language Focus: Idioms & Expressions" time="12-15 min" onEdit={() => setEditingStage('phrases')} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Idioms, phrasal verbs, collocations and fixed expressions from the video. These make the student sound more natural.
                </p>

                {/* 5a — Matching exercise */}
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">5a — Match Phrase to Meaning</h4>
                <PhraseMatchingGame phrases={result.phrases} />

                {/* 5b — Fill-in-the-blanks */}
                {result.fillBlanks && result.fillBlanks.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">5b — Fill in the Blanks</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Use the phrases from the word box to complete each sentence. You may have to change the form of the word.
                    </p>

                    {/* Word box — shuffled so answers aren't in sentence order */}
                    <div className="flex flex-wrap gap-2 mb-5 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      {shuffledWordBox.map((word, i) => (
                        <span key={`wb-${i}`} className="text-sm px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium">
                          {showAnswers ? word : '•••'}
                        </span>
                      ))}
                    </div>

                    {/* Sentences */}
                    <div className="space-y-3">
                      {result.fillBlanks.map((fb) => (
                        <div key={`fb-${fb.id}`} className="p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white">{fb.id}. {formatText(fb.sentence)}</p>
                          {showAnswers && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="font-medium">Answer:</span> {formatText(fb.answer)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5c — Speaking Practice using phrases */}
                {result.speakingPractice && result.speakingPractice.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">5c — Speaking Practice</h4>
                      <EditButton onClick={() => setEditingStage('speakingPractice')} label="Edit" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Discuss these questions. Try to use the phrases and idioms from Stage 5 in your answers.
                    </p>
                    <div className="space-y-3">
                      {result.speakingPractice.map((sp) => (
                        <div key={`sp-${sp.id}`} className="p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white">{sp.id}. {formatText(sp.question)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* ---- STAGE 6: Wrap-Up ---- */}
            {(result.wrapUp.length > 0 || result.homework?.task) && (
              <Card>
                <StageHeader num={6} label="Wrap-Up" time="3-5 min" onEdit={() => setEditingStage('wrapUp')} />
                {result.wrapUp.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {result.wrapUp.map((r) => (
                      <div key={r.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-900 dark:text-white">{r.id}. {formatText(r.prompt)}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.homework?.task && (
                  <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">📝 Optional Homework</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {result.homework.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{formatText(result.homework.task)}</p>
                  </div>
                )}
              </Card>
            )}

          </div>
        )}

        {/* Edit Stage Modal */}
        {editingStage && result && (() => {
          const stageLabels: Record<string, string> = {
            warmUp: 'Warm-Up Questions',
            preTeach: 'Pre-Teach Vocabulary',
            detailQuestions: 'Comprehension Questions',
            phrases: 'Idioms & Expressions',
            fillBlanks: 'Fill in the Blanks',
            speakingPractice: 'Speaking Practice Questions',
            discussion: 'Discussion Questions',
            wrapUp: 'Wrap-Up & Homework',
          }
          // For wrapUp, combine wrapUp + homework into one editable object
          const stageData = editingStage === 'wrapUp'
            ? { wrapUp: result.wrapUp, homework: result.homework }
            : (result as unknown as Record<string, unknown>)[editingStage]
          if (!stageData) return null
          return (
            <EditSectionModal
              title={`Edit: ${stageLabels[editingStage] || editingStage}`}
              data={stageData as Parameters<typeof EditSectionModal>[0]['data']}
              onSave={(updated) => {
                if (editingStage === 'wrapUp') {
                  const obj = updated as unknown as { wrapUp: typeof result.wrapUp; homework: typeof result.homework }
                  setResult({ ...result, wrapUp: obj.wrapUp, homework: obj.homework })
                } else {
                  setResult({ ...result, [editingStage]: updated } as YouTubeLessonResult)
                }
                setEditingStage(null)
              }}
              onCancel={() => setEditingStage(null)}
              hiddenFields={['id']}
            />
          )
        })()}
      </div>
    </DashboardLayout>
  )
}