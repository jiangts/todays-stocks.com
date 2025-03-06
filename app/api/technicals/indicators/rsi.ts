import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class RSIIndicator implements TechnicalIndicator {
  name = "RSI";
  description = "Measures the strength of price momentum.";
  formula =
    "RSI = 100 - \\frac{100}{1 + RS} where RS = \\frac{\\text{Average Gain over } n \\text{ periods}}{\\text{Average Loss over } n \\text{ periods}}. Gains and losses are based on differences between successive closing prices. A common choice for n is 14 days.";
  defaultConfig: IndicatorConfig = { period: 14 };

  calculate(
    data: Quote[],
    config?: IndicatorConfig,
  ): Record<string, (number | null)[]> {
    const period = Number(config?.period || this.defaultConfig.period);

    if (data.length < period + 1) {
      throw new Error("Not enough data to calculate RSI.");
    }

    // Calculate price changes
    const changes = data.map((quote, i) => {
      if (i === 0) return 0;
      return quote.close - data[i - 1].close;
    });

    // Separate gains and losses
    const gains = changes.map((change) => (change > 0 ? change : 0));
    const losses = changes.map((change) => (change < 0 ? -change : 0));

    // Calculate average gains and losses
    const avgGains: number[] = [];
    const avgLosses: number[] = [];

    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        avgGains.push(null);
        avgLosses.push(null);
        continue;
      }

      if (i === period) {
        // First average is simple average
        const sumGains = gains
          .slice(1, period + 1)
          .reduce((sum, gain) => sum + gain, 0);
        const sumLosses = losses
          .slice(1, period + 1)
          .reduce((sum, loss) => sum + loss, 0);
        avgGains.push(sumGains / period);
        avgLosses.push(sumLosses / period);
      } else {
        // Subsequent averages use exponential smoothing
        avgGains.push((avgGains[i - 1] * (period - 1) + gains[i]) / period);
        avgLosses.push((avgLosses[i - 1] * (period - 1) + losses[i]) / period);
      }
    }

    // Calculate RS and RSI
    const rsiValues = avgGains.map((avgGain, i) => {
      if (avgGain === null) return null;
      const avgLoss = avgLosses[i];
      if (avgLoss === 0) return 100;
      const rs = avgGain / avgLoss;
      return 100 - 100 / (1 + rs);
    });

    return {
      rsi: rsiValues,
    };
  }
}
