import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class SMAIndicator implements TechnicalIndicator {
  name = "SMA";
  defaultConfig: IndicatorConfig = { period: 14 };

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
    const period = Number(config?.period || this.defaultConfig.period);

    if (data.length < period) {
      throw new Error("Not enough data to calculate SMA.");
    }

    return data.map((_, i, arr) => {
      if (i < period - 1) return null;
      const sum = arr
        .slice(i - period + 1, i + 1)
        .reduce((acc, quote) => acc + quote.close, 0);
      return sum / period;
    });
  }
}
