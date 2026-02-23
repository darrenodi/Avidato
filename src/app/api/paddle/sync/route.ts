import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { paddle, getPlanFromPriceId } from '@/lib/paddle'

const prisma = new PrismaClient()

/**
 * POST /api/paddle/sync
 *
 * Server-to-server subscription sync.
 * Calls Paddle's API to find the user's subscription (by customer ID or email)
 * and updates the database. This is a fallback when webhooks fail.
 */
export async function POST() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const userEmail = session.user.email

  try {
    // 1. Check if user already has subscription data in DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        paddleCustomerId: true,
        subscriptionId: true,
        subscriptionStatus: true,
      },
    })

    // If already active, no need to sync
    if (user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing') {
      return NextResponse.json({ synced: false, reason: 'already_active' })
    }

    // 2. Find the Paddle customer by email
    let paddleCustomerId = user?.paddleCustomerId ?? null

    if (!paddleCustomerId) {
      const customers = paddle.customers.list({ email: [userEmail] })
      for await (const customer of customers) {
        paddleCustomerId = customer.id
        break // Take the first match
      }
    }

    if (!paddleCustomerId) {
      return NextResponse.json({ synced: false, reason: 'no_paddle_customer' })
    }

    // 3. Find active subscriptions for this customer
    const subscriptions = paddle.subscriptions.list({
      customerId: [paddleCustomerId],
      status: ['active', 'trialing'],
    })

    let foundSub = null
    for await (const sub of subscriptions) {
      foundSub = sub
      break // Take the first active subscription
    }

    if (!foundSub) {
      // Store paddle customer ID even if no active sub (helps future lookups)
      await prisma.user.update({
        where: { id: userId },
        data: { paddleCustomerId },
      })
      return NextResponse.json({ synced: false, reason: 'no_active_subscription' })
    }

    // 4. Update the database with subscription data
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

    console.log(`[Paddle Sync] Synced user ${userId} → ${plan.name} (${foundSub.status})`)

    return NextResponse.json({
      synced: true,
      plan: plan.name,
      status: foundSub.status,
    })
  } catch (err) {
    console.error('[Paddle Sync] Error:', err)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
