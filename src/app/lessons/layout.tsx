import type { Metadata } from 'next'
import DashboardThemeProvider from "@/components/DashboardThemeProvider";

export const metadata: Metadata = {
  title: 'Lesson | Avidato',
  description: 'View your AI-generated English lesson plan with vocabulary, exercises, and discussion questions.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Lesson | Avidato',
    description: 'AI-generated English lesson plan.',
    siteName: 'Avidato',
    type: 'website',
  },
}

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        {children}
      </div>
    </DashboardThemeProvider>
  );
}