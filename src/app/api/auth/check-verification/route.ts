import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's email verification status from database
    // Use same logic as getSecurityInfo in settings.ts
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        emailVerified: true,
        accounts: {
          select: {
            provider: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Google OAuth users always have verified emails (Google verifies it)
    // This matches the exact logic from getSecurityInfo in settings.ts
    const isGoogleUser = user.accounts.some(acc => acc.provider === 'google')
    const emailVerified = isGoogleUser ? true : !!user.emailVerified

    return NextResponse.json({ emailVerified })
  } catch (error) {
    console.error('Error checking verification status:', error)
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    )
  }
}
