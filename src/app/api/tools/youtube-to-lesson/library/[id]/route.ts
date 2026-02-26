import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/tools/youtube-to-lesson/library/[id]
 *
 * Returns a single saved YouTube lesson by ID (full data).
 * Any authenticated tutor can access any lesson.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const lesson = await prisma.youTubeLesson.findUnique({
      where: { id },
      include: {
        creator: {
          select: { name: true },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error fetching YouTube lesson:', error)
    return NextResponse.json(
      { error: 'Failed to fetch YouTube lesson' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/tools/youtube-to-lesson/library/[id]
 *
 * Updates the lesson data (for inline edits).
 * Any authenticated tutor can edit.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, unknown> = {}
    if (body.data) updateData.data = JSON.parse(JSON.stringify(body.data))
    if (body.title) updateData.title = body.title
    if (body.topic !== undefined) updateData.topic = body.topic || null

    const lesson = await prisma.youTubeLesson.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error updating YouTube lesson:', error)
    return NextResponse.json(
      { error: 'Failed to update YouTube lesson' },
      { status: 500 }
    )
  }
}
