/**
 * Next.js Middleware for Authentication
 * 
 * This middleware protects routes that require authentication.
 * - Public routes: /, /auth/*, /api/auth/*, /api/health
 * - Protected routes: /dashboard/*, /api/* (except health and auth)
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // You can add additional logic here
    // For example, role-based access control
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Public routes
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/error',
          '/about',
        ]

        // Check if current path is public
        if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return true
        }

        // Public API routes
        const publicApiRoutes = [
          '/api/auth',
          '/api/health',
        ]

        if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
          return true
        }

        // All other routes require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  },
)

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
