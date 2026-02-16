import type {
  GeneratedLesson,
  LearningPlan,
  LearningTopic,
  StudentProfile,
} from '@/types/lesson-template'
import { getAIProvider, type AIProvider } from './provider'

export interface LessonAIService {
  generateLearningPlan(student: StudentProfile, existingTopics?: LearningTopic[]): Promise<LearningPlan>
  generateLesson(student: StudentProfile, topic: LearningTopic, duration?: 25 | 50): Promise<GeneratedLesson>
}

export async function getLessonAIService(provider: AIProvider = getAIProvider()): Promise<LessonAIService> {
  if (provider === 'openai') {
    const loadedService = await import('@/lib/openai')
    return loadedService.default as LessonAIService
  }

  const loadedService = await import('@/lib/AIAGENT/gemini')
  return loadedService.default as LessonAIService
}
