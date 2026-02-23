import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { getPlanFromPriceId, getBillingInterval } from '@/lib/paddle'

const prisma = new PrismaClient()

export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscriptionId: true,
      subscriptionStatus: true,
      subscriptionPlanId: true,
      subscriptionCurrentPeriodEnd: true,
      subscriptionCancelAt: true,
      paddleCustomerId: true,
      dailyLimit: true,
    },
  })

  if (!user || !user.subscriptionId) {
    return NextResponse.json({
      plan: 'Starter',
      status: 'free',
      billingInterval: null,
      currentPeriodEnd: null,
      cancelAt: null,
      dailyLimit: user?.dailyLimit ?? 20,
    })
  }

  const planInfo = user.subscriptionPlanId
    ? getPlanFromPriceId(user.subscriptionPlanId)
    : { name: 'Starter', dailyLimit: 20 }

  const billingInterval = user.subscriptionPlanId
    ? getBillingInterval(user.subscriptionPlanId)
    : null

  return NextResponse.json({
    plan: planInfo.name,
    status: user.subscriptionStatus,
    billingInterval,
    currentPeriodEnd: user.subscriptionCurrentPeriodEnd,
    cancelAt: user.subscriptionCancelAt,
    dailyLimit: user.dailyLimit,
    subscriptionId: user.subscriptionId,
    paddleCustomerId: user.paddleCustomerId,
  })
}
