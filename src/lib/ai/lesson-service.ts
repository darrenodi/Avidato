import type {
  GeneratedLesson,
  LearningPlan,
  LearningTopic,
  StudentProfile,
  BlockLearningPlan,
  BlockLesson,
  TopicBlock,
} from '@/types/lesson-template'
import { getAIProvider, type AIProvider } from './provider'

export interface LessonAIService {
  generateLearningPlan(student: StudentProfile, existingTopics?: LearningTopic[]): Promise<LearningPlan>
  generateLesson(student: StudentProfile, topic: LearningTopic, duration?: 25 | 50): Promise<GeneratedLesson>
  generateBlockPlan(student: StudentProfile, existingBlocks?: TopicBlock[], skillFocus?: string[]): Promise<BlockLearningPlan>
  generateModularLesson(student: StudentProfile, lesson: BlockLesson, duration?: 25 | 50, previousContext?: string): Promise<GeneratedLesson>
  generateRaw(prompt: string): Promise<string | null>
}

export async function getLessonAIService(provider: AIProvider = getAIProvider()): Promise<LessonAIService> {
  if (provider === 'claude') {
    const loadedService = await import('@/lib/AIAGENT/claudeService')
    return loadedService.default as LessonAIService
  }

  if (provider === 'openai') {
    const loadedService = await import('@/lib/openai')
    return loadedService.default as LessonAIService
  }

  const loadedService = await import('@/lib/AIAGENT/gemini')
  return loadedService.default as LessonAIService
}
