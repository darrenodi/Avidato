import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shared Lesson | Avidato',
  description: 'View shared English lesson from Avidato. Complete exercises and practice with vocabulary, grammar, dialogue, and discussion activities.',
  robots: { index: true, follow: true },
}

export default function SharedLessonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
