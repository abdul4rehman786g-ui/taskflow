// src/components/ui/Textarea.jsx
import React from 'react';

export const Textarea = ({
  label,
  error,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full rounded-xl border bg-white dark:bg-stone-900 px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-stone-200 dark:border-stone-800'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};
