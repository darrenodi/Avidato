import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { paddle } from '@/lib/paddle'

const prisma = new PrismaClient()

// Cancel subscription (effective at end of billing period)
export async function POST() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionId: true, subscriptionStatus: true },
  })

  if (!user?.subscriptionId) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
  }

  if (user.subscriptionStatus === 'canceled') {
    return NextResponse.json({ error: 'Subscription already canceled' }, { status: 400 })
  }

  try {
    await paddle.subscriptions.cancel(user.subscriptionId, {
      effectiveFrom: 'next_billing_period',
    })

    return NextResponse.json({ success: true, message: 'Subscription will cancel at end of billing period' })
  } catch (err) {
    console.error('[Paddle] Cancel subscription error:', err)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
