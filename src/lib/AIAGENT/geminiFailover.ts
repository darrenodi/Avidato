// src/lib/geminiFailover.ts
// Lightweight model failover helper for generative calls.
// Tries models in order until one succeeds. If all fail, throws aggregated error info.
// This keeps it isolated from the heavier geminiService logic.

import { GoogleGenerativeAI, type GenerationConfig } from '@google/generative-ai'

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

// Ordered by preference / capability
// gemini-2.5-flash: paid tier, most stable under load
// gemini-2.0-flash: reliable paid-tier fallback
// gemini-3.1-flash-lite-preview: lite/free tier
// gemini-2.5-flash-lite: lite/free tier last resort
export const MODEL_FALLBACK_CHAIN: string[] = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-3.1-flash-lite-preview',
  'gemini-2.5-flash-lite',
]

export interface FailoverResult {
  modelUsed: string
  rawText: string
}

interface GenerateOptions {
  prompt: string
  generationConfig?: GenerationConfig
  models?: string[] // optional custom chain
  signal?: AbortSignal
}

export async function generateWithFailover({
  prompt,
  generationConfig = {
    temperature: 0.1,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
  models = MODEL_FALLBACK_CHAIN,
}: GenerateOptions): Promise<FailoverResult> {
  const errors: { model: string; error: unknown }[] = []

  for (const modelName of models) {
    try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig,
    })
    // Note: current SDK generateContent signature doesn't accept AbortSignal directly; omit if unsupported
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], safetySettings: [] })
      const response = result.response
      const text = response.text()
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response text')
      }

      // Truncation detection: check if Gemini stopped because of token limit
      const finishReason = response.candidates?.[0]?.finishReason
      if (finishReason === 'MAX_TOKENS') {
        console.warn(`⚠️ Gemini response truncated (MAX_TOKENS) - Model: ${modelName}, maxOutputTokens: ${generationConfig.maxOutputTokens}`)
      }

      console.log(`✅ Gemini API Success - Model used: ${modelName}`)
      return { modelUsed: modelName, rawText: text }
    } catch (err) {
      console.warn(`❌ Gemini API Failed - Model: ${modelName}, Error:`, err instanceof Error ? err.message : String(err))
      errors.push({ model: modelName, error: err })
      // Continue to next model.
    }
  }

  const summary = errors.map(e => {
    const msg = (e.error instanceof Error) ? e.error.message : String(e.error)
    return `${e.model}: ${msg}`
  }).join('\n')
  throw new Error(`All fallback models failed. Details:\n${summary}`)
}
