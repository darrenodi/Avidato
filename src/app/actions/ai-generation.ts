// src/app/actions/ai-generation.ts
'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLessonAIService } from '@/lib/ai/lesson-service';
import { StudentProfile, LearningPlan, GeneratedLesson, LearningTopic } from '@/types/lesson-template';
import { revalidatePath } from 'next/cache';
import type { Session } from 'next-auth';
import { getVocabularyContext } from '@/lib/vocabulary-tracker';
import { checkRateLimit, recordFailedAttempt } from '@/lib/turnstile';
import { canAccessVocabTracking } from '@/lib/feature-gates';

/**
 * Security wrapper for AI generation operations
 * Prevents abuse of expensive operations
 */
async function validateServerActionAccess(userId: string, operation: string): Promise<{ allowed: boolean; error?: string }> {
  const rateLimitKey = `server-action:${operation}:${userId}`;
  const rateLimit = checkRateLimit(rateLimitKey);

  if (!rateLimit.allowed) {
    recordFailedAttempt(rateLimitKey);
    return {
      allowed: false,
      error: `Too many ${operation} attempts. Please wait before trying again.`
    };
  }

  return { allowed: true };
}


// Check and update daily generation count
/**
 * Check whether a user is allowed to generate.
 * Paid users (active/trialing) ALWAYS pass — no limit.
 * Free users are capped at their dailyLimit per day.
 *
 * This does NOT increment the counter. Call recordSuccessfulGeneration()
 * after the AI call succeeds.
 */
export async function checkGenerationLimit(userId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dailyGenerationCount: true,
      lastGenerationDate: true,
      dailyLimit: true,
      subscriptionStatus: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Paid users with active subscription — always allowed, no limit
  const hasActiveSubscription = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing';
  if (hasActiveSubscription) return true;

  // Reset count if it's a new day
  const lastGenDate = user.lastGenerationDate;
  const needsReset = !lastGenDate || lastGenDate < today;

  if (needsReset) {
    // New day — reset counter. They haven't generated yet, so allow.
    return true;
  }

  // Free user: check if under daily limit
  return user.dailyGenerationCount < user.dailyLimit;
}

/**
 * Record a successful generation by incrementing the daily counter.
 * Call this ONLY after the AI generation has actually succeeded.
 */
export async function recordSuccessfulGeneration(userId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      lastGenerationDate: true,
      dailyGenerationCount: true,
    },
  });

  if (!user) return;

  const lastGenDate = user.lastGenerationDate;
  const needsReset = !lastGenDate || lastGenDate < today;

  await prisma.user.update({
    where: { id: userId },
    data: {
      dailyGenerationCount: needsReset ? 1 : user.dailyGenerationCount + 1,
      lastGenerationDate: new Date(),
    },
  });
}

/**
 * @deprecated Use checkGenerationLimit() + recordSuccessfulGeneration() instead.
 * Kept for backwards compat — calls checkGenerationLimit then records immediately.
 */
export async function checkAndUpdateGenerationLimit(userId: string): Promise<boolean> {
  const allowed = await checkGenerationLimit(userId);
  if (!allowed) return false;
  await recordSuccessfulGeneration(userId);
  return true;
}

// Get current generation stats
export async function getGenerationStats() {
  const session = await getServerSession(authOptions) as Session | null;
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const user = await Promise.race([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        dailyGenerationCount: true,
        lastGenerationDate: true,
        dailyLimit: true,
        subscriptionStatus: true,
      },
    }),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 5000)
    )
  ]) as {
    dailyGenerationCount: number
    lastGenerationDate: Date | null
    dailyLimit: number
    subscriptionStatus: string | null
  } | null;

  if (!user) {
    throw new Error('User not found');
  }

  const hasActiveSubscription = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing';

  // Reset if new day
  const needsReset = !user.lastGenerationDate || user.lastGenerationDate < today;
  const currentCount = needsReset ? 0 : user.dailyGenerationCount;

  // For paid users, show unlimited
  if (hasActiveSubscription) {
    return {
      used: currentCount,
      limit: -1, // -1 means unlimited
      remaining: -1,
    };
  }

  return {
    used: currentCount,
    limit: user.dailyLimit,
    remaining: user.dailyLimit - currentCount,
  };
}

