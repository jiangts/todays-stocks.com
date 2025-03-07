import { NextResponse } from "next/server";
import { fetchFundamentals, ReportingPeriodType, FinancialModule, getEastCoastDate } from "@/app/api/technicals/marketData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const period1Str = searchParams.get("period1") || getEastCoastDate(-365);
    const period2Str = searchParams.get("period2") || getEastCoastDate(0);
    const type = (searchParams.get("type") || "quarterly") as ReportingPeriodType;
    const _module = (searchParams.get("module") || "financials") as FinancialModule;
    const lang = searchParams.get("lang") || "en-US";
    const region = searchParams.get("region") || "US";

    if (!symbol) {
      return NextResponse.json(
        { error: "Missing required parameter: symbol" },
        { status: 400 },
      );
    }

    // Validate type
    const validTypes = ["quarterly", "annual", "trailing"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid type parameter", validOptions: validTypes },
        { status: 400 },
      );
    }

    // Validate module
    const validModules = ["financials", "balance-sheet", "cash-flow", "all"];
    if (!validModules.includes(_module)) {
      return NextResponse.json(
        { error: "Invalid module parameter", validOptions: validModules },
        { status: 400 },
      );
    }

    const period1 = new Date(period1Str);
    const period2 = new Date(period2Str);

    const fundamentals = await fetchFundamentals(symbol, period1, period2, type, _module, lang, region);

    return NextResponse.json(fundamentals);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}