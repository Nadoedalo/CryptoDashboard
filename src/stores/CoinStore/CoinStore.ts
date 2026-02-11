import type { ICoinListType } from '.';
import { fetchHelper } from '~/utils/fetchHelper';
import { mainConfig } from '~/config/main';
import { useToastNotificationStore } from '@/stores/ToastNotificationStore/ToastNotificationStore';

export const useCoinStore = defineStore('CoinStore', () => {
  const toastStore = useToastNotificationStore();
  const { $i18n } = useNuxtApp();
  /**
   * State section
   * */
  const coinArr = ref<ICoinListType[]>([]);
  const isCoinArrLoading = ref(true);
  /**
   * Startup section
   * */
  fetchCoinList().finally(autoRefreshCoinList);
  /**
   * Watchers section, examples:
   * someStore.$subscribe
   * someStore.$onAction
   * */

  /**
   * Getters section
   * */
  const getCoinCurrentPriceById = computed(() => (coinId: ICoinListType['id']) => {
    return coinArr.value.find(({ id }) => id === coinId)?.current_price;
  });

  const getCoinById = computed(() => (coinId: ICoinListType['id']) => {
    return coinArr.value.find(({ id }) => id === coinId) ?? null;
  });

  /**
   * Actions section
   * */
  async function fetchCoinList(): Promise<{ data: ICoinListType[]; status: number; }> {
    isCoinArrLoading.value = true;
    try {
      const { data, status } = await fetchHelper<ICoinListType[]>('https://api.coingecko.com/api/v3/coins/markets', {
        body: {
          vs_currency: 'usd',
          price_change_percentage: '24h',
          order: 'market_cap_desc',
          include_tokens: 'top',
          per_page: 250,
          precision: 2,
          x_cg_demo_api_key: mainConfig.COINGECKO_API_KEY,
        },
      });

      if (status !== 200) {
        toastStore.addToast({
          text: $i18n.t('errors.fetchCoinList'),
        });
        throw new Error(`[CoinStore] Failed to fetch coin list, status: ${status}`);
      }
      coinArr.value = data;
      return { data, status };
    } finally {
      isCoinArrLoading.value = false;
    }
  }

  function autoRefreshCoinList() {
    setTimeout(() => fetchCoinList().finally(autoRefreshCoinList), 1000 * 60);
  }

  return {
    // state
    coinArr,
    isCoinArrLoading,
    // getters
    getCoinCurrentPriceById,
    getCoinById,
    // actions
    fetchCoinList,
  };
});
