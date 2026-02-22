import { NextRequest, NextResponse } from 'next/server'
import { generateWithProviderFailover } from '@/lib/ai/generate-with-provider-failover'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkAndUpdateGenerationLimit } from '@/app/actions/ai-generation'
import { cleanAndParseJSON, stripMarkdownFences } from '@/lib/utils/json-parser'

interface GenerateExerciseRequest {
  topic: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  wordCount: number
}

interface Word {
  word: string
  definition: string
}

interface GenerateExerciseResponse {
  title: string
  instruction: string
  level: string
  topic: string
  wordsWithDefinitions: Word[]
  wordsOnly: string[]
  definitionsShuffled: string[]
  generatedAt: string
}

function normalizeDefinitions(definitions: unknown): Word[] {
  if (!Array.isArray(definitions)) return []

  return definitions
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const entry = item as { word?: unknown; definition?: unknown }
      const word = typeof entry.word === 'string' ? entry.word.trim() : ''
      const definition = typeof entry.definition === 'string' ? entry.definition.trim() : ''
      if (!word || !definition) return null
      return { word, definition }
    })
    .filter((item): item is Word => Boolean(item))
}

function parseDefinitionsResponse(rawText: string): Word[] {
  const trimmed = rawText.trim()

  const candidates: string[] = [trimmed]

  const fencedJson = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]
  if (fencedJson) candidates.push(fencedJson.trim())

  const objectMatch = trimmed.match(/\{[\s\S]*\}/)
  if (objectMatch?.[0]) candidates.push(objectMatch[0])

  const arrayMatch = trimmed.match(/\[[\s\S]*\]/)
  if (arrayMatch?.[0]) candidates.push(arrayMatch[0])

  for (const candidate of candidates) {
    try {
      const parsed = cleanAndParseJSON<unknown>(candidate)

      if (Array.isArray(parsed)) {
        const normalizedFromArray = normalizeDefinitions(parsed)
        if (normalizedFromArray.length > 0) return normalizedFromArray
      }

      if (parsed && typeof parsed === 'object') {
        const normalizedFromObject = normalizeDefinitions((parsed as { definitions?: unknown }).definitions)
        if (normalizedFromObject.length > 0) return normalizedFromObject
      }
    } catch {
      // Try next candidate shape.
    }
  }

  throw new Error('Could not parse definitions JSON from model output')
}

