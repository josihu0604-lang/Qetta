'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface KFTCAuthButtonProps {
  onConnect: () => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function KFTCAuthButton({
  onConnect,
  isLoading = false,
  disabled = false,
  className,
}: KFTCAuthButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading || isConnecting) return;

    setIsConnecting(true);
    try {
      await onConnect();
    } catch (error) {
      console.error('KFTC connection error:', error);
    } finally {
      // Note: For KFTC redirect flow, this will never execute
      // because the page redirects to KFTC authorization URL
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
        // KFTC brand colors (green)
        'bg-[#00A86B] text-white',
        // Hover state
        'hover:bg-[#008C5A] hover:shadow-lg',
        // Active state
        'active:scale-[0.98]',
        // Focus state
        'focus:outline-none focus:ring-2 focus:ring-[#00A86B] focus:ring-offset-2',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#00A86B] disabled:hover:shadow-none',
        className
      )}
    >
      {/* KFTC Bank Icon */}
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
            {/* Bank building icon */}
            <path
              d="M12 3L2 8v2h20V8l-10-5z"
              fill="currentColor"
            />
            <path
              d="M4 10v8h3v-8H4zm6 0v8h4v-8h-4zm10 0v8h-3v-8h3z"
              fill="currentColor"
            />
            <path
              d="M2 19h20v2H2v-2z"
              fill="currentColor"
            />
          </>
        )}
      </svg>

      {/* Button Text */}
      <span className="text-base">
        {isConnecting ? '오픈뱅킹 인증 중...' : '오픈뱅킹으로 연결하기'}
      </span>

      {/* Badge - "금융위원회 인증" */}
      <div className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-[#00A86B] shadow-md">
        금융위 인증
      </div>

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

// Features Info Component
export function KFTCFeatureList() {
  const features = [
    {
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: '계좌 정보 자동 조회',
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: '거래 내역 실시간 수집',
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      text: '금융위원회 보안 인증',
    },
  ];

  return (
    <div className="mt-4 space-y-2">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2 text-sm text-zinc-600">
          <span className="text-[#00A86B]">{feature.icon}</span>
          <span>{feature.text}</span>
        </div>
      ))}
    </div>
  );
}
