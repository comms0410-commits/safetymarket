import { Button } from "@/components/ui/button";

export function LoginForm() {
  return (
    <div className="mt-8 space-y-4">
      <label className="block text-sm font-medium text-slate-700">이메일
        <input defaultValue="admin@lucis.local" readOnly className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-slate-700">비밀번호
        <input defaultValue="Netlify 데모에서는 인증 없이 진입" readOnly className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" />
      </label>
      <Button href="/dashboard" className="w-full">데모 대시보드로 이동</Button>
    </div>
  );
}
