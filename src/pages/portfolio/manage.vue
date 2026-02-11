<template>
  <v-container
    class="editPortfolio"
  >
    <template v-if="portfolioStore.portfolio.length">
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
        :items="portfolioStore.getHoldingsSummary"
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
    </template>
    <SharedNoHoldings
      v-else-if="!coinStore.isCoinArrLoading"
    />
    <v-row
      v-else
      justify="center"
      align="center"
      class="flex-grow-1"
    >
      <v-skeleton-loader type="heading, table-row@10" />
    </v-row>
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
</template>

<script setup lang="ts">
import { type IHoldingSummary, usePortfolioStore } from '@stores/PortfolioStore';

import { useCoinStore } from '@stores/CoinStore';

import { useI18n } from 'vue-i18n';

interface IHoldingTableHeader {
  title: string;
  key: string;
  sortable?: boolean;
}

const { t } = useI18n();
const coinStore = useCoinStore();
const portfolioStore = usePortfolioStore();
const searchQuery = ref<string>('');
const isEditDialogOpen = ref(false);
const selectedHolding = ref<IHoldingSummary | null>(null);

const isProfitable = computed(() => (holding: IHoldingSummary) => holding.difference > 0);

const getHeaders = computed(() => {
  const res = Object.keys(portfolioStore.getHoldingsSummary?.[0] || {}).reduce((memo, key) => {
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

function editHolding(holding: IHoldingSummary) {
  selectedHolding.value = holding;
  isEditDialogOpen.value = true;
}
</script>

<style lang="scss">
@use "@imports/colors.module";
.editPortfolio {
  max-width: 100% !important;
  .profitLoss {
    color: colors.$red;
  }
  .profitable {
    color: colors.$green;
  }
}
</style>
