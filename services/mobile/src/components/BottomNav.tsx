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
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group relative flex flex-1 flex-col items-center justify-center py-2 text-center transition-all duration-200',
                'min-h-[60px] active:scale-95',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon with scale animation */}
              <span 
                className={clsx(
                  'text-2xl transition-transform duration-200',
                  isActive && 'scale-110'
                )} 
                role="img" 
                aria-label={item.label}
              >
                {isActive ? item.activeIcon : item.icon}
              </span>
              
              {/* Label */}
              <span 
                className={clsx(
                  'mt-1 text-xs font-medium transition-all',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}
              >
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 h-1 w-12 animate-fade-in rounded-t-full bg-blue-600 dark:bg-blue-400" />
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 -z-10 rounded-lg bg-gray-100 opacity-0 transition-opacity group-hover:opacity-50 dark:bg-gray-800" />
            </Link>
          );
        })}
      </div>
      
      {/* Safe area padding for iOS */}
      <div className="h-safe-bottom bg-white dark:bg-gray-900" />
    </nav>
  );
}
