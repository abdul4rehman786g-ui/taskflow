// src/components/ui/Progress.jsx
import React from 'react';

export const Progress = ({
  value = 0,
  max = 100,
  color = 'bg-emerald-500',
  height = 'h-1.5',
  className = '',
  showLabel = false,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-stone-500 dark:text-stone-400 mb-1 font-medium">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
