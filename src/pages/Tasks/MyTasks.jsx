// src/pages/Tasks/MyTasks.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, CheckSquare, Sparkles } from 'lucide-react';
import { fetchTasks } from '../../redux/slices/taskSlice.js';
import { KanbanBoard } from '../../components/tasks/KanbanBoard.jsx';
import { TaskListView } from '../../components/tasks/TaskListView.jsx';
import { FilterBar } from '../../components/tasks/FilterBar.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Tabs } from '../../components/ui/Tabs.jsx';

export const MyTasks = ({ onOpenCreateTask }) => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.task);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('assigned_to_me'); // 'assigned_to_me' | 'all'
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
    search: '',
  });

  useEffect(() => {
    if (currentWorkspace?._id) {
      dispatch(fetchTasks({ workspace: currentWorkspace._id }));
    }
  }, [currentWorkspace, dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ status: '', priority: '', assignee: '', search: '' });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Tab filter
    if (activeTab === 'assigned_to_me') {
      const isAssigned =
        task.assignee?._id === user?._id || task.assignee === user?._id;
      if (!isAssigned) return false;
    }

    // Status filter
    if (filters.status && task.status !== filters.status) return false;

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) return false;

    // Assignee filter
    if (filters.assignee) {
      const assigneeMatch =
        task.assignee?._id === filters.assignee || task.assignee === filters.assignee;
      if (!assigneeMatch) return false;
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const titleMatch = task.title?.toLowerCase().includes(q);
      const descMatch = task.description?.toLowerCase().includes(q);
      if (!titleMatch && !descMatch) return false;
    }

    return true;
  });

  const myTasksCount = tasks.filter(
    (t) => t.assignee?._id === user?._id || t.assignee === user?._id
  ).length;

  return (
    <div className="space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            <span>Tasks & Work Items</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Organize sprints, backlog, review cycles, and team milestones
          </p>
        </div>

        <Button size="sm" onClick={() => onOpenCreateTask && onOpenCreateTask()} icon={Plus}>
          New Task
        </Button>
      </div>

      {/* Tabs: Assigned to me vs Workspace tasks */}
      <Tabs
        tabs={[
          {
            id: 'assigned_to_me',
            label: 'Assigned to Me',
            count: myTasksCount,
          },
          { id: 'all', label: 'All Workspace Tasks', count: tasks.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        members={currentWorkspace?.members?.map((m) => m.user) || []}
      />

      {/* Main Content: Kanban or List */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          onQuickCreateTask={(status) => onOpenCreateTask(null, status)}
        />
      ) : (
        <TaskListView tasks={filteredTasks} />
      )}
    </div>
  );
};
