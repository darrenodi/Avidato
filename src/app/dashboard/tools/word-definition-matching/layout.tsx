import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Word Definition Matching | Avidato',
  description: 'Create vocabulary matching exercises for your English students. AI-generated word-definition pairs by CEFR level.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Word Definition Matching | Avidato',
    description: 'Create vocabulary matching exercises for ESL/EFL students.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function WordDefinitionMatchingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