// Generate AI learning plan
export async function generateLearningPlan(studentId: string): Promise<{
  success: boolean;
  data?: LearningPlan;
  planId?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Security: Check rate limit
    const accessCheck = await validateServerActionAccess(session.user.id, 'generateLearningPlan');
    if (!accessCheck.allowed) {
      return { success: false, error: accessCheck.error };
    }

    // Check generation limit (does NOT increment — only checks)
    const canGenerate = await checkGenerationLimit(session.user.id);
    if (!canGenerate) {
      return { success: false, error: 'Daily generation limit reached. Try again tomorrow.' };
    }

    // Get student data
    const student = await prisma.student.findUnique({
      where: { 
        id: studentId,
        tutorId: session.user.id, // Ensure ownership
      },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    // Convert to StudentProfile
    const studentProfile: StudentProfile = {
      name: student.name,
      targetLanguage: student.targetLanguage,
      nativeLanguage: student.nativeLanguage,
      ageGroup: student.ageGroup,
      level: student.level,
      endGoals: student.endGoals,
      occupation: student.occupation || undefined,
      weaknesses: student.weaknesses || undefined,
      interests: student.interests || undefined,
    };

    // Generate learning plan
    const lessonAIService = await getLessonAIService();
    const learningPlan = await lessonAIService.generateLearningPlan(studentProfile);

    // Save learning plan to database
    const savedLearningPlan = await prisma.learningPlan.create({
      data: {
        selectedMethodology: learningPlan.selectedMethodology,
        methodologyReasoning: learningPlan.methodologyReasoning,
        topics: JSON.parse(JSON.stringify(learningPlan.topics)), // Convert to JSON-compatible format
        studentId: studentId,
      },
    });

    // Record successful generation AFTER success
    await recordSuccessfulGeneration(session.user.id);

    revalidatePath(`/dashboard/students/${studentId}`);
    return { 
      success: true, 
      data: learningPlan,
      planId: savedLearningPlan.id 
    };

  } catch (error) {
    console.error('Error generating learning plan:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate learning plan' 
    };
  }
}

// Get existing learning plan for a student
export async function getStudentLearningPlan(studentId: string): Promise<{
  success: boolean;
  data?: LearningPlan;
  planId?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get student to verify ownership
    const student = await prisma.student.findUnique({
      where: { 
        id: studentId,
        tutorId: session.user.id,
      },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    // Get latest learning plan for this student
    const learningPlan = await prisma.learningPlan.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });

    if (!learningPlan) {
      return { success: false, error: 'No learning plan found' };
    }

    // Convert back to LearningPlan format
    const planData: LearningPlan = {
      selectedMethodology: learningPlan.selectedMethodology as 'CLT' | 'TBLT' | 'PPP' | 'TTT',
      methodologyReasoning: learningPlan.methodologyReasoning,
      topics: learningPlan.topics as Array<{
        lessonNumber: number;
        title: string;
        objective: string;
        vocabulary: string[];
        grammarFocus?: string;
        skills: string[];
        context: string;
        methodology: 'CLT' | 'TBLT' | 'PPP' | 'TTT';
      }>,
    };

    return { 
      success: true, 
      data: planData,
      planId: learningPlan.id 
    };

  } catch (error) {
    console.error('Error getting learning plan:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get learning plan' 
    };
  }
}

// Generate 10 more lessons and append to existing plan
export async function generateMoreLessons(studentId: string): Promise<{
  success: boolean;
  data?: LearningPlan;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Security: Check rate limit
    const accessCheck = await validateServerActionAccess(session.user.id, 'generateLearningPlan');
    if (!accessCheck.allowed) {
      return { success: false, error: accessCheck.error };
    }

    // Check generation limit (does NOT increment — only checks)
    const canGenerate = await checkGenerationLimit(session.user.id);
    if (!canGenerate) {
      return { success: false, error: 'Daily generation limit reached. Try again tomorrow.' };
    }

    // Get student data
    const student = await prisma.student.findUnique({
      where: { 
        id: studentId,
        tutorId: session.user.id,
      },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    // Get existing learning plan
    const existingPlan = await prisma.learningPlan.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });

    if (!existingPlan) {
      return { success: false, error: 'No existing learning plan found' };
    }

    // Convert existing topics to LearningTopic array
    const existingTopics = existingPlan.topics as Array<{
      lessonNumber: number;
      title: string;
      objective: string;
      vocabulary: string[];
      grammarFocus?: string;
      skills: string[];
      context: string;
      methodology: 'CLT' | 'TBLT' | 'PPP' | 'TTT';
    }>;

    // Convert to StudentProfile
    const studentProfile: StudentProfile = {
      name: student.name,
      targetLanguage: student.targetLanguage,
      nativeLanguage: student.nativeLanguage,
      ageGroup: student.ageGroup,
      level: student.level,
      endGoals: student.endGoals,
      occupation: student.occupation || undefined,
      weaknesses: student.weaknesses || undefined,
      interests: student.interests || undefined,
    };

    // Generate next 10 lessons
    const lessonAIService = await getLessonAIService();
    const newLessons = await lessonAIService.generateLearningPlan(studentProfile, existingTopics);

    // Combine existing and new topics
    const allTopics = [...existingTopics, ...newLessons.topics];

    // Update learning plan in database
    const updatedPlan = await prisma.learningPlan.update({
      where: { id: existingPlan.id },
      data: {
        topics: JSON.parse(JSON.stringify(allTopics)),
      },
    });

    const planData: LearningPlan = {
      selectedMethodology: updatedPlan.selectedMethodology as 'CLT' | 'TBLT' | 'PPP' | 'TTT',
      methodologyReasoning: updatedPlan.methodologyReasoning,
      topics: allTopics,
    };

    // Record successful generation AFTER success
    await recordSuccessfulGeneration(session.user.id);

    revalidatePath(`/dashboard/students/${studentId}`);
    return { 
      success: true, 
      data: planData 
    };

  } catch (error) {
    console.error('Error generating more lessons:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate more lessons' 
    };
  }
}

