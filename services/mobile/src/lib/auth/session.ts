/**
 * Session Management Utilities
 * 
 * Helper functions for working with NextAuth sessions in API routes
 */

import { getServerSession } from 'next-auth/next'
import { authOptions } from './config'
import { NextRequest } from 'next/server'

/**
 * Get current user session
 * @returns User session or null if not authenticated
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions)
}

/**
 * Get current authenticated user
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getCurrentSession()
  return session?.user || null
}

/**
 * Require authentication for API routes
 * @throws Error if user is not authenticated
 * @returns User object
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Unauthorized: Authentication required')
  }
  
  return user
}

/**
 * Get user ID from session
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.id || null
}

/**
 * Check if user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Extract bearer token from request headers
 * @param request NextRequest object
 * @returns Token string or null
 */
export function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7)
}

/**
 * Create authentication error response
 * @param message Error message
 * @param status HTTP status code
 * @returns Response object
 */
export function createAuthError(message: string = 'Unauthorized', status: number = 401) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
