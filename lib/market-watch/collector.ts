import { competitors } from "../sample-data";
import type { MarketWatchSource } from "./types";

const GOOGLE_NEWS_ENDPOINT = "https://news.google.com/rss/search";

export function keywordsForCompetitor(competitor: { name: string; serviceName: string; keywords: string[] }) {
  return Array.from(new Set([
    competitor.name,
    competitor.serviceName,
    ...competitor.keywords,
    "등하교 알림",
    "학교 안전",
    "앱 업데이트",
  ])).slice(0, 8);
}

export async function collectSources(competitor: (typeof competitors)[number]): Promise<{ collector: "naver-news" | "google-news-rss" | "mock"; sources: MarketWatchSource[] }> {
  const keywords = keywordsForCompetitor(competitor);
  const query = keywords.slice(0, 4).join(" ");

  if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
    const naver = await collectNaverNews(query);
    if (naver.length > 0) return { collector: "naver-news", sources: naver };
  }

  const google = await collectGoogleNewsRss(query);
  if (google.length > 0) return { collector: "google-news-rss", sources: google };

  return { collector: "mock", sources: mockSources(competitor) };
}

async function collectNaverNews(query: string): Promise<MarketWatchSource[]> {
  try {
    const url = new URL("https://openapi.naver.com/v1/search/news.json");
    url.searchParams.set("query", query);
    url.searchParams.set("display", "5");
    url.searchParams.set("sort", "date");
    const response = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID || "",
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET || "",
      },
    });
    if (!response.ok) return [];
    const data = await response.json() as { items?: Array<{ title: string; link: string; description: string; pubDate: string }> };
    return (data.items || []).map((item) => ({
      title: stripHtml(item.title),
      link: item.link,
      snippet: stripHtml(item.description),
      publishedAt: item.pubDate,
      sourceType: "naver-news",
    }));
  } catch {
    return [];
  }
}

async function collectGoogleNewsRss(query: string): Promise<MarketWatchSource[]> {
  try {
    const url = new URL(GOOGLE_NEWS_ENDPOINT);
    url.searchParams.set("q", query);
    url.searchParams.set("hl", "ko");
    url.searchParams.set("gl", "KR");
    url.searchParams.set("ceid", "KR:ko");
    const response = await fetch(url, { headers: { "user-agent": "daily-market-watch/1.0" } });
    if (!response.ok) return [];
    const xml = await response.text();
    return parseRssItems(xml).slice(0, 5).map((item) => ({ ...item, sourceType: "google-news-rss" as const }));
  } catch {
    return [];
  }
}

function parseRssItems(xml: string) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
  return items.map((item) => ({
    title: decodeXml(extractTag(item, "title")),
    link: decodeXml(extractTag(item, "link")),
    snippet: decodeXml(extractTag(item, "description")),
    publishedAt: decodeXml(extractTag(item, "pubDate")),
  })).filter((item) => item.title && item.link);
}

function extractTag(xml: string, tag: string) {
  return xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "") || "";
}

function decodeXml(value: string) {
  return stripHtml(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function mockSources(competitor: (typeof competitors)[number]): MarketWatchSource[] {
  return [
    {
      title: `${competitor.name} ${competitor.serviceName} 관련 등하교 알림 시장 변화 샘플`,
      link: `https://sample.lucis.local/market-watch/${competitor.id}`,
      snippet: "뉴스 API 또는 RSS 수집이 실패했을 때 대시보드 자동 반영 흐름을 유지하기 위한 mock fallback입니다.",
      publishedAt: new Date().toISOString(),
      sourceType: "mock",
    },
  ];
}
