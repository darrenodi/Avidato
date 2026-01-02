'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

interface DiscussionQuestion {
  id: number
  question: string
  type: 'warm-up' | 'main' | 'deep-dive'
}

interface Discussion {
  topic: string
  level: string
  language: string
  questions: DiscussionQuestion[]
  generatedAt: string
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const LANGUAGES = [
  { value: 'English', label: 'English', flag: '🇺🇸' },
  { value: 'French', label: 'French', flag: '🇫🇷' },
]

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: 'Elementary - Complete beginner',
  A2: 'Elementary - Can communicate in simple tasks',
  B1: 'Intermediate - Can discuss familiar topics',
  B2: 'Intermediate - Can discuss most topics fluently',
  C1: 'Advanced - Can use language flexibly',
  C2: 'Mastery - Native-like proficiency',
}

export default function DiscussionToolPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('B1')
  const [language, setLanguage] = useState('English')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleGenerateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/tools/discussion/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          level,
          language,
          context: context || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate discussion')
      }

      const data = await response.json()
      setDiscussion(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'warm-up':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'main':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
      case 'deep-dive':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  const getQuestionTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'warm-up':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
      case 'main':
        return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300'
      case 'deep-dive':
        return 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300'
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Discussion Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate discussion questions on any topic for your students.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
          <form onSubmit={handleGenerateDiscussion}>
            <div className="space-y-6">
              {/* Topic Input */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discussion Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Climate Change, Travel, Food Culture, Technology..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Enter any topic you&apos;d like to discuss with your students.
                </p>
              </div>

              {/* Level Selection */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CEFR Level
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  {CEFR_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl} - {LEVEL_DESCRIPTIONS[lvl]}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Select the proficiency level of your students.
                </p>
              </div>

              {/* Language Selection */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Select the language your students are learning.
                </p>
              </div>

              {/* Context Input */}
              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., Focus on business vocabulary... For teenagers interested in careers... Include cultural references to Asian countries..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                  rows={3}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Add any special requirements or customizations for question generation.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating Discussion...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Discussion Questions
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Discussion Results */}
        {discussion && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {discussion.topic}
              </h2>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                  Level: {discussion.level}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                  Language: {discussion.language}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300">
                  {discussion.questions.length} Questions
                </span>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {discussion.questions.map((question) => (
                <div
                  key={question.id}
                  className={`border rounded-lg p-5 ${getQuestionTypeColor(question.type)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Question Number */}
                    <div className="flex-shrink-0 pt-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-300">
                        {question.id}
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <p className="text-gray-900 dark:text-white text-base leading-relaxed">
                          {question.question}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getQuestionTypeBadgeColor(question.type)}`}>
                          {question.type.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const text = `Discussion: ${discussion.topic} (${discussion.level})\n\n${discussion.questions.map((q) => `${q.id}. ${q.question}`).join('\n')}`
                  navigator.clipboard.writeText(text)
                  alert('Discussion copied to clipboard!')
                }}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Questions
              </button>
              <button
                onClick={() => setDiscussion(null)}
                className="flex-1 px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                </svg>
                Generate New Discussion
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!discussion && !loading && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Discussion Generated Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a topic and select a level to generate discussion questions.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
