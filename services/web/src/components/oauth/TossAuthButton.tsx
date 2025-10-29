'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface TossAuthButtonProps {
  onConnect: () => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TossAuthButton({
  onConnect,
  isLoading = false,
  disabled = false,
  className,
}: TossAuthButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading || isConnecting) return;

    setIsConnecting(true);
    try {
      await onConnect();
    } catch (error) {
      console.error('Toss connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const buttonDisabled = disabled || isLoading || isConnecting;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={buttonDisabled}
      className={clsx(
        // Base styles
        'group relative flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold transition-all duration-200',
        // Toss brand colors (blue)
        'bg-[#0064FF] text-white',
        // Hover state
        'hover:bg-[#0052D9] hover:shadow-lg',
        // Active state
        'active:scale-[0.98]',
        // Focus state
        'focus:outline-none focus:ring-2 focus:ring-[#0064FF] focus:ring-offset-2',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0064FF] disabled:hover:shadow-none',
        className
      )}
    >
      {/* Toss Logo Icon */}
      <svg
        className={clsx(
          'h-6 w-6 transition-transform',
          isConnecting && 'animate-spin'
        )}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isConnecting ? (
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
        ) : (
          <>
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
              fill="currentColor"
            />
            <path
              d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
              fill="white"
            />
          </>
        )}
      </svg>

      {/* Button Text */}
      <span className="text-base">
        {isConnecting ? 'Toss 연결 중...' : 'Toss로 연결하기'}
      </span>

      {/* Shimmer effect on hover */}
      <div
        className={clsx(
          'absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300',
          'bg-gradient-to-r from-transparent via-white/20 to-transparent',
          'group-hover:opacity-100'
        )}
        style={{
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
    </button>
  );
}

// Note: Add this to your global CSS or Tailwind config for shimmer animation
// @keyframes shimmer {
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// }
