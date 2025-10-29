# Hephaitos 개발 환경 셋업 가이드

**대상**: 신규 개발자, AI 에이전트  
**소요 시간**: 30-60분

---

## 🚀 빠른 시작 (Quick Start)

```bash
# 1. 저장소 클론
git clone https://github.com/yourorg/hephaitos.git
cd hephaitos

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일 수정 (아래 참고)

# 4. 데이터베이스 설정
npm run db:setup

# 5. 개발 서버 시작
npm run dev
```

---

## 📋 사전 요구사항

### 필수 설치
```bash
# Node.js 20+ (LTS)
node --version  # v20.0.0+

# npm 10+
npm --version   # 10.0.0+

# Docker & Docker Compose
docker --version        # 24.0.0+
docker-compose --version # 2.20.0+

# PostgreSQL Client (선택)
psql --version  # 16.0+
```

### 권장 도구
```bash
# VS Code 확장
- Prisma
- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense

# CLI 도구
- pnpm (대신 npm 가능)
- turbo (Turborepo)
```

---

## 🗄️ 데이터베이스 설정

### 방법 1: Docker (권장)

```bash
# docker-compose.yml이 프로젝트 루트에 있음
docker-compose up -d postgres redis

# 확인
docker-compose ps
```

### 방법 2: 로컬 설치

```bash
# PostgreSQL 16 설치 (Ubuntu)
sudo apt update
sudo apt install postgresql-16

# 데이터베이스 생성
sudo -u postgres psql
CREATE DATABASE hephaitos_dev;
CREATE USER hephaitos WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hephaitos_dev TO hephaitos;
\q

# Redis 설치
sudo apt install redis-server
sudo systemctl start redis-server
```

### Prisma 마이그레이션

```bash
# 1. Prisma Client 생성
cd services/api
npx prisma generate

# 2. 마이그레이션 실행
npx prisma migrate dev --name init

# 3. 시드 데이터 (선택)
npx prisma db seed

# 4. Prisma Studio (DB GUI)
npx prisma studio
# http://localhost:5555
```

---

## 🔐 환경 변수 설정

### services/api/.env

```bash
# Node Environment
NODE_ENV=development

# Server
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL="postgresql://hephaitos:password@localhost:5432/hephaitos_dev?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="24h"

# Encryption (AES-256-GCM)
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
# 생성 방법: openssl rand -hex 32

# Toss 인증
TOSS_CLIENT_ID="your_toss_client_id"
TOSS_CLIENT_SECRET="your_toss_client_secret"
TOSS_REDIRECT_URI="http://localhost:3001/oauth/toss/callback"

# KFTC 오픈뱅킹 (테스트)
KFTC_CLIENT_ID="your_kftc_client_id"
KFTC_CLIENT_SECRET="your_kftc_client_secret"
KFTC_REDIRECT_URI="http://localhost:3001/oauth/kftc/callback"
KFTC_BASE_URL="https://testapi.openbanking.or.kr"

# AWS S3
S3_BUCKET="hephaitos-dev"
S3_REGION="ap-northeast-2"
S3_ACCESS_KEY_ID="your_access_key"
S3_SECRET_ACCESS_KEY="your_secret_key"

# NICE 신용평가 (선택)
NICE_CLIENT_ID="your_nice_client_id"
NICE_CLIENT_SECRET="your_nice_client_secret"

# Monitoring
SENTRY_DSN="https://xxx@sentry.io/xxx"
DATADOG_API_KEY="your_datadog_api_key"

# CORS
CORS_ORIGINS="http://localhost:3001,http://localhost:3000"

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000

# Email (선택)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASSWORD="your_app_password"
```

### services/web/.env.local

```bash
# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"

# Environment
NODE_ENV=development

# Analytics (선택)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

---

## 🏗️ 프로젝트 구조 설정

### Turborepo 설정

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "db:migrate": {
      "cache": false
    }
  }
}
```

### 워크스페이스 설정

```json
// package.json (root)
{
  "name": "hephaitos",
  "private": true,
  "workspaces": [
    "packages/*",
    "services/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "db:setup": "cd services/api && npx prisma migrate dev",
    "db:studio": "cd services/api && npx prisma studio",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  }
}
```

---

## 🧪 테스트 환경 설정

### Vitest 설정 (Unit Tests)

