import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Blog Post | Avidato Admin',
  description: 'Write and publish a new blog post for the Avidato English teaching blog.',
  robots: { index: false, follow: false },
}

export default function CreateBlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
