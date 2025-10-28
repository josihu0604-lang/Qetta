import { env } from '../../config/env';
import { logger } from '@qetta/shared';

/**
 * Toss 인증 API 클라이언트
 * Client Credentials Grant를 사용하여 토큰 발급
 */

export interface TossTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class TossAuthClient {
  private readonly oauthBase: string;
  private readonly apiBase: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly grantType: string = 'client_credentials';
  private readonly scope: string = 'ca';

  constructor() {
    this.oauthBase = env.TOSS_OAUTH_BASE || 'https://oauth2.cert.toss.im';
    this.apiBase = env.TOSS_API_BASE || 'https://cert.toss.im';
    this.clientId = env.TOSS_CLIENT_ID;
    this.clientSecret = env.TOSS_CLIENT_SECRET;

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Toss OAuth credentials not configured');
    }
  }

  /**
   * Access Token 발급 (Client Credentials Grant)
   */
  async getAccessToken(): Promise<TossTokenResponse> {
    try {
      const params = new URLSearchParams({
        grant_type: this.grantType,
        scope: this.scope,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });

      logger.info('Requesting Toss access token', {
        url: `${this.oauthBase}/token`,
        grant_type: this.grantType,
        scope: this.scope,
      });

      const response = await fetch(`${this.oauthBase}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Toss token request failed', {
          status: response.status,
          error: errorText,
        });
        throw new Error(`Toss token request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      logger.info('Toss access token obtained successfully', {
        token_type: data.token_type,
        expires_in: data.expires_in,
      });

      return data;
    } catch (error) {
      logger.error('Error getting Toss access token', error);
      throw error;
    }
  }

  /**
   * Toss API 호출 (헬퍼 메서드)
   */
  async callApi<T = any>(
    endpoint: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      accessToken: string;
    }
  ): Promise<T> {
    const { method = 'GET', headers = {}, body, accessToken } = options;

    try {
      const url = `${this.apiBase}${endpoint}`;

      logger.info('Calling Toss API', {
        url,
        method,
      });

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Toss API call failed', {
          url,
          status: response.status,
          error: errorText,
        });
        throw new Error(`Toss API call failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.error('Error calling Toss API', error);
      throw error;
    }
  }

  /**
   * 토큰 유효성 검증 (만료 시간 체크)
   */
  isTokenExpired(issuedAt: Date, expiresIn: number): boolean {
    const now = new Date();
    const expiresAt = new Date(issuedAt.getTime() + expiresIn * 1000);
    return now >= expiresAt;
  }
}
