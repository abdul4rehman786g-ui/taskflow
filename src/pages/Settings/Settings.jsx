// src/pages/Settings/Settings.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  Sparkles,
  LogOut,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { updateProfile, logout } from '../../redux/slices/authSlice.js';
import { toggleTheme } from '../../redux/slices/uiSlice.js';
import { authService } from '../../services/authService.js';
import { fetchWorkspaces } from '../../redux/slices/workspaceSlice.js';
import { fetchProjects } from '../../redux/slices/projectSlice.js';
import { fetchTasks } from '../../redux/slices/taskSlice.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';

export const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { theme } = useSelector((state) => state.ui);

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await dispatch(updateProfile({ name, avatar })).unwrap();
      setSuccessMessage('Profile details updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedDemoData = async () => {
    try {
      setIsSeeding(true);
      await authService.seedDemoData();
      dispatch(fetchWorkspaces());
      if (currentWorkspace?._id) {
        dispatch(fetchProjects({ workspace: currentWorkspace._id }));
        dispatch(fetchTasks({ workspace: currentWorkspace._id }));
      }
      setSuccessMessage('Demo projects, tasks, and team members seeded!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-500" />
          <span>Account & Preferences</span>
        </h2>
        <p className="text-xs text-stone-400 mt-0.5">
          Manage your personal profile, visual theme, and workspace configuration
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-500" />
          <span>Personal Profile</span>
        </h3>

        <div className="flex items-center gap-4">
          <Avatar name={name || 'User'} src={avatar} size="lg" />
          <div>
            <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {user?.name}
            </p>
            <p className="text-[11px] text-stone-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Avatar Image URL (Optional)"
            placeholder="https://images.unsplash.com/photo-..."
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />

          <div className="pt-2">
            <Button type="submit" size="sm" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Appearance Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Appearance
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Switch between light and high-contrast dark themes
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-stone-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Demo Data Management */}
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Developer / Reviewer Demo Data</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Populate this workspace with a realistic engineering workload (sprints, tasks, checklists, team members) for demonstration and testing.
          </p>
        </div>

        <div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSeedDemoData}
            isLoading={isSeeding}
            icon={Sparkles}
          >
            {isSeeding ? 'Seeding Data...' : 'Reset & Seed Demo Workspace'}
          </Button>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="p-6 rounded-2xl bg-red-50/30 dark:bg-red-950/10 border border-red-200/80 dark:border-red-900/40 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
            Sign Out
          </h3>
          <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-0.5">
            Terminate your current session on this machine
          </p>
        </div>

        <Button
          size="sm"
          variant="danger"
          icon={LogOut}
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};
