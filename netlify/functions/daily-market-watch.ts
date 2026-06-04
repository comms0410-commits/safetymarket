import { runDailyMarketWatch } from "../../lib/market-watch/runner";

export const config = {
  // 매일 한국시간 오전 9시 = UTC 00:00
  schedule: "0 0 * * *",
};

export const handler = async () => {
  try {
    const run = await runDailyMarketWatch();
    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: true, run }),
    };
  } catch (error) {
    console.error("daily-market-watch scheduled run failed", error);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }),
    };
  }
};
