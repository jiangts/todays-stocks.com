import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class SMAIndicator implements TechnicalIndicator {
  name = "SMA";
  description =
    "A moving average smooths price data to identify trends over time.";
  formula =
    "SMA_n = \\frac{1}{n} \\sum_{i=0}^{n-1} C_i where SMA_n is the simple moving average over n periods, C_i is the closing price at day i.";
  defaultConfig: IndicatorConfig = { period: 14 };

  calculate(
    data: Quote[],
    config?: IndicatorConfig,
  ): Record<string, (number | null)[]> {
    const period = Number(config?.period || this.defaultConfig.period);

    if (data.length < period) {
      throw new Error("Not enough data to calculate SMA.");
    }

    const smaValues = data.map((_, i, arr) => {
      if (i < period - 1) return null;
      const sum = arr
        .slice(i - period + 1, i + 1)
        .reduce((acc, quote) => acc + quote.close, 0);
      return sum / period;
    });

    return {
      sma: smaValues,
    };
  }
}
