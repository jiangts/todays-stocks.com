import { Quote, TechnicalIndicator, IndicatorConfig } from "../types";

export class IchimokuIndicator implements TechnicalIndicator {
  name = "ICHIMOKU";
  defaultConfig: IndicatorConfig = {
    tenkanPeriod: 9,
    kijunPeriod: 26,
    senkouSpanBPeriod: 52,
    displacement: 26,
  };

  calculate(data: Quote[], config?: IndicatorConfig): (number | null)[] {
    const tenkanPeriod = Number(
      config?.tenkanPeriod || this.defaultConfig.tenkanPeriod,
    );
    const kijunPeriod = Number(
      config?.kijunPeriod || this.defaultConfig.kijunPeriod,
    );
    const senkouSpanBPeriod = Number(
      config?.senkouSpanBPeriod || this.defaultConfig.senkouSpanBPeriod,
    );
    const displacement = Number(
      config?.displacement || this.defaultConfig.displacement,
    );

    if (data.length < Math.max(kijunPeriod, senkouSpanBPeriod) + displacement) {
      throw new Error("Not enough data to calculate Ichimoku components.");
    }

    // Calculate Tenkan-sen (Conversion Line)
    const tenkanSen = this.calculatePeriodHighLowAverage(data, tenkanPeriod);

    // Calculate Kijun-sen (Base Line)
    const kijunSen = this.calculatePeriodHighLowAverage(data, kijunPeriod);

    // Calculate Senkou Span A (Leading Span A)
    const senkouSpanA = tenkanSen.map((tenkan, i) => {
      if (tenkan === null || kijunSen[i] === null) return null;
      return (tenkan + kijunSen[i]) / 2;
    });

    // Calculate Senkou Span B (Leading Span B)
    const senkouSpanB = this.calculatePeriodHighLowAverage(
      data,
      senkouSpanBPeriod,
    );

    // Calculate Chikou Span (Lagging Span)
    const chikouSpan = data.map((quote, i) => {
      if (i < displacement) return null;
      return quote.close;
    });

    // Return Tenkan-sen values (we'll need to modify the interface to return all components)
    return tenkanSen;
  }

  private calculatePeriodHighLowAverage(
    data: Quote[],
    period: number,
  ): (number | null)[] {
    return data.map((_, i, arr) => {
      if (i < period - 1) return null;

      const periodData = arr.slice(i - period + 1, i + 1);
      const highestHigh = Math.max(...periodData.map((quote) => quote.high));
      const lowestLow = Math.min(...periodData.map((quote) => quote.low));

      return (highestHigh + lowestLow) / 2;
    });
  }
}
