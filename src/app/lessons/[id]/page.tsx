'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { shareLesson, updateLessonContent, refineLesson, generateModuleImage } from '@/app/actions/ai-generation'
import { Under18LessonDisplay } from '@/lib/lesson-displays'
import GrammarLessonDisplay from '@/components/lesson/GrammarLessonDisplay'
import InstantLessonDisplay from '@/components/lesson/InstantLessonDisplay'
import {
  VocabularyExercise,
  WarmupExercise,
  DialogueExercise,
  ComprehensionExercise,
  RolePlayExercise,
  DiscussionExercise,
  PreparationExercise,
  FinalPrepExercise,
  UsefulExpressionsExercise,
} from '@/components/lesson/EngooLessonComponents'
import {
  LeadInExercise,
  TaskPrepExercise,
  TaskPerformanceExercise,
  PostTaskExercise,
  HomeworkExercise,
} from '@/components/lesson/TBLTLessonComponents'
import { PresentationExercise, PracticeExercise, ProductionExercise } from '@/components/lesson/PPPLessonComponents'
import { WarmerExercise, LanguageInputExercise, CommunicativeActivityExercise, WrapUpExercise } from '@/components/lesson/CLTLessonComponents'
import { SentenceCorrectionRenderer } from '@/lib/lesson-displays'
import EditSectionModal, { EditButton } from '@/components/lesson/EditSectionModal'
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

/**
 * Transform LessonData to Under18Lesson format
 * Maps the API response format to the display component's expected format
 */
