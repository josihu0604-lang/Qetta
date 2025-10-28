import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import client from 'prom-client';
import { logger } from '@qetta/shared';

/**
 * Prometheus Metrics 플러그인
 * 
 * 제공 메트릭:
 * 1. http_request_duration_ms - HTTP 요청 지연 시간
 * 2. http_request_total - HTTP 요청 총 수
 * 3. free_analyze_started_total - 무료 분석 시작 수
 * 4. free_analyze_success_total - 무료 분석 성공 수
 * 5. premium_conversion_total - Free → Premium 전환 수
 * 6. pdf_generation_duration_ms - PDF 생성 시간
 * 7. oauth_connection_total - OAuth 연결 성공 수
 * 8. Default metrics (CPU, Memory, GC 등)
 */

// Register 생성
const register = new client.Registry();

// Default metrics (CPU, Memory, GC 등)
client.collectDefaultMetrics({ register });

// HTTP 요청 지연 시간 히스토그램
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP request duration in milliseconds',
  labelNames: ['route', 'method', 'status_code'],
  buckets: [50, 100, 200, 500, 1000, 2000, 5000], // ms
  registers: [register],
});

// HTTP 요청 총 수
const httpRequestTotal = new client.Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['route', 'method', 'status_code'],
  registers: [register],
});

// 무료 분석 시작 수
const freeAnalyzeStarted = new client.Counter({
  name: 'free_analyze_started_total',
  help: 'Total number of free debt analyses started',
  registers: [register],
});

// 무료 분석 성공 수
const freeAnalyzeSuccess = new client.Counter({
  name: 'free_analyze_success_total',
  help: 'Total number of free debt analyses completed successfully',
  registers: [register],
});

// Premium 전환 수
const premiumConversion = new client.Counter({
  name: 'premium_conversion_total',
  help: 'Total number of Free → Premium conversions',
  labelNames: ['from_plan', 'to_plan'],
  registers: [register],
});

// PDF 생성 시간
const pdfGenerationDuration = new client.Histogram({
  name: 'pdf_generation_duration_ms',
  help: 'PDF generation duration in milliseconds',
  labelNames: ['policy_type'],
  buckets: [500, 1000, 2000, 5000, 10000], // ms
  registers: [register],
});

// OAuth 연결 성공 수
const oauthConnection = new client.Counter({
  name: 'oauth_connection_total',
  help: 'Total number of successful OAuth connections',
  labelNames: ['provider'], // toss, kftc
  registers: [register],
});

// 데이터베이스 쿼리 시간
const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_ms',
  help: 'Database query duration in milliseconds',
  labelNames: ['operation', 'model'],
  buckets: [10, 50, 100, 200, 500, 1000],
  registers: [register],
});

// Redis 작업 시간
const redisOperationDuration = new client.Histogram({
  name: 'redis_operation_duration_ms',
  help: 'Redis operation duration in milliseconds',
  labelNames: ['operation'], // get, set, del
  buckets: [1, 5, 10, 50, 100],
  registers: [register],
});

export default fp(async (app: FastifyInstance) => {
  // Fastify 인스턴스에 metrics 등록
  app.decorate('metrics', {
    httpRequestDuration,
    httpRequestTotal,
    freeAnalyzeStarted,
    freeAnalyzeSuccess,
    premiumConversion,
    pdfGenerationDuration,
    oauthConnection,
    dbQueryDuration,
    redisOperationDuration,
  });

  // 요청 시작 시간 기록
  app.addHook('onRequest', async (req: FastifyRequest) => {
    (req as any).startTime = Date.now();
  });

  // 응답 완료 시 메트릭 기록
  app.addHook('onResponse', async (req: FastifyRequest, reply: FastifyReply) => {
    const duration = Date.now() - ((req as any).startTime || Date.now());
    const route = req.routerPath || 'unknown';
    const method = req.method;
    const statusCode = String(reply.statusCode);

    // HTTP 요청 지연 시간
    httpRequestDuration.labels(route, method, statusCode).observe(duration);

    // HTTP 요청 총 수
    httpRequestTotal.labels(route, method, statusCode).inc();

    // 느린 요청 경고 (> 2초)
    if (duration > 2000) {
      logger.warn('Slow request detected', {
        route,
        method,
        duration,
        statusCode,
      });
    }
  });

  // /metrics 엔드포인트
  app.get('/metrics', async (req, reply) => {
    try {
      reply.header('Content-Type', register.contentType);
      return register.metrics();
    } catch (error) {
      logger.error('Error generating metrics', error);
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to generate metrics',
      });
    }
  });

  logger.info('Prometheus metrics plugin registered', {
    endpoint: '/metrics',
    collectors: [
      'http_request_duration_ms',
      'http_request_total',
      'free_analyze_started_total',
      'free_analyze_success_total',
      'premium_conversion_total',
      'pdf_generation_duration_ms',
      'oauth_connection_total',
      'db_query_duration_ms',
      'redis_operation_duration_ms',
    ],
  });
});

// 타입 확장
declare module 'fastify' {
  interface FastifyInstance {
    metrics: {
      httpRequestDuration: client.Histogram<string>;
      httpRequestTotal: client.Counter<string>;
      freeAnalyzeStarted: client.Counter<string>;
      freeAnalyzeSuccess: client.Counter<string>;
      premiumConversion: client.Counter<string>;
      pdfGenerationDuration: client.Histogram<string>;
      oauthConnection: client.Counter<string>;
      dbQueryDuration: client.Histogram<string>;
      redisOperationDuration: client.Histogram<string>;
    };
  }
}
