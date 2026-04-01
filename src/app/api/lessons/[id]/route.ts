// src/app/api/lessons/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { protectApiRoute } from '@/lib/api-protection'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Centralized API protection (authentication + rate limiting)
    const protection = await protectApiRoute(request, 'lesson-fetch')
    if (!protection.allowed) {
      return NextResponse.json(
        { error: protection.error },
        { status: 401 }
      )
    }

    const userId = protection.userId!
    const { id: lessonId } = await params

    // Check if requester is admin — admins can view any lesson
    const requestingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    })
    const isAdmin = requestingUser?.isAdmin ?? false

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        ...(isAdmin ? {} : { student: { tutorId: userId } }),
      },
      select: {
        id: true,
        title: true,
        overview: true,
        isRefined: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        studentId: true,
        student: {
          select: {
            id: true,
            name: true,
            targetLanguage: true,
            level: true,
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Add aggressive cache headers and ETag for better performance
    const etag = `"${lesson.id}-${lesson.updatedAt.getTime()}"`
    const ifNoneMatch = request.headers.get('If-None-Match')
    
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 })
    }

    return NextResponse.json(lesson, {
      headers: {
        'Cache-Control': 'private, max-age=300, must-revalidate', // 5 minute cache
        'ETag': etag,
      },
    })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const protection = await protectApiRoute(request, 'lesson-delete')
    if (!protection.allowed) {
      return NextResponse.json({ error: protection.error }, { status: 401 })
    }
    const userId = protection.userId!
    const { id: lessonId } = await params

    // Verify the lesson belongs to this tutor
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, student: { tutorId: userId } },
      select: { id: true },
    })
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    await prisma.lesson.delete({ where: { id: lessonId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
  }
}