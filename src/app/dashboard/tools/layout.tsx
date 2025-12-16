import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools | Avidato',
  description: 'Access Avidato AI teaching tools. Use the Discussion Generator, Lesson Planner, and other features to enhance your English lessons.',
  robots: { index: false, follow: false },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
