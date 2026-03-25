'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import type { GapFillResponse } from '@/app/api/tools/gap-fill/generate/route'

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function GapFillPage() {
  const { status } = useSession()
  const router = useRouter()
  const resultsRef = useRef<HTMLDivElement>(null)

  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('B1')
  const [language, setLanguage] = useState('English')
  const [count, setCount] = useState(8)
  const [withWordBank, setWithWordBank] = useState(true)
  const [ageGroup, setAgeGroup] = useState<'adult' | 'young'>('adult')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GapFillResponse | null>(null)
  const [showAnswers, setShowAnswers] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setShowAnswers(false)
    try {
      const res = await fetch('/api/tools/gap-fill/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, language, count, withWordBank, ageGroup }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to generate')
      }
      const data = await res.json()
      setResult(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!result) return
    const wordBankLine = result.withWordBank
      ? `\nWord Bank: ${result.wordBank.join(' | ')}\n`
      : ''
    const sentences = result.items.map((item, i) => `${i + 1}. ${item.sentence}`).join('\n')
    const answers = result.items.map((item, i) => `${i + 1}. ${item.answer}`).join('\n')
    const text = `Gap Fill Exercise — ${result.topic} (${result.level})\n${wordBankLine}\n${sentences}\n\n— Answer Key —\n${answers}`
    navigator.clipboard.writeText(text)
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
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #ws-gapfill, #ws-gapfill * { visibility: visible; }
          #ws-gapfill { position: absolute; left: 0; top: 0; width: 100%; padding: 2rem; }
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Gap Fill</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Generate gap-fill sentences on any topic, with or without a word bank.</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm mb-8">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Topic or Grammar Focus</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Business travel, Past simple tense, Climate change..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CEFR Level</label>
                <div className="flex flex-wrap gap-2">
                  {CEFR_LEVELS.map((l) => (
                    <button key={l} type="button" onClick={() => setLevel(l)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${level === l ? 'bg-brand-primary text-white border-brand-primary' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-primary hover:text-brand-primary'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
                <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="English"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Sentences: <span className="text-brand-primary font-semibold">{count}</span>
                </label>
                <input type="range" min={4} max={15} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-brand-primary" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>4</span><span>15</span></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Learner</label>
                <div className="flex gap-2">
                  {(['adult', 'young'] as const).map((ag) => (
                    <button key={ag} type="button" onClick={() => setAgeGroup(ag)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${ageGroup === ag ? 'bg-brand-primary text-white border-brand-primary' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-primary hover:text-brand-primary'}`}>
                      {ag === 'adult' ? 'Adult' : 'Young Learner'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setWithWordBank(!withWordBank)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${withWordBank ? 'bg-brand-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${withWordBank ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Word Bank</span>
              <span className="text-xs text-gray-400">{withWordBank ? 'Students see a shuffled list of answers' : 'No word bank — harder exercise'}</span>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading || !topic.trim()}
              className="w-full px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Generating...</>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Gap Fill
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <>
            <div id="ws-gapfill" ref={resultsRef} className="space-y-5">
              {/* Print-only header */}
              <div className="hidden print:block mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Gap Fill: {result.topic}</h2>
                <div className="text-sm text-gray-500 mb-4">{result.level} · {result.language}</div>
                <div className="flex gap-8 text-sm text-gray-600 border-t border-gray-300 pt-3">
                  <span>Name: <span className="inline-block w-44 border-b border-gray-400 ml-1" /></span>
                  <span>Date: <span className="inline-block w-28 border-b border-gray-400 ml-1" /></span>
                  <span>Class: <span className="inline-block w-28 border-b border-gray-400 ml-1" /></span>
                </div>
              </div>

              {/* Screen toolbar */}
              <div className="print:hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{result.topic}</h2>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">{result.level}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">{result.language}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{result.items.length} sentences</span>
                      {result.withWordBank && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">Word Bank</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAnswers(!showAnswers)}
                      className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {showAnswers ? 'Hide Answers' : 'Show Answers'}
                    </button>
                    <button onClick={() => window.print()}
                      className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Print
                    </button>
                  </div>
                </div>
              </div>

              {/* Word Bank */}
              {result.withWordBank && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Word Bank</p>
                  <div className="flex flex-wrap gap-2">
                    {result.wordBank.map((word, i) => (
                      <span key={i} className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentences */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                {result.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold flex items-center justify-center">
                      {item.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white leading-relaxed">{item.sentence}</p>
                      {showAnswers && (
                        <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium print:hidden">
                          → {item.answer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Print-only answer key */}
              <div className="hidden print:block">
                <div className="border-t-2 border-dashed border-gray-400 pt-5 mt-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-3">Answer Key</p>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                    {result.items.map((item) => (
                      <p key={item.id} className="text-sm text-gray-800">{item.id}. {item.answer}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Screen actions */}
            <div className="print:hidden flex gap-3 mt-5">
              <button onClick={copyToClipboard}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy
              </button>
              <button onClick={() => { setResult(null); setShowAnswers(false) }}
                className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" /></svg>
                New Exercise
              </button>
            </div>
          </>
        )}

        {!result && !loading && (
          <div className="text-center py-12 rounded-2xl border border-gray-100 dark:border-gray-700">
            <svg className="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-400 dark:text-gray-500">Enter a topic to generate your gap-fill exercise.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
