/**
 * Sentence Correction Exercise Renderer
 * 
 * Displays sentences with errors for students to correct
 * Tutor version: Shows [Correct] button to reveal answers
 * Student version: No answers visible
 */

import React, { useState } from 'react'
import { formatText } from '@/lib/format-text'

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
        {instructions && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{formatText(instructions)}</p>
        )}
        {isTutorVersion && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-semibold">
          Student cannot see answers
          </p>
        )}
      </div>

      {/* Sentences */}
      <div className="space-y-3">
        {sentences.map((item, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden"
          >
            {/* Sentence Number and Incorrect Text */}
            <div className="p-4">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 text-orange-600 dark:text-orange-400 font-semibold flex items-center justify-center text-sm">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  {/* Display incorrect sentence */}
                  <div className="mb-3">
                    <p className="text-gray-900 dark:text-white font-medium p-3 rounded">
                      {formatText(item.incorrect)}
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
                            <p className="text-gray-900 dark:text-white font-medium p-3 rounded">
                              {formatText(item.correct)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              📌 Error Type:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 p-3 rounded">
                              <strong>{item.errorType}</strong>
                              {item.explanation && (
                                <>
                                  <br />
                                  <span className="text-xs mt-1 block">{formatText(item.explanation)}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Student Version: No answers shown */
                    <div className="mt-3 p-3 rounded text-sm text-gray-600 dark:text-gray-400">
                      ✏️ <strong>Your turn:</strong> Find and correct the mistake in this sentence.
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
