'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ModularLessonDisplay from '@/components/lesson/ModularLessonDisplay'
import type { ModularLessonContent } from '@/types/module-lesson'

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const LESSON_FOCUS_OPTIONS = [
  'Auto',
  'Speaking',
  'Listening',
  'Reading',
  'Writing',
  'Grammar',
  'Vocabulary',
  'Presentation',
  'Business',
] as const

export default function InstantLessonToolPage() {
  const { status } = useSession()
  const router = useRouter()
  const resultsRef = useRef<HTMLDivElement>(null)

  const [targetLanguage, setTargetLanguage] = useState('English')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [level, setLevel] = useState('B1')
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState<25 | 50>(50)
  const [description, setDescription] = useState('')
  const [endGoals, setEndGoals] = useState('')
  const [occupation, setOccupation] = useState('')
  const [interests, setInterests] = useState('')
  const [showContext, setShowContext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ModularLessonContent | null>(null)
  const [lessonFocus, setLessonFocus] = useState<string>('Auto')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/tools/instant-lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: targetLanguage.trim(),
          nativeLanguage: nativeLanguage.trim() || 'English',
          level,
          topic: topic.trim(),
          duration,
          description: description.trim() || undefined,
          endGoals: endGoals.trim() || undefined,
          occupation: occupation.trim() || undefined,
          interests: interests.trim() || undefined,
          skillFocus: lessonFocus === 'Auto' ? undefined : lessonFocus.toLowerCase(),
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to generate')
      const data = await res.json()
      setResult(data.data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Instant Lesson</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate a complete lesson on any topic — interview tomorrow, a trip next week, or a skill the student wants right now.
          </p>
        </div>

        {/* Form */}
        {!result && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm mb-8">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Target Language
                  </label>
                  <input
                    type="text"
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    placeholder="e.g., English"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Student&apos;s Native Language
                  </label>
                  <input
                    type="text"
                    value={nativeLanguage}
                    onChange={(e) => setNativeLanguage(e.target.value)}
                    placeholder="e.g., Spanish"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CEFR Level</label>
                <div className="flex flex-wrap gap-2">
                  {CEFR_LEVELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        level === l
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-primary hover:text-brand-primary'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  placeholder="e.g., Negotiating a salary, Describing symptoms to a doctor, Planning a trip..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Additional context <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="e.g., Focus on formal register, student struggles with conditionals..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                <div className="flex gap-2">
                  {([25, 50] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`px-5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        duration === d
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-primary hover:text-brand-primary'
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson focus <span className="text-gray-400 font-normal">(Auto picks from the topic)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {LESSON_FOCUS_OPTIONS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setLessonFocus(f)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        lessonFocus === f
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-primary hover:text-brand-primary'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional learner context */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContext(!showContext)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${showContext ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Learner context{' '}
                  <span className="text-gray-400 font-normal">(optional — helps personalise the lesson)</span>
                </button>
                {showContext && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Goals
                      </label>
                      <input
                        type="text"
                        value={endGoals}
                        onChange={(e) => setEndGoals(e.target.value)}
                        placeholder="e.g., Pass IELTS 7.0, become fluent for work, travel confidently..."
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Occupation
                        </label>
                        <input
                          type="text"
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          placeholder="e.g., Marketing manager, nurse, student..."
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Interests
                        </label>
                        <input
                          type="text"
                          value={interests}
                          onChange={(e) => setInterests(e.target.value)}
                          placeholder="e.g., Travel, technology, football..."
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !topic.trim() || !targetLanguage.trim()}
                className="w-full px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Lesson
              </button>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">Building your lesson...</p>
            <p className="text-xs text-gray-400 mt-1">This takes about 15–20 seconds</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div ref={resultsRef} className="space-y-4">
            {/* Lesson meta */}
            <div className="flex flex-wrap gap-2">
              {result.skills?.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {s}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary">
                {result.duration} min
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                {level} · {targetLanguage}
              </span>
            </div>

            {/* Lesson */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <ModularLessonDisplay lesson={result} isStudentView={false} />
            </div>

            {/* Teaching notes */}
            {result.teachingNotes && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
                  Teaching Notes
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{result.teachingNotes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>
              <button
                onClick={() => { setResult(null); setError(null) }}
                className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                </svg>
                New Lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
