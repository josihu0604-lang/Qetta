import { z } from 'zod';

/**
 * OAuth Provider types
 */
export type OAuthProvider = 'toss' | 'kftc';

/**
 * OAuth Connection schema
 */
export const OAuthConnectionSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  provider: z.enum(['toss', 'kftc']),
  expiresAt: z.date().nullable(),
  lastSyncAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type OAuthConnection = z.infer<typeof OAuthConnectionSchema>;

/**
 * Toss OAuth token response
 */
export interface TossTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

/**
 * KFTC OAuth token response
 */
export interface KFTCTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_seq_no: string;
}

/**
 * OAuth authorization request
 */
export interface OAuthAuthorizationRequest {
  userId: string;
  provider: OAuthProvider;
  redirectUri: string;
}

/**
 * OAuth callback request
 */
export interface OAuthCallbackRequest {
  code: string;
  state: string;
  provider: OAuthProvider;
}
