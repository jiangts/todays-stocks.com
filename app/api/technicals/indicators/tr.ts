import { Quote, TechnicalIndicator } from "../types";

export class TRIndicator implements TechnicalIndicator {
  name = "TR";
  description = "True Range";
  formula = "TR = max(H_t - L_t, |H_t - C_{t-1}|, |L_t - C_{t-1}|)";

  calculate(data: Quote[]): Record<string, (number | null)[]> {
    if (data.length < 2) {
      throw new Error("Not enough data to calculate TR.");
    }

    // Compute TR
    const trValues = data.map((day: Quote, i: number) => {
      if (i === 0) return null; // Skip first row since there is no previous close

      const prevClose = data[i - 1].close;
      const highLow = day.high - day.low;
      const highPrevClose = Math.abs(day.high - prevClose);
      const lowPrevClose = Math.abs(day.low - prevClose);

      return Math.max(highLow, highPrevClose, lowPrevClose);
    });

    return {
      tr: trValues,
    };
  }
}
