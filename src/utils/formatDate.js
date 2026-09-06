// src/utils/formatDate.js

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: options.includeYear ? 'numeric' : undefined,
    ...options,
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(dateString);
};

export const isDueSoon = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  return diffInDays >= 0 && diffInDays <= 3;
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};
