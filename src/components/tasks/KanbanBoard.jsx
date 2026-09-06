// src/components/tasks/KanbanBoard.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, MoreHorizontal } from 'lucide-react';
import { TaskCard } from './TaskCard.jsx';
import {
  updateTaskStatus,
  optimisticStatusChange,
} from '../../redux/slices/taskSlice.js';

const COLUMNS = [
  { id: 'TODO', label: 'To Do', color: 'bg-stone-400 dark:bg-stone-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'REVIEW', label: 'Under Review', color: 'bg-purple-500' },
  { id: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500' },
];

export const KanbanBoard = ({ tasks = [], onQuickCreateTask }) => {
  const dispatch = useDispatch();
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(task._id);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverColumn === columnId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === targetStatus) return;

    // Optimistic UI update
    dispatch(optimisticStatusChange({ taskId, status: targetStatus }));

    // Dispatch server sync
    dispatch(updateTaskStatus({ id: taskId, status: targetStatus }));
    setDraggedTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4.5 items-start pb-6">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const isTarget = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col rounded-2xl bg-stone-100/60 dark:bg-stone-900/40 border transition-all duration-200 min-h-[500px] ${
              isTarget
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                : 'border-stone-200/80 dark:border-stone-800/80'
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-stone-200/60 dark:border-stone-800/60">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                  {col.label}
                </h3>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                  {colTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onQuickCreateTask && onQuickCreateTask(col.id)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title={`Add task to ${col.label}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Task Cards */}
            <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
              {colTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDragStart={handleDragStart}
                />
              ))}

              {colTasks.length === 0 && (
                <div className="h-28 flex flex-col items-center justify-center text-center p-3 rounded-xl border border-dashed border-stone-200 dark:border-stone-800/80 text-[11px] text-stone-400">
                  <span>No tasks</span>
                  <button
                    type="button"
                    onClick={() => onQuickCreateTask && onQuickCreateTask(col.id)}
                    className="mt-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                  >
                    + Create one
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
