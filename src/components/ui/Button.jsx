// src/components/ui/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-600/20 focus:ring-emerald-500 border border-emerald-700/20',
    secondary:
      'bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 shadow-sm focus:ring-stone-400',
    ghost:
      'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 active:bg-stone-200 dark:active:bg-stone-700 focus:ring-stone-400',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20 focus:ring-red-500 border border-red-700/20',
    outline:
      'border border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[32px]',
    md: 'px-4 py-2 text-sm gap-2 min-h-[38px]',
    lg: 'px-5 py-2.5 text-base gap-2.5 min-h-[44px]',
    icon: 'p-2 w-9 h-9 min-h-[36px]',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {!isLoading && IconRight ? <IconRight className="w-4 h-4 shrink-0" /> : null}
    </button>
  );
};
