import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";
import { SMAIndicator } from "./sma";

export class BollingerBandsIndicator implements TechnicalIndicator {
  name = "BB";
  description = "A volatility indicator consisting of a moving average and two standard deviation bands.";
  formula = "\\text{Upper Band} = SMA_n + k \\cdot \\sigma, \\text{Lower Band} = SMA_n - k \\cdot \\sigma where \\sigma is the standard deviation of the closing prices over the last n days, k is typically set to 2.";
  defaultConfig: IndicatorConfig = {
    period: 20,
    stdDev: 2,
  };

  private smaIndicator: SMAIndicator;

  constructor() {
    this.smaIndicator = new SMAIndicator();
  }

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
    const period = Number(config?.period || this.defaultConfig.period);
    const stdDev = Number(config?.stdDev || this.defaultConfig.stdDev);

    if (data.length < period) {
      throw new Error("Not enough data to calculate Bollinger Bands.");
    }

    // Calculate SMA
    const sma = this.smaIndicator.calculate(data, { period });

    // Calculate standard deviation
    return data.map((_, i, arr) => {
      if (i < period - 1) return null;

      // Calculate standard deviation for the period
      const periodData = arr.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const squaredDiffs = periodData.map((quote) =>
        Math.pow(quote.close - mean, 2),
      );
      const variance =
        squaredDiffs.reduce((sum, diff) => sum + diff, 0) / period;
      const std = Math.sqrt(variance);

      // Return upper band (mean + stdDev * std)
      return mean + stdDev * std;
    });
  }
}
