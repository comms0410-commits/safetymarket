import { AppShell } from "@/components/common/app-shell";
import { Button } from "@/components/ui/button";
export default function Page(){return <AppShell><div className="saas-card p-8 text-center"><h1 className="text-3xl font-bold">유아시장 분석 준비중</h1><p className="mt-3 text-slate-500">어린이집정보공개 API 연동 후 유아시장 분석이 표시될 예정입니다.</p><div className="mt-6"><Button href="/api-settings">API 설정하러 가기</Button></div></div></AppShell>}
