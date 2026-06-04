export type Level = "LOW" | "MEDIUM" | "HIGH";
export type CompetitorStatus = "ACTIVE" | "HOLD" | "WATCH" | "EXCLUDED";
export type ImpactType = "OPPORTUNITY" | "THREAT" | "NEUTRAL" | "NEEDS_CHECK";

export type Competitor = {
  id: string;
  name: string;
  serviceName: string;
  competitorType: string;
  marketArea: string;
  websiteUrl?: string | null;
  appAndroidUrl?: string | null;
  appIosUrl?: string | null;
  keywords: string[];
  description?: string | null;
  strengths?: string | null;
  weaknesses?: string | null;
  responseStrategy?: string | null;
  threatLevel: Level;
  interestLevel: Level;
  status: CompetitorStatus;
  internalMemo?: string | null;
};

export type CollectedItem = {
  id: string;
  competitorId: string;
  title: string;
  originalText: string;
  summary: string;
  sourceUrl: string;
  collectedAt: Date;
};

export type Insight = {
  id: string;
  collectedItemId: string;
  competitorId: string;
  category: string;
  impactType: ImpactType;
  importanceScore: number;
  summary: string;
  tAnsimAnalysis: string;
  recommendedAction: string;
  additionalCheckNeeded: string;
  status: "NEEDS_REVIEW" | "REVIEWED" | "ARCHIVED";
  createdAt: Date;
  competitor?: Competitor;
  collectedItem?: CollectedItem;
};

export type MonitoredSource = {
  id: string;
  competitorId: string;
  competitor: Competitor;
  sourceType: string;
  sourceName: string;
  sourceUrl: string;
  collectFrequency: string;
  isActive: boolean;
  lastCollectedAt: Date;
};

export type PublicApiSource = {
  id: string;
  name: string;
  provider: string;
  apiType: string;
  envKeyName: string;
  status: "NOT_CONNECTED" | "KEY_MISSING" | "TESTABLE" | "NORMAL" | "ERROR";
};

export const competitors: Competitor[] = [
  { id: "jt", name: "JT통신", serviceName: "아이알리미", competitorType: "직접 경쟁", marketArea: "등하교 알림, 학교안전", keywords: ["JT통신", "아이알리미", "등하교 알림"], threatLevel: "HIGH", interestLevel: "HIGH", status: "ACTIVE", strengths: "초등 등하교 알림 시장 인지도", weaknesses: "지역별 도입 현황 추가 확인 필요", responseStrategy: "교육청·학교 단위 제안 메시지를 선제 정리" },
  { id: "sh", name: "SH네트웍스", serviceName: "키즈콜", competitorType: "직접 경쟁", marketArea: "등하교 알림, 전자출결", keywords: ["SH네트웍스", "키즈콜", "출결"], threatLevel: "HIGH", interestLevel: "HIGH", status: "ACTIVE" },
  { id: "kichang", name: "기창큐브", serviceName: "스쿨맘톡", competitorType: "플랫폼 경쟁", marketArea: "학교소통, 알림장", keywords: ["기창큐브", "스쿨맘톡", "학교소통"], threatLevel: "MEDIUM", interestLevel: "HIGH", status: "ACTIVE" },
  { id: "weltizen", name: "웰티즌", serviceName: "웰티즌스쿨, 노란버스, 엑스맨", competitorType: "확장 경쟁", marketArea: "통학차량, 학교안전, 학원", keywords: ["웰티즌", "웰티즌스쿨", "노란버스", "엑스맨"], threatLevel: "HIGH", interestLevel: "HIGH", status: "ACTIVE" },
  { id: "ealim", name: "이웃닷컴", serviceName: "e알리미", competitorType: "플랫폼 경쟁", marketArea: "학교소통, 공지, 알림", keywords: ["이웃닷컴", "e알리미", "학교 공지"], threatLevel: "MEDIUM", interestLevel: "HIGH", status: "ACTIVE" },
  { id: "ntrack", name: "엔트랙", serviceName: "엔트랙", competitorType: "확장 경쟁", marketArea: "등하교 알림, 위치 확인", keywords: ["엔트랙", "위치 확인", "등하교"], threatLevel: "MEDIUM", interestLevel: "MEDIUM", status: "WATCH" },
  { id: "safeadvisor", name: "세이프어드바이저", serviceName: "교원안심번호", competitorType: "확장 경쟁", marketArea: "교원안심번호, 학교 안전", keywords: ["세이프어드바이저", "교원안심번호"], threatLevel: "MEDIUM", interestLevel: "MEDIUM", status: "ACTIVE" },
];

