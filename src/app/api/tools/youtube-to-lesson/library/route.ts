import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 12

/**
 * GET /api/tools/youtube-to-lesson/library?page=1&level=B1&q=search
 *
 * Returns paginated YouTube lessons (shared library — any authenticated tutor).
 * Ordered by most recently created first.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const level = searchParams.get('level') || undefined
    const q = searchParams.get('q') || undefined

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (level) where.level = level
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { topic: { contains: q, mode: 'insensitive' } },
      ]
    }

    const [lessons, total] = await Promise.all([
      prisma.youTubeLesson.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
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
      }),
      prisma.youTubeLesson.count({ where }),
    ])

    return NextResponse.json({
      lessons,
      page,
      pageSize: PAGE_SIZE,
      totalCount: total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    })
  } catch (error) {
    console.error('Error fetching YouTube lesson library:', error)
    return NextResponse.json(
      { error: 'Failed to fetch YouTube lesson library' },
      { status: 500 }
    )
  }
}
