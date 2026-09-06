// src/components/ui/Avatar.jsx
import React from 'react';

const PALETTE = [
  'bg-emerald-600 text-white',
  'bg-blue-600 text-white',
  'bg-purple-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-indigo-600 text-white',
  'bg-teal-600 text-white',
];

export const Avatar = ({
  name = 'User',
  src,
  size = 'md',
  className = '',
}) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getHashColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return PALETTE[Math.abs(hash) % PALETTE.length];
  };

  const sizes = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm font-semibold',
    xl: 'w-12 h-12 text-base font-semibold',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover shrink-0 border border-stone-200 dark:border-stone-800 ${sizes[size] || sizes.md} ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      title={name}
      className={`rounded-full flex items-center justify-center font-medium shrink-0 select-none shadow-xs border border-white/20 ${
        sizes[size] || sizes.md
      } ${getHashColor(name)} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
