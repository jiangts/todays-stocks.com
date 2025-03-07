import { NextResponse } from "next/server";
import { fetchOptions } from "@/app/api/technicals/marketData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const formatted = searchParams.get("formatted") !== "false"; // Default to true
    const lang = searchParams.get("lang") || "en-US";
    const region = searchParams.get("region") || "US";
    const dateStr = searchParams.get("date");

    if (!symbol) {
      return NextResponse.json(
        { error: "Missing required parameter: symbol" },
        { status: 400 },
      );
    }

    // Parse date if provided
    const date = dateStr ? new Date(dateStr) : new Date();

    const options = await fetchOptions(symbol, formatted, lang, region, date);

    return NextResponse.json(options);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}
