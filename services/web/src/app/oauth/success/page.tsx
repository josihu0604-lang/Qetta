'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const providerName = provider === 'toss' ? 'Toss' : provider === 'kftc' ? '오픈뱅킹' : provider;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Success Icon */}
          <div className="flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 py-12">
            <div className="relative">
              {/* Animated Circle */}
              <div className="absolute inset-0 animate-ping rounded-full bg-white/30" />
              
              {/* Checkmark Icon */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-zinc-900">
              연결 완료!
            </h1>
            
            <p className="mt-4 text-lg text-zinc-600">
              <span className="font-semibold text-green-600">{providerName}</span> 계정이
              성공적으로 연결되었습니다.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-3 rounded-xl bg-green-50 p-6">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-left text-sm text-zinc-700">
                  계좌 정보와 거래 내역을 자동으로 수집합니다
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-left text-sm text-zinc-700">
                  AI 기반 채무 분석을 시작할 수 있습니다
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-left text-sm text-zinc-700">
                  맞춤형 채무조정 방안을 추천받을 수 있습니다
                </p>
              </div>
            </div>

            {/* Countdown */}
            <div className="mt-8">
              <p className="text-sm text-zinc-500">
                <span className="font-semibold text-green-600">{countdown}초</span> 후 대시보드로
                이동합니다...
              </p>
            </div>

            {/* Manual Navigation Button */}
            <button
              onClick={() => router.push('/dashboard')}
              className={clsx(
                'mt-6 w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-all',
                'hover:bg-green-700 hover:shadow-lg',
                'active:scale-[0.98]',
                'focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2'
              )}
            >
              지금 바로 시작하기
            </button>

            {/* Back to Home Link */}
            <button
              onClick={() => router.push('/')}
              className="mt-4 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-600">
          <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>AES-256 암호화로 안전하게 보호됩니다</span>
        </div>
      </div>
    </div>
  );
}

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
