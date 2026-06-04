import { NextRequest, NextResponse } from "next/server";
import { runDailyMarketWatch } from "@/lib/market-watch/runner";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.MARKET_WATCH_RUN_SECRET;
  if (secret) {
    const provided = request.headers.get("x-market-watch-secret") || request.nextUrl.searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const run = await runDailyMarketWatch();
  return NextResponse.json({ ok: true, run });
}
