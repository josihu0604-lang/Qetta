/**
 * React Query Client Configuration
 * 
 * Global query client with default options for caching and retries.
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Retry delay: exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in production only
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Show error by default
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
