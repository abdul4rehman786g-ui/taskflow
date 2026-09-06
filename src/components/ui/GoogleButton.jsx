// src/components/ui/GoogleButton.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" width="18" height="18">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.96 11.96 0 000 12c0 1.93.47 3.76 1.29 5.38l3.98-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
    />
  </svg>
);

export const GoogleButton = ({ onClick, isLoading = false, label = 'Continue with Google' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700/70 active:bg-stone-100 dark:active:bg-stone-700 text-stone-700 dark:text-stone-200 font-medium text-sm px-4 py-2.5 min-h-[44px] shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <GoogleIcon />}
      {label}
    </button>
  );
};
