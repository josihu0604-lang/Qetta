/**
 * Environment configuration
 */

export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_BASE_PATH: process.env.API_BASE_PATH || '/api/v1',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',

  // Toss OAuth
  TOSS_CLIENT_ID: process.env.TOSS_CLIENT_ID || '',
  TOSS_CLIENT_SECRET: process.env.TOSS_CLIENT_SECRET || '',
  TOSS_REDIRECT_URI: process.env.TOSS_REDIRECT_URI || '',
  TOSS_AUTHORIZE_URL:
    process.env.TOSS_AUTHORIZE_URL || 'https://oauth.toss.im/authorize',
  TOSS_TOKEN_URL: process.env.TOSS_TOKEN_URL || 'https://oauth.toss.im/token',
  TOSS_API_BASE_URL: process.env.TOSS_API_BASE_URL || 'https://api.toss.im',

  // KFTC OpenBanking
  KFTC_CLIENT_ID: process.env.KFTC_CLIENT_ID || '',
  KFTC_CLIENT_SECRET: process.env.KFTC_CLIENT_SECRET || '',
  KFTC_REDIRECT_URI: process.env.KFTC_REDIRECT_URI || '',
  KFTC_AUTHORIZE_URL:
    process.env.KFTC_AUTHORIZE_URL ||
    'https://testapi.openbanking.or.kr/oauth/2.0/authorize',
  KFTC_TOKEN_URL:
    process.env.KFTC_TOKEN_URL || 'https://testapi.openbanking.or.kr/oauth/2.0/token',
  KFTC_API_BASE_URL:
    process.env.KFTC_API_BASE_URL || 'https://testapi.openbanking.or.kr',

  // AWS S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'ap-northeast-2',
  S3_BUCKET: process.env.S3_BUCKET || 'qetta-documents',
  S3_PUBLIC_URL: process.env.S3_PUBLIC_URL || '',

  // BullMQ
  QUEUE_CONCURRENCY: parseInt(process.env.QUEUE_CONCURRENCY || '5', 10),
  QUEUE_RATE_LIMIT_MAX: parseInt(process.env.QUEUE_RATE_LIMIT_MAX || '100', 10),
  QUEUE_RATE_LIMIT_DURATION: parseInt(process.env.QUEUE_RATE_LIMIT_DURATION || '60000', 10),

  // Monitoring
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  DATADOG_API_KEY: process.env.DATADOG_API_KEY || '',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Rate Limiting
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10),

  // CORS
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],

  // Idempotency
  IDEMPOTENCY_TTL: parseInt(process.env.IDEMPOTENCY_TTL || '86400', 10),
};

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'ENCRYPTION_KEY'];

  const missing = required.filter((key) => !env[key as keyof typeof env]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
