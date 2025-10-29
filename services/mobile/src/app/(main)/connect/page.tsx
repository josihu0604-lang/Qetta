'use client';

import { TossAuthButton } from '@/components/oauth/TossAuthButton';
import { KFTCAuthButton, KFTCFeatureList } from '@/components/oauth/KFTCAuthButton';
import { useOAuth } from '@/hooks/useOAuth';
import { Container } from '@/components/Container';

export default function ConnectPage() {
  const { connectToss, connectKFTC, connections, isLoading } = useOAuth();

  const isTossConnected = connections.some((c) => c.provider === 'toss');
  const isKFTCConnected = connections.some((c) => c.provider === 'kftc');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            금융 계좌 연결
          </h1>
          <p className="mt-2 text-gray-600">
            채무 분석을 위해 금융 계좌를 연결해주세요
          </p>
        </div>

        {/* Connection Status */}
        {(isTossConnected || isKFTCConnected) && (
          <div className="mb-6 rounded-lg bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">연결 완료</p>
                <p className="text-sm text-green-700">
                  {isTossConnected && 'Toss'}{isTossConnected && isKFTCConnected && ', '}
                  {isKFTCConnected && '오픈뱅킹'} 계정이 연결되었습니다
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Connection Cards */}
        <div className="space-y-6">
          {/* Toss Card */}
          <div className="rounded-lg border-2 border-gray-200 bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                  <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Toss</h2>
                  <p className="text-sm text-gray-600">간편 금융 서비스</p>
                </div>
              </div>
              {isTossConnected && (
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  연결됨
                </span>
              )}
            </div>

            <p className="mb-4 text-sm text-gray-700">
              Toss 앱에서 사용하는 계좌 정보를 자동으로 불러옵니다.
            </p>

            <TossAuthButton
              onConnect={connectToss}
              isLoading={isLoading}
              disabled={isTossConnected}
              className="w-full"
            />
          </div>

          {/* KFTC Card */}
          <div className="rounded-lg border-2 border-gray-200 bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
                  <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L2 8v2h20V8l-10-5z" />
                    <path d="M4 10v8h3v-8H4zm6 0v8h4v-8h-4zm10 0v8h-3v-8h3z" />
                    <path d="M2 19h20v2H2v-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">오픈뱅킹</h2>
                  <p className="text-sm text-gray-600">금융위원회 인증</p>
                </div>
              </div>
              {isKFTCConnected && (
                <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                  연결됨
                </span>
              )}
            </div>

            <p className="mb-4 text-sm text-gray-700">
              은행, 증권, 카드 등 모든 금융사 계좌를 한번에 연결합니다.
            </p>

            <KFTCAuthButton
              onConnect={connectKFTC}
              isLoading={isLoading}
              disabled={isKFTCConnected}
              className="w-full"
            />

            <KFTCFeatureList />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <div className="flex gap-3">
            <svg className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900">안전한 연결</h3>
              <p className="mt-1 text-sm text-blue-800">
                모든 금융 정보는 AES-256 암호화로 보호되며, 금융위원회 보안 기준을 준수합니다.
                계좌 정보는 채무 분석 목적으로만 사용되며, 절대 제3자와 공유되지 않습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Next Step */}
        {(isTossConnected || isKFTCConnected) && (
          <div className="mt-8 text-center">
            <button
              className="w-full rounded-lg bg-blue-600 px-8 py-4 font-bold text-white shadow hover:bg-blue-700"
              onClick={() => window.location.href = '/dashboard'}
            >
              다음 단계로 →
            </button>
            <p className="mt-3 text-sm text-gray-600">
              계좌 정보를 불러와 채무 분석을 시작합니다
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
