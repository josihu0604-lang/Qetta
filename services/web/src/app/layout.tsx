import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'QETTA - 채무조정 자동화 플랫폼',
  description: 'AI 기반 채무조정 자동화 플랫폼. 간편한 OAuth 연동으로 금융 데이터를 수집하고, 맞춤형 채무조정 방안을 제시합니다.',
  keywords: ['채무조정', '개인회생', '신용회복', '새출발기금', 'QETTA'],
  openGraph: {
    title: 'QETTA - 채무조정 자동화 플랫폼',
    description: 'AI 기반 채무조정 자동화 플랫폼',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
