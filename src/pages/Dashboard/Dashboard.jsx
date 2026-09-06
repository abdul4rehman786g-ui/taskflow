// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  TrendingUp,
  FolderKanban,
  Calendar,
  ArrowUpRight,
  Plus,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { fetchTasks, openTaskDrawer } from '../../redux/slices/taskSlice.js';
import { fetchProjects } from '../../redux/slices/projectSlice.js';
import api from '../../services/api.js';
import { formatDate, formatRelativeTime, isOverdue } from '../../utils/formatDate.js';
import { Button } from '../../components/ui/Button.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { Progress } from '../../components/ui/Progress.jsx';

export const Dashboard = ({ onOpenCreateTask }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { tasks, isLoading } = useSelector((state) => state.task);
  const { projects } = useSelector((state) => state.project);

  const [activities, setActivities] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  useEffect(() => {
    if (currentWorkspace?._id) {
      dispatch(fetchTasks({ workspace: currentWorkspace._id }));
      dispatch(fetchProjects({ workspace: currentWorkspace._id }));

      // Fetch recent workspace activity
      setLoadingActivity(true);
      api
        .get('/activity', { params: { workspace: currentWorkspace._id, limit: 8 } })
        .then((res) => {
          if (res.data?.success) {
            setActivities(res.data.data);
          }
        })
        .catch((err) => console.error('Activity error:', err))
        .finally(() => setLoadingActivity(false));
    }
  }, [currentWorkspace, dispatch]);

  // Derived metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const reviewTasks = tasks.filter((t) => t.status === 'REVIEW').length;
  const todoTasks = tasks.filter((t) => t.status === 'TODO').length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && isOverdue(t.dueDate) && t.status !== 'COMPLETED'
  ).length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Upcoming deadlines (next 5 sorted by due date)
  const upcomingDeadlines = [...tasks]
    .filter((t) => t.dueDate && t.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Engineer'} 👋
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            You have <span className="text-emerald-400 font-bold">{inProgressTasks} tasks in progress</span> across{' '}
            <span className="font-semibold text-white">{projects.length} active projects</span> in {currentWorkspace?.name || 'this workspace'}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="md"
            onClick={() => onOpenCreateTask && onOpenCreateTask()}
            icon={Plus}
            className="shadow-lg shadow-emerald-900/40"
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {totalTasks}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500 font-medium">
            <span>{todoTasks} waiting to start</span>
          </div>
        </div>

        {/* Card 2: Completed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {completedTasks}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>{completionRate}% completion velocity</span>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Active Sprint
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {inProgressTasks}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500 font-medium">
            <span>+ {reviewTasks} under review</span>
          </div>
        </div>

        {/* Card 4: Overdue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Overdue Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/60 flex items-center justify-center text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400">
            {overdueTasks}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500 font-medium">
            <span>Requires immediate team triage</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Visual Status Distribution & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Bar & Projects progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Sprint Delivery Status
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Distribution of {totalTasks} work items across all sprint lanes
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {completionRate}% Done
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-4 rounded-full bg-stone-100 dark:bg-stone-800 flex overflow-hidden p-0.5 gap-0.5">
              {totalTasks > 0 ? (
                <>
                  <div
                    title={`Completed: ${completedTasks}`}
                    style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                    className="bg-emerald-500 rounded-full transition-all"
                  />
                  <div
                    title={`Review: ${reviewTasks}`}
                    style={{ width: `${(reviewTasks / totalTasks) * 100}%` }}
                    className="bg-purple-500 rounded-full transition-all"
                  />
                  <div
                    title={`In Progress: ${inProgressTasks}`}
                    style={{ width: `${(inProgressTasks / totalTasks) * 100}%` }}
                    className="bg-blue-500 rounded-full transition-all"
                  />
                  <div
                    title={`To Do: ${todoTasks}`}
                    style={{ width: `${(todoTasks / totalTasks) * 100}%` }}
                    className="bg-stone-300 dark:bg-stone-600 rounded-full transition-all"
                  />
                </>
              ) : (
                <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full" />
              )}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-stone-500">Done ({completedTasks})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                <span className="text-stone-500">Review ({reviewTasks})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-stone-500">In Progress ({inProgressTasks})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-400 shrink-0" />
                <span className="text-stone-500">To Do ({todoTasks})</span>
              </div>
            </div>
          </div>

          {/* Active Projects Tracker */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-emerald-500" />
                <span>Active Projects</span>
              </h3>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center italic">
                  No active projects yet.
                </p>
              ) : (
                projects.slice(0, 4).map((proj) => {
                  const projTasks = tasks.filter(
                    (t) => t.project === proj._id || t.project?._id === proj._id
                  );
                  const projCompleted = projTasks.filter(
                    (t) => t.status === 'COMPLETED'
                  ).length;
                  const rate =
                    projTasks.length > 0
                      ? Math.round((projCompleted / projTasks.length) * 100)
                      : 0;

                  return (
                    <div
                      key={proj._id}
                      onClick={() => navigate(`/projects/${proj._id}`)}
                      className="p-3.5 rounded-xl border border-stone-200/70 dark:border-stone-800/80 hover:border-emerald-500/50 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: proj.color || '#10b981' }}
                          />
                          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {proj.name}
                          </h4>
                        </div>
                        <span className="text-xs font-semibold text-stone-500">
                          {rate}%
                        </span>
                      </div>
                      <Progress value={rate} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Deadlines & Activity */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Upcoming Deadlines</span>
            </h3>

            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center italic">
                  No upcoming deadlines scheduled.
                </p>
              ) : (
                upcomingDeadlines.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => dispatch(openTaskDrawer(t._id))}
                    className="p-3 rounded-xl border border-stone-100 dark:border-stone-800/80 bg-stone-50/60 dark:bg-stone-800/30 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                        {t.title}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-semibold shrink-0">
                        {formatDate(t.dueDate)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 truncate">
                      {t.project?.name || 'Project'} • {t.priority}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Recent Activity</span>
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {loadingActivity ? (
                <p className="text-xs text-stone-400 text-center py-6 animate-pulse">
                  Loading activity...
                </p>
              ) : activities.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6 italic">
                  No activity recorded yet.
                </p>
              ) : (
                activities.map((act) => (
                  <div key={act._id} className="flex items-start gap-2.5 text-xs">
                    <Avatar
                      name={act.user?.name || 'User'}
                      src={act.user?.avatar}
                      size="xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-stone-800 dark:text-stone-200 leading-snug">
                        <span className="font-semibold text-stone-900 dark:text-stone-100">
                          {act.user?.name || 'Teammate'}
                        </span>{' '}
                        {act.details?.title ? (
                          <span>
                            {act.action.toLowerCase()} "
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              {act.details.title}
                            </span>
                            "
                          </span>
                        ) : (
                          <span>{act.action.replace('_', ' ').toLowerCase()}</span>
                        )}
                      </p>
                      <span className="text-[10px] text-stone-400">
                        {formatRelativeTime(act.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
