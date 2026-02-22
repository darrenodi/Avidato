'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { fetchTranscriptViaProxy, extractVideoId } from '@/lib/youtube-transcript-client'

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

// ---------------------------------------------------------------------------
// Types — matches backend 6-stage structure
// ---------------------------------------------------------------------------

interface WarmUpQuestion { id: number; question: string }

interface PreTeachItem {
  term: string
  type: 'word' | 'phrase' | 'collocation' | 'idiom'
  definition: string
  exampleSentence: string
  conceptCheckQuestion: string
}

interface GistQuestion { id: number; question: string }
interface DetailQuestion { id: number; question: string; answer: string }

interface PhraseItem {
  term: string
  type: 'phrase' | 'collocation' | 'idiom' | 'expression'
  contextQuote: string
  meaning: string
  exampleSentence: string
  cefrTag: string
}

interface FillBlankItem { id: number; sentence: string; answer: string }
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
  gistQuestions: GistQuestion[]
  detailQuestions: DetailQuestion[]
  phrases: PhraseItem[]
  fillBlanks: FillBlankItem[]
  discussion: DiscussionQuestion[]
  wrapUp: ReflectionPrompt[]
  homework: HomeworkTask
  transcriptPreview: string
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

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  A2: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  B1: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
  B2: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300',
  C1: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  C2: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300',
}

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function StageHeader({ num, label, time, icon }: { num: number; label: string; time: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm font-bold shrink-0">
        {num}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{icon} {label}</h3>
      </div>
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
// Main page
// ---------------------------------------------------------------------------

export default function YouTubeToLessonPage() {
  const { status } = useSession()
  const router = useRouter()

  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [manualTranscript, setManualTranscript] = useState('')
  const [level, setLevel] = useState<CEFRLevel>('B1')
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'transcript' | 'lesson' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [transcriptError, setTranscriptError] = useState<string | null>(null)
  const [result, setResult] = useState<YouTubeLessonResult | null>(null)
  const [showAnswers, setShowAnswers] = useState(true)
  const [shareCopied, setShareCopied] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)

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
        preTeach: (result.preTeach || []).map(({ term, type, definition, exampleSentence }) => ({
          term, type, definition, exampleSentence,
        })),
        gistQuestions: result.gistQuestions,
        detailQuestions: (result.detailQuestions || []).map(({ id, question }) => ({ id, question })),
        phrases: (result.phrases || []).map(({ term, type, meaning, exampleSentence, cefrTag }) => ({
          term, type, meaning, exampleSentence, cefrTag,
        })),
        fillBlanks: (result.fillBlanks || []).map(({ id, sentence }) => ({ id, sentence })),
        fillBlanksWordBox: (result.fillBlanks || []).map(fb => fb.answer),
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
        body: JSON.stringify({ transcriptText, youtubeUrl: url || undefined, level }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate lesson')

      if (videoId && !data.videoId) {
        data.videoId = videoId
        data.sourceUrl = `https://www.youtube.com/watch?v=${videoId}`
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">YouTube to Lesson Generator</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate a complete 45-minute ESL lesson plan from a YouTube video transcript.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Max video length: 5 minutes. The lesson includes 6 stages from warm-up to wrap-up.
          </p>
        </div>

        {/* ============================================================== */}
        {/* INPUT FORM                                                      */}
        {/* ============================================================== */}
        <Card>
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Transcript — primary */}
            <div>
              <label htmlFor="manualTranscript" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Transcript
              </label>
              <textarea
                id="manualTranscript"
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                placeholder="Paste the YouTube video transcript here..."
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Need the transcript? Copy it from{' '}
                  <a href="https://www.youtube-transcript.io/" target="_blank" rel="noreferrer" className="text-brand-primary hover:underline font-medium">
                    youtube-transcript.io
                  </a>
                </p>
                <button
                  type="button"
                  onClick={() => window.open('https://www.youtube-transcript.io/', '_blank')}
                  className="ml-auto text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
                >
                  Open Transcript Tool &rarr;
                </button>
              </div>
            </div>

            {/* YouTube URL */}
            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                YouTube URL <span className="text-gray-400 font-normal">(optional — for embedded player)</span>
              </label>
              <input
                id="youtubeUrl"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            {/* CEFR Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CEFR Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as CEFRLevel)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              >
                {CEFR_LEVELS.map((v) => (
                  <option key={v} value={v}>{v} - {LEVEL_DESCRIPTIONS[v]}</option>
                ))}
              </select>
            </div>

            {/* Transcript error */}
            {transcriptError && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                  Automatic transcript fetch is unavailable.
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                  YouTube blocks server-side requests. Copy the transcript from the tool below and paste it above.
                </p>
                <button
                  type="button"
                  onClick={() => window.open('https://www.youtube-transcript.io/', '_blank')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-amber-100 dark:bg-amber-800/40 hover:bg-amber-200 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-200 rounded-md border border-amber-300 dark:border-amber-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open youtube-transcript.io
                </button>
              </div>
            )}

            {/* General error */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (!youtubeUrl.trim() && !manualTranscript.trim())}
              className="w-full px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {loadingStage === 'transcript' ? 'Fetching Transcript...' : 'Generating Lesson Plan...'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 4h5a2 2 0 002-2V8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Generate 45-Minute Lesson Plan
                </>
              )}
            </button>
          </form>
        </Card>

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
                <StageHeader num={1} label="Warm-Up" time="5 min" icon="💬" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Ask these BEFORE watching. Get the student talking about the topic.
                </p>
                <div className="space-y-3">
                  {result.warmUp.map((q) => (
                    <div key={q.id} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                      <p className="text-gray-900 dark:text-white">{q.id}. {q.question}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 2: Pre-Teach Vocabulary ---- */}
            {result.preTeach.length > 0 && (
              <Card>
                <StageHeader num={2} label="Pre-Teach Vocabulary" time="5-7 min" icon="📖" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Teach these BEFORE watching. They&apos;re essential for understanding the video.
                </p>
                <div className="space-y-4">
                  {result.preTeach.map((item, i) => (
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">Example:</span> <em>{item.exampleSentence}</em>
                      </p>
                      {showAnswers && (
                        <p className="text-sm text-violet-700 dark:text-violet-400">
                          <span className="font-medium">CCQ:</span> {item.conceptCheckQuestion}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 3: Watch & Comprehend ---- */}
            <Card>
              <StageHeader num={3} label="Watch & Comprehend" time="10-12 min" icon="▶️" />
              <YouTubeEmbed videoId={result.videoId} instruction="Play the video. The student watches once and answers all comprehension questions." />

              {/* Gist questions */}
              {result.gistQuestions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Before Watching — Gist Questions</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Give these to the student BEFORE pressing play. They focus on general understanding.
                  </p>
                  <div className="space-y-3">
                    {result.gistQuestions.map((q) => (
                      <div key={q.id} className="p-3 rounded-lg bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800/30">
                        <p className="text-gray-900 dark:text-white">{q.id}. {q.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detail questions */}
              {result.detailQuestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">After Watching — Detail Questions</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Ask these AFTER the video. Check specific comprehension.
                  </p>
                  <div className="space-y-3">
                    {result.detailQuestions.map((q) => (
                      <div key={q.id} className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                        <p className="text-gray-900 dark:text-white mb-1">{q.id}. {q.question}</p>
                        {showAnswers && (
                          <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-700/40">
                            <span className="font-medium">Answer:</span> {q.answer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* ---- STAGE 4: Language Focus — Phrases & Expressions ---- */}
            {(result.phrases.length > 0 || result.fillBlanks.length > 0) && (
              <Card>
                <StageHeader num={4} label="Language Focus: Phrases & Expressions" time="10-12 min" icon="🗣️" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Reusable phrases, collocations and expressions from the video. These make the student sound more natural.
                </p>

                {/* Phrases list */}
                {result.phrases.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {result.phrases.map((item, i) => (
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
                        <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-1">&ldquo;{item.contextQuote}&rdquo;</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                          <span className="font-medium">Example:</span> {item.exampleSentence}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fill-in-the-blanks exercise */}
                {result.fillBlanks.length > 0 && (
                  <div className="mt-6 p-5 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/30">
                    <h4 className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-3">
                      ✏️ Fill in the Blanks — Use the phrases from the box
                    </h4>
                    {/* Word box */}
                    <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-md bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-700">
                      {result.fillBlanks.map((fb) => (
                        <span key={`wb-${fb.id}`} className="text-sm px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-800/40 text-teal-800 dark:text-teal-300 font-medium">
                          {showAnswers ? fb.answer : '•••'}
                        </span>
                      ))}
                    </div>
                    {/* Sentences */}
                    <div className="space-y-3">
                      {result.fillBlanks.map((fb) => (
                        <div key={fb.id} className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-medium text-teal-700 dark:text-teal-400 mr-2">{fb.id}.</span>
                          {fb.sentence}
                          {showAnswers && (
                            <span className="ml-2 text-teal-600 dark:text-teal-400 font-medium">→ {fb.answer}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* ---- STAGE 5: Discussion ---- */}
            {result.discussion.length > 0 && (
              <Card>
                <StageHeader num={5} label="Discussion" time="10-12 min" icon="💡" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Encourage the student to use phrases from stages 2 and 4.
                </p>
                <div className="space-y-4">
                  {result.discussion.map((q) => (
                    <div key={q.id} className="p-4 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30">
                      <p className="text-gray-900 dark:text-white font-medium">{q.id}. {q.question}</p>
                      {showAnswers && (
                        <p className="text-sm text-rose-700 dark:text-rose-400 mt-2">
                          <span className="font-medium">Follow-up:</span> {q.followUp}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---- STAGE 6: Wrap-Up ---- */}
            {(result.wrapUp.length > 0 || result.homework?.task) && (
              <Card>
                <StageHeader num={6} label="Wrap-Up" time="3-5 min" icon="✅" />
                {result.wrapUp.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {result.wrapUp.map((r) => (
                      <div key={r.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-900 dark:text-white">{r.id}. {r.prompt}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.homework?.task && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">📝 Optional Homework</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300">
                        {result.homework.type}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-300">{result.homework.task}</p>
                  </div>
                )}
              </Card>
            )}

            {/* ---- Transcript Preview ---- */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Transcript Preview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {result.transcriptPreview}...
              </p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
