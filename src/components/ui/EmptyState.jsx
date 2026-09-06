// src/components/ui/EmptyState.jsx
import React from 'react';
import { Button } from './Button.jsx';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400 mb-3 shadow-xs">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
