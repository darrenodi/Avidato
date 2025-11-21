import { NextRequest } from 'next/server'
import { verifyTurnstileToken, checkRateLimit, recordFailedAttempt } from '@/lib/turnstile'
import { getServerSession } from 'next-auth/next'

/**
 * API Route Protection Middleware
 * Applies rate limiting and CAPTCHA-like verification for sensitive operations
 *
 * Protected endpoints:
 * - POST /api/lessons/generate - AI lesson generation (expensive operation)
 * - POST /api/lessons/grammar - Grammar analysis (expensive operation)
 * - POST /api/lessons/[id]/share - Sharing operations
 */

export async function protectApiRoute(
  request: NextRequest,
  operation: string
): Promise<{ allowed: boolean; error?: string }> {
  try {
    // Check if user is authenticated
    const session = await getServerSession()
    if (!session) {
      return { allowed: false, error: 'Unauthorized' }
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown'

    const rateLimitKey = `api:${operation}:${session.user?.email || 'unknown'}:${ip}`

    // Check rate limit for expensive operations
    const rateLimit = checkRateLimit(rateLimitKey)
    if (!rateLimit.allowed) {
      return { 
        allowed: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }
    }

    // For extra sensitive operations, verify with Turnstile if provided
    const body = await request.json().catch(() => ({}))
    if (body.turnstileToken) {
      const captchaResult = await verifyTurnstileToken(body.turnstileToken, ip)
      if (!captchaResult.success) {
        recordFailedAttempt(rateLimitKey)
        return { 
          allowed: false, 
          error: 'CAPTCHA verification failed' 
        }
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('API protection check error:', error)
    return { allowed: false, error: 'Authorization error' }
  }
}
