import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  const apiKey = process.env.PEXELS_API
  if (!apiKey) return NextResponse.json({ error: 'Pexels not configured' }, { status: 503 })

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    )
    if (!res.ok) return NextResponse.json({ error: 'Pexels error' }, { status: 502 })

    const data = await res.json()
    const photo = data.photos?.[0]
    if (!photo) return NextResponse.json({ error: 'No image found' }, { status: 404 })

    return NextResponse.json({
      url: photo.src.large2x || photo.src.large,
      photographer: photo.photographer,
      pexelsUrl: photo.url,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}
