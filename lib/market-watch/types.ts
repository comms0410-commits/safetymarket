export type MarketWatchSource = {
  title: string;
  link: string;
  snippet: string;
  publishedAt?: string;
  sourceType: "naver-news" | "google-news-rss" | "mock";
};

export type CompetitorAnalysis = {
  competitorId: string;
  competitorName: string;
  serviceName: string;
  keywords: string[];
  sources: MarketWatchSource[];
  summary: string;
  issueType: string;
  impactType: "OPPORTUNITY" | "THREAT" | "NEUTRAL" | "NEEDS_CHECK";
  importanceScore: number;
  tAnsimAnalysis: string;
  recommendedAction: string;
  additionalCheckNeeded: string;
};

export type MarketWatchRun = {
  id: string;
  generatedAt: string;
  generatedAtKst: string;
  status: "success" | "partial" | "fallback";
  usedOpenAI: boolean;
  collector: "naver-news" | "google-news-rss" | "mock";
  summary: string;
  analyses: CompetitorAnalysis[];
};
