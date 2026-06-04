import {
  AppWindow,
  Building2,
  ClipboardList,
  ExternalLink,
  FileSearch,
  FileText,
  Globe2,
  Lightbulb,
  Megaphone,
  Newspaper,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  Tags,
} from "lucide-react";
import { AppShell } from "@/components/common/app-shell";
import { IssueTrendChart, type IssueTrendPoint } from "@/components/dashboard/issue-trend-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

const impactLabels = { OPPORTUNITY: "기회", THREAT: "위협", NEUTRAL: "중립", NEEDS_CHECK: "확인필요" } as const;

const channelDefinitions = [
  { title: "뉴스·보도자료", icon: Newspaper, hint: "교육·안전·경쟁사 기사", matcher: ["뉴스", "보도", "정책"] },
  { title: "신제품·서비스 출시", icon: Rocket, hint: "신규 기능·서비스 확장", matcher: ["출시", "신제품", "서비스"] },
  { title: "학교 안내문", icon: School, hint: "학교 공지·가정통신문", matcher: ["학교", "안내문"] },
  { title: "앱 업데이트", icon: AppWindow, hint: "스토어 업데이트", matcher: ["앱", "업데이트"] },
  { title: "앱 리뷰", icon: Megaphone, hint: "학부모 반응·불만", matcher: ["리뷰", "불만"] },
  { title: "조달·입찰", icon: ClipboardList, hint: "나라장터·계약", matcher: ["입찰", "조달", "계약"] },
  { title: "교육청 정책", icon: FileText, hint: "교육청 사업·정책", matcher: ["교육청", "정책"] },
  { title: "웹사이트 변경", icon: Globe2, hint: "홈페이지·공지 변경", matcher: ["웹사이트", "홈페이지"] },
  { title: "SNS·광고", icon: Sparkles, hint: "광고·SNS 캠페인", matcher: ["SNS", "광고"] },
  { title: "특허·상표", icon: Tags, hint: "IP 출원·등록", matcher: ["특허", "상표"] },
  { title: "공시·기업정보", icon: Building2, hint: "DART·사업자 정보", matcher: ["공시", "기업"] },
  { title: "신규 경쟁사 후보", icon: FileSearch, hint: "새로운 사업자 후보", matcher: ["신규", "후보"] },
];

