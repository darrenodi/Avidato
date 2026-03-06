'use client';

import { useState, useEffect } from 'react';

interface TutorUser {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  isAdmin: boolean;
  studentCount?: number;
}

export default function AdminNotifications() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [recipientMode, setRecipientMode] = useState<'all' | 'selected'>('all');
  const [sendEmail, setSendEmail] = useState(true);

  // Tutor list for checkbox selection
  const [tutors, setTutors] = useState<TutorUser[]>([]);
  const [tutorsLoading, setTutorsLoading] = useState(false);
  const [selectedTutorIds, setSelectedTutorIds] = useState<Set<string>>(new Set());
  const [tutorSearch, setTutorSearch] = useState('');

  const [formData, setFormData] = useState({
    type: 'announcement',
    title: '',
    message: '',
    link: '',
  });

  // Fetch tutors when switching to "selected" mode
  useEffect(() => {
    if (recipientMode === 'selected' && tutors.length === 0) {
      fetchTutors();
    }
  }, [recipientMode]);

  const fetchTutors = async () => {
    setTutorsLoading(true);
    try {
      const res = await fetch('/api/admin/users?limit=500');
      if (res.ok) {
        const data = await res.json();
        setTutors(data.users || []);
      }
    } catch {
      // silently fail
    } finally {
      setTutorsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTutor = (id: string) => {
    setSelectedTutorIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedTutorIds(new Set(filteredTutors.map(t => t.id)));
  };

  const deselectAll = () => {
    setSelectedTutorIds(new Set());
  };

  const filteredTutors = tutors.filter(t => {
    if (!tutorSearch) return true;
    const q = tutorSearch.toLowerCase();
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      t.email.toLowerCase().includes(q) ||
      (t.username && t.username.toLowerCase().includes(q))
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (recipientMode === 'selected' && selectedTutorIds.size === 0) {
        throw new Error('Please select at least one tutor');
      }

      const payload = {
        type: formData.type,
        title: formData.title,
        message: formData.message,
        link: formData.link || null,
        sendToAll: recipientMode === 'all',
        recipientIds: recipientMode === 'selected' ? Array.from(selectedTutorIds) : null,
        sendEmail,
      };

      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send notification');
      }

      const data = await response.json();
      const emailInfo = sendEmail && data.emailsSent > 0
        ? ` (${data.emailsSent} email${data.emailsSent !== 1 ? 's' : ''} sent${data.emailsFailed > 0 ? `, ${data.emailsFailed} failed` : ''})`
        : '';
      setSuccess(`Notification sent to ${data.count} user${data.count !== 1 ? 's' : ''}${emailInfo}`);
      setFormData({ type: 'announcement', title: '', message: '', link: '' });
      setSelectedTutorIds(new Set());
      setRecipientMode('all');
      setSendEmail(true);

      setTimeout(() => setSuccess(''), 8000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const typeIcons: Record<string, string> = {
    announcement: '📢',
    feature: '✨',
    update: '🔄',
    maintenance: '🔧',
    alert: '⚠️',
  };

  const charCount = formData.message.length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Send Notification</h2>
        <p className="text-sm text-gray-500 mt-1">Compose and send notifications to your tutors</p>
      </div>

      {/* Success / Error banners */}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type + Title row */}
        <div className="flex gap-4">
          <div className="w-48 flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
            <div className="relative">
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary appearance-none"
              >
                <option value="announcement">Announcement</option>
                <option value="feature">New Feature</option>
                <option value="update">System Update</option>
                <option value="maintenance">Maintenance</option>
                <option value="alert">Alert</option>
              </select>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                {typeIcons[formData.type]}
              </span>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., New Instant Lesson Generator"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-700">Message *</label>
            <span className="text-xs text-gray-400">{charCount} characters</span>
          </div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            placeholder="Compose your notification message here..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary resize-none"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Link <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="/dashboard/tools or https://..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Recipients */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Recipients</h3>
          </div>
          <div className="p-4 space-y-3">
            {/* Radio options */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${recipientMode === 'all' ? 'border-brand-primary' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {recipientMode === 'all' && <div className="w-2 h-2 rounded-full bg-brand-primary" />}
                </div>
                <input type="radio" className="sr-only" checked={recipientMode === 'all'} onChange={() => setRecipientMode('all')} />
                <span className="text-sm text-gray-700">All users</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${recipientMode === 'selected' ? 'border-brand-primary' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {recipientMode === 'selected' && <div className="w-2 h-2 rounded-full bg-brand-primary" />}
                </div>
                <input type="radio" className="sr-only" checked={recipientMode === 'selected'} onChange={() => setRecipientMode('selected')} />
                <span className="text-sm text-gray-700">Select tutors</span>
              </label>
            </div>

            {/* Tutor checkbox list */}
            {recipientMode === 'selected' && (
              <div className="mt-2">
                {tutorsLoading ? (
                  <div className="py-8 text-center text-sm text-gray-400">Loading tutors...</div>
                ) : (
                  <>
                    {/* Search + select controls */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="relative flex-1">
                        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                          type="text"
                          value={tutorSearch}
                          onChange={(e) => setTutorSearch(e.target.value)}
                          placeholder="Search tutors..."
                          className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                        />
                      </div>
                      <button type="button" onClick={selectAll} className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium whitespace-nowrap">
                        Select all
                      </button>
                      <span className="text-gray-300">|</span>
                      <button type="button" onClick={deselectAll} className="text-xs text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap">
                        Clear
                      </button>
                    </div>

                    {/* Selected count */}
                    {selectedTutorIds.size > 0 && (
                      <p className="text-xs text-brand-primary font-medium mb-2">
                        {selectedTutorIds.size} tutor{selectedTutorIds.size !== 1 ? 's' : ''} selected
                      </p>
                    )}

                    {/* Scrollable tutor list */}
                    <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
                      {filteredTutors.length === 0 ? (
                        <div className="py-6 text-center text-sm text-gray-400">
                          {tutorSearch ? 'No tutors match your search' : 'No tutors found'}
                        </div>
                      ) : (
                        filteredTutors.map(tutor => (
                          <label
                            key={tutor.id}
                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition ${selectedTutorIds.has(tutor.id) ? 'bg-brand-primary/5' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedTutorIds.has(tutor.id)}
                              onChange={() => toggleTutor(tutor.id)}
                              className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {tutor.name || tutor.username || 'Unnamed'}
                                </span>
                                {tutor.isAdmin && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 truncate">{tutor.email}</p>
                            </div>
                            {tutor.studentCount !== undefined && tutor.studentCount > 0 && (
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                {tutor.studentCount} student{tutor.studentCount !== 1 ? 's' : ''}
                              </span>
                            )}
                          </label>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Email toggle */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Also send email</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {sendEmail ? 'Recipients will receive an email notification' : 'In-app notification only'}
              </p>
            </div>
            <label className="relative cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-brand-primary transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || (recipientMode === 'selected' && selectedTutorIds.size === 0)}
            className="px-6 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Sending...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                {recipientMode === 'all'
                  ? 'Send to All'
                  : `Send to ${selectedTutorIds.size} Tutor${selectedTutorIds.size !== 1 ? 's' : ''}`}
              </>
            )}
          </button>
          <button
            type="button"
            className="px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
            onClick={() => {
              setFormData({ type: 'announcement', title: '', message: '', link: '' });
              setSelectedTutorIds(new Set());
              setRecipientMode('all');
              setError('');
              setSuccess('');
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
