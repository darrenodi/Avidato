'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import type { MCQReadingResponse } from '@/app/api/tools/mcq-reading/generate/route'

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function MCQReadingPage() {
  const { status } = useSession()
  const router = useRouter()
  const resultsRef = useRef<HTMLDivElement>(null)

  const [topic, setTopic] = useState('')
  const [passageText, setPassageText] = useState('')
  const [level, setLevel] = useState('B1')
  const [language, setLanguage] = useState('English')
  const [count, setCount] = useState(6)
  const [ageGroup, setAgeGroup] = useState<'adult' | 'young'>('adult')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MCQReadingResponse | null>(null)
  const [selected, setSelected] = useState<Record<number, string>>({})
  const [showAnswers, setShowAnswers] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setSelected({})
    setShowAnswers(false)
    try {
      const res = await fetch('/api/tools/mcq-reading/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic || undefined, passageText: passageText || undefined, level, language, count, ageGroup }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to generate')
      const data = await res.json()
      setResult(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getOptionStyle = (itemId: number, label: string) => {
    if (!showAnswers && selected[itemId] !== label) return 'border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
    const item = result?.items.find((i) => i.id === itemId)
    if (!item) return ''
    if (label === item.correctAnswer) return 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200'
    if (selected[itemId] === label && label !== item.correctAnswer) return 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200'
    return 'border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
  }

  if (status === 'loading') return (
    <DashboardLayout><div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" /></div></DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">MCQ Reading</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate a reading passage with multiple choice comprehension questions.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paste a Text <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={passageText} onChange={(e) => setPassageText(e.target.value)} placeholder="Paste your reading text here, or leave blank and enter a topic..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none" rows={5} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic <span className="text-gray-400 font-normal">{passageText ? '(ignored when text is pasted)' : '(AI generates the passage)'}</span></label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} disabled={!!passageText} placeholder="e.g., Space exploration, Street food, Sustainable fashion..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:opacity-50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CEFR Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent">
                  {CEFR_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Questions: <span className="text-brand-primary font-semibold">{count}</span></label>
                <input type="range" min={3} max={10} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Learner Type</label>
                <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as 'adult' | 'young')} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent">
                  <option value="adult">Adult</option>
                  <option value="young">Young Learner</option>
                </select>
              </div>
            </div>

            {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-sm text-red-800 dark:text-red-300">{error}</p></div>}

            <button type="submit" disabled={loading || (!topic.trim() && !passageText.trim())} className="w-full px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
              {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Generating...</> : <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Generate MCQ Exercise
              </>}
            </button>
          </form>
        </div>

        {result && (
          <div ref={resultsRef} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{result.title}</h2>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">{result.level}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{result.items.length} questions</span>
                </div>
              </div>
              <button onClick={() => setShowAnswers(!showAnswers)} className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {showAnswers ? 'Hide Answers' : 'Show Answer Key'}
              </button>
            </div>

            {/* Passage */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Reading Passage</p>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{result.passage}</p>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {result.items.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                  <p className="font-medium text-gray-900 dark:text-white mb-3">
                    <span className="text-brand-primary mr-2">{item.id}.</span>{item.question}
                  </p>
                  <div className="space-y-2">
                    {item.options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setSelected((prev) => ({ ...prev, [item.id]: opt.label }))}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-3 ${getOptionStyle(item.id, opt.label)}`}
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-semibold">{opt.label}</span>
                        <span className="text-sm">{opt.text}</span>
                      </button>
                    ))}
                  </div>
                  {showAnswers && (
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-2">
                      <span className="font-semibold text-green-600 dark:text-green-400">Answer: {item.correctAnswer}</span> — {item.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setResult(null); setSelected({}); setShowAnswers(false) }} className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" /></svg>
                Generate New
              </button>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-12 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-gray-500 dark:text-gray-400">Paste a text or enter a topic to generate MCQ questions.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
