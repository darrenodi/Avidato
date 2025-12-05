'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminNotifications() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sendToAll, setSendToAll] = useState(true);

  const [formData, setFormData] = useState({
    type: 'announcement',
    title: '',
    message: '',
    link: '',
    recipientIds: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        type: formData.type,
        title: formData.title,
        message: formData.message,
        link: formData.link || null,
        sendToAll,
        recipientIds: !sendToAll && formData.recipientIds 
          ? formData.recipientIds.split(',').map(id => id.trim())
          : null,
      };

      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send notification');
      }

      const data = await response.json();
      setSuccess(true);
      setFormData({
        type: 'announcement',
        title: '',
        message: '',
        link: '',
        recipientIds: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send Notifications</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200">
                ✓ Notification sent successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Notification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Notification Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="announcement">Announcement</option>
              <option value="feature">New Feature</option>
              <option value="update">System Update</option>
              <option value="maintenance">Maintenance</option>
              <option value="alert">Alert</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., New Instant Lesson Generator"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              placeholder="Compose your notification message here..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Link (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Link (Optional)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="e.g., /dashboard/lessons/instant"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Recipients
            </label>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={sendToAll}
                  onChange={() => setSendToAll(true)}
                  className="w-4 h-4"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-300">Send to all users</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={!sendToAll}
                  onChange={() => setSendToAll(false)}
                  className="w-4 h-4"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-300">Send to specific users</span>
              </label>
            </div>

            {!sendToAll && (
              <div className="mt-3">
                <textarea
                  name="recipientIds"
                  value={formData.recipientIds}
                  onChange={handleInputChange}
                  placeholder="Enter user IDs separated by commas"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Example: user1,user2,user3
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
            <button
              type="reset"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              onClick={() => {
                setFormData({
                  type: 'announcement',
                  title: '',
                  message: '',
                  link: '',
                  recipientIds: '',
                });
                setError('');
                setSuccess(false);
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
