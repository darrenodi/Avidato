// src/lib/placement-test-engine.ts
// Core adaptive placement test engine
// Algorithm: Start at B1 (difficulty 25), 3 consecutive correct → move up, 2 consecutive wrong → move down
// Converges when pattern stabilises over ~20-25 questions

import { prisma } from './prisma'

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// Difficulty ranges per CEFR level
const LEVEL_RANGES: Record<CEFRLevel, { min: number; max: number }> = {
  A1: { min: 1, max: 10 },
  A2: { min: 11, max: 20 },
  B1: { min: 21, max: 30 },
  B2: { min: 31, max: 40 },
  C1: { min: 41, max: 50 },
  C2: { min: 51, max: 60 },
}

// Adaptive algorithm configuration
const CONFIG = {
  START_LEVEL: 'B1' as CEFRLevel,
  START_DIFFICULTY: 25,
  CONSECUTIVE_CORRECT_TO_ADVANCE: 3,
  CONSECUTIVE_WRONG_TO_REGRESS: 2,
  MIN_QUESTIONS: 15,
  MAX_QUESTIONS: 30,
  CONVERGENCE_WINDOW: 6, // look at last N answers to check stability
  CONVERGENCE_THRESHOLD: 0.67, // 67% in same level = converged
  DIFFICULTY_STEP_UP: 5,
  DIFFICULTY_STEP_DOWN: 5,
}

export interface AdaptiveState {
  currentDifficulty: number
  currentLevel: CEFRLevel
  questionsAsked: number
  correctCount: number
  consecutiveCorrect: number
  consecutiveWrong: number
  answeredQuestionIds: string[]
  levelHistory: CEFRLevel[]
  isComplete: boolean
  determinedLevel: CEFRLevel | null
}

export function createInitialState(): AdaptiveState {
  return {
    currentDifficulty: CONFIG.START_DIFFICULTY,
    currentLevel: CONFIG.START_LEVEL,
    questionsAsked: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    answeredQuestionIds: [],
    levelHistory: [],
    isComplete: false,
    determinedLevel: null,
  }
}

function difficultyToLevel(difficulty: number): CEFRLevel {
  if (difficulty <= 10) return 'A1'
  if (difficulty <= 20) return 'A2'
  if (difficulty <= 30) return 'B1'
  if (difficulty <= 40) return 'B2'
  if (difficulty <= 50) return 'C1'
  return 'C2'
}

function clampDifficulty(d: number): number {
  return Math.max(1, Math.min(60, d))
}

/**
 * Process an answer and update the adaptive state.
 * Returns the updated state.
 */
export function processAnswer(state: AdaptiveState, questionId: string, isCorrect: boolean): AdaptiveState {
  const newState = { ...state }
  newState.questionsAsked++
  newState.answeredQuestionIds = [...state.answeredQuestionIds, questionId]
  
  if (isCorrect) {
    newState.correctCount++
    newState.consecutiveCorrect++
    newState.consecutiveWrong = 0
  } else {
    newState.consecutiveCorrect = 0
    newState.consecutiveWrong++
  }

  // Adjust difficulty based on consecutive answers
  if (newState.consecutiveCorrect >= CONFIG.CONSECUTIVE_CORRECT_TO_ADVANCE) {
    newState.currentDifficulty = clampDifficulty(newState.currentDifficulty + CONFIG.DIFFICULTY_STEP_UP)
    newState.consecutiveCorrect = 0
  } else if (newState.consecutiveWrong >= CONFIG.CONSECUTIVE_WRONG_TO_REGRESS) {
    newState.currentDifficulty = clampDifficulty(newState.currentDifficulty - CONFIG.DIFFICULTY_STEP_DOWN)
    newState.consecutiveWrong = 0
  }

  newState.currentLevel = difficultyToLevel(newState.currentDifficulty)
  newState.levelHistory = [...state.levelHistory, newState.currentLevel]

  // Check convergence
  if (newState.questionsAsked >= CONFIG.MIN_QUESTIONS) {
    const converged = checkConvergence(newState)
    if (converged || newState.questionsAsked >= CONFIG.MAX_QUESTIONS) {
      newState.isComplete = true
      newState.determinedLevel = determineFinalLevel(newState)
    }
  }

  return newState
}

/**
 * Check if the test has converged (student level is stable)
 */
function checkConvergence(state: AdaptiveState): boolean {
  if (state.levelHistory.length < CONFIG.CONVERGENCE_WINDOW) return false

  const recentLevels = state.levelHistory.slice(-CONFIG.CONVERGENCE_WINDOW)
  const levelCounts = new Map<string, number>()

  for (const level of recentLevels) {
    levelCounts.set(level, (levelCounts.get(level) || 0) + 1)
  }

  // Check if any level appears >= threshold times in the window
  for (const [, count] of levelCounts) {
    if (count / CONFIG.CONVERGENCE_WINDOW >= CONFIG.CONVERGENCE_THRESHOLD) {
      return true
    }
  }

  return false
}

/**
 * Determine final CEFR level from test data
 */
