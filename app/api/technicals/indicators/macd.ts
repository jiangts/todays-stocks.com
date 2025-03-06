import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";
import { EMAIndicator } from "./ema";

export class MACDIndicator implements TechnicalIndicator {
  name = "MACD";
  defaultConfig: IndicatorConfig = {
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
  };

  private emaIndicator: EMAIndicator;

  constructor() {
    this.emaIndicator = new EMAIndicator();
  }

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
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
    const fastEMA = this.emaIndicator.calculate(data, { period: fastPeriod });
    const slowEMA = this.emaIndicator.calculate(data, { period: slowPeriod });

    // Calculate MACD line (fast EMA - slow EMA)
    const macdLine = fastEMA.map((fast, i) => {
      if (fast === null || slowEMA[i] === null) return null;
      return fast - slowEMA[i];
    });

    // Calculate signal line (EMA of MACD line)
    const signalLine = this.emaIndicator.calculate(
      macdLine.map((value, i) => ({
        date: data[i].date,
        open: value || 0,
        high: value || 0,
        low: value || 0,
        close: value || 0,
        volume: 0,
      })),
      { period: signalPeriod },
    );

    // Calculate MACD histogram (MACD line - signal line)
    return macdLine.map((macd, i) => {
      if (macd === null || signalLine[i] === null) return null;
      return macd - signalLine[i];
    });
  }
}
