<template>
  <v-container class="cryptoDashboard h-100 d-flex ga-2 flex-column">
    <template v-if="portfolioStore.portfolio.length">
      <v-card class="distributionCard">
        <v-card-title>{{ $t('dashboard.distributionTitle') }}</v-card-title>
        <v-card-text>
          <client-only>
            <WidgetPortfolioAllocation />
          </client-only>
        </v-card-text>
      </v-card>
      <v-card class="historicalCard">
        <v-card-title>{{ $t('dashboard.historicalEvaluationTitle') }}</v-card-title>
        <v-card-text>
          <client-only>
            <WidgetPerformanceChart />
          </client-only>
        </v-card-text>
      </v-card>
    </template>
    <SharedNoHoldings
      v-else-if="!coinStore.isCoinArrLoading && !portfolioStore.isHistoricalDataLoading"
    />
    <v-row
      v-else
      class="h-100 d-flex justify-center align-center"
    >
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '@stores/PortfolioStore';
import { useCoinStore } from '@stores/CoinStore';

definePageMeta({
  alias: ['/dashboard'],
  middleware: [
    (to) => {
      if (to.path === '/') {
        return navigateTo('/dashboard', { replace: true });
      }
    },
  ],
});
const portfolioStore = usePortfolioStore();
const coinStore = useCoinStore();
</script>

<style lang="scss">
.cryptoDashboard {
  .distributionCard, .historicalCard {
    min-height: 30em;
  }
}
</style>
