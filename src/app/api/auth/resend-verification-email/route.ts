import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createVerificationToken } from '@/lib/token-service'
import { sendVerificationEmail } from '@/lib/email-service'
import { prisma } from '@/lib/prisma'

/**
 * Check if user has exceeded resend limit
 * Allows 2 resends, then requires 30 minute cooldown
 */
async function checkResendLimit(email: string): Promise<{ allowed: boolean; nextAvailableAt?: Date }> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (!user) return { allowed: true }

  // Get the last verification request time
  const lastToken = await prisma.verificationToken.findFirst({
    where: { email: email.toLowerCase() },
    orderBy: { createdAt: 'desc' },
    take: 1
  })

  if (!lastToken) {
    // First time requesting
    return { allowed: true }
  }

  // Count how many tokens were created in the last 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
  const recentRequests = await prisma.verificationToken.count({
    where: {
      email: email.toLowerCase(),
      createdAt: { gte: thirtyMinutesAgo }
    }
  })

  if (recentRequests >= 2) {
    // Already sent 2 times in last 30 minutes
    const nextAvailableAt = new Date(lastToken.createdAt.getTime() + 30 * 60 * 1000)
    return { allowed: false, nextAvailableAt }
  }

  return { allowed: true }
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

    // Rate limiting check - 2 resends, then 30 minute cooldown
    const rateLimit = await checkResendLimit(email)
    if (!rateLimit.allowed) {
      const minutesUntilRetry = Math.ceil((rateLimit.nextAvailableAt!.getTime() - Date.now()) / 60 / 1000)
      return NextResponse.json(
        { 
          success: false,
          error: `Too many verification requests. Please try again in ${minutesUntilRetry} minutes.`,
          nextAvailableAt: rateLimit.nextAvailableAt?.toISOString()
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.nextAvailableAt!.getTime() - Date.now()) / 1000).toString()
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
