import { NextResponse } from "next/server";
import { fetchScreen, ScrId } from "@/app/api/technicals/marketData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scrIds = searchParams.get("scrIds") as ScrId;
    const count = searchParams.get("count")
      ? parseInt(searchParams.get("count")!)
      : 5;
    const lang = searchParams.get("lang") || "en-US";
    const region = searchParams.get("region") || "US";

    if (!scrIds) {
      return NextResponse.json(
        { error: "Missing required parameter: scrIds" },
        { status: 400 },
      );
    }

    // Validate scrIds is a valid ScrId
    const validScrIds: string[] = [
      "aggressive_small_caps",
      "conservative_foreign_funds",
      "day_gainers",
      "day_losers",
      "growth_technology_stocks",
      "high_yield_bond",
      "most_actives",
      "most_shorted_stocks",
      "portfolio_anchors",
      "small_cap_gainers",
      "solid_large_growth_funds",
      "solid_midcap_growth_funds",
      "top_mutual_funds",
      "undervalued_growth_stocks",
      "undervalued_large_caps",
    ];

    if (!validScrIds.includes(scrIds)) {
      return NextResponse.json(
        { error: "Invalid scrIds parameter", validOptions: validScrIds },
        { status: 400 },
      );
    }

    const screenResults = await fetchScreen(scrIds, count, lang, region);

    return NextResponse.json(screenResults);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}
