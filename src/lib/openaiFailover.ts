// src/lib/openaiFailover.ts
// Lightweight model failover helper for generative calls.
// Tries models in order until one succeeds. If all fail, throws aggregated error info.
// This keeps it isolated from the heavier OpenAI service logic.

import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ordered by preference / capability
export const MODEL_FALLBACK_CHAIN: string[] = [
 // 'gpt-5-nano',  // Primary model
  // 'gpt-5-mini',  // Fallback 1
  'gpt-5.1',
  'gpt-5-mini',     // Fallback 2
]

export interface FailoverResult {
  modelUsed: string
  rawText: string
}

interface GenerateOptions {
  prompt: string
  generationConfig?: {
    maxOutputTokens?: number
    temperature?: number
  }
  models?: string[] // optional custom chain
  signal?: AbortSignal
}

export async function generateWithFailover({
  prompt,
  generationConfig = {
    maxOutputTokens: 8192,
  },
  models = MODEL_FALLBACK_CHAIN,
}: GenerateOptions): Promise<FailoverResult> {
  const errors: { model: string; error: unknown }[] = []

  for (const modelName of models) {
    try {
      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [{ role: 'user', content: prompt }],
        max_completion_tokens: generationConfig.maxOutputTokens,
        ...(generationConfig.temperature !== undefined && { temperature: generationConfig.temperature }),
        response_format: { type: 'json_object' },
      })
      const text = completion.choices[0]?.message?.content
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response text')
      }
      return { modelUsed: modelName, rawText: text }
    } catch (err) {
      console.warn(`❌ OpenAI API Failed - Model: ${modelName}, Error:`, err instanceof Error ? err.message : String(err))
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
