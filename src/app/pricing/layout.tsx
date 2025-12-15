import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Plans | Avidato - Affordable AI English Teaching Tools',
  description: 'Avidato pricing plans for ESL tutors. Free Starter plan, Pro plan at $6/month, Premium at $10/month. Unlimited lesson generation, discussion questions, worksheets, and CEFR-level customization.',
  keywords: 'ESL tutoring pricing, English teaching tools cost, affordable lesson planning, AI tutoring plans, CEFR level resources',
  openGraph: {
    title: 'Avidato Pricing - ESL Tutoring Plans',
    description: 'Choose the perfect plan for your English teaching needs. Free to Pro options available.',
    type: 'website',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
