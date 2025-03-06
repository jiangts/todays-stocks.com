import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class WilliamsRIndicator implements TechnicalIndicator {
  name = "WILLIAMS_R";
  defaultConfig: IndicatorConfig = {
    period: 14,
  };

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
    const period = Number(config?.period || this.defaultConfig.period);

    if (data.length < period) {
      throw new Error("Not enough data to calculate Williams %R.");
    }

    return data.map((_, i, arr) => {
      if (i < period - 1) return null;

      const periodData = arr.slice(i - period + 1, i + 1);
      const highestHigh = Math.max(...periodData.map((quote) => quote.high));
      const lowestLow = Math.min(...periodData.map((quote) => quote.low));
      const currentClose = arr[i].close;

      return ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
    });
  }
}
