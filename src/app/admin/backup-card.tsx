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
        const blob = await response.blob();
        
        const disposition = response.headers.get('content-disposition');
        const filename = disposition
          ? disposition.split('filename="')[1]?.split('"')[0]
          : `avidato-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        setSuccessMessage(`Backup downloaded: ${filename}`);
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
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/80 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-rose-50">
          <svg
            className="w-6 h-6 text-rose-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1.5">Database Backup</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-3">
        {statusInfo?.message || 'Create and download database backups.'}
      </p>

      {statusInfo && (
        <div className="flex gap-4 text-xs text-slate-400 mb-4">
          <span>{statusInfo.provider}</span>
          <span>{statusInfo.backupFrequency}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
          {successMessage}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleBackup}
          disabled={isLoading}
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
            isLoading
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-brand-primary hover:text-brand-dark cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </>
          ) : (
            <>
              Download Backup
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </>
          )}
        </button>
        <span className="text-slate-200">|</span>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Supabase
        </a>
      </div>
    </div>
  );
}
