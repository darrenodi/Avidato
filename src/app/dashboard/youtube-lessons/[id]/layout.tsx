import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

const DEFAULT_OG_IMAGE = 'https://avidato.com/logo.png'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  try {
    const lesson = await prisma.youTubeLesson.findUnique({
      where: { id },
      select: { title: true, level: true, topic: true, videoId: true },
    })

    if (lesson) {
      const title = lesson.title || 'YouTube Lesson'
      const level = lesson.level || ''
      const topic = lesson.topic || ''
      const pageTitle = `${title} | Avidato`
      const description = [
        level ? `${level} English lesson` : 'English lesson',
        topic ? `about ${topic}` : '',
        '— powered by Avidato',
      ].filter(Boolean).join(' ')

      const ogImage = lesson.videoId && lesson.videoId !== 'manual'
        ? `https://img.youtube.com/vi/${lesson.videoId}/maxresdefault.jpg`
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
    console.error('Error generating YouTube lesson metadata:', error)
  }

  return {
    title: 'YouTube Lesson | Avidato',
    description: 'View and manage a YouTube-based English lesson.',
    robots: { index: false, follow: false },
  }
}

export default function YouTubeLessonDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
