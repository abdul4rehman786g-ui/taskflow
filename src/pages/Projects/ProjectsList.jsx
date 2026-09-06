// src/pages/Projects/ProjectsList.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  Search,
} from 'lucide-react';
import { fetchProjects } from '../../redux/slices/projectSlice.js';
import { fetchTasks } from '../../redux/slices/taskSlice.js';
import { formatDate } from '../../utils/formatDate.js';
import { Button } from '../../components/ui/Button.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export const ProjectsList = ({ onOpenCreateProject }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projects, isLoading } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (currentWorkspace?._id) {
      dispatch(fetchProjects({ workspace: currentWorkspace._id }));
      dispatch(fetchTasks({ workspace: currentWorkspace._id }));
    }
  }, [currentWorkspace, dispatch]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-emerald-500" />
            <span>Projects & Epics</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage high-level project goals, roadmap milestones, and team deliverables
          </p>
        </div>

        <Button size="sm" onClick={() => onOpenCreateProject && onOpenCreateProject()} icon={Plus}>
          New Project
        </Button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create your first team project to start organizing tasks, epics, and deadlines."
          actionLabel="Create Project"
          onAction={() => onOpenCreateProject && onOpenCreateProject()}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => {
            const projTasks = tasks.filter(
              (t) => t.project === proj._id || t.project?._id === proj._id
            );
            const total = projTasks.length;
            const completed = projTasks.filter((t) => t.status === 'COMPLETED').length;
            const inProgress = projTasks.filter((t) => t.status === 'IN_PROGRESS').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={proj._id}
                onClick={() => navigate(`/projects/${proj._id}`)}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Color & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: proj.color || '#10b981' }}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {proj.status || 'ACTIVE'}
                      </span>
                    </div>

                    {proj.dueDate && (
                      <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(proj.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-4 leading-relaxed">
                    {proj.description || 'No description provided.'}
                  </p>
                </div>

                <div>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-medium">
                      <span>Progress</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} />
                  </div>

                  {/* Footer: Tasks Count & Members */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{completed}/{total}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>{inProgress} active</span>
                      </span>
                    </div>

                    {/* Member Avatars */}
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {proj.members?.slice(0, 3).map((m, idx) => (
                        <Avatar
                          key={idx}
                          name={m.user?.name || 'Member'}
                          src={m.user?.avatar}
                          size="xs"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
