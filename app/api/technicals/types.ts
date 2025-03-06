export interface Quote {
  date: Date;
  high: number;
  low: number;
  close: number;
  open: number;
  volume: number;
}

export interface IndicatorConfig {
  [key: string]: number | string | boolean;
}

export interface TechnicalIndicator {
  name: string;
  description: string;
  formula: string;
  calculate: (
    data: Quote[],
    config?: IndicatorConfig,
  ) => Record<string, (number | null)[]>;
  defaultConfig?: IndicatorConfig;
}

export interface IndicatorResult {
  date: Date;
  high: number;
  low: number;
  close: number;
  open: number;
  volume: number;
  [key: string]: number | null | Date; // For dynamic indicator values
}

export interface TechnicalRequest {
  symbol: string;
  startDate?: string;
  endDate?: string;
  indicators: string[];
  period?: number;
  indicatorConfigs?: {
    [indicatorName: string]: IndicatorConfig;
  };
}
