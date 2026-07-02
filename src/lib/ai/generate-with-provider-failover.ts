// Thin wrapper around the Gemini model-failover chain.
// Kept as the single entry point all generation routes call, so a future
// provider change only touches this file.
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
  signal?: AbortSignal
}

interface GenerateWithProviderResult {
  providerUsed: 'gemini'
  modelUsed: string
  rawText: string
}

export async function generateWithProviderFailover({
  prompt,
  generationConfig,
  models,
  signal,
}: GenerateWithProviderOptions): Promise<GenerateWithProviderResult> {
  const { generateWithFailover } = await import('../AIAGENT/geminiFailover')
  const result = await generateWithFailover({
    prompt,
    models,
    signal,
    generationConfig,
  })
  return {
    providerUsed: 'gemini',
    modelUsed: result.modelUsed,
    rawText: result.rawText,
  }
}
