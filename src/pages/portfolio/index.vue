<template>
  <v-container
    class="portfolioSummary"
  >
    <h2 class="text-center">
      {{ $t('portfolioSummary.title') }}
    </h2>
    <v-card
      class="pa-2"
      :loading="coinStore.isCoinArrLoading"
    >
      <template #loader>
        <v-skeleton-loader
          v-if="coinStore.isCoinArrLoading"
          class="skeletonLoader"
          type="table-row@5"
        />
      </template>
      <v-card-text
        v-if="!coinStore.isCoinArrLoading"
        class="portfolioSummaryContent"
      >
        <v-row>
          <v-col>
            {{ $t('portfolioSummary.totalEvaluation') }}
          </v-col>
          <v-col>
            {{ portfolioSummary.totalEvaluation.toFixed(2) }}$
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            {{ $t('portfolioSummary.totalInvestment') }}
          </v-col>
          <v-col>
            {{ portfolioSummary.totalInvestment.toFixed(2) }}$
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            {{ portfolioSummary.totalDiff > 0 ? $t('portfolioSummary.totalProfit') : $t('portfolioSummary.totalLoss') }}
          </v-col>
          <v-col
            :class="{
              profitLoss: portfolioSummary.totalDiff < 0,
              profitable: portfolioSummary.totalDiff > 0,
            }"
          >
            {{ portfolioSummary.totalDiff.toFixed(2) }}$ ({{ totalPercentage.toFixed(2) }}%)
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            {{ $t('portfolioSummary.bestAsset') }}
          </v-col>
          <v-col
            class="bestAsset"
            :class="{
              profitLoss: portfolioSummary.bestAsset?.difference <= 0,
              profitable: portfolioSummary.bestAsset?.difference > 0,
            }"
          >
            <SharedCoinWithLogo
              :image-src="portfolioSummary.bestAsset?.coin?.image || ''"
              :alt-text="portfolioSummary.bestAsset?.coin?.symbol || ''"
              :title="`${portfolioSummary.bestAsset?.coin?.name} ${portfolioSummary.bestAsset?.difference > 0 ? '+' : ''}${portfolioSummary.bestAsset?.difference.toFixed(2)} (${portfolioSummary.bestAsset?.percentage.toFixed(2)}%)`"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            {{ $t('portfolioSummary.worstAsset') }}
          </v-col>
          <v-col
            class="worstAsset"
            :class="{
              profitLoss: portfolioSummary.worstAsset?.difference <= 0,
              profitable: portfolioSummary.worstAsset?.difference > 0,
            }"
          >
            <SharedCoinWithLogo
              :image-src="portfolioSummary.worstAsset?.coin?.image || ''"
              :alt-text="portfolioSummary.worstAsset?.coin?.symbol || ''"
              :title="`${portfolioSummary.worstAsset?.coin?.name} ${portfolioSummary.worstAsset?.difference > 0 ? '+' : ''}${portfolioSummary.worstAsset?.difference.toFixed(2)} (${portfolioSummary.worstAsset?.percentage.toFixed(2)}%)`"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '@stores/PortfolioStore';
import { useCoinStore } from '@stores/CoinStore';
import type { ICoinListType } from '@stores/CoinStore';

const coinStore = useCoinStore();
const portfolioStore = usePortfolioStore();

const portfolioSummary = computed(() => {
  return portfolioStore.portfolio.reduce((memo, holding) => {
    const coinList = coinStore.getCoinById(holding.coin.id);
    if (!coinList) return memo;
    const coinCurrentPrice = coinList.current_price || 0;
    if (coinCurrentPrice) {
      memo.totalEvaluation += holding.quantity * coinCurrentPrice;
      memo.totalInvestment += holding.quantity * holding.price;
      const difference = (coinCurrentPrice - holding.price) * holding.quantity;
      memo.totalDiff += difference;
      const percentage = ((coinCurrentPrice - holding.price) / holding.price) * 100;
      if (difference > memo.bestAsset.difference) {
        memo.bestAsset = { coin: coinList, percentage, difference };
      }
      if (difference < memo.worstAsset.difference) {
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
      difference: 0,
    },
    worstAsset: {
      coin: null,
      percentage: 0,
      difference: 0,
    },
  } as {
    totalEvaluation: number;
    totalInvestment: number;
    totalDiff: number;
    bestAsset: { coin: ICoinListType | null; percentage: number; difference: number; };
    worstAsset: { coin: ICoinListType | null; percentage: number; difference: number; };
  });
});

const totalPercentage = computed(() => (portfolioSummary.value.totalDiff / portfolioSummary.value.totalInvestment) * 100);
</script>

<style lang="scss">
@use "@imports/colors.module";
.portfolioSummary {
  .v-card {
    width: min(100%, 50em);
    margin: 0 auto;
    min-height: 26em;
    .skeletonLoader {
      .v-skeleton-loader__text {
        height: 3rem;
      }
    }
    .portfolioSummaryContent {
      font-size: 2rem;
      width: 100%;
      overflow: auto;
      > .v-row {
        &:nth-child(odd) {
          background-color: colors.$quarter-black;
        }
        > .v-col {
          text-align: right;
          &:nth-child(1) {
            flex-grow: 0;
            min-width: 7em;
          }
          &:nth-child(2) {
            text-align: left;
          }
        }
      }
    }

  }
  .profitLoss {
    color: colors.$red;
  }
  .profitable {
    color: colors.$green;
  }
}
</style>
