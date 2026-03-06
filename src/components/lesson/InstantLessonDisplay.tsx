'use client'

import { useState } from 'react'

interface InstantLessonDisplayProps {
  lesson: {
    title: string
    lessonType: string
    difficulty: number | string
    duration: number
    objective: string
    skills: string[]
    context: string
    vocabulary?: Array<{
      word?: string
      term?: string
      definition?: string
      example?: string
      partOfSpeech?: string
      phonetics?: string
    }>
    exercises: Array<{
      type: string
      title: string
      description: string
      content: string | string[] | object
      timeMinutes: number
    }>
    homework?: string
    materials?: string[]
    teachingNotes?: string
  }
}

// Questions component with show/hide answer functionality
function QuestionsList({ questions, instructions }: { questions: Array<string | Record<string, unknown>>, instructions: string | null }) {
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>({})

  const toggleAnswer = (idx: number) => {
    setShowAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <div className="space-y-4">
      {instructions && (
        <div className="border-l-4 border-blue-500 pl-4 mb-4">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-700 dark:text-gray-300">{instructions}</p>
          </div>
        </div>
      )}
      {questions.map((q, idx) => {
        if (typeof q === 'string') {
          return (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-lg">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </span>
              <p className="flex-1 text-gray-700 dark:text-gray-300 pt-0.5">{q}</p>
            </div>
          )
        } else {
          const question = q as Record<string, unknown>
          const hasAnswer = typeof question.answer === 'string' || typeof question.answer === 'number'
          
          return (
            <div key={idx} className="rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <p className="flex-1 font-medium text-gray-900 dark:text-white pt-0.5">
                  {String(question.question || '')}
                </p>
              </div>
              {(typeof question.options !== 'undefined' && Array.isArray(question.options)) && (
                <div className="ml-10 space-y-2">
                  {(question.options as string[]).map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{opt}</span>
                    </div>
                  ))}
                </div>
              )}
              {hasAnswer && (
                <div className="ml-10 mt-3">
                  <button
                    onClick={() => toggleAnswer(idx)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {showAnswers[idx] ? 'Hide Answer' : 'Show Answer'}
                  </button>
                  {showAnswers[idx] && (
                    <div className="mt-3 rounded p-3">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <span className="font-semibold">Answer:</span> {String(question.answer)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        }
      })}
    </div>
  )
}

// Helper to render exercise content dynamically
const renderExerciseContent = (exercise: { type: string; content: string | string[] | object }, lessonVocabulary?: Array<{
  word?: string
  term?: string
  definition?: string
  example?: string
  partOfSpeech?: string
  phonetics?: string
}>) => {
  const content = exercise.content

  // If it's a vocabulary exercise and there's lesson-level vocabulary, show that instead
  if (exercise.type === 'vocabulary' && lessonVocabulary && lessonVocabulary.length > 0) {
    return (
      <div className="grid gap-4">
        {lessonVocabulary.map((item, idx) => (
          <div key={idx} className="rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                    {String(item.word || item.term || '')}
                  </h4>
                  {(typeof item.partOfSpeech === 'string') && (
                    <span className="px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 rounded">
                      {String(item.partOfSpeech)}
                    </span>
                  )}
                </div>
                {(typeof item.phonetics === 'string') && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                    {String(item.phonetics)}
                  </p>
                )}
                {(typeof item.definition === 'string' || typeof item.definition === 'number') && (
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{String(item.definition)}</p>
                )}
                {(typeof item.example === 'string' || typeof item.example === 'number') && (
                  <p className="text-sm italic text-gray-600 dark:text-gray-400 border-l-2 border-blue-400 pl-3 py-1">
                    💬 {String(item.example)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // If content is a string, render it directly
  if (typeof content === 'string') {
    return (
      <div className="rounded-lg p-4">
        <p className="text-gray-700 dark:text-gray-300">{content}</p>
      </div>
    )
  }

  // If content is an array, render as numbered list
  if (Array.isArray(content)) {
    return (
      <ul className="space-y-3">
        {content.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <span className="flex-1 text-base text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  // If content is an object, render based on type
  if (typeof content === 'object') {
    const obj = content as Record<string, unknown>
    
    // Vocabulary type
    if ('vocabulary' in obj && Array.isArray(obj.vocabulary)) {
      return (
        <div className="grid gap-4">
          {(obj.vocabulary as Array<Record<string, unknown>>).map((item, idx) => (
            <div key={idx} className="rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                    {String(item.word || item.term || '')}
                  </h4>
                  {(typeof item.definition === 'string' || typeof item.definition === 'number') && (
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{String(item.definition)}</p>
                  )}
                  {(typeof item.example === 'string' || typeof item.example === 'number') && (
                    <p className="text-sm italic text-gray-600 dark:text-gray-400 border-l-2 border-blue-400 pl-3">
                      {String(item.example)}
                    </p>
                  )}
                  {(typeof item.partOfSpeech === 'string') && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 rounded">
                      {String(item.partOfSpeech)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Questions type (warmup, discussion)
    if ('questions' in obj && Array.isArray(obj.questions)) {
      const instructions = obj.instructions ? String(obj.instructions) : null
      return (
        <QuestionsList questions={obj.questions as Array<string | Record<string, unknown>>} instructions={instructions} />
      )
    }

    // Dialogue type
    if ('dialogue' in obj && Array.isArray(obj.dialogue)) {
      const setting = obj.setting ? String(obj.setting) : null
      const characters = obj.characters as Array<Record<string, unknown>> | undefined
      const instructions = obj.instructions ? String(obj.instructions) : null
      
      return (
        <div className="space-y-6">
          {setting && (
            <div className="rounded-lg p-4">
              <p className="text-gray-900 dark:text-white text-sm">
                <strong>Setting:</strong> {setting}
              </p>
            </div>
          )}

          {instructions && (
            <p className="text-gray-600 dark:text-gray-400 italic text-sm">
              {instructions}
            </p>
          )}

          {/* Character list */}
          {characters && characters.length > 0 && (
            <div className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              {characters.map((char, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                    {String(char.name || '').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{String(char.name || '')}</p>
                    {(typeof char.role === 'string' || typeof char.role === 'number') && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{String(char.role)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dialogue bubbles */}
          <div className="space-y-4 max-w-4xl">
            {(obj.dialogue as Array<Record<string, unknown>>).map((line, idx) => {
              const prevLine = idx > 0 ? (obj.dialogue as Array<Record<string, unknown>>)[idx - 1] : null
              const isFirstSpeaker = !prevLine || String(prevLine.character || prevLine.speaker) !== String(line.character || line.speaker)
              const characterName = String(line.character || line.speaker || '')
              
              return (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {isFirstSpeaker && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                        {characterName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!isFirstSpeaker && <div className="w-10"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    {isFirstSpeaker && (
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {characterName}
                      </div>
                    )}
                    <div className="rounded-lg p-4 relative">
                      {isFirstSpeaker && (
                        <div className="absolute left-0 top-3 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-transparent -ml-2"></div>
                      )}
                      <p className="text-gray-900 dark:text-white leading-relaxed">
                        {String(line.text || line.line || '')}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    // Roleplay type
    if ('scenario' in obj || 'roles' in obj) {
      const scenario = obj.scenario ? String(obj.scenario) : null
      const roles = obj.roles as Array<Record<string, unknown>> | undefined
      
      return (
        <div className="space-y-4">
          {scenario && (
            <div className="rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Scenario</h4>
              <p className="text-gray-700 dark:text-gray-300">{scenario}</p>
            </div>
          )}
          
          {roles && roles.length > 0 && (
            <div className="grid gap-4">
              {roles.map((role, idx) => (
                <div key={idx} className="rounded-lg p-4">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {String(role.name || '')}
                  </h4>
                  {(typeof role.description === 'string' || typeof role.description === 'number') && (
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{String(role.description)}</p>
                  )}
                  {(typeof role.keyPoints !== 'undefined' && Array.isArray(role.keyPoints)) && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Key Points:</p>
                      <ul className="space-y-1">
                        {(role.keyPoints as string[]).map((point, pointIdx) => (
                          <li key={pointIdx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-pink-500 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    // Generic fallback for other object types
    return (
      <div className="space-y-3">
        {Object.entries(obj).map(([key, value], index) => (
          <div key={index} className="rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="text-gray-700 dark:text-gray-300 text-sm">
              {typeof value === 'string' ? (
                <p className="whitespace-pre-wrap">{value}</p>
              ) : Array.isArray(value) ? (
                <ul className="space-y-1 ml-4 list-disc">
                  {value.map((item, idx) => (
                    <li key={idx}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                  ))}
                </ul>
              ) : (
                <pre className="text-xs overflow-auto">{JSON.stringify(value, null, 2)}</pre>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default function InstantLessonDisplay({ lesson }: InstantLessonDisplayProps) {
  const is25Minutes = lesson.duration === 25

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Header - Different style based on duration */}
      <div className={`rounded-xl shadow-lg border overflow-hidden mb-8 ${
        is25Minutes 
          ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-300 dark:border-purple-700'
          : 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-300 dark:border-blue-700'
      }`}>
        <div className="p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className={`px-4 py-1 rounded-full text-sm font-semibold ${
              is25Minutes ? 'bg-purple-900/50' : 'bg-blue-900/50'
            }`}>
              {is25Minutes ? '⚡ Quick Session' : '🎯 Deep Dive'}
            </div>
            <div className="px-4 py-1 rounded-full bg-white/20 text-sm font-semibold">
              {lesson.duration} min
            </div>
            <div className="px-4 py-1 rounded-full bg-white/20 text-sm font-semibold">
              Level {lesson.difficulty}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {lesson.title}
          </h1>
          
          <p className="text-lg text-white/90 mb-6">
            {lesson.objective}
          </p>

          {lesson.skills && lesson.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lesson.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Context Banner */}
        {lesson.context && (
          <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 px-8 py-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white/90 text-sm leading-relaxed">
                {lesson.context}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Exercises - Different layouts for 25 vs 50 min */}
      <div className={is25Minutes ? 'space-y-6' : 'grid grid-cols-1 gap-8'}>
        {lesson.exercises.map((exercise, index) => (
          <div 
            key={index} 
            className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all ${
              !is25Minutes && index === 0 ? 'col-span-1' : ''
            }`}
          >
            {/* Exercise Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white ${
                      is25Minutes ? 'bg-purple-500' : 'bg-blue-600'
                    }`}>
                      {index + 1}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {exercise.title}
                    </h2>
                  </div>
                  
                  {exercise.description && (
                    <p className="text-gray-600 dark:text-gray-400 ml-11">
                      {exercise.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {exercise.timeMinutes}&apos;
                </div>
              </div>
            </div>

            {/* Exercise Content */}
            <div className="p-6">
              {renderExerciseContent(exercise, lesson.vocabulary)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      {(lesson.homework || lesson.teachingNotes || lesson.materials) && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {lesson.homework && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Homework
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {lesson.homework}
              </p>
            </div>
          )}

          {lesson.teachingNotes && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Teaching Tips
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {lesson.teachingNotes}
              </p>
            </div>
          )}

          {lesson.materials && lesson.materials.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Materials Needed
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {lesson.materials.map((material, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-cyan-200 dark:border-cyan-700"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
