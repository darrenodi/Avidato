// Google Imagen image generation via REST API

export async function generateImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: '16:9' },
        }),
      }
    );

    if (!response.ok) {
      console.error('Imagen API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const b64 = data.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) return null;

    return `data:image/png;base64,${b64}`;
  } catch (err) {
    console.error('Imagen generation failed:', err);
    return null;
  }
}
