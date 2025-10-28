/**
 * Pull-to-Refresh Component
 * 
 * Mobile-native pull-to-refresh functionality.
 * Uses CSS transforms for smooth animations.
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import clsx from 'clsx';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 80;
  const MAX_PULL = 150;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only allow pull-to-refresh at the top of the page
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
      setCanPull(true);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!canPull || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;

      if (distance > 0 && window.scrollY === 0) {
        // Prevent default scroll behavior
        e.preventDefault();
        
        // Apply diminishing returns for natural feel
        const adjustedDistance = Math.min(
          distance * 0.5,
          MAX_PULL
        );
        setPullDistance(adjustedDistance);
      }
    },
    [canPull, isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!canPull) return;

    setCanPull(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [canPull, pullDistance, isRefreshing, onRefresh, PULL_THRESHOLD]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const showRefreshIndicator = pullDistance > 0 || isRefreshing;
  const indicatorRotation = Math.min(pullDistance / PULL_THRESHOLD, 1) * 360;

  return (
    <div ref={containerRef} className="relative">
      {/* Refresh Indicator */}
      <div
        className={clsx(
          'absolute left-0 right-0 top-0 flex justify-center transition-opacity',
          showRefreshIndicator ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          transform: `translateY(${pullDistance - 40}px)`,
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800">
          {isRefreshing ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent dark:border-primary-400" />
          ) : (
            <div
              className="text-xl transition-transform"
              style={{ transform: `rotate(${indicatorRotation}deg)` }}
            >
              ↓
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
