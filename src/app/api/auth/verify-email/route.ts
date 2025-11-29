import { NextRequest, NextResponse } from 'next/server'
import { confirmEmailVerification } from '@/lib/token-service'

/**
 * GET /api/auth/verify-email?token=<token>
 * 
 * Verifies an email using a verification token
 * On success, marks the user's email as verified
 * On failure, returns error message
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      const errorUrl = new URL('/auth/verify-error', request.nextUrl.origin)
      errorUrl.searchParams.set('error', 'missing-token')
      return NextResponse.redirect(errorUrl)
    }

    // Verify token and mark email as verified
    const result = await confirmEmailVerification('', token)

    if (!result) {
      const errorUrl = new URL('/auth/verify-error', request.nextUrl.origin)
      errorUrl.searchParams.set('error', 'invalid-token')
      return NextResponse.redirect(errorUrl)
    }

    // Redirect to dashboard with success message
    const dashboardUrl = new URL('/dashboard', request.nextUrl.origin)
    dashboardUrl.searchParams.set('verified', 'true')
    
    return NextResponse.redirect(dashboardUrl)

  } catch (error) {
    console.error('Email verification error:', error)
    const errorUrl = new URL('/auth/verify-error', request.nextUrl.origin)
    errorUrl.searchParams.set('error', 'server-error')
    return NextResponse.redirect(errorUrl)
  }
}

/**
 * POST /api/auth/verify-email
 * 
 * Alternate method to verify email via POST request
 * Useful for client-side verification without redirects
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Verification token is required'
        },
        { status: 400 }
      )
    }

    // Verify token and mark email as verified
    const result = await confirmEmailVerification('', token)

    if (!result) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid or expired verification token. Please request a new verification email.'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Email verified successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'An error occurred during verification. Please try again.'
      },
      { status: 500 }
    )
  }
}
