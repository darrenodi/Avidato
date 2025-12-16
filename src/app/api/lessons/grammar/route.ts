import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateGrammarLesson } from '@/app/actions/grammar-generation'
import { protectApiRoute } from '@/lib/api-protection'

export async function POST(request: NextRequest) {
  try {
    // Centralized API protection (authentication + rate limiting)
    const protection = await protectApiRoute(request, 'grammar-generation')
    if (!protection.allowed) {
      return NextResponse.json(
        { error: protection.error },
        { status: 401 }
      )
    }

    const userId = protection.userId!

    // Parse request body
    const body = await request.json()
    const { studentId, topic } = body

    if (!studentId || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, topic' },
        { status: 400 }
      )
    }

    // Verify student belongs to this user
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        tutorId: userId
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found or unauthorized' },
        { status: 403 }
      )
    }

    // Generate grammar lesson
    const grammarLesson = await generateGrammarLesson(studentId, topic)

    // Save lesson to database
    const lesson = await prisma.lesson.create({
      data: {
        title: grammarLesson.title,
        overview: grammarLesson.context,
        content: JSON.parse(JSON.stringify({
          ...grammarLesson,
          isGrammarLesson: true // Mark this as a grammar lesson for frontend routing
        })),
        studentId,
        isRefined: false,
        isPublic: false
      }
    })

    return NextResponse.json({
      success: true,
      data: lesson
    })
  } catch (error) {
    console.error('Error generating grammar lesson:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to generate grammar lesson' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate grammar lesson' },
      { status: 500 }
    )
  }
}
