import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Student | Avidato',
  description: 'Add a new student to your Avidato account. Set their CEFR level, target language, and learning goals.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Add Student | Avidato',
    description: 'Add a new student to your Avidato account.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function AddStudentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
