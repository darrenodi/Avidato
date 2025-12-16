import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Students | Avidato',
  description: 'Manage your English students. Add, edit, and track student progress with Avidato teaching tools.',
  robots: { index: false, follow: false },
}

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
