/**
 * Profile Page - 사용자 프로필 및 설정
 * 
 * Features:
 * - 사용자 정보
 * - 연결된 계좌 요약
 * - 앱 설정
 * - 로그아웃
 */

'use client';

import {
  Heading,
  Text,
  Badge,
  Button,
  Divider,
} from '@hephaitos/ui';
import { useState } from 'react';

const mockUserData = {
  name: '김헤파이스토스',
  email: 'user@hephaitos.com',
  phone: '010-1234-5678',
  memberSince: '2024.10',
  tier: 'Premium',
  connectedAccounts: 8,
  totalAssets: 45_800_000,
  creditScore: 820,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      // TODO: Implement logout logic
      alert('로그아웃되었습니다.');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // TODO: Implement account deletion
      alert('계정 삭제는 고객센터를 통해 진행해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-4 pb-8 pt-8 text-white">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl backdrop-blur-sm">
            👤
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <Heading className="text-white">{mockUserData.name}</Heading>
            <Text className="mt-1 text-sm opacity-90">{mockUserData.email}</Text>
            <div className="mt-2 flex items-center space-x-2">
              <Badge color="zinc" className="bg-white/20 text-white">
                {mockUserData.tier}
              </Badge>
              <Text className="text-xs opacity-75">
                가입일: {mockUserData.memberSince}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="-mt-6 px-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-white p-3 text-center shadow-sm dark:bg-gray-900">
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {mockUserData.connectedAccounts}
            </Text>
            <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              연결 계좌
            </Text>
          </div>
          <div className="rounded-lg bg-white p-3 text-center shadow-sm dark:bg-gray-900">
            <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mockUserData.creditScore}
            </Text>
            <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              신용점수
            </Text>
          </div>
          <div className="rounded-lg bg-white p-3 text-center shadow-sm dark:bg-gray-900">
            <Text className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {Math.round(mockUserData.totalAssets / 10000)}만
            </Text>
            <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              총 자산
            </Text>
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          계정 관리
        </Heading>
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900">
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👤</span>
              <div>
                <Text className="font-medium">개인정보 수정</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  이름, 이메일, 전화번호
                </Text>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <Divider />
          
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔒</span>
              <div>
                <Text className="font-medium">보안 설정</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  비밀번호 변경, 2단계 인증
                </Text>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <Divider />
          
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💳</span>
              <div>
                <Text className="font-medium">연결된 계좌 관리</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {mockUserData.connectedAccounts}개 계좌 연결됨
                </Text>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* App Settings */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          앱 설정
        </Heading>
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔔</span>
              <div>
                <Text className="font-medium">알림</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  푸시 알림 수신
                </Text>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <Divider />
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌙</span>
              <div>
                <Text className="font-medium">다크 모드</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  어두운 테마 사용
                </Text>
              </div>
            </div>
            <button
              onClick={() => setDarkModeEnabled(!darkModeEnabled)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                darkModeEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  darkModeEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <Divider />
          
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌐</span>
              <div>
                <Text className="font-medium">언어</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  한국어
                </Text>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* Support */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          고객 지원
        </Heading>
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900">
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">❓</span>
              <Text className="font-medium">자주 묻는 질문</Text>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <Divider />
          
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💬</span>
              <Text className="font-medium">1:1 문의</Text>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <Divider />
          
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📄</span>
              <Text className="font-medium">약관 및 정책</Text>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* Logout & Delete Account */}
      <div className="mt-6 px-4 pb-6">
        <Button 
          className="w-full" 
          outline
          onClick={handleLogout}
        >
          로그아웃
        </Button>
        
        <button
          onClick={handleDeleteAccount}
          className="mt-3 w-full py-3 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
        >
          계정 삭제
        </button>
        
        <div className="mt-6 text-center">
          <Text className="text-xs text-gray-500 dark:text-gray-500">
            Hephaitos v1.0.0
          </Text>
          <Text className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            © 2024 Hephaitos. All rights reserved.
          </Text>
        </div>
      </div>
    </div>
  );
}
