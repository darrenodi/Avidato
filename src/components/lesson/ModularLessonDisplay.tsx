'use client'

import React from 'react'
import { ModularLessonContent, ModuleType, LessonModule } from '@/types/module-lesson'
import { EditButton } from './EditSectionModal'
import {
  WarmUpModule,
  VocabularyCardsModule, VocabularyMatchModule, UsefulExpressionsModule, UsefulLanguageModule,
  LanguageInContextModule, PhrasalVerbsModule,
  GapFillModule, FindTheMistakeModule, OrderingModule,
  SentenceCorrectionModule, GrammarFocusModule,
  DialogueModule, ReadingArticleModule, ReadingScanModule, VocabularyInTextModule,
  SkimMainIdeaModule, MatchingQAModule,
  ListeningTrueFalseModule, ListeningMCQModule,
  RoleplayModule, TalkingPointModule, DiscussionModule, DebateModule,
  HomeworkWritingModule,
  WritingTaskModule,
  PresentationTaskModule,
  RegisterUpgradeModule,
} from './ModularLessonComponents'

// Partial: special-report module types are rendered by SpecialReportLessonDisplay, not here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODULE_MAP: Partial<Record<ModuleType, React.ComponentType<{ content: any; isStudentView?: boolean; tutorNotes?: string }>>> = {
  'warm-up': WarmUpModule,
  'vocabulary-cards': VocabularyCardsModule,
  'vocabulary-match': VocabularyMatchModule,
  'useful-expressions': UsefulExpressionsModule,
  'useful-language': UsefulLanguageModule,
  'language-in-context': LanguageInContextModule,
  'phrasal-verbs': PhrasalVerbsModule,
  'gap-fill': GapFillModule,
  'find-the-mistake': FindTheMistakeModule,
  'ordering': OrderingModule,
  'sentence-correction': SentenceCorrectionModule,
  'grammar-focus': GrammarFocusModule,
  'dialogue': DialogueModule,
  'reading-article': ReadingArticleModule,
  'reading-scan': ReadingScanModule,
  'vocabulary-in-text': VocabularyInTextModule,
  'skim-main-idea': SkimMainIdeaModule,
  'matching-qa': MatchingQAModule,
  'listening-true-false': ListeningTrueFalseModule,
  'listening-mcq': ListeningMCQModule,
  'roleplay': RoleplayModule,
  'talking-point': TalkingPointModule,
  'discussion': DiscussionModule,
  'debate': DebateModule,
  'homework-writing': HomeworkWritingModule,
  'writing-task': WritingTaskModule,
  'presentation-task': PresentationTaskModule,
  'register-upgrade': RegisterUpgradeModule,
}

function ModuleRenderer({ module, isStudentView }: { module: LessonModule; isStudentView?: boolean }) {
  const Component = MODULE_MAP[module.type]
  if (!Component) return <p className="text-sm text-gray-400 italic">Unknown module: {module.type}</p>
  return <Component content={module.content} isStudentView={isStudentView} tutorNotes={isStudentView ? undefined : module.tutorNotes} />
}

interface ModularLessonDisplayProps {
  lesson: ModularLessonContent
  isStudentView?: boolean
  studentName?: string
  onEditModule?: (index: number) => void
}

export default function ModularLessonDisplay({ lesson, isStudentView = false, onEditModule }: ModularLessonDisplayProps) {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      {/* Lesson header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {lesson.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{lesson.objective}</p>
      </div>

      {/* Modules */}
      <div className="space-y-8">
        {(lesson.modules || []).map((module, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Linguahouse-style header: dark blue numbered box + title */}
            <div className="flex items-stretch border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-12 bg-[#1a3a5c] dark:bg-[#1a3a5c] flex-shrink-0">
                <span className="text-white font-bold text-base">{i + 1}</span>
              </div>
              <div className="flex-1 flex items-center justify-between px-5 py-3">
                <h2 className="font-bold text-[#1a3a5c] dark:text-blue-300 text-lg leading-snug">{module.title}</h2>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {(module.timeMinutes ?? 0) > 0 && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums whitespace-nowrap">{module.timeMinutes} min</span>
                  )}
                  {!isStudentView && onEditModule && (
                    <EditButton onClick={() => onEditModule(i)} label="Edit" />
                  )}
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="px-6 py-5">
              <ModuleRenderer module={module} isStudentView={isStudentView} />
            </div>
          </div>
        ))}
      </div>

      {/* Teaching notes (tutor only) */}
      {!isStudentView && lesson.teachingNotes && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Teaching notes</p>
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{lesson.teachingNotes}</p>
        </div>
      )}
    </div>
  )
}
