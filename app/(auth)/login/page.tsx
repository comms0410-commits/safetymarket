import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");
  return (
    <main className="flex min-h-screen min-w-[360px] items-center justify-center bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),linear-gradient(135deg,#020617,#0f172a)] px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden bg-slate-950 p-10 text-white lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">LUCIS Intel</p>
          <h1 className="mt-6 text-4xl font-black leading-tight">매일 아침, 경쟁사와 시장 변화를 한 화면에서 확인합니다.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">뉴스, 학교 안내문, 앱 업데이트, 조달·입찰, 정책 데이터를 T안심알리미 관점의 인사이트로 정리하는 내부 B2B SaaS 대시보드입니다.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {['12개 모니터링 채널', '중요도 1~5점 분류', '임원 보고용 리포트', '공공 API 확장 준비'].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold">{item}</div>)}
          </div>
        </section>
        <section className="p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">일일 동향파악</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">로그인</h2>
          <p className="mt-2 text-sm text-slate-500">루키스 내부 사용자만 접근할 수 있습니다.</p>
          <LoginForm />
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">
            Seed 계정: <b>admin@lucis.local</b> / <b>ChangeMe123!</b><br />
            로컬 실행 후 브라우저에서 바로 대시보드를 확인할 수 있습니다.
          </div>
        </section>
      </div>
    </main>
  );
}
