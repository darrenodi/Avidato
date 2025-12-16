import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Student | Avidato',
  description: 'Add a new student to your Avidato account.',
  robots: { index: false, follow: false },
}

export default function AddStudentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
