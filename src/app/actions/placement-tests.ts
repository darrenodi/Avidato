'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import { prisma } from '../../lib/prisma'
import {
  generateShareToken,
  processAnswer,
  calculateScore,
  analyseResults,
  rebuildLevelHistory,
  type AdaptiveState,
  type CEFRLevel,
} from '../../lib/placement-test-engine'
import { sendPlacementTestCompleteEmail } from '../../lib/email-service'
import type { Session } from 'next-auth'

// ─── Types ───────────────────────────────────────────────────────────

interface ActionResponse {
  success: boolean
  error?: string
  message?: string
  data?: Record<string, unknown>
}

// ─── Assignment Management ───────────────────────────────────────────

export async function createPlacementAssignment(
  studentId: string,
  sections: string[] = ['grammar', 'reading']
): Promise<ActionResponse> {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user || typeof session.user.id !== 'string') {
    return { success: false, error: 'You must be logged in.' }
  }

  try {
    // Verify student belongs to this teacher
    const student = await prisma.student.findFirst({
      where: { id: studentId, tutorId: session.user.id },
    })

    if (!student) {
      return { success: false, error: 'Student not found.' }
    }

    // Check for existing active assignment
    const existing = await prisma.placementTestAssignment.findFirst({
      where: {
        studentId,
        assignedById: session.user.id,
        status: { in: ['assigned', 'in_progress'] },
      },
    })

    if (existing) {
      return {
        success: false,
        error: 'This student already has an active placement test. Cancel it first to assign a new one.',
      }
    }

    // Generate unique share token
    let token = generateShareToken()
    let attempts = 0
    while (attempts < 5) {
      const exists = await prisma.placementTestAssignment.findUnique({
        where: { shareToken: token },
      })
      if (!exists) break
      token = generateShareToken()
      attempts++
    }

    const assignment = await prisma.placementTestAssignment.create({
      data: {
        studentId,
        assignedById: session.user.id,
        sections,
        shareToken: token,
        studentFullName: student.name,
        emailOnComplete: true,
      },
    })

    return {
      success: true,
      message: 'Placement test assigned successfully.',
      data: {
        id: assignment.id,
        shareToken: assignment.shareToken,
        link: `/placement-test/${assignment.shareToken}`,
      },
    }
  } catch (error) {
    console.error('Error creating placement assignment:', error)
    return { success: false, error: 'Failed to create placement test assignment.' }
  }
}

