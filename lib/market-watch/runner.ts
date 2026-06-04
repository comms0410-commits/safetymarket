import { competitors } from "../sample-data";
import { analyzeCompetitor } from "./analyzer";
import { collectSources, keywordsForCompetitor } from "./collector";
import { saveMarketWatchRun } from "./blob-store";
import type { MarketWatchRun } from "./types";

export async function runDailyMarketWatch(): Promise<MarketWatchRun> {
  const generatedAt = new Date();
  const analyses = [];
  let usedOpenAI = false;
  let collector: MarketWatchRun["collector"] = "mock";

  for (const competitor of competitors) {
    const keywords = keywordsForCompetitor(competitor);
    const collected = await collectSources(competitor);
    if (collected.collector !== "mock") collector = collected.collector;
    const result = await analyzeCompetitor(competitor, keywords, collected.sources);
    usedOpenAI = usedOpenAI || result.usedOpenAI;
    analyses.push(result.analysis);
  }

  const run: MarketWatchRun = {
    id: generatedAt.toISOString().slice(0, 10),
    generatedAt: generatedAt.toISOString(),
    generatedAtKst: new Intl.DateTimeFormat("ko-KR", { dateStyle: "full", timeStyle: "medium", timeZone: "Asia/Seoul" }).format(generatedAt),
    status: usedOpenAI ? "success" : collector === "mock" ? "fallback" : "partial",
    usedOpenAI,
    collector,
    summary: buildSummary(analyses),
    analyses,
  };

  await saveMarketWatchRun(run);
  return run;
}

function buildSummary(analyses: MarketWatchRun["analyses"]) {
  const high = analyses.filter((analysis) => analysis.importanceScore >= 4).length;
  const threats = analyses.filter((analysis) => analysis.impactType === "THREAT").length;
  const opportunities = analyses.filter((analysis) => analysis.impactType === "OPPORTUNITY").length;
  return `자동 분석 결과 중요 이슈 ${high}건, 위협 ${threats}건, 기회 ${opportunities}건이 확인되었습니다.`;
}
