// src/app/actions/ai-generation.ts
'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLessonAIService } from '@/lib/ai/lesson-service';
import { generateImage } from '@/lib/ai/imagen';
import { StudentProfile, LearningPlan, GeneratedLesson, LearningTopic, BlockLearningPlan, BlockLesson, TopicBlock } from '@/types/lesson-template';
import { revalidatePath } from 'next/cache';
import type { Session } from 'next-auth';
import { getVocabularyContext } from '@/lib/vocabulary-tracker';
import { checkRateLimit, recordFailedAttempt } from '@/lib/turnstile';
import { canAccessVocabTracking } from '@/lib/feature-gates';

// ─── Previous Lesson Context ─────────────────────────────────────────────────

export interface PreviousLessonContext {
  recentVocabulary: string[]
  recentGrammarErrors: string[]
  recentDiscussionQuestions: string[]
  recentTopics: string[]
  recentWarmUpQuestions: string[]
}

async function getPreviousLessonContext(studentId: string): Promise<PreviousLessonContext> {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { title: true, content: true },
    })

    const recentVocabulary: string[] = []
    const recentGrammarErrors: string[] = []
    const recentDiscussionQuestions: string[] = []
    const recentTopics: string[] = []
    const recentWarmUpQuestions: string[] = []

    for (const lesson of lessons) {
      recentTopics.push(lesson.title)
      const content = lesson.content as Record<string, unknown>

      // Legacy format: content.exercises[]
      const exercises = (content?.exercises as Record<string, unknown>[]) ?? []
      for (const ex of exercises) {
        const c = ex.content as Record<string, unknown>
        if (!c) continue
        if (ex.type === 'vocabulary') {
          const vocab = c.vocabulary as { word?: string }[] ?? []
          vocab.forEach(v => { if (v.word) recentVocabulary.push(v.word.toLowerCase()) })
        }
        if (ex.type === 'sentence-correction' || ex.type === 'sentenceCorrection' || ex.type === 'sentence_correction') {
          const sentences = c.sentences as { errorType?: string }[] ?? []
          sentences.forEach(s => { if (s.errorType) recentGrammarErrors.push(s.errorType) })
        }
        if (ex.type === 'discussion') {
          const questions = c.questions as string[] ?? []
          questions.forEach(q => recentDiscussionQuestions.push(q))
        }
        if (ex.type === 'warmup' || ex.type === 'warm-up' || ex.type === 'lead-in') {
          const questions = c.questions as string[] ?? []
          questions.forEach(q => recentWarmUpQuestions.push(q))
        }
      }

      // Modular format: content.modules[]
      const modules = (content?.modules as Record<string, unknown>[]) ?? []
      for (const mod of modules) {
        const c = mod.content as Record<string, unknown>
        if (!c) continue
        if (mod.type === 'warm-up') {
          const questions = c.questions as string[] ?? []
          questions.forEach(q => recentWarmUpQuestions.push(q))
        }
        if (mod.type === 'vocabulary-cards') {
          const vocab = c.vocabulary as { word?: string }[] ?? []
          vocab.forEach(v => { if (v.word) recentVocabulary.push(v.word.toLowerCase()) })
        }
        if (mod.type === 'discussion') {
          const questions = c.questions as string[] ?? []
          questions.forEach(q => recentDiscussionQuestions.push(q))
        }
      }
    }

    return {
      recentVocabulary: [...new Set(recentVocabulary)],
      recentGrammarErrors: [...new Set(recentGrammarErrors)],
      recentDiscussionQuestions: recentDiscussionQuestions.slice(0, 10),
      recentTopics,
      recentWarmUpQuestions: recentWarmUpQuestions.slice(0, 12),
    }
  } catch {
    return { recentVocabulary: [], recentGrammarErrors: [], recentDiscussionQuestions: [], recentTopics: [], recentWarmUpQuestions: [] }
  }
}

// ─── Provider Selection ───────────────────────────────────────────────────────

/**
 * Returns how many AI generations this user has done today.
 * Uses the existing dailyGenerationCount field (resets automatically each day).
 */
