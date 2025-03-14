import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";
import { SMAIndicator } from "./sma";

export class StochasticIndicator implements TechnicalIndicator {
  name = "STOCHASTIC";
  description = "Measures momentum relative to recent highs and lows.";
  formula =
    "\\%K = \\frac{C_t - L_n}{H_n - L_n} \\times 100 where H_n and L_n are the highest and lowest prices in the last n periods, C_t is the most recent closing price. The smoothed version is \\%D = SMA_3(\\%K) where %D is a 3-day moving average of %K.";
  defaultConfig: IndicatorConfig = {
    kPeriod: 14,
    dPeriod: 3,
    slowingPeriod: 3,
  };

  private smaIndicator: SMAIndicator;

  constructor() {
    this.smaIndicator = new SMAIndicator();
  }

  calculate(
    data: Quote[],
    config?: IndicatorConfig,
  ): Record<string, (number | null)[]> {
    const kPeriod = Number(config?.kPeriod || this.defaultConfig.kPeriod);
    const dPeriod = Number(config?.dPeriod || this.defaultConfig.dPeriod);
    const slowingPeriod = Number(
      config?.slowingPeriod || this.defaultConfig.slowingPeriod,
    );

    if (data.length < kPeriod + slowingPeriod + dPeriod) {
      throw new Error("Not enough data to calculate Stochastic Oscillator.");
    }

    // Calculate %K
    const kValues = data.map((_, i, arr) => {
      if (i < kPeriod - 1) return null;

      // Get the highest high and lowest low for the period
      const periodData = arr.slice(i - kPeriod + 1, i + 1);
      const highestHigh = Math.max(...periodData.map((quote) => quote.high));
      const lowestLow = Math.min(...periodData.map((quote) => quote.low));

      // Calculate raw %K
      const rawK =
        ((arr[i].close - lowestLow) / (highestHigh - lowestLow)) * 100;

      // Apply slowing period if specified
      if (slowingPeriod > 1) {
        if (i < kPeriod + slowingPeriod - 1) return null;
        const kValues = arr.slice(i - slowingPeriod + 1, i + 1).map((_, j) => {
          const periodData = arr.slice(i - j - kPeriod + 1, i - j + 1);
          const highestHigh = Math.max(
            ...periodData.map((quote) => quote.high),
          );
          const lowestLow = Math.min(...periodData.map((quote) => quote.low));
          return (
            ((arr[i - j].close - lowestLow) / (highestHigh - lowestLow)) * 100
          );
        });
        return kValues.reduce((sum, k) => sum + k, 0) / slowingPeriod;
      }

      return rawK;
    });

    // Calculate %D (SMA of %K)
    const dValues = this.smaIndicator.calculate(
      kValues.map((value, i) => ({
        date: data[i].date,
        open: value || 0,
        high: value || 0,
        low: value || 0,
        close: value || 0,
        volume: 0,
      })),
      { period: dPeriod },
    ).sma;

    return {
      k: kValues,
      d: dValues,
    };
  }
}