// Generate AI lesson
export async function generateLesson(
  studentId: string,
  lessonData: {
    lessonNumber: number;
    title: string;
    objective: string;
    vocabulary: string[];
    grammarFocus?: string;
    skills: string[];
    context: string;
    methodology: 'CLT' | 'TBLT' | 'PPP' | 'TTT';
  },
  duration: 25 | 50 = 50
): Promise<{
  success: boolean;
  data?: { lesson: GeneratedLesson; lessonId: string };
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check generation limit (does NOT increment — only checks)
    const canGenerate = await checkGenerationLimit(session.user.id);
    if (!canGenerate) {
      return { success: false, error: 'Daily generation limit reached. Try again tomorrow.' };
    }

    // Get student data
    const student = await prisma.student.findUnique({
      where: { 
        id: studentId,
        tutorId: session.user.id, // Ensure ownership
      },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    // Check if a lesson with similar title already exists
    const existingLesson = await prisma.lesson.findFirst({
      where: {
        studentId: studentId,
        OR: [
          { title: { contains: lessonData.title, mode: 'insensitive' } },
          { title: { contains: lessonData.title.split(':')[0], mode: 'insensitive' } }
        ]
      }
    });

    if (existingLesson) {
      return { 
        success: false, 
        error: `A lesson about "${lessonData.title}" has already been generated for this student.` 
      };
    }

    // Convert to StudentProfile
    const studentProfile: StudentProfile = {
      name: student.name,
      targetLanguage: student.targetLanguage,
      nativeLanguage: student.nativeLanguage,
      ageGroup: student.ageGroup,
      level: student.level,
      endGoals: student.endGoals,
      occupation: student.occupation || undefined,
      weaknesses: student.weaknesses || undefined,
      interests: student.interests || undefined,
    };

    // Issue #37: Get vocabulary context from previous shared lessons (Premium only)
    const hasPremium = await canAccessVocabTracking(session.user.id);
    const vocabContext = hasPremium
      ? await getVocabularyContext(studentId)
      : { previousVocabulary: [], previousLessonTitle: undefined, shouldReuseInDialogue: false };

    // Prepare lesson data with vocabulary context
    const lessonDataWithContext = {
      ...lessonData,
      previousVocabulary: vocabContext.previousVocabulary,
      previousLessonTitle: vocabContext.previousLessonTitle,
      shouldReuseVocabularyInDialogue: vocabContext.shouldReuseInDialogue,
    };

    // Generate lesson
    const lessonAIService = await getLessonAIService();
    const generatedLesson = await lessonAIService.generateLesson(
      studentProfile,
      lessonDataWithContext as LearningTopic,
      duration
    );

    // Store lesson in database
    const savedLesson = await prisma.lesson.create({
      data: {
        title: generatedLesson.title,
        overview: `${generatedLesson.objective} | Skills: ${generatedLesson.skills.join(', ')} | Type: ${generatedLesson.lessonType}`,
        content: JSON.parse(JSON.stringify(generatedLesson)), // Convert to JSON-compatible format
        studentId: studentId,
        isRefined: true, // AI-generated lessons are considered refined
      },
    });

    // Record successful generation AFTER success
    await recordSuccessfulGeneration(session.user.id);

    revalidatePath(`/dashboard/students/${studentId}`);
    return { 
      success: true, 
      data: { 
        lesson: generatedLesson, 
        lessonId: savedLesson.id 
      } 
    };

  } catch (error) {
    console.error('Error generating lesson:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate lesson' 
    };
  }
}

/**
 * Issue #37: Mark a lesson as shared with the student
 * 
 * Sets the sharedAt timestamp to track when a lesson was taught/shared.
 * This enables vocabulary continuity tracking across sequential lessons.
 * 
 * Called when tutors share/teach a lesson to the student.
 */
export async function shareLesson(lessonId: string, studentId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Security: Rate limit per user
    const accessCheck = await validateServerActionAccess(session.user.id, 'shareLesson');
    if (!accessCheck.allowed) {
      return { success: false, error: accessCheck.error };
    }

    // Verify student ownership
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
        tutorId: session.user.id,
      },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    // Verify lesson ownership (belongs to this student)
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson || lesson.studentId !== studentId) {
      return { success: false, error: 'Lesson not found or does not belong to this student' };
    }

    // Update lesson with sharedAt timestamp
    await (prisma.lesson.update as unknown as typeof prisma.lesson.update)({
      where: { id: lessonId },
      data: {
        sharedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/students/${studentId}`);
    return { success: true };
  } catch (error) {
    console.error('Error sharing lesson:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to share lesson' 
    };
  }
}