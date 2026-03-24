import { NextRequest, NextResponse } from 'next/server'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkGenerationLimit, recordSuccessfulGeneration } from '@/app/actions/ai-generation'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'

export interface ErrorCorrectionItem {
  id: number
  incorrect: string
  correct: string
  errorType: string   // e.g. "verb tense", "article", "word order"
  explanation: string
}

export interface ErrorCorrectionResponse {
  topic: string
  level: string
  language: string
  items: ErrorCorrectionItem[]
  generatedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const allowed = await checkGenerationLimit(session.user.id)
    if (!allowed) return NextResponse.json({ error: 'Daily generation limit exceeded' }, { status: 429 })

    const body = await request.json()
    const { topic, level, language = 'English', count = 8, grammarFocus, ageGroup = 'adult' } = body

    if (!topic || !level) return NextResponse.json({ error: 'Topic and level are required' }, { status: 400 })

    const ageContext = ageGroup === 'young'
      ? 'The student is a young learner. Use simple, age-appropriate sentences and common errors kids make.'
      : 'The student is an adult learner.'

    const grammarLine = grammarFocus ? `Focus errors on: ${grammarFocus}.` : 'Include a variety of common error types appropriate for this level.'

    const prompt = `You are an expert ${language} language teacher creating an error correction exercise.

Topic: ${topic}
CEFR Level: ${level}
Language: ${language}
Number of sentences: ${count}
${ageContext}
${grammarLine}

Create ${count} sentences, each containing exactly ONE grammatical or lexical error that a ${level} level learner might make.

Rules:
- Each sentence has EXACTLY one error
- Errors must be realistic mistakes learners at ${level} actually make
- The correct version must differ from the incorrect version in only the one error
- Write sentences in ${language} about the topic "${topic}"
- Explanations must be brief and clear (max 15 words)
- Error types: verb tense, subject-verb agreement, article (a/an/the), preposition, word choice, plural/singular, word order, missing word

Respond with ONLY valid JSON:
{
  "items": [
    {
      "id": 1,
      "incorrect": "She didn't went to the office yesterday.",
      "correct": "She didn't go to the office yesterday.",
      "errorType": "verb tense",
      "explanation": "After 'didn't', use the base form of the verb."
    }
  ]
}`

    const result = await generateWithProviderFailover({ prompt, generationConfig: { maxOutputTokens: 4096, responseMimeType: 'application/json' } })
    const jsonStr = extractJSONFromText(result.rawText)
    const parsed = cleanAndParseJSON<{ items: ErrorCorrectionItem[] }>(jsonStr)

    if (!parsed?.items || !Array.isArray(parsed.items)) throw new Error('Invalid response structure')

    const items: ErrorCorrectionItem[] = parsed.items.map((item, i) => ({
      id: i + 1,
      incorrect: String(item.incorrect || '').trim(),
      correct: String(item.correct || '').trim(),
      errorType: String(item.errorType || '').trim(),
      explanation: String(item.explanation || '').trim(),
    }))

    await recordSuccessfulGeneration(session.user.id)
    return NextResponse.json({ topic, level, language, items, generatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('Error generating error correction:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate' }, { status: 500 })
  }
}
