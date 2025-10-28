/**
 * Loading Spinner Component
 * 
 * Reusable loading indicator for async operations.
 */

import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

export function LoadingSpinner({ 
  size = 'md', 
  className,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={clsx(
        'animate-spin rounded-full border-primary-600 border-t-transparent dark:border-primary-400',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        {spinner}
      </div>
    );
  }

  return spinner;
}
