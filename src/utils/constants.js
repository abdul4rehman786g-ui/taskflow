// src/utils/constants.js

export const TASK_STATUSES = {
  TODO: {
    key: 'TODO',
    label: 'To Do',
    color: 'stone',
    badgeClass: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    dotClass: 'bg-stone-400',
  },
  IN_PROGRESS: {
    key: 'IN_PROGRESS',
    label: 'In Progress',
    color: 'blue',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    dotClass: 'bg-blue-500',
  },
  REVIEW: {
    key: 'REVIEW',
    label: 'Under Review',
    color: 'purple',
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    dotClass: 'bg-purple-500',
  },
  COMPLETED: {
    key: 'COMPLETED',
    label: 'Completed',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    dotClass: 'bg-emerald-500',
  },
};

export const TASK_PRIORITIES = {
  LOW: {
    key: 'LOW',
    label: 'Low',
    color: 'stone',
    badgeClass: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700',
    dotClass: 'bg-stone-400',
  },
  MEDIUM: {
    key: 'MEDIUM',
    label: 'Medium',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    dotClass: 'bg-amber-500',
  },
  HIGH: {
    key: 'HIGH',
    label: 'High',
    color: 'orange',
    badgeClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800/60',
    dotClass: 'bg-orange-500',
  },
  URGENT: {
    key: 'URGENT',
    label: 'Urgent',
    color: 'red',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800/60',
    dotClass: 'bg-red-500',
  },
};

export const PROJECT_STATUSES = {
  PLANNING: {
    label: 'Planning',
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  ACTIVE: {
    label: 'Active',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  ON_HOLD: {
    label: 'On Hold',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  COMPLETED: {
    label: 'Completed',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
};
