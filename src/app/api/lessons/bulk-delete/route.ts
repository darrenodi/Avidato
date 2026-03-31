import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { protectApiRoute } from '@/lib/api-protection'

export async function POST(request: NextRequest) {
  try {
    const protection = await protectApiRoute(request, 'lesson-delete')
    if (!protection.allowed) {
      return NextResponse.json({ error: protection.error }, { status: 401 })
    }
    const userId = protection.userId!
    const { ids } = await request.json() as { ids: string[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No lesson IDs provided' }, { status: 400 })
    }

    // Delete only lessons belonging to this tutor
    const result = await prisma.lesson.deleteMany({
      where: {
        id: { in: ids },
        student: { tutorId: userId },
      },
    })

    return NextResponse.json({ success: true, deleted: result.count })
  } catch (error) {
    console.error('Error bulk deleting lessons:', error)
    return NextResponse.json({ error: 'Failed to delete lessons' }, { status: 500 })
  }
}
