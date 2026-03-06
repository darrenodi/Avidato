'use client';

import Link from 'next/link';
import BackupCard from './backup-card';

interface DashboardCard {
  title: string;
  description: string;
  href?: string;
  buttonLabel: string;
  disabled?: boolean;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

const cards: DashboardCard[] = [
  {
    title: 'Notifications',
    description: 'Send notifications to users about new features, updates, and announcements.',
    href: '/admin/notifications',
    buttonLabel: 'Open Notifications',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    ),
  },
  {
    title: 'Users',
    description: 'View tutors, their students, lessons, and manage subscriptions.',
    href: '/admin/users',
    buttonLabel: 'View Users',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    ),
  },
  {
    title: 'System Status',
    description: 'Monitor system health, uptime, and performance metrics.',
    buttonLabel: 'Coming Soon',
    disabled: true,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
      />
    ),
  },
  {
    title: 'Blog',
    description: 'Manage blog posts, create new articles, and organize content.',
    href: '/admin/blog',
    buttonLabel: 'Manage Blog',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-500',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
      />
    ),
  },
  {
    title: 'Analytics',
    description: 'View usage analytics, traffic reports, and engagement data.',
    buttonLabel: 'Coming Soon',
    disabled: true,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    ),
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-slate-500 mt-1">Manage your platform from one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/80 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.iconBg}`}>
                <svg
                  className={`w-6 h-6 ${card.iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {card.icon}
                </svg>
              </div>
              {card.disabled && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  Soon
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1.5">{card.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">{card.description}</p>
            {card.disabled ? (
              <div className="h-10" />
            ) : (
              <Link
                href={card.href!}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-dark transition-colors group/link"
              >
                {card.buttonLabel}
                <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        ))}

        {/* Database Backup Card */}
        <BackupCard />
      </div>
    </div>
  );
}
