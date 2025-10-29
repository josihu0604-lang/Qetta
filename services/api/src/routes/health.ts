import { FastifyInstance } from 'fastify';
import { prisma } from '../config/database';
import { redis } from '../config/redis';

/**
 * Health check routes
 */
export async function healthRoutes(app: FastifyInstance) {
  /**
   * GET /health
   * Basic health check
   */
  app.get('/health', async (req, reply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  /**
   * GET /health/ready
   * Readiness check (database + redis)
   */
  app.get('/health/ready', async (req, reply) => {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      // Check redis connection
      await redis.ping();

      return reply.send({
        status: 'ready',
        timestamp: new Date().toISOString(),
        services: {
          database: 'ok',
          redis: 'ok',
        },
      });
    } catch (error) {
      return reply.status(503).send({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  /**
   * GET /health/live
   * Liveness check
   */
  app.get('/health/live', async (req, reply) => {
    return reply.send({
      status: 'alive',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      memory: process.memoryUsage(),
    });
  });
}
