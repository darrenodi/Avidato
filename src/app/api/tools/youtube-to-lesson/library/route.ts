import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/tools/youtube-to-lesson/library
 *
 * Returns all saved YouTube lessons (shared library — any authenticated tutor).
 * Ordered by most recently created first.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lessons = await prisma.youTubeLesson.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        videoId: true,
        sourceUrl: true,
        level: true,
        title: true,
        topic: true,
        createdAt: true,
        creator: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching YouTube lesson library:', error)
    return NextResponse.json(
      { error: 'Failed to fetch YouTube lesson library' },
      { status: 500 }
    )
  }
}
