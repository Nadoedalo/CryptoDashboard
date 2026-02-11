<template>
  <v-container
    class="portfolioSummary d-flex flex-column h-100"
  >
    <template v-if="portfolioStore.portfolio.length">
      <h4
        class="text-center"
      >
        {{ $t('portfolioSummary.title') }}
      </h4>
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
              {{ portfolioStore.portfolioSummary.totalEvaluation.toFixed(2) }}$
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              {{ $t('portfolioSummary.totalInvestment') }}
            </v-col>
            <v-col>
              {{ portfolioStore.portfolioSummary.totalInvestment.toFixed(2) }}$
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              {{ portfolioStore.portfolioSummary.totalDiff > 0 ? $t('portfolioSummary.totalProfit') : $t('portfolioSummary.totalLoss') }}
            </v-col>
            <v-col
              :class="{
                profitLoss: portfolioStore.portfolioSummary.totalDiff < 0,
                profitable: portfolioStore.portfolioSummary.totalDiff > 0,
              }"
            >
              {{ portfolioStore.portfolioSummary.totalDiff.toFixed(2) }}$ ({{ portfolioStore.portfolioSummaryPercentage.toFixed(2) }}%)
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              {{ $t('portfolioSummary.bestAsset') }}
            </v-col>
            <v-col
              class="bestAsset"
              :class="{
                profitLoss: (portfolioStore.portfolioSummary.bestAsset?.difference || 0) <= 0,
                profitable: (portfolioStore.portfolioSummary.bestAsset?.difference || 0) > 0,
              }"
            >
              <SharedCoinWithLogo
                :image-src=" portfolioStore.portfolioSummary.bestAsset?.coin?.image || ''"
                :alt-text=" portfolioStore.portfolioSummary.bestAsset?.coin?.symbol || ''"
                :title="getAssetTitle(portfolioStore.portfolioSummary.bestAsset)"
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
                profitLoss: (portfolioStore.portfolioSummary.worstAsset?.difference || 0) <= 0,
                profitable: (portfolioStore.portfolioSummary.worstAsset?.difference || 0) > 0,
              }"
            >
              <SharedCoinWithLogo
                :image-src=" portfolioStore.portfolioSummary.worstAsset?.coin?.image || ''"
                :alt-text=" portfolioStore.portfolioSummary.worstAsset?.coin?.symbol || ''"
                :title="getAssetTitle(portfolioStore.portfolioSummary.worstAsset)"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <SharedNoHoldings
      v-else-if="!coinStore.isCoinArrLoading"
    />
    <v-skeleton-loader
      v-else
      class="skeletonLoader ma-2"
      type="table-row@5"
    />
  </v-container>
</template>

<script setup lang="ts">
import { type IPortfolioSummary, usePortfolioStore } from '@stores/PortfolioStore';
import { useCoinStore } from '@stores/CoinStore';

const coinStore = useCoinStore();
const portfolioStore = usePortfolioStore();

const getAssetTitle = computed(() => (asset: IPortfolioSummary['worstAsset'] | IPortfolioSummary['bestAsset']) => {
  const assetDifference = asset.difference || 0;
  const prefix = assetDifference > 0 ? '+' : '';
  const difference = prefix + assetDifference.toFixed(2);
  return `${asset.coin?.name}  ${difference} (${asset.percentage.toFixed(2)}%)`;
});
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
