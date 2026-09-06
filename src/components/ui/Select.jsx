// src/components/ui/Select.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  className = '',
  id,
  placeholder = 'Select option...',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none rounded-xl border bg-white dark:bg-stone-900 px-3.5 py-2 pr-9 text-sm text-stone-900 dark:text-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-stone-200 dark:border-stone-800'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option key="select-placeholder-option" value="">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={String(opt.value || opt.label)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};
