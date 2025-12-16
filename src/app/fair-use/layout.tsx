import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fair Use Policy | Avidato',
  description: 'Understand Avidato\'s fair use policy and guidelines for responsible use of AI teaching tools.',
  robots: { index: true, follow: true },
}

export default function FairUseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
