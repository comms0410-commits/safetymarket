import { CalendarDays, Search, UserCircle } from "lucide-react";
import { Sidebar } from "./sidebar";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" });

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <main className="min-w-0 lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 pl-14 lg:pl-0 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Daily Market Watch</p>
              <h2 className="mt-1 truncate text-xl font-bold text-slate-950 sm:text-2xl">일일 동향파악</h2>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <label className="relative min-w-0 flex-1 sm:w-80 sm:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="경쟁사, 이슈, 정책 검색"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 sm:flex">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                {dateFormatter.format(new Date())}
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 sm:px-3">
                <UserCircle className="h-5 w-5 text-slate-500" />
                <span className="hidden max-w-36 truncate sm:inline">루키스 데모 사용자</span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">DEMO</span>
              </div>
            </div>
          </div>
        </header>
        <div className="px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
