import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Placement Tests | Avidato',
  description: 'Access CEFR-aligned placement tests to assess student English proficiency levels.',
  robots: { index: false, follow: false },
}

export default function PlacementTestsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
