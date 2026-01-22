import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'English Teaching Blog | Avidato',
  description: 'Read articles about English teaching, ESL lesson plans, CEFR language levels, grammar tips, vocabulary strategies, and online tutoring best practices for language educators.',
  keywords: 'ESL, EFL, English teaching, blog, lesson plans, CEFR, language learning, online tutoring',
  openGraph: {
    title: 'Avidato Blog - English ESL Teaching Resources',
    description: 'Free ESL lesson plans, English teaching resources, and CEFR language learning tips for online tutors',
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </>
  )
}
