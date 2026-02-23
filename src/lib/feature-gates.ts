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

/** YouTube-to-Lesson generator — Premium only */
export async function canAccessYouTubeTool(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId)
  return meetsMinimumTier(plan, 'Premium')
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
