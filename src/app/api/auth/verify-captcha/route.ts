import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstileToken } from '@/lib/turnstile'

/**
 * POST /api/auth/verify-captcha
 * Standalone CAPTCHA verification endpoint
 * Used by Google OAuth flow and other operations
 */
export async function POST(request: NextRequest) {
  try {
    const { turnstileToken } = await request.json()

    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, error: 'CAPTCHA token required' },
        { status: 400 }
      )
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown'

    // Verify CAPTCHA token
    const result = await verifyTurnstileToken(turnstileToken, ip)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'CAPTCHA verified' },
      { status: 200 }
    )
  } catch (error) {
    console.error('CAPTCHA verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
