'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import type { ScrambledSentencesResponse } from '@/app/api/tools/scrambled-sentences/generate/route'

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function ScrambledSentencesPage() {
  const { status } = useSession()
  const router = useRouter()
  const resultsRef = useRef<HTMLDivElement>(null)

  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('B1')
  const [language, setLanguage] = useState('English')
  const [count, setCount] = useState(8)
  const [ageGroup, setAgeGroup] = useState<'adult' | 'young'>('adult')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScrambledSentencesResponse | null>(null)
  const [showAnswers, setShowAnswers] = useState(false)
  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setShowAnswers(false)
    setRevealedItems(new Set())
    try {
      const res = await fetch('/api/tools/scrambled-sentences/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, language, count, ageGroup }),
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

  const toggleItem = (id: number) => {
    setRevealedItems((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const copyToClipboard = () => {
    if (!result) return
    const lines = result.items.map((item, i) => `${i + 1}. ${item.scrambled.join(' / ')}`).join('\n')
    const answers = result.items.map((item, i) => `${i + 1}. ${item.correct}`).join('\n')
    navigator.clipboard.writeText(`Scrambled Sentences — ${result.topic} (${result.level})\n\nPut the words in the correct order:\n\n${lines}\n\n— Answer Key —\n${answers}`)
  }

  if (status === 'loading') return (
    <DashboardLayout><div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" /></div></DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Scrambled Sentences</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate sentences with scrambled word order. Students put them back in the correct order.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic or Grammar Focus</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Present perfect, Asking for directions, Work emails..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent" required />
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sentences: <span className="text-brand-primary font-semibold">{count}</span></label>
                <input type="range" min={4} max={15} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-brand-primary" />
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

            <button type="submit" disabled={loading || !topic.trim()} className="w-full px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
              {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Generating...</> : <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Generate Scrambled Sentences
              </>}
            </button>
          </form>
        </div>

        {result && (
          <div ref={resultsRef} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{result.topic}</h2>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">{result.level}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{result.items.length} sentences</span>
                </div>
              </div>
              <button onClick={() => setShowAnswers(!showAnswers)} className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {showAnswers ? 'Hide Answers' : 'Show All Answers'}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              {result.items.map((item) => {
                const revealed = showAnswers || revealedItems.has(item.id)
                return (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold flex items-center justify-center">{item.id}</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {item.scrambled.map((word, wi) => (
                            <span key={wi} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 font-mono">{word}</span>
                          ))}
                        </div>
                        {revealed && (
                          <div className="space-y-1">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">→ {item.correct}</p>
                            {item.grammarNote && <p className="text-xs text-gray-400 dark:text-gray-500 italic">{item.grammarNote}</p>}
                          </div>
                        )}
                      </div>
                      <button onClick={() => toggleItem(item.id)} className="flex-shrink-0 text-xs text-brand-primary hover:underline">
                        {revealedItems.has(item.id) && !showAnswers ? 'Hide' : 'Check'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={copyToClipboard} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy Exercise
              </button>
              <button onClick={() => { setResult(null); setShowAnswers(false); setRevealedItems(new Set()) }} className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" /></svg>
                Generate New
              </button>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-12 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
            <p className="text-gray-500 dark:text-gray-400">Enter a topic to generate scrambled sentences.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
