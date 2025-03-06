import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

interface Quote {
  date: Date;
  high: number;
  low: number;
  close: number;
  open: number;
  volume: number;
}

function getTodayEasternDate(delta: number = -30): string {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() + delta));
  const easternTime = new Date(
    thirtyDaysAgo.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  return easternTime.toISOString().split("T")[0];
}

async function computeATR(
  symbol: string,
  startDate: string,
  period: number = 14,
) {
  const queryOptions = {
    period1: startDate,
    interval: "1d" as const,
    return: "object" as const,
  };
  const result = await yahooFinance.chart(symbol, queryOptions);

  if (!result.timestamp || result.timestamp.length < period) {
    throw new Error("Not enough data to calculate ATR.");
  }

  // Create Quote objects from the chart data
  const data: Quote[] = result.timestamp.map((date, index) => ({
    date: new Date(date * 1000),
    high: result.indicators.quote[0].high[index],
    low: result.indicators.quote[0].low[index],
    close: result.indicators.quote[0].close[index],
    open: result.indicators.quote[0].open[index],
    volume: result.indicators.quote[0].volume[index],
  }));
  console.log(data);

  // Compute TR
  const trValues = data
    .map((day: Quote, i: number) => {
      if (i === 0) return null; // Skip first row since there is no previous close

      const prevClose = data[i - 1].close;
      const highLow = day.high - day.low;
      const highPrevClose = Math.abs(day.high - prevClose);
      const lowPrevClose = Math.abs(day.low - prevClose);

      return Math.max(highLow, highPrevClose, lowPrevClose);
    })
    .slice(1); // Remove the first null entry

  // Compute ATR using a simple moving average
  const atrValues = trValues.map(
    (_: number | null, i: number, arr: (number | null)[]) => {
      if (i < period - 1) return null; // Not enough data for ATR at the start
      return (
        arr
          .slice(i - period + 1, i + 1)
          .reduce((sum: number, tr: number | null) => sum + (tr || 0), 0) /
        period
      );
    },
  );

  // Attach TR and ATR to the dataset
  return data.slice(1).map((day: Quote, i: number) => ({
    date: day.date,
    TR: trValues[i],
    ATR: atrValues[i],
    open: day.open,
    high: day.high,
    low: day.low,
    close: day.close,
    volume: day.volume,
  }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const startDate = searchParams.get("startDate") || getTodayEasternDate();
    const period = parseInt(searchParams.get("period") || "14");

    if (!symbol) {
      return NextResponse.json(
        { error: "Missing required parameter: symbol" },
        { status: 400 },
      );
    }

    console.log(
      "Computing ATR for symbol:",
      symbol,
      "with start date:",
      startDate,
      "and period:",
      period,
    );
    const result = await computeATR(symbol, startDate, period);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}
