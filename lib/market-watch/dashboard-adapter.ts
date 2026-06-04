import type { CollectedItem, Competitor, Insight, PublicApiSource } from "../sample-data";
import type { MarketWatchRun } from "./types";

export function runToInsights(run: MarketWatchRun): Insight[] {
  return run.analyses.map((analysis) => {
    const competitor: Competitor = {
      id: analysis.competitorId,
      name: analysis.competitorName,
      serviceName: analysis.serviceName,
      competitorType: "자동 분석",
      marketArea: analysis.keywords.join(", "),
      keywords: analysis.keywords,
      threatLevel: analysis.importanceScore >= 4 ? "HIGH" : "MEDIUM",
      interestLevel: analysis.importanceScore >= 4 ? "HIGH" : "MEDIUM",
      status: "ACTIVE",
    };
    const item: CollectedItem = {
      id: `auto-item-${analysis.competitorId}`,
      competitorId: analysis.competitorId,
      title: analysis.sources[0]?.title || analysis.summary,
      originalText: analysis.sources[0]?.snippet || analysis.summary,
      summary: analysis.summary,
      sourceUrl: analysis.sources[0]?.link || "https://sample.lucis.local",
      collectedAt: new Date(run.generatedAt),
    };
    return {
      id: `auto-insight-${analysis.competitorId}`,
      collectedItemId: item.id,
      competitorId: analysis.competitorId,
      category: analysis.issueType,
      impactType: analysis.impactType,
      importanceScore: analysis.importanceScore,
      summary: analysis.summary,
      tAnsimAnalysis: analysis.tAnsimAnalysis,
      recommendedAction: analysis.recommendedAction,
      additionalCheckNeeded: analysis.additionalCheckNeeded,
      status: "NEEDS_REVIEW",
      createdAt: new Date(run.generatedAt),
      competitor,
      collectedItem: item,
    };
  });
}

export function runToCollectedItems(run: MarketWatchRun): CollectedItem[] {
  return run.analyses.flatMap((analysis) => analysis.sources.map((source, index) => ({
    id: `auto-source-${analysis.competitorId}-${index}`,
    competitorId: analysis.competitorId,
    title: source.title,
    originalText: source.snippet,
    summary: analysis.summary,
    sourceUrl: source.link,
    collectedAt: source.publishedAt ? new Date(source.publishedAt) : new Date(run.generatedAt),
  })));
}

export function runToPublicApiStatus(run: MarketWatchRun): PublicApiSource[] {
  return [{
    id: "openai-auto-watch",
    name: "OpenAI 자동 동향 분석",
    provider: "OpenAI / Netlify Scheduled Function",
    apiType: "OPENAI_MARKET_WATCH",
    envKeyName: "OPENAI_API_KEY",
    status: run.usedOpenAI ? "NORMAL" : "KEY_MISSING",
  }];
}
