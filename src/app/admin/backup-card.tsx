'use client';

import { useState, useEffect } from 'react';

interface BackupStatus {
  status: string;
  provider?: string;
  lastBackup?: string;
  message?: string;
  backupFrequency?: string;
  statistics?: {
    users: number;
    students: number;
    lessons: number;
  };
}

export default function BackupCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusInfo, setStatusInfo] = useState<BackupStatus | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBackupStatus();
  }, []);

  const fetchBackupStatus = async () => {
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' })
      });

      if (response.ok) {
        const data = await response.json();
        setStatusInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch backup status:', error);
    }
  };

  const handleBackup = async () => {
    setIsLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'backup' })
      });

      if (response.ok) {
        // Get the blob from response
        const blob = await response.blob();
        
        // Extract filename from Content-Disposition header
        const disposition = response.headers.get('content-disposition');
        const filename = disposition
          ? disposition.split('filename="')[1]?.split('"')[0]
          : `avidato-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        setSuccessMessage(
          `✓ Backup downloaded successfully: ${filename}`
        );

        // Refresh status
        setTimeout(fetchBackupStatus, 2000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Backup error:', err);
      alert('Failed to initiate backup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Database Backup
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            {statusInfo?.message ||
              'Create and manage database backups. Supabase automatically backs up your database daily.'}
          </p>
          {statusInfo && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>
                <strong>Provider:</strong> {statusInfo.provider}
              </p>
              <p>
                <strong>Backup Frequency:</strong> {statusInfo.backupFrequency}
              </p>
            </div>
          )}
        </div>
        <div className="ml-4 p-3 bg-red-100 dark:bg-red-900 rounded-lg">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {successMessage && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded text-green-800 dark:text-green-200 text-sm">
          {successMessage}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleBackup}
          disabled={isLoading}
          className={`inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isLoading
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
          }`}
        >
          {isLoading ? 'Creating Backup...' : 'Create Backup'}
        </button>

        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Open Supabase Dashboard
        </a>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        💡 Tip: Go to Project Settings → Backups in Supabase Dashboard to view, download, and restore backups.
      </p>
    </div>
  );
}
