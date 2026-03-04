import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

interface SharedLessonData {
  title?: string
  topic?: string
  level?: string
  videoId?: string
}

const DEFAULT_OG_IMAGE = 'https://avidato.com/logo.png'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  try {
    const record = await prisma.sharedYouTubeLesson.findUnique({
      where: { id },
      select: { data: true, expiresAt: true },
    })

    if (record && record.expiresAt > new Date()) {
      const data = record.data as SharedLessonData
      const title = data.title || 'Shared Lesson'
      const level = data.level || ''
      const topic = data.topic || ''
      const videoId = data.videoId

      const pageTitle = `${title} | Avidato`
      const description = [
        level ? `${level} English lesson` : 'English lesson',
        topic ? `about ${topic}` : '',
        '— generated with Avidato',
      ]
        .filter(Boolean)
        .join(' ')

      // Use YouTube thumbnail if we have a video ID, otherwise Avidato logo
      const ogImage =
        videoId && videoId !== 'manual'
          ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          : DEFAULT_OG_IMAGE

      return {
        title: pageTitle,
        description,
        openGraph: {
          title,
          description,
          siteName: 'Avidato',
          images: [{ url: ogImage, alt: title }],
          type: 'article',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [ogImage],
        },
        robots: { index: false, follow: false },
      }
    }
  } catch (error) {
    console.error('Error generating shared lesson metadata:', error)
  }

  return {
    title: 'Shared Lesson | Avidato',
    description: 'View a shared English lesson on Avidato.',
    openGraph: {
      title: 'Shared Lesson',
      description: 'View a shared English lesson on Avidato.',
      siteName: 'Avidato',
      images: [{ url: DEFAULT_OG_IMAGE, alt: 'Avidato' }],
    },
    robots: { index: false, follow: false },
  }
}

export default function SharedYouTubeLessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
