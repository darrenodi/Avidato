'use client'

import React, { useState, useRef } from 'react'
import { VocabularyExercise } from './EngooLessonComponents'

// ─── Warmer ─────────────────────────────────────────────────────────────────

interface WarmerContent {
  activity: string
  instructions: string
  prompts: string[]
}

export function WarmerExercise({
  content,
  isStudentView = false,
}: {
  content: WarmerContent
  isStudentView?: boolean
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Activity</p>
        <p className="font-medium text-gray-900 dark:text-white">{content.activity}</p>
      </div>
      {!isStudentView && content.instructions && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Tutor Setup</p>
          <p className="text-sm text-amber-800 dark:text-amber-300">{content.instructions}</p>
        </div>
      )}
      {content.prompts?.length > 0 && (
        <ol className="space-y-2">
          {content.prompts.map((p, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-medium">
                {i + 1}
              </span>
              <p className="text-gray-900 dark:text-white pt-0.5">{p}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

// ─── Language Input ──────────────────────────────────────────────────────────

interface CLTDialogueLine {
  speaker: string
  gender: 'male' | 'female' | 'narrator'
  text: string
}

interface LanguageInputContent {
  vocabulary: {
    word: string
    partOfSpeech: string
    phonetics: string
    definition: string
    example: string
    synonym?: string
  }[]
  contextDialogue?: CLTDialogueLine[]
  contextText?: string // backward compat
}

export function LanguageInputExercise({ content }: { content: LanguageInputContent }) {
  const [showTranscript, setShowTranscript] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loadingAudio, setLoadingAudio] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const dialogue = content.contextDialogue

  const handlePlayAudio = async () => {
    if (audioUrl) {
      audioRef.current?.play()
      return
    }
    if (!dialogue || dialogue.length === 0) return
    setLoadingAudio(true)
    setAudioError(null)
    try {
      const res = await fetch('/api/audio/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: dialogue }),
      })
      if (!res.ok) throw new Error('Audio generation failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setTimeout(() => {
        audioRef.current?.play()
      }, 50)
    } catch {
      setAudioError('Could not generate audio.')
    } finally {
      setLoadingAudio(false)
    }
  }

  // Group consecutive lines by speaker for display
  const speakerColors: Record<string, string> = {}
  const colorPool = [
    'text-blue-600 dark:text-blue-400',
    'text-purple-600 dark:text-purple-400',
    'text-green-600 dark:text-green-400',
    'text-orange-600 dark:text-orange-400',
  ]
  if (dialogue) {
    const uniqueSpeakers = [...new Set(dialogue.map(l => l.speaker))]
    uniqueSpeakers.forEach((s, i) => { speakerColors[s] = colorPool[i % colorPool.length] })
  }

  return (
    <div className="space-y-5">
      {content.vocabulary?.length > 0 && (
        <VocabularyExercise vocabulary={content.vocabulary} />
      )}

      {/* Structured dialogue */}
      {dialogue && dialogue.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">In Context</p>

          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={handlePlayAudio}
              disabled={loadingAudio}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-medium hover:bg-brand-accent transition-colors disabled:opacity-50"
            >
              {loadingAudio ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Audio
                </>
              )}
            </button>

            <button
              onClick={() => setShowTranscript(s => !s)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
            >
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </button>
          </div>

          {audioUrl && (
            <audio ref={audioRef} src={audioUrl} controls className="w-full h-8 mb-3" />
          )}
          {audioError && (
            <p className="text-xs text-red-500 mb-2">{audioError}</p>
          )}

          {showTranscript && (
            <div className="space-y-2 border-l-2 border-gray-200 dark:border-gray-600 pl-3">
              {dialogue.map((line, i) => (
                <div key={i}>
                  <span className={`text-xs font-semibold ${speakerColors[line.speaker] || 'text-gray-600 dark:text-gray-400'}`}>
                    {line.speaker}:
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200 ml-1">{line.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legacy plain text fallback */}
      {!dialogue && content.contextText && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">In Context</p>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed border-l-2 border-gray-200 dark:border-gray-600 pl-3">
            {content.contextText}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Communicative Activity ──────────────────────────────────────────────────

interface CommunicativeActivityContent {
  activityName: string
  instructions: string
  studentCharacter?: string
  studentRole: string
  tutorRole: string
  prompts?: string[]
}

export function CommunicativeActivityExercise({
  content,
  isStudentView = false,
}: {
  content: CommunicativeActivityContent
  isStudentView?: boolean
}) {
  const studentLabel = content.studentCharacter
    ? `You are ${content.studentCharacter}`
    : 'Your Role'

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Activity</p>
        <p className="font-medium text-gray-900 dark:text-white">{content.activityName}</p>
      </div>

      {!isStudentView && content.instructions && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Tutor Setup</p>
          <p className="text-sm text-amber-800 dark:text-amber-300">{content.instructions}</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="border-l-2 border-brand-primary pl-3">
          <p className="font-medium text-sm text-gray-900 dark:text-white mb-0.5">{studentLabel}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{content.studentRole}</p>
        </div>

        {!isStudentView && (
          <div className="border-l-2 border-gray-200 dark:border-gray-600 pl-3">
            <p className="font-medium text-sm text-gray-900 dark:text-white mb-0.5">Tutor</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{content.tutorRole}</p>
          </div>
        )}
      </div>

      {content.prompts && content.prompts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Prompts</p>
          <div className="flex flex-wrap gap-2">
            {content.prompts.map((p, i) => (
              <span key={i} className="px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 italic">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Wrap-up ─────────────────────────────────────────────────────────────────

interface WrapUpContent {
  reviewQuestions: string[]
  homework: string
}

export function WrapUpExercise({
  content,
  isStudentView = false,
}: {
  content: WrapUpContent
  isStudentView?: boolean
}) {
  return (
    <div className="space-y-5">
      {content.reviewQuestions?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Review</p>
          <ol className="space-y-2">
            {content.reviewQuestions.map((q, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                <p className="text-gray-900 dark:text-white pt-0.5">{q}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {content.homework && (
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Homework</p>
          <p className="text-gray-700 dark:text-gray-300">{content.homework}</p>
          {!isStudentView && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">To discuss next lesson</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Start next lesson by asking: &ldquo;Did you get a chance to try this? What did you notice?&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
