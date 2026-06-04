import { getStore } from "@netlify/blobs";
import type { MarketWatchRun } from "./types";

const STORE_NAME = process.env.MARKET_WATCH_BLOB_STORE || "daily-market-watch";
const LATEST_KEY = "market-watch/latest.json";

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export async function saveMarketWatchRun(run: MarketWatchRun) {
  const blobStore = store();
  await blobStore.setJSON(LATEST_KEY, run);
  await blobStore.setJSON(`market-watch/runs/${run.id}.json`, run);
}

export async function getLatestMarketWatchRun(): Promise<MarketWatchRun | null> {
  try {
    return await store().get(LATEST_KEY, { type: "json" }) as MarketWatchRun | null;
  } catch (error) {
    console.warn("Netlify Blobs latest market watch read failed. Falling back to bundled sample data.", error);
    return null;
  }
}
