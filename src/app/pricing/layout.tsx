import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | Avidato',
  description: 'Choose the right Avidato plan for your English teaching needs. Free Starter, affordable Pro and Premium plans with unlimited lesson generation and AI tools.',
  keywords: 'ESL tutoring pricing, English teaching tools, lesson planning cost, AI tutoring plans, CEFR resources',
  openGraph: {
    title: 'Avidato Pricing - ESL Tutoring Plans',
    description: 'Choose the perfect plan for your English teaching needs. Free to Pro options available.',
    type: 'website',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
