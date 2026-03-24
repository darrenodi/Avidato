import { NextRequest, NextResponse } from 'next/server'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkGenerationLimit, recordSuccessfulGeneration } from '@/app/actions/ai-generation'
import { extractJSONFromText, cleanAndParseJSON } from '@/lib/utils/json-parser'

export interface MCQOption {
  label: 'A' | 'B' | 'C' | 'D'
  text: string
}

export interface MCQItem {
  id: number
  question: string
  options: MCQOption[]
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string
}

export interface MCQReadingResponse {
  title: string
  passage: string
  level: string
  language: string
  items: MCQItem[]
  generatedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const allowed = await checkGenerationLimit(session.user.id)
    if (!allowed) return NextResponse.json({ error: 'Daily generation limit exceeded' }, { status: 429 })

    const body = await request.json()
    const { topic, passageText, level, language = 'English', count = 6, ageGroup = 'adult' } = body

    if (!level) return NextResponse.json({ error: 'Level is required' }, { status: 400 })
    if (!topic && !passageText) return NextResponse.json({ error: 'Topic or passage text is required' }, { status: 400 })

    const ageContext = ageGroup === 'young'
      ? 'The student is a young learner. Use a short, engaging, age-appropriate passage and simple answer choices.'
      : 'The student is an adult learner.'

    const passageInstruction = passageText
      ? `Use the following passage:\n\n${passageText}`
      : `Generate a reading passage (${getPassageLength(level)}) about "${topic}" appropriate for ${level} level ${language} learners.`

    const prompt = `You are an expert ${language} language teacher creating a multiple choice reading comprehension exercise.

CEFR Level: ${level}
Language: ${language}
Number of questions: ${count}
${ageContext}

${passageInstruction}

Create ${count} multiple choice questions based on the passage. Each question has 4 options (A, B, C, D) with only one correct answer.

Question types to include:
- Main idea / gist questions (1-2)
- Detail / factual questions (2-3)
- Vocabulary in context (1)
- Inference questions (1, for B2+ only)

Rules:
- Wrong options (distractors) must be plausible but clearly incorrect based on the passage
- Do not make questions trick questions
- Keep language in questions at or slightly below ${level}
- Explanations reference the passage directly

Respond with ONLY valid JSON:
{
  "title": "Reading: [short title]",
  "passage": "[full passage text]",
  "items": [
    {
      "id": 1,
      "question": "What is the main purpose of the text?",
      "options": [
        { "label": "A", "text": "To advertise a product" },
        { "label": "B", "text": "To inform readers about a topic" },
        { "label": "C", "text": "To persuade readers to take action" },
        { "label": "D", "text": "To entertain with a story" }
      ],
      "correctAnswer": "B",
      "explanation": "The passage provides factual information about... without trying to sell or persuade."
    }
  ]
}`

    const result = await generateWithProviderFailover({ prompt, generationConfig: { maxOutputTokens: 6000, responseMimeType: 'application/json' } })
    const jsonStr = extractJSONFromText(result.rawText)
    const parsed = cleanAndParseJSON<{ title: string; passage: string; items: MCQItem[] }>(jsonStr)

    if (!parsed?.items || !Array.isArray(parsed.items)) throw new Error('Invalid response structure')

    const items: MCQItem[] = parsed.items.map((item, i) => ({
      id: i + 1,
      question: String(item.question || '').trim(),
      options: (item.options || []).map((o) => ({ label: o.label, text: String(o.text || '').trim() })),
      correctAnswer: item.correctAnswer,
      explanation: String(item.explanation || '').trim(),
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
    console.error('Error generating MCQ reading:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate' }, { status: 500 })
  }
}

function getPassageLength(level: string): string {
  const lengths: Record<string, string> = {
    A1: '60-100 words, very simple sentences',
    A2: '80-130 words, simple sentences',
    B1: '150-200 words, intermediate complexity',
    B2: '200-280 words, varied sentence structures',
    C1: '250-350 words, complex ideas',
    C2: '300-400 words, sophisticated language',
  }
  return lengths[level] || '150-200 words'
}
