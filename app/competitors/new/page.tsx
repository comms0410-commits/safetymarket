import { AppShell } from "@/components/common/app-shell";
import { CompetitorForm } from "@/components/competitors/competitor-form";
import { createCompetitor } from "@/components/competitors/competitor-actions";

export const dynamic = "force-static";

export default function NewCompetitorPage() {
  return <AppShell><h1 className="mb-6 text-3xl font-bold">경쟁사 신규 등록 데모</h1><CompetitorForm action={createCompetitor} /></AppShell>;
}