const issueTemplates = [
  { category: "뉴스·보도자료", impactType: "THREAT" as ImpactType, importanceScore: 5, title: "교육청 안전 알림 사업 확대 보도", summary: "교육청 단위의 학교 안전 알림 사업 확대 흐름이 확인되어 직접 경쟁 서비스의 제안 활동 가능성이 높습니다.", action: "관련 교육청 공고와 예산 편성 여부를 확인하고 제안서 메시지를 선제 정리" },
  { category: "앱 업데이트", impactType: "THREAT" as ImpactType, importanceScore: 4, title: "학부모 앱 편의 기능 업데이트", summary: "경쟁 서비스가 보호자 알림 확인 UX와 출결 화면을 개선한 정황이 수집되었습니다.", action: "T안심알리미 학부모 앱의 알림 확인 단계와 경쟁 UX를 비교" },
  { category: "학교 안내문", impactType: "OPPORTUNITY" as ImpactType, importanceScore: 4, title: "신학기 등하교 알림 신청 안내문 증가", summary: "신학기 학교 안내문에서 등하교 알림 신청 관련 문구가 반복적으로 확인되어 영업 접점 확대 기회가 있습니다.", action: "지역별 안내문 패턴을 정리해 미도입 학교 우선순위를 산정" },
  { category: "조달·입찰", impactType: "NEEDS_CHECK" as ImpactType, importanceScore: 3, title: "학교 안전 솔루션 입찰 키워드 포착", summary: "조달·입찰성 키워드가 포함된 자료가 확인되었으나 공고 원문 재확인이 필요합니다.", action: "나라장터 API 키 확보 후 자동 매칭 규칙으로 전환" },
  { category: "앱 리뷰", impactType: "OPPORTUNITY" as ImpactType, importanceScore: 3, title: "알림 지연 관련 앱 리뷰 수집", summary: "일부 경쟁 앱 리뷰에서 알림 지연과 고객지원 불만이 발견되어 안정성 메시지 차별화 기회가 있습니다.", action: "영업 자료에 알림 안정성·운영 대응 SLA 표현을 보강" },
  { category: "특허·상표", impactType: "NEUTRAL" as ImpactType, importanceScore: 2, title: "학교 안전 관련 상표 키워드 모니터링", summary: "학교 안전·안심번호 관련 상표 키워드가 확인되었으나 직접 위협 여부는 낮습니다.", action: "KIPRIS 연동 후 월간 단위로 신규 출원 추세 확인" },
  { category: "신규 경쟁사 후보", impactType: "NEEDS_CHECK" as ImpactType, importanceScore: 4, title: "지역 기반 신규 경쟁사 후보 언급", summary: "지역 커뮤니티와 학교 안내자료에서 신규 사업자 후보명이 언급되어 실제 서비스 범위 확인이 필요합니다.", action: "사업자 정보와 앱스토어 등록 여부를 수동 확인" },
];

