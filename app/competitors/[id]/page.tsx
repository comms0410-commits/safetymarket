import { notFound } from "next/navigation";
import { AppShell } from "@/components/common/app-shell";
import { CompetitorForm } from "@/components/competitors/competitor-form";
import { deleteCompetitor, updateCompetitor } from "@/components/competitors/competitor-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

const labels = { ACTIVE: "활성", HOLD: "보류", WATCH: "관심", EXCLUDED: "제외", HIGH: "높음", MEDIUM: "보통", LOW: "낮음" } as const;

export default async function CompetitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const competitor = await prisma.competitor.findUnique({
    where: { id },
    include: {
      collectedItems: { orderBy: { collectedAt: "desc" }, take: 5 },
      insights: { orderBy: [{ importanceScore: "desc" }, { createdAt: "desc" }], take: 5 },
      monitoredSources: { orderBy: { updatedAt: "desc" }, take: 6 },
    },
  });
  if (!competitor) notFound();
  const updateAction = updateCompetitor.bind(null, competitor.id);
  const deleteAction = deleteCompetitor.bind(null, competitor.id);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="saas-card overflow-hidden">
          <div className="bg-slate-950 p-5 text-white sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-200">경쟁사 프로필</p>
                <h1 className="mt-2 text-3xl font-bold">{competitor.name}</h1>
                <p className="mt-2 text-slate-300">{competitor.serviceName} · {competitor.competitorType}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge value={competitor.status} label={labels[competitor.status]} />
                <Badge value={competitor.threatLevel} label={`위협도 ${labels[competitor.threatLevel]}`} />
                <form action={deleteAction}><Button variant="danger">삭제</Button></form>
              </div>
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
            <Info label="시장 영역" value={competitor.marketArea} />
            <Info label="관심도" value={labels[competitor.interestLevel]} />
            <Info label="수집 채널" value={`${competitor.monitoredSources.length}개`} />
            <Info label="최근 이슈" value={`${competitor.insights.length}개`} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="saas-card p-5 sm:p-6">
            <div className="flex gap-2 overflow-x-auto pb-2 text-sm font-semibold text-slate-600">
              {['프로필', '최근 동향', '기능 비교', '관련 수집자료', '대응전략 메모'].map((tab) => <span key={tab} className="shrink-0 rounded-full bg-slate-100 px-3 py-2">{tab}</span>)}
            </div>
            <div className="mt-5 grid gap-6">
              <div>
                <h2 className="section-title">최근 동향</h2>
                <div className="mt-3 space-y-3">
                  {competitor.insights.map((insight) => <div key={insight.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap gap-2"><Badge value={insight.impactType} /><span className="rounded-full bg-slate-900 px-2 py-1 text-xs font-bold text-white">중요도 {insight.importanceScore}</span></div><p className="mt-2 text-sm leading-6 text-slate-700">{insight.summary}</p></div>)}
                </div>
              </div>
              <div>
                <h2 className="section-title">관련 수집자료</h2>
                <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-[640px] w-full text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-3">제목</th><th className="p-3">수집일</th><th className="p-3">원문</th></tr></thead><tbody>{competitor.collectedItems.map((item) => <tr key={item.id} className="border-t border-slate-200"><td className="p-3 font-medium text-slate-900">{item.title}</td><td className="p-3 text-slate-500">{item.collectedAt.toLocaleDateString('ko-KR')}</td><td className="p-3"><a href={item.sourceUrl} className="text-blue-700 hover:underline">열기</a></td></tr>)}</tbody></table>
                </div>
              </div>
            </div>
          </div>
          <div className="saas-card p-5 sm:p-6">
            <h2 className="section-title">프로필 수정</h2>
            <p className="mt-1 text-sm text-slate-500">강점, 약점, 대응전략 메모를 최신 상태로 유지합니다.</p>
            <div className="mt-4"><CompetitorForm competitor={competitor} action={updateAction} compact /></div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 font-bold text-slate-950">{value}</p></div>;
}
