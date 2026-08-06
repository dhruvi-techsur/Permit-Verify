import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button';
}

const variantClasses: Record<string, string> = {
  text: 'h-4 w-full',
  title: 'h-6 w-1/3',
  avatar: 'h-10 w-10 rounded-full',
  card: 'h-24 w-full rounded-lg',
  button: 'h-10 w-32 rounded-md',
};

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={['skeleton-shimmer', variantClasses[variant], className].join(' ')}
    />
  );
}
