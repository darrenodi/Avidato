import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Profile | Avidato',
  description: 'View and manage your student profile. Track progress and lesson history.',
  robots: { index: false, follow: false },
}

export default function StudentProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
