import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";
import { SMAIndicator } from "./sma";

export class BollingerBandsIndicator implements TechnicalIndicator {
  name = "BB";
  description =
    "A volatility indicator consisting of a moving average and two standard deviation bands.";
  formula =
    "\\text{Upper Band} = SMA_n + k \\cdot \\sigma, \\text{Lower Band} = SMA_n - k \\cdot \\sigma where \\sigma is the standard deviation of the closing prices over the last n days, k is typically set to 2.";
  defaultConfig: IndicatorConfig = {
    period: 20,
    stdDev: 2,
  };

  private smaIndicator: SMAIndicator;

  constructor() {
    this.smaIndicator = new SMAIndicator();
  }

  calculate(
    data: Quote[],
    config?: IndicatorConfig,
  ): Record<string, (number | null)[]> {
    const period = Number(config?.period || this.defaultConfig.period);
    const stdDev = Number(config?.stdDev || this.defaultConfig.stdDev);

    if (data.length < period) {
      throw new Error("Not enough data to calculate Bollinger Bands.");
    }

    // Calculate SMA
    const sma = this.smaIndicator.calculate(data, { period });

    // Calculate standard deviation and bands
    const upperBand: (number | null)[] = [];
    const lowerBand: (number | null)[] = [];
    const middleBand: (number | null)[] = [];

    data.forEach((_, i, arr) => {
      if (i < period - 1) {
        upperBand.push(null);
        lowerBand.push(null);
        middleBand.push(null);
        return;
      }

      // Calculate standard deviation for the period
      const periodData = arr.slice(i - period + 1, i + 1);
      const mean = sma.sma[i];
      const squaredDiffs = periodData.map((quote) =>
        Math.pow(quote.close - mean, 2),
      );
      const variance =
        squaredDiffs.reduce((sum, diff) => sum + diff, 0) / period;
      const std = Math.sqrt(variance);

      // Calculate bands
      upperBand.push(mean + stdDev * std);
      lowerBand.push(mean - stdDev * std);
      middleBand.push(mean);
    });

    return {
      upperBand,
      middleBand,
      lowerBand,
    };
  }
}
