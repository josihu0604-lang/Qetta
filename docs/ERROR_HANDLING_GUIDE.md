# Hephaitos 에러 코드 표준 및 핸들링 가이드

**목적**: 일관된 에러 처리 및 디버깅 효율성 향상

---

## 📋 에러 코드 구조

### 형식
```
{PREFIX}_{CATEGORY}_{SPECIFIC_ERROR}
```

예시:
- `AUTH_TOKEN_EXPIRED` ✅
- `OAUTH_KFTC_INVALID_CODE` ✅
- `DEBT_ANALYSIS_INSUFFICIENT_DATA` ✅

---

## 🔢 에러 코드 정의

### 1. 인증 (AUTH_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `AUTH_TOKEN_MISSING` | 401 | Authorization 헤더 없음 | 토큰 포함하여 재요청 |
| `AUTH_TOKEN_INVALID` | 401 | 토큰 형식 오류 | 유효한 JWT 토큰 사용 |
| `AUTH_TOKEN_EXPIRED` | 401 | 토큰 만료 | refresh_token으로 갱신 |
| `AUTH_INVALID_CREDENTIALS` | 401 | 이메일/비밀번호 오류 | 올바른 인증 정보 입력 |
| `AUTH_USER_NOT_FOUND` | 404 | 사용자 없음 | 회원가입 필요 |
| `AUTH_EMAIL_ALREADY_EXISTS` | 409 | 이미 가입된 이메일 | 다른 이메일 사용 |
| `AUTH_SESSION_EXPIRED` | 401 | 세션 만료 | 재로그인 필요 |

### 2. OAuth (OAUTH_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `OAUTH_TOSS_INVALID_CODE` | 400 | Toss 인증 코드 오류 | 재인증 필요 |
| `OAUTH_TOSS_TOKEN_EXCHANGE_FAILED` | 502 | 토큰 교환 실패 | Toss API 상태 확인 |
| `OAUTH_TOSS_USER_INFO_FAILED` | 502 | 사용자 정보 조회 실패 | 재시도 |
| `OAUTH_KFTC_INVALID_CODE` | 400 | KFTC 인증 코드 오류 | 재인증 필요 |
| `OAUTH_KFTC_TOKEN_EXCHANGE_FAILED` | 502 | 토큰 교환 실패 | KFTC API 상태 확인 |
| `OAUTH_KFTC_INVALID_STATE` | 400 | CSRF state 불일치 | 재인증 필요 |
| `OAUTH_TOKEN_NOT_FOUND` | 401 | OAuth 토큰 없음 | OAuth 연결 필요 |
| `OAUTH_TOKEN_EXPIRED` | 401 | OAuth 토큰 만료 | 재인증 필요 |
| `OAUTH_REFRESH_FAILED` | 502 | 토큰 갱신 실패 | 재인증 필요 |

### 3. 계좌 (ACCOUNT_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `ACCOUNT_NOT_FOUND` | 404 | 계좌 없음 | 계좌 ID 확인 |
| `ACCOUNT_ACCESS_DENIED` | 403 | 본인 계좌 아님 | 권한 확인 |
| `ACCOUNT_SYNC_FAILED` | 502 | 동기화 실패 | 재시도 또는 관리자 문의 |
| `ACCOUNT_ALREADY_SYNCED` | 409 | 이미 동기화 중 | 기존 작업 완료 대기 |
| `ACCOUNT_LIMIT_EXCEEDED` | 429 | 계좌 개수 초과 | 플랜 업그레이드 |

### 4. 거래 내역 (TRANSACTION_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `TRANSACTION_NOT_FOUND` | 404 | 거래 내역 없음 | 거래 ID 확인 |
| `TRANSACTION_DATE_INVALID` | 400 | 날짜 범위 오류 | 올바른 날짜 형식 사용 |
| `TRANSACTION_FETCH_FAILED` | 502 | 조회 실패 | 재시도 |

### 5. 문서 (DOCUMENT_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `DOCUMENT_NOT_FOUND` | 404 | 문서 없음 | 문서 ID 확인 |
| `DOCUMENT_ACCESS_DENIED` | 403 | 본인 문서 아님 | 권한 확인 |
| `DOCUMENT_SIZE_EXCEEDED` | 413 | 파일 크기 초과 (>10MB) | 파일 크기 줄이기 |
| `DOCUMENT_TYPE_NOT_SUPPORTED` | 415 | 지원하지 않는 파일 형식 | PDF, JPG, PNG 사용 |
| `DOCUMENT_UPLOAD_FAILED` | 502 | S3 업로드 실패 | 재시도 |
| `DOCUMENT_OCR_FAILED` | 500 | OCR 처리 실패 | 문서 품질 확인 |

### 6. 검증 (VERIFICATION_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `VERIFICATION_NOT_FOUND` | 404 | 검증 결과 없음 | 검증 ID 확인 |
| `VERIFICATION_IN_PROGRESS` | 409 | 검증 진행 중 | 완료 대기 |
| `VERIFICATION_FAILED` | 500 | 검증 실패 | 관리자 문의 |

