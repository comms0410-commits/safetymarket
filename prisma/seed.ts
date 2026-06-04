import {
  ApiIntegrationStatus,
  CollectFrequency,
  CompetitorStatus,
  ImpactType,
  InsightStatus,
  PrismaClient,
  SourceType,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const competitors = [
  { name: "JT통신", serviceName: "아이알리미", competitorType: "직접 경쟁", marketArea: "등하교 알림, 학교안전", keywords: ["JT통신", "아이알리미", "등하교 알림"], threatLevel: "HIGH", interestLevel: "HIGH", strengths: "초등 등하교 알림 시장 인지도", weaknesses: "세부 기능과 지역별 도입 현황 추가 확인 필요" },
  { name: "SH네트웍스", serviceName: "키즈콜", competitorType: "직접 경쟁", marketArea: "등하교 알림, 전자출결", keywords: ["SH네트웍스", "키즈콜", "출결"], threatLevel: "HIGH", interestLevel: "HIGH" },
  { name: "기창큐브", serviceName: "스쿨맘톡", competitorType: "플랫폼 경쟁", marketArea: "학교소통, 알림장", keywords: ["기창큐브", "스쿨맘톡", "학교소통"], threatLevel: "MEDIUM", interestLevel: "HIGH" },
  { name: "웰티즌", serviceName: "웰티즌스쿨, 노란버스, 엑스맨", competitorType: "확장 경쟁", marketArea: "통학차량, 학교안전, 학원", keywords: ["웰티즌", "웰티즌스쿨", "노란버스", "엑스맨"], threatLevel: "HIGH", interestLevel: "HIGH" },
  { name: "이웃닷컴", serviceName: "e알리미", competitorType: "플랫폼 경쟁", marketArea: "학교소통, 공지, 알림", keywords: ["이웃닷컴", "e알리미", "학교 공지"], threatLevel: "MEDIUM", interestLevel: "HIGH" },
  { name: "엔트랙", serviceName: "엔트랙", competitorType: "확장 경쟁", marketArea: "등하교 알림, 위치 확인", keywords: ["엔트랙", "위치 확인", "등하교"], threatLevel: "MEDIUM", interestLevel: "MEDIUM" },
  { name: "세이프어드바이저", serviceName: "교원안심번호", competitorType: "확장 경쟁", marketArea: "교원안심번호, 학교 안전", keywords: ["세이프어드바이저", "교원안심번호"], threatLevel: "MEDIUM", interestLevel: "MEDIUM" },
] as const;

const channelSeeds = [
  { type: SourceType.NEWS_SEARCH, name: "뉴스·보도자료 검색", suffix: "news" },
  { type: SourceType.SCHOOL_NOTICE, name: "학교 안내문 모니터링", suffix: "school-notice" },
  { type: SourceType.GOOGLE_PLAY, name: "구글플레이 앱 업데이트", suffix: "google-play" },
  { type: SourceType.APP_STORE, name: "앱스토어 리뷰", suffix: "app-review" },
  { type: SourceType.NOTICE, name: "공식 홈페이지 공지", suffix: "notice" },
];

const issueTemplates = [
  { category: "뉴스·보도자료", impactType: ImpactType.THREAT, importanceScore: 5, title: "교육청 안전 알림 사업 확대 보도", summary: "교육청 단위의 학교 안전 알림 사업 확대 흐름이 확인되어 직접 경쟁 서비스의 제안 활동 가능성이 높습니다.", action: "관련 교육청 공고와 예산 편성 여부를 확인하고 제안서 메시지를 선제 정리" },
  { category: "앱 업데이트", impactType: ImpactType.THREAT, importanceScore: 4, title: "학부모 앱 편의 기능 업데이트", summary: "경쟁 서비스가 보호자 알림 확인 UX와 출결 화면을 개선한 정황이 수집되었습니다.", action: "T안심알리미 학부모 앱의 알림 확인 단계와 경쟁 UX를 비교" },
  { category: "학교 안내문", impactType: ImpactType.OPPORTUNITY, importanceScore: 4, title: "신학기 등하교 알림 신청 안내문 증가", summary: "신학기 학교 안내문에서 등하교 알림 신청 관련 문구가 반복적으로 확인되어 영업 접점 확대 기회가 있습니다.", action: "지역별 안내문 패턴을 정리해 미도입 학교 우선순위를 산정" },
  { category: "조달·입찰", impactType: ImpactType.NEEDS_CHECK, importanceScore: 3, title: "학교 안전 솔루션 입찰 키워드 포착", summary: "조달·입찰성 키워드가 포함된 자료가 확인되었으나 공고 원문 재확인이 필요합니다.", action: "나라장터 API 키 확보 후 자동 매칭 규칙으로 전환" },
  { category: "앱 리뷰", impactType: ImpactType.OPPORTUNITY, importanceScore: 3, title: "알림 지연 관련 앱 리뷰 수집", summary: "일부 경쟁 앱 리뷰에서 알림 지연과 고객지원 불만이 발견되어 안정성 메시지 차별화 기회가 있습니다.", action: "영업 자료에 알림 안정성·운영 대응 SLA 표현을 보강" },
  { category: "특허·상표", impactType: ImpactType.NEUTRAL, importanceScore: 2, title: "학교 안전 관련 상표 키워드 모니터링", summary: "학교 안전·안심번호 관련 상표 키워드가 확인되었으나 직접 위협 여부는 낮습니다.", action: "KIPRIS 연동 후 월간 단위로 신규 출원 추세 확인" },
  { category: "신규 경쟁사 후보", impactType: ImpactType.NEEDS_CHECK, importanceScore: 4, title: "지역 기반 신규 경쟁사 후보 언급", summary: "지역 커뮤니티와 학교 안내자료에서 신규 사업자 후보명이 언급되어 실제 서비스 범위 확인이 필요합니다.", action: "사업자 정보와 앱스토어 등록 여부를 수동 확인" },
];

const publicApis = [
  ["조달청 나라장터 입찰공고정보서비스", "조달청", "NARA_BID", "DATA_GO_KR_SERVICE_KEY"],
  ["NEIS 학교기본정보 API", "한국교육학술정보원", "NEIS_SCHOOL", "NEIS_API_KEY"],
  ["어린이집정보공개 API", "보건복지부", "CHILDCARE", "CHILDCARE_API_KEY"],
  ["KOSIS Open API", "통계청", "KOSIS", "KOSIS_API_KEY"],
  ["KIPRIS Plus", "특허청", "KIPRIS", "KIPRIS_API_KEY"],
  ["OpenDART API", "금융감독원", "DART", "OPENDART_API_KEY"],
] as const;

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@lucis.local" },
    update: { name: "루키스 관리자", role: UserRole.SUPER_ADMIN },
    create: { email: "admin@lucis.local", name: "루키스 관리자", role: UserRole.SUPER_ADMIN, passwordHash },
  });

  const createdCompetitors = [];
  for (const competitor of competitors) {
    const created = await prisma.competitor.upsert({
      where: { name_serviceName: { name: competitor.name, serviceName: competitor.serviceName } },
      update: { ...competitor, status: CompetitorStatus.ACTIVE },
      create: { ...competitor, status: CompetitorStatus.ACTIVE },
    });
    createdCompetitors.push(created);
  }

  const oldSampleItems = await prisma.collectedItem.findMany({
    where: { sourceUrl: { startsWith: "https://sample.lucis.local" } },
    select: { id: true },
  });
  await prisma.insight.deleteMany({ where: { collectedItemId: { in: oldSampleItems.map((item) => item.id) } } });
  await prisma.collectedItem.deleteMany({ where: { id: { in: oldSampleItems.map((item) => item.id) } } });

  for (const [index, competitor] of createdCompetitors.entries()) {
    for (const channel of channelSeeds) {
      await prisma.monitoredSource.upsert({
        where: { competitorId_sourceUrl: { competitorId: competitor.id, sourceUrl: `https://sample.lucis.local/${competitor.id}/${channel.suffix}` } },
        update: { sourceName: channel.name, sourceType: channel.type, isActive: true, lastCollectedAt: new Date() },
        create: {
          competitorId: competitor.id,
          sourceName: channel.name,
          sourceType: channel.type,
          sourceUrl: `https://sample.lucis.local/${competitor.id}/${channel.suffix}`,
          collectFrequency: CollectFrequency.DAILY,
          isActive: true,
          lastCollectedAt: new Date(),
          memo: "반응형 대시보드 확인용 샘플 수집 채널입니다.",
        },
      });
    }

    const template = issueTemplates[index % issueTemplates.length];
    const collectedAt = daysAgo(index % 7, 9 + index, 10 + index);
    const item = await prisma.collectedItem.create({
      data: {
        competitorId: competitor.id,
        title: `${competitor.name} ${template.title}`,
        originalText: `${competitor.serviceName} 관련 ${template.category} 샘플 원문입니다. 실제 연동 전 화면 확인을 위한 데이터입니다.`,
        summary: template.summary,
        sourceUrl: `https://sample.lucis.local/items/${competitor.id}-${index}`,
        contentHash: `sample-${competitor.id}-${index}`,
        collectedAt,
        createdAt: collectedAt,
      },
    });
    await prisma.insight.create({
      data: {
        collectedItemId: item.id,
        competitorId: competitor.id,
        category: template.category,
        impactType: template.impactType,
        importanceScore: template.importanceScore,
        summary: template.summary,
        tAnsimAnalysis: "T안심알리미 관점에서 영업 메시지, 기능 비교, 정책 대응 포인트를 함께 검토해야 합니다.",
        recommendedAction: template.action,
        additionalCheckNeeded: "원문 출처와 지역별 확산 여부 추가 확인",
        status: InsightStatus.NEEDS_REVIEW,
        createdAt: collectedAt,
      },
    });
  }

  await prisma.dailyReport.upsert({
    where: { reportDate: startOfDay(new Date()) },
    update: {
      executiveSummary: "오늘은 교육청 안전 정책, 앱 업데이트, 학교 안내문 증가가 함께 관찰되었습니다.",
      competitorSummary: "JT통신, SH네트웍스, 웰티즌 중심으로 등하교 알림·통학차량·학교소통 영역 변화가 확인됩니다.",
      recommendedActions: "중요도 4 이상 이슈 원문 확인, 신학기 학교 안내문 지역별 정리, 앱 UX 비교표 업데이트",
    },
    create: {
      reportDate: startOfDay(new Date()),
      title: "T안심알리미 일일 시장동향 샘플 리포트",
      executiveSummary: "오늘은 교육청 안전 정책, 앱 업데이트, 학교 안내문 증가가 함께 관찰되었습니다.",
      competitorSummary: "JT통신, SH네트웍스, 웰티즌 중심으로 등하교 알림·통학차량·학교소통 영역 변화가 확인됩니다.",
      policySummary: "교육청 안전사업 관련 키워드가 증가했습니다.",
      procurementSummary: "조달·입찰 데이터는 API 키 확보 후 자동 연동 예정입니다.",
      opportunitySummary: "학교 안내문 기반 미도입 학교 발굴 기회가 있습니다.",
      threatSummary: "경쟁 앱 UX 개선과 교육청 단위 제안 활동 가능성이 위협입니다.",
      recommendedActions: "중요도 4 이상 이슈 원문 확인, 신학기 학교 안내문 지역별 정리, 앱 UX 비교표 업데이트",
      additionalCheckNeeded: "나라장터, NEIS, KIPRIS API 인증키 확보 후 자동 검증 필요",
      sourceLinks: ["https://sample.lucis.local/report/source-1", "https://sample.lucis.local/report/source-2"],
      reportStatus: "DRAFT",
    },
  });

  for (const [name, provider, apiType, envKeyName] of publicApis) {
    await prisma.publicApiSource.upsert({
      where: { name_provider: { name, provider } },
      update: { apiType, envKeyName, status: ApiIntegrationStatus.KEY_MISSING, isActive: false },
      create: { name, provider, apiType, envKeyName, status: ApiIntegrationStatus.KEY_MISSING, isActive: false, internalMemo: "추후 인증키 확보 후 connector 연결 예정" },
    });
  }
}

function daysAgo(days: number, hours: number, minutes: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

main()
  .finally(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
