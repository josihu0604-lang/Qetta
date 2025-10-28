import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env';
import { redis } from './config/redis';
import { healthRoutes } from './routes/health';
import { logger } from '@qetta/shared';

/**
 * Create Fastify app instance
 */
export async function buildApp() {
  const app = Fastify({
    logger: false, // Using custom logger
    trustProxy: true,
  });

  /**
   * Register plugins
   */

  // CORS
  await app.register(cors, {
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  });

  // Security headers
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", env.FRONTEND_URL],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
    cache: 10000,
    redis: redis,
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    }),
  });

  /**
   * Request/Response logging
   */
  app.addHook('onRequest', async (req, reply) => {
    logger.info(`${req.method} ${req.url}`, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  });

  app.addHook('onResponse', async (req, reply) => {
    logger.info(`${req.method} ${req.url} - ${reply.statusCode}`, {
      duration: reply.elapsedTime,
    });
  });

  /**
   * Error handler
   */
  app.setErrorHandler((error, req, reply) => {
    logger.error('Request error', {
      method: req.method,
      url: req.url,
      error: error.message,
      stack: error.stack,
    });

    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      });
    }

    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: env.NODE_ENV === 'production' ? 'An error occurred' : error.message,
    });
  });

  /**
   * Register routes
   */
  await app.register(healthRoutes, { prefix: env.API_BASE_PATH });
  await app.register(oauthRoutes, { prefix: `${env.API_BASE_PATH}/oauth` });

  // TODO: Add more routes here
  // await app.register(authRoutes, { prefix: `${env.API_BASE_PATH}/auth` });
  // await app.register(accountRoutes, { prefix: `${env.API_BASE_PATH}/accounts` });
  // ... etc

  return app;
}
