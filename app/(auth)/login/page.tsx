import { LoginForm } from "./login-form";

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen min-w-[360px] items-center justify-center bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),linear-gradient(135deg,#020617,#0f172a)] px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden bg-slate-950 p-10 text-white lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">LUCIS Intel</p>
          <h1 className="mt-6 text-4xl font-black leading-tight">매일 아침, 경쟁사와 시장 변화를 한 화면에서 확인합니다.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">뉴스, 학교 안내문, 앱 업데이트, 조달·입찰, 정책 데이터를 T안심알리미 관점의 인사이트로 정리하는 내부 B2B SaaS 대시보드입니다.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {["12개 모니터링 채널", "중요도 1~5점 분류", "임원 보고용 리포트", "Netlify 무DB 데모"].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold">{item}</div>)}
          </div>
        </section>
        <section className="p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">일일 동향파악</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">데모 진입</h2>
          <p className="mt-2 text-sm text-slate-500">초기 Netlify 안정 배포용 버전은 별도 인증/DB 없이 브라우저에서 바로 실행됩니다.</p>
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
