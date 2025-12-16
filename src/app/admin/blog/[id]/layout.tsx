import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Post | Avidato',
  description: 'Read blog post about language learning and education',
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
