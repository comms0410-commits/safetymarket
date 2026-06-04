import { AppShell } from "@/components/common/app-shell";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function DailyReportPage() {
  const report = await prisma.dailyReport.findFirst({ orderBy: { reportDate: "desc" } });
  return <AppShell><div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-bold">일일 리포트</h1><p className="mt-2 text-slate-500">카드형 요약, 섹션별 본문, 원문 링크 목록 구조입니다.</p></div><Button variant="secondary">Word 다운로드 예정</Button></div><section className="saas-card p-6"><h2 className="text-2xl font-bold">{report?.title ?? "리포트 생성 대기"}</h2><p className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">{report?.executiveSummary ?? "오늘 수집된 이슈와 저장된 AI 질문 답변을 바탕으로 생성됩니다."}</p><div className="mt-6 grid gap-4 md:grid-cols-2"><Block title="경쟁사 주요 변화" text={report?.competitorSummary} /><Block title="정책·교육청 동향" text={report?.policySummary} /><Block title="입찰·조달 참고 이슈" text={report?.procurementSummary} /><Block title="오늘의 실행 제안" text={report?.recommendedActions} /></div></section></div></AppShell>;
}
function Block({ title, text }: { title: string; text?: string | null }) { return <div className="rounded-2xl border border-slate-200 p-4"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text ?? "후속 단계에서 자동 생성됩니다."}</p></div>; }
