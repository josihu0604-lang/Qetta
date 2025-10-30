/**
 * NextAuth.js Configuration
 * 
 * Handles authentication with multiple providers:
 * - Credentials (Email/Password)
 * - Google OAuth
 * - Kakao OAuth
 * - Naver OAuth
 */

import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // ============================================
    // Credentials Provider (Email/Password)
    // ============================================
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.')
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('등록되지 않은 이메일입니다.')
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        )

        if (!isPasswordValid) {
          throw new Error('비밀번호가 올바르지 않습니다.')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),

    // ============================================
    // Google OAuth Provider
    // ============================================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // ============================================
    // Kakao OAuth Provider
    // ============================================
    {
      id: 'kakao',
      name: 'Kakao',
      type: 'oauth',
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
      authorization: {
        url: 'https://kauth.kakao.com/oauth/authorize',
        params: { scope: 'profile_nickname profile_image account_email' },
      },
      token: 'https://kauth.kakao.com/oauth/token',
      userinfo: 'https://kapi.kakao.com/v2/user/me',
      profile(profile: any) {
        return {
          id: String(profile.id),
          name: profile.kakao_account?.profile?.nickname,
          email: profile.kakao_account?.email,
          image: profile.kakao_account?.profile?.profile_image_url,
        }
      },
    },

    // ============================================
    // Naver OAuth Provider
    // ============================================
    {
      id: 'naver',
      name: 'Naver',
      type: 'oauth',
      clientId: process.env.NAVER_CLIENT_ID || '',
      clientSecret: process.env.NAVER_CLIENT_SECRET || '',
      authorization: {
        url: 'https://nid.naver.com/oauth2.0/authorize',
        params: { response_type: 'code' },
      },
      token: 'https://nid.naver.com/oauth2.0/token',
      userinfo: 'https://openapi.naver.com/v1/nid/me',
      profile(profile: any) {
        return {
          id: profile.response.id,
          name: profile.response.name,
          email: profile.response.email,
          image: profile.response.profile_image,
        }
      },
    },
  ],

  // ============================================
  // Session Configuration
  // ============================================
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ============================================
  // JWT Configuration
  // ============================================
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ============================================
  // Pages Configuration
  // ============================================
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/welcome',
  },

  // ============================================
  // Callbacks
  // ============================================
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      // OAuth sign in
      if (account) {
        token.provider = account.provider
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }

      return session
    },

    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider !== 'credentials') {
        return true
      }

      // For credentials, user is already verified in authorize()
      return true
    },
  },

  // ============================================
  // Events
  // ============================================
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`✅ User signed in: ${user.email} (${account?.provider})`)
      if (isNewUser) {
        console.log(`🎉 New user created: ${user.email}`)
      }
    },
    async signOut({ token }) {
      console.log(`👋 User signed out: ${token.email}`)
    },
  },

  // ============================================
  // Debug (only in development)
  // ============================================
  debug: process.env.NODE_ENV === 'development',
}
