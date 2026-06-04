import { Bot, Send } from "lucide-react";
import { AppShell } from "@/components/common/app-shell";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function AskPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="saas-card p-6 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Bot className="h-7 w-7" /></div>
          <h1 className="mt-5 text-3xl font-bold">AI 시장질문</h1>
          <p className="mt-2 text-slate-500">경쟁사, 교육청 정책, 입찰, 학교 안내문 관련 질문을 입력하면 보고서형 답변 카드로 정리하는 화면입니다.</p>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-3">
            <textarea rows={5} placeholder="예: 최근 한 달간 등하교 알림 서비스 관련 교육청 정책 변화가 있었나?" className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-4 focus:ring-blue-100" />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-white px-3 py-2">전체 웹</span><span className="rounded-full bg-white px-3 py-2">경쟁사 중심</span><span className="rounded-full bg-white px-3 py-2">입찰 중심</span></div><Button><Send className="mr-2 h-4 w-4" />답변 생성</Button></div>
          </div>
        </section>
        <section className="saas-card p-6"><h2 className="section-title">답변 결과 카드 예시</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><Card title="핵심 답변" text="OpenAI Responses API와 웹 검색 도구를 연결할 수 있도록 3단계에서 API route를 구현합니다." /><Card title="T안심알리미 관점" text="확인된 사실과 해석을 분리하고 중요도·영향도·추천 대응방안을 함께 저장합니다." /></div></section>
      </div>
    </AppShell>
  );
}
function Card({ title, text }: { title: string; text: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="font-bold">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>; }
