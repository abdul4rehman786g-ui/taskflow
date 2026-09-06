// src/components/tasks/TaskListView.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  CheckCircle2,
  Circle,
  Calendar,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';
import {
  openTaskDrawer,
  updateTaskStatus,
} from '../../redux/slices/taskSlice.js';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants.js';
import { formatDate, isDueSoon, isOverdue } from '../../utils/formatDate.js';
import { Avatar } from '../ui/Avatar.jsx';

export const TaskListView = ({ tasks = [] }) => {
  const dispatch = useDispatch();

  const handleToggleComplete = (e, task) => {
    e.stopPropagation();
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    dispatch(updateTaskStatus({ id: task._id, status: newStatus }));
  };

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-stone-400 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
        No tasks matching this view.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 w-10">Done</th>
              <th className="py-3 px-4 min-w-[200px]">Task Title</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Assignee</th>
              <th className="py-3 px-4">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {tasks.map((task) => {
              const priorityMeta =
                TASK_PRIORITIES[task.priority] || TASK_PRIORITIES.MEDIUM;
              const statusMeta = TASK_STATUSES[task.status] || TASK_STATUSES.TODO;
              const overdue =
                isOverdue(task.dueDate) && task.status !== 'COMPLETED';
              const isDone = task.status === 'COMPLETED';

              return (
                <tr
                  key={task._id}
                  onClick={() => dispatch(openTaskDrawer(task._id))}
                  className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={(e) => handleToggleComplete(e, task)}
                      className="text-stone-300 dark:text-stone-600 hover:text-emerald-500 cursor-pointer transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold transition-colors ${
                          isDone
                            ? 'line-through text-stone-400 dark:text-stone-500'
                            : 'text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-stone-500">
                    {task.project?.name || '—'}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityMeta.badgeClass}`}
                    >
                      {priorityMeta.label}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {task.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar
                          name={task.assignee.name}
                          src={task.assignee.avatar}
                          size="xs"
                        />
                        <span className="text-stone-700 dark:text-stone-300">
                          {task.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-stone-400 italic">Unassigned</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {task.dueDate ? (
                      <span
                        className={`font-medium ${
                          overdue ? 'text-red-500 font-bold' : 'text-stone-500'
                        }`}
                      >
                        {formatDate(task.dueDate)}
                      </span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
