'use client'

/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */

import React, { useState } from 'react'
import { PresentationLesson } from '@/types/presentation-lesson'

interface PresentationLessonDisplayProps {
  lesson: PresentationLesson
}

export function PresentationLessonDisplay({ lesson }: PresentationLessonDisplayProps) {
  const [activeExercise, setActiveExercise] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])

  const toggleExerciseCompletion = (index: number) => {
    setCompletedExercises(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const currentExercise = lesson.exercises[activeExercise]
  const exerciseCount = lesson.exercises.length

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-gray-600 mb-3">{lesson.objective}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div><span className="font-semibold">Level:</span> {lesson.level}</div>
          <div><span className="font-semibold">Exercises:</span> {exerciseCount}</div>
        </div>
      </div>

      {/* Exercise Navigation */}
      <div className={`grid gap-2 ${exerciseCount <= 5 ? 'grid-cols-5' : 'grid-cols-4 md:grid-cols-6'}`}>
        {lesson.exercises.map((exercise, index) => {
          const getExerciseLabel = (type: string) => {
            const typeMap: Record<string, string> = {
              vocabulary: 'Vocab',
              expressions: 'Phrases',
              example: 'Example',
              dialogue: 'Dialogue',
              manual: 'Manual',
              roleplay: 'RolePlay',
              discussion: 'Discuss',
            }
            return typeMap[type] || type.slice(0, 5)
          }

          return (
            <button
              key={index}
              onClick={() => setActiveExercise(index)}
              className={`p-3 rounded text-sm font-medium transition-all ${
                activeExercise === index
                  ? 'bg-blue-500 text-white shadow-lg'
                  : completedExercises.includes(index)
                    ? 'bg-green-100 text-green-800 border-2 border-green-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-lg font-bold">{index + 1}</div>
              <div className="text-xs mt-1">{getExerciseLabel(exercise.type)}</div>
            </button>
          )
        })}
      </div>

      {/* Current Exercise */}
      {currentExercise && (
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{currentExercise.title}</h2>
              <p className="text-gray-500 text-sm mt-1">Exercise {activeExercise + 1} of {exerciseCount}</p>
            </div>
            <button
              onClick={() => toggleExerciseCompletion(activeExercise)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                completedExercises.includes(activeExercise)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {completedExercises.includes(activeExercise) ? '✓ Done' : 'Mark Done'}
            </button>
          </div>

          {/* Render exercise content based on type */}
          <ExerciseContent exercise={currentExercise} />

          {/* Navigation */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={() => setActiveExercise(Math.max(0, activeExercise - 1))}
              disabled={activeExercise === 0}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              ← Previous
            </button>
            <button
              onClick={() => setActiveExercise(Math.min(exerciseCount - 1, activeExercise + 1))}
              disabled={activeExercise === exerciseCount - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
function ExerciseContent({ exercise }: { exercise: any }) {
  switch (exercise.type) {
    case 'vocabulary':
      return <VocabularyContent items={exercise.items || []} />
    case 'expressions':
      return <ExpressionsContent items={exercise.items || []} />
    case 'example':
      return <ExampleContent exercise={exercise} />
    case 'dialogue':
      return <DialogueContent exercise={exercise} />
    case 'manual':
      return <ManualContent exercise={exercise} />
    case 'roleplay':
      return <RoleplayContent exercise={exercise} />
    case 'discussion':
      return <DiscussionContent questions={exercise.questions || []} />
    default:
      return (
        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
          <p className="text-sm text-gray-700">Content type: {exercise.type}</p>
          <details className="mt-2">
            <summary className="text-xs font-bold cursor-pointer text-gray-600">Show raw content</summary>
            <pre className="text-xs bg-white p-2 mt-2 overflow-auto max-h-48">{JSON.stringify(exercise, null, 2)}</pre>
          </details>
        </div>
      )
  }
}

// Vocabulary renderer
function VocabularyContent({ items }: { items: any[] }) {
  console.log('VocabularyContent received items:', items)
  
  if (!items || items.length === 0) {
    return (
      <div className="text-gray-500 space-y-2">
        <p>No vocabulary items</p>
        <details className="text-xs">
          <summary>Debug info</summary>
          <pre>{JSON.stringify(items, null, 2)}</pre>
        </details>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-lg font-bold text-blue-900">{item.word}</p>
              <p className="text-xs text-blue-700">{item.pos}</p>
            </div>
            {item.pronunciation && <p className="text-xs text-blue-600 italic">{item.pronunciation}</p>}
          </div>
          {item.definition && <p className="text-sm text-gray-700 mb-2"><strong>Definition:</strong> {item.definition}</p>}
          {item.example && <p className="text-sm text-gray-600 italic">"{item.example}"</p>}
        </div>
      ))}
    </div>
  )
}

// Expressions renderer
function ExpressionsContent({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return <div className="text-gray-500">No expressions</div>
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
          <p className="text-sm text-gray-700">• {item}</p>
        </div>
      ))}
    </div>
  )
}

// Example presentation renderer
function ExampleContent({ exercise }: { exercise: any }) {
  return (
    <div className="space-y-4">
      {exercise.introduction && (
        <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
          <p className="text-sm font-semibold text-gray-700 mb-2">Introduction</p>
          <p className="text-sm text-gray-600">{exercise.introduction}</p>
        </div>
      )}
      {exercise.content && (
        <div className="bg-white p-4 rounded border-l-4 border-blue-400">
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exercise.content}</p>
        </div>
      )}
    </div>
  )
}

// Dialogue renderer
function DialogueContent({ exercise }: { exercise: any }) {
  return (
    <div className="space-y-4">
      {exercise.introduction && (
        <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
          <p className="text-sm text-gray-600">{exercise.introduction}</p>
        </div>
      )}
      {exercise.dialogue && Array.isArray(exercise.dialogue) && (
        <div className="space-y-3">
          {exercise.dialogue.map((line: any, i: number) => (
            <div key={i} className="border-l-4 border-purple-400 pl-4 py-2">
              <p className="text-sm font-bold text-purple-900">{line.speaker}</p>
              <p className="text-sm text-gray-700 mt-1">{line.text}</p>
            </div>
          ))}
        </div>
      )}
      {exercise.comprehension && Array.isArray(exercise.comprehension) && (
        <div className="bg-blue-50 p-4 rounded mt-4">
          <p className="text-sm font-bold text-blue-900 mb-2">Check your understanding:</p>
          <ol className="space-y-2">
            {exercise.comprehension.map((q: string, i: number) => (
              <li key={i} className="text-sm text-gray-700">{i + 1}. {q}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

// Study Manual renderer
function ManualContent({ exercise }: { exercise: any }) {
  return (
    <div className="space-y-4">
      {exercise.introduction && (
        <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
          <p className="text-sm text-gray-600">{exercise.introduction}</p>
        </div>
      )}
      {exercise.tips && Array.isArray(exercise.tips) && (
        <div className="space-y-3">
          {exercise.tips.map((tip: any, i: number) => (
            <div key={i} className="border rounded-lg p-4 bg-yellow-50">
              <p className="font-bold text-yellow-900 mb-2">{tip.title || `Tip ${i + 1}`}</p>
              <p className="text-sm text-gray-700">{tip.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Roleplay renderer
function RoleplayContent({ exercise }: { exercise: any }) {
  return (
    <div className="space-y-4">
      {exercise.situation && (
        <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
          <p className="font-bold text-purple-900 mb-2">Situation</p>
          <p className="text-sm text-gray-700">{exercise.situation}</p>
        </div>
      )}
      {exercise.instructions && (
        <div className="bg-green-50 p-4 rounded border-l-4 border-green-400">
          <p className="font-bold text-green-900 mb-2">Instructions</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">{exercise.instructions}</p>
        </div>
      )}
      {exercise.suggestedExpressions && Array.isArray(exercise.suggestedExpressions) && (
        <div className="bg-blue-50 p-4 rounded">
          <p className="font-bold text-blue-900 mb-2">Suggested Expressions</p>
          <ul className="space-y-1">
            {exercise.suggestedExpressions.map((expr: string, i: number) => (
              <li key={i} className="text-sm text-gray-700">• {expr}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Discussion renderer
function DiscussionContent({ questions }: { questions: any[] }) {
  if (!questions || questions.length === 0) {
    return <div className="text-gray-500">No discussion questions</div>
  }

  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={i} className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
          <p className="text-sm text-gray-700"><strong>{i + 1}.</strong> {q}</p>
        </div>
      ))}
    </div>
  )
}
