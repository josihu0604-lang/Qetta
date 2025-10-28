# QETTA API 엔드포인트 상세 스펙

**버전**: v1.0.0  
**Base URL**: `https://api.qetta.io/api/v1`  
**인증**: Bearer JWT Token

---

## 📋 목차

1. [인증 (Authentication)](#1-인증-authentication)
2. [OAuth 통합](#2-oauth-통합)
3. [계좌 관리](#3-계좌-관리)
4. [거래 내역](#4-거래-내역)
5. [문서 관리](#5-문서-관리)
6. [검증 (Verification)](#6-검증-verification)
7. [채무 분석](#7-채무-분석)
8. [신청서 (Applications)](#8-신청서-applications)
9. [사용자 관리](#9-사용자-관리)
10. [구독/결제](#10-구독결제)

---

## 1. 인증 (Authentication)

### 1.1 회원가입
```http
POST /auth/register

Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "홍길동",
  "phoneNumber": "01012345678"  // optional
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "createdAt": "2025-10-26T00:00:00Z"
  }
}

Errors:
409 Conflict - 이미 존재하는 이메일
400 Bad Request - 유효하지 않은 입력
```

### 1.2 로그인
```http
POST /auth/login

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동"
  }
}

Errors:
401 Unauthorized - 잘못된 인증 정보
```

### 1.3 토큰 갱신
```http
POST /auth/refresh

Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 2. OAuth 통합

### 2.1 Toss 인증 시작
```http
GET /oauth/toss/authorize

Response: 302 Redirect
Location: https://toss.im/cert/authorize?client_id=...&redirect_uri=...&state=...

Query Params:
- redirect_uri: 콜백 URL (optional, default: /oauth/toss/callback)
```

### 2.2 Toss 인증 콜백
```http
GET /oauth/toss/callback?code=AUTH_CODE&state=STATE

Response: 302 Redirect
Location: /consent?toss_auth=success

자동 처리:
- access_token 획득
- ExternalAuth 테이블 저장 (provider: TOSS_CERT)
- 본인인증 정보 저장
```

### 2.3 KFTC 오픈뱅킹 시작
```http
GET /oauth/kftc/authorize

Response: 302 Redirect
Location: https://testapi.openbanking.or.kr/oauth/2.0/authorize?client_id=...

Query Params:
- scope: inquiry (잔액조회) | transfer (이체) | login (로그인)
```

### 2.4 KFTC 오픈뱅킹 콜백
```http
GET /oauth/kftc/callback?code=AUTH_CODE&state=STATE

Response: 302 Redirect
Location: /upload?kftc_auth=success

자동 처리:
- access_token + refresh_token 획득
- ExternalAuth 테이블 저장 (provider: KFTC_OPENBANKING)
```

### 2.5 OAuth 연결 상태 조회
```http
GET /oauth/status

Authorization: Bearer {token}

Response: 200 OK
{
  "connections": [
    {
      "provider": "TOSS_CERT",
      "connectedAt": "2025-10-26T00:00:00Z",
      "expiresAt": "2025-11-26T00:00:00Z",
      "status": "active",
      "scope": "identity_verification"
    },
    {
      "provider": "KFTC_OPENBANKING",
      "connectedAt": "2025-10-26T00:00:00Z",
      "expiresAt": "2025-11-26T00:00:00Z",
      "status": "active",
      "scope": "inquiry"
    }
  ]
}
```

### 2.6 OAuth 연결 해제
```http
DELETE /oauth/{provider}/disconnect

Authorization: Bearer {token}

Path Params:
- provider: TOSS_CERT | KFTC_OPENBANKING

Response: 204 No Content

Effect:
- ExternalAuth 레코드 삭제
- 연결된 BankAccount는 유지 (lastSyncedAt null)
```

---

## 3. 계좌 관리

### 3.1 계좌 목록 조회
```http
GET /accounts

Authorization: Bearer {token}

Query Params:
- status: ACTIVE | INACTIVE | CLOSED (optional)
- type: DEPOSIT | LOAN | CREDIT_CARD (optional)
- page: 1 (default)
- limit: 20 (default)

Response: 200 OK
{
  "accounts": [
    {
      "id": "uuid",
      "bankCode": "004",
      "bankName": "KB국민은행",
      "accountNumber": "1234****90",  // 마스킹
      "accountType": "DEPOSIT",
      "balance": 1500000.00,
      "currency": "KRW",
      "status": "ACTIVE",
      "lastSyncedAt": "2025-10-26T00:00:00Z",
      "createdAt": "2025-10-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "bankCode": "020",
      "bankName": "우리은행",
      "accountNumber": "5678****34",
      "accountType": "LOAN",
      "balance": -20000000.00,  // 음수 = 부채
      "currency": "KRW",
      "interestRate": 12.5,
      "dueDate": "2025-11-05",
      "status": "ACTIVE",
      "lastSyncedAt": "2025-10-26T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

### 3.2 계좌 상세 조회
```http
GET /accounts/{accountId}

Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "bankCode": "004",
  "bankName": "KB국민은행",
  "accountNumber": "1234****90",
  "accountType": "DEPOSIT",
  "balance": 1500000.00,
  "currency": "KRW",
  "status": "ACTIVE",
  "lastSyncedAt": "2025-10-26T00:00:00Z",
  "metadata": {
    "fintechUseNum": "120230000000000000000000001",
    "productName": "KB 자유적금"
  },
  "transactions": [
    {
      "id": "uuid",
      "transactionDate": "2025-10-25T14:30:00Z",
      "amount": -50000.00,
      "balance": 1500000.00,
      "description": "편의점결제",
      "category": "PURCHASE"
    }
  ]
}

Errors:
404 Not Found - 계좌가 존재하지 않음
403 Forbidden - 본인 계좌가 아님
```

### 3.3 계좌 동기화 (일괄)
```http
POST /accounts/sync

Authorization: Bearer {token}

Request:
{
  "force": false  // true면 캐시 무시하고 강제 동기화
}

Response: 202 Accepted
{
  "jobId": "sync-job-uuid",
  "status": "pending",
  "estimatedTime": 30  // seconds
}

Background Job:
1. KFTC OAuth 토큰 확인 (없으면 401)
2. 계좌 목록 조회 (/v2.0/account/list)
3. 각 계좌별 잔액 조회 (/v2.0/account/balance/fin_num)
4. 각 계좌별 거래내역 조회 (/v2.0/account/transaction_list)
5. BankAccount + Transaction 테이블 저장

Polling:
GET /accounts/sync/{jobId}
{
  "status": "completed" | "pending" | "failed",
  "progress": 80,  // 0-100
  "accountsSynced": 8,
  "transactionsSynced": 245
}
```

### 3.4 계좌 삭제 (연결 해제)
```http
DELETE /accounts/{accountId}

Authorization: Bearer {token}

Response: 204 No Content

Effect:
- BankAccount.status → CLOSED
- Transaction 레코드는 유지 (히스토리)
```

---

## 4. 거래 내역

### 4.1 거래 내역 조회
```http
GET /transactions

Authorization: Bearer {token}

Query Params:
- accountId: uuid (required)
- from: 2025-09-01 (optional, default: 90일 전)
- to: 2025-10-26 (optional, default: 오늘)
- category: DEPOSIT | WITHDRAWAL | PURCHASE (optional)
- page: 1
- limit: 50

Response: 200 OK
{
  "transactions": [
    {
      "id": "uuid",
      "accountId": "uuid",
      "transactionDate": "2025-10-25T14:30:00Z",
      "amount": -50000.00,
      "balance": 1500000.00,
      "description": "GS25 강남점",
      "category": "PURCHASE",
      "metadata": {
        "merchant": "GS25",
        "location": "강남"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 245,
    "totalPages": 5
  },
  "summary": {
    "totalIncome": 3500000.00,
    "totalExpense": -2000000.00,
    "netFlow": 1500000.00
  }
}
```

### 4.2 거래 내역 엑스포트
```http
GET /transactions/export

Authorization: Bearer {token}

Query Params:
- accountId: uuid (required)
- from: 2025-09-01
- to: 2025-10-26
- format: csv | xlsx | pdf

Response: 200 OK
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="transactions-2025-10-26.csv"

CSV Format:
거래일시,금액,잔액,설명,카테고리
2025-10-25 14:30:00,-50000,1500000,GS25 강남점,구매
```

---

## 5. 문서 관리

### 5.1 문서 업로드
```http
POST /documents/upload

Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: (binary) PDF, JPG, PNG
- type: STATEMENT | BALANCE_CERTIFICATE | INCOME_PROOF | ID_CARD
- description: "급여 명세서 2025년 9월" (optional)

Response: 201 Created
{
  "id": "uuid",
  "type": "INCOME_PROOF",
  "originalName": "salary_2025_09.pdf",
  "fileSize": 245678,
  "mimeType": "application/pdf",
  "status": "PROCESSING",  // OCR 진행중
  "uploadedAt": "2025-10-26T00:00:00Z",
  "url": "https://qetta-storage.s3.amazonaws.com/documents/uuid.pdf"
}

Background Job:
1. S3 업로드
2. OCR 처리 (Tesseract.js 또는 Naver Clova OCR)
3. extractedText 저장
4. status → COMPLETED
```

### 5.2 문서 목록 조회
```http
GET /documents

Authorization: Bearer {token}

Query Params:
- type: STATEMENT | INCOME_PROOF (optional)
- status: PENDING | PROCESSING | COMPLETED | FAILED (optional)
- page: 1
- limit: 20

Response: 200 OK
{
  "documents": [
    {
      "id": "uuid",
      "type": "INCOME_PROOF",
      "originalName": "salary_2025_09.pdf",
      "status": "COMPLETED",
      "uploadedAt": "2025-10-26T00:00:00Z",
      "url": "https://..."
    }
  ],
  "pagination": {...}
}
```

### 5.3 문서 상세 조회
```http
GET /documents/{documentId}

Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "type": "INCOME_PROOF",
  "originalName": "salary_2025_09.pdf",
  "fileSize": 245678,
  "status": "COMPLETED",
  "extractedText": "급여명세서\n2025년 9월\n...",
  "metadata": {
    "ocrEngine": "tesseract",
    "confidence": 0.95,
    "processedAt": "2025-10-26T00:05:00Z"
  },
  "url": "https://..."
}
```

### 5.4 문서 삭제
```http
DELETE /documents/{documentId}

Authorization: Bearer {token}

Response: 204 No Content

Effect:
- S3에서 파일 삭제
- Document 레코드 삭제
```

---

## 6. 검증 (Verification)

### 6.1 문서 검증 실행
```http
POST /verify

Authorization: Bearer {token}

Request:
{
  "document": {
    "amount": 100000.00,
    "date": "2025-09-30",
    "subjectMatched": true,
    "memos": ["정상거래", "급여입금"]
  },
  "account": {
    "balance": 101000.00,
    "date": "2025-10-01",
    "memos": ["월급"]
  }
}

Response: 200 OK
{
  "id": "verification-uuid",
  "issues": [
    {
      "type": "AMOUNT_MISMATCH",
      "severity": "WARN",
      "message": "금액 불일치: 1.00% (허용: 3%)",
      "detail": {
        "documentAmount": 100000.00,
        "accountBalance": 101000.00,
        "difference": 1000.00,
        "percentage": 1.0
      }
    }
  ],
  "metrics": {
    "amountDiff": 0.01,
    "dayDiff": 1,
    "subjectMatch": true
  },
  "severity_counts": {
    "INFO": 0,
    "WARN": 1,
    "CRIT": 0
  },
  "createdAt": "2025-10-26T00:00:00Z"
}
```

### 6.2 검증 히스토리 조회
```http
GET /verifications

Authorization: Bearer {token}

Query Params:
- from: 2025-09-01 (optional)
- to: 2025-10-26 (optional)
- severity: WARN | CRIT (optional)
- page: 1
- limit: 20

Response: 200 OK
{
  "verifications": [
    {
      "id": "uuid",
      "issues": [...],
      "severity_counts": {"WARN": 1, "CRIT": 0},
      "createdAt": "2025-10-26T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

## 7. 채무 분석

### 7.1 채무 분석 실행
```http
POST /debt/analyze

Authorization: Bearer {token}

Request:
{
  "monthlyIncome": 3000000.00,
  "includeAccounts": [
    "account-uuid-1",
    "account-uuid-2"
  ],
  "options": {
    "includeCreditScore": true,  // NICE API 호출 여부
    "simulatePlans": true         // 조정안 시뮬레이션 여부
  }
}

Response: 200 OK
{
  "id": "analysis-uuid",
  "totalDebt": 50000000.00,
  "totalIncome": 3000000.00,
  "monthlyPayment": 1500000.00,
  "dti": 1666.67,  // Debt-to-Income ratio (%)
  "creditScore": 650,
  "creditGrade": "C",
  "breakdown": {
    "loans": {
      "count": 3,
      "total": 35000000.00,
      "accounts": [
        {
          "bankName": "우리은행",
          "balance": -20000000.00,
          "interestRate": 12.5
        }
      ]
    },
    "creditCards": {
      "count": 2,
      "total": 15000000.00,
      "accounts": [...]
    }
  },
  "recommendations": [
    {
      "planType": "SHINBOK_PRE_WORKOUT",
      "adjustedPayment": 900000.00,
      "adjustedInterestRate": 8.0,
      "estimatedPeriod": 36,
      "totalSavings": 10800000.00,
      "debtReductionRate": 0,
      "isRecommended": true,
      "conditions": {
        "eligibility": "총 부채 5억 이하, 소득 있는 자",
        "requirements": ["채무 증빙", "소득 증빙"]
      }
    },
    {
      "planType": "FRESH_START_FUND",
      "adjustedPayment": 500000.00,
      "adjustedInterestRate": 5.0,
      "estimatedPeriod": 60,
      "totalSavings": 25000000.00,
      "debtReductionRate": 0.3,  // 30% 탕감
      "isRecommended": false,
      "conditions": {...}
    }
  ],
  "analyzedAt": "2025-10-26T00:00:00Z"
}

Background Job:
1. 지정된 계좌들의 부채 합계
2. DTI 계산
3. 신용등급 추정 (NICE API 있으면 조회)
4. 정책 매칭 (packages/debt-analyzer)
5. 조정안 시뮬레이션
6. DebtAnalysis + RestructuringPlan 저장
```

### 7.2 분석 결과 조회
```http
GET /debt/analyses/{analysisId}

Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "totalDebt": 50000000.00,
  "dti": 1666.67,
  "recommendations": [...],
  "analyzedAt": "2025-10-26T00:00:00Z"
}
```

### 7.3 분석 히스토리
```http
GET /debt/analyses

Authorization: Bearer {token}

Query Params:
- page: 1
- limit: 10

Response: 200 OK
{
  "analyses": [
    {
      "id": "uuid",
      "totalDebt": 50000000.00,
      "dti": 1666.67,
      "creditGrade": "C",
      "analyzedAt": "2025-10-26T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### 7.4 조정안 시뮬레이션 (단독)
```http
POST /debt/simulate

Authorization: Bearer {token}

Request:
{
  "planType": "SHINBOK_PRE_WORKOUT",
  "totalDebt": 50000000.00,
  "currentPayment": 1500000.00,
  "currentInterestRate": 12.5
}

Response: 200 OK
{
  "planType": "SHINBOK_PRE_WORKOUT",
  "adjustedPayment": 900000.00,
  "adjustedInterestRate": 8.0,
  "estimatedPeriod": 36,
  "totalSavings": 10800000.00,
  "monthlyReduction": 600000.00,
  "breakdown": {
    "before": {
      "principal": 50000000.00,
      "interest": 14000000.00,
      "total": 64000000.00
    },
    "after": {
      "principal": 50000000.00,
      "interest": 3200000.00,
      "total": 53200000.00
    }
  }
}
```

---

## 8. 신청서 (Applications)

### 8.1 신청서 생성 (임시저장)
```http
POST /applications

Authorization: Bearer {token}

Request:
{
  "analysisId": "analysis-uuid",
  "planId": "plan-uuid",
  "applicationType": "SHINBOK_PRE_WORKOUT",
  "formData": {
    "personalInfo": {
      "name": "홍길동",
      "ssn": "901234-1******",  // 마스킹
      "address": "서울시 강남구",
      "phoneNumber": "01012345678",
      "email": "hong@example.com"
    },
    "debtInfo": {
      "totalDebt": 50000000.00,
      "creditors": [
        {
          "name": "우리은행",
          "type": "대출",
          "balance": 20000000.00,
          "interestRate": 12.5
        }
      ]
    },
    "incomeInfo": {
      "monthlyIncome": 3000000.00,
      "source": "급여",
      "employmentStatus": "재직중"
    },
    "propertyInfo": {
      "hasProperty": false,
      "hasVehicle": true,
      "vehicleValue": 10000000.00
    }
  }
}

Response: 201 Created
{
  "id": "application-uuid",
  "applicationNumber": "QB2025102600001",  // 자동 생성
  "status": "DRAFT",
  "applicationType": "SHINBOK_PRE_WORKOUT",
  "createdAt": "2025-10-26T00:00:00Z"
}
```

### 8.2 신청서 수정
```http
PATCH /applications/{applicationId}

Authorization: Bearer {token}

Request:
{
  "formData": {
    "personalInfo": {
      "phoneNumber": "01098765432"  // 수정
    }
  }
}

Response: 200 OK
{
  "id": "uuid",
  "status": "DRAFT",
  "updatedAt": "2025-10-26T00:00:00Z"
}
```

### 8.3 신청서 PDF 생성
```http
POST /applications/{applicationId}/generate-pdf

Authorization: Bearer {token}

Response: 202 Accepted
{
  "jobId": "pdf-job-uuid",
  "status": "pending",
  "estimatedTime": 10
}

Background Job:
1. formData 기반 PDF 생성 (PDFKit)
2. S3 업로드
3. Application.pdfPath 업데이트

Polling:
GET /applications/{applicationId}/pdf
{
  "status": "completed",
  "pdfUrl": "https://qetta-storage.s3.amazonaws.com/applications/uuid.pdf"
}
```

### 8.4 신청서 제출
```http
POST /applications/{applicationId}/submit

Authorization: Bearer {token}

Request:
{
  "attachedDocuments": [
    "document-uuid-1",  // 소득 증빙
    "document-uuid-2"   // 신분증
  ]
}

Response: 200 OK
{
  "id": "uuid",
  "applicationNumber": "QB2025102600001",
  "status": "SUBMITTED",
  "submittedAt": "2025-10-26T00:00:00Z",
  "submissionRef": "shinbok-ref-123456",  // 신복위 참조번호
  "trackingUrl": "https://www.ccrs.or.kr/tracking/123456"
}

Effect:
- Application.status → SUBMITTED
- ApplicationDocument 레코드 생성 (N개)
- 이메일 알림 발송
- (Optional) 신복위 API 호출하여 전자 제출
```

### 8.5 신청서 조회
```http
GET /applications/{applicationId}

Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "applicationNumber": "QB2025102600001",
  "status": "SUBMITTED",
  "applicationType": "SHINBOK_PRE_WORKOUT",
  "formData": {...},
  "pdfUrl": "https://...",
  "attachedDocuments": [
    {
      "id": "doc-uuid",
      "type": "INCOME_PROOF",
      "originalName": "salary.pdf",
      "isVerified": true
    }
  ],
  "submittedAt": "2025-10-26T00:00:00Z",
  "createdAt": "2025-10-25T00:00:00Z"
}
```

### 8.6 신청서 목록
```http
GET /applications

Authorization: Bearer {token}

Query Params:
- status: DRAFT | SUBMITTED | UNDER_REVIEW | APPROVED (optional)
- page: 1
- limit: 10

Response: 200 OK
{
  "applications": [
    {
      "id": "uuid",
      "applicationNumber": "QB2025102600001",
      "status": "SUBMITTED",
      "applicationType": "SHINBOK_PRE_WORKOUT",
      "submittedAt": "2025-10-26T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### 8.7 신청서 철회
```http
POST /applications/{applicationId}/withdraw

Authorization: Bearer {token}

Request:
{
  "reason": "개인 사정으로 인한 철회"
}

Response: 200 OK
{
  "id": "uuid",
  "status": "WITHDRAWN",
  "updatedAt": "2025-10-26T00:00:00Z"
}
```

---

## 9. 사용자 관리

### 9.1 내 정보 조회
```http
GET /users/me

Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "phoneNumber": "01012345678",
  "subscription": {
    "tier": "STARTER",
    "status": "ACTIVE",
    "currentPeriodEnd": "2025-11-26T00:00:00Z"
  },
  "usage": {
    "verification": 45,
    "debtAnalysis": 2,
    "applications": 1
  },
  "createdAt": "2025-09-01T00:00:00Z"
}
```

### 9.2 내 정보 수정
```http
PATCH /users/me

Authorization: Bearer {token}

Request:
{
  "name": "홍길순",
  "phoneNumber": "01098765432"
}

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길순",
  "updatedAt": "2025-10-26T00:00:00Z"
}
```

### 9.3 비밀번호 변경
```http
POST /users/me/change-password

Authorization: Bearer {token}

Request:
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}

Response: 204 No Content
```

### 9.4 계정 삭제
```http
DELETE /users/me

Authorization: Bearer {token}

Request:
{
  "password": "SecurePass123!",
  "confirmText": "DELETE"
}

Response: 204 No Content

Effect:
- User 레코드 삭제 (CASCADE)
- 모든 관련 데이터 삭제
- OAuth 연결 해제
- S3 파일 삭제 (비동기)
```

---

## 10. 구독/결제

### 10.1 구독 플랜 조회
```http
GET /billing/plans

Response: 200 OK
{
  "plans": [
    {
      "tier": "FREE",
      "name": "무료",
      "price": 0,
      "limits": {
        "verification": 10,
        "debtAnalysis": 1,
        "applications": 0
      },
      "features": [
        "기본 검증",
        "계좌 연동 (최대 3개)"
      ]
    },
    {
      "tier": "STARTER",
      "name": "스타터",
      "price": 29000,
      "priceId": "price_...",  // Stripe Price ID
      "limits": {
        "verification": 200,
        "debtAnalysis": 10,
        "applications": 3
      },
      "features": [
        "무제한 계좌 연동",
        "채무 분석",
        "조정 시뮬레이션"
      ]
    },
    {
      "tier": "PRO",
      "name": "프로",
      "price": 199000,
      "priceId": "price_...",
      "limits": {
        "verification": -1,  // 무제한
        "debtAnalysis": -1,
        "applications": -1
      },
      "features": [
        "무제한 검증",
        "신청서 자동 생성",
        "우선 지원"
      ]
    }
  ]
}
```

### 10.2 구독 결제 시작 (Stripe Checkout)
```http
POST /billing/checkout

Authorization: Bearer {token}

Request:
{
  "tier": "STARTER"
}

Response: 200 OK
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_..."
}

Flow:
1. Stripe Checkout Session 생성
2. 사용자를 Stripe 결제 페이지로 리다이렉트
3. 결제 완료 시 Webhook 수신
4. Subscription 테이블 생성/업데이트
```

### 10.3 구독 취소
```http
POST /billing/cancel

Authorization: Bearer {token}

Response: 200 OK
{
  "subscription": {
    "tier": "STARTER",
    "status": "ACTIVE",
    "cancelAtPeriodEnd": true,  // 기간 종료 시 취소
    "currentPeriodEnd": "2025-11-26T00:00:00Z"
  }
}
```

### 10.4 Stripe Webhook (내부용)
```http
POST /webhooks/stripe

Headers:
- stripe-signature: {signature}

Body: (Stripe Event)

Events:
- checkout.session.completed → 구독 시작
- invoice.payment_succeeded → 결제 성공
- invoice.payment_failed → 결제 실패
- customer.subscription.deleted → 구독 취소
```

---

## 📊 공통 응답 형식

### 성공 응답
```json
{
  "data": {...},
  "meta": {
    "timestamp": "2025-10-26T00:00:00Z",
    "requestId": "req-uuid"
  }
}
```

### 에러 응답
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "email": ["이메일 형식이 올바르지 않습니다"]
    },
    "requestId": "req-uuid"
  }
}
```

### 에러 코드
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | 입력 검증 실패 |
| UNAUTHORIZED | 401 | 인증 실패 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| CONFLICT | 409 | 중복 리소스 |
| RATE_LIMIT_EXCEEDED | 429 | Rate limit 초과 |
| EXTERNAL_API_ERROR | 502 | 외부 API 오류 |
| INTERNAL_SERVER_ERROR | 500 | 서버 오류 |

---

## 🔒 인증 헤더

모든 인증 필요 엔드포인트:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚡ Rate Limiting

```
기본: 100 requests / minute (IP 기준)
인증된 사용자: 500 requests / minute
PRO 플랜: 2000 requests / minute

초과 시:
HTTP 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

---

**마지막 업데이트**: 2025-10-26  
**API 버전**: v1.0.0  
**Contact**: dev@qetta.io
