import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lesson | Avidato',
  description: 'Interactive language learning lesson with exercises and activities',
}

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
