import { NextResponse } from "next/server";
import { fetchQuoteSummary } from "@/app/api/technicals/marketData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const modulesParam = searchParams.get("modules");

    if (!symbol) {
      return NextResponse.json(
        { error: "Missing required parameter: symbol" },
        { status: 400 },
      );
    }

    // Parse modules parameter
    const modules = modulesParam ? modulesParam.split(",") : ["assetProfile", "defaultKeyStatistics"];

    // Validate modules
    const validModules = [
      "assetProfile", "balanceSheetHistory", "balanceSheetHistoryQuarterly",
      "calendarEvents", "cashflowStatementHistory", "cashflowStatementHistoryQuarterly",
      "defaultKeyStatistics", "earnings", "earningsHistory", "earningsTrend",
      "financialData", "fundOwnership", "fundPerformance", "fundProfile",
      "incomeStatementHistory", "incomeStatementHistoryQuarterly", "indexTrend",
      "industryTrend", "insiderHolders", "insiderTransactions", "institutionOwnership",
      "majorDirectHolders", "majorHoldersBreakdown", "netSharePurchaseActivity",
      "price", "quoteType", "recommendationTrend", "secFilings", "sectorTrend",
      "summaryDetail", "summaryProfile", "symbol", "topHoldings", "upgradeDowngradeHistory"
    ];

    // Check if all requested modules are valid
    const invalidModules = modules.filter(module => !validModules.includes(module));
    if (invalidModules.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid module(s) requested",
          invalidModules,
          validOptions: validModules
        },
        { status: 400 },
      );
    }

    const quoteSummary = await fetchQuoteSummary(symbol, modules as any);

    return NextResponse.json(quoteSummary);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}