import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Blog | Avidato Admin',
  description: 'Create, edit, and manage blog posts for the Avidato blog.',
  robots: { index: false, follow: false },
}

export default function AdminBlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
