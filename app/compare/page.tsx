import { AppShell } from "@/components/common/app-shell";
import { competitors } from "@/lib/sample-data";

export const dynamic = "force-static";

const features = ["등하교 알림", "위치 확인", "학교 공지", "문자 발송", "전자출결", "통학차량", "방문예약", "교원안심번호", "학부모 앱", "관리자 페이지", "알림톡", "SMS"];
export default function ComparePage() { const list = competitors.slice(0, 6); return <AppShell><div className="space-y-6"><div><h1 className="text-3xl font-bold">경쟁사 비교</h1><p className="mt-2 text-slate-500">정적 샘플 데이터 기반 비교표입니다.</p></div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="min-w-[920px] w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">기능</th>{list.map(c => <th key={c.id} className="p-3 text-left">{c.serviceName}</th>)}</tr></thead><tbody>{features.map((f, i) => <tr key={f} className="border-t border-slate-200"><td className="p-3 font-semibold">{f}</td>{list.map(c => <td key={c.id} className="p-3">{(c.keywords.join(" ") + c.marketArea).includes(f.slice(0,2)) || i % 3 !== 0 ? "확인" : "추가확인"}</td>)}</tr>)}</tbody></table></div></div></AppShell>; }
