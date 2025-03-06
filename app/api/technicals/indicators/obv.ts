import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class OBVIndicator implements TechnicalIndicator {
  name = "OBV";
  defaultConfig: IndicatorConfig = {};

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
    if (data.length < 2) {
      throw new Error("Not enough data to calculate OBV.");
    }

    const result: (number | null)[] = [];
    let obv = 0;

    data.forEach((quote, i) => {
      if (i === 0) {
        result.push(0);
        return;
      }

      if (quote.close > data[i - 1].close) {
        obv += quote.volume;
      } else if (quote.close < data[i - 1].close) {
        obv -= quote.volume;
      }

      result.push(obv);
    });

    return result;
  }
}
