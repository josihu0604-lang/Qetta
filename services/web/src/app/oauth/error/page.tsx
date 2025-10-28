'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');
  const error = searchParams.get('error');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const providerName = provider === 'toss' ? 'Toss' : provider === 'kftc' ? '오픈뱅킹' : provider;

  // Parse error message for user-friendly display
  const getErrorDetails = () => {
    if (!error) return { title: '알 수 없는 오류', description: '연결 중 문제가 발생했습니다.' };

    const errorLower = error.toLowerCase();

    if (errorLower.includes('timeout') || errorLower.includes('time out')) {
      return {
        title: '시간 초과',
        description: '요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요.',
      };
    }

    if (errorLower.includes('csrf') || errorLower.includes('state')) {
      return {
        title: '보안 검증 실패',
        description: '보안 토큰이 일치하지 않습니다. 다시 시도해주세요.',
      };
    }

    if (errorLower.includes('token') || errorLower.includes('authentication')) {
      return {
        title: '인증 실패',
        description: '인증 과정에서 문제가 발생했습니다. 다시 로그인해주세요.',
      };
    }

    if (errorLower.includes('network') || errorLower.includes('fetch')) {
      return {
        title: '네트워크 오류',
        description: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
      };
    }

    return {
      title: '연결 실패',
      description: error,
    };
  };

  const { title, description } = getErrorDetails();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 px-4">
      <div className="w-full max-w-md">
        {/* Error Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Error Icon */}
          <div className="flex items-center justify-center bg-gradient-to-br from-red-500 to-rose-600 py-12">
            <div className="relative">
              {/* Animated Circle */}
              <div className="absolute inset-0 animate-ping rounded-full bg-white/30" />
              
              {/* X Icon */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white">
                <svg
                  className="h-12 w-12 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-zinc-900">
              {title}
            </h1>
            
            <p className="mt-4 text-lg text-zinc-600">
              <span className="font-semibold text-red-600">{providerName}</span> 계정
              연결에 실패했습니다.
            </p>

            {/* Error Details */}
            <div className="mt-6 rounded-xl bg-red-50 p-4">
              <p className="text-sm text-zinc-700">
                {description}
              </p>
            </div>

            {/* Troubleshooting Steps */}
            <div className="mt-8 space-y-3 rounded-xl bg-zinc-50 p-6 text-left">
              <h3 className="font-semibold text-zinc-900">해결 방법:</h3>
              
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
                  1
                </span>
                <p className="text-sm text-zinc-700">
                  브라우저를 새로고침하고 다시 시도해보세요
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
                  2
                </span>
                <p className="text-sm text-zinc-700">
                  인터넷 연결 상태를 확인해주세요
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
                  3
                </span>
                <p className="text-sm text-zinc-700">
                  {providerName} 서비스 상태를 확인해주세요
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
                  4
                </span>
                <p className="text-sm text-zinc-700">
                  문제가 계속되면 고객센터로 문의해주세요
                </p>
              </div>
            </div>

            {/* Countdown */}
            <div className="mt-8">
              <p className="text-sm text-zinc-500">
                <span className="font-semibold text-red-600">{countdown}초</span> 후 홈으로
                이동합니다...
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.back()}
                className={clsx(
                  'w-full rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition-all',
                  'hover:bg-red-700 hover:shadow-lg',
                  'active:scale-[0.98]',
                  'focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2'
                )}
              >
                다시 시도하기
              </button>

              <button
                onClick={() => router.push('/')}
                className={clsx(
                  'w-full rounded-xl border-2 border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 transition-all',
                  'hover:border-zinc-400 hover:bg-zinc-50',
                  'active:scale-[0.98]',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2'
                )}
              >
                홈으로 돌아가기
              </button>
            </div>

            {/* Contact Support Link */}
            <button
              onClick={() => router.push('/support')}
              className="mt-4 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              고객센터 문의하기
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-zinc-600">
          <p>
            문제가 지속되면{' '}
            <a href="mailto:support@hephaitos.com" className="font-semibold text-red-600 hover:underline">
              support@hephaitos.com
            </a>
            {' '}으로 문의해주세요
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OAuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
