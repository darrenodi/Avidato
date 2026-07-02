'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { shareLesson, updateLessonContent, refineLesson } from '@/app/actions/ai-generation'
import { SpecialReportLessonDisplay } from '@/lib/lesson-displays'
import GrammarLessonDisplay from '@/components/lesson/GrammarLessonDisplay'
import InstantLessonDisplay from '@/components/lesson/InstantLessonDisplay'
import EditSectionModal from '@/components/lesson/EditSectionModal'
import type { SpecialReportLessonContent } from '@/types/module-lesson'
import ModularLessonDisplay from '@/components/lesson/ModularLessonDisplay'

/**
 * Individual Lesson View Page
 * 
 * Displays a generated lesson with full content structure:
 * - Header/Overview with objectives, skills, vocabulary
 * - Exercise 1: Controlled Input
 * - Exercise 2: Structured Practice  
 * - Exercise 3: Freer Production
 * - Exercise 4: Optional Extension
 * 
 * Includes back navigation to student profile
 */

interface LessonData {
  id: string
  title: string
  overview: string | null
  content: {
    title: string
    lessonType: string
    difficulty: number
    duration: number
    objective: string
    skills: string[]
    vocabulary: (string | { word?: string; term?: string; definition?: string; example?: string })[]
    context: string
    exercises: {
      type: string
      title: string
      description: string
      content: string | string[] | object
      timeMinutes: number
    }[]
    homework?: string
    materials?: string[]
    teachingNotes?: string
  }
  createdAt: Date
  student: {
    id: string
    name: string
    targetLanguage: string
    level: string
  }
}

