import { buildApp } from './app';
import { env, validateEnv } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { redis } from './config/redis';
import { logger } from '@hephaitos/shared';

/**
 * Start the server
 */
async function start() {
  try {
    // Validate environment variables
    validateEnv();
    logger.info('Environment variables validated');

    // Connect to database
    await connectDatabase();

    // Build Fastify app
    const app = await buildApp();

    // Start listening
    await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    logger.info(`🚀 API server running on http://localhost:${env.PORT}${env.API_BASE_PATH}`);
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);

  try {
    await disconnectDatabase();
    await redis.quit();
    logger.info('Server shut down complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Start the server
start();
