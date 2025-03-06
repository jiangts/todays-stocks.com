import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";
import { EMAIndicator } from "./ema";

export class MACDIndicator implements TechnicalIndicator {
  name = "MACD";
  description =
    "Shows the relationship between two moving averages of closing prices.";
  formula =
    "MACD = EMA_{12} - EMA_{26}. A \\text{signal line} is typically computed as \\text{Signal Line} = EMA_9(MACD).";
  defaultConfig: IndicatorConfig = {
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
  };

  private emaIndicator: EMAIndicator;

  constructor() {
    this.emaIndicator = new EMAIndicator();
  }

  calculate(
    data: Quote[],
    config?: IndicatorConfig,
  ): Record<string, (number | null)[]> {
    const fastPeriod = Number(
      config?.fastPeriod || this.defaultConfig.fastPeriod,
    );
    const slowPeriod = Number(
      config?.slowPeriod || this.defaultConfig.slowPeriod,
    );
    const signalPeriod = Number(
      config?.signalPeriod || this.defaultConfig.signalPeriod,
    );

    if (data.length < slowPeriod + signalPeriod) {
      throw new Error("Not enough data to calculate MACD.");
    }

    // Calculate fast and slow EMAs
    const fastEMAResult = this.emaIndicator.calculate(data, {
      period: fastPeriod,
    });
    const slowEMAResult = this.emaIndicator.calculate(data, {
      period: slowPeriod,
    });
    const fastEMA = fastEMAResult.ema;
    const slowEMA = slowEMAResult.ema;

    // Calculate MACD line (fast EMA - slow EMA)
    const macdLine = fastEMA.map((fast: number | null, i: number) => {
      if (fast === null || slowEMA[i] === null) return null;
      return fast - slowEMA[i];
    });

    // Calculate signal line (EMA of MACD line)
    const signalLineResult = this.emaIndicator.calculate(
      macdLine.map((value: number | null, i: number) => ({
        date: data[i].date,
        open: value || 0,
        high: value || 0,
        low: value || 0,
        close: value || 0,
        volume: 0,
      })),
      { period: signalPeriod },
    );
    const signalLine = signalLineResult.ema;

    // Calculate MACD histogram (MACD line - signal line)
    const histogram = macdLine.map((macd: number | null, i: number) => {
      if (macd === null || signalLine[i] === null) return null;
      return macd - signalLine[i];
    });

    return {
      macdLine,
      signalLine,
      histogram,
    };
  }
}
