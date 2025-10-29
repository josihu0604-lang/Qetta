'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type OAuthProvider = 'toss' | 'kftc';

export interface OAuthConnection {
  id: string;
  provider: OAuthProvider;
  connectedAt: string;
  expiresAt: string | null;
}

export interface UseOAuthReturn {
  connections: OAuthConnection[];
  isLoading: boolean;
  error: string | null;
  connectToss: () => Promise<void>;
  connectKFTC: () => Promise<void>;
  disconnect: (provider: OAuthProvider) => Promise<void>;
  refreshConnections: () => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useOAuth(): UseOAuthReturn {
  const router = useRouter();
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch OAuth connections from API
   */
  const refreshConnections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/oauth/connections`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add JWT token from auth context
          // 'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch connections: ${response.statusText}`);
      }

      const data = await response.json();
      setConnections(data.connections || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Error fetching OAuth connections:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Connect to Toss Auth API
   * Uses Client Credentials Grant (server-side token issuance)
   */
  const connectToss = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/oauth/toss/token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add JWT token
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Toss connection failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Refresh connections to show the new connection
      await refreshConnections();
      
      // Navigate to success page
      router.push('/oauth/success?provider=toss');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Error connecting to Toss:', err);
      router.push(`/oauth/error?provider=toss&error=${encodeURIComponent(message)}`);
    } finally {
      setIsLoading(false);
    }
  }, [router, refreshConnections]);

  /**
   * Connect to KFTC OpenBanking
   * Uses Authorization Code Grant (OAuth 2.0 redirect flow)
   */
  const connectKFTC = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Redirect to KFTC authorization URL
      // The API will generate state parameter and redirect to KFTC
      window.location.href = `${API_BASE_URL}/api/v1/oauth/kftc/authorize`;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Error initiating KFTC connection:', err);
      router.push(`/oauth/error?provider=kftc&error=${encodeURIComponent(message)}`);
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Disconnect OAuth provider
   */
  const disconnect = useCallback(async (provider: OAuthProvider) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/oauth/${provider}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add JWT token
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to disconnect ${provider}: ${response.statusText}`);
      }

      // Refresh connections to remove the disconnected one
      await refreshConnections();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error(`Error disconnecting ${provider}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshConnections]);

  return {
    connections,
    isLoading,
    error,
    connectToss,
    connectKFTC,
    disconnect,
    refreshConnections,
  };
}
