import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class OBVIndicator implements TechnicalIndicator {
  name = "OBV";
  description =
    "A volume-based indicator to detect accumulation or distribution.";
  formula =
    "OBV_t = \\begin{cases} OBV_{t-1} + V_t, & \\text{if } C_t > C_{t-1} \\\\ OBV_{t-1} - V_t, & \\text{if } C_t < C_{t-1} \\\\ OBV_{t-1}, & \\text{if } C_t = C_{t-1} \\end{cases} where V_t is the trading volume.";
  defaultConfig: IndicatorConfig = {};

  calculate(
    data: Quote[],
    config?: IndicatorConfig,
  ): Record<string, (number | null)[]> {
    if (data.length < 2) {
      throw new Error("Not enough data to calculate OBV.");
    }

    const obvValues: (number | null)[] = [];
    let obv = 0;

    data.forEach((quote, i) => {
      if (i === 0) {
        obvValues.push(0);
        return;
      }

      if (quote.close > data[i - 1].close) {
        obv += quote.volume;
      } else if (quote.close < data[i - 1].close) {
        obv -= quote.volume;
      }

      obvValues.push(obv);
    });

    return {
      obv: obvValues,
    };
  }
}
