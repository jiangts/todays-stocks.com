import { TechnicalIndicator } from "../types";
import { ATRIndicator } from "./atr";
import { TRIndicator } from "./tr";
import { SMAIndicator } from "./sma";
import { EMAIndicator } from "./ema";
import { RSIIndicator } from "./rsi";
import { MACDIndicator } from "./macd";
import { BollingerBandsIndicator } from "./bollinger-bands";
import { StochasticIndicator } from "./stochastic";
import { OBVIndicator } from "./obv";
import { VWAPIndicator } from "./vwap";
import { CCIIndicator } from "./cci";
import { CMFIndicator } from "./cmf";
import { WilliamsRIndicator } from "./williams-r";
import { ADLineIndicator } from "./ad-line";
import { IchimokuIndicator } from "./ichimoku";

export class IndicatorRegistry {
  private static instance: IndicatorRegistry;
  private indicators: Map<string, TechnicalIndicator>;

  private constructor() {
    this.indicators = new Map();
    this.registerDefaultIndicators();
  }

  private registerDefaultIndicators() {
    this.register(new ATRIndicator());
    this.register(new TRIndicator());
    this.register(new SMAIndicator());
    this.register(new EMAIndicator());
    this.register(new RSIIndicator());
    this.register(new MACDIndicator());
    this.register(new BollingerBandsIndicator());
    this.register(new StochasticIndicator());
    this.register(new OBVIndicator());
    this.register(new VWAPIndicator());
    this.register(new CCIIndicator());
    this.register(new CMFIndicator());
    this.register(new WilliamsRIndicator());
    this.register(new ADLineIndicator());
    this.register(new IchimokuIndicator());
  }

  public static getInstance(): IndicatorRegistry {
    if (!IndicatorRegistry.instance) {
      IndicatorRegistry.instance = new IndicatorRegistry();
    }
    return IndicatorRegistry.instance;
  }

  public register(indicator: TechnicalIndicator): void {
    this.indicators.set(indicator.name, indicator);
  }

  public getIndicator(name: string): TechnicalIndicator | undefined {
    return this.indicators.get(name);
  }

  public getAvailableIndicators(): string[] {
    return Array.from(this.indicators.keys());
  }
}
