import { type Metadata, type Viewport } from 'next'
import { Inter } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { Providers } from '@/components/Providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Next.js 15: Separate viewport export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#2563eb' },
  ],
}

export const metadata: Metadata = {
  title: {
    template: '%s - Hephaitos',
    default: 'Hephaitos - 스마트 금융 관리',
  },
  description:
    'AI 기반 맞춤형 금융 관리 및 정책 추천 서비스. 부채 분석, 계좌 통합, 정부 지원 정책 추천을 한 곳에서.',
  keywords: ['금융관리', '부채분석', '정책추천', 'AI금융', '자산관리', '대출관리'],
  authors: [{ name: 'Hephaitos Team' }],
  creator: 'Hephaitos',
  publisher: 'Hephaitos',
  applicationName: 'Hephaitos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hephaitos',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={clsx('bg-gray-50 antialiased', inter.variable)}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hephaitos" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
