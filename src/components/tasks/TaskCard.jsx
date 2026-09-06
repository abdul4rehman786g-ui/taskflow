// src/components/tasks/TaskCard.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Calendar,
  MessageSquare,
  CheckSquare,
  AlertCircle,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import { openTaskDrawer } from '../../redux/slices/taskSlice.js';
import { TASK_PRIORITIES } from '../../utils/constants.js';
import { formatDate, isDueSoon, isOverdue } from '../../utils/formatDate.js';
import { Avatar } from '../ui/Avatar.jsx';

export const TaskCard = ({ task, onDragStart }) => {
  const dispatch = useDispatch();

  const priorityMeta = TASK_PRIORITIES[task.priority] || TASK_PRIORITIES.MEDIUM;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed)?.length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const dueSoon = isDueSoon(task.dueDate);
  const overdue = isOverdue(task.dueDate) && task.status !== 'COMPLETED';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => dispatch(openTaskDrawer(task._id))}
      className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all duration-200 cursor-grab active:cursor-grabbing group select-none relative"
    >
      {/* Top row: Labels & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priorityMeta.badgeClass}`}
          >
            {priorityMeta.label}
          </span>
          {task.labels?.slice(0, 2).map((lbl) => (
            <span
              key={lbl}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 truncate max-w-[100px]"
            >
              {lbl}
            </span>
          ))}
        </div>

        {task.project?.name && (
          <span
            className="text-[10px] font-semibold truncate max-w-[90px] px-1.5 py-0.5 rounded bg-stone-50 dark:bg-stone-800/80 text-stone-500"
            title={task.project.name}
          >
            {task.project.name}
          </span>
        )}
      </div>

      {/* Task Title */}
      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2.5 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {task.title}
      </h4>

      {/* Checklist progress bar if present */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              <span>Checklist</span>
            </span>
            <span>
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="w-full h-1 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{
                width: `${Math.round((completedSubtasks / totalSubtasks) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom Metadata row: Due date, comments, assignee */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[11px] text-stone-400">
        <div className="flex items-center gap-2.5">
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 font-medium ${
                overdue
                  ? 'text-red-600 dark:text-red-400 font-bold'
                  : dueSoon
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-stone-400'
              }`}
              title={`Due ${formatDate(task.dueDate)}`}
            >
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-stone-400">
            <MessageSquare className="w-3 h-3" />
            <span>0</span>
          </div>
        </div>

        {/* Assignee Avatar */}
        {task.assignee ? (
          <Avatar
            name={task.assignee.name}
            src={task.assignee.avatar}
            size="xs"
          />
        ) : (
          <div className="w-5 h-5 rounded-full border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center text-[9px] text-stone-400">
            —
          </div>
        )}
      </div>
    </div>
  );
};
