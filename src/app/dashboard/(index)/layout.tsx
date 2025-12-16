import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Avidato',
  description: 'Your Avidato dashboard. Manage students, track lesson progress, view generation stats, and access AI teaching tools.',
  robots: { index: false, follow: false },
}

export default function DashboardIndexLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
