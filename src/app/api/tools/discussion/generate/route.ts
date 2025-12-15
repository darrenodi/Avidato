import { NextRequest, NextResponse } from 'next/server'
import { generateWithFailover } from '@/lib/openaiFailover'

interface GenerateQuestionsRequest {
  topic: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  context?: string
}

interface DiscussionQuestion {
  id: number
  question: string
  type: 'warm-up' | 'main' | 'deep-dive'
}

interface GenerateQuestionsResponse {
  topic: string
  level: string
  questions: DiscussionQuestion[]
  generatedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionsRequest = await request.json()
    const { topic, level, context } = body

    if (!topic || !level) {
      return NextResponse.json(
        { error: 'Topic and level are required' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert English language teacher creating educational discussion materials for ESL/EFL learners.

Create discussion questions for an English language classroom lesson.

Topic: ${topic}
Student CEFR Level: ${level}
${context ? `Additional Context: ${context}` : ''}

Task: Generate ${getQuestionCount(level)} conversation starter questions appropriate for ${level} level English language learners studying this topic. These are for classroom discussion practice.
${context ? 'Please incorporate the additional context provided above in the question generation.' : ''}

Question Distribution:
- 2-3 warm-up questions (simple, easy to answer, ice-breakers)
- 5-7 main discussion questions (medium difficulty, encourage conversation)
- 2-3 deep-dive questions (challenging, for higher proficiency levels)

Guidelines:
- Questions should encourage natural conversation
- Vary question types (open-ended, opinion-based, personal experience)
- Appropriate for educational context
- Questions relate to "${topic}"

Output format - respond with ONLY a valid JSON array, no other text:
[
  {
    "id": 1,
    "question": "Your question here?",
    "type": "warm-up"
  },
  {
    "id": 2,
    "question": "Your question here?",
    "type": "main"
  }
]`

    const result = await generateWithFailover({
      prompt,
      generationConfig: {
        maxOutputTokens: 2048,
      },
    })

    const responseText = result.rawText

    // Check if the AI refused to generate content
    if (responseText.includes("I'm not able") || responseText.includes("I can't") || responseText.includes("I cannot") || responseText.includes("unable to")) {
      console.error('AI refused to generate content:', responseText)
      throw new Error(`The AI cannot generate discussion questions on this topic. ${responseText.substring(0, 150)}`)
    }

    // Parse the JSON response
    let questions: DiscussionQuestion[]
    try {
      const parsed = JSON.parse(responseText)
      console.log('Parsed response structure:', JSON.stringify(parsed).substring(0, 300))
      
      // Handle both wrapped and unwrapped responses
      if (Array.isArray(parsed)) {
        questions = parsed
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        questions = parsed.questions
      } else if (parsed.data && Array.isArray(parsed.data)) {
        questions = parsed.data
      } else {
        console.error('Response structure:', Object.keys(parsed))
        throw new Error('Could not find questions array in response')
      }
    } catch (parseError) {
      console.error('Parse error:', parseError)
      // Try to extract JSON if there's extra text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      } else {
        const objMatch = responseText.match(/\{[\s\S]*\}/)
        if (objMatch) {
          const parsed = JSON.parse(objMatch[0])
          if (Array.isArray(parsed)) {
            questions = parsed
          } else if (parsed.questions && Array.isArray(parsed.questions)) {
            questions = parsed.questions
          } else if (parsed.data && Array.isArray(parsed.data)) {
            questions = parsed.data
          } else {
            console.error('Raw response:', responseText)
            throw new Error(`Failed to parse questions from AI response: ${responseText.substring(0, 200)}`)
          }
        } else {
          console.error('Raw response:', responseText)
          throw new Error(`Failed to parse questions from AI response: ${responseText.substring(0, 200)}`)
        }
      }
    }

    // Validate and sanitize questions
    if (!Array.isArray(questions)) {
      console.error('Parsed questions:', questions, 'Type:', typeof questions)
      throw new Error(`Questions response is not an array: ${typeof questions}`)
    }

    const validatedQuestions = questions.map((q, index) => ({
      id: index + 1,
      question: String(q.question).trim(),
      type: (q.type as 'warm-up' | 'main' | 'deep-dive') || 'main',
    }))

    const response: GenerateQuestionsResponse = {
      topic,
      level,
      questions: validatedQuestions,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating discussion questions:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate discussion questions',
      },
      { status: 500 }
    )
  }
}

function getQuestionCount(level: string): number {
  // More advanced levels get more questions
  const counts: Record<string, number> = {
    A1: 8,
    A2: 10,
    B1: 12,
    B2: 12,
    C1: 15,
    C2: 15,
  }
  return counts[level] || 12
}
