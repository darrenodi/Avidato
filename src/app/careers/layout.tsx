import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers at Avidato | Join Our Team',
  description: 'Join the Avidato team! We\'re building AI-powered tools to transform English language teaching. Explore career opportunities in product, engineering, and education.',
  keywords: 'jobs, careers, hiring, edtech, AI education, remote work',
  openGraph: {
    title: 'Careers at Avidato - Join Our AI Education Team',
    description: 'Build the future of English language learning with us.',
    type: 'website',
  },
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </>
  );
}
