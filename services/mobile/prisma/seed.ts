import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.recommendation.deleteMany()
  await prisma.policy.deleteMany()
  await prisma.debtHistory.deleteMany()
  await prisma.debt.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Cleaned existing data')

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'hephaitos@example.com',
      name: '김헤파',
      phone: '010-1234-5678',
      birthDate: '1990-01-01',
    },
  })

  console.log('✅ Created user:', user.email)

  // Create accounts
  const account1 = await prisma.account.create({
    data: {
      userId: user.id,
      provider: 'bank',
      providerName: '신한은행',
      accountName: '마이너스 통장',
      accountNumber: '110-123-456789',
      isActive: true,
      lastSyncedAt: new Date(),
      syncStatus: 'synced',
    },
  })

  const account2 = await prisma.account.create({
    data: {
      userId: user.id,
      provider: 'bank',
      providerName: '국민은행',
      accountName: '신용대출',
      accountNumber: '123-456-789012',
      isActive: true,
      lastSyncedAt: new Date(),
      syncStatus: 'synced',
    },
  })

  console.log('✅ Created 2 accounts')

  // Create debts
  const debt1 = await prisma.debt.create({
    data: {
      userId: user.id,
      accountId: account1.id,
      accountName: '신한은행 마이너스 통장',
      type: 'credit_line',
      category: 'consumer',
      totalAmount: 5000000,
      currentBalance: 3500000,
      interestRate: 4.5,
      monthlyPayment: 150000,
      startDate: '2024-01-01',
      dueDate: '2025-11-15',
      status: 'active',
      lenderName: '신한은행',
    },
  })

  const debt2 = await prisma.debt.create({
    data: {
      userId: user.id,
      accountId: account2.id,
      accountName: '국민은행 신용대출',
      type: 'personal_loan',
      category: 'consumer',
      totalAmount: 10000000,
      currentBalance: 8200000,
      interestRate: 5.2,
      monthlyPayment: 250000,
      startDate: '2023-06-01',
      dueDate: '2027-12-31',
      status: 'active',
      lenderName: '국민은행',
    },
  })

  const debt3 = await prisma.debt.create({
    data: {
      userId: user.id,
      accountName: '우리카드 할부',
      type: 'installment',
      category: 'consumer',
      totalAmount: 1200000,
      currentBalance: 800000,
      interestRate: 8.9,
      monthlyPayment: 200000,
      startDate: '2025-10-01',
      dueDate: '2026-02-28',
      status: 'active',
      lenderName: '우리카드',
    },
  })

  console.log('✅ Created 3 debts')

  // Create debt history
  const historyRecords = [
    { debtId: debt1.id, balance: 4000000, payment: 150000, recordedAt: new Date('2025-08-01') },
    { debtId: debt1.id, balance: 3850000, payment: 150000, recordedAt: new Date('2025-09-01') },
    { debtId: debt1.id, balance: 3700000, payment: 150000, recordedAt: new Date('2025-10-01') },
    { debtId: debt2.id, balance: 8700000, payment: 250000, recordedAt: new Date('2025-08-01') },
    { debtId: debt2.id, balance: 8450000, payment: 250000, recordedAt: new Date('2025-09-01') },
    { debtId: debt2.id, balance: 8200000, payment: 250000, recordedAt: new Date('2025-10-01') },
  ]

  for (const record of historyRecords) {
    await prisma.debtHistory.create({ data: record })
  }

  console.log('✅ Created debt history records')

  // Create policies
  const policies = [
    {
      title: '햇살론뱅크',
      category: 'loan_refinance',
      provider: '서민금융진흥원',
      description: '저신용자를 위한 저금리 대환대출 상품',
      targetAudience: '신용등급 6등급 이하',
      benefits: JSON.stringify([
        '연 최대 10.5% 금리',
        '최대 3,000만원 대출',
        '10년 장기 상환',
        '중도상환 수수료 면제',
      ]),
      eligibilityCreditScore: '6등급 이하',
      eligibilityIncome: '연 소득 3,500만원 이하',
      eligibilityAge: '만 19세 이상',
      eligibilityOther: '재직 또는 사업 영위 3개월 이상',
      applicationProcess: JSON.stringify([
        '온라인 신청서 작성',
        '서류 제출 (소득증명, 재직증명)',
        '심사 진행 (3-5일)',
        '대출 실행',
      ]),
      applicationUrl: 'https://www.kinfa.or.kr/',
      applicationPhone: '1397',
      tags: JSON.stringify(['저금리', '장기상환', '중도상환수수료면제']),
      estimatedSaving: 850000,
      isActive: true,
    },
    {
      title: '근로자 소액생활자금 대출',
      category: 'emergency_loan',
      provider: '근로복지공단',
      description: '긴급 생활자금이 필요한 저소득 근로자 지원',
      targetAudience: '저소득 근로자',
      benefits: JSON.stringify([
        '연 1.5% 초저금리',
        '최대 1,000만원',
        '5년 분할 상환',
        '6개월 거치 가능',
      ]),
      eligibilityCreditScore: '제한 없음',
      eligibilityIncome: '연 소득 4,000만원 이하',
      eligibilityAge: '재직 중인 근로자',
      eligibilityOther: '고용보험 가입 3개월 이상',
      applicationProcess: JSON.stringify([
        '근로복지넷 회원가입',
        '온라인 신청',
        '재직 및 소득 확인',
        '승인 후 대출 실행',
      ]),
      applicationUrl: 'https://www.workdream.net/',
      applicationPhone: '1588-0075',
      tags: JSON.stringify(['초저금리', '근로자', '생활안정']),
      estimatedSaving: 620000,
      isActive: true,
    },
    {
      title: '청년 전월세 보증금 대출',
      category: 'housing_support',
      provider: '주택도시기금',
      description: '청년의 주거 안정을 위한 전월세 보증금 대출',
      targetAudience: '만 19-34세 청년',
      benefits: JSON.stringify([
        '연 1.2% 초저금리',
        '최대 1억원',
        '4년 거치 후 6년 분할 상환',
        '중도상환 수수료 없음',
      ]),
      eligibilityCreditScore: '제한 없음',
      eligibilityIncome: '부부 합산 5,000만원 이하',
      eligibilityAge: '만 19-34세',
      eligibilityOther: '무주택 세대주',
      applicationProcess: JSON.stringify([
        '주택도시기금 포털 신청',
        '서류 제출',
        '승인 후 대출 실행',
      ]),
      applicationUrl: 'https://nhuf.molit.go.kr/',
      applicationPhone: '1566-9009',
      tags: JSON.stringify(['청년', '주거', '초저금리']),
      estimatedSaving: 450000,
      isActive: true,
    },
    {
      title: '사잇돌 대출',
      category: 'loan_refinance',
      provider: '저축은행중앙회',
      description: '제1금융권 이용이 어려운 중신용자를 위한 대출',
      targetAudience: '신용등급 중하위',
      benefits: JSON.stringify([
        '연 10-15% 금리',
        '최대 3,000만원',
        '5년 분할 상환',
        '담보 불필요',
      ]),
      eligibilityCreditScore: '7-10등급',
      eligibilityIncome: '연 소득 3,500만원 이하',
      eligibilityAge: '만 19세 이상',
      eligibilityOther: '재직 또는 사업 영위',
      applicationProcess: JSON.stringify([
        '온라인 상담 신청',
        '가까운 저축은행 방문',
        '서류 제출 및 심사',
        '대출 실행',
      ]),
      applicationUrl: 'https://www.fsb.or.kr/',
      applicationPhone: '1588-8850',
      tags: JSON.stringify(['중신용', '무담보', '저축은행']),
      estimatedSaving: 380000,
      isActive: true,
    },
    {
      title: '카드 채무 조정 프로그램',
      category: 'debt_adjustment',
      provider: '신용회복위원회',
      description: '카드 빚 상환이 어려운 분들을 위한 채무 조정',
      targetAudience: '카드 채무자',
      benefits: JSON.stringify([
        '이자율 최대 10% 인하',
        '상환 기간 최대 10년 연장',
        '연체 이자 면제',
        '신용 회복 지원',
      ]),
      eligibilityCreditScore: '제한 없음',
      eligibilityIncome: '소득 있는 자',
      eligibilityAge: '만 19세 이상',
      eligibilityOther: '카드 채무 500만원 이상',
      applicationProcess: JSON.stringify([
        '신용회복위원회 상담',
        '채무 조정 신청',
        '금융회사 협의',
        '조정 안 확정',
      ]),
      applicationUrl: 'https://www.ccrs.or.kr/',
      applicationPhone: '1600-5500',
      tags: JSON.stringify(['채무조정', '카드빚', '신용회복']),
      estimatedSaving: 920000,
      isActive: true,
    },
  ]

  for (const policyData of policies) {
    await prisma.policy.create({ data: policyData })
  }

  console.log('✅ Created 5 policies')

  // Create recommendations
  const allPolicies = await prisma.policy.findMany()
  const recommendations = [
    { userId: user.id, policyId: allPolicies[0].id, matchScore: 95, status: 'viewed' },
    { userId: user.id, policyId: allPolicies[1].id, matchScore: 88, status: 'pending' },
    { userId: user.id, policyId: allPolicies[2].id, matchScore: 82, status: 'pending' },
  ]

  for (const rec of recommendations) {
    await prisma.recommendation.create({ data: rec })
  }

  console.log('✅ Created 3 recommendations')

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
