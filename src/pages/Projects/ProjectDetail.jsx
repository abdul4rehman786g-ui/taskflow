// src/pages/Projects/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FolderKanban,
  Calendar,
  Plus,
  ArrowLeft,
  Settings,
  Trash2,
  CheckCircle2,
  Clock,
  CheckSquare,
} from 'lucide-react';
import {
  fetchProjectById,
  deleteProject,
} from '../../redux/slices/projectSlice.js';
import { fetchTasks } from '../../redux/slices/taskSlice.js';
import { formatDate } from '../../utils/formatDate.js';
import { KanbanBoard } from '../../components/tasks/KanbanBoard.jsx';
import { TaskListView } from '../../components/tasks/TaskListView.jsx';
import { FilterBar } from '../../components/tasks/FilterBar.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Tabs } from '../../components/ui/Tabs.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';

export const ProjectDetail = ({ onOpenCreateTask }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProject } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [activeTab, setActiveTab] = useState('board'); // 'board' | 'list' | 'overview'
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
    search: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
      dispatch(fetchTasks({ project: id }));
    }
  }, [id, dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ status: '', priority: '', assignee: '', search: '' });
  };

  const handleDeleteProject = async () => {
    await dispatch(deleteProject(id));
    navigate('/projects');
  };

  // Filter tasks belonging to this project
  const projectTasks = tasks.filter(
    (t) => t.project === id || t.project?._id === id
  );

  const filteredTasks = projectTasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assignee) {
      const assigneeMatch =
        task.assignee?._id === filters.assignee || task.assignee === filters.assignee;
      if (!assigneeMatch) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const titleMatch = task.title?.toLowerCase().includes(q);
      const descMatch = task.description?.toLowerCase().includes(q);
      if (!titleMatch && !descMatch) return false;
    }
    return true;
  });

  const total = projectTasks.length;
  const completed = projectTasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgress = projectTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (!currentProject) {
    return (
      <div className="py-16 text-center text-xs text-stone-400">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back Button & Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </button>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span
              className="w-4 h-4 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: currentProject.color || '#10b981' }}
            />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {currentProject.name}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  {currentProject.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
                {currentProject.description || 'No project description provided.'}
              </p>

              {/* Deadline & Members */}
              <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
                {currentProject.dueDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Target: {formatDate(currentProject.dueDate)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{completed} of {total} tasks completed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => onOpenCreateTask && onOpenCreateTask(id)}
              icon={Plus}
            >
              Add Task
            </Button>
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2 text-stone-400 hover:text-red-500 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-medium">
          <span>Overall Epic Progress</span>
          <span className="font-bold text-stone-800 dark:text-stone-200">{rate}% Complete</span>
        </div>
        <Progress value={rate} />
      </div>

      {/* View Tabs */}
      <Tabs
        tabs={[
          { id: 'board', label: 'Kanban Board', count: total },
          { id: 'list', label: 'List View' },
          { id: 'overview', label: 'Overview & Insights' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Filter Bar */}
      {activeTab !== 'overview' && (
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          members={currentWorkspace?.members?.map((m) => m.user) || []}
        />
      )}

      {/* Tab Panels */}
      {activeTab === 'board' && (
        <KanbanBoard
          tasks={filteredTasks}
          onQuickCreateTask={(status) => onOpenCreateTask(id, status)}
        />
      )}

      {activeTab === 'list' && <TaskListView tasks={filteredTasks} />}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Sprint Velocity
            </h3>
            <p className="text-3xl font-black text-stone-900 dark:text-stone-100">
              {rate}%
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {completed} of {total} deliverables shipped
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Active Sprint Work
            </h3>
            <p className="text-3xl font-black text-blue-600">
              {inProgress}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Currently in active development
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Target Deadline
            </h3>
            <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {currentProject.dueDate ? formatDate(currentProject.dueDate) : 'Open Ended'}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {currentProject.startDate ? `Started ${formatDate(currentProject.startDate)}` : 'Milestone schedule'}
            </p>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to permanently delete this project and all its tasks? This action cannot be reversed."
      />
    </div>
  );
};
