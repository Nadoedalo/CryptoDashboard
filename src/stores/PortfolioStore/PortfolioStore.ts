import type { IHolding } from '.';
import type { ICoin } from '@types';
import { useCoinStore } from '@stores/CoinStore';

export const usePortfolioStore = defineStore('PortfolioStore', () => {
  /**
   * State section
   * */
  const portfolio = ref<IHolding[]>([]);
  /**
   * Startup section
   * */
  portfolio.value = (JSON.parse(localStorage.getItem('portfolio') || '') || []) as IHolding[];
  const coinStore = useCoinStore();

  /**
   * Watchers section, examples:
   * someStore.$subscribe
   * someStore.$onAction
   * */
  watch(portfolio, () => {
    // The LocalStorage system can definitely be better, for example, by having a version control or a composable
    localStorage.setItem('portfolio', JSON.stringify(portfolio.value));
  });

  /**
   * Getters section
   * */
  const getHoldingInPortfolioByCoin = computed(() => (coin: ICoin) => {
    return portfolio.value.find(({ coin: { id } }) => id === coin.id);
  });

  const getInitialPortfolioEvaluation = computed(() => {
    return portfolio.value.reduce((acc, { quantity, price }) => acc + quantity * price, 0);
  });

  const getCurrentPortfolioEvaluation = computed(() => {
    return portfolio.value.reduce((acc, { quantity, coin }) => acc + quantity * (coinStore.getCoinCurrentPrice(coin.id) || 0), 0);
  });

  const getTotalDifference = computed(() => {
    const diff = getCurrentPortfolioEvaluation.value - getInitialPortfolioEvaluation.value;
    return {
      absolute: diff,
      percentage: (diff / getInitialPortfolioEvaluation.value * 100) * 100,
    };
  });

  /**
   * Actions section
   * */
  function addHolding(holding: IHolding) {
    portfolio.value.push(holding);
  }

  function removeHolding(coin: ICoin) {
    getHoldingFromPortfolioByCoin(coin);
    portfolio.value = portfolio.value.filter(({ coin: { id } }) => id !== coin.id);
  }

  function updateHolding(holding: IHolding) {
    const portfolioHolding = getHoldingFromPortfolioByCoin(holding.coin);
    portfolioHolding.quantity = holding.quantity;
    portfolioHolding.price = holding.price;
    /*
      technically, if quantity is 0,
      we should remove it from the portfolio,
      warn the user that it will be deleted
      & redirect to the portfolio page
    */
  }

  function getHoldingFromPortfolioByCoin(coin: ICoin) {
    const holding = getHoldingInPortfolioByCoin.value(coin);
    if (!holding) {
      throw new Error(`Coin with id ${coin.id} not found in portfolio`);
    }
    return holding;
  }

  return {
    // state
    portfolio,
    // getters
    getInitialPortfolioEvaluation,
    getCurrentPortfolioEvaluation,
    getTotalDifference,
    // actions
    addHolding,
    removeHolding,
    updateHolding,
  };
});
