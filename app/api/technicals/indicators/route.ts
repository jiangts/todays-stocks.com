import { NextResponse } from "next/server";
import { IndicatorRegistry } from "./registry";

export async function GET() {
  try {
    const registry = IndicatorRegistry.getInstance();
    const indicators = registry
      .getAvailableIndicators()
      .map((name) => {
        const indicator = registry.getIndicator(name);
        if (!indicator) return null;

        return {
          name: indicator.name,
          description: indicator.description,
          formula: indicator.formula,
          defaultConfig: indicator.defaultConfig,
        };
      })
      .filter(Boolean);

    return NextResponse.json(indicators);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}
