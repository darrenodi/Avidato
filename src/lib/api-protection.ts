import { NextRequest } from 'next/server'
import { verifyTurnstileToken, checkRateLimit, recordFailedAttempt } from '@/lib/turnstile'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Session } from 'next-auth'

/**
 * API Route Protection Middleware
 * Centralizes rate limiting and authentication for sensitive operations
 *
 * Protected endpoints:
 * - POST /api/lessons/instant - AI lesson generation (expensive operation)
 * - POST /api/lessons/grammar - Grammar analysis (expensive operation)
 * - POST /api/lessons/[id]/share - Sharing operations
 */

export interface ProtectionResult {
  allowed: boolean
  error?: string
  session?: Session | null
  userId?: string
}

export async function protectApiRoute(
  request: NextRequest,
  operation: string,
  options?: { requireTurnstile?: boolean }
): Promise<ProtectionResult> {
  try {
    // Check if user is authenticated
    const session = (await getServerSession(authOptions)) as Session | null
    if (!session?.user?.id) {
      return { allowed: false, error: 'Unauthorized' }
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown'

    const rateLimitKey = `api:${operation}:${session.user.id}:${ip}`

    // Check rate limit for expensive operations
    const rateLimit = checkRateLimit(rateLimitKey)
    if (!rateLimit.allowed) {
      recordFailedAttempt(rateLimitKey)
      return { 
        allowed: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }
    }

    // For extra sensitive operations, verify with Turnstile if required
    if (options?.requireTurnstile) {
      const body = await request.json().catch(() => ({}))
      if (!body.turnstileToken) {
        return { 
          allowed: false, 
          error: 'CAPTCHA token required' 
        }
      }

      const captchaResult = await verifyTurnstileToken(body.turnstileToken, ip)
      if (!captchaResult.success) {
        recordFailedAttempt(rateLimitKey)
        return { 
          allowed: false, 
          error: 'CAPTCHA verification failed' 
        }
      }
    }

    return { 
      allowed: true, 
      session,
      userId: session.user.id
    }
  } catch (error) {
    console.error('API protection check error:', error)
    return { allowed: false, error: 'Authorization error' }
  }
}
