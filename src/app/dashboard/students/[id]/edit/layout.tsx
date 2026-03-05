import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Student | Avidato',
  description: 'Edit student profile, CEFR level, target language, and learning preferences.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Edit Student | Avidato',
    description: 'Update student profile and learning preferences.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function EditStudentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
