import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Placement Test | Avidato',
  description: 'Take your English placement test to determine your CEFR level.',
  robots: { index: false, follow: false },
}

export default function PlacementTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
