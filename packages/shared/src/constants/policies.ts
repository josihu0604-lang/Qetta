/**
 * Debt relief policy information
 */

export interface PolicyInfo {
  name: string;
  nameKo: string;
  description: string;
  eligibilityCriteria: {
    minDTI?: number;
    maxDTI?: number;
    minIncome?: number;
    maxIncome?: number;
    minDebt?: number;
    maxDebt?: number;
  };
  benefits: string[];
  requiredDocuments: string[];
  processingTime: string;
  contactInfo: {
    organization: string;
    phone: string;
    website: string;
    address?: string;
  };
}

/**
 * Credit Counseling (신용회복위원회 채무조정)
 */
export const CREDIT_COUNSELING_POLICY: PolicyInfo = {
  name: 'CREDIT_COUNSELING',
  nameKo: '신용회복위원회 채무조정',
  description:
    '신용회복위원회를 통해 채무를 조정하고 이자율을 낮춰 상환 부담을 줄이는 제도입니다.',
  eligibilityCriteria: {
    minDTI: 100,
    maxDebt: 1000000000, // 10억원
  },
  benefits: [
    '이자율 인하 (연 6~12%)',
    '상환 기간 연장 (최대 10년)',
    '연체이자 감면',
    '채권추심 중지',
  ],
  requiredDocuments: [
    '본인 신청서',
    '소득 증빙 서류',
    '채무 불이행 증빙',
    '주민등록등본',
    '가족관계증명서',
  ],
  processingTime: '2~4주',
  contactInfo: {
    organization: '신용회복위원회',
    phone: '1600-5500',
    website: 'https://www.ccrs.or.kr',
    address: '서울특별시 중구 남대문로 9길 39',
  },
};

/**
 * Fresh Start Fund (새출발기금)
 */
export const FRESH_START_FUND_POLICY: PolicyInfo = {
  name: 'FRESH_START_FUND',
  nameKo: '새출발기금',
  description:
    '저소득·저신용 채무자를 위한 채무 감면 프로그램으로, 최대 70%의 채무를 탕감받을 수 있습니다.',
  eligibilityCriteria: {
    minDTI: 150,
    maxIncome: 3000000, // 월 300만원 이하
    maxDebt: 50000000, // 5000만원 이하
  },
  benefits: [
    '채무 최대 70% 감면',
    '8년 분할 상환',
    '이자율 최대 5%',
    '신용회복 지원',
  ],
  requiredDocuments: [
    '새출발기금 신청서',
    '소득 증빙 서류 (최근 3개월)',
    '재산 증빙 서류',
    '신용회복위원회 추천서',
    '가족관계증명서',
  ],
  processingTime: '4~8주',
  contactInfo: {
    organization: '새출발기금',
    phone: '1661-1378',
    website: 'https://www.ssgfund.or.kr',
  },
};

/**
 * Personal Rehabilitation (개인회생)
 */
export const PERSONAL_REHABILITATION_POLICY: PolicyInfo = {
  name: 'PERSONAL_REHABILITATION',
  nameKo: '개인회생',
  description:
    '법원의 승인을 받아 채무를 조정하고 3~5년간 변제계획에 따라 상환하는 법적 절차입니다.',
  eligibilityCriteria: {
    minDTI: 200,
    minDebt: 50000000, // 5000만원 이상
    maxDebt: 2000000000, // 20억원 이하
  },
  benefits: [
    '채무 일부 면제',
    '3~5년 변제 기간',
    '강제집행 중지',
    '면책 후 신용회복',
  ],
  requiredDocuments: [
    '개인회생 신청서',
    '채권자 목록',
    '재산 목록',
    '소득 증빙 서류',
    '가계 수입·지출 내역',
    '변제계획안',
  ],
  processingTime: '6~12개월',
  contactInfo: {
    organization: '법원 회생과',
    phone: '1544-0209',
    website: 'https://www.scourt.go.kr',
  },
};

/**
 * All policies map
 */
export const POLICIES: Record<string, PolicyInfo> = {
  CREDIT_COUNSELING: CREDIT_COUNSELING_POLICY,
  FRESH_START_FUND: FRESH_START_FUND_POLICY,
  PERSONAL_REHABILITATION: PERSONAL_REHABILITATION_POLICY,
};
