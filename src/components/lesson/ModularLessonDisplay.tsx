'use client'

import React from 'react'
import { ModularLessonContent, ModuleType, LessonModule } from '@/types/module-lesson'
import { EditButton } from './EditSectionModal'
import {
  WarmUpModule, ImageDiscussionModule,
  VocabularyCardsModule, VocabularyMatchModule, UsefulExpressionsModule, UsefulLanguageModule,
  LanguageInContextModule, PhrasalVerbsModule,
  GapFillModule, CompleteTheSentenceModule, FindTheMistakeModule, OrderingModule,
  FillInBlanksDialogueModule, SentenceCorrectionModule, GrammarFocusModule,
  DialogueModule, ReadingArticleModule, ReadingScanModule, VocabularyInTextModule,
  ReadingSectionPredictionModule, SkimMainIdeaModule, MatchingQAModule, NoticingModule,
  ListeningPredictionsModule, ListeningMainIdeaModule, ListeningTrueFalseModule,
  ListeningMCQModule, ListeningSpecificInfoModule, ListeningTableModule, ListeningComprehensionModule,
  RoleplayModule, TalkingPointModule, DiscussionModule, FurtherDiscussionModule, DebateModule,
  YourTurnAskModule, YourTurnAnswerModule, YourTurnTellModule, HomeworkWritingModule,
} from './ModularLessonComponents'

// ─── Module renderer map ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODULE_MAP: Record<ModuleType, React.ComponentType<{ content: any; isStudentView?: boolean; tutorNotes?: string }>> = {
  'warm-up': WarmUpModule,
  'image-discussion': ImageDiscussionModule,
  'vocabulary-cards': VocabularyCardsModule,
  'vocabulary-match': VocabularyMatchModule,
  'useful-expressions': UsefulExpressionsModule,
  'useful-language': UsefulLanguageModule,
  'language-in-context': LanguageInContextModule,
  'phrasal-verbs': PhrasalVerbsModule,
  'gap-fill': GapFillModule,
  'complete-the-sentence': CompleteTheSentenceModule,
  'find-the-mistake': FindTheMistakeModule,
  'ordering': OrderingModule,
  'fill-in-blanks-dialogue': FillInBlanksDialogueModule,
  'sentence-correction': SentenceCorrectionModule,
  'grammar-focus': GrammarFocusModule,
  'dialogue': DialogueModule,
  'reading-article': ReadingArticleModule,
  'reading-scan': ReadingScanModule,
  'vocabulary-in-text': VocabularyInTextModule,
  'reading-section-prediction': ReadingSectionPredictionModule,
  'skim-main-idea': SkimMainIdeaModule,
  'matching-qa': MatchingQAModule,
  'noticing': NoticingModule,
  'listening-predictions': ListeningPredictionsModule,
  'listening-main-idea': ListeningMainIdeaModule,
  'listening-true-false': ListeningTrueFalseModule,
  'listening-mcq': ListeningMCQModule,
  'listening-specific-info': ListeningSpecificInfoModule,
  'listening-table': ListeningTableModule,
  'listening-comprehension': ListeningComprehensionModule,
  'roleplay': RoleplayModule,
  'talking-point': TalkingPointModule,
  'discussion': DiscussionModule,
  'further-discussion': FurtherDiscussionModule,
  'debate': DebateModule,
  'your-turn-ask': YourTurnAskModule,
  'your-turn-answer': YourTurnAnswerModule,
  'your-turn-tell': YourTurnTellModule,
  'homework-writing': HomeworkWritingModule,
}

function ModuleRenderer({ module, isStudentView }: { module: LessonModule; isStudentView?: boolean }) {
  const Component = MODULE_MAP[module.type]
  if (!Component) {
    return <p className="text-sm text-gray-400 italic">Unknown module type: {module.type}</p>
  }
  return (
    <Component
      content={module.content}
      isStudentView={isStudentView}
      tutorNotes={isStudentView ? undefined : module.tutorNotes}
    />
  )
}

// ─── Main display ─────────────────────────────────────────────────────────────

interface ModularLessonDisplayProps {
  lesson: ModularLessonContent
  isStudentView?: boolean
  studentName?: string
  onEditModule?: (index: number) => void
}

export default function ModularLessonDisplay({
  lesson,
  isStudentView = false,
  onEditModule,
}: ModularLessonDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Objective banner */}
      <div className="border-l-4 border-brand-primary pl-4 py-0.5">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Lesson objective</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{lesson.objective}</p>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {lesson.modules.map((module, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Module header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 w-5 text-center">{i + 1}</span>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">{module.title}</h3>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400 dark:text-gray-500">{module.timeMinutes} min</span>
                {!isStudentView && onEditModule && (
                  <EditButton onClick={() => onEditModule(i)} label="Edit" />
                )}
              </div>
            </div>
            {/* Module content */}
            <div className="p-4">
              <ModuleRenderer module={module} isStudentView={isStudentView} />
            </div>
          </div>
        ))}
      </div>

      {/* Teaching notes (tutor only) */}
      {!isStudentView && lesson.teachingNotes && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Teaching notes</p>
          <p className="text-sm text-amber-800 dark:text-amber-300">{lesson.teachingNotes}</p>
        </div>
      )}
    </div>
  )
}
