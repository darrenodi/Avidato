'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Session } from 'next-auth'

export async function getStudentCredits(
  studentId: string
): Promise<{ success: boolean; credits?: number; error?: string }> {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const student = await prisma.student.findFirst({
      where: { id: studentId, tutorId: session.user.id },
      select: { creditBalance: true },
    })
    if (!student) return { success: false, error: 'Student not found' }

    return { success: true, credits: student.creditBalance }
  } catch {
    return { success: false, error: 'Failed to fetch credits' }
  }
}

export async function adjustStudentCredits(
  studentId: string,
  delta: number  // positive = add credits, negative = deduct
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const student = await prisma.student.findFirst({
      where: { id: studentId, tutorId: session.user.id },
      select: { id: true, creditBalance: true },
    })
    if (!student) return { success: false, error: 'Student not found' }

    const newBalance = student.creditBalance + delta
    if (newBalance < 0) return { success: false, error: 'Insufficient credits' }

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: { creditBalance: newBalance },
      select: { creditBalance: true },
    })

    revalidatePath(`/dashboard/students/${studentId}`)
    return { success: true, newBalance: updated.creditBalance }
  } catch {
    return { success: false, error: 'Failed to adjust credits' }
  }
}

export async function getTutorEarnings(
): Promise<{ success: boolean; total?: number; earnings?: Array<{ id: string; amount: number; currency: string; createdAt: Date; studentName: string; lessonId: string }>; error?: string }> {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const earnings = await prisma.tutorEarning.findMany({
      where: { tutorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { student: { select: { name: true } } },
    })

    const total = earnings.reduce((sum, e) => sum + Number(e.amount), 0)

    return {
      success: true,
      total,
      earnings: earnings.map(e => ({
        id: e.id,
        amount: Number(e.amount),
        currency: e.currency,
        createdAt: e.createdAt,
        studentName: e.student.name,
        lessonId: e.lessonId,
      })),
    }
  } catch {
    return { success: false, error: 'Failed to fetch earnings' }
  }
}
