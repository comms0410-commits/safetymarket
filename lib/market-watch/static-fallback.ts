import { insights } from "../sample-data";
import type { MarketWatchRun } from "./types";

const now = new Date();

export const fallbackMarketWatchRun: MarketWatchRun = {
  id: "static-fallback",
  generatedAt: now.toISOString(),
  generatedAtKst: new Intl.DateTimeFormat("ko-KR", { dateStyle: "full", timeStyle: "medium", timeZone: "Asia/Seoul" }).format(now),
  status: "fallback",
  usedOpenAI: false,
  collector: "mock",
  summary: "아직 Netlify Blobs에 저장된 자동 분석 결과가 없어 번들 샘플 데이터를 표시합니다.",
  analyses: insights.map((insight) => ({
    competitorId: insight.competitorId,
    competitorName: insight.competitor?.name || "경쟁사",
    serviceName: insight.competitor?.serviceName || "서비스",
    keywords: insight.competitor?.keywords || [],
    sources: [{
      title: insight.collectedItem?.title || insight.summary,
      link: insight.collectedItem?.sourceUrl || "https://sample.lucis.local",
      snippet: insight.summary,
      publishedAt: insight.createdAt.toISOString(),
      sourceType: "mock",
    }],
    summary: insight.summary,
    issueType: insight.category,
    impactType: insight.impactType,
    importanceScore: insight.importanceScore,
    tAnsimAnalysis: insight.tAnsimAnalysis,
    recommendedAction: insight.recommendedAction,
    additionalCheckNeeded: insight.additionalCheckNeeded,
  })),
};
