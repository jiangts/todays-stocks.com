import yahooFinance from "yahoo-finance2";
import { Quote } from "./types";

export function getEastCoastDate(delta: number = 0): string {
  const now = new Date();
  const day = new Date(now.setDate(now.getDate() + delta));
  const easternTime = new Date(
    day.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  return easternTime.toISOString().split("T")[0];
}

type DateInput = Date | string | number;

type IntervalPeriod =
  | "1m" | "2m" | "5m" | "15m" | "30m"
  | "60m" | "90m" | "1h" | "1d" | "5d"
  | "1wk" | "1mo" | "3mo";

export async function fetchMarketData(
  symbol: string,
  period1: DateInput,
  period2: DateInput = new Date(),
  interval: IntervalPeriod = "1d",
  events: string = "div|split|earn",
  lang: string = "en-US",
): Promise<Quote[]> {
  const queryOptions = {
    period1: period1,
    period2: period2,
    interval,
    return: "object" as const,
    events,
    lang,
  };

  const result = await yahooFinance.chart(symbol, queryOptions);

  if (!result.timestamp || result.timestamp.length === 0) {
    throw new Error("No market data available for the specified period.");
  }

  return result.timestamp.map((date, index) => ({
    date: new Date(date * 1000),
    high: result.indicators.quote[0].high[index],
    low: result.indicators.quote[0].low[index],
    close: result.indicators.quote[0].close[index],
    open: result.indicators.quote[0].open[index],
    volume: result.indicators.quote[0].volume[index],
  }));
}

export async function fetchDailyGainers(
  count: number = 25,
  lang: string = "en-US",
  region: string = "US",
) {
  const losers = await yahooFinance.dailyGainers({ count, lang, region });
  return losers;
}

export async function fetchInsights(
  symbol: string,
  reportsCount: number = 5,
  lang: string = "en-US",
  region: string = "US",
) {
  const losers = await yahooFinance.insights(symbol, {
    reportsCount,
    lang,
    region,
  });
  return losers;
}

export type ScrId =
  | "aggressive_small_caps"
  | "conservative_foreign_funds"
  | "day_gainers"
  | "day_losers"
  | "growth_technology_stocks"
  | "high_yield_bond"
  | "most_actives"
  | "most_shorted_stocks"
  | "portfolio_anchors"
  | "small_cap_gainers"
  | "solid_large_growth_funds"
  | "solid_midcap_growth_funds"
  | "top_mutual_funds"
  | "undervalued_growth_stocks"
  | "undervalued_large_caps";

export async function fetchScreen(
  scrIds: ScrId,
  count: number = 5,
  lang: string = "en-US",
  region: string = "US",
) {
  const result = await yahooFinance.screener({ scrIds, count, lang, region });
  return result;
}

export type ReportingPeriodType = "quarterly" | "annual" | "trailing";

export type FinancialModule =
  | "financials"
  | "balance-sheet"
  | "cash-flow"
  | "all";

export async function fetchFundamentals(
  symbol: string,
  period1: Date,
  period2: Date = new Date(),
  type: ReportingPeriodType = "quarterly",
  module: FinancialModule = "financials",
  lang: string = "en-US",
  region: string = "US",
) {
  const result = await yahooFinance.fundamentalsTimeSeries(symbol, {
    period1,
    period2,
    type,
    module,
    lang,
    region,
  });
  return result;
}

export async function fetchOptions(
  symbol: string,
  formatted: boolean = true,
  lang: string = "en-US",
  region: string = "US",
  date: Date = new Date(),
) {
  const result = await yahooFinance.options(symbol, {
    formatted,
    lang,
    region,
    date,
  });
  return result;
}

export async function fetchQuote(symbol: string) {
  const result = await yahooFinance.quote(symbol);
  return result;
}

type QuoteSummaryModule =
  | "assetProfile"
  | "balanceSheetHistory"
  | "balanceSheetHistoryQuarterly"
  | "calendarEvents"
  | "cashflowStatementHistory"
  | "cashflowStatementHistoryQuarterly"
  | "defaultKeyStatistics"
  | "earnings"
  | "earningsHistory"
  | "earningsTrend"
  | "financialData"
  | "fundOwnership"
  | "fundPerformance"
  | "fundProfile"
  | "incomeStatementHistory"
  | "incomeStatementHistoryQuarterly"
  | "indexTrend"
  | "industryTrend"
  | "insiderHolders"
  | "insiderTransactions"
  | "institutionOwnership"
  | "majorDirectHolders"
  | "majorHoldersBreakdown"
  | "netSharePurchaseActivity"
  | "price"
  | "quoteType"
  | "recommendationTrend"
  | "secFilings"
  | "sectorTrend"
  | "summaryDetail"
  | "summaryProfile"
  | "symbol"
  | "topHoldings"
  | "upgradeDowngradeHistory";

export async function fetchQuoteSummary(
  symbol: string,
  modules: QuoteSummaryModule[] = ["assetProfile", "defaultKeyStatistics"],
) {
  const result = await yahooFinance.quoteSummary(symbol, {
    modules: modules as any,
  });
  return result;
}