const LEVEL_GUIDANCE: Record<string, string> = {
  A1: 'very simple language, short sentences, common words',
  A2: 'simple language, basic concepts, everyday words',
  B1: 'clear, straightforward language, intermediate vocabulary',
  B2: 'natural language with some complexity, upper-intermediate vocabulary',
  C1: 'sophisticated language with nuance, advanced vocabulary',
  C2: 'complex, nuanced language, specialized vocabulary',
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check rate limit
    const allowed = await checkAndUpdateGenerationLimit(session.user.id)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Daily generation limit exceeded' },
        { status: 429 }
      )
    }

    const body: GenerateExerciseRequest = await request.json()
    const { topic, level, wordCount } = body

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    if (!level) {
      return NextResponse.json(
        { error: 'Level is required' },
        { status: 400 }
      )
    }

    if (!wordCount || wordCount < 4 || wordCount > 6) {
      return NextResponse.json(
        { error: 'Word count must be between 4 and 6' },
        { status: 400 }
      )
    }

    // Step 1: Generate vocabulary words on the topic
    const vocabPrompt = `You are an expert English language teacher. Generate exactly ${wordCount} English vocabulary words related to the topic "${topic.trim()}" that are appropriate for ${level} level learners (${LEVEL_GUIDANCE[level]}).

Words must be:
- Related to "${topic}"
- At ${level} proficiency level
- Practical and useful
- NOT proper nouns
- Diverse (different parts of speech if possible)

Output ONLY a JSON array with exactly ${wordCount} words. Start with [ and end with ].
No other text before or after.

Example format:
["word1", "word2", "word3", "word4", "word5"]

Generate the words now:`

    const vocabResult = await generateWithProviderFailover({
      prompt: vocabPrompt,
      generationConfig: {
        maxOutputTokens: 2048,
      },
    })

    // Parse vocabulary
    let words: string[] = []
    try {
      const cleanVocabResult = stripMarkdownFences(vocabResult.rawText)
      
      // Log what we received for debugging
      console.log('Vocab result received:', cleanVocabResult.substring(0, 200))
      
      // Try to extract JSON array - be more flexible
      let jsonMatch = cleanVocabResult.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        // Try extracting just the content between [ and ]
        const startIdx = cleanVocabResult.indexOf('[')
        const endIdx = cleanVocabResult.lastIndexOf(']')
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          jsonMatch = [cleanVocabResult.substring(startIdx, endIdx + 1)]
        }
      }
      
      if (!jsonMatch) {
        throw new Error(`No JSON array found. Got: ${cleanVocabResult.substring(0, 100)}`)
      }
      
      try {
        words = JSON.parse(jsonMatch[0])
      } catch {
        // Fallback: use cleanAndParseJSON for handling malformed JSON from Gemini
        words = cleanAndParseJSON<string[]>(jsonMatch[0])
      }
      
      if (!Array.isArray(words) || words.length === 0) {
        throw new Error('Invalid word list')
      }
    } catch (parseError) {
      console.error('Vocabulary parse error:', parseError)
      console.error('Full result:', vocabResult.rawText)
      return NextResponse.json(
        { error: 'Failed to generate vocabulary words. Please try again.' },
        { status: 500 }
      )
    }

    // Step 2: Generate definitions for the words
    const defPrompt = `You are an expert English language teacher. Generate SHORT, SIMPLE definitions for the following ${level} level words.

Words to define:
${words.map((word, i) => `${i + 1}. ${word}`).join('\n')}

CRITICAL REQUIREMENTS:
- Each definition MUST be ONE SHORT SENTENCE ONLY (maximum 10 words)
- Use VERY SIMPLE language - suitable for ESL learners at ${level} level
- NO circular definitions (don't use the word itself in the definition)
- NO long explanations or examples
- Just the essential meaning in plain, simple words
- Make each definition distinct

Good example (for "table"): "A piece of furniture with a flat top and legs"
Bad example (for "table"): "A furniture item that serves as a surface for placing items and is supported by legs, commonly found in dining areas and offices"

Format your response as valid JSON:
{
  "definitions": [
    {"word": "word1", "definition": "short simple definition"},
    {"word": "word2", "definition": "short simple definition"}
  ]
}

IMPORTANT: Respond ONLY with valid JSON object, starting with { and ending with }, no additional text.`

    let wordsWithDefinitions: Word[] = []
    let lastDefinitionError: unknown = null

    for (let attempt = 1; attempt <= 2; attempt++) {
      const retryInstruction = attempt === 1
        ? ''
        : '\n\nYour previous response was invalid. Return ONLY valid JSON with this exact shape: {"definitions":[{"word":"...","definition":"..."}]}. No markdown, no commentary.'

      try {
        const defResult = await generateWithProviderFailover({
          prompt: `${defPrompt}${retryInstruction}`,
          generationConfig: {
            maxOutputTokens: 4096,
          },
        })

        wordsWithDefinitions = parseDefinitionsResponse(defResult.rawText)
        if (wordsWithDefinitions.length > 0) break
      } catch (error) {
        lastDefinitionError = error
        console.error(`Definitions parse/generation attempt ${attempt} failed:`, error)
      }
    }

    if (!Array.isArray(wordsWithDefinitions) || wordsWithDefinitions.length === 0) {
      console.error('Definitions parsing failed after retries:', lastDefinitionError)
      return NextResponse.json(
        { error: 'Failed to parse generated definitions. Please try again.' },
        { status: 500 }
      )
    }

    if (wordsWithDefinitions.length !== wordCount) {
      console.warn(`Expected ${wordCount} definitions, got ${wordsWithDefinitions.length}`)
    }

    // Extract and shuffle definitions
    const definitions = wordsWithDefinitions.map((item: Word) => item.definition)
    const definitionsShuffled = shuffleArray(definitions)

    const response: GenerateExerciseResponse = {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} - Word Matching`,
      instruction: 'Match each word with its correct definition by dragging definitions from the right. Correct matches turn green!',
      level,
      topic: topic.trim(),
      wordsWithDefinitions,
      wordsOnly: wordsWithDefinitions.map((item: Word) => item.word),
      definitionsShuffled,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in word-definition-matching generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate exercise' },
      { status: 500 }
    )
  }
}
