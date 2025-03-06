import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class CMFIndicator implements TechnicalIndicator {
  name = "CMF";
  defaultConfig: IndicatorConfig = {
    period: 20,
  };

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
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
    return data.map((_, i, arr) => {
      if (i < period - 1) return null;

      const periodMFV = mfv.slice(i - period + 1, i + 1);
      const periodVolume = arr
        .slice(i - period + 1, i + 1)
        .map((q) => q.volume);

      const sumMFV = periodMFV.reduce((sum, mfv) => sum + mfv, 0);
      const sumVolume = periodVolume.reduce((sum, vol) => sum + vol, 0);

      return sumVolume === 0 ? 0 : sumMFV / sumVolume;
    });
  }
}
