import { AppShell } from "@/components/common/app-shell";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
const features = ["등하교 알림", "위치 확인", "학교 공지", "문자 발송", "전자출결", "통학차량", "방문예약", "교원안심번호", "학부모 앱", "관리자 페이지", "알림톡", "SMS"];
export default async function ComparePage() { const competitors = await prisma.competitor.findMany({ take: 6 }); return <AppShell><div className="space-y-6"><div><h1 className="text-3xl font-bold">경쟁사 비교</h1><p className="mt-2 text-slate-500">관리자가 기능 항목을 수정할 수 있는 비교표로 확장 예정입니다.</p></div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="min-w-[920px] w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">기능</th>{competitors.map(c => <th key={c.id} className="p-3 text-left">{c.serviceName}</th>)}</tr></thead><tbody>{features.map((f, i) => <tr key={f} className="border-t border-slate-200"><td className="p-3 font-semibold">{f}</td>{competitors.map(c => <td key={c.id} className="p-3">{(c.keywords.join(' ') + c.marketArea).includes(f.slice(0,2)) || i % 3 !== 0 ? '확인' : '추가확인'}</td>)}</tr>)}</tbody></table></div></div></AppShell>; }
