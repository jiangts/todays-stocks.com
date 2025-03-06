import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";
import { TRIndicator } from "./tr";

export class ATRIndicator implements TechnicalIndicator {
  name = "ATR";
  defaultConfig: IndicatorConfig = { period: 14 };
  private trIndicator: TRIndicator;

  constructor() {
    this.trIndicator = new TRIndicator();
  }

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
    const period = Number(config?.period || this.defaultConfig.period);

    if (data.length < period) {
      throw new Error("Not enough data to calculate ATR.");
    }

    // Get TR values using the TR indicator
    const trValues = this.trIndicator.calculate(data);

    // Compute ATR using a simple moving average
    return trValues.map(
      (_: number | null, i: number, arr: (number | null)[]) => {
        if (i < period - 1) return null; // Not enough data for ATR at the start
        return (
          arr
            .slice(i - period + 1, i + 1)
            .reduce((sum: number, tr: number | null) => sum + (tr || 0), 0) /
          period
        );
      },
    );
  }
}
