import crypto from 'crypto';

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  userId: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

/**
 * Simple JWT implementation without external dependencies
 * For production, consider using 'jsonwebtoken' library
 */

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf8');
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

/**
 * Generate access token (15 minutes)
 */
export function generateAccessToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');

  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    userId,
    type: 'access',
    iat: now,
    exp: now + 15 * 60, // 15 minutes
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Generate refresh token (7 days)
 */
export function generateRefreshToken(userId: string): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error('REFRESH_TOKEN_SECRET not configured');

  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    userId,
    type: 'refresh',
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');

  const [encodedHeader, encodedPayload, signature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error('Invalid token format');
  }

  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, secret);
  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

  if (payload.type !== 'access') {
    throw new Error('Invalid token type');
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    throw new Error('Token expired');
  }

  return payload;
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error('REFRESH_TOKEN_SECRET not configured');

  const [encodedHeader, encodedPayload, signature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error('Invalid token format');
  }

  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, secret);
  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

  if (payload.type !== 'refresh') {
    throw new Error('Invalid token type');
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    throw new Error('Token expired');
  }

  return payload;
}
