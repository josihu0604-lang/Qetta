/**
 * Bottom Navigation Bar Component
 * 
 * Persistent mobile navigation with 4 main sections.
 * Optimized for thumb-friendly mobile interaction.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: '홈',
    icon: '🏠',
    activeIcon: '🏠',
  },
  {
    href: '/accounts',
    label: '계좌',
    icon: '💳',
    activeIcon: '💳',
  },
  {
    href: '/debt-analysis',
    label: '부채분석',
    icon: '📊',
    activeIcon: '📊',
  },
  {
    href: '/policy-recommendation',
    label: '정책',
    icon: '🎯',
    activeIcon: '🎯',
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-1 flex-col items-center justify-center py-2 text-center transition-colors',
                'min-h-[56px] active:bg-gray-100 dark:active:bg-gray-800',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              <span className="text-2xl" role="img" aria-label={item.label}>
                {isActive ? item.activeIcon : item.icon}
              </span>
              <span className="mt-1 text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 h-1 w-12 rounded-t-full bg-primary-600 dark:bg-primary-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
