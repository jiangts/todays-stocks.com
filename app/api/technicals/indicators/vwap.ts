import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class VWAPIndicator implements TechnicalIndicator {
  name = "VWAP";
  description = "A measure of the average price weighted by volume.";
  formula =
    "VWAP = \\frac{\\sum (V_t \\times P_t)}{\\sum V_t} where P_t = \\frac{H_t + L_t + C_t}{3} is the typical price.";
  defaultConfig: IndicatorConfig = {};

  calculate(
    data: Quote[],
    config?: IndicatorConfig,
  ): Record<string, (number | null)[]> {
    if (data.length < 1) {
      throw new Error("Not enough data to calculate VWAP.");
    }

    const result: (number | null)[] = [];
    let cumulativePV = 0; // Price * Volume
    let cumulativeV = 0; // Volume

    data.forEach((quote) => {
      const typicalPrice = (quote.high + quote.low + quote.close) / 3;
      cumulativePV += typicalPrice * quote.volume;
      cumulativeV += quote.volume;
      result.push(cumulativePV / cumulativeV);
    });

    return { vwap: result };
  }
}
