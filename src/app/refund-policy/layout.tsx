import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | Avidato',
  description: 'Review Avidato\'s refund policy and money-back guarantee for subscription plans.',
  robots: { index: true, follow: true },
}

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
