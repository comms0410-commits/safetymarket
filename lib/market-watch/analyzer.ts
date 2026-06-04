import type { Competitor } from "../sample-data";
import type { CompetitorAnalysis, MarketWatchSource } from "./types";

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

export async function analyzeCompetitor(competitor: Competitor, keywords: string[], sources: MarketWatchSource[]): Promise<{ analysis: CompetitorAnalysis; usedOpenAI: boolean }> {
  if (process.env.OPENAI_API_KEY) {
    const ai = await analyzeWithOpenAI(competitor, keywords, sources);
    if (ai) return { analysis: ai, usedOpenAI: true };
  }
  return { analysis: heuristicAnalysis(competitor, keywords, sources), usedOpenAI: false };
}

async function analyzeWithOpenAI(competitor: Competitor, keywords: string[], sources: MarketWatchSource[]): Promise<CompetitorAnalysis | null> {
  try {
    const prompt = [
      "너는 T안심알리미 경쟁사 동향 분석가다.",
      "아래 공개 수집자료를 바탕으로 JSON만 반환하라.",
      "필드: summary, issueType, impactType(OPPORTUNITY|THREAT|NEUTRAL|NEEDS_CHECK), importanceScore(1~5), tAnsimAnalysis, recommendedAction, additionalCheckNeeded.",
      `경쟁사: ${competitor.name} / ${competitor.serviceName}`,
      `키워드: ${keywords.join(", ")}`,
      `자료: ${JSON.stringify(sources, null, 2)}`,
    ].join("\n\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        input: prompt,
        text: { format: { type: "json_object" } },
      }),
    });
    if (!response.ok) return null;
    const data = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
    const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((content) => content.text).filter(Boolean).join("\n") || "";
    const parsed = JSON.parse(text) as Partial<CompetitorAnalysis>;
    return normalizeAnalysis(competitor, keywords, sources, parsed);
  } catch (error) {
    console.warn("OpenAI analysis failed. Falling back to heuristic analysis.", error);
    return null;
  }
}

function heuristicAnalysis(competitor: Competitor, keywords: string[], sources: MarketWatchSource[]): CompetitorAnalysis {
  const combined = `${sources.map((source) => `${source.title} ${source.snippet}`).join(" ")} ${competitor.marketArea}`;
  const threatWords = ["확대", "출시", "개선", "입찰", "수주", "업데이트"];
  const opportunityWords = ["불만", "지연", "오류", "민원", "후보"];
  const threatScore = threatWords.filter((word) => combined.includes(word)).length;
  const opportunityScore = opportunityWords.filter((word) => combined.includes(word)).length;
  const impactType = opportunityScore > threatScore ? "OPPORTUNITY" : threatScore > 0 ? "THREAT" : "NEEDS_CHECK";
  const importanceScore = Math.min(5, Math.max(2, threatScore + opportunityScore + (competitor.threatLevel === "HIGH" ? 2 : 1)));
  return normalizeAnalysis(competitor, keywords, sources, {
    summary: `${competitor.name}(${competitor.serviceName}) 관련 최신 공개자료 ${sources.length}건을 확인했습니다. ${sources[0]?.title || "추가 확인이 필요합니다."}`,
    issueType: sources[0]?.sourceType === "mock" ? "확인필요" : "경쟁사 활동",
    impactType,
    importanceScore,
    tAnsimAnalysis: "T안심알리미 관점에서 경쟁 메시지, 앱 UX, 학교/교육청 영업 포인트를 함께 비교해야 합니다.",
    recommendedAction: "원문 링크를 확인하고, 중요도 4 이상 이슈는 영업·기획 담당자에게 공유하세요.",
    additionalCheckNeeded: sources[0]?.sourceType === "mock" ? "실제 뉴스/RSS/API 연결 상태 확인" : "원문 출처 및 지역 확산 여부 확인",
  });
}

function normalizeAnalysis(competitor: Competitor, keywords: string[], sources: MarketWatchSource[], parsed: Partial<CompetitorAnalysis>): CompetitorAnalysis {
  const impactType = ["OPPORTUNITY", "THREAT", "NEUTRAL", "NEEDS_CHECK"].includes(parsed.impactType || "") ? parsed.impactType as CompetitorAnalysis["impactType"] : "NEEDS_CHECK";
  const importanceScore = Math.min(5, Math.max(1, Number(parsed.importanceScore || 3)));
  return {
    competitorId: competitor.id,
    competitorName: competitor.name,
    serviceName: competitor.serviceName,
    keywords,
    sources,
    summary: parsed.summary || `${competitor.name} 관련 자료를 분석했습니다.`,
    issueType: parsed.issueType || "기타",
    impactType,
    importanceScore,
    tAnsimAnalysis: parsed.tAnsimAnalysis || "T안심알리미 관점 추가 검토가 필요합니다.",
    recommendedAction: parsed.recommendedAction || "원문 확인 후 담당자에게 공유하세요.",
    additionalCheckNeeded: parsed.additionalCheckNeeded || "출처 및 시점 확인",
  };
}
