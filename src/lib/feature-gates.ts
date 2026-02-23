/**
 * Feature Gates
 *
 * Centralised plan-based access control.
 * Uses the user's subscriptionPlanId (Paddle price ID) to resolve their plan
 * and determine which features they can use.
 *
 * Plan hierarchy: Starter (free) → Pro → Premium
 */

import { prisma } from './prisma'
import { getPlanFromPriceId } from './paddle'

export type PlanTier = 'Starter' | 'Pro' | 'Premium'

const TIER_RANK: Record<PlanTier, number> = {
  Starter: 0,
  Pro: 1,
  Premium: 2,
}

/**
 * Look up a user's current plan tier from the database.
 * Returns 'Starter' for free / inactive / missing users.
 */
export async function getUserPlan(userId: string): Promise<PlanTier> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      subscriptionPlanId: true,
    },
  })

  if (!user) return 'Starter'

  const isActive =
    user.subscriptionStatus === 'active' ||
    user.subscriptionStatus === 'trialing'

  if (!isActive || !user.subscriptionPlanId) return 'Starter'

  const plan = getPlanFromPriceId(user.subscriptionPlanId)
  return (plan.name as PlanTier) ?? 'Starter'
}

/**
 * Check whether a user's plan meets the minimum required tier.
 */
export function meetsMinimumTier(
  userPlan: PlanTier,
  requiredPlan: PlanTier
): boolean {
  return TIER_RANK[userPlan] >= TIER_RANK[requiredPlan]
}

// ---- Feature-specific helpers ----

/**
 * YouTube-to-Lesson access check with per-plan limits:
 * - Starter: 1 lifetime generation
 * - Pro: 1 per day
 * - Premium: Unlimited
 *
 * Returns { allowed, reason?, upgrade? } so the route can give a useful error.
 */
export async function checkYouTubeAccess(
  userId: string
): Promise<{ allowed: boolean; reason?: string; upgrade?: boolean }> {
  const plan = await getUserPlan(userId)

  // Premium — always allowed
  if (plan === 'Premium') return { allowed: true }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      youtubeGenerationCount: true,
      lastYoutubeGenerationDate: true,
    },
  })

  if (!user) return { allowed: false, reason: 'User not found' }

  if (plan === 'Pro') {
    // Pro — 1 per day (resets at midnight UTC)
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const lastGen = user.lastYoutubeGenerationDate
    const usedToday = lastGen && lastGen >= today

    if (usedToday) {
      return {
        allowed: false,
        reason: 'Pro plan allows 1 YouTube lesson per day. Upgrade to Premium for unlimited.',
        upgrade: true,
      }
    }
    return { allowed: true }
  }

  // Starter — 1 lifetime trial
  if (user.youtubeGenerationCount >= 1) {
    return {
      allowed: false,
      reason: 'Free accounts get 1 YouTube lesson trial. Upgrade to Pro for daily access or Premium for unlimited.',
      upgrade: true,
    }
  }
  return { allowed: true }
}

/**
 * Increment the YouTube generation counter after a successful generation.
 */
export async function recordYouTubeGeneration(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      youtubeGenerationCount: { increment: 1 },
      lastYoutubeGenerationDate: new Date(),
    },
  })
}

/** YouTube-to-Lesson generator — legacy boolean helper (Premium only) */
export async function canAccessYouTubeTool(userId: string): Promise<boolean> {
  const result = await checkYouTubeAccess(userId)
  return result.allowed
}

/** Vocabulary audio pronunciation — Pro and above */
export async function canAccessVocabAudio(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId)
  return meetsMinimumTier(plan, 'Pro')
}

/** Smart vocabulary tracking across lessons — Premium only */
export async function canAccessVocabTracking(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId)
  return meetsMinimumTier(plan, 'Premium')
}
