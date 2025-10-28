# QETTA OAuth 자격증명 정보

**⚠️ 주의**: 이 파일은 민감한 정보를 포함하고 있습니다. 절대 Git에 커밋하지 마세요!

---

## 🏦 금융결제원 오픈뱅킹 (KFTC OpenBanking)

### 개발자 계정
- **사이트**: https://testapi.openbanking.or.kr
- **ID**: `assembcho@gmail.com`
- **PW**: `Gede0603!!`

### OAuth 클라이언트 정보
- **Client ID**: `d45b5d59-e571-436a-9675-aa5048e09489`
- **Client Secret**: `8dc9537a-395b-46a5-90db-8d362a7fde6f`
- **Redirect URI**: `https://earnest-mandazi-7b1555.netlify.app/oauth/kftc/callback`
  - ⚠️ **변경 필요**: 실제 프로덕션 URL로 변경
  - 로컬 개발: `http://localhost:3000/oauth/kftc/callback`
  - 프로덕션: `https://qetta.vercel.app/oauth/kftc/callback`

### OAuth 엔드포인트
- **Authorization URL**: `https://testapi.openbanking.or.kr/oauth/2.0/authorize`
- **Token URL**: `https://testapi.openbanking.or.kr/oauth/2.0/token`
- **API Base URL**: `https://testapi.openbanking.or.kr`

### 테스트 토큰 정보
- **Access Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAxMDczMzg5Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNzY5MDQzNDI1LCJqdGkiOiIxM2Q5ZmUzOS05ODRkLTRkZTctYTJhZi1lZjgyZTE5Y2YyNDgifQ.CbMORzFN54kkxtT324Aun9ganc7TzBkLTbNrl8oH_q0`
- **Token Type**: `Bearer`
- **Scope**: `inquiry login`

---

## 💳 토스페이먼츠 (Toss Payments)

### 개발자 계정
- **사이트**: https://developers.toss.im
- **ID**: `assembcho@gmail.com`
- **PW**: `Abc0315!`

### OAuth 엔드포인트 (Toss 인증 API)
- **OAuth Base**: `https://oauth2.cert.toss.im`
- **Token URL**: `https://oauth2.cert.toss.im/token`
- **API Base**: `https://cert.toss.im`

### 테스트 자격증명 (개발/테스트용)
- **Client ID**: `test_a8e23336d673ca70922b485fe806eb2d`
- **Client Secret**: `test_418087247d66da09fda1964dc4734e453c7cf66a7a9e3`
- **Grant Type**: `client_credentials`
- **Scope**: `ca`

### 프로덕션 자격증명
⚠️ **TODO**: 토스 개발자 포털에서 프로덕션 Client ID/Secret 발급 필요

---

## 🔧 환경변수 설정 가이드

### services/api/.env
```bash
# KFTC OpenBanking
KFTC_CLIENT_ID=d45b5d59-e571-436a-9675-aa5048e09489
KFTC_CLIENT_SECRET=8dc9537a-395b-46a5-90db-8d362a7fde6f
KFTC_REDIRECT_URI=http://localhost:3001/api/v1/oauth/kftc/callback
KFTC_AUTHORIZE_URL=https://testapi.openbanking.or.kr/oauth/2.0/authorize
KFTC_TOKEN_URL=https://testapi.openbanking.or.kr/oauth/2.0/token
KFTC_API_BASE_URL=https://testapi.openbanking.or.kr

# Toss 인증 API
TOSS_OAUTH_BASE=https://oauth2.cert.toss.im
TOSS_TOKEN_URL=https://oauth2.cert.toss.im/token
TOSS_API_BASE=https://cert.toss.im
TOSS_CLIENT_ID=test_a8e23336d673ca70922b485fe806eb2d
TOSS_CLIENT_SECRET=test_418087247d66da09fda1964dc4734e453c7cf66a7a9e3
TOSS_GRANT_TYPE=client_credentials
TOSS_SCOPE=ca
```

### services/web/.env.local
```bash
# Frontend OAuth Redirect URLs
NEXT_PUBLIC_KFTC_REDIRECT_URI=http://localhost:3000/oauth/kftc/callback
NEXT_PUBLIC_TOSS_REDIRECT_URI=http://localhost:3000/oauth/toss/callback
```

---

## 📝 OAuth Flow 요약

### KFTC OpenBanking Flow
1. **Authorization Request**:
   ```
   GET https://testapi.openbanking.or.kr/oauth/2.0/authorize
     ?response_type=code
     &client_id=d45b5d59-e571-436a-9675-aa5048e09489
     &redirect_uri=<encoded_callback_url>
     &scope=login inquiry
     &state=<random_state>
     &auth_type=0
   ```

2. **Token Exchange**:
   ```
   POST https://testapi.openbanking.or.kr/oauth/2.0/token
   Content-Type: application/x-www-form-urlencoded
   
   code=<authorization_code>
   &client_id=d45b5d59-e571-436a-9675-aa5048e09489
   &client_secret=8dc9537a-395b-46a5-90db-8d362a7fde6f
   &redirect_uri=<callback_url>
   &grant_type=authorization_code
   ```

### Toss 인증 Flow
1. **Token Request** (Client Credentials):
   ```
   POST https://oauth2.cert.toss.im/token
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=client_credentials
   &scope=ca
   &client_id=test_a8e23336d673ca70922b485fe806eb2d
   &client_secret=test_418087247d66da09fda1964dc4734e453c7cf66a7a9e3
   ```

2. **API Call**:
   ```
   GET https://cert.toss.im/{service}/v1/{resource}/{id}
   Authorization: Bearer <access_token>
   Content-Type: application/json
   ```

---

## 🚨 보안 주의사항

1. **절대 Git에 커밋하지 말 것**:
   - `.gitignore`에 이 파일 추가
   - 환경변수 파일 (`.env`) 커밋 금지

2. **암호화 필수**:
   - DB 저장 시 AES-256-GCM 암호화
   - 로그에서 자동 마스킹

3. **Redirect URI 검증**:
   - KFTC: 개발자 포털에서 등록된 URI만 허용
   - Toss: OAuth 방식이 아니므로 해당 없음 (Client Credentials)

4. **프로덕션 전환 체크리스트**:
   - [ ] KFTC: testapi → api.openbanking.or.kr 변경
   - [ ] Toss: test_ 접두사 제거, 프로덕션 자격증명 발급
   - [ ] Redirect URI를 프로덕션 도메인으로 변경
   - [ ] 모든 자격증명 환경변수로 관리

---

**작성일**: 2025-10-28  
**상태**: ✅ KFTC 테스트 토큰 발급 완료, Toss 테스트 자격증명 준비 완료
