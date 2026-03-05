import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YouTube to Lesson Generator | Avidato',
  description: 'Generate a structured ESL lesson plan from any YouTube video. AI-powered lesson creation for English tutors.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'YouTube to Lesson Generator | Avidato',
    description: 'Turn any YouTube video into a structured ESL lesson plan with AI.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function YouTubeToLessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
