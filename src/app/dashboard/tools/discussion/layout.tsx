import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discussion Generator | Avidato',
  description: 'Generate AI-powered discussion questions for your English lessons. Customize by CEFR level and topic.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Discussion Generator | Avidato',
    description: 'Generate discussion questions customized by CEFR level and topic.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function DiscussionGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
