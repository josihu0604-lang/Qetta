import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { createHash } from 'crypto';
import { redis } from '../config/redis';
import { env } from '../config/env';
import { logger } from '@qetta/shared';

/**
 * Idempotency 미들웨어
 * POST/PUT/PATCH/DELETE 요청의 중복 처리 방지
 * 
 * 동작 방식:
 * 1. Idempotency-Key 헤더 필수 검증
 * 2. 요청 핑거프린트 생성 (method + url + body)
 * 3. Redis에 상태 저장 (in-progress → done)
 * 4. 동일 키 재요청 시 캐시된 응답 반환
 * 5. 다른 핑거프린트는 409 Conflict
 */

export default fp(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req, reply) => {
    // GET/HEAD/OPTIONS는 멱등성 체크 불필요
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return;
    }

    const idempotencyKey = req.headers['idempotency-key'] as string;

    // Idempotency-Key 필수
    if (!idempotencyKey) {
      logger.warn('Missing Idempotency-Key header', {
        method: req.method,
        url: req.url,
      });
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Idempotency-Key header is required for this operation',
      });
    }

    // 요청 핑거프린트 생성
    const fingerprint = createHash('sha256')
      .update(`${req.method}|${req.url}|${JSON.stringify(req.body || {})}`)
      .digest('hex');

    const redisKey = `idempotency:${idempotencyKey}`;

    try {
      // Redis에서 기존 상태 조회
      const existingState = await redis.hgetall(redisKey);

      // 완료된 요청: 캐시된 응답 반환
      if (existingState.status === 'done') {
        logger.info('Idempotent request detected - replaying response', {
          key: idempotencyKey,
          method: req.method,
          url: req.url,
        });

        reply.header('X-Idempotent-Replay', 'true');
        const cachedResponse = JSON.parse(existingState.response);
        return reply.status(parseInt(existingState.statusCode || '200')).send(cachedResponse);
      }

      // 진행 중인 요청: 핑거프린트 충돌 검사
      if (existingState.status === 'in-progress') {
        if (existingState.fingerprint !== fingerprint) {
          logger.warn('Idempotency conflict detected', {
            key: idempotencyKey,
            expectedFingerprint: existingState.fingerprint,
            actualFingerprint: fingerprint,
          });

          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            message: 'Idempotency key conflict - different request body',
          });
        }

        // 동일 요청이 동시에 들어온 경우 (race condition)
        logger.warn('Concurrent idempotent request detected', {
          key: idempotencyKey,
        });

        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: 'Request is already in progress',
        });
      }

      // 새로운 요청: in-progress 상태로 저장
      await redis.hset(redisKey, {
        status: 'in-progress',
        fingerprint,
        startedAt: new Date().toISOString(),
      });

      // TTL 설정 (기본 24시간)
      await redis.expire(redisKey, env.IDEMPOTENCY_TTL || 86400);

      logger.info('Idempotency key registered', {
        key: idempotencyKey,
        fingerprint: fingerprint.slice(0, 8),
      });

      // 응답 인터셉트: 성공 시 결과 캐싱
      const originalSend = reply.send.bind(reply);
      reply.send = async function (payload: any) {
        try {
          // 성공 응답만 캐싱 (2xx)
          if (reply.statusCode >= 200 && reply.statusCode < 300) {
            await redis.hset(redisKey, {
              status: 'done',
              response: JSON.stringify(payload),
              statusCode: String(reply.statusCode),
              completedAt: new Date().toISOString(),
            });

            logger.info('Idempotent response cached', {
              key: idempotencyKey,
              statusCode: reply.statusCode,
            });
          } else {
            // 실패 시 in-progress 상태 제거
            await redis.del(redisKey);

            logger.info('Idempotency key cleared due to error response', {
              key: idempotencyKey,
              statusCode: reply.statusCode,
            });
          }
        } catch (error) {
          logger.error('Error caching idempotent response', error);
        }

        return originalSend(payload);
      };
    } catch (error) {
      logger.error('Error in idempotency middleware', error);
      // Redis 오류 시에도 요청 진행 (graceful degradation)
    }
  });
});
