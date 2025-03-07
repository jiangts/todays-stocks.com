import { NextResponse } from "next/server";
import { fetchInsights } from "@/app/api/technicals/marketData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const reportsCount = searchParams.get("reportsCount") ? parseInt(searchParams.get("reportsCount")!) : 5;
    const lang = searchParams.get("lang") || "en-US";
    const region = searchParams.get("region") || "US";

    if (!symbol) {
      return NextResponse.json(
        { error: "Missing required parameter: symbol" },
        { status: 400 },
      );
    }

    const insights = await fetchInsights(symbol, reportsCount, lang, region);

    return NextResponse.json(insights);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}