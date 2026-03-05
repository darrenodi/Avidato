'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
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

interface FillBlankItem { id: number; sentence: string; answer: string }
interface SpeakingPracticeItem { id: number; question: string }
interface DiscussionQuestion { id: number; question: string; followUp: string }
interface ReflectionPrompt { id: number; prompt: string }
interface HomeworkTask { task: string; type: 'writing' | 'speaking' | 'research' }

interface YouTubeLessonData {
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

// ---------------------------------------------------------------------------
// Interactive matching game (same as YouTube tool page)
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

  const resetGame = () => { setMatches({}); setFeedback({}); setAllCorrect(false); setDraggedDef(null) }
  const handleDropOnWord = (wordIdx: number, defIdx: number) => {
    setMatches({ ...matches, [wordIdx]: defIdx }); setFeedback({ ...feedback, [wordIdx]: null }); setDraggedDef(null)
  }
  const clearMatch = (wordIdx: number) => {
    const m = { ...matches }; delete m[wordIdx]; setMatches(m); setFeedback({ ...feedback, [wordIdx]: null })
  }
  const getMatchedDef = (wordIdx: number) => { const di = matches[wordIdx]; return di !== null && di !== undefined ? shuffledMeanings[di] : null }
  const isDefMatched = (defIdx: number) => Object.values(matches).includes(defIdx)
  const progress = Object.keys(matches).length
  const total = phrases.length