```typescript
// services/api/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts'
      ]
    },
    setupFiles: ['./tests/setup.ts']
  }
});
```

### Playwright 설정 (E2E Tests)

```typescript
// services/web/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 🐳 Docker 개발 환경

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: hephaitos-postgres
    environment:
      POSTGRES_DB: hephaitos_dev
      POSTGRES_USER: hephaitos
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hephaitos"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: hephaitos-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  localstack:
    image: localstack/localstack
    container_name: hephaitos-localstack
    ports:
      - "4566:4566"
    environment:
      SERVICES: s3
      DEFAULT_REGION: ap-northeast-2
      DATA_DIR: /tmp/localstack/data
    volumes:
      - localstack_data:/tmp/localstack

volumes:
  postgres_data:
  redis_data:
  localstack_data:
```

### 시작 명령어

```bash
# 모든 서비스 시작
docker-compose up -d

# 특정 서비스만
docker-compose up -d postgres redis

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down

# 볼륨까지 삭제
docker-compose down -v
```

---

## 🔧 개발 워크플로우

### 1. 새 기능 개발

```bash
# 1. 브랜치 생성
git checkout -b feature/oauth-integration

# 2. 개발 서버 시작
npm run dev

# 3. 코드 작성
# services/api/src/lib/toss.ts

# 4. 테스트 작성 및 실행
npm run test

# 5. Lint & Format
npm run lint
npm run format

# 6. 커밋
git add .
git commit -m "feat: add Toss OAuth integration"

# 7. 푸시 및 PR
git push origin feature/oauth-integration
```

### 2. 데이터베이스 변경

```bash
# 1. schema.prisma 수정
# services/api/prisma/schema.prisma

# 2. 마이그레이션 생성
cd services/api
npx prisma migrate dev --name add_external_auth_table

# 3. Prisma Client 재생성
npx prisma generate

# 4. 코드에서 사용
# import { prisma } from './lib/prisma'
```

### 3. 디버깅

```bash
# Backend (Fastify)
NODE_ENV=development DEBUG=* npm run dev

# Frontend (Next.js)
npm run dev

# Prisma 쿼리 로그
# services/api/src/lib/prisma.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});
```

---

## 📝 코드 스타일

### ESLint 설정

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Prettier 설정

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## 🔍 트러블슈팅

### PostgreSQL 연결 오류

```bash
# 에러: ECONNREFUSED 127.0.0.1:5432
# 해결:
docker-compose ps  # 컨테이너 상태 확인
docker-compose logs postgres  # 로그 확인
docker-compose restart postgres
```

### Prisma 마이그레이션 실패

```bash
# 에러: Migration failed
# 해결:
npx prisma migrate reset  # DB 초기화 (주의: 데이터 삭제)
npx prisma migrate dev
```

### Port 충돌

```bash
# 에러: EADDRINUSE :::3000
# 해결:
lsof -ti:3000 | xargs kill -9  # 프로세스 종료
# 또는 .env에서 PORT 변경
```

### TypeScript 오류

```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# Prisma Client 재생성
npx prisma generate
```

---

## 📚 추가 리소스

### 공식 문서
- Fastify: https://www.fastify.io/docs
- Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs
- Shadcn UI: https://ui.shadcn.com

### 내부 문서
- DATABASE_SCHEMA.md
- ARCHITECTURE.md
- API_SPECIFICATION.md
- FRONTEND_COMPONENTS.md

### 외부 API 문서
- KFTC 오픈뱅킹: openbanking_local_callback_guide.html
- Toss 인증: toss_auth_api.html
- NICE 신용평가: (별도 제공)

---

## ✅ 설정 완료 체크리스트

```
□ Node.js 20+ 설치 확인
□ Docker 설치 및 실행 확인
□ 저장소 클론 완료
□ npm install 완료
□ .env 파일 설정 완료
□ PostgreSQL 연결 확인
□ Redis 연결 확인
□ Prisma 마이그레이션 완료
□ npm run dev 정상 실행
□ http://localhost:3000/health 접근 가능
□ http://localhost:3001 접근 가능
□ Prisma Studio 접근 가능
□ 테스트 실행 가능 (npm run test)
```

---

**설정 완료!** 이제 개발을 시작할 준비가 되었습니다. 🎉

**다음 단계**: MASTER_PROMPT_V2_FINAL.md를 읽고 Phase 1부터 시작하세요.
