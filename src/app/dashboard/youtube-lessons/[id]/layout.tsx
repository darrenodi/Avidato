import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YouTube Lesson | Avidato',
  description: 'View and manage a YouTube-based English lesson',
  robots: { index: false, follow: false },
}

export default function YouTubeLessonDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
