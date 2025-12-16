import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications | Avidato Admin',
  description: 'Send notifications to Avidato users about new features, updates, and announcements.',
  robots: { index: false, follow: false },
}

export default function AdminNotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
