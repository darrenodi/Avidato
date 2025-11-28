import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createVerificationToken } from '@/lib/token-service'
import { sendVerificationEmail } from '@/lib/email-service'
import { prisma } from '@/lib/prisma'

// Simple in-memory rate limit store (for demo - use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 60 seconds
const MAX_RESEND_PER_WINDOW = 3 // Allow 3 resends per minute

function checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const key = `verify-email-${email}`
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    // New window or expired
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }

  if (record.count < MAX_RESEND_PER_WINDOW) {
    record.count++
    return { allowed: true }
  }

  // Rate limit exceeded
  const retryAfter = Math.ceil((record.resetTime - now) / 1000)
  return { allowed: false, retryAfter }
}

/**
 * POST /api/auth/resend-verification-email
 * 
 * Allows users to request a new verification email
 * Includes rate limiting to prevent abuse
 * 
 * Request body:
 * {
 *   "email": "user@example.com"  // or omit to use session user's email
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { email: providedEmail } = await request.json()

    // Get current session to check if user is logged in
    const session = await getServerSession(authOptions)

    // Email can come from body or session (for logged-in users)
    const email = providedEmail || session?.user?.email

    if (!email) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email address is required'
        },
        { status: 400 }
      )
    }

    // Rate limiting check
    const rateLimit = checkRateLimit(email)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false,
          error: `Too many resend requests. Please try again in ${rateLimit.retryAfter} seconds.`,
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60'
          }
        }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // Don't reveal if email exists (security best practice)
      // Still return success to prevent email enumeration
      return NextResponse.json(
        { 
          success: true,
          message: 'If an account exists with this email, a verification link has been sent.'
        },
        { status: 200 }
      )
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { 
          success: false,
          error: 'This email is already verified.'
        },
        { status: 400 }
      )
    }

    // Generate new verification token
    const verificationToken = await createVerificationToken(
      email.toLowerCase(),
      user.id
    )

    // Send verification email
    try {
      await sendVerificationEmail(
        email.toLowerCase(),
        verificationToken.token,
        user.name || undefined
      )

      return NextResponse.json(
        { 
          success: true,
          message: 'Verification email sent successfully. Please check your inbox.'
        },
        { status: 200 }
      )
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send verification email. Please try again later.'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Resend verification email error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'An error occurred. Please try again.'
      },
      { status: 500 }
    )
  }
}