export async function getPlacementAssignments(): Promise<ActionResponse> {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user || typeof session.user.id !== 'string') {
    return { success: false, error: 'You must be logged in.' }
  }

  try {
    const assignments = await prisma.placementTestAssignment.findMany({
      where: { assignedById: session.user.id },
      include: {
        student: { select: { id: true, name: true, level: true } },
        attempts: {
          select: {
            section: true,
            status: true,
            determinedLevel: true,
            score: true,
            questionsAsked: true,
            correctCount: true,
          },
        },
        result: {
          select: {
            overallLevel: true,
            grammarLevel: true,
            readingLevel: true,
            grammarScore: true,
            readingScore: true,
            certificateId: true,
            totalTimeSecs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: { assignments } }
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return { success: false, error: 'Failed to fetch placement tests.' }
  }
}

export async function cancelPlacementAssignment(assignmentId: string): Promise<ActionResponse> {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user || typeof session.user.id !== 'string') {
    return { success: false, error: 'You must be logged in.' }
  }

  try {
    const assignment = await prisma.placementTestAssignment.findFirst({
      where: { id: assignmentId, assignedById: session.user.id },
    })

    if (!assignment) {
      return { success: false, error: 'Assignment not found.' }
    }

    if (assignment.status === 'completed') {
      return { success: false, error: 'Cannot cancel a completed test.' }
    }

    // Delete associated data
    await prisma.placementTestAssignment.delete({
      where: { id: assignmentId },
    })

    return { success: true, message: 'Placement test cancelled.' }
  } catch (error) {
    console.error('Error cancelling assignment:', error)
    return { success: false, error: 'Failed to cancel assignment.' }
  }
}

// ─── Student Test-Taking ─────────────────────────────────────────────

export async function getTestByToken(shareToken: string): Promise<ActionResponse> {
  try {
    const assignment = await prisma.placementTestAssignment.findUnique({
      where: { shareToken },
      include: {
        student: { select: { name: true } },
        assignedBy: { select: { name: true } },
        attempts: {
          select: {
            id: true,
            section: true,
            status: true,
            questionsAsked: true,
            correctCount: true,
            consecutiveCorrect: true,
            consecutiveWrong: true,
            currentLevel: true,
            determinedLevel: true,
            score: true,
            timeSpentSecs: true,
          },
        },
        result: true,
      },
    })

    if (!assignment) {
      return { success: false, error: 'Test not found or link is invalid.' }
    }

    return { success: true, data: { assignment } }
  } catch (error) {
    console.error('Error fetching test:', error)
    return { success: false, error: 'Failed to load test.' }
  }
}

export async function startSection(shareToken: string, section: string): Promise<ActionResponse> {
  try {
    const assignment = await prisma.placementTestAssignment.findUnique({
      where: { shareToken },
    })

    if (!assignment) {
      return { success: false, error: 'Test not found.' }
    }

    if (assignment.status === 'completed') {
      return { success: false, error: 'This test has already been completed.' }
    }

    if (!assignment.sections.includes(section)) {
      return { success: false, error: `Section "${section}" is not part of this test.` }
    }

    // Update assignment status
    if (assignment.status === 'assigned') {
      await prisma.placementTestAssignment.update({
        where: { id: assignment.id },
        data: { status: 'in_progress' },
      })
    }

    // Create or get section attempt
    let attempt = await prisma.placementSectionAttempt.findUnique({
      where: {
        assignmentId_section: {
          assignmentId: assignment.id,
          section,
        },
      },
    })

    if (attempt && attempt.status === 'completed') {
      return { success: false, error: 'This section has already been completed.' }
    }

    if (!attempt) {
      attempt = await prisma.placementSectionAttempt.create({
        data: {
          assignmentId: assignment.id,
          section,
          status: 'in_progress',
          currentLevel: 'B1',
          startedAt: new Date(),
        },
      })
    } else if (attempt.status === 'not_started') {
      attempt = await prisma.placementSectionAttempt.update({
        where: { id: attempt.id },
        data: { status: 'in_progress', startedAt: new Date() },
      })
    }

    return {
      success: true,
      data: {
        attemptId: attempt.id,
        section: attempt.section,
        currentLevel: attempt.currentLevel,
        questionsAsked: attempt.questionsAsked,
      },
    }
  } catch (error) {
    console.error('Error starting section:', error)
    return { success: false, error: 'Failed to start section.' }
  }
}

export async function getNextTestQuestion(
  attemptId: string
): Promise<ActionResponse> {
  try {
    const attempt = await prisma.placementSectionAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          select: {
            questionId: true,
            isCorrect: true,
            question: {
              select: { topic: true, readingPassageId: true },
            },
          },
          orderBy: { questionOrder: 'asc' },
        },
      },
    })

    if (!attempt) {
      return { success: false, error: 'Test attempt not found.' }
    }

    if (attempt.status === 'completed') {
      return { success: false, error: 'This section is already complete.' }
    }

    // Rebuild level history from stored answers for accurate state
    const { levelHistory, currentDifficulty } = rebuildLevelHistory(
      attempt.answers.map((a) => ({ questionId: a.questionId, isCorrect: a.isCorrect }))
    )

    // Build adaptive state from DB
    const state: AdaptiveState = {
      currentDifficulty: attempt.questionsAsked > 0 ? currentDifficulty : levelToDifficulty(attempt.currentLevel as CEFRLevel),
      currentLevel: attempt.currentLevel as CEFRLevel,
      questionsAsked: attempt.questionsAsked,
      correctCount: attempt.correctCount,
      consecutiveCorrect: attempt.consecutiveCorrect,
      consecutiveWrong: attempt.consecutiveWrong,
      answeredQuestionIds: attempt.answers.map((a) => a.questionId),
      levelHistory,
      isComplete: false,
      determinedLevel: null,
    }

    // Check if we should stop
    if (state.questionsAsked >= 30) {
      return {
        success: true,
        data: { complete: true, questionsAsked: state.questionsAsked },
      }
    }

    const answeredTopics = attempt.answers.map((a) => a.question.topic)

    // For reading section, use passage-grouped logic
    let question: Awaited<ReturnType<typeof getNextQuestionFromDB>>
    let passageProgress: { current: number; total: number } | null = null

    if (attempt.section === 'reading') {
      const result = await getNextReadingQuestion(state, attempt.answers)
      question = result.question
      passageProgress = result.passageProgress
    } else {
      question = await getNextQuestionFromDB(attempt.section, state, answeredTopics)
    }

    if (!question) {
      return {
        success: true,
        data: { complete: true, questionsAsked: state.questionsAsked },
      }
    }

    // Return question without correct answer
    return {
      success: true,
      data: {
        complete: false,
        question: {
          id: question.id,
          stem: question.stem,
          optionA: question.optionA,
          optionB: question.optionB,
          optionC: question.optionC,
          optionD: question.optionD,
          cefrLevel: question.cefrLevel,
          topic: question.topic,
          readingPassage: question.readingPassage
            ? {
                title: question.readingPassage.title,
                content: question.readingPassage.content,
              }
            : null,
        },
        progress: {
          questionsAsked: state.questionsAsked,
          currentLevel: state.currentLevel,
          maxQuestions: 30,
        },
        passageProgress,
      },
    }
  } catch (error) {
    console.error('Error getting next question:', error)
    return { success: false, error: 'Failed to load question.' }
  }
}

