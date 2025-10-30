/**
 * NextAuth.js TypeScript Type Definitions
 * 
 * Extends default NextAuth types to include custom user properties
 */

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Returned by useSession, getSession and getServerSession
   */
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
    } & DefaultSession['user']
  }

  /**
   * Returned by callbacks.jwt and callbacks.session
   */
  interface User extends DefaultUser {
    id: string
    email: string
    name: string
    image?: string
  }
}

declare module 'next-auth/jwt' {
  /**
   * Returned by the jwt callback and getToken
   */
  interface JWT extends DefaultJWT {
    id: string
    email: string
    name: string
    picture?: string
    provider?: string
  }
}
