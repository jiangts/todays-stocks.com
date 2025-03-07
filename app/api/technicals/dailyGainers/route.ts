import { NextResponse } from "next/server";
import { fetchDailyGainers } from "@/app/api/technicals/marketData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = searchParams.get("count") ? parseInt(searchParams.get("count")!) : 25;
    const lang = searchParams.get("lang") || "en-US";
    const region = searchParams.get("region") || "US";

    const gainers = await fetchDailyGainers(count, lang, region);

    return NextResponse.json(gainers);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}