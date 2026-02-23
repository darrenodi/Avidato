import { Environment, Paddle } from '@paddle/paddle-node-sdk'

// Server-side Paddle client
const isSandbox = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox'

const apiKey = isSandbox
  ? process.env.PADDLE_SANDBOX_API_KEY!
  : process.env.PROD_PADDLE_API_KEY!

export const paddle = new Paddle(apiKey, {
  environment: isSandbox ? Environment.sandbox : Environment.production,
})

// Price ID → Plan mapping
export const PLAN_MAP: Record<string, { name: string; dailyLimit: number }> = {
  [process.env.PRO_MONTHLY_PLAN_ID!]:     { name: 'Pro',     dailyLimit: 999999 },
  [process.env.PRO_YEARLY_PLAN_ID!]:      { name: 'Pro',     dailyLimit: 999999 },
  [process.env.PREMIUM_MONTHLY_PLAN_ID!]: { name: 'Premium', dailyLimit: 999999 },
  [process.env.PREMIUM_YEARLY_PLAN_ID!]:  { name: 'Premium', dailyLimit: 999999 },
}

// Resolve plan name from a Paddle price ID
export function getPlanFromPriceId(priceId: string): { name: string; dailyLimit: number } {
  return PLAN_MAP[priceId] ?? { name: 'Starter', dailyLimit: 20 }
}

// Check if a price ID is monthly or annual
export function getBillingInterval(priceId: string): 'monthly' | 'annual' {
  const yearlyIds = [
    process.env.PRO_YEARLY_PLAN_ID,
    process.env.PREMIUM_YEARLY_PLAN_ID,
  ]
  return yearlyIds.includes(priceId) ? 'annual' : 'monthly'
}
