import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Profile | Avidato',
  description: 'View and manage student profile, learning plan, and generated lessons.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Student Profile | Avidato',
    description: 'View student profile, learning plan, and generated lessons.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
