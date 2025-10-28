import { PrismaClient } from '@prisma/client';
import { logger } from '@qetta/shared';

/**
 * Prisma client instance with logging
 */
export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

// Log slow queries (> 1000ms)
prisma.$on('query' as never, (e: any) => {
  if (e.duration > 1000) {
    logger.warn('Slow query detected', {
      query: e.query,
      duration: e.duration,
      params: e.params,
    });
  }
});

/**
 * Connect to database
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Database connected');
  } catch (error) {
    logger.error('Database connection error', error);
    throw error;
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Database disconnection error', error);
  }
}
