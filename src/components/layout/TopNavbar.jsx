// src/components/layout/TopNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  Plus,
  LogOut,
  User,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';
import {
  toggleTheme,
  setMobileSidebarOpen,
  setCommandPaletteOpen,
} from '../../redux/slices/uiSlice.js';
import { logout } from '../../redux/slices/authSlice.js';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../redux/slices/notificationSlice.js';
import { authService } from '../../services/authService.js';
import { fetchProjects } from '../../redux/slices/projectSlice.js';
import { fetchTasks } from '../../redux/slices/taskSlice.js';
import { fetchWorkspaces } from '../../redux/slices/workspaceSlice.js';
import { Avatar } from '../ui/Avatar.jsx';
import { Button } from '../ui/Button.jsx';
import { formatRelativeTime } from '../../utils/formatDate.js';

export const TopNavbar = ({ onOpenCreateTask }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, isSidebarCollapsed } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notification);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Page Title & Breadcrumbs
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/tasks') return 'My Tasks';
    if (path === '/projects') return 'Projects';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path === '/calendar') return 'Calendar';
    if (path === '/notifications') return 'Notifications';
    if (path === '/team') return 'Team & Workspace';
    if (path === '/settings') return 'Settings';
    return 'TaskFlow';
  };

  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      await authService.seedDemoData();
      if (currentWorkspace) {
        dispatch(fetchProjects({ workspace: currentWorkspace._id }));
        dispatch(fetchTasks({ workspace: currentWorkspace._id }));
      }
      dispatch(fetchWorkspaces());
      dispatch(fetchNotifications());
      setIsUserMenuOpen(false);
    } catch (err) {
      console.error('Seed demo data error:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Section: Hamburger (mobile) + Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => dispatch(setMobileSidebarOpen(true))}
            className="lg:hidden p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 truncate">
            <span className="font-medium text-stone-700 dark:text-stone-300 truncate hidden sm:inline">
              {currentWorkspace?.name || 'Workspace'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 hidden sm:inline text-stone-400" />
            <h1 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 truncate">
              {getBreadcrumb()}
            </h1>
          </div>
        </div>

        {/* Center Section: Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={() => dispatch(setCommandPaletteOpen(true))}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/50 hover:bg-stone-100 dark:hover:bg-stone-800/80 text-stone-400 text-xs transition-colors cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search anything...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-200/80 dark:bg-stone-800 text-[10px] font-semibold text-stone-500 dark:text-stone-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Task Button */}
          <Button
            size="sm"
            onClick={() => onOpenCreateTask && onOpenCreateTask()}
            icon={Plus}
            className="hidden sm:inline-flex"
          >
            New Task
          </Button>

          {/* Search Trigger for Mobile */}
          <button
            type="button"
            onClick={() => dispatch(setCommandPaletteOpen(true))}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-2 z-50">
                <div className="px-3 py-2 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => dispatch(markAllNotificationsRead())}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60 my-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-stone-500 dark:text-stone-400">
                      You're all caught up! No notifications.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => {
                          if (!notif.isRead) {
                            dispatch(markNotificationRead(notif._id));
                          }
                          if (notif.relatedProject) {
                            navigate(`/projects/${notif.relatedProject._id || notif.relatedProject}`);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3 text-xs transition-colors rounded-xl cursor-pointer ${
                          notif.isRead
                            ? 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                            : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-stone-800 dark:text-stone-200 font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold">{notif.title}</p>
                          <span className="text-[10px] text-stone-400 shrink-0">
                            {formatRelativeTime(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                  <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Profile & Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSeeding ? 'Seeding Demo Data...' : 'Seed Hackathon Demo'}</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(logout());
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
