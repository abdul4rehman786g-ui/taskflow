// src/components/ui/Skeleton.jsx
import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-stone-200 dark:bg-stone-800 rounded-xl ${className}`}
        />
      ))}
    </>
  );
};
