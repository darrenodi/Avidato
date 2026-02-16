export type AIProvider = 'openai' | 'gemini'

const DEFAULT_PROVIDER: AIProvider = 'gemini'

export function getAIProvider(): AIProvider {
  const rawProvider = process.env.AI_PROVIDER?.trim().toLowerCase()

  if (rawProvider === 'openai' || rawProvider === 'gemini') {
    return rawProvider
  }

  return DEFAULT_PROVIDER
}

export function getConfiguredAIProviderLabel(): string {
  return getAIProvider()
}
