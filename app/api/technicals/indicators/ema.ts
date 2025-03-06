import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class EMAIndicator implements TechnicalIndicator {
  name = "EMA";
  description = "Unlike the SMA, the EMA gives more weight to recent prices.";
  formula = "EMA_t = \\alpha C_t + (1 - \\alpha) EMA_{t-1} where \\alpha = \\frac{2}{n+1} (smoothing factor), C_t is the closing price at time t, EMA_{t-1} is the EMA of the previous period.";
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
