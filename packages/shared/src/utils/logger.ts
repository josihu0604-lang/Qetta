/**
 * Sensitive keys that should be masked in logs
 */
const SENSITIVE_KEYS = [
  'accessToken',
  'refreshToken',
  'password',
  'passwordHash',
  'userSeqNo',
  'accountNumber',
  'fintechUseNum',
  'idCardNumber',
  'ssn',
  'authorization',
  'cookie',
  'jwt',
  'token',
];

/**
 * Mask sensitive data in objects for logging
 * @param obj - Object to mask
 * @returns Masked object with sensitive fields replaced
 */
export function maskSensitiveData(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveData(item));
  }

  const masked: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
        lowerKey.includes(sensitiveKey.toLowerCase())
      );

      if (isSensitive) {
        masked[key] = '***REDACTED***';
      } else if (typeof obj[key] === 'object') {
        masked[key] = maskSensitiveData(obj[key]);
      } else {
        masked[key] = obj[key];
      }
    }
  }

  return masked;
}

/**
 * Create a logger instance with sensitive data masking
 * This is a simple console-based logger for development
 * In production, replace with pino, winston, or similar
 */
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? maskSensitiveData(data) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error ? maskSensitiveData(error) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? maskSensitiveData(data) : '');
  },
  debug: (message: string, data?: any) => {
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(`[DEBUG] ${message}`, data ? maskSensitiveData(data) : '');
    }
  },
};
