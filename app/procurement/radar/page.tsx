import { AppShell } from "@/components/common/app-shell";
import { Button } from "@/components/ui/button";
export default function Page(){return <AppShell><Placeholder title="조달 레이더 준비중" text="공공 API 연동 후 신규 입찰공고가 표시될 예정입니다." /></AppShell>}
function Placeholder({title,text}:{title:string;text:string}){return <div className="saas-card p-8 text-center"><h1 className="text-3xl font-bold">{title}</h1><p className="mt-3 text-slate-500">{text}</p><div className="mt-6"><Button href="/api-settings">API 설정하러 가기</Button></div></div>}
