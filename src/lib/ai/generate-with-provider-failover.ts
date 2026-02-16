import { getAIProvider, type AIProvider } from './provider'

interface ProviderGenerationConfig {
  maxOutputTokens?: number
  temperature?: number
  topK?: number
  topP?: number
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

  if (resolvedProvider === 'openai') {
    const { generateWithFailover } = await import('../openaiFailover')
    const result = await generateWithFailover({
      prompt,
      models,
      signal,
      generationConfig: {
        maxOutputTokens: generationConfig?.maxOutputTokens,
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
