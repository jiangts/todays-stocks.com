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

export async function fetchMarketData(
  symbol: string,
  startDate: string,
  endDate: string,
): Promise<Quote[]> {
  const queryOptions = {
    period1: startDate,
    period2: endDate,
    interval: "1d" as const,
    return: "object" as const,
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