export async function submitAnswer(
  attemptId: string,
  questionId: string,
  selectedAnswer: string,
  timeTakenSecs: number
): Promise<ActionResponse> {
  try {
    const attempt = await prisma.placementSectionAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          select: { questionId: true, isCorrect: true },
          orderBy: { questionOrder: 'asc' },
        },
        assignment: true,
      },
    })

    if (!attempt) {
      return { success: false, error: 'Test attempt not found.' }
    }

    if (attempt.status === 'completed') {
      return { success: false, error: 'This section is already complete.' }
    }

    // Check answer hasn't already been submitted for this question
    if (attempt.answers.some((a) => a.questionId === questionId)) {
      return { success: false, error: 'Answer already submitted for this question.' }
    }

    // Get the question to check correctness
    const question = await prisma.placementQuestion.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      return { success: false, error: 'Question not found.' }
    }

    const isCorrect = selectedAnswer === question.correctAnswer

    // Rebuild full level history from stored answers
    const answerLog = attempt.answers.map((a) => ({ questionId: a.questionId, isCorrect: a.isCorrect }))
    const { levelHistory, currentDifficulty } = rebuildLevelHistory(answerLog)

    // Build per-level accuracy from answer history
    const levelAccuracy: Record<string, { correct: number; total: number }> = {}
    let replayDiff = CONFIG_START_DIFFICULTY
    let replayConsCorrect = 0
    let replayConsWrong = 0
    for (const a of answerLog) {
      const lvl = difficultyToLevelHelper(replayDiff)
      if (!levelAccuracy[lvl]) levelAccuracy[lvl] = { correct: 0, total: 0 }
      levelAccuracy[lvl].total++
      if (a.isCorrect) {
        levelAccuracy[lvl].correct++
        replayConsCorrect++
        replayConsWrong = 0
      } else {
        replayConsCorrect = 0
        replayConsWrong++
      }
      if (replayConsCorrect >= 3) { replayDiff = Math.min(60, replayDiff + 5); replayConsCorrect = 0 }
      else if (replayConsWrong >= 2) { replayDiff = Math.max(1, replayDiff - 5); replayConsWrong = 0 }
    }

    // Build current adaptive state with full history
    const state: AdaptiveState = {
      currentDifficulty: answerLog.length > 0 ? currentDifficulty : levelToDifficulty(attempt.currentLevel as CEFRLevel),
      currentLevel: attempt.currentLevel as CEFRLevel,
      questionsAsked: attempt.questionsAsked,
      correctCount: attempt.correctCount,
      consecutiveCorrect: attempt.consecutiveCorrect,
      consecutiveWrong: attempt.consecutiveWrong,
      answeredQuestionIds: attempt.answers.map((a) => a.questionId),
      levelHistory,
      levelAccuracy,
      isComplete: false,
      determinedLevel: null,
    }

    // Process through adaptive engine
    const newState = processAnswer(state, questionId, isCorrect)

    // Save answer and update attempt in transaction
    await prisma.$transaction([
      prisma.placementAnswer.create({
        data: {
          attemptId,
          questionId,
          selectedAnswer,
          isCorrect,
          timeTakenSecs: Math.max(0, timeTakenSecs),
          questionOrder: attempt.questionsAsked + 1,
        },
      }),
      prisma.placementSectionAttempt.update({
        where: { id: attemptId },
        data: {
          currentLevel: newState.currentLevel,
          questionsAsked: newState.questionsAsked,
          correctCount: newState.correctCount,
          consecutiveCorrect: newState.consecutiveCorrect,
          consecutiveWrong: newState.consecutiveWrong,
          timeSpentSecs: { increment: Math.max(0, timeTakenSecs) },
        },
      }),
    ])

    // Check if section is complete
    const sectionComplete = newState.isComplete || newState.questionsAsked >= 30

    if (sectionComplete) {
      const finalLevel = newState.determinedLevel || newState.currentLevel
      const score = calculateScore(newState)

      await prisma.placementSectionAttempt.update({
        where: { id: attemptId },
        data: {
          status: 'completed',
          determinedLevel: finalLevel,
          score,
          completedAt: new Date(),
        },
      })

      // Check if ALL sections are now complete
      await checkAndFinaliseTest(attempt.assignmentId)
    }

    return {
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        sectionComplete,
        progress: {
          questionsAsked: newState.questionsAsked,
          currentLevel: newState.currentLevel,
          maxQuestions: 30,
        },
      },
    }
  } catch (error) {
    console.error('Error submitting answer:', error)
    return { success: false, error: 'Failed to submit answer.' }
  }
}

