<template>
  <client-only>
    <v-container
      class="editPortfolio"
    >
      <div class="d-flex justify-space-between align-center pb-2">
        <h4>{{ $t('managePortfolio.title') }}</h4>
        <v-btn
          prepend-icon="mdi-refresh"
          :loading="coinStore.isCoinArrLoading"
          @click="coinStore.fetchCoinList()"
        >
          {{ $t('managePortfolio.refresh') }}
        </v-btn>
      </div>
      <v-text-field
        v-model="searchQuery"
        label="Search holdings by coin symbol, name or id"
        density="compact"
        class="pb-0"
        hide-details
      />
      <v-data-table
        :filter-keys="['coin.id', 'coin.symbol', 'coin.name']"
        :headers="getHeaders"
        :items="getHoldings"
        :loading="coinStore.isCoinArrLoading"
        :search="searchQuery"
        class="pt-0"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@7" />
        </template>
        <template #[`item.coin`]="{ item: holding }">
          <SharedCoinWithLogo
            :image-src="holding.coin.image"
            :alt-text="holding.coin.symbol"
            :title="holding.coin.name"
          />
        </template>
        <template #[`item.actions`]="{ item: holding }">
          <div class="d-flex d-flex-row gap-2">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editHolding(holding)"
            />
          </div>
        </template>
        <template #[`item.price`]="{ item: holding }">
          <span>{{ holding.price }}$</span>
        </template>
        <template #[`item.evaluation`]="{ item: holding }">
          <span>{{ holding.evaluation }}$</span>
        </template>
        <template #[`item.difference`]="{ item: holding }">
          <span
            :class="{
              profitLoss: !isProfitable(holding),
              profitable: isProfitable(holding),
            }"
          >{{ holding.difference }}$</span>
        </template>
        <template #[`item.percentage`]="{ item: holding }">
          <span
            :class="{
              profitLoss: !isProfitable(holding),
              profitable: isProfitable(holding),
            }"
          >{{ holding.percentage }}%</span>
        </template>
        <template #[`item.priceChangeAbsolute24`]="{ item: holding }">
          <span
            :class="{
              profitLoss: holding.priceChangeAbsolute24 <= 0,
              profitable: holding.priceChangeAbsolute24 > 0,
            }"
          >{{ holding.priceChangeAbsolute24.toFixed(2) }}$</span>
        </template>
        <template #[`item.priceChangePercentage24`]="{ item: holding }">
          <span
            :class="{
              profitLoss: holding.priceChangePercentage24 <= 0,
              profitable: holding.priceChangePercentage24 > 0,
            }"
          >{{ holding.priceChangePercentage24.toFixed(2) }}%</span>
        </template>
      </v-data-table>
      <v-dialog
        v-model="isEditDialogOpen"
        max-width="500"
      >
        <PortfolioHoldingCard
          v-if="selectedHolding"
          :holding="selectedHolding"
          @updated="() => { isEditDialogOpen = false; selectedHolding = null; }"
          @deleted="() => { isEditDialogOpen = false; selectedHolding = null; }"
        />
      </v-dialog>
    </v-container>
  </client-only>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '@stores/PortfolioStore';
import { type ICoinListType, useCoinStore } from '@stores/CoinStore';
import type { ICoin } from '@types';
import type { IHolding } from '@stores/PortfolioStore';
import { useI18n } from 'vue-i18n';

interface IHoldingTableHeader {
  title: string;
  key: string;
  sortable?: boolean;
}
interface IHoldingTableRow {
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

const { t } = useI18n();
const coinStore = useCoinStore();
const portfolioStore = usePortfolioStore();
const searchQuery = ref<string>('');
const isEditDialogOpen = ref(false);
const selectedHolding = ref<IHolding | null>(null);

const getListCoinById = computed(() => (coinId: ICoin['id']) => coinStore.getCoinById(coinId));
const getInvestmentAmount = computed(() => (holding: IHolding) => holding.quantity * holding.price);
const getCurrentValueAmount = computed(() => (holding: IHolding) => holding.quantity * (getListCoinById.value(holding!.coin!.id)?.current_price || 0));
const totalDifference = computed(() => (holding: IHolding) => getCurrentValueAmount.value(holding) - getInvestmentAmount.value(holding));
const percentageDifference = computed(() => (holding: IHolding) => (totalDifference.value(holding) / getInvestmentAmount.value(holding)) * 100);
const isProfitable = computed(() => (holding: IHolding) => totalDifference.value(holding) > 0);

const getHoldings = computed(() => {
  return portfolioStore.portfolio.reduce((memo, holding) => {
    const coin = getListCoinById.value(holding.coin?.id);
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
        evaluation: +getCurrentValueAmount.value(holding).toFixed(2),
        difference: +totalDifference.value(holding).toFixed(2),
        percentage: +percentageDifference.value(holding).toFixed(2),
        priceChangeAbsolute24: coin.price_change_24h,
        priceChangePercentage24: coin.price_change_percentage_24h,
        high24: coin.high_24h,
        low24: coin.low_24h,
      });
    }
    return memo;
  }, [] as IHoldingTableRow[]);
});

const getHeaders = computed(() => {
  const res = Object.keys(getHoldings.value?.[0] || {}).reduce((memo, key) => {
    memo.push({
      title: t(`portfolioDataTable.${key}`),
      key,
      sortable: true,
    });
    return memo;
  }, [] as IHoldingTableHeader[]);
  res.push({
    title: '',
    key: 'actions',
    sortable: false,
  });
  return res;
});

function editHolding(holding: IHoldingTableRow) {
  selectedHolding.value = holding;
  isEditDialogOpen.value = true;
}
</script>

<style lang="scss">
@use "@imports/colors.module";
.editPortfolio {
  .profitLoss {
    color: colors.$red;
  }
  .profitable {
    color: colors.$green;
  }
}
</style>
