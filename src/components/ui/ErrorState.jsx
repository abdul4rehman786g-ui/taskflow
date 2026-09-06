// src/components/ui/ErrorState.jsx
import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button.jsx';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading data.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm mb-4">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" icon={RotateCcw}>
          Try Again
        </Button>
      )}
    </div>
  );
};