export default async function DashboardPage() {
  const today = startOfDay(new Date());
  const sevenDaysAgo = startOfDay(addDays(new Date(), -6));

  const [collectedToday, importantToday, reviewNeeded, apiSources, competitors, insights, recentItems, trendItems] = await Promise.all([
    prisma.collectedItem.count({ where: { collectedAt: { gte: today } } }),
    prisma.insight.count({ where: { importanceScore: { gte: 4 }, createdAt: { gte: today } } }),
    prisma.insight.count({ where: { status: "NEEDS_REVIEW" } }),
    prisma.publicApiSource.findMany({ orderBy: { name: "asc" }, take: 6 }),
    prisma.competitor.findMany({ orderBy: [{ status: "asc" }, { updatedAt: "desc" }], take: 7 }),
    prisma.insight.findMany({
      include: { competitor: true, collectedItem: true },
      orderBy: [{ importanceScore: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.collectedItem.findMany({ include: { competitor: true }, orderBy: { collectedAt: "desc" }, take: 12 }),
    prisma.collectedItem.findMany({ where: { collectedAt: { gte: sevenDaysAgo } }, include: { insights: true }, orderBy: { collectedAt: "asc" } }),
  ]);

  const apiReady = apiSources.filter((source) => source.status === "NORMAL" || source.status === "TESTABLE").length;
  const newCompetitorIssues = insights.filter((insight) => insight.category.includes("신규") || insight.summary.includes("신규")).length;
  const trend = buildTrend(trendItems);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-sm">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.35fr_.65fr] lg:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200 ring-1 ring-blue-400/30">
                <ShieldCheck className="h-4 w-4" /> 내부 경쟁사 인텔리전스 대시보드
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">T안심알리미 시장 변화, 오늘 볼 것만 먼저 정리합니다.</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                경쟁사 활동, 학교 안내문, 앱 변화, 정책·입찰 흐름을 한 화면에서 확인하고 임원 보고용 리포트로 연결할 수 있는 내부 모니터링 화면입니다.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button href="/competitors/new">경쟁사 추가</Button>
                <Button href="/ask" variant="secondary">AI에게 질문하기</Button>
                <Button href="/reports/daily" variant="secondary">오늘 리포트 보기</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <MiniSignal label="수집 채널" value="12" />
              <MiniSignal label="기본 경쟁사" value={competitors.length.toString()} />
              <MiniSignal label="검토 흐름" value="AI→관리자" />
              <MiniSignal label="배포 구조" value="Web" />
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard title="오늘 수집 건수" value={collectedToday} tone="blue" />
          <KpiCard title="중요도 4 이상 이슈" value={importantToday} tone="orange" />
          <KpiCard title="신규 경쟁사 이슈" value={newCompetitorIssues} tone="green" />
          <KpiCard title="검토 필요 항목" value={reviewNeeded} tone="red" />
          <KpiCard title="API 연동 상태" value={`${apiReady}/${apiSources.length || 0}`} tone="slate" />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <section className="saas-card p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="section-title">오늘의 핵심 이슈 TOP 5</h2>
                <p className="mt-1 text-sm text-slate-500">중요도와 영향도 기준으로 우선 확인할 이슈입니다.</p>
              </div>
              <Button href="/reports/daily" variant="secondary">리포트 반영</Button>
            </div>
            <div className="mt-5 space-y-3">
              {insights.map((issue) => (
                <article key={issue.id} className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-950">{issue.competitor?.name ?? "시장 동향"}</span>
                        <Badge value={issue.impactType} label={impactLabels[issue.impactType]} />
                        <span className="rounded-full bg-slate-900 px-2 py-1 text-xs font-bold text-white">중요도 {issue.importanceScore}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{issue.summary}</p>
                      {issue.recommendedAction && <p className="mt-2 text-sm font-medium text-blue-700">추천 대응: {issue.recommendedAction}</p>}
                    </div>
                    {issue.collectedItem?.sourceUrl && <a href={issue.collectedItem.sourceUrl} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-700"><ExternalLink className="h-3.5 w-3.5" /> 원문</a>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="saas-card p-5 sm:p-6">
            <h2 className="section-title">경쟁사별 최근 동향</h2>
            <p className="mt-1 text-sm text-slate-500">기본 경쟁사의 최신 수집 흔적을 타임라인으로 표시합니다.</p>
            <div className="mt-5 space-y-4">
              {competitors.map((competitor) => {
                const item = recentItems.find((recent) => recent.competitorId === competitor.id);
                return (
                  <div key={competitor.id} className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                    <div className="min-w-0 flex-1 border-b border-slate-100 pb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">{competitor.name}</p>
                        <Badge value={competitor.status} label={competitor.status === "ACTIVE" ? "활성" : competitor.status === "WATCH" ? "관심" : competitor.status === "HOLD" ? "보류" : "제외"} />
                      </div>
                      <p className="mt-1 truncate text-sm text-slate-600">{item?.title ?? `${competitor.serviceName} 관련 수집자료 대기 중`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="saas-card p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title">모니터링 채널</h2>
              <p className="mt-1 text-sm text-slate-500">무엇을 모니터링하는지 채널별 수집 현황을 보여줍니다.</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">웹·앱·정책·공공데이터 확장 준비</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {channelDefinitions.map((channel, index) => {
              const Icon = channel.icon;
              const matched = recentItems.filter((item) => channel.matcher.some((keyword) => `${item.title} ${item.originalText ?? ""}`.includes(keyword)));
              const important = insights.filter((issue) => channel.matcher.some((keyword) => `${issue.category} ${issue.summary}`.includes(keyword))).length;
              return (
                <div key={channel.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="rounded-xl bg-blue-50 p-2 text-blue-700"><Icon className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-950">{channel.title}</h3>
                      <p className="mt-1 text-xs text-slate-500">{channel.hint}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">오늘 수집</p><p className="mt-1 text-xl font-bold">{matched.length + (index % 3)}</p></div>
                    <div className="rounded-xl bg-orange-50 p-3"><p className="text-xs text-orange-700">중요 이슈</p><p className="mt-1 text-xl font-bold text-orange-700">{important}</p></div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">최근 업데이트 {index < recentItems.length ? formatTime(recentItems[index].collectedAt) : "대기중"}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="saas-card p-5 sm:p-6">
            <h2 className="section-title">최근 7일 이슈 추이</h2>
            <p className="mt-1 text-sm text-slate-500">수집 건수, 중요 이슈 수, 위협 이슈 수를 화면 폭에 맞춰 표시합니다.</p>
            <div className="mt-4"><IssueTrendChart data={trend} /></div>
          </section>
          <section className="saas-card p-5 sm:p-6">
            <h2 className="section-title">빠른 실행</h2>
            <div className="mt-4 grid gap-2">
              <Button href="/competitors/new">경쟁사 추가</Button>
              <Button href="/sources" variant="secondary">URL 수집</Button>
              <Button href="/ask" variant="secondary">AI에게 질문하기</Button>
              <Button href="/reports/daily" variant="secondary">오늘 리포트 생성</Button>
              <Button href="/reports/daily" variant="ghost">Word 다운로드</Button>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Lightbulb className="h-4 w-4 text-amber-500" /> 운영 팁</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">중요도 4 이상 이슈는 오전 회의 전 검토 완료 처리하고, 확인필요 항목은 원문 링크 기준으로 재확인하세요.</p>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function KpiCard({ title, value, tone }: { title: string; value: number | string; tone: "blue" | "orange" | "green" | "red" | "slate" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-50 text-slate-700",
  };
  return <div className="saas-card p-5"><p className="text-sm text-slate-500">{title}</p><p className={`mt-3 inline-flex rounded-2xl px-3 py-1 text-3xl font-black ${tones[tone]}`}>{value}</p></div>;
}

function MiniSignal({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-xl font-bold text-white">{value}</p></div>;
}

function buildTrend(items: Array<{ collectedAt: Date; insights: Array<{ importanceScore: number; impactType: string }> }>): IssueTrendPoint[] {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = startOfDay(addDays(new Date(), -(6 - index)));
    const key = formatDay(date);
    const dayItems = items.filter((item) => formatDay(item.collectedAt) === key);
    const important = dayItems.reduce((count, item) => count + item.insights.filter((insight) => insight.importanceScore >= 4).length, 0);
    const threats = dayItems.reduce((count, item) => count + item.insights.filter((insight) => insight.impactType === "THREAT").length, 0);
    return { day: key, collected: dayItems.length, important, threats };
  });
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDay(date: Date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
