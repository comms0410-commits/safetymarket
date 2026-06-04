import { AppShell } from "@/components/common/app-shell";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export default function Page(){return <AppShell><div className="saas-card p-8 text-center"><h1 className="text-3xl font-bold">경쟁사 낙찰·계약 분석 준비중</h1><p className="mt-3 text-slate-500">공공 API 연동 후 경쟁사 낙찰·계약 정보가 표시될 예정입니다.</p><div className="mt-6"><Button href="/api-settings">API 설정하러 가기</Button></div></div></AppShell>}
