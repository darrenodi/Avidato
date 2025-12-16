import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Blog Post | Avidato Admin',
  description: 'Edit and update a blog post on the Avidato English teaching blog.',
  robots: { index: false, follow: false },
}

export default function EditBlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
