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
