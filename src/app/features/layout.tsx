import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features | Avidato',
  description: 'Explore Avidato\'s AI-powered features: AI lesson planning, discussion generators, worksheets, quizzes, flashcards, CEFR-level customization, and real-time student collaboration tools.',
  keywords: 'AI lesson planning, English teaching features, CEFR level resources, ESL worksheets, discussion questions, flashcards, online tutoring',
  openGraph: {
    title: 'Avidato Features - Advanced English Teaching Tools',
    description: 'Comprehensive AI-powered features for English language learning and lesson creation.',
    type: 'website',
  },
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
