// Image generation via OpenAI DALL-E 3

import OpenAI from 'openai';

export async function generateImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const openai = new OpenAI({ apiKey });

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      response_format: 'b64_json',
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) return null;

    return `data:image/png;base64,${b64}`;
  } catch (err) {
    console.error('Image generation failed:', err);
    return null;
  }
}
