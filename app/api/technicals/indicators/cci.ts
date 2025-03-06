import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class CCIIndicator implements TechnicalIndicator {
  name = "CCI";
  defaultConfig: IndicatorConfig = {
    period: 20,
  };

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
    const period = Number(config?.period || this.defaultConfig.period);

    if (data.length < period) {
      throw new Error("Not enough data to calculate CCI.");
    }

    return data.map((_, i, arr) => {
      if (i < period - 1) return null;

      // Calculate typical price for the period
      const periodData = arr.slice(i - period + 1, i + 1);
      const typicalPrices = periodData.map(
        (quote) => (quote.high + quote.low + quote.close) / 3,
      );

      // Calculate SMA of typical prices
      const sma = typicalPrices.reduce((sum, price) => sum + price, 0) / period;

      // Calculate mean deviation
      const meanDeviation =
        typicalPrices.reduce((sum, price) => sum + Math.abs(price - sma), 0) /
        period;

      // Calculate CCI
      const currentTypicalPrice = typicalPrices[period - 1];
      return (currentTypicalPrice - sma) / (0.015 * meanDeviation);
    });
  }
}
