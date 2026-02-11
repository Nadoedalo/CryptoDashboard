import type { ICoin } from '@stores/sharedTypes';
import type { ICoinListType } from '@stores/CoinStore';

export interface IHolding {
  coin: ICoin;
  quantity: number;
  price: number;
  historicalData?: ICoinHistoricalData;
}

export type THistoricalPoint = [timestampMs: number, value: number]; // [unixTimestampMs, value]

export interface ICoinHistoricalData {
  prices: THistoricalPoint[];
  market_caps: THistoricalPoint[];
  total_volumes: THistoricalPoint[];
}

export interface IHoldingSummary {
  coin: ICoin & { image: ICoinListType['image']; };
  quantity: IHolding['quantity'];
  price: IHolding['price'];
  evaluation: number;
  difference: number;
  percentage: number;
  priceChangeAbsolute24: ICoinListType['price_change_24h'];
  priceChangePercentage24: ICoinListType['price_change_percentage_24h'];
  high24: ICoinListType['high_24h'];
  low24: ICoinListType['low_24h'];
}

export interface IPortfolioSummary {
  totalEvaluation: number;
  totalInvestment: number;
  totalDiff: number;
  bestAsset: { coin: ICoinListType | null; percentage: number; difference: number | null; };
  worstAsset: { coin: ICoinListType | null; percentage: number; difference: number | null; };
}
