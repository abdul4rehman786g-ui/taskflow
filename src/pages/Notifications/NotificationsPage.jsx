// src/pages/Notifications/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, FolderKanban, CheckSquare } from 'lucide-react';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../redux/slices/notificationSlice.js';
import { openTaskDrawer } from '../../redux/slices/taskSlice.js';
import { formatRelativeTime } from '../../utils/formatDate.js';
import { Button } from '../../components/ui/Button.jsx';
import { Tabs } from '../../components/ui/Tabs.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export const NotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector((state) => state.notification);

  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const displayedNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  const handleClickNotification = (notif) => {
    if (!notif.isRead) {
      dispatch(markNotificationRead(notif._id));
    }
    if (notif.relatedTask) {
      dispatch(openTaskDrawer(notif.relatedTask._id || notif.relatedTask));
    } else if (notif.relatedProject) {
      navigate(`/projects/${notif.relatedProject._id || notif.relatedProject}`);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-500" />
            <span>Activity & Notifications</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Stay updated on task assignments, mentions, status updates, and milestones
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="secondary"
            icon={CheckCheck}
            onClick={() => dispatch(markAllNotificationsRead())}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All Notifications', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
        ]}
        activeTab={filter}
        onChange={setFilter}
      />

      {/* Notifications List */}
      {displayedNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={
            filter === 'unread'
              ? 'You have caught up with all your unread notifications!'
              : 'You do not have any notifications yet.'
          }
        />
      ) : (
        <div className="space-y-2">
          {displayedNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleClickNotification(n)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !n.isRead
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    !n.isRead
                      ? 'bg-emerald-500 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                  }`}
                >
                  {n.type === 'TASK_ASSIGNED' ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {n.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-stone-400 mt-1.5 inline-block">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(markNotificationRead(n._id));
                  }}
                  className="p-1.5 text-stone-400 hover:text-emerald-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
