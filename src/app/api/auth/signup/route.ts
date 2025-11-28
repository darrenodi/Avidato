import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit'
import { stripHtml } from '@/lib/sanitize'
import { verifyTurnstileToken, recordFailedAttempt } from '@/lib/turnstile'
import { createVerificationToken } from '@/lib/token-service'
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/email-service'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting to prevent bot signups
    const identifier = getClientIdentifier(request);
    const rateLimit = checkRateLimit(identifier, RATE_LIMITS.AUTH_SIGNUP);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: 'Too many signup attempts',
          rateLimited: true,
          message: 'Please wait before trying again',
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const { name, email, password, turnstileToken } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get client IP for verification
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown'

    // Verify CAPTCHA token
    if (!turnstileToken) {
      return NextResponse.json(
        { 
          error: 'CAPTCHA token required',
          captchaError: 'Please complete the CAPTCHA verification'
        },
        { status: 400 }
      )
    }

    const captchaResult = await verifyTurnstileToken(turnstileToken, ip)
    if (!captchaResult.success) {
      recordFailedAttempt(identifier)
      
      // Log suspicious signup attempt
      console.warn(`Failed CAPTCHA during signup for ${email} from ${ip}: ${captchaResult.error}`)
      
      return NextResponse.json(
        {
          error: 'CAPTCHA verification failed',
          captchaError: 'Invalid CAPTCHA token. Please try again.',
        },
        { status: 401 }
      )
    }

    // Sanitize name input
    const sanitizedName = stripHtml(name.trim());
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Enhanced password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return NextResponse.json(
        { error: 'Password must contain uppercase, lowercase, and numbers' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user (emailVerified is NULL for credentials users - not auto-verified)
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: email.toLowerCase(),
        password: hashedPassword,
        emailVerified: null, // Credentials users must verify their email
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    // Generate verification token
    const verificationToken = await createVerificationToken(
      email.toLowerCase(),
      user.id
    )

    // Send verification email
    try {
      await sendVerificationEmail(
        email.toLowerCase(),
        verificationToken.token,
        sanitizedName
      )
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail signup if email fails - user can resend later
      // But log it for monitoring
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(
        email.toLowerCase(),
        sanitizedName
      )
    } catch (welcomeError) {
      console.error('Failed to send welcome email:', welcomeError)
      // Don't fail signup if welcome email fails
    }

    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email to verify your account.',
        user 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}