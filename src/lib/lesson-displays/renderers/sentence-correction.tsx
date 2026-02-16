/**
 * Sentence Correction Exercise Renderer
 * 
 * Displays sentences with errors for students to correct
 * Tutor version: Shows [Correct] button to reveal answers
 * Student version: No answers visible
 */

import React, { useState } from 'react'

interface SentenceItem {
  incorrect: string
  correct: string
  errorType: string
  explanation?: string
}

interface SentenceCorrectionRendererProps {
  title: string
  instructions: string
  sentences: SentenceItem[]
  timeMinutes: number
  isTutorVersion?: boolean // true for tutor/answer version, false for student version
}

export const SentenceCorrectionRenderer: React.FC<SentenceCorrectionRendererProps> = ({
  instructions,
  sentences,
  timeMinutes,
  isTutorVersion = false,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-orange-500 pl-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Fix grammar and syntax errors</p>
        {instructions && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{instructions}</p>
        )}
        {isTutorVersion && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-semibold">
            👨‍🏫 Student cannot see answers
          </p>
        )}
      </div>

      {/* Sentences */}
      <div className="space-y-3">
        {sentences.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Sentence Number and Incorrect Text */}
            <div className="p-4">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  {/* Display sentence */}
                  <div className="mb-3">
                    <p className={`text-gray-900 dark:text-white font-medium p-3 rounded border ${
                      item.errorType
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    }`}>
                      {item.incorrect}
                    </p>
                  </div>

                  {/* Tutor Version: Show Answer Button */}
                  {isTutorVersion ? (
                    <>
                      <button
                        onClick={() =>
                          setExpandedIndex(expandedIndex === index ? null : index)
                        }
                        className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors flex items-center gap-2 mb-2"
                      >
                        <span>{expandedIndex === index ? '▼' : '▶'}</span>
                        {expandedIndex === index ? 'Hide Answer' : 'Show Answer'}
                      </button>

                      {/* Answer Content - Only shown when button is clicked */}
                      {expandedIndex === index && (
                        <div className="space-y-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              ✅ Correct:
                            </p>
                            <p className="text-gray-900 dark:text-white font-medium bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                              {item.correct}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              📌 Error Type:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                              <strong>{item.errorType || 'Grammar correction'}</strong>
                              {item.explanation && (
                                <>
                                  <br />
                                  <span className="text-xs mt-1 block">{item.explanation}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Student Version: No answers shown */
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-700 dark:text-blue-300">
                      ✏️ <strong>Your turn:</strong> Write the corrected version of this sentence.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
