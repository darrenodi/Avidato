import { getAIProvider, type AIProvider } from './provider'

interface ProviderGenerationConfig {
  maxOutputTokens?: number
  temperature?: number
  topK?: number
  topP?: number
  responseMimeType?: string
}

interface GenerateWithProviderOptions {
  prompt: string
  generationConfig?: ProviderGenerationConfig
  models?: string[]
  provider?: AIProvider
  signal?: AbortSignal
}

interface GenerateWithProviderResult {
  providerUsed: AIProvider
  modelUsed: string
  rawText: string
}

export async function generateWithProviderFailover({
  prompt,
  generationConfig,
  models,
  provider,
  signal,
}: GenerateWithProviderOptions): Promise<GenerateWithProviderResult> {
  const resolvedProvider = provider ?? getAIProvider()

  if (resolvedProvider === 'claude') {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: generationConfig?.maxOutputTokens ?? 16384,
        temperature: generationConfig?.temperature ?? 0.1,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: signal ?? undefined,
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as { content: Array<{ type: string; text: string }> }
    const rawText = data.content.find(c => c.type === 'text')?.text ?? ''

    return {
      providerUsed: 'claude',
      modelUsed: 'claude-sonnet-4-6',
      rawText,
    }
  }

  if (resolvedProvider === 'openai') {
    const { generateWithFailover } = await import('../openaiFailover')
    const result = await generateWithFailover({
      prompt,
      models,
      signal,
      generationConfig: {
        maxOutputTokens: generationConfig?.maxOutputTokens,
        temperature: generationConfig?.temperature,
      },
    })

    return {
      providerUsed: resolvedProvider,
      modelUsed: result.modelUsed,
      rawText: result.rawText,
    }
  }

  const { generateWithFailover } = await import('../AIAGENT/geminiFailover')
  const result = await generateWithFailover({
    prompt,
    models,
    signal,
    generationConfig,
  })

  return {
    providerUsed: resolvedProvider,
    modelUsed: result.modelUsed,
    rawText: result.rawText,
  }
}
