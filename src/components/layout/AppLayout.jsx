// src/components/layout/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sidebar } from './Sidebar.jsx';
import { TopNavbar } from './TopNavbar.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { CreateTaskModal } from '../tasks/CreateTaskModal.jsx';
import { CreateProjectModal } from '../projects/CreateProjectModal.jsx';
import { CreateWorkspaceModal } from '../workspace/CreateWorkspaceModal.jsx';
import { TaskDetailDrawer } from '../tasks/TaskDetailDrawer.jsx';

export const AppLayout = () => {
  const { isSidebarCollapsed } = useSelector((state) => state.ui);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [defaultProjectId, setDefaultProjectId] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState(null);

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  const handleOpenCreateTask = (projectId = null, status = null) => {
    // Strictly accept strings only to prevent SyntheticEvents or event objects from polluting state
    const safeProjectId = typeof projectId === 'string' ? projectId : null;
    const safeStatus = typeof status === 'string' ? status : null;
    setDefaultProjectId(safeProjectId);
    setDefaultStatus(safeStatus);
    setIsCreateTaskOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex transition-colors">
      {/* Fixed Left Sidebar */}
      <Sidebar
        onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        onOpenCreateWorkspace={() => setIsCreateWorkspaceOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-18' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Top Navbar */}
        <TopNavbar onOpenCreateTask={() => handleOpenCreateTask()} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet
            context={{
              onOpenCreateTask: handleOpenCreateTask,
              onOpenCreateProject: () => setIsCreateProjectOpen(true),
              onOpenCreateWorkspace: () => setIsCreateWorkspaceOpen(true),
            }}
          />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Task Detail Drawer */}
      <TaskDetailDrawer />

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        defaultProjectId={defaultProjectId}
        defaultStatus={defaultStatus}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />

      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceOpen}
        onClose={() => setIsCreateWorkspaceOpen(false)}
      />
    </div>
  );
};
