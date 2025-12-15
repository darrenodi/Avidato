import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Avidato - AI English Teaching Assistant',
  description: 'Sign in to your Avidato account. Access AI-powered lesson planning, discussion generators, and CEFR-customized English teaching materials.',
  keywords: 'Avidato login, ESL tutor account, English teaching platform, AI lesson planner access',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
