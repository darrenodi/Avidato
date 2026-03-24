import { NextRequest, NextResponse } from 'next/server'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkGenerationLimit, recordSuccessfulGeneration } from '@/app/actions/ai-generation'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'

export interface TrueFalseItem {
  id: number
  statement: string
  answer: 'True' | 'False' | 'Not Given'
  justification: string  // tutor reference — where in text / why
}

export interface TrueFalseResponse {
  title: string
  passage: string
  level: string
  language: string
  items: TrueFalseItem[]
  generatedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const allowed = await checkGenerationLimit(session.user.id)
    if (!allowed) return NextResponse.json({ error: 'Daily generation limit exceeded' }, { status: 429 })

    const body = await request.json()
    const { topic, passageText, level, language = 'English', count = 8, includeNotGiven = true, ageGroup = 'adult' } = body

    if (!level) return NextResponse.json({ error: 'Level is required' }, { status: 400 })
    if (!topic && !passageText) return NextResponse.json({ error: 'Topic or passage text is required' }, { status: 400 })

    const ageContext = ageGroup === 'young'
      ? 'The student is a young learner. Use a short, simple, engaging passage suitable for children or teenagers.'
      : 'The student is an adult learner.'

    const answerTypes = includeNotGiven ? 'True, False, or Not Given' : 'True or False'
    const ngNote = includeNotGiven
      ? '"Not Given" means the statement is neither confirmed nor denied by the passage.'
      : ''

    const passageInstruction = passageText
      ? `Use the following passage:\n\n${passageText}`
      : `Generate a short reading passage (150-250 words) about "${topic}" appropriate for ${level} level ${language} learners. Then create the statements based on that passage.`

    const prompt = `You are an expert ${language} language teacher creating a True/False${includeNotGiven ? '/Not Given' : ''} reading exercise.

CEFR Level: ${level}
Language: ${language}
Number of statements: ${count}
${ageContext}

${passageInstruction}

Create ${count} statements based on the passage. Each statement must be answered as ${answerTypes}. ${ngNote}

Distribution: roughly ${Math.round(count * 0.4)} True, ${Math.round(count * 0.35)} False, ${includeNotGiven ? `${Math.round(count * 0.25)} Not Given` : ''}

Rules:
- Statements must be based on specific information in the passage
- False statements should change a key detail (a number, name, or fact)
- Not Given statements should be plausible but not addressable from the text
- Statements should be in the same language as the passage
- Keep statements clear and unambiguous

Respond with ONLY valid JSON:
{
  "title": "Reading: [short title]",
  "passage": "[the full passage text]",
  "items": [
    {
      "id": 1,
      "statement": "The company was founded in 2005.",
      "answer": "False",
      "justification": "The passage states it was founded in 2010."
    }
  ]
}`

    const result = await generateWithProviderFailover({ prompt, generationConfig: { maxOutputTokens: 6000, responseMimeType: 'application/json' } })
    const jsonStr = extractJSONFromText(result.rawText)
    const parsed = cleanAndParseJSON<{ title: string; passage: string; items: TrueFalseItem[] }>(jsonStr)

    if (!parsed?.items || !Array.isArray(parsed.items)) throw new Error('Invalid response structure')

    const items: TrueFalseItem[] = parsed.items.map((item, i) => ({
      id: i + 1,
      statement: String(item.statement || '').trim(),
      answer: item.answer as 'True' | 'False' | 'Not Given',
      justification: String(item.justification || '').trim(),
    }))

    await recordSuccessfulGeneration(session.user.id)
    return NextResponse.json({
      title: parsed.title || `Reading: ${topic || 'Passage'}`,
      passage: parsed.passage || passageText || '',
      level,
      language,
      items,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error generating true/false:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate' }, { status: 500 })
  }
}
