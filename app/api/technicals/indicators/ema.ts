import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class EMAIndicator implements TechnicalIndicator {
  name = "EMA";
  defaultConfig: IndicatorConfig = { period: 14 };

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
    const period = Number(config?.period || this.defaultConfig.period);
    const multiplier = 2 / (period + 1);

    if (data.length < period) {
      throw new Error("Not enough data to calculate EMA.");
    }

    const result: (number | null)[] = [];
    let ema = data[0].close;

    data.forEach((quote, i) => {
      if (i < period - 1) {
        result.push(null);
        return;
      }

      if (i === period - 1) {
        // First EMA is SMA
        const sma =
          data.slice(0, period).reduce((sum, q) => sum + q.close, 0) / period;
        ema = sma;
      } else {
        ema = (quote.close - ema) * multiplier + ema;
      }
      result.push(ema);
    });

    return result;
  }
}
