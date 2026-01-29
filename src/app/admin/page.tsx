'use client';

import BackupCard from './backup-card';

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send Notifications</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Send notifications to users about new features, updates, and announcements.
              </p>
            </div>
            <div className="ml-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/admin/notifications"
              className="inline-block px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors text-sm font-medium"
            >
              Open Notifications
            </a>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Manage user accounts and permissions (coming soon).
              </p>
            </div>
            <div className="ml-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-6a4 4 0 11-8 0 4 4 0 018 0zm-2 6a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <button
              disabled
              className="inline-block px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* System Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Monitor system health and view status page (coming soon).
              </p>
            </div>
            <div className="ml-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <button
              disabled
              className="inline-block px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Blog Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blog</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Manage blog posts, create new articles, and organize content.
              </p>
            </div>
            <div className="ml-4 p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <svg
                className="w-6 h-6 text-indigo-600 dark:text-indigo-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2m2 2a2 2 0 002-2m-2 2v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2m-4-15H9m4 0h4m-4 0a2 2 0 012-2h0a2 2 0 012 2m0 0h2"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/admin/blog"
              className="inline-block px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors text-sm font-medium"
            >
              Manage Blog
            </a>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                View usage analytics and reports (coming soon).
              </p>
            </div>
            <div className="ml-4 p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600 dark:text-orange-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <button
              disabled
              className="inline-block px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Database Backup Card */}
        <BackupCard />
      </div>
    </div>
  );
}
