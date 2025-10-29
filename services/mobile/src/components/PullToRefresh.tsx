/**
 * Pull to Refresh Component
 * 
 * Mobile-optimized pull-to-refresh interaction
 * Works with touch events for smooth user experience
 */

'use client';

import { ReactNode, useState, useRef, useCallback } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || refreshing) return;
    
    // Only trigger if scrolled to top
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, [disabled, refreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling || disabled || refreshing) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;
    
    // Only allow pull down
    if (distance > 0) {
      // Resistance effect: slower pull the further you go
      const resistance = 0.5;
      const adjustedDistance = distance * resistance;
      setPullDistance(Math.min(adjustedDistance, threshold * 1.5));
    }
  }, [pulling, disabled, refreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling || disabled) return;
    
    setPulling(false);
    
    if (pullDistance >= threshold) {
      setRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pulling, disabled, pullDistance, threshold, onRefresh]);

  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div
      ref={containerRef}
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull Indicator */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{
          height: refreshing ? '60px' : `${pullDistance}px`,
          opacity: pulling || refreshing ? 1 : 0,
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          {/* Spinner or Icon */}
          {refreshing ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent" />
          ) : (
            <div
              className="transition-transform duration-200"
              style={{
                transform: shouldTrigger ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          )}
          
          {/* Text */}
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {refreshing
              ? '새로고침 중...'
              : shouldTrigger
              ? '놓아서 새로고침'
              : '당겨서 새로고침'}
          </span>
          
          {/* Progress Bar */}
          {!refreshing && (
            <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-blue-600 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: pulling || refreshing ? `translateY(${Math.min(pullDistance, 60)}px)` : 'translateY(0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
