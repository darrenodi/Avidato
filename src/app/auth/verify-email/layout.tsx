import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Email | Avidato',
  description: 'Verify your email address to complete your Avidato account registration.',
  robots: { index: false, follow: false },
}

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
