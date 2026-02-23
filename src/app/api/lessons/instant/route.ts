// src/app/api/lessons/instant/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInstantLesson } from '@/lib/instantLessonGenerator'
import { protectApiRoute } from '@/lib/api-protection'
import { checkAndUpdateGenerationLimit } from '@/app/actions/ai-generation'

export async function POST(request: NextRequest) {
  try {
    // Centralized API protection (authentication + rate limiting)
    const protection = await protectApiRoute(request, 'instant-lesson-generation')
    if (!protection.allowed) {
      return NextResponse.json(
        { error: protection.error },
        { status: 401 }
      )
    }

    const userId = protection.userId!

    // Check daily generation limit (subscription-aware)
    const allowed = await checkAndUpdateGenerationLimit(userId)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Daily generation limit reached. Upgrade to Pro for unlimited generations.' },
        { status: 429 }
      )
    }

    // Parse request body
    const {
      studentId,
      topic,
      description,
      duration,
      targetLanguage,
      nativeLanguage,
      level
    } = await request.json();

    // Validate required fields
    if (!studentId || !topic || !duration || !targetLanguage || !level) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, topic, duration, targetLanguage, level' },
        { status: 400 }
      );
    }

    // Verify student belongs to user
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        tutorId: userId,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found or unauthorized' },
        { status: 404 }
      );
    }

    // Generate instant lesson
    const lessonData = await generateInstantLesson({
      targetLanguage,
      nativeLanguage: nativeLanguage || student.nativeLanguage,
      level,
      topic,
      description,
      duration: Number(duration) as 25 | 50,
      studentName: student.name
    });

    // Save lesson to database
    const lesson = await prisma.lesson.create({
      data: {
        title: lessonData.title,
        overview: lessonData.objective,
        content: lessonData as never,
        studentId: student.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: lesson.id,
        title: lesson.title,
        overview: lesson.overview,
      },
    });
  } catch (error) {
    console.error('Error in instant lesson generation API:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate lesson',
      },
      { status: 500 }
    );
  }
}
