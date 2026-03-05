import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Avidato',
  description: 'Your Avidato dashboard. Manage students, track lesson progress, and access AI teaching tools.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Dashboard | Avidato',
    description: 'Manage students, track progress, and access AI teaching tools.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function DashboardIndexLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
