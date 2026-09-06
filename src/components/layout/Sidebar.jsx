// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar as CalendarIcon,
  Bell,
  Users,
  Settings,
  ChevronDown,
  Plus,
  PanelLeftClose,
  PanelLeft,
  ChevronsUpDown,
  Sparkles,
  Check,
  Folder,
  CircleDot,
} from 'lucide-react';
import {
  toggleSidebar,
  setMobileSidebarOpen,
} from '../../redux/slices/uiSlice.js';
import { setCurrentWorkspace } from '../../redux/slices/workspaceSlice.js';
import { Avatar } from '../ui/Avatar.jsx';

export const Sidebar = ({ onOpenCreateProject, onOpenCreateWorkspace }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isSidebarCollapsed, isMobileSidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { workspaces, currentWorkspace } = useSelector((state) => state.workspace);
  const { projects } = useSelector((state) => state.project);
  const { unreadCount } = useSelector((state) => state.notification);

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'My Tasks', icon: CheckSquare },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { to: '/team', label: 'Team', icon: Users },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectWorkspace = (ws) => {
    dispatch(setCurrentWorkspace(ws));
    setIsWorkspaceMenuOpen(false);
  };

  const currentWsProjects = projects.filter(
    (p) => !currentWorkspace || p.workspace === currentWorkspace._id || p.workspace?._id === currentWorkspace._id
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/60 lg:hidden backdrop-blur-xs"
          onClick={() => dispatch(setMobileSidebarOpen(false))}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-r border-stone-200 dark:border-stone-800 transition-all duration-300 flex flex-col ${
          isSidebarCollapsed ? 'w-18' : 'w-64'
        } ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200 dark:border-stone-800/80 shrink-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-white ring-1 ring-stone-200 dark:ring-stone-700 shadow-md shadow-emerald-500/20 shrink-0 overflow-hidden">
              <img src="/logo-mark.png" alt="TaskFlow" className="w-full h-full object-contain p-0.5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold text-stone-900 dark:text-white tracking-tight leading-none">
                  TaskFlow
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase mt-0.5">
                  Pro Management
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="p-3 border-b border-stone-200 dark:border-stone-800/80 relative shrink-0">
          <div
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className={`w-full flex items-center justify-between p-2 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-left transition-colors cursor-pointer border border-stone-200 dark:border-stone-700/50 ${
              isSidebarCollapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                {currentWorkspace?.name ? currentWorkspace.name[0].toUpperCase() : 'W'}
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                    {currentWorkspace?.name || 'My Workspace'}
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                    {currentWorkspace?.members?.length || 1} members
                  </p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <ChevronsUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            )}
          </div>

          {/* Workspace Dropdown */}
          {isWorkspaceMenuOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl z-50 p-1 text-xs">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Switch Workspace
              </div>
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {workspaces.map((ws) => {
                  const isCurrent = currentWorkspace?._id === ws._id;
                  return (
                    <button
                      key={ws._id}
                      type="button"
                      onClick={() => handleSelectWorkspace(ws)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="pt-1 mt-1 border-t border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsWorkspaceMenuOpen(false);
                    onOpenCreateWorkspace && onOpenCreateWorkspace();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-stone-700/80 transition-colors font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            {!isSidebarCollapsed && 'Navigation'}
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => dispatch(setMobileSidebarOpen(false))}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/80'
                } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                title={isSidebarCollapsed ? link.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="flex-1 truncate">{link.label}</span>
                )}
                {!isSidebarCollapsed && link.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Projects Sub-list */}
          {!isSidebarCollapsed && (
            <div className="pt-5">
              <div className="px-2 py-1 flex items-center justify-between text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                <span>Projects ({currentWsProjects.length})</span>
                <button
                  type="button"
                  onClick={() => onOpenCreateProject && onOpenCreateProject()}
                  className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-0.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Create Project"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-1 space-y-0.5">
                {currentWsProjects.length === 0 ? (
                  <div className="px-3 py-2 text-stone-400 dark:text-stone-500 text-xs italic">
                    No projects yet
                  </div>
                ) : (
                  currentWsProjects.slice(0, 6).map((proj) => {
                    const isProjActive = location.pathname === `/projects/${proj._id}`;
                    return (
                      <NavLink
                        key={proj._id}
                        to={`/projects/${proj._id}`}
                        onClick={() => dispatch(setMobileSidebarOpen(false))}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-colors ${
                          isProjActive
                            ? 'bg-emerald-50 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 font-medium'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/50'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: proj.color || '#10b981' }}
                        />
                        <span className="truncate flex-1">{proj.name}</span>
                      </NavLink>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card / Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800/80 shrink-0">
          <div
            onClick={() => navigate('/settings')}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-1' : ''
            }`}
          >
            <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
            {!isSidebarCollapsed && (
              <div className="truncate flex-1">
                <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                  {user?.name || 'Signed In'}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                  {user?.email || 'user@taskflow.internal'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
