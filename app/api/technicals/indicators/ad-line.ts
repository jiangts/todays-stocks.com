import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class ADLineIndicator implements TechnicalIndicator {
  name = "AD_LINE";
  defaultConfig: IndicatorConfig = {};

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
    if (data.length < 1) {
      throw new Error("Not enough data to calculate A/D Line.");
    }

    const result: (number | null)[] = [];
    let adLine = 0;

    data.forEach((quote) => {
      const highLowRange = quote.high - quote.low;
      if (highLowRange === 0) {
        result.push(adLine);
        return;
      }

      const moneyFlowMultiplier =
        (quote.close - quote.low - (quote.high - quote.close)) / highLowRange;
      const moneyFlowVolume = moneyFlowMultiplier * quote.volume;
      adLine += moneyFlowVolume;

      result.push(adLine);
    });

    return result;
  }
}
