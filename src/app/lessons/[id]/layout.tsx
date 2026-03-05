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
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: {
        title: true,
        overview: true,
        student: { select: { level: true, targetLanguage: true } },
      },
    })

    if (lesson) {
      const title = lesson.title || 'Lesson'
      const level = lesson.student?.level || ''
      const language = lesson.student?.targetLanguage || 'English'
      const pageTitle = `${title} | Avidato`
      const description = lesson.overview
        ? lesson.overview.slice(0, 160)
        : [
            level ? `${level} ${language} lesson` : `${language} lesson`,
            '— powered by Avidato',
          ].join(' ')

      return {
        title: pageTitle,
        description,
        openGraph: {
          title,
          description,
          siteName: 'Avidato',
          images: [{ url: DEFAULT_OG_IMAGE, alt: 'Avidato' }],
          type: 'article',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [DEFAULT_OG_IMAGE],
        },
        robots: { index: false, follow: false },
      }
    }
  } catch (error) {
    console.error('Error generating lesson metadata:', error)
  }

  return {
    title: 'Lesson | Avidato',
    description: 'Interactive language learning lesson with exercises and activities.',
    robots: { index: false, follow: false },
  }
}

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
