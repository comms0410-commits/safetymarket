import { cn } from "@/lib/utils/cn";

const styles: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  HOLD: "bg-amber-100 text-amber-700 ring-amber-200",
  WATCH: "bg-blue-100 text-blue-700 ring-blue-200",
  EXCLUDED: "bg-slate-100 text-slate-600 ring-slate-200",
  HIGH: "bg-red-100 text-red-700 ring-red-200",
  MEDIUM: "bg-amber-100 text-amber-700 ring-amber-200",
  LOW: "bg-slate-100 text-slate-600 ring-slate-200",
  THREAT: "bg-red-100 text-red-700 ring-red-200",
  OPPORTUNITY: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  NEUTRAL: "bg-slate-100 text-slate-600 ring-slate-200",
  NEEDS_CHECK: "bg-orange-100 text-orange-700 ring-orange-200",
  NEEDS_REVIEW: "bg-orange-100 text-orange-700 ring-orange-200",
  REVIEWED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
};

export function Badge({ value, label, className }: { value: string; label?: string; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", styles[value] ?? "bg-slate-100 text-slate-700 ring-slate-200", className)}>{label ?? value}</span>;
}