function daysAgo(days: number, hours: number, minutes: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export const collectedItems: CollectedItem[] = competitors.map((competitor, index) => {
  const template = issueTemplates[index % issueTemplates.length];
  return {
    id: `item-${competitor.id}`,
    competitorId: competitor.id,
    title: `${competitor.name} ${template.title}`,
    originalText: `${competitor.serviceName} 관련 ${template.category} 샘플 원문입니다. Netlify 초기 배포 안정성을 위한 정적 데모 데이터입니다.`,
    summary: template.summary,
    sourceUrl: `https://sample.lucis.local/items/${competitor.id}`,
    collectedAt: daysAgo(index % 7, 9 + index, 10 + index),
  };
});

export const insights: Insight[] = collectedItems.map((item, index) => {
  const competitor = competitors.find((candidate) => candidate.id === item.competitorId)!;
  const template = issueTemplates[index % issueTemplates.length];
  return {
    id: `insight-${item.id}`,
    collectedItemId: item.id,
    competitorId: competitor.id,
    category: template.category,
    impactType: template.impactType,
    importanceScore: template.importanceScore,
    summary: template.summary,
    tAnsimAnalysis: "T안심알리미 관점에서 영업 메시지, 기능 비교, 정책 대응 포인트를 함께 검토해야 합니다.",
    recommendedAction: template.action,
    additionalCheckNeeded: "원문 출처와 지역별 확산 여부 추가 확인",
    status: "NEEDS_REVIEW",
    createdAt: item.collectedAt,
    competitor,
    collectedItem: item,
  };
});

export const monitoredSources: MonitoredSource[] = competitors.flatMap((competitor) => [
  { id: `${competitor.id}-news`, competitorId: competitor.id, competitor, sourceType: "NEWS_SEARCH", sourceName: "뉴스·보도자료 검색", sourceUrl: `https://sample.lucis.local/${competitor.id}/news`, collectFrequency: "DAILY", isActive: true, lastCollectedAt: new Date() },
  { id: `${competitor.id}-school`, competitorId: competitor.id, competitor, sourceType: "SCHOOL_NOTICE", sourceName: "학교 안내문 모니터링", sourceUrl: `https://sample.lucis.local/${competitor.id}/school-notice`, collectFrequency: "DAILY", isActive: true, lastCollectedAt: new Date() },
  { id: `${competitor.id}-app`, competitorId: competitor.id, competitor, sourceType: "APP_STORE", sourceName: "앱 업데이트·리뷰", sourceUrl: `https://sample.lucis.local/${competitor.id}/app`, collectFrequency: "WEEKLY", isActive: true, lastCollectedAt: new Date() },
]);

export const publicApiSources: PublicApiSource[] = [
  { id: "nara-bid", name: "조달청 나라장터 입찰공고정보서비스", provider: "조달청", apiType: "NARA_BID", envKeyName: "DATA_GO_KR_SERVICE_KEY", status: "KEY_MISSING" },
  { id: "neis-school", name: "NEIS 학교기본정보 API", provider: "한국교육학술정보원", apiType: "NEIS_SCHOOL", envKeyName: "NEIS_API_KEY", status: "KEY_MISSING" },
  { id: "childcare", name: "어린이집정보공개 API", provider: "보건복지부", apiType: "CHILDCARE", envKeyName: "CHILDCARE_API_KEY", status: "KEY_MISSING" },
  { id: "kosis", name: "KOSIS Open API", provider: "통계청", apiType: "KOSIS", envKeyName: "KOSIS_API_KEY", status: "KEY_MISSING" },
  { id: "kipris", name: "KIPRIS Plus", provider: "특허청", apiType: "KIPRIS", envKeyName: "KIPRIS_API_KEY", status: "KEY_MISSING" },
  { id: "dart", name: "OpenDART API", provider: "금융감독원", apiType: "DART", envKeyName: "OPENDART_API_KEY", status: "KEY_MISSING" },
];

export const dailyReport = {
  title: "T안심알리미 일일 시장동향 샘플 리포트",
  executiveSummary: "오늘은 교육청 안전 정책, 앱 업데이트, 학교 안내문 증가가 함께 관찰되었습니다.",
  competitorSummary: "JT통신, SH네트웍스, 웰티즌 중심으로 등하교 알림·통학차량·학교소통 영역 변화가 확인됩니다.",
  policySummary: "교육청 안전사업 관련 키워드가 증가했습니다.",
  procurementSummary: "조달·입찰 데이터는 API 키 확보 후 자동 연동 예정입니다.",
  recommendedActions: "중요도 4 이상 이슈 원문 확인, 신학기 학교 안내문 지역별 정리, 앱 UX 비교표 업데이트",
};

export function findCompetitor(id: string) {
  return competitors.find((competitor) => competitor.id === id);
}
