import _ from "lodash";
import { NextResponse } from "next/server";
import { IndicatorRegistry } from "@/app/api/technicals/indicators/registry";
import {
  fetchMarketData,
  getEastCoastDate,
} from "@/app/api/technicals/marketData";
import {
  TechnicalRequest,
  IndicatorResult,
  IndicatorConfig,
} from "@/app/api/technicals/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const startDate = searchParams.get("startDate") || getEastCoastDate(-90);
    const endDate = searchParams.get("endDate") || getEastCoastDate(0);
    const indicators = searchParams.get("indicators")?.split(",") || [];
    const indicatorConfigs: { [key: string]: IndicatorConfig } = {};

    // Parse indicator configs from query params
    // Format: indicatorName.paramName=value
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key.includes(".")) {
        const [indicatorName, paramName] = key.split(".");
        if (!indicatorConfigs[indicatorName]) {
          indicatorConfigs[indicatorName] = {};
        }
        indicatorConfigs[indicatorName][paramName] = value;
      }
    });

    if (!symbol) {
      return NextResponse.json(
        { error: "Missing required parameter: symbol" },
        { status: 400 },
      );
    }

    // Fetch market data
    const marketData = await fetchMarketData(symbol, startDate, endDate);

    // Get indicator registry
    const registry = IndicatorRegistry.getInstance();

    // Calculate requested indicators
    const results: IndicatorResult[] = marketData.map((day, index) => {
      const result: IndicatorResult = {
        date: day.date,
        high: day.high,
        low: day.low,
        close: day.close,
        open: day.open,
        volume: day.volume,
      };

      // Calculate each requested indicator
      indicators.forEach((indicatorName) => {
        const indicator = registry.getIndicator(indicatorName);
        if (indicator) {
          const values = indicator.calculate(
            marketData,
            indicatorConfigs[indicatorName],
          );
          // Handle each value in the record
          Object.entries(values).forEach(([key, valueArray]) => {
            const fullKey = `${indicatorName}.${key}`;
            _.set(result, fullKey, valueArray[index]);
          });
        }
      });

      return result;
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}