### 7. 채무 분석 (DEBT_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `DEBT_ANALYSIS_NOT_FOUND` | 404 | 분석 결과 없음 | 분석 ID 확인 |
| `DEBT_ANALYSIS_IN_PROGRESS` | 409 | 분석 진행 중 | 완료 대기 |
| `DEBT_ANALYSIS_FAILED` | 500 | 분석 실패 | 재시도 |
| `DEBT_ANALYSIS_INSUFFICIENT_DATA` | 400 | 데이터 부족 | 계좌 연결 또는 소득 입력 |
| `DEBT_ANALYSIS_NO_ACCOUNTS` | 400 | 연결된 계좌 없음 | 계좌 연결 필요 |
| `DEBT_SIMULATION_FAILED` | 500 | 시뮬레이션 실패 | 관리자 문의 |

### 8. 신청서 (APPLICATION_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `APPLICATION_NOT_FOUND` | 404 | 신청서 없음 | 신청서 ID 확인 |
| `APPLICATION_ACCESS_DENIED` | 403 | 본인 신청서 아님 | 권한 확인 |
| `APPLICATION_ALREADY_SUBMITTED` | 409 | 이미 제출됨 | 새 신청서 생성 |
| `APPLICATION_INVALID_STATUS` | 400 | 잘못된 상태 변경 | 상태 확인 |
| `APPLICATION_PDF_GENERATION_FAILED` | 500 | PDF 생성 실패 | 재시도 |
| `APPLICATION_SUBMISSION_FAILED` | 502 | 제출 실패 | 재시도 |

### 9. 구독/결제 (BILLING_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `BILLING_SUBSCRIPTION_NOT_FOUND` | 404 | 구독 정보 없음 | 구독 필요 |
| `BILLING_PAYMENT_FAILED` | 402 | 결제 실패 | 결제 정보 확인 |
| `BILLING_PLAN_NOT_FOUND` | 404 | 플랜 없음 | 플랜 ID 확인 |
| `BILLING_USAGE_LIMIT_EXCEEDED` | 429 | 사용량 초과 | 플랜 업그레이드 |

### 10. 일반 (GENERAL_*)

| 코드 | HTTP Status | 설명 | 해결 방법 |
|------|------------|------|----------|
| `VALIDATION_ERROR` | 400 | 입력 검증 실패 | 요청 데이터 확인 |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit 초과 | 잠시 후 재시도 |
| `INTERNAL_SERVER_ERROR` | 500 | 서버 오류 | 관리자 문의 |
| `EXTERNAL_API_ERROR` | 502 | 외부 API 오류 | 재시도 또는 관리자 문의 |
| `SERVICE_UNAVAILABLE` | 503 | 서비스 점검 중 | 공지 확인 |

---

## 🏗️ 에러 응답 형식

### 표준 에러 응답

```typescript
interface ErrorResponse {
  error: {
    code: string;           // 에러 코드
    message: string;        // 사용자용 메시지
    details?: any;          // 추가 상세 정보
    timestamp: string;      // ISO 8601
    requestId: string;      // 요청 추적 ID
    path?: string;          // 요청 경로
  };
}
```

### 예시

```json
{
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "message": "인증 토큰이 만료되었습니다. 다시 로그인해주세요.",
    "timestamp": "2025-10-26T10:30:00Z",
    "requestId": "req-abc123",
    "path": "/api/v1/accounts"
  }
}
```

### 검증 오류 (상세 정보 포함)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터가 올바르지 않습니다.",
    "details": {
      "email": ["이메일 형식이 올바르지 않습니다."],
      "password": ["비밀번호는 최소 8자 이상이어야 합니다."]
    },
    "timestamp": "2025-10-26T10:30:00Z",
    "requestId": "req-def456"
  }
}
```

---

## 🛠️ 에러 핸들링 구현

### Backend (Fastify)

```typescript
// services/api/src/middleware/error.ts

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../lib/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * 커스텀 에러 클래스
 */
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * 에러 핸들러 미들웨어
 */
export async function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requestId = request.id || uuidv4();

  // AppError인 경우
  if (error instanceof AppError) {
    logger.warn(
      {
        code: error.code,
        statusCode: error.statusCode,
        message: error.message,
        details: error.details,
        requestId,
        userId: request.user?.id,
        path: request.url
      },
      'Application error'
    );

    return reply.code(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
        requestId,
        path: request.url
      }
    });
  }

  // Zod 검증 오류
  if (error.validation) {
    logger.warn(
      {
        validation: error.validation,
        requestId,
        path: request.url
      },
      'Validation error'
    );

    const details: Record<string, string[]> = {};
    
    for (const issue of error.validation) {
      const field = issue.params.missingProperty || issue.instancePath.slice(1);
      if (!details[field]) details[field] = [];
      details[field].push(issue.message || 'Invalid value');
    }

    return reply.code(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: '입력 데이터가 올바르지 않습니다.',
        details,
        timestamp: new Date().toISOString(),
        requestId,
        path: request.url
      }
    });
  }

  // 기타 에러
  logger.error(
    {
      err: error,
      requestId,
      userId: request.user?.id,
      path: request.url
    },
    'Unhandled error'
  );

  // 프로덕션에서는 내부 에러 상세 숨김
  const message =
    process.env.NODE_ENV === 'production'
      ? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      : error.message;

  return reply.code(error.statusCode || 500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      timestamp: new Date().toISOString(),
      requestId,
      path: request.url
    }
  });
}

