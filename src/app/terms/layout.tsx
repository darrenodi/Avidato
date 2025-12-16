import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Avidato',
  description: 'Review Avidato\'s terms of service and user agreements. Understand your rights and responsibilities as an Avidato user.',
  robots: { index: true, follow: true },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
