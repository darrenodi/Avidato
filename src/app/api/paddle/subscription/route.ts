import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { getPlanFromPriceId, getBillingInterval, paddle } from '@/lib/paddle'

const prisma = new PrismaClient()

/**
 * Try to sync subscription from Paddle API when DB shows no subscription.
 * Returns true if a subscription was found and synced.
 */
async function tryAutoSync(userId: string, email: string): Promise<boolean> {
  try {
    // Find customer by email
    let paddleCustomerId: string | null = null
    const customers = paddle.customers.list({ email: [email] })
    for await (const customer of customers) {
      paddleCustomerId = customer.id
      break
    }
    if (!paddleCustomerId) return false

    // Find active subscription
    const subscriptions = paddle.subscriptions.list({
      customerId: [paddleCustomerId],
      status: ['active', 'trialing'],
    })

    let foundSub = null
    for await (const sub of subscriptions) {
      foundSub = sub
      break
    }
    if (!foundSub) {
      // Store customer ID for future lookups
      await prisma.user.update({
        where: { id: userId },
        data: { paddleCustomerId },
      })
      return false
    }

    const priceId = foundSub.items?.[0]?.price?.id ?? null
    const plan = priceId ? getPlanFromPriceId(priceId) : { name: 'Starter', dailyLimit: 20 }
    const periodEnd = foundSub.currentBillingPeriod?.endsAt
      ? new Date(foundSub.currentBillingPeriod.endsAt)
      : null

    await prisma.user.update({
      where: { id: userId },
      data: {
        paddleCustomerId,
        subscriptionId: foundSub.id,
        subscriptionStatus: foundSub.status,
        subscriptionPlanId: priceId,
        subscriptionCurrentPeriodEnd: periodEnd,
        subscriptionCancelAt: foundSub.canceledAt ? new Date(foundSub.canceledAt) : null,
        dailyLimit: plan.dailyLimit,
      },
    })

    console.log(`[Paddle AutoSync] Synced user ${userId} → ${plan.name} (${foundSub.status})`)
    return true
  } catch (err) {
    console.error('[Paddle AutoSync] Failed:', err)
    return false
  }
}

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      subscriptionId: true,
      subscriptionStatus: true,
      subscriptionPlanId: true,
      subscriptionCurrentPeriodEnd: true,
      subscriptionCancelAt: true,
      paddleCustomerId: true,
      dailyLimit: true,
    },
  })

  // Auto-sync if no subscription found and ?sync=true or always on first load
  const shouldSync = req.nextUrl.searchParams.get('sync') === 'true'
  if (user && !user.subscriptionId && (shouldSync || !user.paddleCustomerId) && user.email) {
    const synced = await tryAutoSync(session.user.id, user.email)
    if (synced) {
      // Re-fetch updated data
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          email: true,
          subscriptionId: true,
          subscriptionStatus: true,
          subscriptionPlanId: true,
          subscriptionCurrentPeriodEnd: true,
          subscriptionCancelAt: true,
          paddleCustomerId: true,
          dailyLimit: true,
        },
      })
    }
  }

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
