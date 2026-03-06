'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

interface Word {
  word: string
  definition: string
}

interface MatchingExercise {
  title: string
  instruction: string
  level: string
  wordsWithDefinitions: Word[]
  wordsOnly: string[]
  definitionsShuffled: string[]
  generatedAt: string
}

interface MatchState {
  [wordIndex: number]: number | null // wordIndex -> definitionIndex
}

interface MatchFeedback {
  [wordIndex: number]: 'correct' | 'incorrect' | null
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: 'Elementary - Complete beginner',
  A2: 'Elementary - Can communicate in simple tasks',
  B1: 'Intermediate - Can discuss familiar topics',
  B2: 'Intermediate - Can discuss most topics fluently',
  C1: 'Advanced - Can use language flexibly',
  C2: 'Mastery - Native-like proficiency',
}

function InteractiveMatchingGame({ exercise }: { exercise: MatchingExercise }) {
  const [matches, setMatches] = useState<MatchState>({})
  const [feedback, setFeedback] = useState<MatchFeedback>({})
  const [draggedDef, setDraggedDef] = useState<number | null>(null)
  const [allCorrect, setAllCorrect] = useState(false)

  const checkAnswers = () => {
    const newFeedback: MatchFeedback = {}
    let correctCount = 0

    exercise.wordsWithDefinitions.forEach((item, wordIndex) => {
      const selectedDefIndex = matches[wordIndex]
      if (selectedDefIndex !== null) {
        const selectedDef = exercise.definitionsShuffled[selectedDefIndex]
        if (selectedDef === item.definition) {
          newFeedback[wordIndex] = 'correct'
          correctCount++
        } else {
          newFeedback[wordIndex] = 'incorrect'
        }
      }
    })

    setFeedback(newFeedback)
    setAllCorrect(correctCount === exercise.wordsWithDefinitions.length)
  }

  const resetGame = () => {
    setMatches({})
    setFeedback({})
    setAllCorrect(false)
    setDraggedDef(null)
  }

  const handleDropOnWord = (wordIndex: number, defIndex: number) => {
    setMatches({
      ...matches,
      [wordIndex]: defIndex,
    })
    // Clear feedback when making a new selection
    setFeedback({
      ...feedback,
      [wordIndex]: null,
    })
    setDraggedDef(null)
  }

  const clearMatch = (wordIndex: number) => {
    const newMatches = { ...matches }
    delete newMatches[wordIndex]
    setMatches(newMatches)
    const newFeedback = { ...feedback }
    newFeedback[wordIndex] = null
    setFeedback(newFeedback)
  }

  const getMatchedDefinition = (wordIndex: number) => {
    const defIndex = matches[wordIndex]
    return defIndex !== null ? exercise.definitionsShuffled[defIndex] : null
  }

  const isDefMatched = (defIndex: number) => {
    return Object.values(matches).includes(defIndex)
  }

  const progress = Object.keys(matches).length
  const total = exercise.wordsWithDefinitions.length

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {exercise.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
            Level: {exercise.level}
          </span>
        </p>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm mb-4">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>How to play:</strong> Drag definitions from the right and drop them next to matching words. Correct matches turn green!
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Progress: {progress}/{total} matched
          </span>
          {allCorrect && progress === total && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
              ✓ Perfect!
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              allCorrect && progress === total ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Matching Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Words and Drop Zones */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Match these words</h3>
          <div className="space-y-3">
            {exercise.wordsOnly.map((word, wordIdx) => {
              const matchedDef = getMatchedDefinition(wordIdx)
              const isCorrect = feedback[wordIdx] === 'correct'
              const isIncorrect = feedback[wordIdx] === 'incorrect'

              return (
                <div
                  key={wordIdx}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => draggedDef !== null && handleDropOnWord(wordIdx, draggedDef)}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                    isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : isIncorrect
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                        : draggedDef !== null ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-700'
                        : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {/* Word */}
                  <div className="flex-shrink-0 w-24">
                    <div className="font-semibold text-gray-900 dark:text-white">{word}</div>
                  </div>

                  {/* Drop Zone */}
                  <div className="flex-1">
                    {matchedDef ? (
                      <div
                        className={`p-3 rounded-lg text-sm transition-colors ${
                          isCorrect
                            ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 border border-green-400'
                            : isIncorrect
                              ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 border border-red-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span>{matchedDef}</span>
                          <button
                            onClick={() => clearMatch(wordIdx)}
                            className="text-lg hover:opacity-70 transition-opacity flex-shrink-0 leading-none"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400 text-sm">
                        Drop definition here
                      </div>
                    )}
                  </div>

                  {/* Feedback Icon */}
                  <div className="flex-shrink-0">
                    {isCorrect && <span className="text-2xl">✓</span>}
                    {isIncorrect && <span className="text-2xl">✗</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Definitions to Drag */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Definitions</h3>
          <div className="space-y-2">
            {exercise.definitionsShuffled.map((definition, defIdx) => {
              const isMatched = isDefMatched(defIdx)
              const isDragging = draggedDef === defIdx

              return (
                <div
                  key={defIdx}
                  draggable={!isMatched}
                  onDragStart={() => !isMatched && setDraggedDef(defIdx)}
                  onDragEnd={() => setDraggedDef(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => {
                    // Allow clicking to try matching
                    if (draggedDef === defIdx) {
                      setDraggedDef(null)
                    } else if (!isMatched) {
                      setDraggedDef(defIdx)
                    }
                  }}
                  className={`p-3 rounded-lg text-xs leading-relaxed transition-all border-2 cursor-move select-none ${
                    isDragging
                      ? 'border-blue-400 bg-blue-100 dark:bg-blue-900/40 text-gray-900 dark:text-white transform scale-105 shadow-lg'
                      : isMatched
                        ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow'
                  }`}
                >
                  {definition}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={checkAnswers}
          disabled={progress === 0}
          className="flex-1 py-3 px-4 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Check Answers
        </button>
        <button
          onClick={resetGame}
          className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          Reset
        </button>
      </div>

      {/* Completion Message */}
      {allCorrect && progress === total && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">Excellent Work!</h3>
          <p className="text-green-700 dark:text-green-300">You matched all the definitions correctly!</p>
        </div>
      )}
    </div>
  )
}

export default function WordDefinitionMatchingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('B1')
  const [wordCount, setWordCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [exercise, setExercise] = useState<MatchingExercise | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleGenerateExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!topic.trim()) {
      setError('Please provide a topic')
      setLoading(false)
      return
    }

    if (wordCount < 4 || wordCount > 6) {
      setError('Number of words must be between 4 and 6')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/tools/word-definition-matching/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          level,
          wordCount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate exercise')
      }

      const data = await response.json()
      setExercise(data)
      setShowForm(false)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Word-Definition Matching
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Interactive matching game where you pair words with their definitions.
          </p>
        </div>

        {showForm ? (
          <div className="max-w-2xl">
            <form onSubmit={handleGenerateExercise} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
              {/* Topic Input */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., animals, food, technology, business, travel"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter the topic for vocabulary generation
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {CEFR_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl} - {LEVEL_DESCRIPTIONS[lvl]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Word Count Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Number of Words
                  </label>
                  <span className="text-sm font-semibold text-brand-primary bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {wordCount} words
                  </span>
                </div>
                <input
                  id="wordCount"
                  type="range"
                  min="4"
                  max="6"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>4 words</span>
                  <span>6 words</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : 'Create Game'}
              </button>
            </form>
          </div>
        ) : exercise ? (
          <div>
            <button
              onClick={() => {
                setShowForm(true)
                setExercise(null)
                setTopic('')
                setError(null)
              }}
              className="mb-6 px-4 py-2 text-sm text-brand-primary hover:underline font-medium"
            >
              ← Create New Game
            </button>
            <InteractiveMatchingGame exercise={exercise} />
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