  return (
    <div className="mt-6 space-y-4">
      <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/30">
        <h4 className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-2">🎯 Match the Phrases to Their Meanings</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Drag a meaning from the right and drop it next to the matching phrase.</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Progress: {progress}/{total} matched</span>
          {allCorrect && progress === total && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">✓ Perfect!</span>}
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all ${allCorrect && progress === total ? 'bg-green-500' : 'bg-teal-500'}`} style={{ width: `${total > 0 ? (progress / total) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {phrases.map((item, wordIdx) => {
            const matchedDef = getMatchedDef(wordIdx)
            const isCorrect = feedback[wordIdx] === 'correct'
            const isIncorrect = feedback[wordIdx] === 'incorrect'
            return (
              <div key={wordIdx} onDragOver={(e) => e.preventDefault()} onDrop={() => draggedDef !== null && handleDropOnWord(wordIdx, draggedDef)}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                  isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : isIncorrect ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  : draggedDef !== null ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-700'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}>
                <div className="flex-shrink-0 min-w-[120px]"><div className="font-semibold text-gray-900 dark:text-white text-sm">{item.term}</div></div>
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
                    <div className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400 text-sm">Drop meaning here</div>
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
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 h-fit border border-gray-200 dark:border-gray-600">
          <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Meanings</h4>
          <div className="space-y-2">
            {shuffledMeanings.map((meaning, defIdx) => {
              const matched = isDefMatched(defIdx)
              const isDragging = draggedDef === defIdx
              return (
                <div key={defIdx} draggable={!matched} onDragStart={() => !matched && setDraggedDef(defIdx)} onDragEnd={() => setDraggedDef(null)}
                  onClick={() => { if (draggedDef === defIdx) setDraggedDef(null); else if (!matched) setDraggedDef(defIdx) }}
                  className={`p-3 rounded-lg text-xs leading-relaxed transition-all border-2 select-none ${
                    isDragging ? 'border-teal-400 bg-teal-100 dark:bg-teal-900/40 text-gray-900 dark:text-white transform scale-105 shadow-lg cursor-grabbing'
                    : matched ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow cursor-grab'
                  }`}>
                  {meaning}
                </div>
              )
            })}
          </div>
        </div>
      </div>

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
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm font-bold shrink-0">{num}</span>
      <div className="flex-1 min-w-0"><h3 className="text-lg font-semibold text-gray-900 dark:text-white">{label}</h3></div>
      {onEdit && <EditButton onClick={onEdit} label="Edit" />}
      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 whitespace-nowrap">{time}</span>
    </div>
  )
}

function YouTubeEmbed({ videoId, instruction }: { videoId: string; instruction: string }) {
  if (!videoId || videoId === 'manual') return null
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{instruction}</p>
      <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" style={{ paddingBottom: '56.25%' }}>
        <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`} title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">{children}</div>
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function YouTubeLessonDetailPage() {
  const { status } = useSession()
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string

  const [result, setResult] = useState<YouTubeLessonData | null>(null)
  const [lessonDbId, setLessonDbId] = useState<string | null>(null)
  const [creatorName, setCreatorName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const shuffledWordBox = useMemo(() => {
    if (!result?.fillBlanks) return []
    return [...result.fillBlanks.map(fb => fb.answer)].sort(() => Math.random() - 0.5)
  }, [result])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated' || !lessonId) return

    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/tools/youtube-to-lesson/library/${lessonId}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to fetch lesson')

        const lesson = json.lesson
        setLessonDbId(lesson.id)
        setCreatorName(lesson.creator?.name || null)

        // The full lesson data is stored in the `data` JSON field
        const data = lesson.data as YouTubeLessonData
        setResult({
          ...data,
          videoId: lesson.videoId || data.videoId,
          sourceUrl: lesson.sourceUrl || data.sourceUrl,
          level: (lesson.level || data.level) as CEFRLevel,
          title: lesson.title || data.title,
          topic: lesson.topic || data.topic || '',
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson')
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [status, lessonId])

  // Share with student (same as YouTube tool page)
  const handleShare = async () => {
    if (!result || shareLoading) return
    setShareLoading(true)
    try {
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
        phrases: (result.phrases || []).map(({ term, type, meaning }) => ({ term, type, meaning })),
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

  // Save edits back to the library
  const handleSaveEdit = async (stage: string, updated: unknown) => {
    if (!result || !lessonDbId) return

    let newResult: YouTubeLessonData
    if (stage === 'wrapUp') {
      const obj = updated as { wrapUp: ReflectionPrompt[]; homework: HomeworkTask }
      newResult = { ...result, wrapUp: obj.wrapUp, homework: obj.homework }
    } else {
      newResult = { ...result, [stage]: updated } as YouTubeLessonData
    }
    setResult(newResult)
    setEditingStage(null)

    // Persist the edit to the database
    try {
      await fetch(`/api/tools/youtube-to-lesson/library/${lessonDbId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: newResult, title: newResult.title, topic: newResult.topic }),
      })
    } catch (err) {
      console.error('Failed to save edit:', err)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !result) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
            <p className="text-red-700 dark:text-red-300 mb-4">{error || 'Lesson not found'}</p>
            <Link href="/dashboard/youtube-lessons" className="text-sm text-brand-primary hover:underline font-medium">&larr; Back to YouTube Lessons</Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link href="/dashboard/youtube-lessons" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-brand-primary mb-6 transition-colors">
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to YouTube Lessons
        </Link>

        <div className="space-y-6">
          {/* ---- Lesson Header ---- */}
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{result.title}</h2>
                {result.topic && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Topic: {result.topic}</p>}
                {creatorName && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Created by {creatorName}</p>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">{result.level}</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">~{result.estimatedMinutes} min</span>
              </div>
            </div>

            {result.teacherNotes && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Teacher Notes</p>
                <p className="text-sm text-blue-800 dark:text-blue-300">{result.teacherNotes}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => setShowAnswers(!showAnswers)} className="text-sm px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {showAnswers ? 'Hide Answers' : 'Show Answers'}
              </button>
              <button type="button" onClick={handleShare} disabled={shareLoading}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                {shareLoading ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />Sharing...</>
                ) : shareCopied ? (
                  <><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-green-600 dark:text-green-400">Link Copied!</span></>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>Share with Student</>
                )}
              </button>
              {result.sourceUrl && (
                <a href={result.sourceUrl} target="_blank" rel="noreferrer" className="ml-auto text-sm text-brand-primary hover:underline font-medium">Open Video &rarr;</a>
              )}
            </div>
          </Card>

          {/* ---- STAGE 1: Warm-Up ---- */}
          {result.warmUp && result.warmUp.length > 0 && (
            <Card>
              <StageHeader num={1} label="Warm-Up" time="5 min" onEdit={() => setEditingStage('warmUp')} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Ask these BEFORE watching. Get the student talking about the topic.</p>
              <div className="space-y-3">
                {result.warmUp.map((q) => (
                  <div key={q.id} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                    <p className="text-gray-900 dark:text-white">{q.id}. {formatText(q.question)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ---- STAGE 2: Pre-Teach Vocabulary ---- */}
          {result.preTeach && result.preTeach.length > 0 && (
            <Card>
              <StageHeader num={2} label="Pre-Teach Vocabulary" time="5-7 min" onEdit={() => setEditingStage('preTeach')} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Teach these BEFORE watching. They&apos;re essential for understanding the video.</p>
              <div className="space-y-4">
                {result.preTeach.map((item, i) => (
                  <div key={`pt-${i}`} className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{item.term}</span>
                      {item.synonym && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 italic"><sub>{item.synonym}</sub></span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-800/40 text-violet-700 dark:text-violet-300">{item.type}</span>
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
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{formatText(item.definition)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">{formatText(item.exampleSentence)}</p>
                    {item.expressions && item.expressions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-violet-200 dark:border-violet-700/30">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Useful phrases:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.expressions.map((expr, ei) => (
                            <span key={ei} className="px-2 py-0.5 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800">{expr}</span>
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
            {result.detailQuestions && result.detailQuestions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">After Watching — Detail Questions</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Ask these AFTER the video. Check specific comprehension.</p>
                <div className="space-y-3">
                  {result.detailQuestions.map((q) => (
                    <div key={q.id} className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                      <p className="text-gray-900 dark:text-white mb-1">{q.id}. {formatText(q.question)}</p>
                      {showAnswers && (
                        <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-700/40"><span className="font-medium">Answer:</span> {formatText(q.answer)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* ---- STAGE 4: Discussion ---- */}
          {result.discussion && result.discussion.length > 0 && (
            <Card>
              <StageHeader num={4} label="Discussion" time="8-10 min" onEdit={() => setEditingStage('discussion')} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Encourage the student to use the vocabulary from Stage 2.</p>
              <div className="space-y-4">
                {result.discussion.map((q) => (
                  <div key={q.id} className="p-4 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30">
                    <p className="text-gray-900 dark:text-white font-medium">{q.id}. {formatText(q.question)}</p>
                    {showAnswers && <p className="text-sm text-rose-700 dark:text-rose-400 mt-2"><span className="font-medium">Follow-up:</span> {formatText(q.followUp)}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ---- STAGE 5: Language Focus ---- */}
          {result.phrases && result.phrases.length > 0 && (
            <Card>
              <StageHeader num={5} label="Language Focus: Idioms & Expressions" time="12-15 min" onEdit={() => setEditingStage('phrases')} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Idioms, phrasal verbs, collocations and fixed expressions from the video.</p>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">5a — Match Phrase to Meaning</h4>
              <PhraseMatchingGame phrases={result.phrases} />

              {result.fillBlanks && result.fillBlanks.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">5b — Fill in the Blanks</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Use the phrases from the word box to complete each sentence.</p>
                  <div className="flex flex-wrap gap-2 mb-5 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {shuffledWordBox.map((word, i) => (
                      <span key={`wb-${i}`} className="text-sm px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium">{showAnswers ? word : '•••'}</span>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {result.fillBlanks.map((fb) => (
                      <div key={`fb-${fb.id}`} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                        <p className="text-gray-900 dark:text-white">{fb.id}. {formatText(fb.sentence)}</p>
                        {showAnswers && <p className="text-sm text-amber-700 dark:text-amber-400 mt-2 pt-2 border-t border-amber-200 dark:border-amber-700/40"><span className="font-medium">Answer:</span> {formatText(fb.answer)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.speakingPractice && result.speakingPractice.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">5c — Speaking Practice</h4>
                    <EditButton onClick={() => setEditingStage('speakingPractice')} label="Edit" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Discuss these questions. Try to use the phrases and idioms from Stage 5.</p>
                  <div className="space-y-3">
                    {result.speakingPractice.map((sp) => (
                      <div key={`sp-${sp.id}`} className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/30">
                        <p className="text-gray-900 dark:text-white">{sp.id}. {formatText(sp.question)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* ---- STAGE 6: Wrap-Up ---- */}
          {((result.wrapUp && result.wrapUp.length > 0) || result.homework?.task) && (
            <Card>
              <StageHeader num={6} label="Wrap-Up" time="3-5 min" onEdit={() => setEditingStage('wrapUp')} />
              {result.wrapUp && result.wrapUp.length > 0 && (
                <div className="space-y-3 mb-4">
                  {result.wrapUp.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-900 dark:text-white">{r.id}. {formatText(r.prompt)}</p>
                    </div>
                  ))}
                </div>
              )}
              {result.homework?.task && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">📝 Optional Homework</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300">{result.homework.type}</span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">{formatText(result.homework.task)}</p>
                </div>
              )}
            </Card>
          )}
        </div>

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
          const stageData = editingStage === 'wrapUp'
            ? { wrapUp: result.wrapUp, homework: result.homework }
            : (result as unknown as Record<string, unknown>)[editingStage]
          if (!stageData) return null
          return (
            <EditSectionModal
              title={`Edit: ${stageLabels[editingStage] || editingStage}`}
              data={stageData as Parameters<typeof EditSectionModal>[0]['data']}
              onSave={(updated) => handleSaveEdit(editingStage, updated)}
              onCancel={() => setEditingStage(null)}
              hiddenFields={['id']}
            />
          )
        })()}
      </div>
    </DashboardLayout>
  )
}
