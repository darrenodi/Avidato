import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings | Avidato',
  description: 'Manage your Avidato account settings. Update profile, change password, manage email, and customize notifications.',
  robots: { index: false, follow: false },
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
