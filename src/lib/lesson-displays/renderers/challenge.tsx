/**
 * Challenge Exercise Renderer
 * 
 * Displays an optional extension or creative challenge activity
 * Duration: 5-7 minutes (optional)
 */

import React from 'react'
import { formatText } from '@/lib/format-text'

interface ChallengeRendererProps {
  title: string
  description: string
  instructions: string
  content: string
  timeMinutes: number
  level?: 'medium' | 'hard' | 'advanced'
}

export const ChallengeRenderer: React.FC<ChallengeRendererProps> = ({
  description,
  instructions,
  content,
  timeMinutes,
  level = 'advanced',
}) => {
  const [isAccepted, setIsAccepted] = React.useState(false)

  const getLevelColor = () => {
    switch (level) {
      case 'medium':
        return 'text-yellow-700 dark:text-yellow-400'
      case 'hard':
        return 'text-orange-700 dark:text-orange-400'
      case 'advanced':
      default:
        return 'text-red-700 dark:text-red-400'
    }
  }

  return (
    <div className="space-y-4">
      {/* Challenge Header */}
      <div className={`border-l-4 pl-4 ${getLevelColor()}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getLevelColor()}`}>
            🏆 {level.toUpperCase()} CHALLENGE
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{formatText(description)}</p>
      </div>

      {/* Acceptance Toggle */}
      <div className={`p-4 rounded-lg transition-all ${
        isAccepted
          ? 'border-green-300 dark:border-green-700'
          : ''
      }`}>
        <button
          onClick={() => setIsAccepted(!isAccepted)}
          className={`w-full text-left flex items-center gap-3 transition-all ${
            isAccepted ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <div
            className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
              isAccepted
                ? 'bg-green-500 border-green-500'
                : 'border-gray-400 dark:border-gray-500'
            }`}
          >
            {isAccepted && <span className="text-white text-sm font-bold">✓</span>}
          </div>
          <span className="font-semibold flex-1">
            {isAccepted ? 'Challenge Accepted! 💪' : 'Accept the Challenge'}
          </span>
        </button>
      </div>

      {/* Challenge Content - Only shown if accepted */}
      {isAccepted && (
        <div className="space-y-4 animate-in fade-in-50 duration-300">
          {/* Instructions */}
          <div className="p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">📋 Instructions:</p>
            <p className="text-sm text-gray-900 dark:text-white">{formatText(instructions)}</p>
          </div>

          {/* Challenge Details */}
          <div className="p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">🎯 Your Task:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {formatText(content)}
            </p>
          </div>

          {/* Time & Difficulty */}
          <div className="flex gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            <span>⏱️ {timeMinutes} minutes</span>
            <span>📊 Difficulty: {level}</span>
          </div>

          {/* Motivation */}
          <div className="p-4 rounded-lg">
            <p className="text-sm text-gray-900 dark:text-white">
              ⚡ <strong>This challenge will help you:</strong>
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4 mt-2">
              <li>• Apply what you&apos;ve learned in a creative way</li>
              <li>• Build confidence in using English</li>
              <li>• Develop problem-solving skills</li>
              <li>• Have fun while learning!</li>
            </ul>
          </div>

          {/* Completion Reminder */}
          <div className="p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✅ <strong>When you finish:</strong> Share your work with your tutor and ask for feedback!
            </p>
          </div>
        </div>
      )}

      {/* Motivation when not accepted */}
      {!isAccepted && (
        <div className="p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💪 <strong>Ready to push your limits?</strong> Accept the challenge above!
          </p>
        </div>
      )}
    </div>
  )
}
