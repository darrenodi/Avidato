'use client';

import { useEffect, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { formatDistanceToNow } from 'date-fns';
import BellIcon from '@/components/icons/BellIcon';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  // Detail View
  if (selectedNotification) {
    return (
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Notifications">
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Content className="w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-6 z-50" align="end" sideOffset={8}>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setSelectedNotification(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">← Back</button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex-1">{selectedNotification.title}</h2>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded p-4 mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedNotification.message}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>{formatDistanceToNow(new Date(selectedNotification.createdAt), { addSuffix: true })}</span>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{selectedNotification.type}</span>
          </div>
          {selectedNotification.link && (
            <a href={selectedNotification.link} className="inline-block bg-brand-primary text-white px-4 py-2 rounded hover:bg-brand-accent transition-colors">
              View Feature →
            </a>
          )}
        </Popover.Content>
      </Popover.Root>
    );
  }

  // List View
  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Notifications">
          <BellIcon className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-0 z-50" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications yet</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    notification.read ? '' : 'bg-blue-50 dark:bg-blue-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{notification.title}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex justify-center">
            <button onClick={fetchNotifications} disabled={isLoading} className="text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50">
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}
