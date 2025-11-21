import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstileToken, checkRateLimit, recordFailedAttempt, clearRateLimit } from '@/lib/turnstile'

/**
 * POST /api/auth/login
 * Server-side authentication with CAPTCHA verification
 *
 * Security measures:
 * 1. CAPTCHA verification via Turnstile
 * 2. Rate limiting per IP/email
 * 3. Replay attack detection
 * 4. IP tracking for suspicious activity
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, turnstileToken } = await request.json()

    // Validate inputs
    if (!email || !password || !turnstileToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown'
    
    const rateLimitKey = `login:${email}:${ip}`

    // Check rate limit
    const rateLimit = checkRateLimit(rateLimitKey)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many failed attempts',
          rateLimited: true,
        },
        { status: 429 }
      )
    }

    // Verify CAPTCHA token
    const captchaResult = await verifyTurnstileToken(turnstileToken, ip)
    if (!captchaResult.success) {
      recordFailedAttempt(rateLimitKey)
      
      // Log suspicious activity
      console.warn(`Failed CAPTCHA for ${email} from ${ip}: ${captchaResult.error}`)
      
      // Detect replay attacks
      if (captchaResult.isReplay) {
        return NextResponse.json(
          {
            error: 'Token verification failed',
            captchaError: 'Invalid CAPTCHA token. Please try again.',
          },
          { status: 401 }
        )
      }

      return NextResponse.json(
        {
          error: captchaResult.error,
          captchaError: 'CAPTCHA verification failed. Please try again.',
        },
        { status: 401 }
      )
    }

    // TODO: Add actual credential verification here with your auth provider
    // For now, we're just verifying the CAPTCHA passed
    // In production, validate email/password against your database

    // Clear rate limit on successful CAPTCHA
    clearRateLimit(rateLimitKey)

    // Return success - NextAuth will handle the actual login
    return NextResponse.json(
      {
        success: true,
        message: 'CAPTCHA verified. Proceed with login.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login endpoint error:', error)
    return NextResponse.json(
      { error: 'Authentication service error' },
      { status: 500 }
    )
  }
}
