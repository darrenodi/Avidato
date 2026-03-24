import { NextRequest, NextResponse } from 'next/server'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkGenerationLimit, recordSuccessfulGeneration } from '@/app/actions/ai-generation'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'

interface GenerateGapFillRequest {
  topic: string
  level: string
  language: string
  count: number
  withWordBank: boolean
  ageGroup: 'adult' | 'young'
}

export interface GapFillItem {
  id: number
  sentence: string        // sentence with _____ for the gap
  answer: string          // correct word/phrase
  hint?: string           // optional grammar hint e.g. "(verb, past tense)"
}

export interface GapFillResponse {
  topic: string
  level: string
  language: string
  withWordBank: boolean
  items: GapFillItem[]
  wordBank: string[]      // shuffled, only populated when withWordBank=true
  generatedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowed = await checkGenerationLimit(session.user.id)
    if (!allowed) {
      return NextResponse.json({ error: 'Daily generation limit exceeded' }, { status: 429 })
    }

    const body: GenerateGapFillRequest = await request.json()
    const { topic, level, language = 'English', count = 8, withWordBank = true, ageGroup = 'adult' } = body

    if (!topic || !level) {
      return NextResponse.json({ error: 'Topic and level are required' }, { status: 400 })
    }

    const ageContext = ageGroup === 'young'
      ? 'The student is a young learner (child or teenager). Use age-appropriate, simple, relatable sentences.'
      : 'The student is an adult learner.'

    const prompt = `You are an expert ${language} language teacher creating a gap-fill exercise.

Topic: ${topic}
CEFR Level: ${level}
Language: ${language}
Number of items: ${count}
${ageContext}

Create ${count} gap-fill sentences about the topic "${topic}". Each sentence has exactly ONE gap (shown as _____).

Rules:
- Each gap tests a meaningful vocabulary word or grammar structure appropriate for ${level} level
- Sentences must be natural and contextually clear
- The gap answer must be unambiguous from context
- For ${level}: ${getLevelGuidance(level)}
- Write all sentences in ${language}
- Each item MUST include a short grammar hint in brackets after the gap (e.g. "(noun)", "(verb, past simple)", "(adjective)", "(phrasal verb)")
- Do NOT number the sentences in the sentence field itself

Respond with ONLY valid JSON:
{
  "items": [
    {
      "id": 1,
      "sentence": "She _____ (verb, past simple) to the meeting late because of traffic.",
      "answer": "arrived",
      "hint": "verb, past simple"
    }
  ]
}`

    const result = await generateWithProviderFailover({ prompt, generationConfig: { maxOutputTokens: 4096, responseMimeType: 'application/json' } })
    const jsonStr = extractJSONFromText(result.rawText)
    const parsed = cleanAndParseJSON<{ items: GapFillItem[] }>(jsonStr)

    if (!parsed?.items || !Array.isArray(parsed.items)) {
      throw new Error('Invalid response structure')
    }

    const items: GapFillItem[] = parsed.items.map((item, i) => ({
      id: i + 1,
      sentence: String(item.sentence || '').trim(),
      answer: String(item.answer || '').trim(),
      hint: item.hint ? String(item.hint).trim() : undefined,
    }))

    // Build shuffled word bank
    const wordBank = withWordBank
      ? [...items.map((i) => i.answer)].sort(() => Math.random() - 0.5)
      : []

    const response: GapFillResponse = {
      topic,
      level,
      language,
      withWordBank,
      items,
      wordBank,
      generatedAt: new Date().toISOString(),
    }

    await recordSuccessfulGeneration(session.user.id)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating gap-fill:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate gap-fill exercise' },
      { status: 500 }
    )
  }
}

function getLevelGuidance(level: string): string {
  const guidance: Record<string, string> = {
    A1: 'use very simple, common vocabulary (colours, numbers, basic verbs like have/be/go)',
    A2: 'use everyday vocabulary and simple grammar (present/past simple, common adjectives)',
    B1: 'use intermediate vocabulary and grammar (present perfect, modal verbs, phrasal verbs)',
    B2: 'use upper-intermediate vocabulary (passive voice, conditionals, collocations)',
    C1: 'use advanced vocabulary and complex structures (dependent prepositions, fixed phrases, nuanced word choice)',
    C2: 'use highly sophisticated vocabulary and idiomatic language (subtle distinctions, register-specific terms)',
  }
  return guidance[level] || guidance['B1']
}
