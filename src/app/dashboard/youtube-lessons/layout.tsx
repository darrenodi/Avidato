import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YouTube Lessons | Avidato',
  description: 'Browse and manage your YouTube-based English lessons',
  robots: { index: false, follow: false },
}

export default function YouTubeLessonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
