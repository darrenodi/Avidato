/**
 * Special Report Lesson Display Component
 * 
 * Displays Business English Special Report lessons with the exact structure:
 * - Metadata header (course title, level, topic)
 * - 11 structured modules:
 *   1. Warm up
 *   2. Focus on keywords
 *   3. Listen for predictions 1
 *   4. Listen for predictions 2
 *   5. Listen for details
 *   6. Discussion
 *   7. Focus on vocabulary
 *   8. Skimming for general understanding
 *   9. Reading comprehension
 *   10. Discussion
 *   11. Vocabulary for conversation
 */

import React, { useState } from 'react'
import { SpecialReportLessonContent } from '@/types/module-lesson'
import { formatText } from '@/lib/format-text'

interface SpecialReportDisplayProps {
  lesson: SpecialReportLessonContent
  showObjectives?: boolean
  showProgressBar?: boolean
  showHeader?: boolean
  isTutorView?: boolean
}

export const SpecialReportLessonDisplay: React.FC<SpecialReportDisplayProps> = ({
  lesson,
  showObjectives = true,
  showProgressBar = true,
  showHeader = true,
  isTutorView = true,
}) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set())

  const currentModule = lesson.modules[currentModuleIndex]

  const toggleCompleted = (index: number) => {
    const newSet = new Set(completedModules)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setCompletedModules(newSet)
  }

  const goToModule = (index: number) => {
    setCurrentModuleIndex(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToNext = () => {
    if (currentModuleIndex < lesson.modules.length - 1) {
      goToModule(currentModuleIndex + 1)
    }
  }

  const goToPrevious = () => {
    if (currentModuleIndex > 0) {
      goToModule(currentModuleIndex - 1)
    }
  }

  const renderModuleContent = (moduleIndex: number) => {
    const lessonModule = lesson.modules[moduleIndex]
    const content = lessonModule.content as Record<string, unknown>

    switch (lessonModule.type) {
      case 'warm-up':
        return <WarmUpRenderer content={content} />

      case 'vocabulary-match':
        return <VocabularyMatchRenderer content={content} />

      case 'listening-prediction':
        return <ListeningPredictionRenderer content={content} />

      case 'listening-details':
        return <ListeningDetailsRenderer content={content} />

      case 'discussion':
        return <DiscussionRenderer content={content} />

      case 'vocabulary-context':
        return <VocabularyContextRenderer content={content} />

      case 'reading-skimming':
        return <ReadingSkimmingRenderer content={content} />

      case 'reading-scan':
        return <ReadingScanRenderer content={content} />

      case 'vocabulary-for-conversation':
        return <VocabularyForConversationRenderer content={content} />

      default:
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
            Module type &quot;{lessonModule.type}&quot; not yet supported in display
          </div>
        )
    }
  }

  const progressPercentage = lesson.modules.length > 0 
    ? Math.round((completedModules.size / lesson.modules.length) * 100)
    : 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      {showHeader && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {lesson.courseTitle}
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              {lesson.level}
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
              {lesson.topic}
            </span>
          </div>
          <h1 className="font-fraunces text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {lesson.title}
          </h1>
          {showObjectives && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {lesson.objective}
            </p>
          )}
          {lesson.expemoCode && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Expemo code:</strong> {lesson.expemoCode}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {showProgressBar && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Progress: {completedModules.size} of {lesson.modules.length} modules
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-brand-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Module Navigation Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {lesson.modules.map((module, index) => (
            <button
              key={index}
              onClick={() => goToModule(index)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                index === currentModuleIndex
                  ? 'bg-brand-primary text-white'
                  : completedModules.has(index)
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                {completedModules.has(index) && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Module */}
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {currentModuleIndex + 1}. {currentModule.title}
              </h2>
              {currentModule.tutorNotes && isTutorView && (
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  Tutor note: {currentModule.tutorNotes}
                </p>
              )}
            </div>
            <button
              onClick={() => toggleCompleted(currentModuleIndex)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                completedModules.has(currentModuleIndex)
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {completedModules.has(currentModuleIndex) ? '✓ Completed' : 'Mark Complete'}
            </button>
          </div>

          <div className="space-y-4">
            {renderModuleContent(currentModuleIndex)}
          </div>
        </div>

        {/* Time estimate */}
        {currentModule.timeMinutes && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ⏱ {currentModule.timeMinutes} minutes
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pb-8">
        <button
          onClick={goToPrevious}
          disabled={currentModuleIndex === 0}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={() => toggleCompleted(currentModuleIndex)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            completedModules.has(currentModuleIndex)
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-brand-primary text-white hover:bg-brand-primary/90'
          }`}
        >
          {completedModules.has(currentModuleIndex) ? '✓ Mark Incomplete' : 'Mark Complete'}
        </button>
        <button
          onClick={goToNext}
          disabled={currentModuleIndex === lesson.modules.length - 1}
          className="px-6 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

// ─── Module Renderers ───────────────────────────────────────────────────────

function WarmUpRenderer({ content }: { content: Record<string, unknown> }) {
  const questions = (content.questions as string[]) || []

  return (
    <div className="space-y-4">
      {(content.instructions as string) && (
        <p className="text-gray-600 dark:text-gray-400 italic">
          {formatText(content.instructions as string)}
        </p>
      )}
      <div className="space-y-3">
        {questions.map((question, idx) => (
          <div key={idx} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </span>
            <p className="text-gray-900 dark:text-white">{formatText(question)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function VocabularyMatchRenderer({ content }: { content: Record<string, unknown> }) {
  const pairs = ((content.pairs as Array<{ sentence: string; term: string; definition: string }>) || [])

  return (
    <div className="space-y-4">
      {(content.instructions as string) && (
        <p className="text-gray-600 dark:text-gray-400 italic mb-4">
          {formatText(content.instructions as string)}
        </p>
      )}
      <div className="space-y-3">
        {pairs.map((pair, idx) => (
          <div key={idx} className="border-l-4 border-brand-primary pl-4 py-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{idx + 1}</p>
            <p className="text-gray-900 dark:text-white mb-2">{formatText(pair.sentence)}</p>
            <div className="space-y-1">
              <p className="text-sm">
                <strong className="text-brand-primary">{formatText(pair.term)}</strong>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {formatText(pair.definition)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ListeningPredictionRenderer({ content }: { content: Record<string, unknown> }) {
  const items = ((content.items as Array<{ number: string; prediction?: string }>) || [])

  return (
    <div className="space-y-4">
      {(content.instructions as string) && (
        <p className="text-gray-600 dark:text-gray-400 italic mb-4">
          {formatText(content.instructions as string)}
        </p>
      )}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span className="flex-shrink-0 font-semibold text-gray-900 dark:text-white">
              {idx + 1}. {item.number}
            </span>
            {item.prediction && (
              <p className="text-gray-600 dark:text-gray-400 italic">{formatText(item.prediction)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ListeningDetailsRenderer({ content }: { content: Record<string, unknown> }) {
  const questions = ((content.questions as Array<{ question: string; answer: string }>) || [])

  return (
    <div className="space-y-4">
      {(content.instructions as string) && (
        <p className="text-gray-600 dark:text-gray-400 italic mb-4">
          {formatText(content.instructions as string)}
        </p>
      )}
      <div className="space-y-4">
        {questions.map((item, idx) => (
          <div key={idx} className="border-l-4 border-brand-primary pl-4 py-2">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">
              {idx + 1}. {formatText(item.question)}
            </p>
            <div className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200">
                <strong>Answer:</strong> {formatText(item.answer)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DiscussionRenderer({ content }: { content: Record<string, unknown> }) {
  const questions = (content.questions as string[]) || []

  return (
    <div className="space-y-4">
      {(content.instructions as string) && (
        <p className="text-gray-600 dark:text-gray-400 italic mb-4">
          {formatText(content.instructions as string)}
        </p>
      )}
      <div className="space-y-3">
        {questions.map((question, idx) => (
          <div key={idx} className="flex gap-3 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </span>
            <p className="text-gray-900 dark:text-white">{formatText(question)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function VocabularyContextRenderer({ content }: { content: Record<string, unknown> }) {
  const vocabulary = ((content.vocabulary as Array<{ word: string; partOfSpeech: string; definition: string; example: string }>) || [])
  const gapFill = (content.gapFill as { sentences: Array<{ sentence: string; answer: string }> }) || null

  return (
    <div className="space-y-6">
      {(content.instructions as string) && (
        <p className="text-gray-600 dark:text-gray-400 italic">
          {formatText(content.instructions as string)}
        </p>
      )}

      {/* Vocabulary definitions */}
      {vocabulary.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Vocabulary:</h4>
          {vocabulary.map((item, idx) => (
            <div key={idx} className="border-l-4 border-blue-300 pl-4 py-2">
              <p className="font-semibold text-gray-900 dark:text-white">
                {idx + 1}. {item.word}
                <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">({item.partOfSpeech})</span>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{formatText(item.definition)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
                {formatText(item.example)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Gap fill practice */}
      {gapFill && gapFill.sentences && gapFill.sentences.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-900 dark:text-white">Practice:</h4>
          {gapFill.sentences.map((item, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <p className="text-gray-900 dark:text-white mb-2">{idx + 1}. {formatText(item.sentence)}</p>
              <div className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-200">
                  <strong>Answer:</strong> {formatText(item.answer)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReadingSkimmingRenderer({ content }: { content: Record<string, unknown> }) {
  const titles = (content.paragraphTitles as string[]) || []
  const paragraphs = ((content.paragraphs as Array<{ title?: string; content: string }>) || [])

  return (
    <div className="space-y-6">
      {(content.instructions as string) && (
        <p className="text-gray-600 dark:text-gray-400 italic mb-4">
          {formatText(content.instructions as string)}
        </p>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Paragraph Titles to Match:</h4>
          <div className="space-y-2">
            {titles.map((title, idx) => (
              <p key={idx} className="text-sm text-blue-800 dark:text-blue-300">
                {idx + 1}. {formatText(title)}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Paragraphs:</h4>
          {paragraphs.map((para, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                {para.title ? `[${para.title}]` : `Paragraph ${idx + 1}`}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {formatText(para.content)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReadingScanRenderer({ content }: { content: Record<string, unknown> }) {
  const questions = ((content.questions as Array<{ question: string; answer: string }>) || [])

  return (
    <div className="space-y-4">
      {(content.instructions as string) && (
        <p className="text-gray-600 dark:text-gray-400 italic mb-4">
          {formatText(content.instructions as string)}
        </p>
      )}
      <div className="space-y-4">
        {questions.map((item, idx) => (
          <div key={idx} className="border-l-4 border-brand-primary pl-4 py-2">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">
              {idx + 1}. {formatText(item.question)}
            </p>
            <div className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200">
                <strong>Answer:</strong> {formatText(item.answer)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VocabularyForConversationRenderer({ content }: { content: Record<string, unknown> }) {
  const phrases = ((content.phrases as Array<{ phrase: string; meaning: string }>) || [])
  const practice = (content.practice as { questions: Array<{ question: string }> }) || null

  return (
    <div className="space-y-6">
      {(content.instructions as string) && (
        <p className="text-gray-600 dark:text-gray-400 italic mb-4">
          {formatText(content.instructions as string)}
        </p>
      )}

      {/* Phrases */}
      {phrases.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Natural Language Phrases:</h4>
          {phrases.map((item, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                • {formatText(item.phrase)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                {formatText(item.meaning)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Practice questions */}
      {practice && practice.questions && practice.questions.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-900 dark:text-white">Let&apos;s Chat - Discussion Questions:</h4>
          {practice.questions.map((item, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <p className="text-gray-900 dark:text-white text-sm">{formatText(item.question)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
