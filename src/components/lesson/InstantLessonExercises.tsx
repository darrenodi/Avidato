'use client'

// src/components/lesson/InstantLessonExercises.tsx
import React, { useState, useRef } from 'react'
import { formatText } from '@/lib/format-text'
import { guessGenderFromName } from '@/lib/utils/name-gender'

/**
 * Instant Lesson Exercise Components
 * Renderers for the instant-lesson tool: vocabulary, warm-up, dialogue,
 * comprehension, roleplay, discussion, plus the task-based stages
 * (lead-in, task prep, task performance, post-task, homework).
 */
interface VocabularyItem {
  word: string
  partOfSpeech: string
  phonetics: string
  definition: string
  example: string
  synonym?: string
  expressions?: string[] // Common collocations/phrases using this word
}

interface Character {
  name: string
  role?: string
  avatar?: string
}

interface DialogueLine {
  character: string
  text: string
}

// Vocabulary Exercise Component
export function VocabularyExercise({ vocabulary }: { vocabulary: VocabularyItem[] }) {
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [loadingWord, setLoadingWord] = useState<string | null>(null);

  const playAudio = async (word: string) => {
    try {
      setLoadingWord(word);
      
      // Fetch audio URL from API (retry once on transient failure)
      let response = await fetch(`/api/vocabulary/${encodeURIComponent(word)}/audio`);
      if (response.status >= 500) {
        // Retry once after 1s for cold-start / transient errors
        await new Promise(r => setTimeout(r, 1000));
        response = await fetch(`/api/vocabulary/${encodeURIComponent(word)}/audio`);
      }

      if (response.status === 403) {
        // Feature gated — silently skip (Pro+ only)
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load audio');
      }
      
      const data = await response.json();
      
      // Play audio using HTML5 Audio
      const audio = new Audio(data.audioUrl);
      setPlayingWord(word);
      
      audio.onended = () => setPlayingWord(null);
      audio.onerror = () => {
        setPlayingWord(null);
        console.error('Audio playback error');
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setLoadingWord(null);
    }
  };

  return (
    <div className="space-y-6">
      {vocabulary.map((item, index) => (
        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-4xl">
            {/* Word section - full width on mobile, left side on desktop */}
            <div className="lg:flex-shrink-0 lg:w-48 lg:min-w-[180px] lg:max-w-[200px]">
              <div className="text-xl lg:text-lg font-semibold text-blue-600 dark:text-blue-400 break-words leading-tight mb-2">
                {item.word}
              </div>
              {/* Synonym subscript - only show if available and contextually appropriate */}
              {item.synonym && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 italic">
                  <sub>{item.synonym}</sub>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3 lg:mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {item.partOfSpeech}
                </span>
                {/* Audio button */}
                <button
                  onClick={() => playAudio(item.word)}
                  disabled={loadingWord === item.word}
                  className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                  aria-label={`Play audio for ${item.word}`}
                >
                  {playingWord === item.word ? (
                    <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6h4a1 1 0 001-1v-4a1 1 0 00-1-1H9z" />
                    </svg>
                  ) : loadingWord === item.word ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6h4a1 1 0 001-1v-4a1 1 0 00-1-1H9z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Phonetics - show on mobile too */}
              <div className="lg:hidden mb-3">
                <span className="text-orange-600 dark:text-orange-400 font-mono text-sm break-all">
                  {item.phonetics}
                </span>
              </div>
            </div>
            
            {/* Definition and example section */}
            <div className="flex-1 min-w-0">
              {/* Phonetics and Definition */}
              <div className="mb-3">
                {/* Phonetics only show on desktop */}
                <span className="hidden lg:inline text-orange-600 dark:text-orange-400 font-mono text-sm mr-3 break-all">
                  {item.phonetics || ''}
                </span>
                <span className="text-gray-700 dark:text-gray-300 text-sm lg:text-sm break-words">
                  {formatText(item.definition)}
                </span>
              </div>
              
              {/* Example sentence */}
              <div className="text-gray-600 dark:text-gray-400 text-sm break-words leading-relaxed mb-3 italic">
                {formatText(item.example)}
              </div>

              {/* Expressions/collocations - show useful phrases if available (A2+) */}
              {item.expressions && item.expressions.length > 0 && (
                <div className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Useful phrases:
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.expressions.join(' · ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Warm-up Exercise Component
export function WarmupExercise({ questions, instructions }: { questions: (string | Record<string, unknown>)[], instructions?: string }) {
  // Filter to ensure only exactly 3 questions (no 4th item like "Discuss the questions")
  const filteredQuestions = (questions || []).slice(0, 3);
  
  return (
    <div className="space-y-4 max-w-4xl">
      {instructions && (
        <p className="text-gray-600 dark:text-gray-400 italic">
          {formatText(instructions)}
        </p>
      )}
      <div className="space-y-3">
        {filteredQuestions.map((question, index) => {
          // Handle both string and object formats
          const questionText: string = typeof question === 'string' 
            ? question 
            : ((question as Record<string, unknown>)?.question as string) || '';
          
          return (
            <div key={index} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              <p className="text-gray-900 dark:text-white">
                {formatText(questionText)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Character Avatar Component
function CharacterAvatar({ character }: { character: Character }) {
  // Gender-based avatar assignment
  const getGenderAvatar = (name: string) => {
    const femaleNames = [
      'sarah', 'emily', 'jessica', 'ashley', 'amanda', 'stephanie', 'melissa', 'nicole', 
      'elizabeth', 'heather', 'tiffany', 'michelle', 'amber', 'megan', 'rachel', 'amy',
      'kimberly', 'christina', 'brittany', 'rebecca', 'laura', 'danielle', 'maria', 'lisa',
      'jennifer', 'karen', 'nancy', 'betty', 'helen', 'sandra', 'donna', 'carol', 'ruth',
      'sharon', 'michelle', 'laura', 'sarah', 'kimberly', 'deborah', 'dorothy', 'lisa',
      'anna', 'emma', 'olivia', 'ava', 'isabella', 'sophia', 'charlotte', 'mia', 'amelia',
      'harper', 'evelyn', 'abigail', 'ella', 'grace', 'chloe', 'victoria', 'riley'
    ]
    
    const maleNames = [
      'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'joseph', 'thomas',
      'christopher', 'charles', 'daniel', 'matthew', 'anthony', 'mark', 'donald', 'steven',
      'paul', 'andrew', 'joshua', 'kenneth', 'kevin', 'brian', 'george', 'edward', 'ronald',
      'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric', 'jonathan',
      'stephen', 'larry', 'justin', 'scott', 'brandon', 'benjamin', 'samuel', 'gregory',
      'alexander', 'patrick', 'frank', 'raymond', 'jack', 'dennis', 'jerry', 'tyler',
      'aaron', 'jose', 'henry', 'adam', 'douglas', 'nathan', 'peter', 'zachary', 'kyle'
    ]
    
    const normalizedName = name.toLowerCase().split(' ')[0]
    
    if (femaleNames.includes(normalizedName)) {
      return '👩'
    } else if (maleNames.includes(normalizedName)) {
      return '👨'
    } else {
      // Default neutral avatar
      return '👤'
    }
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ]
    const colorIndex = name.length % colors.length
    return colors[colorIndex]
  }

  const avatarEmoji = getGenderAvatar(character.name)
  const avatarColor = getAvatarColor(character.name)

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center text-white text-lg`}>
        {avatarEmoji}
      </div>
    </div>
  )
}

// Dialogue Exercise Component
export function DialogueExercise({
  context,
  characters,
  dialogue,
  instructions,
  speakers,
}: {
  context: string
  characters: Character[]
  dialogue: DialogueLine[]
  instructions?: string
  speakers?: { name: string; gender: 'male' | 'female' }[]
}) {
  const [showTranscript, setShowTranscript] = useState(true)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loadingAudio, setLoadingAudio] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const hasAudio = speakers && speakers.length > 0

  const handlePlayAudio = async () => {
    if (audioUrl) { audioRef.current?.play(); return }
    setLoadingAudio(true)
    setAudioError(null)
    try {
      const genderMap = Object.fromEntries((speakers || []).map(s => [s.name, s.gender]))
      const lines = dialogue.map(l => ({
        speaker: l.character,
        gender: genderMap[l.character] || guessGenderFromName(l.character) || 'male',
        text: l.text,
      }))
      const res = await fetch('/api/audio/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines }),
      })
      if (!res.ok) throw new Error('Audio generation failed')
      const url = URL.createObjectURL(await res.blob())
      setAudioUrl(url)
      setTimeout(() => audioRef.current?.play(), 50)
    } catch {
      setAudioError('Could not generate audio.')
    } finally {
      setLoadingAudio(false)
    }
  }

  return (
    <div className="space-y-4">
      {context && (
        <p className="text-sm italic text-gray-500 dark:text-gray-400">{formatText(context)}</p>
      )}
      {instructions && (
        <p className="text-gray-600 dark:text-gray-400 italic text-sm">{formatText(instructions)}</p>
      )}

      {hasAudio && (
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayAudio}
            disabled={loadingAudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-medium hover:bg-brand-accent transition-colors disabled:opacity-50"
          >
            {loadingAudio ? (
              <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>Play Audio</>
            )}
          </button>
          <button
            onClick={() => setShowTranscript(s => !s)}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
          >
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </button>
        </div>
      )}
      {audioUrl && <audio ref={audioRef} src={audioUrl} controls className="w-full h-8" />}
      {audioError && <p className="text-xs text-red-500">{audioError}</p>}

      {(!hasAudio || showTranscript) && (
        <div className="space-y-4 max-w-4xl">
          {dialogue.map((line, index) => {
            const character = characters.find(c => c.name === line.character)
            const isFirstSpeaker = index === 0 || dialogue[index - 1]?.character !== line.character
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {isFirstSpeaker ? (
                    <CharacterAvatar character={character || { name: line.character }} />
                  ) : (
                    <div className="w-10" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {isFirstSpeaker && (
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{line.character}</div>
                  )}
                  <p className="text-gray-900 dark:text-white leading-relaxed pt-0.5">{formatText(line.text)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Comprehension Exercise Component
export function ComprehensionExercise({ 
  questions,
  hideAnswers = false
}: { 
  questions: Array<{
    question: string
    type: 'multiple-choice' | 'true-false' | 'short-answer'
    options?: string[]
    answer?: string
  }>
  hideAnswers?: boolean
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>({})

  const handleAnswerSelect = (questionIndex: number, answer: string, event?: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const toggleShowAnswer = (questionIndex: number) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }))
  }

  const isCorrect = (questionIndex: number, selectedAnswer: string) => {
    const question = questions[questionIndex]
    if (question.type === 'multiple-choice' && question.answer) {
      // Handle both cases: answer as letter ("A") and answer as full option ("A) Option text")
      const correctAnswer = question.answer
      
      // If the answer is just a letter (A, B, C, etc.), match it with the option that starts with that letter
      if (correctAnswer.length === 1 && /^[A-Z]$/.test(correctAnswer)) {
        return selectedAnswer.startsWith(correctAnswer + ')')
      }
      
      // Otherwise, do exact match
      return selectedAnswer === correctAnswer
    }
    if (question.type === 'true-false' && question.answer) {
      // For true-false, compare case-insensitively (answer could be "true"/"false" or "True"/"False")
      return selectedAnswer.toLowerCase() === question.answer.toLowerCase()
    }
    return false
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {questions.map((q, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
              {index + 1}
            </span>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-4">
                {formatText(q.question)}
              </p>

              {q.type === 'multiple-choice' && q.options && (
                <div className="space-y-2 mb-4">
                  {q.options.map((option, optionIndex) => {
                    const optionLetter = String.fromCharCode(65 + optionIndex)
                    const isSelected = selectedAnswers[index] === option
                    const isCorrectAnswer = isCorrect(index, option)
                    // Strip the letter prefix if option starts with "A) ", "B) ", etc.
                    const displayText = option.match(/^[A-Z]\)\s/) ? option.substring(3) : option
                    
                    return (
                      <label 
                        key={optionIndex} 
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? isCorrectAnswer 
                              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleAnswerSelect(index, option)
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={isSelected}
                          readOnly
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          isSelected 
                            ? isCorrectAnswer
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'bg-red-600 border-red-600 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && (
                            isCorrectAnswer ? '✓' : '✗'
                          )}
                          {!isSelected && optionLetter}
                        </div>
                        <span className={`${isSelected ? 'font-medium' : ''}`}>
                          {formatText(displayText)}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
              
              {q.type === 'multiple-choice' && !q.options && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  ⚠️ MCQ options not available - this lesson may have been generated before the format was updated
                </div>
              )}

              {q.type === 'true-false' && (
                <div className="space-y-2 mb-4">
                  {['True', 'False'].map((option) => {
                    const isSelected = selectedAnswers[index] === option
                    const isCorrectAnswer = isCorrect(index, option)
                    
                    return (
                      <label 
                        key={option} 
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? isCorrectAnswer 
                              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleAnswerSelect(index, option)
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={isSelected}
                          readOnly
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          isSelected 
                            ? isCorrectAnswer
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'bg-red-600 border-red-600 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && (
                            isCorrectAnswer ? '✓' : '✗'
                          )}
                          {!isSelected && (option === 'True' ? 'T' : 'F')}
                        </div>
                        <span className={`${isSelected ? 'font-medium' : ''}`}>
                          {option}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}



              {q.answer && !hideAnswers && (
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => toggleShowAnswer(index)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    {showAnswers[index] ? 'Hide Answer' : 'Show Answer'}
                  </button>
                  
                  {showAnswers[index] && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      → {formatText(q.answer)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Role Play Exercise Component
export function RolePlayExercise({
  scenario,
  roles,
  instructions,
}: {
  scenario: string
  roles: Array<{
    name: string
    description: string
    keyPoints?: string[]
  }>
  instructions: string
  timeMinutes: number
}) {
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Scenario</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm">{formatText(scenario)}</p>
      </div>

      <div className="space-y-3">
        {roles.map((role, index) => (
          <div key={index} className="border-l-2 border-brand-primary pl-3">
            <p className="font-semibold text-gray-900 dark:text-white mb-0.5">{formatText(role.name)}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{formatText(role.description)}</p>
            {role.keyPoints && (
              <ul className="space-y-0.5">
                {role.keyPoints.map((point, pointIndex) => (
                  <li key={pointIndex} className="text-sm text-gray-500 dark:text-gray-400 flex gap-1.5">
                    <span>·</span><span>{formatText(point)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {instructions && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Instructions</p>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{formatText(instructions)}</p>
        </div>
      )}
    </div>
  )
}

// Discussion Exercise Component  
export function DiscussionExercise({ questions, instructions }: { questions: string[], instructions?: string }) {
  // Enforce exactly 5 questions (filter out any extras)
  const filteredQuestions = (questions || []).slice(0, 5);
  
  return (
    <div className="space-y-4 max-w-4xl">
      {instructions && (
        <p className="text-gray-600 dark:text-gray-400 italic text-sm">
          {formatText(instructions)}
        </p>
      )}
      
      <div className="space-y-4">
        {filteredQuestions.map((question, index) => (
          <div key={index} className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
              {index + 1}
            </span>
            <p className="text-gray-900 dark:text-white">
              {formatText(question)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * TBLT Lesson Components (Preply structure)
 * Lead-in → Task Prep → Task Performance → Post-task → Homework
 */

// ─── Lead-in ───────────────────────────────────────────────────────────────

interface LeadInContent {
  questions: string[]
  instructions?: string
}

export function LeadInExercise({ content }: { content: LeadInContent }) {
  return (
    <div className="space-y-3">
      {content.questions.map((q, i) => (
        <div key={i} className="flex gap-3 items-start">
          <svg className="flex-shrink-0 w-4 h-4 mt-1 text-brand-primary opacity-60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          <p className="text-gray-900 dark:text-white">{q}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Task Prep ─────────────────────────────────────────────────────────────

interface KeyPhrase {
  phrase: string
  function?: string
  usage: string
  example: string
}

interface TaskPrepContent {
  vocabulary: {
    word: string
    partOfSpeech: string
    phonetics: string
    definition: string
    example: string
    synonym?: string
    expressions?: string[]
  }[]
  keyPhrases: KeyPhrase[]
  modelDialogue: {
    setting: string
    characters: { name: string; role?: string; avatar?: string }[]
    dialogue: { character: string; text: string }[]
    comprehensionQuestions?: { gist: string[]; detail: string[] }
    noticingTask?: string
  }
}

export function TaskPrepExercise({ content }: { content: TaskPrepContent }) {
  const hasDialogue = content.modelDialogue?.dialogue?.length > 0
  const tabs = [
    { key: 'vocab' as const, label: 'Vocabulary' },
    { key: 'phrases' as const, label: 'Key Phrases' },
    ...(hasDialogue ? [{ key: 'dialogue' as const, label: 'Model Dialogue' }] : []),
  ]
  const [section, setSection] = useState<'vocab' | 'phrases' | 'dialogue'>(tabs[0].key)

  return (
    <div className="space-y-4">
      {/* Section tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSection(t.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              section === t.key
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {section === 'vocab' && content.vocabulary?.length > 0 && (
        <VocabularyExercise vocabulary={content.vocabulary} />
      )}

      {section === 'phrases' && content.keyPhrases?.length > 0 && (
        <div className="space-y-3">
          {content.keyPhrases.map((kp, i) => (
            <div key={i} className="border-l-2 border-brand-primary pl-3">
              <p className="font-medium text-gray-900 dark:text-white">&ldquo;{kp.phrase}&rdquo;</p>
              {kp.function && <p className="text-xs font-medium text-teal-600 dark:text-teal-400 mt-0.5">{kp.function}</p>}
              {kp.usage && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{kp.usage}</p>}
              {kp.example && <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-0.5">{kp.example}</p>}
            </div>
          ))}
        </div>
      )}

      {section === 'dialogue' && hasDialogue && (
        <div className="space-y-4">
          <DialogueExercise
            context={content.modelDialogue.setting}
            characters={content.modelDialogue.characters}
            dialogue={content.modelDialogue.dialogue}
          />

          {content.modelDialogue.noticingTask && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Noticing Task</p>
              <p className="text-sm text-amber-800 dark:text-amber-300">{content.modelDialogue.noticingTask}</p>
            </div>
          )}

          {content.modelDialogue.comprehensionQuestions && (
            <div className="space-y-4">
              {(content.modelDialogue.comprehensionQuestions.gist?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Gist Questions</p>
                  <div className="space-y-2">
                    {content.modelDialogue.comprehensionQuestions.gist.map((q, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-brand-primary flex-shrink-0">{i + 1}.</span>
                        <p>{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(content.modelDialogue.comprehensionQuestions.detail?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Detail Questions</p>
                  <div className="space-y-2">
                    {content.modelDialogue.comprehensionQuestions.detail.map((q, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-brand-primary flex-shrink-0">{i + 1}.</span>
                        <p>{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Task Performance ──────────────────────────────────────────────────────

interface TaskPerformanceContent {
  scenario: string
  roles: { name: string; description: string; keyPoints?: string[] }[]
  instructions: string
  phrasesToUse?: string[]
}

export function TaskPerformanceExercise({
  content,
  studentName,
  isStudentView = false,
}: {
  content: TaskPerformanceContent
  studentName?: string
  isStudentView?: boolean
}) {
  const [step, setStep] = useState<'prepare' | 'perform' | 'repeat'>('prepare')

  // First role is always the student's role; remaining roles are for the tutor
  const visibleRoles = isStudentView ? content.roles.slice(0, 1) : content.roles
  const displayName = (name: string) =>
    studentName && name === studentName ? 'You' : name

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex gap-1">
        {(['prepare', 'perform', 'repeat'] as const).map((s) => {
          const labels = { prepare: '1. Prepare', perform: '2. Perform', repeat: '3. Repeat' }
          return (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                step === s
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {labels[s]}
            </button>
          )
        })}
      </div>

      {step === 'prepare' && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Scenario</p>
            <p className="text-gray-700 dark:text-gray-300">{content.scenario}</p>
          </div>
          <div className="space-y-3">
            {visibleRoles.map((role, i) => (
              <div key={i} className="border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                <p className="font-medium text-gray-900 dark:text-white mb-0.5">{displayName(role.name)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">{role.description}</p>
                {role.keyPoints && role.keyPoints.length > 0 && (
                  <ul className="space-y-1">
                    {role.keyPoints.map((pt, j) => (
                      <li key={j} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-brand-primary">•</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {content.phrasesToUse && content.phrasesToUse.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">Try to use these phrases:</p>
              <div className="flex flex-wrap gap-2">
                {content.phrasesToUse.map((p, i) => (
                  <span key={i} className="px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 italic">
                    &ldquo;{p}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setStep('perform')}
            className="w-full py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-accent transition-colors"
          >
            Start Roleplay
          </button>
        </div>
      )}

      {step === 'perform' && (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">{content.instructions}</p>
          {content.phrasesToUse && content.phrasesToUse.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">Quick reference:</p>
              <div className="flex flex-wrap gap-2">
                {content.phrasesToUse.map((p, i) => (
                  <span key={i} className="px-2 py-1 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-xs text-brand-primary dark:text-brand-primary italic">
                    &ldquo;{p}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setStep('repeat')}
            className="w-full py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-accent transition-colors"
          >
            Done — Get Feedback
          </button>
        </div>
      )}

      {step === 'repeat' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Now repeat the roleplay</p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Apply the feedback. Try to use the phrases naturally this time — focus on flow, not perfection.
            </p>
          </div>
          {content.phrasesToUse && content.phrasesToUse.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">Phrases to aim for:</p>
              <div className="flex flex-wrap gap-2">
                {content.phrasesToUse.map((p, i) => (
                  <span key={i} className="px-2 py-1 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-xs text-brand-primary dark:text-brand-primary italic">
                    &ldquo;{p}&rdquo;
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

// ─── Post-task ─────────────────────────────────────────────────────────────

interface PostTaskContent {
  grammarFocus: string
  explanation: string
  examples: string[]
  corrections?: { error: string; correction: string; rule: string }[]
}

export function PostTaskExercise({
  content,
  isStudentView = false,
}: {
  content: PostTaskContent
  isStudentView?: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="border-l-2 border-brand-primary pl-3">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Language note</p>
        <p className="font-medium text-gray-900 dark:text-white">{content.grammarFocus}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{content.explanation}</p>
      </div>

      {content.examples && content.examples.length > 0 && (
        <div className="space-y-1.5">
          {content.examples.map((ex, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-green-500 flex-shrink-0">✓</span>
              <span>{ex}</span>
            </div>
          ))}
        </div>
      )}

      {content.corrections && content.corrections.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Watch out for</p>
          <div className="space-y-3">
            {content.corrections.map((c, i) => (
              <div key={i} className="border-l-2 border-red-200 dark:border-red-800 pl-3">
                <p className="text-sm text-red-500 dark:text-red-400 line-through">{c.error}</p>
                <p className="text-sm text-green-600 dark:text-green-400">{c.correction}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{c.rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isStudentView && (
        <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Follow-up idea: send a quick gap-fill or sentence correction exercise on <strong className="text-gray-600 dark:text-gray-300">{content.grammarFocus}</strong>.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Homework ──────────────────────────────────────────────────────────────

interface HomeworkContent {
  taskName: string
  description: string
  instructions: string
}

export function HomeworkExercise({
  content,
  isStudentView = false,
}: {
  content: HomeworkContent
  isStudentView?: boolean
}) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{content.instructions || content.description}</p>
      {!isStudentView && (
        <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">To discuss next lesson</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Start next lesson by asking: &ldquo;Did you have a chance to try this? What did you notice?&rdquo;
          </p>
        </div>
      )}
    </div>
  )
}