async function getTodayGenerationCount(userId: string): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { dailyGenerationCount: true, lastGenerationDate: true },
  })
  if (!user) return 0
  if (!user.lastGenerationDate || user.lastGenerationDate < today) return 0
  return user.dailyGenerationCount
}

/**
 * Pick the AI provider for this generation.
 * First 2 generations per user per day use Claude (if ANTHROPIC_API_KEY is set).
 * All subsequent generations use the default configured provider (Gemini).
 */
async function resolveProvider(userId: string) {
  if (!process.env.ANTHROPIC_API_KEY) return undefined
  const count = await getTodayGenerationCount(userId)
  return count < 2 ? ('claude' as const) : undefined
}

// ─── Security ─────────────────────────────────────────────────────────────────

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
    const lessonAIService = await getLessonAIService(await resolveProvider(session.user.id));
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

// Get existing learning plan for a student — returns either legacy or block format
export async function getStudentLearningPlan(studentId: string): Promise<{
  success: boolean;
  format?: 'legacy' | 'block';
  data?: LearningPlan | BlockLearningPlan;
  planId?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId, tutorId: session.user.id },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    const learningPlan = await prisma.learningPlan.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });

    if (!learningPlan) {
      return { success: false, error: 'No learning plan found' };
    }

    const raw = learningPlan.topics as unknown[];

    // Version guard: block format has blockNumber on first element; legacy has lessonNumber
    const isBlockFormat = Array.isArray(raw) && raw.length > 0 &&
      typeof (raw[0] as Record<string, unknown>).blockNumber === 'number';

    if (isBlockFormat) {
      const planData: BlockLearningPlan = {
        selectedMethodology: learningPlan.selectedMethodology,
        methodologyReasoning: learningPlan.methodologyReasoning,
        blocks: raw as TopicBlock[],
      };
      return { success: true, format: 'block', data: planData, planId: learningPlan.id };
    }

    const planData: LearningPlan = {
      selectedMethodology: learningPlan.selectedMethodology as 'CLT' | 'TBLT' | 'PPP' | 'TTT',
      methodologyReasoning: learningPlan.methodologyReasoning,
      topics: raw as LearningTopic[],
    };

    return { success: true, format: 'legacy', data: planData, planId: learningPlan.id };

  } catch (error) {
    console.error('Error getting learning plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get learning plan'
    };
  }
}

// Generate block-structured learning plan (Preply TBLT format)
export async function generateBlockLearningPlan(studentId: string): Promise<{
  success: boolean;
  data?: BlockLearningPlan;
  planId?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const accessCheck = await validateServerActionAccess(session.user.id, 'generateLearningPlan');
    if (!accessCheck.allowed) return { success: false, error: accessCheck.error };

    const canGenerate = await checkGenerationLimit(session.user.id);
    if (!canGenerate) return { success: false, error: 'Daily generation limit reached. Try again tomorrow.' };

    const student = await prisma.student.findUnique({
      where: { id: studentId, tutorId: session.user.id },
    });
    if (!student) return { success: false, error: 'Student not found' };

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

    const lessonAIService = await getLessonAIService(await resolveProvider(session.user.id));
    const blockPlan = await lessonAIService.generateBlockPlan(studentProfile);

    const savedPlan = await prisma.learningPlan.create({
      data: {
        selectedMethodology: blockPlan.selectedMethodology,
        methodologyReasoning: blockPlan.methodologyReasoning,
        topics: JSON.parse(JSON.stringify(blockPlan.blocks)),
        studentId,
      },
    });

    await recordSuccessfulGeneration(session.user.id);
    revalidatePath(`/dashboard/students/${studentId}`);

    return { success: true, data: blockPlan, planId: savedPlan.id };

  } catch (error) {
    console.error('Error generating block plan:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate learning plan' };
  }
}

