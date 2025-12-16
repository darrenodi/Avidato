import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verification Error | Avidato',
  description: 'There was an issue verifying your email. Please try again or contact support.',
  robots: { index: false, follow: false },
}

export default function VerifyErrorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
