import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class CMFIndicator implements TechnicalIndicator {
  name = "CMF";
  description = "Measures buying and selling pressure.";
  formula =
    "CMF = \\frac{\\sum_{i=0}^{n-1} (MFV_i \\times V_i)}{\\sum_{i=0}^{n-1} V_i} where MFV = \\frac{(C_t - L_t) - (H_t - C_t)}{H_t - L_t} is the money flow multiplier.";
  defaultConfig: IndicatorConfig = {
    period: 20,
  };

  calculate(
    data: Quote[],
    config?: IndicatorConfig,
  ): Record<string, (number | null)[]> {
    const period = Number(config?.period || this.defaultConfig.period);

    if (data.length < period) {
      throw new Error("Not enough data to calculate CMF.");
    }

    // Calculate Money Flow Multiplier and Money Flow Volume for each period
    const mfm = data.map((quote) => {
      const highLowRange = quote.high - quote.low;
      if (highLowRange === 0) return 0;
      return (
        (quote.close - quote.low - (quote.high - quote.close)) / highLowRange
      );
    });

    const mfv = mfm.map((multiplier, i) => multiplier * data[i].volume);

    // Calculate CMF using period
    const cmfValues = data.map((_, i, arr) => {
      if (i < period - 1) return null;

      const periodMFV = mfv.slice(i - period + 1, i + 1);
      const periodVolume = arr
        .slice(i - period + 1, i + 1)
        .map((q) => q.volume);

      const sumMFV = periodMFV.reduce((sum, mfv) => sum + mfv, 0);
      const sumVolume = periodVolume.reduce((sum, vol) => sum + vol, 0);

      return sumVolume === 0 ? 0 : sumMFV / sumVolume;
    });

    return {
      cmf: cmfValues,
    };
  }
}