/**
 * 에러 생성 헬퍼
 */
export const errors = {
  // 인증
  tokenMissing: () =>
    new AppError('AUTH_TOKEN_MISSING', '인증 토큰이 필요합니다.', 401),
  
  tokenInvalid: () =>
    new AppError('AUTH_TOKEN_INVALID', '인증 토큰이 올바르지 않습니다.', 401),
  
  tokenExpired: () =>
    new AppError('AUTH_TOKEN_EXPIRED', '인증 토큰이 만료되었습니다.', 401),
  
  invalidCredentials: () =>
    new AppError('AUTH_INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.', 401),

  // OAuth
  oauthTokenNotFound: (provider: string) =>
    new AppError(
      'OAUTH_TOKEN_NOT_FOUND',
      `${provider} 인증이 필요합니다.`,
      401
    ),

  oauthTokenExpired: (provider: string) =>
    new AppError(
      'OAUTH_TOKEN_EXPIRED',
      `${provider} 인증이 만료되었습니다. 재인증이 필요합니다.`,
      401
    ),

  // 계좌
  accountNotFound: () =>
    new AppError('ACCOUNT_NOT_FOUND', '계좌를 찾을 수 없습니다.', 404),

  accountAccessDenied: () =>
    new AppError('ACCOUNT_ACCESS_DENIED', '해당 계좌에 접근할 수 없습니다.', 403),

  // 채무 분석
  debtAnalysisInsufficientData: () =>
    new AppError(
      'DEBT_ANALYSIS_INSUFFICIENT_DATA',
      '채무 분석에 필요한 데이터가 부족합니다. 계좌를 연결하거나 소득 정보를 입력해주세요.',
      400
    ),

  // 일반
  rateLimitExceeded: () =>
    new AppError(
      'RATE_LIMIT_EXCEEDED',
      '요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.',
      429
    ),

  externalApiError: (provider: string) =>
    new AppError(
      'EXTERNAL_API_ERROR',
      `${provider} API 호출에 실패했습니다. 잠시 후 다시 시도해주세요.`,
      502
    ),
};
```

### Frontend (React)

```typescript
// services/web/lib/api.ts

import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/useToast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<ErrorResponse>) => {
    const errorResponse = error.response?.data?.error;

    if (!errorResponse) {
      // 네트워크 오류
      toast({
        title: '네트워크 오류',
        description: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }

    const { code, message } = errorResponse;

    // 토큰 만료 시 자동 갱신 (또는 로그아웃)
    if (code === 'AUTH_TOKEN_EXPIRED') {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/auth/refresh', { refreshToken });
        
        localStorage.setItem('accessToken', response.data.accessToken);
        
        // 원래 요청 재시도
        if (error.config) {
          error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        // 리프레시 실패 → 로그아웃
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 사용자에게 에러 표시
    toast({
      title: '오류',
      description: message,
      variant: 'destructive'
    });

    return Promise.reject(errorResponse);
  }
);

export default api;

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
    path?: string;
  };
}
```

---

## 📝 에러 로깅

### Sentry 통합

```typescript
// services/api/src/lib/sentry.ts

import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

/**
 * 에러 캡처
 */
export function captureError(
  error: Error,
  context?: Record<string, any>
) {
  Sentry.captureException(error, {
    extra: context
  });
}

/**
 * 사용자 설정
 */
export function setUser(user: { id: string; email?: string }) {
  Sentry.setUser(user);
}
```

### 사용 예시

```typescript
try {
  const result = await kftcClient.getAccountList(accessToken, userSeqNo);
  return result;
} catch (error) {
  logger.error({ err: error, userId }, 'KFTC API failed');
  
  captureError(error as Error, {
    provider: 'KFTC',
    userId,
    endpoint: '/account/list'
  });

  throw errors.externalApiError('KFTC');
}
```

---

## ✅ 에러 핸들링 체크리스트

```
□ 모든 API 엔드포인트에 에러 핸들러 적용
□ 커스텀 에러 클래스 (AppError) 사용
□ 에러 코드 표준 준수
□ 사용자 친화적 에러 메시지
□ 요청 ID 추적 (requestId)
□ 에러 로깅 (Pino + Sentry)
□ 민감 정보 마스킹
□ 프로덕션에서 내부 에러 상세 숨김
□ 클라이언트 토큰 자동 갱신
□ Rate limiting 에러 핸들링
```

---

**중요**: 에러 발생 시 항상 로그를 남기고, 프로덕션에서는 민감한 정보를 노출하지 마세요!
