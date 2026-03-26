'use client'

import {
  LeadInExercise,
  TaskPrepExercise,
  TaskPerformanceExercise,
  PostTaskExercise,
  HomeworkExercise,
} from './TBLTLessonComponents'
import { VocabularyExercise, WarmupExercise, DialogueExercise, ComprehensionExercise, RolePlayExercise, DiscussionExercise } from './EngooLessonComponents'
import { EditButton } from './EditSectionModal'

const TBLT_TYPES = new Set(['lead-in', 'task-prep', 'task-performance', 'post-task', 'homework'])

const STAGE_META: Record<string, { label: string; color: string }> = {
  'lead-in':          { label: 'Lead-in',           color: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' },
  'task-prep':        { label: 'Task Preparation',  color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-700' },
  'task-performance': { label: 'Task Performance',  color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700' },
  'post-task':        { label: 'Post-task Review',  color: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700' },
  'homework':         { label: 'Homework',           color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700' },
  // legacy
  'vocabulary':   { label: 'Vocabulary',    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700' },
  'warmup':       { label: 'Warm-up',       color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700' },
  'dialogue':     { label: 'Dialogue',      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-700' },
  'comprehension':{ label: 'Comprehension', color: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700' },
  'roleplay':     { label: 'Roleplay',      color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700' },
  'discussion':   { label: 'Discussion',    color: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700' },
}

interface Exercise {
  type: string
  title: string
  description: string
  content: Record<string, unknown>
  timeMinutes: number
}

interface InstantLessonDisplayProps {
  onEditExercise?: (index: number) => void
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
  isStudentView?: boolean
  studentName?: string
}

function renderLegacyContent(exercise: Exercise) {
  const { type, content } = exercise

  if (type === 'vocabulary' && content?.vocabulary && Array.isArray(content.vocabulary)) {
    return <VocabularyExercise vocabulary={content.vocabulary} />
  }
  if (type === 'warmup' && content?.questions && Array.isArray(content.questions)) {
    return <WarmupExercise questions={content.questions as string[]} instructions={content.instructions as string} />
  }
  if (type === 'dialogue' && content?.dialogue && Array.isArray(content.dialogue)) {
    const speakers = [...new Set((content.dialogue as Array<Record<string, unknown>>).map(l => String(l.speaker || l.character || '')))]
    const chars = speakers.map(name => ({ name }))
    const lines = (content.dialogue as Array<Record<string, unknown>>).map(l => ({
      character: String(l.speaker || l.character || ''),
      text: String(l.text || l.line || ''),
    }))
    return <DialogueExercise context={String(content.setting || '')} characters={chars} dialogue={lines} instructions={String(content.instructions || '')} />
  }
  if (type === 'comprehension' && content?.questions && Array.isArray(content.questions)) {
    return <ComprehensionExercise questions={content.questions} />
  }
  if (type === 'roleplay' && content?.scenario) {
    return <RolePlayExercise scenario={String(content.scenario)} roles={content.roles as never[] || []} instructions={String(content.instructions || '')} timeMinutes={exercise.timeMinutes} />
  }
  if (type === 'discussion' && content?.questions && Array.isArray(content.questions)) {
    return <DiscussionExercise questions={content.questions as string[]} instructions={String(content.instructions || '')} />
  }

  // Generic fallback
  return (
    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
      {Object.entries(content).map(([k, v]) => (
        <div key={k}>
          <span className="font-medium capitalize">{k.replace(/([A-Z])/g, ' $1')}: </span>
          <span>{typeof v === 'string' ? v : JSON.stringify(v)}</span>
        </div>
      ))}
    </div>
  )
}

function StageCard({
  exercise,
  index,
  isStudentView,
  studentName,
  onEdit,
}: {
  exercise: Exercise
  index: number
  isStudentView: boolean
  studentName?: string
  onEdit?: () => void
}) {
  const meta = STAGE_META[exercise.type] ?? { label: exercise.title || exercise.type, color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' }
  const isTBLT = TBLT_TYPES.has(exercise.type)

  const renderContent = () => {
    if (!isTBLT) return renderLegacyContent(exercise)

    switch (exercise.type) {
      case 'lead-in':
        if (exercise.content?.questions && Array.isArray(exercise.content.questions)) {
          return <LeadInExercise content={{ questions: exercise.content.questions as string[], instructions: exercise.content.instructions as string }} />
        }
        break
      case 'task-prep':
        return <TaskPrepExercise content={exercise.content as unknown as Parameters<typeof TaskPrepExercise>[0]['content']} />
      case 'task-performance':
        if (exercise.content?.scenario) {
          return <TaskPerformanceExercise content={exercise.content as unknown as Parameters<typeof TaskPerformanceExercise>[0]['content']} studentName={studentName} isStudentView={isStudentView} />
        }
        break
      case 'post-task':
        if (exercise.content?.grammarFocus) {
          return <PostTaskExercise content={exercise.content as unknown as Parameters<typeof PostTaskExercise>[0]['content']} isStudentView={isStudentView} />
        }
        break
      case 'homework':
        if (exercise.content?.taskName) {
          return <HomeworkExercise content={exercise.content as unknown as Parameters<typeof HomeworkExercise>[0]['content']} isStudentView={isStudentView} />
        }
        break
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${meta.color}`}>
              {meta.label}
            </span>
            {exercise.title && exercise.title !== meta.label && (
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{exercise.title}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400 dark:text-gray-500">{exercise.timeMinutes} min</span>
          {!isStudentView && onEdit && <EditButton onClick={onEdit} label="Edit" />}
        </div>
      </div>
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  )
}

export default function InstantLessonDisplay({ lesson, isStudentView = false, studentName, onEditExercise }: InstantLessonDisplayProps) {
  const exercises = (lesson.exercises || []) as Exercise[]

  return (
    <div className="space-y-4">
      {/* Lesson header */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-wide">
            Instant Lesson
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            {lesson.duration} min
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            {lesson.difficulty}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{lesson.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{lesson.objective}</p>
        {lesson.skills && lesson.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {lesson.skills.map((skill, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stages */}
      {exercises.map((exercise, index) => (
        <StageCard
          key={index}
          exercise={exercise}
          index={index}
          isStudentView={isStudentView}
          studentName={studentName}
          onEdit={onEditExercise ? () => onEditExercise(index) : undefined}
        />
      ))}

      {/* Teaching notes — tutor only */}
      {!isStudentView && lesson.teachingNotes && (
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Tutor Notes</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lesson.teachingNotes}</p>
        </div>
      )}

      {/* Materials */}
      {lesson.materials && lesson.materials.length > 0 && (
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Materials</p>
          <div className="flex flex-wrap gap-2">
            {lesson.materials.map((m, i) => (
              <span key={i} className="px-2 py-1 rounded text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