// Generate a modular lesson from a BlockLesson
export async function generateModularLesson(
  studentId: string,
  lessonData: BlockLesson,
  duration: 25 | 50 = 50
): Promise<{
  success: boolean;
  data?: { lesson: GeneratedLesson; lessonId: string };
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const canGenerate = await checkGenerationLimit(session.user.id);
    if (!canGenerate) return { success: false, error: 'Daily generation limit reached. Try again tomorrow.' };

    const student = await prisma.student.findUnique({
      where: { id: studentId, tutorId: session.user.id },
    });
    if (!student) return { success: false, error: 'Student not found' };

    const existingLesson = await prisma.lesson.findFirst({
      where: {
        studentId,
        OR: [
          { title: { contains: lessonData.title, mode: 'insensitive' } },
          { title: { contains: lessonData.title.split(':')[0], mode: 'insensitive' } },
        ],
      },
    });
    if (existingLesson) {
      return { success: false, error: `A lesson about "${lessonData.title}" has already been generated for this student.` };
    }

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

    const prevContext = await getPreviousLessonContext(studentId);
    const modularContext = [
      prevContext.recentTopics.length > 0
        ? `Recent lesson topics (DO NOT repeat warm-up structure or opening angle from these): ${prevContext.recentTopics.join(' | ')}`
        : '',
      prevContext.recentWarmUpQuestions.length > 0
        ? `Recent warm-up questions already used (NEVER repeat these or use the same structure/angle): ${prevContext.recentWarmUpQuestions.join(' | ')}`
        : '',
      prevContext.recentVocabulary.length > 0
        ? `Recent vocabulary already taught (avoid repeating unless essential to this lesson): ${prevContext.recentVocabulary.slice(0, 20).join(', ')}`
        : '',
    ].filter(Boolean).join('\n')

    const lessonAIService = await getLessonAIService(await resolveProvider(session.user.id));
    const generatedLesson = await lessonAIService.generateModularLesson(studentProfile, lessonData, duration, modularContext);

    // Generate images for any image-discussion modules
    const modules = (generatedLesson as unknown as { modules?: { type: string; content: { imagePlaceholders?: { label: string; description: string }[]; imageData?: string } }[] }).modules;
    if (modules) {
      for (const mod of modules) {
        if (mod.type === 'image-discussion' && mod.content.imagePlaceholders?.[0]?.description) {
          const imageData = await generateImage(mod.content.imagePlaceholders[0].description);
          if (imageData) mod.content.imageData = imageData;
        }
      }
    }

    const savedLesson = await prisma.lesson.create({
      data: {
        title: generatedLesson.title,
        overview: `${generatedLesson.objective} | Skills: ${(generatedLesson.skills || []).join(', ')}`,
        content: JSON.parse(JSON.stringify(generatedLesson)),
        studentId,
        isRefined: true,
      },
    });

    await recordSuccessfulGeneration(session.user.id);
    revalidatePath(`/dashboard/students/${studentId}`);

    return { success: true, data: { lesson: generatedLesson, lessonId: savedLesson.id } };
  } catch (error) {
    console.error('Error generating modular lesson:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate lesson' };
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
    const lessonAIService = await getLessonAIService(await resolveProvider(session.user.id));
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

    // Fetch previous lesson context for anti-repetition rules
    const prevContext = await getPreviousLessonContext(studentId);

    // Prepare lesson data with vocabulary context
    const lessonDataWithContext = {
      ...lessonData,
      previousVocabulary: vocabContext.previousVocabulary,
      previousLessonTitle: vocabContext.previousLessonTitle,
      shouldReuseVocabularyInDialogue: vocabContext.shouldReuseInDialogue,
      recentVocabulary: prevContext.recentVocabulary,
      recentGrammarErrors: prevContext.recentGrammarErrors,
      recentDiscussionQuestions: prevContext.recentDiscussionQuestions,
      recentTopics: prevContext.recentTopics,
    };

    // Generate lesson
    const lessonAIService = await getLessonAIService(await resolveProvider(session.user.id));
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
 * Update a lesson's content JSON.
 *
 * Tutors can edit individual exercises / sections after AI generation.
 * Both the tutor view and shared student view read from the same DB record,
 * so a single update propagates to both copies immediately.
 */
export async function updateLessonContent(
  lessonId: string,
  updatedContent: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Rate limit
    const accessCheck = await validateServerActionAccess(session.user.id, 'updateLessonContent');
    if (!accessCheck.allowed) {
      return { success: false, error: accessCheck.error };
    }

    // Verify lesson exists & belongs to one of the tutor's students
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { student: { select: { tutorId: true, id: true } } },
    });

    if (!lesson || lesson.student.tutorId !== session.user.id) {
      return { success: false, error: 'Lesson not found or unauthorized' };
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { content: JSON.parse(JSON.stringify(updatedContent)) },
    });

    revalidatePath(`/lessons/${lessonId}`);
    revalidatePath(`/lessons/${lessonId}/share`);
    revalidatePath(`/dashboard/students/${lesson.student.id}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating lesson content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lesson',
    };
  }
}

/**
 * Generate an image for a specific image-discussion module and save it to the lesson.
 */
export async function generateModuleImage(
  lessonId: string,
  moduleIndex: number
): Promise<{ success: boolean; imageData?: string; error?: string }> {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { student: { select: { tutorId: true, id: true } } },
    });
    if (!lesson || lesson.student.tutorId !== session.user.id) {
      return { success: false, error: 'Lesson not found or unauthorized' };
    }

    const content = lesson.content as Record<string, unknown>;
    const modules = (content.modules || []) as Array<Record<string, unknown>>;
    const mod = modules[moduleIndex] as Record<string, unknown> | undefined;
    if (!mod || mod.type !== 'image-discussion') {
      return { success: false, error: 'Module is not an image-discussion' };
    }

    const moduleContent = mod.content as Record<string, unknown>;
    const placeholders = (moduleContent.imagePlaceholders || []) as Array<{ description?: string; label?: string }>;
    const prompt = placeholders[0]?.description || placeholders[0]?.label || 'Educational illustration';

    const imageData = await generateImage(prompt);
    if (!imageData) return { success: false, error: 'Image generation failed' };

    // Patch the module content in-place
    const updatedModules = modules.map((m, i) =>
      i === moduleIndex ? { ...m, content: { ...(m.content as object), imageData } } : m
    );
    const updatedContent = { ...content, modules: updatedModules };

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { content: JSON.parse(JSON.stringify(updatedContent)) },
    });

    revalidatePath(`/lessons/${lessonId}`);
    revalidatePath(`/lessons/${lessonId}/share`);
    revalidatePath(`/dashboard/students/${lesson.student.id}`);
    return { success: true, imageData };
  } catch (error) {
    console.error('Error generating module image:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate image' };
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

    // Already marked — idempotent
    if (lesson.sharedAt) {
      return { success: true };
    }

    await prisma.lesson.update({ where: { id: lessonId }, data: { sharedAt: new Date() } });

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

export async function refineLesson(lessonId: string, changeRequest: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, student: { tutorId: session.user.id } },
      include: { student: true },
    })
    if (!lesson) return { success: false, error: 'Lesson not found' }

    const aiService = await getLessonAIService()
    const prompt = `You are refining an existing language lesson. Apply ONLY the requested change. Keep everything else identical.

CURRENT LESSON (JSON):
${JSON.stringify(lesson.content, null, 2)}

REQUESTED CHANGE:
${changeRequest}

Return the complete updated lesson as valid JSON with exactly the same structure and fields. Change only what was requested. RETURN ONLY VALID JSON, NO EXPLANATION.`

    const result = await aiService.generateRaw(prompt)
    if (!result) return { success: false, error: 'AI generation failed' }

    // Parse the JSON response
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { success: false, error: 'Invalid AI response' }
    const updatedContent = JSON.parse(jsonMatch[0])

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { content: updatedContent, isRefined: true },
    })

    revalidatePath(`/lessons/${lessonId}`)
    return { success: true }
  } catch (error) {
    console.error('Error refining lesson:', error)
    return { success: false, error: 'Failed to refine lesson' }
  }
}