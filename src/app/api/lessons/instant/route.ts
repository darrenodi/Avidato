// src/app/api/lessons/instant/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateInstantLesson } from '@/lib/instantLessonGenerator';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
        tutorId: user.id,
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
