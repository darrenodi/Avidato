import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lessons | Avidato',
  description: 'View and manage your AI-generated English lessons. Create, edit, and share lessons with your students.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Lessons | Avidato',
    description: 'View and manage your AI-generated English lessons.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