// ─── Results & Finalisation ──────────────────────────────────────────

async function checkAndFinaliseTest(assignmentId: string) {
  const assignment = await prisma.placementTestAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      attempts: true,
      assignedBy: { select: { email: true, name: true } },
      student: { select: { name: true } },
    },
  })

  if (!assignment) return

  const allSectionsComplete = assignment.sections.every((section) => {
    const attempt = assignment.attempts.find((a) => a.section === section)
    return attempt?.status === 'completed'
  })

  if (!allSectionsComplete) return

  // All sections done. Compute final result.
  const grammarAttempt = assignment.attempts.find((a) => a.section === 'grammar')
  const readingAttempt = assignment.attempts.find((a) => a.section === 'reading')

  const grammarLevel = grammarAttempt?.determinedLevel || null
  const readingLevel = readingAttempt?.determinedLevel || null

  // Overall level: weighted average (grammar 60%, reading 40%)
  let overallLevel: CEFRLevel = 'B1'
  if (grammarLevel && readingLevel) {
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    const gi = levels.indexOf(grammarLevel as CEFRLevel)
    const ri = levels.indexOf(readingLevel as CEFRLevel)
    const avgIndex = Math.round(gi * 0.6 + ri * 0.4)
    overallLevel = levels[Math.min(avgIndex, 5)]
  } else if (grammarLevel) {
    overallLevel = grammarLevel as CEFRLevel
  } else if (readingLevel) {
    overallLevel = readingLevel as CEFRLevel
  }

  // Analyse strengths and weaknesses
  let allStrengths: string[] = []
  let allWeaknesses: string[] = []
  let allRecommendations: Array<{ topic: string; level: string; reason: string }> = []

  for (const attempt of assignment.attempts) {
    const analysis = await analyseResults(attempt.id)
    allStrengths = [...allStrengths, ...analysis.strengths]
    allWeaknesses = [...allWeaknesses, ...analysis.weaknesses]
    allRecommendations = [...allRecommendations, ...analysis.recommendations]
  }

  const totalTimeSecs = assignment.attempts.reduce((sum, a) => sum + a.timeSpentSecs, 0)

  // Generate certificate ID
  const certificateId = `AVID-PT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

  // Create result
  await prisma.placementTestResult.create({
    data: {
      assignmentId,
      overallLevel,
      grammarLevel,
      readingLevel,
      grammarScore: grammarAttempt?.score || null,
      readingScore: readingAttempt?.score || null,
      strengths: [...new Set(allStrengths)],
      weaknesses: [...new Set(allWeaknesses)],
      recommendations: allRecommendations,
      totalTimeSecs,
      certificateId,
    },
  })

  // Update assignment status
  await prisma.placementTestAssignment.update({
    where: { id: assignmentId },
    data: {
      status: 'completed',
      completedAt: new Date(),
    },
  })

  // Send email notification to teacher
  if (assignment.emailOnComplete && assignment.assignedBy?.email) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resultsUrl = `${baseUrl}/dashboard/placement-tests/${assignmentId}/results`
    sendPlacementTestCompleteEmail(
      assignment.assignedBy.email,
      assignment.assignedBy.name,
      assignment.student?.name || assignment.studentFullName || 'Student',
      overallLevel,
      grammarLevel,
      readingLevel,
      resultsUrl
    ).catch((err) => console.error('Failed to send placement test email:', err))
  }
}

export async function getPlacementResult(assignmentId: string): Promise<ActionResponse> {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user || typeof session.user.id !== 'string') {
    return { success: false, error: 'You must be logged in.' }
  }

  try {
    const result = await prisma.placementTestResult.findUnique({
      where: { assignmentId },
      include: {
        assignment: {
          include: {
            student: { select: { name: true, level: true } },
            attempts: {
              include: {
                answers: {
                  include: {
                    question: {
                      select: {
                        stem: true,
                        optionA: true,
                        optionB: true,
                        optionC: true,
                        optionD: true,
                        correctAnswer: true,
                        explanation: true,
                        topic: true,
                        cefrLevel: true,
                        recommendedTopic: true,
                      },
                    },
                  },
                  orderBy: { questionOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    })

    if (!result) {
      return { success: false, error: 'Result not found.' }
    }

    // Ensure teacher owns this
    if (result.assignment.assignedById !== session.user.id) {
      return { success: false, error: 'Unauthorized.' }
    }

    return { success: true, data: { result } }
  } catch (error) {
    console.error('Error fetching result:', error)
    return { success: false, error: 'Failed to fetch result.' }
  }
}

export async function getResultByToken(shareToken: string): Promise<ActionResponse> {
  try {
    const assignment = await prisma.placementTestAssignment.findUnique({
      where: { shareToken },
      include: {
        student: { select: { name: true } },
        result: true,
      },
    })

    if (!assignment || !assignment.result) {
      return { success: false, error: 'Result not found.' }
    }

    return {
      success: true,
      data: {
        studentName: assignment.student?.name || assignment.studentFullName || 'Student',
        result: assignment.result,
      },
    }
  } catch (error) {
    console.error('Error fetching result by token:', error)
    return { success: false, error: 'Failed to load result.' }
  }
}

// ─── Student List for Teacher ────────────────────────────────────────

export async function getStudentsForAssignment(): Promise<ActionResponse> {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user || typeof session.user.id !== 'string') {
    return { success: false, error: 'You must be logged in.' }
  }

  try {
    const students = await prisma.student.findMany({
      where: { tutorId: session.user.id, archived: false },
      select: {
        id: true,
        name: true,
        level: true,
        placementTests: {
          where: { status: { in: ['assigned', 'in_progress'] } },
          select: { id: true, status: true },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    })

    return { success: true, data: { students } }
  } catch (error) {
    console.error('Error fetching students:', error)
    return { success: false, error: 'Failed to load students.' }
  }
}

// ─── Apply Level to Student ──────────────────────────────────────────

export async function applyPlacementLevel(assignmentId: string): Promise<ActionResponse> {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user || typeof session.user.id !== 'string') {
    return { success: false, error: 'You must be logged in.' }
  }

  try {
    const result = await prisma.placementTestResult.findUnique({
      where: { assignmentId },
      include: {
        assignment: {
          select: { assignedById: true, studentId: true },
        },
      },
    })

    if (!result) {
      return { success: false, error: 'Result not found.' }
    }

    if (result.assignment.assignedById !== session.user.id) {
      return { success: false, error: 'Unauthorized.' }
    }

    await prisma.student.update({
      where: { id: result.assignment.studentId },
      data: { level: result.overallLevel },
    })

    return {
      success: true,
      message: `Student level updated to ${result.overallLevel}.`,
      data: { newLevel: result.overallLevel },
    }
  } catch (error) {
    console.error('Error applying placement level:', error)
    return { success: false, error: 'Failed to update student level.' }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────

const CONFIG_START_DIFFICULTY = 25

function levelToDifficulty(level: CEFRLevel): number {
  const map: Record<CEFRLevel, number> = {
    A1: 5,
    A2: 15,
    B1: 25,
    B2: 35,
    C1: 45,
    C2: 55,
  }
  return map[level]
}

function difficultyToLevelHelper(difficulty: number): CEFRLevel {
  if (difficulty <= 10) return 'A1'
  if (difficulty <= 20) return 'A2'
  if (difficulty <= 30) return 'B1'
  if (difficulty <= 40) return 'B2'
  if (difficulty <= 50) return 'C1'
  return 'C2'
}

/**
 * Passage-grouped reading question selection.
 * Like real exams (IELTS/Cambridge): show all questions for one passage
 * before moving to the next.
 */
async function getNextReadingQuestion(
  state: AdaptiveState,
  answers: Array<{
    questionId: string
    question: { topic: string; readingPassageId: string | null }
  }>
) {
  // Find the current passage in progress (if any)
  // Look at answered questions in reverse to find the most recent passage
  const answeredPassageIds = new Set<string>()
  let currentPassageId: string | null = null

  for (let i = answers.length - 1; i >= 0; i--) {
    const passageId = answers[i].question.readingPassageId
    if (passageId) {
      if (currentPassageId === null) currentPassageId = passageId
      answeredPassageIds.add(passageId)
    }
  }

  // If we have a current passage, check if there are unanswered questions for it
  if (currentPassageId) {
    const remainingForPassage = await prisma.placementQuestion.findMany({
      where: {
        section: 'reading',
        active: true,
        readingPassageId: currentPassageId,
        id: { notIn: state.answeredQuestionIds },
      },
      include: { readingPassage: true },
      orderBy: { difficulty: 'asc' },
    })

    if (remainingForPassage.length > 0) {
      // Still have questions for this passage — serve the next one
      const totalForPassage = await prisma.placementQuestion.count({
        where: { section: 'reading', active: true, readingPassageId: currentPassageId },
      })
      const answeredForPassage = totalForPassage - remainingForPassage.length

      return {
        question: remainingForPassage[0],
        passageProgress: {
          current: answeredForPassage + 1,
          total: totalForPassage,
        },
      }
    }
    // All questions for current passage answered — fall through to pick a new passage
  }

  // Pick a new passage at the target difficulty level
  const targetDifficulty = state.currentDifficulty
  const range = 5

  // Find a passage whose difficulty is near the target and hasn't been fully used
  const completedPassageIds = Array.from(answeredPassageIds)

  let passage = await prisma.readingPassage.findFirst({
    where: {
      id: { notIn: completedPassageIds },
      // Find passages with questions near the target difficulty
      questions: {
        some: {
          active: true,
          difficulty: {
            gte: Math.max(1, targetDifficulty - range),
            lte: Math.min(60, targetDifficulty + range),
          },
          id: { notIn: state.answeredQuestionIds },
        },
      },
    },
    orderBy: { cefrLevel: 'asc' },
  })

  // Fallback: broaden range
  if (!passage) {
    passage = await prisma.readingPassage.findFirst({
      where: {
        id: { notIn: completedPassageIds },
        questions: {
          some: {
            active: true,
            difficulty: {
              gte: Math.max(1, targetDifficulty - 15),
              lte: Math.min(60, targetDifficulty + 15),
            },
            id: { notIn: state.answeredQuestionIds },
          },
        },
      },
      orderBy: { cefrLevel: 'asc' },
    })
  }

  if (!passage) {
    // No more passages available
    return { question: null, passageProgress: null }
  }

  // Get the first question from this new passage
  const questions = await prisma.placementQuestion.findMany({
    where: {
      section: 'reading',
      active: true,
      readingPassageId: passage.id,
      id: { notIn: state.answeredQuestionIds },
    },
    include: { readingPassage: true },
    orderBy: { difficulty: 'asc' },
  })

  if (questions.length === 0) {
    return { question: null, passageProgress: null }
  }

  const totalForPassage = await prisma.placementQuestion.count({
    where: { section: 'reading', active: true, readingPassageId: passage.id },
  })

  return {
    question: questions[0],
    passageProgress: {
      current: 1,
      total: totalForPassage,
    },
  }
}

async function getNextQuestionFromDB(
  section: string,
  state: AdaptiveState,
  answeredTopics: string[]
) {
  const targetDifficulty = state.currentDifficulty
  const range = 5

  // Try to find a question near the target difficulty
  let question = await prisma.placementQuestion.findFirst({
    where: {
      section,
      active: true,
      difficulty: {
        gte: Math.max(1, targetDifficulty - range),
        lte: Math.min(60, targetDifficulty + range),
      },
      id: { notIn: state.answeredQuestionIds },
      ...(answeredTopics.length > 0 && answeredTopics.length < 30
        ? { topic: { notIn: answeredTopics.slice(-5) } }
        : {}),
    },
    include: {
      readingPassage: section === 'reading' ? true : undefined,
    },
  })

  if (!question) {
    // Broader search
    question = await prisma.placementQuestion.findFirst({
      where: {
        section,
        active: true,
        difficulty: {
          gte: Math.max(1, targetDifficulty - 15),
          lte: Math.min(60, targetDifficulty + 15),
        },
        id: { notIn: state.answeredQuestionIds },
      },
      include: {
        readingPassage: section === 'reading' ? true : undefined,
      },
    })
  }

  return question
}
