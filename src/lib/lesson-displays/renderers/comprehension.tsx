/**
 * Comprehension Exercise Renderer
 * 
 * Displays comprehension questions about dialogue or text content
 * Students answer multiple-choice or open-ended questions
 * Duration: 5-8 minutes
 */

import React from 'react'
import { formatText } from '@/lib/format-text'

interface ComprehensionQuestion {
  question: string
  type?: 'multiple-choice' | 'open-ended' | 'true-false' | 'short-answer'
  options?: string[]
  answer?: string
}

interface ComprehensionRendererProps {
  title: string
  instructions: string
  questions: ComprehensionQuestion[]
  timeMinutes: number
  isTutorView?: boolean
}

export const ComprehensionRenderer: React.FC<ComprehensionRendererProps> = ({
  instructions,
  questions,
  timeMinutes,
  isTutorView = false,
}) => {
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({})
  const [answeredQuestions, setAnsweredQuestions] = React.useState<Set<number>>(new Set())
  const [revealedAnswers, setRevealedAnswers] = React.useState<Set<number>>(new Set())

  const toggleRevealAnswer = (index: number) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
    setAnsweredQuestions((prev) => new Set([...prev, questionIndex]))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {instructions && (
        <div className="border-l-4 border-indigo-500 pl-4 mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{formatText(instructions)}</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            ⏱️ {timeMinutes} minutes • {questions.length} questions
          </p>
        </div>
      )}
      {!instructions && (
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          ⏱️ {timeMinutes} minutes • {questions.length} questions
        </p>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div
            key={index}
            className="rounded-lg p-4 sm:p-6"
          >
            {/* Question Number and Text */}
            <div className="mb-4">
              <div className="flex items-start gap-3 mb-2">
                <span className="flex-shrink-0 w-6 h-6 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                  {index + 1}.
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex-1">
                  {formatText(q.question)}
                </h3>
              </div>
            </div>

            {/* Question Type Badge */}
            {q.type && (
              <div className="mb-3">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded text-gray-600 dark:text-gray-400">
                  {q.type === 'multiple-choice' && '📋 Multiple Choice'}
                  {q.type === 'open-ended' && '✏️ Open-ended'}
                  {q.type === 'true-false' && '✓ True/False'}
                </span>
              </div>
            )}

            {/* Multiple Choice Options */}
            {q.type === 'multiple-choice' && q.options && (
              <div className="space-y-2 mb-4">
                {q.options.map((option, optIndex) => {
                  const isSelected = selectedAnswers[index] === option
                  // Extract the letter (A, B, C, etc.) from the option text
                  const optionLetter = option.trim().charAt(0).toUpperCase()
                  const isCorrect = q.answer?.toUpperCase() === optionLetter
                  const hasAnswered = answeredQuestions.has(index)
                  const showCorrect = hasAnswered && isCorrect
                  const showWrong = hasAnswered && isSelected && !isCorrect
                  // Strip the letter prefix if option starts with "A) ", "B) ", etc.
                  const displayText = option.match(/^[A-Z]\)\s/) ? option.substring(3) : option

                  return (
                    <div key={optIndex}>
                      <button
                        onClick={() => handleSelectAnswer(index, option)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                          showCorrect
                            ? 'border-green-500 bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-white font-medium'
                            : showWrong
                            ? 'border-red-500 bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-white font-medium'
                            : isSelected
                            ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-white'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-indigo-400 dark:hover:border-indigo-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{optIndex + 1}. {displayText}</span>
                          {showCorrect && <span className="ml-auto text-lg font-bold">✓</span>}
                          {showWrong && <span className="ml-auto text-lg font-bold">✗</span>}
                        </div>
                      </button>
                      {hasAnswered && isSelected && (
                        <div className={`mt-1 text-sm font-bold px-2 py-1 rounded flex items-center gap-1 ${
                          isCorrect 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {isCorrect ? (
                            <>
                              <span>✓</span>
                              <span>Correct</span>
                            </>
                          ) : (
                            <>
                              <span>✗</span>
                              <span>Incorrect</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* True/False Options */}
            {q.type === 'true-false' && (
              <div className="space-y-2">
                <div className="flex gap-3 mb-4">
                  {['True', 'False'].map((option) => {
                    const isSelected = selectedAnswers[index] === option
                    // Answer can be "true"/"false" (lowercase) or "True"/"False" (capitalized)
                    const isCorrect = q.answer?.toLowerCase() === option.toLowerCase()
                    const hasAnswered = answeredQuestions.has(index)
                    const showCorrect = hasAnswered && isCorrect
                    const showWrong = hasAnswered && isSelected && !isCorrect

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelectAnswer(index, option)}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                          showCorrect
                            ? 'border-green-500 bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-white'
                            : showWrong
                            ? 'border-red-500 bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-white'
                            : isSelected
                            ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-white'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-indigo-400 dark:hover:border-indigo-500'
                        }`}
                      >
                        {option}
                        {showCorrect && ' ✓'}
                        {showWrong && ' ✗'}
                      </button>
                    )
                  })}
                </div>
                {/* Show feedback below True/False */}
                {answeredQuestions.has(index) && (
                  <div className={`text-sm font-bold px-2 py-1 rounded flex items-center gap-1 ${
                    selectedAnswers[index] === q.answer
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {selectedAnswers[index] === q.answer ? (
                      <>
                        <span>✓</span>
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <span>✗</span>
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Open-ended Text */}
            {q.type === 'open-ended' && (
              <textarea
                placeholder="Write your answer here..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                rows={3}
                onChange={(e) => handleSelectAnswer(index, e.target.value)}
              />
            )}

            {/* Short-answer / No type — Tutor answer reveal */}
            {(q.type === 'short-answer' || (!q.type && !q.options)) && q.answer && isTutorView && (
              <div className="mt-3">
                <button
                  onClick={() => toggleRevealAnswer(index)}
                  className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-2 mb-2"
                >
                  <span>{revealedAnswers.has(index) ? '▼' : '▶'}</span>
                  {revealedAnswers.has(index) ? 'Hide Answer' : 'Show Answer'}
                </button>
                {revealedAnswers.has(index) && (
                  <div className="rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">✅ Expected Answer:</p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{formatText(q.answer)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Short-answer — Student view (no answer shown) */}
            {(q.type === 'short-answer' || (!q.type && !q.options)) && !isTutorView && (
              <div className="mt-3 p-3 rounded text-sm text-gray-600 dark:text-gray-400">
                ✏️ <strong>Your turn:</strong> Answer this question in your own words.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Study Tip */}
      <div className="rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🎯 <strong>Tip:</strong> Click on an answer to check if it&apos;s correct. You&apos;ll see instant feedback below each question!
        </p>
      </div>
    </div>
  )
}
