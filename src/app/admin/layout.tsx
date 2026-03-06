'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

interface ExtendedUser {
  email?: string | null;
  isAdmin?: boolean;
}

interface ExtendedSession {
  user?: ExtendedUser;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/users', label: 'Users', exact: false },
  { href: '/admin/notifications', label: 'Notifications', exact: false },
  { href: '/admin/blog', label: 'Blog', exact: false },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login?callbackUrl=admin');
      return;
    }

    const extendedSession = session as ExtendedSession;
    if (!extendedSession.user?.isAdmin) {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-brand-primary/20 border-t-brand-primary mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  const extendedSession = session as ExtendedSession;
  if (!extendedSession.user?.isAdmin) {
    return null;
  }

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50/80">
      {/* Admin Header */}
      <header className="bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white tracking-tight">Admin Panel</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {extendedSession.user?.email}
                </p>
              </div>
            </div>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-3.5 text-sm font-medium transition-colors ${
                    active
                      ? 'text-brand-primary'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
