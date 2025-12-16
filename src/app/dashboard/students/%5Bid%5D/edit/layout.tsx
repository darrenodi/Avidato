import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Student | Avidato',
  description: 'Edit student information and settings.',
  robots: { index: false, follow: false },
}

export default function EditStudentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
