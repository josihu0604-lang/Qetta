import { env } from '../../config/env';
import { logger } from '@hephaitos/shared';

/**
 * KFTC OpenBanking OAuth 클라이언트
 * Authorization Code Grant를 사용한 표준 OAuth 2.0 흐름
 */

export interface KFTCTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_seq_no: string;
}

export interface KFTCAccountListResponse {
  api_tran_id: string;
  api_tran_dtm: string;
  rsp_code: string;
  rsp_message: string;
  user_name: string;
  res_cnt: number;
  res_list: Array<{
    fintech_use_num: string;
    account_alias: string;
    bank_code_std: string;
    bank_name: string;
    account_num_masked: string;
    account_holder_name: string;
    account_type: string;
    account_state: string;
  }>;
}

export interface KFTCTransactionListResponse {
  api_tran_id: string;
  api_tran_dtm: string;
  rsp_code: string;
  rsp_message: string;
  bank_tran_id: string;
  bank_tran_date: string;
  bank_code_tran: string;
  bank_rsp_code: string;
  bank_rsp_message: string;
  fintech_use_num: string;
  balance_amt: string;
  res_cnt: number;
  res_list: Array<{
    tran_date: string;
    tran_time: string;
    inout_type: string;
    tran_type: string;
    print_content: string;
    tran_amt: string;
    after_balance_amt: string;
    branch_name: string;
  }>;
}

export class KFTCAuthClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly authorizeUrl: string;
  private readonly tokenUrl: string;
  private readonly apiBaseUrl: string;

  constructor() {
    this.clientId = env.KFTC_CLIENT_ID;
    this.clientSecret = env.KFTC_CLIENT_SECRET;
    this.redirectUri = env.KFTC_REDIRECT_URI;
    this.authorizeUrl =
      env.KFTC_AUTHORIZE_URL || 'https://testapi.openbanking.or.kr/oauth/2.0/authorize';
    this.tokenUrl =
      env.KFTC_TOKEN_URL || 'https://testapi.openbanking.or.kr/oauth/2.0/token';
    this.apiBaseUrl =
      env.KFTC_API_BASE_URL || 'https://testapi.openbanking.or.kr';

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error('KFTC OAuth credentials not configured');
    }
  }

  /**
   * Authorization URL 생성
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'login inquiry',
      state,
      auth_type: '0', // 0: 통합인증, 1: 개별인증
    });

    const url = `${this.authorizeUrl}?${params.toString()}`;
    logger.info('Generated KFTC authorization URL', { state });
    return url;
  }

  /**
   * Authorization Code를 Access Token으로 교환
   */
  async exchangeCodeForToken(code: string): Promise<KFTCTokenResponse> {
    try {
      const params = new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      });

      logger.info('Exchanging KFTC authorization code for token', {
        url: this.tokenUrl,
      });

      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('KFTC token exchange failed', {
          status: response.status,
          error: errorText,
        });
        throw new Error(`KFTC token exchange failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      logger.info('KFTC token exchange successful', {
        token_type: data.token_type,
        expires_in: data.expires_in,
        scope: data.scope,
      });

      return data;
    } catch (error) {
      logger.error('Error exchanging KFTC code for token', error);
      throw error;
    }
  }

  /**
   * Refresh Token으로 새 Access Token 발급
   */
  async refreshAccessToken(refreshToken: string): Promise<KFTCTokenResponse> {
    try {
      const params = new URLSearchParams({
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
      });

      logger.info('Refreshing KFTC access token');

      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('KFTC token refresh failed', {
          status: response.status,
          error: errorText,
        });
        throw new Error(`KFTC token refresh failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      logger.info('KFTC token refresh successful');

      return data;
    } catch (error) {
      logger.error('Error refreshing KFTC token', error);
      throw error;
    }
  }

  /**
   * 사용자 계좌 목록 조회
   */
  async getAccountList(
    accessToken: string,
    userSeqNo: string
  ): Promise<KFTCAccountListResponse> {
    try {
      const url = `${this.apiBaseUrl}/v2.0/account/list`;

      logger.info('Fetching KFTC account list', { userSeqNo });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('KFTC account list request failed', {
          status: response.status,
          error: errorText,
        });
        throw new Error(
          `KFTC account list request failed: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      logger.info('KFTC account list fetched successfully', {
        res_cnt: data.res_cnt,
        rsp_code: data.rsp_code,
      });

      return data;
    } catch (error) {
      logger.error('Error fetching KFTC account list', error);
      throw error;
    }
  }

  /**
   * 계좌 거래내역 조회
   */
  async getTransactionList(
    accessToken: string,
    fintechUseNum: string,
    fromDate: string, // YYYYMMDD
    toDate: string, // YYYYMMDD
    transType: 'A' | 'I' | 'O' = 'A' // A: 전체, I: 입금, O: 출금
  ): Promise<KFTCTransactionListResponse> {
    try {
      const bankTranId = this.generateBankTranId();
      const tranDtime = this.generateTranDtime();

      const url = `${this.apiBaseUrl}/v2.0/account/transaction_list/fin_num`;
      const params = new URLSearchParams({
        bank_tran_id: bankTranId,
        fintech_use_num: fintechUseNum,
        inquiry_type: 'A', // A: 전체, I: 입금, O: 출금
        inquiry_base: 'D', // D: 날짜, T: 시간
        from_date: fromDate,
        to_date: toDate,
        sort_order: 'D', // D: 내림차순, A: 오름차순
        tran_dtime: tranDtime,
      });

      logger.info('Fetching KFTC transaction list', {
        fintechUseNum,
        fromDate,
        toDate,
      });

      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('KFTC transaction list request failed', {
          status: response.status,
          error: errorText,
        });
        throw new Error(
          `KFTC transaction list request failed: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      logger.info('KFTC transaction list fetched successfully', {
        res_cnt: data.res_cnt,
        rsp_code: data.rsp_code,
      });

      return data;
    } catch (error) {
      logger.error('Error fetching KFTC transaction list', error);
      throw error;
    }
  }

  /**
   * Bank Transaction ID 생성 (기관코드 9자리 + 난수 9자리)
   */
  private generateBankTranId(): string {
    const orgCode = '1101073389'; // QETTA 기관코드 (10자리)
    const random = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, '0');
    return `${orgCode}U${random}`;
  }

  /**
   * 거래일시 생성 (YYYYMMDDHHmmss)
   */
  private generateTranDtime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }
}
