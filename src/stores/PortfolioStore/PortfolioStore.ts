import { skipHydrate } from 'pinia';
import type { ICoinHistoricalData, IHolding, IHoldingSummary, IPortfolioSummary } from '.';
import type { ICoin } from '@types';
import { mainConfig } from '~/config/main';
import { useCoinStore } from '@stores/CoinStore';
import { useToastNotificationStore } from '@stores/ToastNotificationStore';
import { fetchHelper } from '~/utils/fetchHelper';

export const usePortfolioStore = defineStore('PortfolioStore', () => {
  const toastStore = useToastNotificationStore();
  const { $i18n } = useNuxtApp();
  /**
   * State section
   * */
  const portfolio = ref<IHolding[]>([]);
  const isHistoricalDataLoading = ref(false);
  /**
   * Startup section
   * */
  if (import.meta.client) {
    portfolio.value = (JSON.parse(window.localStorage.getItem('portfolio') || '""') || []) as IHolding[];
    isHistoricalDataLoading.value = true;
    lazyFetchPortfolioHistoricalData().finally(() => isHistoricalDataLoading.value = false);
  }

  const coinStore = useCoinStore();

  /**
   * Watchers section, examples:
   * someStore.$subscribe
   * someStore.$onAction
   * */
  watch(portfolio, () => {
    // The LocalStorage system can definitely be better, for example, by having a version control or a composable
    if (import.meta.client) {
      window.localStorage.setItem('portfolio', JSON.stringify(portfolio.value));
    }
  }, { deep: true });

  /**
   * Getters section
   * */
  const getHoldingInPortfolioByCoin = computed(() => (coin: ICoin) => {
    return portfolio.value.find(({ coin: { id } }) => id === coin.id);
  });

  const getInvestmentAmountByHolding = computed(() => (holding: IHolding) => holding.quantity * holding.price);
  const getCurrentValueAmountByHolding = computed(() => (holding: IHolding) => holding.quantity * (coinStore.getCoinById(holding.coin.id)?.current_price || 0));
  const totalDifferenceByHolding = computed(() => (holding: IHolding) => getCurrentValueAmountByHolding.value(holding) - getInvestmentAmountByHolding.value(holding));
  const percentageDifferenceByHolding = computed(() => (holding: IHolding) => (totalDifferenceByHolding.value(holding) / getInvestmentAmountByHolding.value(holding)) * 100);
  const getHoldingsSummary = computed((): IHoldingSummary[] => {
    return portfolio.value.reduce((memo, holding) => {
      const coin = coinStore.getCoinById(holding.coin?.id);
      if (coin) {
        memo.push({
          coin: {
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            image: coin.image,
          },
          quantity: holding.quantity,
          price: +holding.price.toFixed(2),
          evaluation: +getCurrentValueAmountByHolding.value(holding)?.toFixed(2),
          difference: +totalDifferenceByHolding.value(holding)?.toFixed(2),
          percentage: +percentageDifferenceByHolding.value(holding)?.toFixed(2),
          priceChangeAbsolute24: coin.price_change_24h,
          priceChangePercentage24: coin.price_change_percentage_24h,
          high24: coin.high_24h,
          low24: coin.low_24h,
        });
      }
      return memo;
    }, [] as IHoldingSummary[]);
  });

  const portfolioSummary = computed(() => {
    return portfolio.value.reduce((memo, holding) => {
      const coinList = coinStore.getCoinById(holding.coin.id);
      if (!coinList) return memo;
      const coinCurrentPrice = coinList.current_price || 0;
      if (coinCurrentPrice) {
        memo.totalEvaluation += holding.quantity * coinCurrentPrice;
        memo.totalInvestment += holding.quantity * holding.price;
        const difference = (coinCurrentPrice - holding.price) * holding.quantity;
        memo.totalDiff += difference;
        const percentage = ((coinCurrentPrice - holding.price) / holding.price) * 100;
        if (memo.bestAsset.difference === null || difference > memo.bestAsset.difference) {
          memo.bestAsset = { coin: coinList, percentage, difference };
        }
        if (memo.worstAsset.difference === null || difference < memo.worstAsset.difference) {
          memo.worstAsset = { coin: coinList, percentage, difference };
        }
      }
      return memo;
    }, {
      totalEvaluation: 0,
      totalInvestment: 0,
      totalDiff: 0,
      bestAsset: {
        coin: null,
        percentage: 0,
        difference: null,
      },
      worstAsset: {
        coin: null,
        percentage: 0,
        difference: null,
      },
    } as IPortfolioSummary);
  });

  const portfolioSummaryPercentage = computed(() => (portfolioSummary.value.totalDiff / portfolioSummary.value.totalInvestment) * 100);

  /**
   * Actions section
   * */
  async function addHolding(holding: Omit<IHolding, 'historicalData'>) {
    portfolio.value.push(holding);
    isHistoricalDataLoading.value = true;
    fetchHistoricalDataByCoinId(holding.coin.id).then(({ data }) => {
      updateHolding({
        ...holding,
        historicalData: data,
      });
    }).finally(() => isHistoricalDataLoading.value = false);
  }

  function removeHolding(coin: ICoin) {
    returnHoldingFromPortfolioByCoin(coin);
    portfolio.value = portfolio.value.filter(({ coin: { id } }) => id !== coin.id);
  }

  function updateHolding(holding: IHolding) {
    const portfolioHolding = returnHoldingFromPortfolioByCoin(holding.coin);
    portfolioHolding.quantity = holding.quantity;
    portfolioHolding.price = holding.price;
    portfolioHolding.historicalData = holding.historicalData;
    /*
      technically, if quantity is 0,
      we should remove it from the portfolio,
      warn the user that it will be deleted
      & redirect to the portfolio page
    */
  }

  function returnHoldingFromPortfolioByCoin(coin: ICoin) {
    const holding = getHoldingInPortfolioByCoin.value(coin);
    if (!holding) {
      throw new Error(`Coin with id ${coin.id} not found in portfolio`);
    }
    return holding;
  }

  async function fetchHistoricalDataByCoinId(coinId: ICoin['id']) {
    const { data, status } = await fetchHelper<ICoinHistoricalData>(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      body: {
        vs_currency: 'usd',
        interval: 'daily',
        days: 3,
        precision: 2,
        x_cg_demo_api_key: mainConfig.COINGECKO_API_KEY,
      },
    });
    if (status !== 200) {
      toastStore.addToast({
        text: $i18n.t('errors.fetchHistoricalData'),
      });
      throw new Error(`[PortfolioStore] Failed to fetch historical data, status: ${status}`);
    }
    return { data, status };
  }

  async function lazyFetchPortfolioHistoricalData() {
    for (const holding of portfolio.value) {
      const { data } = await fetchHistoricalDataByCoinId(holding.coin.id);
      holding.historicalData = data;
    }
  }

  return {
    // state
    portfolio: skipHydrate(portfolio),
    isHistoricalDataLoading,
    // getters
    getHoldingsSummary,
    portfolioSummary,
    portfolioSummaryPercentage,
    // actions
    addHolding,
    removeHolding,
    updateHolding,
  };
});
