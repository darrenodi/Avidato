import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | Avidato',
  description: 'Create a free Avidato account to start generating AI-powered English lessons, discussion questions, and teaching materials.',
  keywords: 'sign up, create account, register, free trial',
  robots: { index: false, follow: false },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
