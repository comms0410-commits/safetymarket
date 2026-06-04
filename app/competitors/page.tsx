import Link from "next/link";
import { AppShell } from "@/components/common/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

const labels = { ACTIVE: "활성", HOLD: "보류", WATCH: "관심", EXCLUDED: "제외", HIGH: "높음", MEDIUM: "보통", LOW: "낮음" } as const;

export default async function CompetitorsPage() {
  const competitors = await prisma.competitor.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-bold">경쟁사 관리</h1><p className="mt-2 text-slate-500">활성 상태 경쟁사만 추후 자동 수집 대상에 포함됩니다.</p></div><Button href="/competitors/new">신규 등록</Button></div>
      <div className="grid gap-3 md:hidden">
        {competitors.map((c) => <Link key={c.id} href={`/competitors/${c.id}`} className="saas-card block p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-blue-700">{c.name}</p><p className="text-sm text-slate-500">{c.serviceName}</p></div><Badge value={c.status} label={labels[c.status]} /></div><p className="mt-3 text-sm text-slate-700">{c.marketArea}</p><div className="mt-3 flex flex-wrap gap-2"><Badge value={c.threatLevel} label={`위협도 ${labels[c.threatLevel]}`} /><Badge value={c.interestLevel} label={`관심도 ${labels[c.interestLevel]}`} /></div></Link>)}
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="min-w-[920px] w-full text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-4">회사/서비스</th><th className="p-4">경쟁 유형</th><th className="p-4">시장 영역</th><th className="p-4">위협도</th><th className="p-4">관심도</th><th className="p-4">상태</th></tr></thead><tbody>{competitors.map((c) => <tr key={c.id} className="border-t border-slate-200 hover:bg-slate-50"><td className="p-4"><Link href={`/competitors/${c.id}`} className="font-semibold text-blue-700 hover:underline">{c.name}</Link><p className="text-xs text-slate-500">{c.serviceName}</p></td><td className="p-4">{c.competitorType}</td><td className="p-4">{c.marketArea}</td><td className="p-4"><Badge value={c.threatLevel} label={labels[c.threatLevel]} /></td><td className="p-4"><Badge value={c.interestLevel} label={labels[c.interestLevel]} /></td><td className="p-4"><Badge value={c.status} label={labels[c.status]} /></td></tr>)}</tbody></table>
      </div>
    </AppShell>
  );
}
