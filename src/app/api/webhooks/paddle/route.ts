import { NextRequest, NextResponse } from 'next/server'
import { paddle, getPlanFromPriceId } from '@/lib/paddle'
import { PrismaClient } from '@prisma/client'
import { EventName } from '@paddle/paddle-node-sdk'

const prisma = new PrismaClient()

/**
 * Resolve the userId for a subscription event.
 * Tries (in order): customData.userId → DB lookup by paddleCustomerId → DB lookup by email.
 */
async function resolveUserId(
  sub: { customerId: string; customData?: unknown },
  eventType: string
): Promise<string | null> {
  // 1. Explicit userId in customData (set by our checkout)
  const customData = sub.customData as Record<string, string> | null
  if (customData?.userId) return customData.userId

  // 2. Lookup by Paddle customer ID (stored from earlier events or checkout)
  const byCustomer = await prisma.user.findFirst({
    where: { paddleCustomerId: sub.customerId },
    select: { id: true },
  })
  if (byCustomer) return byCustomer.id

  // 3. Lookup by email from Paddle customer API
  try {
    const customer = await paddle.customers.get(sub.customerId)
    if (customer?.email) {
      const byEmail = await prisma.user.findUnique({
        where: { email: customer.email },
        select: { id: true },
      })
      if (byEmail) {
        // Store paddleCustomerId for faster future lookups
        await prisma.user.update({
          where: { id: byEmail.id },
          data: { paddleCustomerId: sub.customerId },
        })
        return byEmail.id
      }
    }
  } catch (err) {
    console.error(`[Paddle Webhook] Failed to fetch customer ${sub.customerId}:`, err)
  }

  console.error(`[Paddle Webhook] Could not resolve userId for ${eventType}, customerId=${sub.customerId}`)
  return null
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('paddle-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const rawBody = await req.text()
  const secretKey = process.env.PADDLE_WEBHOOK_SECRET_ID!

  let event
  try {
    event = await paddle.webhooks.unmarshal(rawBody, secretKey, signature)
  } catch (err) {
    console.error('[Paddle Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  console.log(`[Paddle Webhook] ${event.eventType}`)

  try {
    switch (event.eventType) {
      // ---------- Transaction completed — capture customer ID early ----------
      case EventName.TransactionCompleted: {
        const txn = event.data
        const customData = txn.customData as Record<string, string> | null
        const userId = customData?.userId

        if (userId && txn.customerId) {
          await prisma.user.update({
            where: { id: userId },
            data: { paddleCustomerId: txn.customerId },
          }).catch(() => {
            // User might not exist yet, that's ok
          })
          console.log(`[Paddle Webhook] Stored paddleCustomerId for user ${userId}`)
        }
        break
      }

      // ---------- Subscription lifecycle ----------
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionTrialing: {
        const sub = event.data
        const userId = await resolveUserId(sub, event.eventType)

        if (!userId) {
          // Return 200 so Paddle doesn't retry — we'll rely on the sync endpoint
          console.error('[Paddle Webhook] No userId resolved for subscription', sub.id)
          return NextResponse.json({ received: true, warning: 'userId not resolved' })
        }

        const priceId = sub.items?.[0]?.price?.id ?? null
        const plan = priceId ? getPlanFromPriceId(priceId) : { name: 'Starter', dailyLimit: 20 }
        const periodEnd = sub.currentBillingPeriod?.endsAt
          ? new Date(sub.currentBillingPeriod.endsAt)
          : null

        await prisma.user.update({
          where: { id: userId },
          data: {
            paddleCustomerId: sub.customerId,
            subscriptionId: sub.id,
            subscriptionStatus: sub.status,
            subscriptionPlanId: priceId,
            subscriptionCurrentPeriodEnd: periodEnd,
            subscriptionCancelAt: sub.canceledAt ? new Date(sub.canceledAt) : null,
            dailyLimit: plan.dailyLimit,
          },
        })

        console.log(`[Paddle Webhook] Updated user ${userId} → ${plan.name} (${sub.status})`)
        break
      }

      case EventName.SubscriptionCanceled: {
        const sub = event.data
        const userId = await resolveUserId(sub, event.eventType)

        if (!userId) {
          // Also try by subscription ID
          const user = await prisma.user.findUnique({
            where: { subscriptionId: sub.id },
            select: { id: true },
          })
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionStatus: 'canceled',
                subscriptionCancelAt: sub.canceledAt ? new Date(sub.canceledAt) : new Date(),
                dailyLimit: 20,
              },
            })
            console.log(`[Paddle Webhook] Canceled subscription for user ${user.id} (by subId)`)
          }
          break
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: 'canceled',
            subscriptionCancelAt: sub.canceledAt ? new Date(sub.canceledAt) : new Date(),
            dailyLimit: 20,
          },
        })

        console.log(`[Paddle Webhook] Canceled subscription for user ${userId}`)
        break
      }

      case EventName.SubscriptionPastDue: {
        const sub = event.data
        const user = await prisma.user.findUnique({
          where: { subscriptionId: sub.id },
          select: { id: true },
        })
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionStatus: 'past_due' },
          })
          console.log(`[Paddle Webhook] Subscription past_due for user ${user.id}`)
        }
        break
      }

      case EventName.SubscriptionPaused: {
        const sub = event.data
        const user = await prisma.user.findUnique({
          where: { subscriptionId: sub.id },
          select: { id: true },
        })
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'paused',
              dailyLimit: 20,
            },
          })
          console.log(`[Paddle Webhook] Subscription paused for user ${user.id}`)
        }
        break
      }

      case EventName.SubscriptionResumed: {
        const sub = event.data
        const user = await prisma.user.findUnique({
          where: { subscriptionId: sub.id },
          select: { id: true },
        })
        if (user) {
          const priceId = sub.items?.[0]?.price?.id ?? null
          const plan = priceId ? getPlanFromPriceId(priceId) : { name: 'Starter', dailyLimit: 20 }
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: sub.status,
              dailyLimit: plan.dailyLimit,
            },
          })
          console.log(`[Paddle Webhook] Subscription resumed for user ${user.id}`)
        }
        break
      }

      default:
        console.log(`[Paddle Webhook] Unhandled event: ${event.eventType}`)
    }
  } catch (err) {
    console.error(`[Paddle Webhook] Error processing ${event.eventType}:`, err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
