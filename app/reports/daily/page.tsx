import { AppShell } from "@/components/common/app-shell";
import { Button } from "@/components/ui/button";
import { getLatestMarketWatchRun } from "@/lib/market-watch/blob-store";
import { dailyReport } from "@/lib/sample-data";

export const dynamic = "force-dynamic";

export default async function DailyReportPage() {
  const latestRun = await getLatestMarketWatchRun();
  const topAnalyses = latestRun?.analyses.sort((a, b) => b.importanceScore - a.importanceScore).slice(0, 5) || [];
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">일일 리포트</h1>
            <p className="mt-2 text-slate-500">자동 분석 결과가 있으면 Netlify Blobs의 최신 리포트를 우선 표시합니다.</p>
          </div>
          <Button variant="secondary">Word 다운로드 예정</Button>
        </div>
        <section className="saas-card p-6">
          <h2 className="text-2xl font-bold">{latestRun ? `${latestRun.id} 자동 경쟁사 동향 리포트` : dailyReport.title}</h2>
          <p className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">{latestRun?.summary || dailyReport.executiveSummary}</p>
          {latestRun && <p className="mt-3 text-sm text-slate-500">생성 시각: {latestRun.generatedAtKst} · OpenAI 사용: {latestRun.usedOpenAI ? "예" : "아니오"} · 수집기: {latestRun.collector}</p>}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {latestRun ? topAnalyses.map((analysis) => <Block key={analysis.competitorId} title={`${analysis.competitorName} / 중요도 ${analysis.importanceScore}`} text={`${analysis.summary}\n추천 대응: ${analysis.recommendedAction}`} />) : <>
              <Block title="경쟁사 주요 변화" text={dailyReport.competitorSummary} />
              <Block title="정책·교육청 동향" text={dailyReport.policySummary} />
              <Block title="입찰·조달 참고 이슈" text={dailyReport.procurementSummary} />
              <Block title="오늘의 실행 제안" text={dailyReport.recommendedActions} />
            </>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
function Block({ title, text }: { title: string; text: string }) { return <div className="rounded-2xl border border-slate-200 p-4"><h3 className="font-bold">{title}</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{text}</p></div>; }
