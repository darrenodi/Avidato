import { NextRequest, NextResponse } from 'next/server'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkGenerationLimit, recordSuccessfulGeneration } from '@/app/actions/ai-generation'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'

export interface ScrambledItem {
  id: number
  scrambled: string[]   // words in random order
  correct: string       // correct sentence
  grammarNote?: string  // optional note e.g. "Notice the word order with adverbs of frequency"
}

export interface ScrambledSentencesResponse {
  topic: string
  level: string
  language: string
  items: ScrambledItem[]
  generatedAt: string
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const allowed = await checkGenerationLimit(session.user.id)
    if (!allowed) return NextResponse.json({ error: 'Daily generation limit exceeded' }, { status: 429 })

    const body = await request.json()
    const { topic, level, language = 'English', count = 8, ageGroup = 'adult' } = body

    if (!topic || !level) return NextResponse.json({ error: 'Topic and level are required' }, { status: 400 })

    const ageContext = ageGroup === 'young'
      ? 'The student is a young learner. Use short, simple sentences (max 8 words).'
      : 'The student is an adult learner.'

    const prompt = `You are an expert ${language} language teacher creating a scrambled sentences exercise.

Topic: ${topic}
CEFR Level: ${level}
Language: ${language}
Number of sentences: ${count}
${ageContext}

Create ${count} sentences about the topic "${topic}" at ${level} level. Each sentence will be presented to the student with the words in a scrambled order.

Rules:
- Sentences must be meaningful and topic-relevant
- Length: ${getSentenceLength(level)}
- Include a variety of grammar structures appropriate for ${level}
- Add a short optional grammar note where useful (e.g. "Adverbs of frequency go before the main verb")
- Write sentences in ${language}
- Do NOT include punctuation in the word list — only include it attached to the words naturally

Respond with ONLY valid JSON:
{
  "items": [
    {
      "id": 1,
      "correct": "She always arrives at the office before nine.",
      "grammarNote": "Adverbs of frequency (always) go before the main verb."
    }
  ]
}`

    const result = await generateWithProviderFailover({ prompt, generationConfig: { maxOutputTokens: 4096, responseMimeType: 'application/json' } })
    const jsonStr = extractJSONFromText(result.rawText)
    const parsed = cleanAndParseJSON<{ items: Array<{ id: number; correct: string; grammarNote?: string }> }>(jsonStr)

    if (!parsed?.items || !Array.isArray(parsed.items)) throw new Error('Invalid response structure')

    const items: ScrambledItem[] = parsed.items.map((item, i) => {
      const correct = String(item.correct || '').trim()
      const words = correct.split(/\s+/).filter(Boolean)
      return {
        id: i + 1,
        scrambled: shuffleArray(words),
        correct,
        grammarNote: item.grammarNote ? String(item.grammarNote).trim() : undefined,
      }
    })

    await recordSuccessfulGeneration(session.user.id)
    return NextResponse.json({ topic, level, language, items, generatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('Error generating scrambled sentences:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate' }, { status: 500 })
  }
}

function getSentenceLength(level: string): string {
  const lengths: Record<string, string> = {
    A1: '4-6 words, very simple structure',
    A2: '5-8 words, simple structure',
    B1: '7-12 words, intermediate structure',
    B2: '8-14 words, more complex clauses',
    C1: '10-16 words, complex structures',
    C2: '12-18 words, sophisticated structures',
  }
  return lengths[level] || lengths['B1']
}