function determineFinalLevel(state: AdaptiveState): CEFRLevel {
  // Use weighted approach: recent levels matter more
  const weights = state.levelHistory.map((_, i) => 1 + i * 0.5) // later questions weighted more
  const levelScores = new Map<CEFRLevel, number>()

  for (let i = 0; i < state.levelHistory.length; i++) {
    const level = state.levelHistory[i]
    levelScores.set(level, (levelScores.get(level) || 0) + weights[i])
  }

  // Also factor in the final difficulty zone
  const finalLevel = difficultyToLevel(state.currentDifficulty)
  levelScores.set(finalLevel, (levelScores.get(finalLevel) || 0) + 5)

  // Find the level with highest weighted score
  let bestLevel: CEFRLevel = 'B1'
  let bestScore = 0
  for (const [level, score] of levelScores) {
    if (score > bestScore) {
      bestScore = score
      bestLevel = level as CEFRLevel
    }
  }

  return bestLevel
}

/**
 * Calculate a percentage score based on performance
 */
export function calculateScore(state: AdaptiveState): number {
  if (state.questionsAsked === 0) return 0

  // Weighted score: harder correct answers worth more
  const level = state.determinedLevel || state.currentLevel
  const levelIndex = CEFR_LEVELS.indexOf(level)
  const baseScore = (state.correctCount / state.questionsAsked) * 100

  // Adjust score based on the level reached
  // Higher levels get a bonus for attempting harder questions
  const levelBonus = levelIndex * 3
  return Math.min(100, Math.round(baseScore + levelBonus))
}

/**
 * Fetch the next question for the adaptive test.
 * Selects from questions near the current difficulty level.
 * Avoids already-answered questions.
 * Prioritises variety in topics.
 */
export async function getNextQuestion(
  section: string,
  state: AdaptiveState,
  answeredTopics?: string[]
) {
  const targetDifficulty = state.currentDifficulty
  const range = 5 // look +/- 5 difficulty levels

  // First try: find questions near target difficulty not yet answered
  const question = await prisma.placementQuestion.findFirst({
    where: {
      section,
      active: true,
      difficulty: {
        gte: Math.max(1, targetDifficulty - range),
        lte: Math.min(60, targetDifficulty + range),
      },
      id: {
        notIn: state.answeredQuestionIds,
      },
      // Try to avoid recently tested topics
      ...(answeredTopics && answeredTopics.length > 0 && answeredTopics.length < 30
        ? { topic: { notIn: answeredTopics } }
        : {}),
    },
    include: {
      readingPassage: section === 'reading' ? true : undefined,
    },
    orderBy: {
      // Order by closeness to target difficulty
      difficulty: targetDifficulty > 30 ? 'desc' : 'asc',
    },
  })

  if (question) return question

  // Fallback: broaden difficulty range, allow repeated topics
  const fallback = await prisma.placementQuestion.findFirst({
    where: {
      section,
      active: true,
      difficulty: {
        gte: Math.max(1, targetDifficulty - 15),
        lte: Math.min(60, targetDifficulty + 15),
      },
      id: {
        notIn: state.answeredQuestionIds,
      },
    },
    include: {
      readingPassage: section === 'reading' ? true : undefined,
    },
    orderBy: {
      difficulty: 'asc',
    },
  })

  return fallback
}

/**
 * Analyse completed test results to find strengths and weaknesses.
 */
export async function analyseResults(attemptId: string) {
  const answers = await prisma.placementAnswer.findMany({
    where: { attemptId },
    include: {
      question: true,
    },
    orderBy: { questionOrder: 'asc' },
  })

  const topicResults = new Map<string, { correct: number; total: number; level: string }>()

  for (const answer of answers) {
    const topic = answer.question.recommendedTopic || answer.question.topic
    const existing = topicResults.get(topic) || { correct: 0, total: 0, level: answer.question.cefrLevel }
    existing.total++
    if (answer.isCorrect) existing.correct++
    topicResults.set(topic, existing)
  }

  const strengths: string[] = []
  const weaknesses: string[] = []
  const recommendations: Array<{ topic: string; level: string; reason: string }> = []

  for (const [topic, result] of topicResults) {
    const accuracy = result.total > 0 ? result.correct / result.total : 0

    if (accuracy >= 0.8 && result.total >= 2) {
      strengths.push(topic)
    } else if (accuracy < 0.5 && result.total >= 1) {
      weaknesses.push(topic)
      recommendations.push({
        topic,
        level: result.level,
        reason: `Scored ${Math.round(accuracy * 100)}% on ${topic} questions`,
      })
    }
  }

  return { strengths, weaknesses, recommendations }
}

/**
 * Generate a unique share token
 */
export function generateShareToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let token = ''
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Level descriptions for UI display
 */
export const CEFR_DESCRIPTIONS: Record<CEFRLevel, { label: string; description: string; color: string }> = {
  A1: {
    label: 'Beginner',
    description: 'Can understand and use familiar everyday expressions and very basic phrases.',
    color: '#22c55e', // green
  },
  A2: {
    label: 'Elementary',
    description: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance.',
    color: '#84cc16', // lime
  },
  B1: {
    label: 'Intermediate',
    description: 'Can understand the main points of clear standard input on familiar matters regularly encountered.',
    color: '#eab308', // yellow
  },
  B2: {
    label: 'Upper Intermediate',
    description: 'Can understand the main ideas of complex text on both concrete and abstract topics.',
    color: '#f97316', // orange
  },
  C1: {
    label: 'Advanced',
    description: 'Can understand a wide range of demanding, longer texts, and recognise implicit meaning.',
    color: '#ef4444', // red
  },
  C2: {
    label: 'Proficiency',
    description: 'Can understand with ease virtually everything heard or read.',
    color: '#a855f7', // purple
  },
}
