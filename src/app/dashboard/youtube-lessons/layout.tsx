import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YouTube Lessons | Avidato',
  description: 'Browse and manage your YouTube-based English lessons. View, share, and track lesson progress.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'YouTube Lessons | Avidato',
    description: 'Browse and manage your YouTube-based English lessons.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function YouTubeLessonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
