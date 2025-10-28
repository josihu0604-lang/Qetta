import { FastifyInstance } from 'fastify';
import { TossAuthClient } from '../services/oauth/TossAuthClient';
import { KFTCAuthClient } from '../services/oauth/KFTCAuthClient';
import { prisma } from '../config/database';
import { cache } from '../config/redis';
import { encrypt } from '@qetta/shared';
import { logger } from '@qetta/shared';
import crypto from 'crypto';

/**
 * OAuth 라우트
 * Toss 인증 API + KFTC OpenBanking OAuth 2.0
 */

export async function oauthRoutes(app: FastifyInstance) {
  const tossClient = new TossAuthClient();
  const kftcClient = new KFTCAuthClient();

  // ========================================
  // Toss 인증 API
  // ========================================

  /**
   * GET /oauth/toss/token
   * Toss Access Token 발급 (Client Credentials)
   */
  app.get('/oauth/toss/token', async (req, reply) => {
    try {
      const { userId } = req.query as { userId: string };

      if (!userId) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'userId is required',
        });
      }

      // Toss 토큰 발급
      const tokenData = await tossClient.getAccessToken();

      // DB에 암호화 저장
      const connection = await prisma.oAuthConnection.upsert({
        where: {
          userId_provider: {
            userId,
            provider: 'toss',
          },
        },
        create: {
          userId,
          provider: 'toss',
          accessToken: encrypt(tokenData.access_token),
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          lastSyncAt: new Date(),
        },
        update: {
          accessToken: encrypt(tokenData.access_token),
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          lastSyncAt: new Date(),
        },
      });

      // Redis 캐싱 (TTL: expires_in)
      await cache.set(
        `oauth:${userId}:toss`,
        { accessToken: tokenData.access_token },
        tokenData.expires_in
      );

      logger.info('Toss token issued and saved', { userId });

      return reply.send({
        success: true,
        provider: 'toss',
        expiresIn: tokenData.expires_in,
      });
    } catch (error) {
      logger.error('Error issuing Toss token', error);
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to issue Toss token',
      });
    }
  });

  // ========================================
  // KFTC OpenBanking OAuth
  // ========================================

  /**
   * GET /oauth/kftc/authorize
   * KFTC OAuth 인증 시작 (사용자를 KFTC 로그인 페이지로 리다이렉트)
   */
  app.get('/oauth/kftc/authorize', async (req, reply) => {
    try {
      const { userId } = req.query as { userId: string };

      if (!userId) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'userId is required',
        });
      }

      // State 생성 (CSRF 방지)
      const state = crypto.randomBytes(16).toString('hex');

      // State를 Redis에 저장 (5분 TTL)
      await cache.set(`oauth:state:${state}`, { userId }, 300);

      // KFTC 인증 URL 생성
      const authUrl = kftcClient.getAuthorizationUrl(state);

      logger.info('KFTC authorization URL generated', { userId, state });

      // 리다이렉트
      return reply.redirect(302, authUrl);
    } catch (error) {
      logger.error('Error generating KFTC authorization URL', error);
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to generate authorization URL',
      });
    }
  });

  /**
   * GET /oauth/kftc/callback
   * KFTC OAuth 콜백 (Authorization Code 수신 → Token 교환)
   */
  app.get('/oauth/kftc/callback', async (req, reply) => {
    try {
      const { code, state, error: oauthError } = req.query as {
        code?: string;
        state?: string;
        error?: string;
      };

      // OAuth 에러 처리
      if (oauthError) {
        logger.error('KFTC OAuth error', { error: oauthError });
        return reply.redirect(
          `${process.env.FRONTEND_URL}/oauth/error?error=${oauthError}`
        );
      }

      if (!code || !state) {
        logger.error('Missing code or state in KFTC callback');
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'code and state are required',
        });
      }

      // State 검증
      const stateData = await cache.get<{ userId: string }>(`oauth:state:${state}`);
      if (!stateData) {
        logger.error('Invalid or expired state', { state });
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid or expired state',
        });
      }

      const { userId } = stateData;

      // State 삭제 (일회용)
      await cache.del(`oauth:state:${state}`);

      // Authorization Code → Access Token 교환
      const tokenData = await kftcClient.exchangeCodeForToken(code);

      // DB에 암호화 저장
      const connection = await prisma.oAuthConnection.upsert({
        where: {
          userId_provider: {
            userId,
            provider: 'kftc',
          },
        },
        create: {
          userId,
          provider: 'kftc',
          accessToken: encrypt(tokenData.access_token),
          refreshToken: encrypt(tokenData.refresh_token),
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          userSeqNo: encrypt(tokenData.user_seq_no),
          lastSyncAt: new Date(),
        },
        update: {
          accessToken: encrypt(tokenData.access_token),
          refreshToken: encrypt(tokenData.refresh_token),
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          userSeqNo: encrypt(tokenData.user_seq_no),
          lastSyncAt: new Date(),
        },
      });

      // Redis 캐싱 (TTL: expires_in)
      await cache.set(
        `oauth:${userId}:kftc`,
        {
          accessToken: tokenData.access_token,
          userSeqNo: tokenData.user_seq_no,
        },
        tokenData.expires_in
      );

      logger.info('KFTC OAuth connection saved', { userId });

      // 프론트엔드로 리다이렉트 (성공)
      return reply.redirect(`${process.env.FRONTEND_URL}/oauth/success?provider=kftc`);
    } catch (error) {
      logger.error('Error in KFTC OAuth callback', error);
      return reply.redirect(
        `${process.env.FRONTEND_URL}/oauth/error?error=callback_failed`
      );
    }
  });

  /**
   * GET /oauth/connections
   * 사용자의 OAuth 연결 목록 조회
   */
  app.get('/oauth/connections', async (req, reply) => {
    try {
      // TODO: JWT 인증 미들웨어 추가 후 req.user.id 사용
      const { userId } = req.query as { userId: string };

      if (!userId) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'userId is required',
        });
      }

      const connections = await prisma.oAuthConnection.findMany({
        where: { userId },
        select: {
          id: true,
          provider: true,
          expiresAt: true,
          lastSyncAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return reply.send({
        connections: connections.map((conn) => ({
          ...conn,
          isExpired: conn.expiresAt ? new Date() > conn.expiresAt : false,
        })),
      });
    } catch (error) {
      logger.error('Error fetching OAuth connections', error);
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch OAuth connections',
      });
    }
  });

  /**
   * DELETE /oauth/:provider
   * OAuth 연결 해제
   */
  app.delete('/oauth/:provider', async (req, reply) => {
    try {
      const { provider } = req.params as { provider: string };
      const { userId } = req.query as { userId: string };

      if (!userId) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'userId is required',
        });
      }

      if (provider !== 'toss' && provider !== 'kftc') {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid provider',
        });
      }

      await prisma.oAuthConnection.delete({
        where: {
          userId_provider: {
            userId,
            provider,
          },
        },
      });

      // Redis 캐시 삭제
      await cache.del(`oauth:${userId}:${provider}`);

      logger.info('OAuth connection deleted', { userId, provider });

      return reply.send({
        success: true,
        message: 'OAuth connection deleted',
      });
    } catch (error) {
      logger.error('Error deleting OAuth connection', error);
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete OAuth connection',
      });
    }
  });
}