const transformToUnder18Lesson = (lessonData: LessonData) => {
  return {
    metadata: {
      id: lessonData.id,
      title: lessonData.content.title,
      level: lessonData.student.level,
      topic: lessonData.content.title,
      duration: lessonData.content.duration,
      difficulty: lessonData.content.difficulty,
      targetAudience: 'Students Under 18',
      ageGroup: 'Under 18',
      targetLanguage: lessonData.student.targetLanguage
    },
    learningObjectives: {
      communicative: [lessonData.content.objective || ''],
      linguistic: lessonData.content.skills || [],
      cultural: []
    },
    exercises: lessonData.content.exercises.map((exercise, index) => ({
      id: `exercise-${index}`,
      number: index + 1,
      type: exercise.type,
      title: exercise.title,
      description: exercise.description,
      timeMinutes: exercise.timeMinutes,
      instructions: exercise.description || '',
      content: (typeof exercise.content === 'object' && exercise.content !== null) 
        ? (exercise.content as Record<string, unknown>) 
        : {}
    }))
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
  const [openEx, setOpenEx] = useState<Set<number>>(new Set([0,1,2,3,4,5,6,7,8,9]))
  const [refineOpen, setRefineOpen] = useState(false)
  const [refineText, setRefineText] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [refineError, setRefineError] = useState<string | null>(null)

  const toggleEx = (index: number) => {
    setOpenEx(prev => {
      const next = new Set(prev)
      if (next.has(index)) { next.delete(index) } else { next.add(index) }
      return next
    })
  }

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

  // Auto-generate images for image-discussion modules that are missing imageData (tutor view only)
  useEffect(() => {
    if (!lesson || !session?.user) return
    const content = lesson.content as unknown as { modules?: Array<{ type: string; content: { imagePlaceholders?: unknown[]; imageData?: string } }> }
    if (!content?.modules) return

    const missingIndexes = content.modules
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => m.type === 'image-discussion' && !m.content.imageData && (m.content.imagePlaceholders?.length ?? 0) > 0)
      .map(({ i }) => i)

    if (missingIndexes.length === 0) return

    ;(async () => {
      for (const idx of missingIndexes) {
        const result = await generateModuleImage(lesson.id, idx)
        if (result.success && result.imageData) {
          setLesson(prev => {
            if (!prev) return prev
            const modules = [...(prev.content as unknown as { modules: unknown[] }).modules]
            const mod = modules[idx] as Record<string, unknown>
            modules[idx] = { ...mod, content: { ...(mod.content as object), imageData: result.imageData } }
            return { ...prev, content: { ...prev.content, modules } as typeof prev.content }
          })
        }
      }
    })()
  }, [lesson?.id]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const renderExerciseContent = (exercise: { type: string; content: unknown; timeMinutes: number }) => {
    // Type assertion for content - we know the structure from our AI generation
    const content = exercise.content as Record<string, unknown>

    switch (exercise.type) {
      case 'vocabulary':
        if (content?.vocabulary && Array.isArray(content.vocabulary)) {
          return <VocabularyExercise vocabulary={content.vocabulary} />
        }
        break
      
      case 'warmup':
        if (content?.questions && Array.isArray(content.questions)) {
          return <WarmupExercise questions={content.questions} instructions={content.instructions as string} />
        }
        break
      
      case 'dialogue':
        if (content?.dialogue && Array.isArray(content.dialogue)) {
          const transformedDialogue = content.dialogue.map((line: Record<string, unknown>) => ({
            character: (line.speaker || line.character || 'Unknown') as string,
            text: (line.line || line.text || '') as string
          }));
          const characters = content.characters as { name: string; role?: string }[] ||
            [...new Set(transformedDialogue.map(l => l.character))].map(name => ({ name }))
          const setting = content.setting as string || content.context as string || '';
          const castSpeakers = (content.cast as { name: string; gender: 'male' | 'female' }[] | undefined)
          return (
            <DialogueExercise
              context={setting}
              characters={characters}
              dialogue={transformedDialogue}
              instructions={content.instructions as string || ''}
              speakers={castSpeakers}
            />
          )
        }
        break
      
      case 'useful-expressions':
        if (content?.expressions && Array.isArray(content.expressions)) {
          return (
            <UsefulExpressionsExercise
              expressions={content.expressions as { phrase: string; meaning: string; example?: string }[]}
              instructions={content.instructions as string | undefined}
            />
          )
        }
        break

      case 'useful-phrases':
        if (content?.phrases && Array.isArray(content.phrases)) {
          return (
            <div className="space-y-3">
              {!!content.context && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">{String(content.context)}</p>
              )}
              {(content.phrases as Array<{ phrase: string; usage: string }>).map((item, index) => (
                <div key={index} className="flex gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.phrase}</p>
                    {item.usage && <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{item.usage}</p>}
                  </div>
                </div>
              ))}
            </div>
          )
        }
        break

      case 'comprehension':
        if (content?.questions && Array.isArray(content.questions)) {
          return <ComprehensionExercise questions={content.questions} />
        }
        break
      
      case 'roleplay':
        if (content?.scenario && content?.roles && Array.isArray(content.roles)) {
          return (
            <RolePlayExercise
              scenario={content.scenario as string}
              roles={content.roles}
              instructions={content.instructions as string || ''}
              timeMinutes={exercise.timeMinutes}
            />
          )
        }
        break
      
      case 'discussion':
        if (content?.questions && Array.isArray(content.questions)) {
          return <DiscussionExercise questions={content.questions} instructions={content.instructions as string} />
        }
        break

      case 'sentence-correction':
      case 'sentenceCorrection':
      case 'sentence_correction':
        if (content?.sentences && Array.isArray(content.sentences)) {
          return (
            <SentenceCorrectionRenderer
              title="Sentence Correction"
              instructions={(content.instructions as string) || 'Correct the errors in each sentence.'}
              sentences={content.sentences as Array<{ incorrect: string; correct: string; errorType: string }>}
              timeMinutes={exercise.timeMinutes || 10}
              isTutorVersion={isTutorVersion}
            />
          )
        }
        break

      case 'preparation':
        if (content?.questions && Array.isArray(content.questions)) {
          return <PreparationExercise questions={content.questions} tips={content.tips as string[]} />
        }
        break

      case 'final-prep':
      case 'finalPrep':
      case 'finalprep':
        return (
          <FinalPrepExercise
            phrases={content.phrases as string[] || []}
            checklist={content.checklist as string[] || []}
            confidence={content.confidence as string[] || []}
          />
        )

      // ── TBLT exercise types ──────────────────────────────────────────────
      case 'lead-in':
        if (content?.questions && Array.isArray(content.questions)) {
          return <LeadInExercise content={{ questions: content.questions as string[], instructions: content.instructions as string }} />
        }
        break

      case 'task-prep':
        return <TaskPrepExercise content={content as unknown as Parameters<typeof TaskPrepExercise>[0]['content']} />

      case 'task-performance':
        if (content?.scenario && content?.roles) {
          return <TaskPerformanceExercise content={content as unknown as Parameters<typeof TaskPerformanceExercise>[0]['content']} studentName={lesson?.student?.name} />
        }
        break

      case 'post-task':
        if (content?.grammarFocus) {
          return <PostTaskExercise content={content as unknown as Parameters<typeof PostTaskExercise>[0]['content']} />
        }
        break

      case 'homework':
        if (content?.taskName) {
          return <HomeworkExercise content={content as unknown as Parameters<typeof HomeworkExercise>[0]['content']} />
        }
        break

      // ── PPP exercise types ───────────────────────────────────────────────
      case 'presentation':
        return <PresentationExercise content={content as unknown as Parameters<typeof PresentationExercise>[0]['content']} />

      case 'practice':
        return <PracticeExercise content={content as unknown as Parameters<typeof PracticeExercise>[0]['content']} />

      case 'production':
        return <ProductionExercise content={content as unknown as Parameters<typeof ProductionExercise>[0]['content']} />

      // ── CLT exercise types ───────────────────────────────────────────────
      case 'warmer':
        return <WarmerExercise content={content as unknown as Parameters<typeof WarmerExercise>[0]['content']} />

      case 'language-input':
        return <LanguageInputExercise content={content as unknown as Parameters<typeof LanguageInputExercise>[0]['content']} />

      case 'communicative-activity':
        return <CommunicativeActivityExercise content={content as unknown as Parameters<typeof CommunicativeActivityExercise>[0]['content']} />

      case 'wrap-up':
        return <WrapUpExercise content={content as unknown as Parameters<typeof WrapUpExercise>[0]['content']} />

      default:
        // Fallback for other exercise types or malformed content
        return (
          <div className="whitespace-pre-wrap text-gray-900 dark:text-white">
            {typeof exercise.content === 'string' ? exercise.content : JSON.stringify(exercise.content, null, 2)}
          </div>
        )
    }

    // Fallback if content doesn't match expected structure
    return (
      <div className="whitespace-pre-wrap text-gray-900 dark:text-white">
        {typeof exercise.content === 'string' ? exercise.content : JSON.stringify(exercise.content, null, 2)}
      </div>
    )
  }


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
                  onGenerateImage={async (moduleIndex) => {
                    const result = await generateModuleImage(lesson.id, moduleIndex)
                    if (result.success && result.imageData) {
                      const modules = [...(lesson.content as unknown as { modules: unknown[] }).modules]
                      const mod = modules[moduleIndex] as Record<string, unknown>
                      modules[moduleIndex] = { ...mod, content: { ...(mod.content as object), imageData: result.imageData } }
                      setLesson({ ...lesson, content: { ...lesson.content, modules } as typeof lesson.content })
                    }
                  }}
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
              </div>
            </div>

            {/* Lesson Header */}
            <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">{lesson.student.name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">{lesson.student.level}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">{lesson.content.duration} min</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-medium">
                  {lesson.content.lessonType === 'Under-18' ? 'kids' : lesson.content.lessonType}
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
            {lesson.content.lessonType === 'Under-18' ? (
              <Under18LessonDisplay
                lesson={transformToUnder18Lesson(lesson)}
                showObjectives={false}
                showProgressBar={true}
                showHeader={false}
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
              <div className="space-y-3">
                {lesson.content.exercises.map((exercise, index) => {
                  const badgeColors = ['bg-brand-primary', 'bg-[#b5620b]', 'bg-[#4a3f8f]', 'bg-[#0e7490]', 'bg-[#9d174d]']
                  const badgeColor = badgeColors[index % badgeColors.length]
                  const isOpen = openEx.has(index)
                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => toggleEx(index)}
                          className="flex items-center gap-3 min-w-0 flex-1 text-left"
                        >
                          <span className={`${badgeColor} text-white text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 tabular-nums`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{exercise.title}</h3>
                            {exercise.type !== 'warmup' && exercise.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{exercise.description}</p>
                            )}
                          </div>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-gray-400 dark:text-gray-500">{exercise.timeMinutes} min</span>
                          <EditButton onClick={() => setEditingExerciseIndex(index)} label="Edit" />
                        </div>
                      </div>
                      {isOpen && (
                        <div className="p-4 overflow-x-auto">
                          {renderExerciseContent(exercise)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

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