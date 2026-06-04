import { AppShell } from "@/components/common/app-shell";
import { Badge } from "@/components/ui/badge";
import { publicApiSources } from "@/lib/sample-data";

export const dynamic = "force-static";

export default function ApiSettingsPage() {
  const sources = publicApiSources;
  return <AppShell><div className="space-y-6"><div><h1 className="text-3xl font-bold">공공 API 설정</h1><p className="mt-2 text-slate-500">현재 실제 API 호출은 하지 않고, placeholder 상태만 보여줍니다.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sources.map((source) => <div key={source.id} className="saas-card p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold">{source.name}</h2><p className="mt-1 text-sm text-slate-500">{source.provider}</p></div><Badge value="NEEDS_CHECK" label="키 미설정" /></div><div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm"><p className="text-slate-500">환경변수명</p><p className="mt-1 font-mono font-semibold text-slate-900">{source.envKeyName}</p></div><p className="mt-3 text-xs text-slate-400">추후 connector 연결 예정</p></div>)}</div></div></AppShell>;
}
