import { NextResponse } from "next/server";
import { getLatestMarketWatchRun } from "@/lib/market-watch/blob-store";
import { fallbackMarketWatchRun } from "@/lib/market-watch/static-fallback";

export const dynamic = "force-dynamic";

export async function GET() {
  const run = await getLatestMarketWatchRun();
  return NextResponse.json({ ok: true, run: run || fallbackMarketWatchRun, source: run ? "blob" : "fallback" });
}
