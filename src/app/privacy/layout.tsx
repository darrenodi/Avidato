import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Avidato',
  description: 'Learn how Avidato collects, uses, and protects your personal information. Read our complete privacy policy.',
  robots: { index: true, follow: true },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
