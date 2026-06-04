import { AppShell } from "@/components/common/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

export default async function SourcesPage() {
  const sources = await prisma.monitoredSource.findMany({ include: { competitor: true }, orderBy: { updatedAt: "desc" }, take: 40 });
  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-bold">수집 URL</h1><p className="mt-2 text-slate-500">2단계에서 Cheerio 기반 수동 수집 버튼과 저장 로직이 연결됩니다.</p></div><Button variant="secondary">수집 URL 추가 예정</Button></div>
      <div className="grid gap-3 md:hidden">{sources.map((s) => <div key={s.id} className="saas-card p-4"><div className="flex items-start justify-between gap-2"><div><p className="font-bold">{s.sourceName}</p><p className="text-sm text-slate-500">{s.competitor.name}</p></div><Badge value={s.isActive ? "ACTIVE" : "HOLD"} label={s.isActive ? "활성" : "비활성"} /></div><p className="mt-2 break-all text-xs text-slate-500">{s.sourceUrl}</p></div>)}</div>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block"><table className="min-w-[840px] w-full text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-4">경쟁사</th><th className="p-4">수집원</th><th className="p-4">유형</th><th className="p-4">주기</th><th className="p-4">상태</th><th className="p-4">마지막 수집</th></tr></thead><tbody>{sources.map((s) => <tr key={s.id} className="border-t border-slate-200"><td className="p-4 font-semibold">{s.competitor.name}</td><td className="p-4">{s.sourceName}<p className="break-all text-xs text-slate-400">{s.sourceUrl}</p></td><td className="p-4">{s.sourceType}</td><td className="p-4">{s.collectFrequency}</td><td className="p-4"><Badge value={s.isActive ? "ACTIVE" : "HOLD"} label={s.isActive ? "활성" : "비활성"} /></td><td className="p-4 text-slate-500">{s.lastCollectedAt?.toLocaleString('ko-KR') ?? '-'}</td></tr>)}</tbody></table></div>
    </AppShell>
  );
}
