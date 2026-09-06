// src/pages/Calendar/CalendarView.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { fetchTasks, openTaskDrawer } from '../../redux/slices/taskSlice.js';
import { Button } from '../../components/ui/Button.jsx';
import { TASK_PRIORITIES } from '../../utils/constants.js';

export const CalendarView = ({ onOpenCreateTask }) => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (currentWorkspace?._id) {
      dispatch(fetchTasks({ workspace: currentWorkspace._id }));
    }
  }, [currentWorkspace, dispatch]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Build calendar matrix
  const calendarCells = [];

  // Previous month's trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateString: `${year}-${String(month).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateString: dString,
    });
  }

  // Next month leading days to complete grid
  const remaining = 42 - calendarCells.length;
  for (let n = 1; n <= remaining; n++) {
    calendarCells.push({
      day: n,
      isCurrentMonth: false,
      dateString: `${year}-${String(month + 2).padStart(2, '0')}-${String(n).padStart(2, '0')}`,
    });
  }

  const todayString = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-500" />
            <span>Sprint & Task Calendar</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Visualize release schedules, sprint milestones, and deliverables timeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleToday}>
            Today
          </Button>
          <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-stone-900 dark:text-stone-100">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Button size="sm" onClick={() => onOpenCreateTask && onOpenCreateTask()} icon={Plus}>
            New Task
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 text-center text-[11px] font-bold uppercase tracking-wider text-stone-400 py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-stone-100 dark:divide-stone-800/80">
          {calendarCells.map((cell, idx) => {
            // Find tasks due on this date
            const dayTasks = tasks.filter((t) => {
              if (!t.dueDate) return false;
              const tDate = new Date(t.dueDate).toISOString().split('T')[0];
              return tDate === cell.dateString;
            });

            const isToday = cell.dateString === todayString;

            return (
              <div
                key={idx}
                className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                  !cell.isCurrentMonth
                    ? 'bg-stone-50/50 dark:bg-stone-950/20 text-stone-300 dark:text-stone-600'
                    : 'text-stone-900 dark:text-stone-100'
                } ${isToday ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-emerald-600 text-white font-bold'
                        : cell.isCurrentMonth
                        ? 'text-stone-700 dark:text-stone-300'
                        : 'text-stone-400 dark:text-stone-600'
                    }`}
                  >
                    {cell.day}
                  </span>
                </div>

                {/* Day Tasks List */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-20">
                  {dayTasks.map((t) => {
                    const priorityMeta =
                      TASK_PRIORITIES[t.priority] || TASK_PRIORITIES.MEDIUM;
                    return (
                      <div
                        key={t._id}
                        onClick={() => dispatch(openTaskDrawer(t._id))}
                        className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium cursor-pointer border hover:opacity-80 transition-opacity ${priorityMeta.badgeClass}`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
