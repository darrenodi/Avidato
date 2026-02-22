import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

/** Generate a short URL-friendly ID (8 chars) */
function generateShortId(): string {
  return crypto.randomBytes(6).toString('base64url').slice(0, 8)
}

// POST — teacher stores lesson for sharing → returns short ID
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const id = generateShortId()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await prisma.sharedYouTubeLesson.create({
      data: { id, data: body, expiresAt },
    })

    return NextResponse.json({ id })
  } catch (error) {
    console.error('Error storing shared YouTube lesson:', error)
    return NextResponse.json({ error: 'Failed to store lesson' }, { status: 500 })
  }
}

// GET — student retrieves shared lesson by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || id.length > 20) {
      return NextResponse.json({ error: 'Invalid share ID' }, { status: 400 })
    }

    const record = await prisma.sharedYouTubeLesson.findUnique({
      where: { id },
    })

    if (!record) {
      return NextResponse.json({ error: 'Lesson not found or expired' }, { status: 404 })
    }

    if (record.expiresAt < new Date()) {
      // Clean up expired record
      await prisma.sharedYouTubeLesson.delete({ where: { id } }).catch(() => {})
      return NextResponse.json({ error: 'This shared lesson has expired' }, { status: 410 })
    }

    return NextResponse.json(record.data, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    })
  } catch (error) {
    console.error('Error fetching shared YouTube lesson:', error)
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 })
  }
}
