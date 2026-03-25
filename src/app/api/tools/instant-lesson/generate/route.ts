import { NextRequest, NextResponse } from 'next/server'
import { generateInstantLesson } from '@/lib/instantLessonGenerator'
import { protectApiRoute } from '@/lib/api-protection'
import { checkGenerationLimit, recordSuccessfulGeneration } from '@/app/actions/ai-generation'

export async function POST(request: NextRequest) {
  try {
    const protection = await protectApiRoute(request, 'instant-lesson-generation')
    if (!protection.allowed) {
      return NextResponse.json({ error: protection.error }, { status: 401 })
    }

    const userId = protection.userId!

    const allowed = await checkGenerationLimit(userId)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Daily generation limit reached. Upgrade to Pro for unlimited generations.' },
        { status: 429 }
      )
    }

    const { targetLanguage, nativeLanguage, level, topic, description, duration, endGoals, occupation, interests } =
      await request.json()

    if (!targetLanguage || !nativeLanguage || !level || !topic || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: targetLanguage, nativeLanguage, level, topic, duration' },
        { status: 400 }
      )
    }

    const lessonData = await generateInstantLesson({
      targetLanguage,
      nativeLanguage,
      level,
      topic,
      description: description || undefined,
      duration: Number(duration) as 25 | 50,
      endGoals: endGoals || undefined,
      occupation: occupation || undefined,
      interests: interests || undefined,
    })

    await recordSuccessfulGeneration(userId)

    return NextResponse.json({ success: true, data: lessonData })
  } catch (error) {
    console.error('Error in instant lesson tool generation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate lesson' },
      { status: 500 }
    )
  }
}
