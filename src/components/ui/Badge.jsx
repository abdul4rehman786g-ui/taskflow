// src/components/ui/Badge.jsx
import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor = 'bg-stone-400',
  className = '',
}) => {
  const variants = {
    default: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    blue: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    red: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/60',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full whitespace-nowrap ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${dotColor}`} />
      )}
      {children}
    </span>
  );
};
