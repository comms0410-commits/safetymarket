"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Bot,
  Building2,
  ClipboardList,
  FileQuestion,
  FileText,
  GitCompare,
  LandPlot,
  Menu,
  Radar,
  Search,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "대시보드", icon: BarChart3 },
  { href: "/competitors", label: "경쟁사 관리", icon: Building2 },
  { href: "/sources", label: "수집 URL", icon: Search },
  { href: "/ask", label: "AI 시장질문", icon: Bot },
  { href: "/research/questions", label: "질문 이력", icon: FileQuestion },
  { href: "/reports/daily", label: "일일 리포트", icon: FileText },
  { href: "/compare", label: "경쟁사 비교", icon: GitCompare },
  { href: "/api-settings", label: "공공 API 설정", icon: Settings },
  { href: "/procurement/radar", label: "조달 레이더 준비중", icon: Radar },
  { href: "/market/schools", label: "시장지도 준비중", icon: LandPlot },
  { href: "/competitors/contracts", label: "계약 분석 준비중", icon: ClipboardList },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1 px-3 pb-5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isPending = item.label.includes("준비중");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <span className={cn("rounded-lg p-2", isPending ? "bg-slate-800 text-slate-400" : "bg-blue-500/15 text-blue-200")}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {isPending && <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">예정</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 overflow-y-auto border-r border-slate-800 bg-slate-950 text-white lg:block">
        <Brand />
        <NavList />
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="메뉴 닫기 배경" className="absolute inset-0 bg-slate-950/60" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-[min(88vw,320px)] overflow-y-auto bg-slate-950 text-white shadow-2xl">
            <div className="flex items-start justify-between pr-4">
              <Brand />
              <button type="button" aria-label="메뉴 닫기" onClick={() => setOpen(false)} className="mt-5 rounded-lg p-2 text-slate-300 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

function Brand() {
  return (
    <div className="px-6 py-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">LUCIS Intel</p>
      <h1 className="mt-2 text-2xl font-bold">일일 동향파악</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">T안심알리미 경쟁사·시장 모니터링</p>
    </div>
  );
}
