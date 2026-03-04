import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YouTube to Lesson Generator | Avidato',
  description: 'Generate a structured ESL lesson plan from any YouTube video',
  robots: { index: false, follow: false },
}

export default function YouTubeToLessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
