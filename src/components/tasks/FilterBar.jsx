// src/components/tasks/FilterBar.jsx
import React from 'react';
import { Search, SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants.js';

export const FilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
  members = [],
}) => {
  const hasActiveFilters =
    filters.status || filters.priority || filters.assignee || filters.search;

  // Safely normalize members list with unique string IDs and labels
  const normalizedMembers = React.useMemo(() => {
    if (!Array.isArray(members)) return [];
    const seen = new Set();
    const result = [];
    for (const m of members) {
      if (!m) continue;
      const id = typeof m === 'object' ? (m._id || m.id) : m;
      if (!id || seen.has(String(id))) continue;
      seen.add(String(id));
      const name =
        typeof m === 'object'
          ? m.name || m.email || `Member ${String(id).slice(-4)}`
          : `Member ${String(id).slice(-4)}`;
      result.push({ id: String(id), name });
    }
    return result;
  }, [members]);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs mb-5">
      {/* Left: Search input + Select dropdowns */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search input */}
        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Filter tasks by name..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option key="status-all" value="">
            All Statuses
          </option>
          {Object.values(TASK_STATUSES).map((st) => (
            <option key={`status-${st.key}`} value={st.key}>
              {st.label}
            </option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option key="priority-all" value="">
            All Priorities
          </option>
          {Object.values(TASK_PRIORITIES).map((pr) => (
            <option key={`priority-${pr.key}`} value={pr.key}>
              {pr.label}
            </option>
          ))}
        </select>

        {/* Assignee filter */}
        {normalizedMembers.length > 0 && (
          <select
            value={filters.assignee || ''}
            onChange={(e) => onFilterChange('assignee', e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option key="assignee-all" value="">
              All Assignees
            </option>
            {normalizedMembers.map((m) => (
              <option key={`assignee-${m.id}`} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right: View Toggle (Kanban vs List) */}
      {onViewModeChange && (
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('kanban')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      )}
    </div>
  );
};
