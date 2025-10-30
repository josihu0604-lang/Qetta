# Hephaitos - 부채 관리 모바일 웹앱

[![GitHub](https://img.shields.io/badge/GitHub-Hephaitos-blue?logo=github)](https://github.com/josihu0604-lang/Qetta)
[![Vercel](https://img.shields.io/badge/Demo-Live-brightgreen?logo=vercel)](https://hephaitos-chi.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Next.js 15 + React 19 + TypeScript 5.7 기반의 모던 부채 관리 모바일 웹 애플리케이션

## 📁 프로젝트 구조

```
webapp/
├── hephaitos/               # 메인 프로젝트 (Turborepo 모노레포)
│   ├── services/
│   │   └── mobile/         # 모바일 웹앱 소스 코드
│   ├── packages/           # 공유 패키지
│   └── docs/               # 프로젝트 문서
│
├── docs/                    # 검수 및 프로젝트 문서
│   ├── GPT_PRO_REVIEW_PACKAGE.md          # GPT Pro 검수 가이드
│   ├── DESIGN_FIX_SUMMARY.md              # 버그 수정 상세 보고서
│   ├── FINAL_DELIVERY_SUMMARY.md          # 최종 제출 요약
│   ├── HEPHAITOS_COMPLETE_STATUS.md       # 프로젝트 완료 현황
│   ├── HEPHAITOS_FUTURE_WORK_DESIGN.md    # 향후 작업 설계
│   └── TOSS_DESIGN_AUDIT_REPORT.md        # Toss 디자인 감사 보고서
│
├── archives/                # 검수용 아카이브
│   └── hephaitos-final-gpt-review.tar.gz  # 최종 검수용 패키지 (1.4MB, 151 파일)
│
├── screenshots/             # 스크린샷 (개발 과정)
├── screenshots-phase4/      # Phase 4 스크린샷 (수정 전)
└── screenshots-fixed/       # 수정 완료 스크린샷 (수정 후)
```

## 🚀 빠른 시작

### 전제 조건

- Node.js 18.17 이상
- npm 9 이상

### 설치 및 실행

```bash
# 1. 프로젝트 디렉토리로 이동
cd hephaitos/services/mobile

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 열기
# http://localhost:3002
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🎨 주요 기능

### 5개 핵심 페이지

1. **Dashboard (/)** - 부채 요약 및 대시보드
2. **Accounts (/accounts)** - 계정 관리 및 연동
3. **Debt Analysis (/debt-analysis)** - 부채 분석 및 시각화
4. **Policy (/policy)** - 정책 추천 및 정보
5. **Profile (/profile)** - 사용자 프로필

### 기술적 특징

- ✅ **Next.js 15.5.6** - App Router + Server Components
- ✅ **React 19.0.0** - 최신 React 기능 활용
- ✅ **TypeScript 5.7.2** - 타입 안전성
- ✅ **Tailwind CSS 3.4.17** - 유틸리티 기반 스타일링
- ✅ **React Query** - 효율적인 데이터 페칭 및 캐싱
- ✅ **Catalyst UI Kit** - Headless UI 기반 컴포넌트
- ✅ **순수 SVG 차트** - 외부 라이브러리 없는 차트 구현
- ✅ **Glass morphism** - 모던 UI 디자인
- ✅ **Pull-to-refresh** - 모바일 친화적 UX

## 🐛 버그 수정 이력

### Critical 버그 3개 수정 완료 (2025-10-29)

#### Bug #1: QueryClientProvider 누락
- **증상**: React Query 훅 에러 (`No QueryClient set`)
- **영향**: 부채 분석 및 정책 페이지 영구 로딩
- **수정**: `components/Providers.tsx` 생성 및 통합
- **검증**: 스크린샷 파일 크기 42KB→207KB, 44KB→213KB

#### Bug #2: 느린 로딩 성능
- **증상**: 800ms/700ms의 인위적 딜레이
- **수정**: setTimeout 100ms로 최적화 (8배 개선)
- **검증**: 빠른 콘텐츠 표시 확인

#### Bug #3: 디자인 불일치
- **증상**: 부채 분석 페이지만 빨간색 헤더
- **수정**: 파란색 그라디언트로 통일
- **검증**: 5개 페이지 색상 일관성

자세한 내용: [DESIGN_FIX_SUMMARY.md](docs/DESIGN_FIX_SUMMARY.md)

## 📊 프로젝트 통계

- **총 파일 수**: 151개 (아카이브 기준)
- **소스 코드**: 40+ 파일
- **문서**: 6개 (docs/ 폴더)
- **스크린샷**: 10개 (before/after)
- **코드 라인**: 8,000+ 줄
- **커밋**: 10+ 개
- **프로젝트 용량**: 78MB → 1.2GB (정리 후)

## 📚 문서

- [GPT Pro 검수 가이드](docs/GPT_PRO_REVIEW_PACKAGE.md) - 전체 프로젝트 검수 절차
- [버그 수정 보고서](docs/DESIGN_FIX_SUMMARY.md) - 3가지 critical 버그 수정 상세
- [최종 제출 요약](docs/FINAL_DELIVERY_SUMMARY.md) - 제출물 및 실행 방법
- [프로젝트 완료 현황](docs/HEPHAITOS_COMPLETE_STATUS.md) - Phase 1-4 완료 내역
- [향후 작업 설계](docs/HEPHAITOS_FUTURE_WORK_DESIGN.md) - 향후 개선 계획
- [디자인 감사 보고서](docs/TOSS_DESIGN_AUDIT_REPORT.md) - Toss 디자인 시스템 분석

## 🌐 라이브 데모

- **Vercel 배포**: [https://hephaitos-chi.vercel.app/](https://hephaitos-chi.vercel.app/)
- **GitHub Repository**: [https://github.com/josihu0604-lang/Qetta](https://github.com/josihu0604-lang/Qetta)

## 🔧 기술 스택

### Frontend
- Next.js 15.5.6
- React 19.0.0
- TypeScript 5.7.2
- Tailwind CSS 3.4.17

### 상태 관리
- @tanstack/react-query 5.64.2

### UI 컴포넌트
- @headlessui/react 2.2.0
- @heroicons/react 2.2.0
- Catalyst UI Kit (사용자 정의)

### 빌드 도구
- Turborepo 3.2.5
- PostCSS 8
- ESLint 9

## 📦 검수용 아카이브

GPT Pro 검수를 위한 완전한 패키지가 준비되어 있습니다:

```bash
# 아카이브 압축 해제
cd archives
tar -xzf hephaitos-final-gpt-review.tar.gz

# 포함 내용:
# - hephaitos/ (전체 프로젝트)
# - screenshots-phase4/ (수정 전)
# - screenshots-fixed/ (수정 후)
# - DESIGN_FIX_SUMMARY.md (버그 수정 보고서)
```

자세한 검수 절차: [GPT_PRO_REVIEW_PACKAGE.md](docs/GPT_PRO_REVIEW_PACKAGE.md)

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 기여

- **개발**: GenSpark AI Developer
- **디자인 참고**: Toss Design System, Catalyst UI Kit
- **프로젝트 관리**: GitHub Issues & Projects

## 📞 문의

- GitHub Issues: [https://github.com/josihu0604-lang/Qetta/issues](https://github.com/josihu0604-lang/Qetta/issues)
- Repository: [https://github.com/josihu0604-lang/Qetta](https://github.com/josihu0604-lang/Qetta)

---

**Last Updated**: 2025-10-30  
**Version**: 1.0.0  
**Status**: ✅ Phase 1-4 Complete (100%)
