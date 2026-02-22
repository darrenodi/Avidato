'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { fetchTranscriptViaProxy, extractVideoId } from '@/lib/youtube-transcript-client'

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

interface DiscussionQuestion {
  id: number
  question: string
  focus: 'theme' | 'opinion' | 'language-in-context' | 'application'
}

interface VocabularyItem {
  term: string
  termType: 'word' | 'phrase'
  contextQuote: string
  meaning: string
  discussionPrompt: string
}

interface YouTubeLessonResult {
  videoId: string
  sourceUrl: string
  level: CEFRLevel
  title: string
  summary: string
  discussionQuestions: DiscussionQuestion[]
  vocabulary: VocabularyItem[]
  phrases: VocabularyItem[]
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setTranscriptError(null)
    setLoading(true)

    try {
      let transcriptText = manualTranscript.trim()
      const url = youtubeUrl.trim()

      // Step 1: If URL provided and no manual transcript, fetch transcript first
      if (url && !transcriptText) {
        setLoadingStage('transcript')
        try {
          const transcriptResult = await fetchTranscriptViaProxy(url)
          transcriptText = transcriptResult.transcriptText

          // Check duration (5 min max)
          if (transcriptResult.durationSeconds && transcriptResult.durationSeconds > 300) {
            throw new Error('Video is too long. Maximum supported duration is 5 minutes.')
          }
        } catch (err) {
          // Show clean message — don't expose internal details
          setTranscriptError('auto-fetch-failed')
          setLoading(false)
          setLoadingStage(null)
          return
        }
      }

      if (!transcriptText) {
        setError('Please provide a YouTube URL or paste transcript text.')
        setLoading(false)
        setLoadingStage(null)
        return
      }

      // Step 2: Generate lesson from transcript text
      setLoadingStage('lesson')
      const videoId = url ? extractVideoId(url) : null

      const response = await fetch('/api/tools/youtube-to-lesson/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Send transcript text directly — skip server-side YouTube fetch
          transcriptText,
          youtubeUrl: url || undefined,
          level,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lesson from YouTube video')
      }

      // Ensure videoId and sourceUrl are correct
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

  const getFocusBadgeClass = (focus: DiscussionQuestion['focus']) => {
    switch (focus) {
      case 'theme':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200'
      case 'opinion':
        return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200'
      case 'language-in-context':
        return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200'
      case 'application':
        return 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200'
      default:
        return 'bg-gray-100 dark:bg-gray-900/40 text-gray-800 dark:text-gray-200'
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">YouTube to Lesson Generator</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate discussion questions, vocabulary, and phrases from a YouTube video transcript.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Maximum supported video length: 5 minutes. Paste the transcript below to get started.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Transcript paste — primary input */}
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
                  <a
                    href="https://www.youtube-transcript.io/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-primary hover:underline font-medium"
                  >
                    youtube-transcript.io
                  </a>
                </p>
                {youtubeUrl.trim() && (
                  <button
                    type="button"
                    onClick={() => window.open('https://www.youtube-transcript.io/', '_blank')}
                    className="ml-auto text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
                  >
                    Open Transcript Tool &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* YouTube URL — secondary input for metadata */}
            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                YouTube URL <span className="text-gray-400 font-normal">(optional — for video link &amp; metadata)</span>
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
                {CEFR_LEVELS.map((value) => (
                  <option key={value} value={value}>
                    {value} - {LEVEL_DESCRIPTIONS[value]}
                  </option>
                ))}
              </select>
            </div>

            {transcriptError && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                  Automatic transcript fetch is unavailable.
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                  YouTube blocks server-side requests. Copy the transcript from the tool below and paste it in the field above.
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

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!youtubeUrl.trim() && !manualTranscript.trim())}
              className="w-full px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {loadingStage === 'transcript' ? 'Fetching Transcript...' : 'Generating Lesson...'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 4h5a2 2 0 002-2V8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Generate Lesson From Video
                </>
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{result.title}</h2>
                {result.sourceUrl ? (
                  <a
                    href={result.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-primary hover:underline text-sm font-medium"
                  >
                    Open Video
                  </a>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">Source: Manual transcript</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{result.summary}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                Level: {result.level}
              </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Discussion Questions</h3>
              <div className="space-y-3">
                {result.discussionQuestions.map((question) => (
                  <div key={question.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-gray-900 dark:text-white">{question.id}. {question.question}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getFocusBadgeClass(question.focus)}`}>
                        {question.focus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vocabulary (Level-fit)</h3>
                <div className="space-y-4">
                  {result.vocabulary.map((item, index) => (
                    <div key={`${item.term}-${index}`} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">{item.term}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.meaning}</p>
                      <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-2">“{item.contextQuote}”</p>
                      <p className="text-sm text-brand-primary">{item.discussionPrompt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interesting Phrases</h3>
                <div className="space-y-4">
                  {result.phrases.map((item, index) => (
                    <div key={`${item.term}-${index}`} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">{item.term}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.meaning}</p>
                      <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-2">“{item.contextQuote}”</p>
                      <p className="text-sm text-brand-primary">{item.discussionPrompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Transcript Preview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{result.transcriptPreview}...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
