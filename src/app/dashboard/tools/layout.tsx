import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools | Avidato',
  description: 'Access Avidato AI teaching tools. Use the Discussion Generator, YouTube to Lesson, and more to enhance your English lessons.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'AI Teaching Tools | Avidato',
    description: 'AI-powered tools for ESL/EFL tutors. Generate discussions, lessons, and more.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
