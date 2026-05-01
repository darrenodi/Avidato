'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function TextToSpeechPage() {
  const { status } = useSession()
  const router = useRouter()

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  // Clean up object URL on unmount or new generation
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setError(null)
    setLoading(true)

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }

    try {
      const res = await fetch('/api/tools/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to generate audio')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)

      setTimeout(() => audioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!audioUrl) return
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = 'speech.mp3'
    a.click()
  }

  const charCount = text.length
  const atLimit = charCount >= 5000

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Text to Speech</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Convert any text to spoken audio and download it as an MP3.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 5000))}
              rows={10}
              placeholder="Type or paste the text you want to convert to speech..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
            />
            <div className={`text-xs mt-1 text-right ${atLimit ? 'text-red-500' : 'text-gray-400'}`}>
              {charCount} / 5000
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 9v6m0 0l-3-3m3 3l3-3M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Generate Audio
              </>
            )}
          </button>
        </form>

        {audioUrl && (
          <div
            ref={audioRef}
            className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4"
          >
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Audio</h2>
            <audio controls src={audioUrl} className="w-full" />
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download MP3
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
