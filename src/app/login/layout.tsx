import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Avidato',
  description: 'Sign in to your Avidato account to access AI-powered lesson planning, discussion generators, and teaching tools.',
  keywords: 'login, sign in, Avidato account',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
