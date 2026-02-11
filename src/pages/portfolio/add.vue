<template>
  <v-container
    class="addToPortfolio"
    rel="addToPortfolioRef"
  >
    <v-form
      ref="addToPortfolioForm"
      @submit.prevent="handleSubmit"
    >
      <v-card class="overflow-visible">
        <v-card-title>{{ $t('addToPortfolio.title') }}</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="selectedCoin"
            :loading="coinStore.isCoinArrLoading"
            :items="coinsNotInPortfolio"
            density="compact"
            item-title="name"
            item-value="id"
            :filter-keys="['value', 'raw.symbol', 'title']"
            autocomplete="suppress"
            :menu-props="{ attach: addToPortfolioRef as Element, contained: true }"
            class="selectCoinAutocomplete position-relative"
          >
            <template #selection="{ item: coinItem }">
              <v-list-item
                :title="coinItem.raw.name"
                class="pl-0"
              >
                <template
                  v-if="coinItem.raw.image"
                  #prepend
                >
                  <client-only>
                    <v-img
                      :src="coinItem.raw.image"
                      :alt="coinItem.raw.symbol"
                      eager
                      height="2em"
                      width="2em"
                      class="mr-2"
                    />
                  </client-only>
                </template>
              </v-list-item>
            </template>
            <template #item="{ props: coinItemProps, item: coinItem }">
              <v-list-item
                v-bind="coinItemProps"
                :title="coinItem.raw.name"
              >
                <template
                  v-if="coinItem.raw.image"
                  #prepend
                >
                  <client-only>
                    <v-img
                      :src="coinItem.raw.image"
                      :alt="coinItem.raw.symbol"
                      eager
                      height="2em"
                      width="2em"
                      class="mr-2"
                    />
                  </client-only>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
          <v-number-input
            v-model="quantity"
            control-variant="hidden"
            :min="0"
            :precision="null"
            name="quantity"
            :label="t('addToPortfolio.quantity')"
          />
          <v-number-input
            v-model="price"
            control-variant="hidden"
            :min="0"
            :precision="null"
            name="price"
            :label="t('addToPortfolio.price')"
          />
        </v-card-text>
        <v-card-actions class="align-end justify-end">
          <v-btn
            color="primary"
            variant="tonal"
            type="submit"
          >
            {{ $t('addToPortfolio.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { type ICoinListType, useCoinStore } from '@stores/CoinStore';
import { usePortfolioStore } from '@stores/PortfolioStore';
import { useToastNotificationStore } from '@stores/ToastNotificationStore/ToastNotificationStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const addToPortfolioRef = ref<HTMLElement | null>(null);
const coinStore = useCoinStore();
const portfolioStore = usePortfolioStore();
const toastStore = useToastNotificationStore();
const selectedCoin = ref<ICoinListType['id'] | null>();
const quantity = ref<number | null>(null);
const price = ref<number | null>(null);
const addToPortfolioForm = ref<HTMLFormElement | null>(null);

const listCoin = computed(() => selectedCoin.value && coinStore.getCoinById(selectedCoin.value));
// we obviously can do better, but then it quickly becomes complicated with price tracking & revenue,
// also it's not that obvious why coins disappear from the list
const coinsNotInPortfolio = computed(() => coinStore.coinArr.filter(coin => !portfolioStore.portfolio.some(holding => holding.coin.id === coin.id)));

watch(selectedCoin, () => {
  if (listCoin.value) {
    price.value = listCoin.value.current_price;
  }
});

function handleSubmit() {
  if (!listCoin.value || !quantity.value || !price.value) {
    toastStore.addToast({
      text: t('addToPortfolio.validationError'),
    });
    return;
  }
  portfolioStore.addHolding({
    coin: {
      id: listCoin.value.id,
      symbol: listCoin.value.symbol,
      name: listCoin.value.name,
    },
    quantity: quantity.value,
    price: price.value,
  });
  addToPortfolioForm.value?.reset();
  toastStore.addToast({
    text: t('addToPortfolio.successAdd'),
    type: 'success',
  });
}
</script>

<style lang="scss">
.addToPortfolio {
  .selectCoinAutocomplete {
    z-index: 10;
  }
}
</style>
