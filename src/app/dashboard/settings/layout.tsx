import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings | Avidato',
  description: 'Manage your Avidato account settings. Update profile, change password, manage email, and customize notifications.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Settings | Avidato',
    description: 'Manage your Avidato account settings and preferences.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