export default function LessonPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string

  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTaught, setIsTaught] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null)
  const [refineOpen, setRefineOpen] = useState(false)
  const [refineText, setRefineText] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [refineError, setRefineError] = useState<string | null>(null)

  const handleRefine = async () => {
    if (!refineText.trim() || !lesson) return
    setIsRefining(true)
    setRefineError(null)
    const result = await refineLesson(lesson.id, refineText.trim())
    if (result.success) {
      setRefineOpen(false)
      setRefineText('')
      router.refresh()
    } else {
      setRefineError(result.error || 'Something went wrong')
    }
    setIsRefining(false)
  }

  // This is tutor view (answers visible) - student view is at /lessons/[id]/share
  const isTutorVersion = true

  // Copy share link to clipboard AND mark lesson as taught (Issue #37)
  const copyShareLink = async () => {
    try {
      setIsMarking(true)
      
      // Mark lesson as taught (Issue #37: vocabulary continuity tracking)
      if (!isTaught && lesson) {
        const result = await shareLesson(lesson.id, lesson.student.id)
        if (result.success) {
          setIsTaught(true)
        } else {
          console.error('Failed to mark lesson as taught:', result.error)
        }
      }

      // Copy share link to clipboard
      const shareUrl = `${window.location.origin}/lessons/${lessonId}/share`
      await navigator.clipboard.writeText(shareUrl)
      
      setIsMarking(false)
    } catch (err) {
      console.error('Failed to copy link:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = `${window.location.origin}/lessons/${lessonId}/share`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setIsMarking(false)
    }
  }

  // Fetch lesson data (only fetch if lesson not already loaded)
  useEffect(() => {
    const fetchLesson = async () => {
      if (session && lessonId) {
        // Skip if lesson is already loaded
        if (lesson?.id === lessonId) {
          return
        }

        try {
          setLoading(true)
          setError(null)
          
          const response = await fetch(`/api/lessons/${lessonId}`)
          const data = await response.json()
          
          if (response.ok) {
            setLesson(data)
            // Restore scroll position if available
            if (typeof window !== 'undefined') {
              const savedScroll = sessionStorage.getItem(`lesson-scroll-${lessonId}`)
              if (savedScroll) {
                setTimeout(() => {
                  window.scrollTo(0, parseInt(savedScroll))
                }, 100)
              }
            }
          } else {
            setError(data.error || 'Failed to load lesson')
          }
        } catch (err) {
          console.error('Error fetching lesson:', err)
          setError('Failed to load lesson. Please try again.')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchLesson()
  }, [session, lessonId, lesson?.id])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
  }, [session, status, router])

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`lesson-scroll-${lessonId}`, window.scrollY.toString())
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [lessonId])


  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading lesson...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

            {/* Lesson Content */}
            {!loading && !error && lesson && (
          <>
            {/* Check if it's an instant lesson and use dedicated renderer */}
            {lesson.content?.lessonType === 'instant' ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Header with Back Button and Share */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Link
                    href={`/dashboard/students/${lesson.student.id}`}
                    className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to {lesson.student.name}
                  </Link>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setRefineOpen(true)}
                      className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Refine
                    </button>
                    <button
                      onClick={copyShareLink}
                      disabled={isMarking}
                      className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTaught ? (
                        <>
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-500">Taught</span>
                        </>
                      ) : isMarking ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-brand-primary rounded-full animate-spin"></div>
                          <span>Marking...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          Copy Student Link
                        </>
                      )}
                    </button>
                    <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex-shrink-0">
                      <button
                        onClick={() => window.open(`/api/lessons/${lessonId}/print`, '_blank')}
                        className="inline-flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                        title="Student worksheet — answers hidden"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Student PDF
                      </button>
                      <span className="w-px bg-gray-300 dark:bg-gray-600" />
                      <button
                        onClick={() => window.open(`/api/lessons/${lessonId}/print?tutor=1`, '_blank')}
                        className="inline-flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                        title="Tutor copy — answers shown"
                      >
                        Tutor PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI notice */}
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  AI can make mistakes. Please review the lesson before teaching it and use the <strong className="mx-1">Refine</strong> or <strong className="mx-1">Edit</strong> buttons to correct any issues.
                </div>

                <InstantLessonDisplay
                  lesson={{
                    ...lesson.content,
                    vocabulary: (lesson.content.vocabulary?.filter(v => typeof v === 'object') || []) as Array<{
                      word?: string
                      term?: string
                      definition?: string
                      example?: string
                      partOfSpeech?: string
                      phonetics?: string
                    }>
                  }}
                  isStudentView={false}
                  studentName={lesson.student.name}
                  onEditExercise={(i) => setEditingExerciseIndex(i)}
                />

                {/* Edit Exercise Modal */}
                {editingExerciseIndex !== null && lesson && lesson.content.exercises[editingExerciseIndex] && (
                  <EditSectionModal
                    title={`Edit: ${lesson.content.exercises[editingExerciseIndex].title}`}
                    data={lesson.content.exercises[editingExerciseIndex]}
                    onSave={async (updated) => {
                      const updatedExercises = [...lesson.content.exercises]
                      updatedExercises[editingExerciseIndex] = updated as typeof updatedExercises[number]
                      const newContent = { ...lesson.content, exercises: updatedExercises }
                      const result = await updateLessonContent(lesson.id, newContent as unknown as Record<string, unknown>)
                      if (result.success) {
                        setLesson({ ...lesson, content: newContent })
                        setEditingExerciseIndex(null)
                      } else {
                        alert(result.error || 'Failed to save changes')
                      }
                    }}
                    onCancel={() => setEditingExerciseIndex(null)}
                    hiddenFields={['timeMinutes']}
                  />
                )}
              </div>
            ) : lesson.content?.lessonType === 'modular' ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Link href={`/dashboard/students/${lesson.student.id}`} className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to {lesson.student.name}
                  </Link>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button onClick={() => setRefineOpen(true)} className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Refine
                    </button>
                    <button onClick={copyShareLink} disabled={isMarking} className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none disabled:opacity-50">
                      {isTaught ? <><svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-green-500">Taught</span></> : <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>Copy Student Link</>}
                    </button>
                    <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex-shrink-0">
                      <button onClick={() => window.open(`/api/lessons/${lessonId}/print`, '_blank')} className="inline-flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm" title="Student worksheet — answers hidden">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Student PDF
                      </button>
                      <span className="w-px bg-gray-300 dark:bg-gray-600" />
                      <button onClick={() => window.open(`/api/lessons/${lessonId}/print?tutor=1`, '_blank')} className="inline-flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm" title="Tutor copy — answers shown">
                        Tutor PDF
                      </button>
                    </div>
                  </div>
                </div>
                {/* Title */}
                <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">{lesson.student.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">{lesson.student.level}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">{lesson.content.duration} min</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-medium">modular</span>
                  </div>
                  <h1 className="font-fraunces text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{lesson.content.title}</h1>
                </div>
                {/* AI notice */}
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  AI can make mistakes. Please review the lesson before teaching it and use the <strong className="mx-1">Refine</strong> or <strong className="mx-1">Edit</strong> buttons to correct any issues.
                </div>

                {/* Modular display */}
                <ModularLessonDisplay
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  lesson={lesson.content as any}
                  isStudentView={false}
                  studentName={lesson.student.name}
                  onEditModule={(i) => setEditingExerciseIndex(i)}
                />
                {/* Edit module modal */}
                {editingExerciseIndex !== null && lesson && !!(lesson.content as unknown as { modules: unknown[] }).modules?.[editingExerciseIndex] && (
                  <EditSectionModal
                    title={`Edit module`}
                    data={(lesson.content as unknown as { modules: unknown[] }).modules[editingExerciseIndex] as Record<string, unknown>}
                    onSave={async (updated) => {
                      const modules = [...(lesson.content as unknown as { modules: unknown[] }).modules]
                      modules[editingExerciseIndex] = updated
                      const newContent = { ...lesson.content, modules }
                      const result = await updateLessonContent(lesson.id, newContent as unknown as Record<string, unknown>)
                      if (result.success) {
                        setLesson({ ...lesson, content: newContent as typeof lesson.content })
                        setEditingExerciseIndex(null)
                      } else {
                        alert(result.error || 'Failed to save changes')
                      }
                    }}
                    onCancel={() => setEditingExerciseIndex(null)}
                    hiddenFields={['timeMinutes', 'tutorNotes']}
                  />
                )}
              </div>
            ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Header with Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href={`/dashboard/students/${lesson.student.id}`}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {lesson.student.name}
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setRefineOpen(true)}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Refine
                </button>
                <button
                  onClick={copyShareLink}
                  disabled={isMarking}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTaught ? (
                    <>
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-500">Taught</span>
                    </>
                  ) : isMarking ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-brand-primary rounded-full animate-spin"></div>
                      <span>Marking...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Copy Student Link
                    </>
                  )}
                </button>
                <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => window.open(`/api/lessons/${lessonId}/print`, '_blank')}
                    className="inline-flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    title="Student worksheet — answers hidden"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Student PDF
                  </button>
                  <span className="w-px bg-gray-300 dark:bg-gray-600" />
                  <button
                    onClick={() => window.open(`/api/lessons/${lessonId}/print?tutor=1`, '_blank')}
                    className="inline-flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    title="Tutor copy — answers shown"
                  >
                    Tutor PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Lesson Header */}
            <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">{lesson.student.name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">{lesson.student.level}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">{lesson.content.duration} min</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-medium">
                  {lesson.content.lessonType}
                </span>
              </div>
              <h1 className="font-fraunces text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {lesson.content.title}
              </h1>
              {!(lesson.content as Record<string, unknown>).isGrammarLesson && (
                <>
                  <div className="border-l-4 border-brand-primary pl-4 py-0.5 mb-4">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                      {lesson.content.objective}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {((lesson.content as Record<string, unknown>).skills as string[]).map((skill) => (
                      <span key={skill} className="px-2.5 py-0.5 rounded-full text-xs bg-brand-primary/10 text-brand-primary font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* AI notice */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              AI can make mistakes. Please review the lesson before teaching it and use the <strong className="mx-1">Refine</strong> or <strong className="mx-1">Edit</strong> buttons to correct any issues.
            </div>

            {/* Lesson Exercises */}
            {lesson.content.lessonType === 'special-report' ? (
              <SpecialReportLessonDisplay
                lesson={lesson.content as unknown as SpecialReportLessonContent}
                showObjectives={true}
                showProgressBar={true}
                showHeader={false}
                isTutorView={isTutorVersion}
              />
            ) : (lesson.content as Record<string, unknown>).isGrammarLesson ? (
              <GrammarLessonDisplay lesson={lesson.content as unknown as Record<string, unknown> & {
                title: string
                grammarTopic: string
                context: string
                explanation: { definition: string; usage: string; examples: string[] }
                exercises: { type: string; title: string; content: Record<string, unknown> }[]
              }} />
            ) : (
              <div className="px-4 py-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                This lesson uses a retired format and can no longer be displayed. Please regenerate it from the student&apos;s learning plan.
              </div>
            )}
          </div>
            )}
          </>
        )}

        {/* No Lesson Found */}
        {!loading && !lesson && !error && (
          <div className="text-center py-8 sm:py-12 px-4">
            <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253z" />
            </svg>
            <h3 className="mt-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
              Lesson not found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              The lesson you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <div className="mt-4 sm:mt-6">
              <Link
                href="/dashboard/students"
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-accent"
              >
                <svg className="-ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Students
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Refine Lesson Modal */}
      {refineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Refine Lesson</h2>
              <button
                onClick={() => { setRefineOpen(false); setRefineText(''); setRefineError(null) }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">What do you want to change?</p>
            <textarea
              value={refineText}
              onChange={e => setRefineText(e.target.value)}
              placeholder="e.g. Make the dialogue more formal. Replace the reading article with something about logistics. Add two more vocabulary items."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
              autoFocus
            />
            {refineError && (
              <p className="text-sm text-red-600 dark:text-red-400">{refineError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setRefineOpen(false); setRefineText(''); setRefineError(null) }}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRefine}
                disabled={!refineText.trim() || isRefining}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isRefining ? 'Refining...' : 'Apply changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}