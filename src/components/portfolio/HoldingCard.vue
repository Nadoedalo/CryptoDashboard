<template>
  <v-card class="holdingCard">
    <v-form @submit.prevent="handleSubmit">
      <v-card-title class="d-flex d-flex-row align-center justify-start ga-2">
        <SharedCoinWithLogo
          :image-src="coinData?.image || ''"
          :alt-text="holding.coin.symbol"
          :title="holding.coin.name"
        />
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>{{ $t('holdingCard.investment') }}</v-col>
          <v-col>{{ investmentAmount.toFixed(2) }}$</v-col>
        </v-row>
        <v-row>
          <v-col>{{ $t('holdingCard.currentValue') }}</v-col>
          <v-col>{{ currentValueAmount.toFixed(2) }}$</v-col>
        </v-row>
        <v-row>
          <v-col>
            {{ $t(isProfitable ? 'holdingCard.totalProfit' : 'holdingCard.totalLoss') }}
          </v-col>
          <v-col
            class="holdingDifference"
            :class="{
              profitLoss: !isProfitable,
              profitable: isProfitable,
            }"
          >
            {{ totalDifference.toFixed(2) }}$ / {{ percentageDifference.toFixed(2) }}%
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-number-input
              v-model="quantity"
              control-variant="hidden"
              :min="0"
              :precision="null"
              name="quantity"
              :label="$t('holdingCard.quantity')"
            />
          </v-col>
          <v-col>
            <v-number-input
              v-model="price"
              control-variant="hidden"
              :min="0"
              :precision="null"
              name="price"
              :label="$t('holdingCard.price')"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn
          color="red"
          variant="text"
          icon="mdi-delete"
          :title="$t('holdingCard.deleteHolding')"
          size="x-large"
          @click="isConfirmDeleteDialogOpen = true"
        />
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-pencil"
          type="submit"
        >
          {{ $t('holdingCard.edit') }}
        </v-btn>
      </v-card-actions>
    </v-form>

    <v-dialog
      v-model="isConfirmDeleteDialogOpen"
      max-width="400"
    >
      <v-card color="red-dark">
        <v-card-title>{{ $t('holdingCard.confirmDeleteTitle') }}</v-card-title>
        <v-card-text>
          <SharedCoinWithLogo
            :image-src="coinData?.image || ''"
            :alt-text="holding.coin.symbol"
            :title="$t('holdingCard.confirmDeleteMessage', { name: holding.coin.name })"
          />
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn
            color="yellow"
            variant="text"
            @click="handleDelete"
          >
            {{ $t('holdingCard.confirmDeleteConfirm') }}
          </v-btn>
          <v-btn
            variant="outlined"
            color="primary"
            @click="isConfirmDeleteDialogOpen = false"
          >
            {{ $t('holdingCard.confirmDeleteCancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '@stores/PortfolioStore';
import { useCoinStore } from '@stores/CoinStore';
import type { IHolding } from '@stores/PortfolioStore';

interface IHoldingCardProps {
  holding: IHolding;
}
const props = defineProps<IHoldingCardProps>();
const portfolioStore = usePortfolioStore();
const coinStore = useCoinStore();
const coinData = computed(() => coinStore.getCoinById(props.holding.coin.id));
const quantity = ref<IHolding['quantity']>(props.holding.quantity);
const price = ref<IHolding['price']>(props.holding.price);
const isConfirmDeleteDialogOpen = ref(false);

const investmentAmount = computed(() => props.holding.quantity * props.holding.price);
const currentValueAmount = computed(() => props.holding.quantity * (coinData.value?.current_price || 0));
const totalDifference = computed(() => currentValueAmount.value - investmentAmount.value);
const percentageDifference = computed(() => (totalDifference.value / investmentAmount.value) * 100);
const isProfitable = computed(() => totalDifference.value > 0);
const emit = defineEmits(['updated', 'deleted']);

function handleSubmit() {
  portfolioStore.updateHolding({
    coin: props.holding.coin,
    price: price.value,
    quantity: quantity.value,
  });
  emit('updated');
}

function handleDelete() {
  portfolioStore.removeHolding(props.holding.coin);
  isConfirmDeleteDialogOpen.value = false;
  emit('deleted');
}
</script>

<style lang="scss">
@use "@imports/colors.module";

.holdingCard {
  .holdingDifference {
    &.profitLoss {
      color: colors.$red;
    }
    &.profitable {
      color: colors.$green;
    }
  }
}
</style>
