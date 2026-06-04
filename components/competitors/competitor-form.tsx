import type { Competitor } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";

const threatLabels = { LOW: "낮음", MEDIUM: "보통", HIGH: "높음" };
const statusLabels = { ACTIVE: "활성", HOLD: "보류", WATCH: "관심", EXCLUDED: "제외" };

export function CompetitorForm({ competitor, action, compact = false }: { competitor?: Competitor; action: (formData: FormData) => Promise<void>; compact?: boolean }) {
  const field = "rounded-lg border border-slate-200 px-3 py-2 text-sm";
  return (
    <form action={action} className={compact ? "grid gap-4" : "grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"}>
      <div className={compact ? "grid gap-3" : "grid gap-4 md:grid-cols-2"}>
        <Input name="name" label="회사명" defaultValue={competitor?.name} required />
        <Input name="serviceName" label="서비스명" defaultValue={competitor?.serviceName} required />
        <Input name="competitorType" label="경쟁 유형" defaultValue={competitor?.competitorType} placeholder="직접 경쟁, 확장 경쟁..." required />
        <Input name="marketArea" label="시장 영역" defaultValue={competitor?.marketArea} placeholder="등하교 알림, 학교소통..." required />
        <Input name="websiteUrl" label="공식 홈페이지 URL" defaultValue={competitor?.websiteUrl ?? ""} />
        <Input name="appAndroidUrl" label="구글플레이 URL" defaultValue={competitor?.appAndroidUrl ?? ""} />
        <Input name="appIosUrl" label="앱스토어 URL" defaultValue={competitor?.appIosUrl ?? ""} />
        <Input name="keywords" label="주요 키워드(쉼표 구분)" defaultValue={competitor?.keywords.join(", ") ?? ""} />
        <label className="grid gap-1 text-sm font-medium text-slate-700">위협도
          <select name="threatLevel" defaultValue={competitor?.threatLevel ?? "MEDIUM"} className={field}>{Object.entries(threatLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">관심도
          <select name="interestLevel" defaultValue={competitor?.interestLevel ?? "MEDIUM"} className={field}>{Object.entries(threatLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">상태값
          <select name="status" defaultValue={competitor?.status ?? "ACTIVE"} className={field}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>
      </div>
      <Textarea name="description" label="설명" defaultValue={competitor?.description ?? ""} />
      <div className="grid gap-4 md:grid-cols-2"><Textarea name="strengths" label="강점" defaultValue={competitor?.strengths ?? ""} /><Textarea name="weaknesses" label="약점" defaultValue={competitor?.weaknesses ?? ""} /></div>
      <Textarea name="responseStrategy" label="대응전략 메모" defaultValue={competitor?.responseStrategy ?? ""} />
      <Textarea name="internalMemo" label="내부 메모" defaultValue={competitor?.internalMemo ?? ""} />
      <div className="flex justify-end gap-2"><Button href="/competitors" variant="secondary">취소</Button><Button>{competitor ? "수정 저장 데모" : "경쟁사 등록 데모"}</Button></div>
    </form>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return <label className="grid gap-1 text-sm font-medium text-slate-700">{label}<input {...inputProps} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>;
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return <label className="grid gap-1 text-sm font-medium text-slate-700">{label}<textarea {...props} rows={3} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>;
}
