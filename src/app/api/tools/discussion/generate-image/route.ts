import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Image generation has been disabled' },
    { status: 404 }
  )
}
