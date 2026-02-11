import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';

import { usePortfolioStore } from '@/stores/PortfolioStore/PortfolioStore';

const mockCoins = {
  bitcoin: {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
    current_price: 1,
    market_cap: 1353325339965,
    market_cap_rank: 1,
    fully_diluted_valuation: 1353325339965,
    total_volume: 44240827081,
    high_24h: 3,
    price_change_24h: 1,
    price_change_percentage_24h: 0,
    market_cap_change_24h: -39728312829.77051,
    market_cap_change_percentage_24h: -2.85189,
    circulating_supply: 19987456,
    total_supply: 19987456,
    max_supply: 21000000,
    ath: 126080,
    ath_change_percentage: -46.33239,
    ath_date: '2025-10-06T18:57:42.558Z',
    atl: 67.81,
    atl_change_percentage: 99686.25616,
    atl_date: '2013-07-06T00:00:00.000Z',
    roi: null,
    last_updated: '2026-02-11T05:22:00.608Z',
    price_change_percentage_24h_in_currency: -2.783863558497346,
  },
  ethereum: {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
    current_price: 2,
    market_cap: 300000000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 300000000000,
    total_volume: 20000000000,
    high_24h: 2200,
    price_change_24h: 50,
    price_change_percentage_24h: 2.5,
    market_cap_change_24h: 5000000000,
    market_cap_change_percentage_24h: 2.0,
    circulating_supply: 120000000,
    total_supply: 120000000,
    max_supply: null,
    ath: 4878,
    ath_change_percentage: -50,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 0.43,
    atl_change_percentage: 500000,
    atl_date: '2015-10-20T00:00:00.000Z',
    roi: null,
    last_updated: '2026-02-11T05:22:00.608Z',
    price_change_percentage_24h_in_currency: 2.5,
  },
};

const mockPortfolio = [
  {
    coin: {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
    },
    quantity: 2,
    price: 0.5,
  },
  {
    coin: {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
    },
    quantity: 1,
    price: 0.8,
    historicalData: {
      prices: [
        [1770595200000, 1],
        [1770681600000, 1],
        [1770768000000, 1],
        [1770787111000, 1],
      ],
      market_caps: [
        [1770595200000, 1411671712614.3147],
        [1770681600000, 1400898153463.9268],
        [1770768000000, 1374149240710.2896],
        [1770787111000, 1352873187450.2896],
      ],
      total_volumes: [
        [1770595200000, 42782981463.70375],
        [1770681600000, 56115089203.17752],
        [1770768000000, 43014177103.90287],
        [1770787111000, 44239647607.97048],
      ],
    },
  },
];

// Mock stores
vi.mock('@stores/CoinStore', () => ({
  useCoinStore: vi.fn(() => ({
    getCoinById: vi.fn((id: string) => mockCoins[id as keyof typeof mockCoins]),
  })),
}));

vi.mock('@stores/ToastNotificationStore', () => ({
  useToastNotificationStore: vi.fn(() => ({
    addToast: vi.fn(),
  })),
}));

describe('PortfolioStore', () => {
  beforeEach(() => {
    createTestingPinia({
      createSpy: vi.fn,
    });
    vi.clearAllMocks();

    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {
        portfolio: JSON.stringify(mockPortfolio),
      };
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        },
      };
    })();

    vi.stubGlobal('localStorage', localStorageMock);

    // PortfolioStore checks import.meta.client
    // We mock it to true to trigger the startup section
    vi.stubGlobal('import.meta.client', true);
  });

  it('should verify that portfolio has been filled with data', () => {
    const store = usePortfolioStore();
    // Verify portfolio is filled with the expected data
    expect(store.portfolio).toEqual(mockPortfolio);
  });

  it('should return correct getHoldingsSummary', () => {
    const store = usePortfolioStore();
    const summary = store.getHoldingsSummary;
    expect(summary).toHaveLength(2);
    const ethSummary = summary.find(s => s.coin.id === 'ethereum');
    expect(ethSummary).toBeDefined();
    expect(ethSummary?.evaluation).toBeCloseTo(4, 2);
    expect(ethSummary?.difference).toBeCloseTo(3, 2);
    expect(ethSummary?.percentage).toBeCloseTo(300, 2);

    const btcSummary = summary.find(s => s.coin.id === 'bitcoin');
    expect(btcSummary).toBeDefined();
    expect(btcSummary?.evaluation).toBeCloseTo(1, 2);
    expect(btcSummary?.difference).toBeCloseTo(0.2, 2);
    expect(btcSummary?.percentage).toBeCloseTo(25, 2);
  });

  it('should return correct portfolioSummary', () => {
    const store = usePortfolioStore();

    const summary = store.portfolioSummary;

    expect(summary.totalEvaluation).toBeCloseTo(5, 2);
    expect(summary.totalInvestment).toBeCloseTo(1.8, 2);
    expect(summary.totalDiff).toBeCloseTo(3.2, 2);

    // Best asset is Ethereum (difference 3 vs Bitcoin 0.2)
    expect(summary.bestAsset.coin?.id).toBe('ethereum');
    expect(summary.bestAsset.difference).toBeCloseTo(3, 2);

    // Worst asset is Bitcoin
    expect(summary.worstAsset.coin?.id).toBe('bitcoin');
    expect(summary.worstAsset.difference).toBeCloseTo(0.2, 2);
  });

  it('should return correct portfolioSummaryPercentage', () => {
    const store = usePortfolioStore();

    if (store.portfolio.length === 0) {
      store.portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    }

    // (Total Diff / Total Investment) * 100 = (3.2 / 1.8) * 100 = 177.777...
    expect(store.portfolioSummaryPercentage).toBeCloseTo(177.77, 1);
  });
});
