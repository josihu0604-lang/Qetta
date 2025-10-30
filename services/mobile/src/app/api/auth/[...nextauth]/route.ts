/**
 * NextAuth.js API Route Handler
 * 
 * This route handles all authentication requests:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/[provider]
 * - /api/auth/csrf
 * - /api/auth/session
 * - /api/auth/providers
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/config'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
